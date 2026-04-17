import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function normalizePhone(phone: string): string {
  let p = String(phone).replace(/\s/g, '').replace(/^\+/, '');
  if (p.startsWith('0')) p = '234' + p.slice(1);
  else if (!p.startsWith('234')) p = '234' + p;
  return p;
}

export async function POST(req: NextRequest) {
  try {
    // Self-heal: create OTP table if it doesn't exist
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

    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const formattedPhone = normalizePhone(phone);

    // Generate 4-digit OTP
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate any existing unused OTPs for this phone
    await db.$executeRaw`
      UPDATE vp_phone_otp SET used = true WHERE phone = ${formattedPhone} AND used = false;
    `;

    // Store new OTP
    await db.$executeRaw`
      INSERT INTO vp_phone_otp (phone, otp, expires_at) VALUES (${formattedPhone}, ${otp}, ${expiresAt});
    `;

    // Send via VoicePass API (voice call)
    const response = await fetch('https://api.voicepass.skurel.com/send-voice-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.MASTER_KEY,
      },
      body: JSON.stringify({ phone: formattedPhone, otp }),
    });

    const data = await response.json().catch(() => ({}));
    const success = response.ok || data?.call_id != null || data?.status === 'queue';

    if (!success) {
      console.error('VoicePass API error:', response.status, data);
      return NextResponse.json({ error: 'Failed to send verification code. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: 'Verification code sent to your phone' });
  } catch (error: any) {
    console.error('Send phone OTP error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send verification code' }, { status: 500 });
  }
}
