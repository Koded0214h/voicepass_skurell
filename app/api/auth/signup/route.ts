import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/encryption';
import { createSession, setSessionCookie } from '@/lib/auth';
import { generateApiKey } from '@/lib/utils';

function normalizePhone(phone: string): string {
  let p = String(phone).replace(/\s/g, '').replace(/^\+/, '');
  if (p.startsWith('0')) p = '234' + p.slice(1);
  else if (!p.startsWith('234')) p = '234' + p;
  return p;
}

export async function POST(req: NextRequest) {
  try {
    // Self-heal: ensure required columns and OTP table exist
    try {
      await db.$executeRaw`ALTER TABLE vp_user ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`;
      await db.$executeRaw`ALTER TABLE vp_user ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;`;
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS vp_phone_otp (
          id SERIAL PRIMARY KEY,
          phone VARCHAR(50) NOT NULL,
          otp VARCHAR(10) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
    } catch (e) {
      console.warn('Schema patch failed:', e);
    }

    const { email, password, name, phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone number and verification code are required' },
        { status: 400 }
      );
    }

    const formattedPhone = normalizePhone(phone);

    // Verify OTP
    const otpRecords = await db.$queryRaw<
      Array<{ id: number; otp: string; expires_at: Date; used: boolean }>
    >`
      SELECT id, otp, expires_at, used FROM vp_phone_otp
      WHERE phone = ${formattedPhone} AND used = false
      ORDER BY created_at DESC LIMIT 1;
    `;

    if (!otpRecords.length) {
      return NextResponse.json(
        { error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    const otpRecord = otpRecords[0];

    if (new Date() > new Date(otpRecord.expires_at)) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (otpRecord.otp !== String(otp)) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Mark OTP as used
    await db.$executeRaw`UPDATE vp_phone_otp SET used = true WHERE id = ${otpRecord.id};`;

    // Check if email already exists
    const existing = await db.vp_user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.vp_user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: formattedPhone,
        role: 'user',
        user_type: 'prepaid',
        is_active: true,
        api_key: generateApiKey(),
      },
    });

    // Mark phone as verified
    await db.$executeRaw`UPDATE vp_user SET phone_verified = true WHERE id = ${user.id};`;

    // Welcome bonus
    await db.vp_transactions.create({
      data: {
        vp_user: { connect: { id: user.id } },
        type: 'CREDIT',
        amount: 100,
        description: 'Welcome bonus',
      },
    });

    await db.vp_user.update({
      where: { id: user.id },
      data: { balance: 100 },
    });

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

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        user_type: user.user_type,
        company: user.company || '',
        phone: user.phone || '',
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Signup failed' }, { status: 500 });
  }
}
