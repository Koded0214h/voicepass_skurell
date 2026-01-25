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

    // Check balance directly on vp_user
    const dbUser = await db.vp_user.findUnique({
      where: { id: Number(user.id) },
      select: { balance: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const callCost = 10.0; // Fixed cost per call for now

    if ((dbUser.balance || 0) < callCost) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 402 });
    }

    // Deduct balance
    const updatedUser = await db.vp_user.update({
      where: { id: Number(user.id) },
      data: {
        balance: { decrement: callCost }
      }
    });

    // Create transaction record
    await db.vp_transactions.create({
      data: {
        vp_user: {
          connect: { id: Number(user.id) }
        },
        type: 'DEBIT',
        amount: callCost,
        description: `Voice OTP to ${phoneNumber}`,
        reference: `CALL-${Date.now()}`,
      }
    });

    // Create call log
    const callLog = await db.vp_call_log.create({
      data: {
        user_id: Number(user.id),
        call_id: `CID-${Date.now()}`,
        phone_number: phoneNumber,
        otp: otp,
        status: 'INITIATED',
        cost: callCost,
        created_at: new Date().toISOString(),
        duration: '0',
      }
    });

    return NextResponse.json({ 
      success: true, 
      callId: callLog.call_id,
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