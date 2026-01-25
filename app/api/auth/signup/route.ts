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

    // Create welcome transaction
    await db.vp_transactions.create({
      data: {
        vp_user: {
          connect: { id: user.id },
        },
        type: 'CREDIT',
        amount: 100, // Welcome bonus
        description: 'Welcome bonus',
      },
    });

    // Update balance
    await db.vp_user.update({
      where: { id: user.id },
      data: { balance: 100 },
    });

    // Create session
    const token = createSession({
      id: user.id.toString(),
      email: user.email!,
      name: user.name || '',
      role: user.role || '',
      company: user.company || '',
      phone: user.phone || '',
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company || '',
        phone: user.phone || '',
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
