import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/encryption';
import { createSession, setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // Self-healing: Ensure critical columns exist
    try {
      await db.$executeRaw`ALTER TABLE "vp_user" ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`;
      await db.$executeRaw`ALTER TABLE "vp_user" ADD COLUMN IF NOT EXISTS "user_type" VARCHAR(50) DEFAULT 'prepaid';`;
    } catch (e) {
      console.warn("Schema patch failed:", e);
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await db.vp_user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createSession({
      id: user.id.toString(),
      email: user.email!,
      name: user.name || '',
      role: user.role || 'user',
      user_type: user.user_type || 'prepaid',
      company: user.company || '',
      phone: user.phone || '',
    });

    await setSessionCookie(token);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}