import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';


export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phoneNumber, otp } = await req.json();
    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 });
    }

    // Normalize phone number
    let formattedPhone = String(phoneNumber).replace(/\s/g, '').replace(/^\+/, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '234' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('234')) {
      formattedPhone = '234' + formattedPhone;
    }

    // Fetch user with current balance and api_key
    const dbUser = await db.vp_user.findUnique({
      where: { id: Number(user.id) },
      select: { balance: true, api_key: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const callCost = 3.5; // Fixed cost per call

    // Check sufficient balance
    if ((dbUser.balance ?? 0) < callCost) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 402 });
    }

    // Call external VoicePass API
    const response = await fetch("https://api.voicepass.skurel.com/send-voice-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.MASTER_KEY
      },
      body: JSON.stringify({
        phone: formattedPhone,
        otp: otp
      })
    });

    const data = await response.json().catch(() => ({}));
    const providerSuccess = response.ok || data?.call_id != null || data?.status === 'queue';

    if (!providerSuccess) {
      console.error('VoicePass API error:', response.status, data);
      return NextResponse.json({ error: 'Failed to initiate call via provider' }, { status: 502 });
    }

    const callId = data.call_id || `CID-${Date.now()}`;
    const statusFromProvider = data.status?.toUpperCase() || 'INITIATED';

    const isAnswered = statusFromProvider === 'ANSWERED';
    const isProcessing = ['INITIATED', 'QUEUE', 'RINGING', 'IN-PROGRESS'].includes(statusFromProvider);
    // If it's not answered and not processing, it's a failed/non-billable immediate outcome
    const isImmediateNonBillable = !isAnswered && !isProcessing;

    const finalCost = isImmediateNonBillable ? 0 : callCost;

    // === Deduct balance and create call log atomically ===
    await db.$transaction(async (tx) => {
      // Only deduct the cost from user's balance if it's billable/processing
      let balanceDecrement = finalCost;
      let finalBalanceAfter = dbUser.balance ?? 0;

      if (finalCost > 0) {
        const updatedUser = await tx.vp_user.update({
          where: { id: Number(user.id) },
          data: { balance: { decrement: finalCost } }
        });
        finalBalanceAfter = updatedUser.balance ?? 0;

        // Create a transaction record for the debit
        await tx.vp_transactions.create({
          data: {
            user_id: Number(user.id),
            type: 'DEBIT',
            amount: finalCost,
            balance_before: dbUser.balance ?? 0,
            balance_after: finalBalanceAfter,
            description: `Call initiation charge for call ${callId}`,
            reference: `CALL-${callId}`,
          }
        });
      }

      // Create the call log with the correct final cost
      await tx.vp_call_log.create({
        data: {
          user_id: Number(user.id),
          call_id: callId,
          phone_number: formattedPhone,
          otp: otp,
          status: statusFromProvider.toLowerCase(),
          cost: finalCost,
          created_at: new Date().toISOString(),
          duration: '0',
          answer_time: isAnswered ? new Date().toISOString() : null,
          end_at: isImmediateNonBillable ? new Date().toISOString() : null,
        }
      });
    });

    return NextResponse.json({
      success: true,
      callId,
      message: 'Call initiated successfully'
    });

  } catch (error) {
    console.error('Initiate call error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}