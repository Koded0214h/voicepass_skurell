import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Update user balance directly on vp_user table
    const updatedUser = await db.vp_user.update({
      where: { id: Number(user.id) },
      data: {
        balance: { increment: amount },
      },
    });

    // Create transaction record
    await db.vp_transactions.create({
      data: {
        vp_user: {
          connect: { id: Number(user.id) },
        },
        type: 'CREDIT',
        amount: amount,
        description: 'Balance Top-up',
        reference: `TOPUP-${Date.now()}`,
      },
    });

    return NextResponse.json({ success: true, balance: updatedUser.balance });
  } catch (error) {
    console.error('Topup error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}