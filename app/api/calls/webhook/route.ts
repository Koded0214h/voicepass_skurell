import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { call_id, status, duration, cost } = body;

    if (!call_id) {
      return NextResponse.json({ error: 'Missing call_id' }, { status: 400 });
    }

    // Find the call log (call_id is not unique, so use findFirst)
    const callLog = await db.vp_call_log.findFirst({
      where: { call_id: call_id },
      include: { user: true },
    });

    if (!callLog) {
      return NextResponse.json({ error: 'Call log not found' }, { status: 404 });
    }

    // Normalize status for comparison (lowercase, underscores to spaces)
    const normalizedStatus = (status || '').toLowerCase().replace(/_/g, ' ');

    // A call is only definitively non-billable if it's final and not answered
    const isAnswered = normalizedStatus === 'answered' || normalizedStatus === 'completed';
    const pendingStatuses = ['queue', 'ringing', 'initiated', 'in-progress', 'in progress'];
    const isPending = pendingStatuses.includes(normalizedStatus);

    const isNonBillable = !isAnswered && !isPending;

    // Determine final cost:
    // - If non‑billable -> 0
    // - Otherwise use the cost from webhook (if provided) or keep the existing one
    let finalCost = callLog.cost ?? 0; // default to current cost or 0 if null
    if (isNonBillable) {
      finalCost = 0;
    } else if (cost !== undefined) {
      finalCost = Number(cost);
    }

    // === Update call log and handle refund if needed ===
    await db.$transaction(async (tx) => {
      // If the call is non‑billable and the log still has a positive cost, refund the user
      if (isNonBillable && callLog.cost && callLog.cost > 0 && callLog.user_id) {
        const refundAmount = callLog.cost; // guaranteed >0 and not null

        // Increase user's balance
        const updatedUser = await tx.vp_user.update({
          where: { id: callLog.user_id },
          data: {
            balance: { increment: refundAmount }
          }
        });

        // Create a credit transaction record
        await tx.vp_transactions.create({
          data: {
            user_id: callLog.user_id,
            type: 'CREDIT',
            amount: refundAmount,
            balance_before: (updatedUser.balance ?? 0) - refundAmount,
            balance_after: updatedUser.balance ?? 0,
            description: `Refund for unanswered call ${call_id} (${normalizedStatus})`,
            reference: `REFUND-${call_id}`,
          }
        });
      }

      // Always update the call log with the new data
      await tx.vp_call_log.update({
        where: { id: callLog.id },
        data: {
          status: status || undefined,
          duration: duration ? String(duration) : undefined,
          cost: finalCost,
          end_at: new Date().toISOString(),
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}