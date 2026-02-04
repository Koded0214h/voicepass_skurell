import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/encryption';
import { createSession, setSessionCookie } from '@/lib/auth';
import { generateApiKey } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    // Self-healing: Ensure is_active column exists
    try {
      await db.$executeRaw`ALTER TABLE vp_user ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`;
    } catch (e) {
      console.warn("Schema patch failed (is_active):", e);
    }

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

    // Create user with generated API key
    const user = await db.vp_user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'client',
        is_active: true,
        api_key: generateApiKey(),
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
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
