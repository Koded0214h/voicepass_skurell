import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { amount } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Minimum top-up amount is ₦100' },
        { status: 400 }
      );
    }

    // Get current balance
    const balance = await db.vp_credit_balance.findUnique({
      where: { user_id: user.id },
    });

    const currentBalance = balance?.balance || 0;
    const newBalance = currentBalance + amount;

    // Update balance
    await db.vp_credit_balance.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        balance: newBalance,
      },
      update: {
        balance: newBalance,
      },
    });

    // Create transaction record
    await db.vp_transaction.create({
      data: {
        user_id: user.id,
        type: 'CREDIT',
        amount,
        balance_after: newBalance,
        description: `Credit top-up`,
        reference: `TOP_${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      balance: newBalance,
      amount,
    });
  } catch (error: any) {
    console.error('Top-up error:', error);
    return NextResponse.json(
      { error: error.message || 'Top-up failed' },
      { status: 500 }
    );
  }
}