import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const {
      call_id,
      status,
      start_time,
      answer_time,
      ring_time,
      call_time,
    } = data;

    // Find call log
    const callLog = await db.vp_call_log.findUnique({
      where: { call_id: call_id },
      include: { user: true },
    });

    if (!callLog) {
      return NextResponse.json(
        { error: 'Call not found' },
        { status: 404 }
      );
    }

    // Calculate cost
    let cost = 0;
    if (status === 'ANSWERED' || status === 'COMPLETED') {
      cost = 3.5; // ₦3.5 per successful call
    }

    // Update call log
    await db.vp_call_log.update({
      where: { call_id: call_id },
      data: {
        status,
        start_time: start_time ? new Date(start_time) : null,
        answer_time: answer_time ? new Date(answer_time) : null,
        ring_time: ring_time,
        duration: call_time,
        cost,
        webhook_sent: true,
      },
    });

    // Deduct balance if call was successful
    if (cost > 0) {
      const balance = await db.vp_credit_balance.findUnique({
        where: { user_id: callLog.user_id },
      });

      const newBalance = (balance?.balance || 0) - cost;

      await db.vp_credit_balance.update({
        where: { user_id: callLog.user_id },
        data: { balance: newBalance },
      });

      await db.vp_transaction.create({
        data: {
          user_id: callLog.user_id,
          type: 'DEBIT',
          amount: cost,
          balance_after: newBalance,
          description: `Voice OTP call - ${call_id}`,
          reference: call_id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}