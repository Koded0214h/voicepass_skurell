import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/encryption';
import { createSession, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    // Check if user exists
    const existing = await db.vp_user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await db.vp_user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'client',
      },
    });

    // Create initial balance
    await db.vp_credit_balance.create({
      data: {
        user_id: user.id,
        balance: 0,
      },
    });

    // Create welcome transaction
    await db.vp_transaction.create({
      data: {
        user_id: user.id,
        type: 'CREDIT',
        amount: 100, // Welcome bonus
        balance_after: 100,
        description: 'Welcome bonus',
      },
    });

    // Update balance
    await db.vp_credit_balance.update({
      where: { user_id: user.id },
      data: { balance: 100 },
    });

    // Create session
    const token = createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}