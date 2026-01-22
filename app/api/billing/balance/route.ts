import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const balance = await db.vp_credit_balance.findUnique({
      where: { user_id: user.id },
    });

    return NextResponse.json({
      balance: balance?.balance || 0,
      lastUpdated: balance?.last_updated,
    });
  } catch (error) {
    console.error('Fetch balance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}