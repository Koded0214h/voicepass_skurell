import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { encrypt } from '@/lib/encryption';
import { requireAuth } from '@/lib/auth';
import axios from 'axios';

const VOICEPASS_API = process.env.VOICEPASS_API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { phoneNumber } = await req.json();

    // Check balance
    const balance = await db.vp_credit_balance.findUnique({
      where: { user_id: user.id },
    });

    if (!balance || balance.balance < 3.5) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Call VoicePass API
    const response = await axios.post(`${VOICEPASS_API}/send-voice-otp`, {
      phone_number: phoneNumber,
      otp: otp,
    });

    const callId = response.data.call_id || `call_${Date.now()}`;

    // Create call log
    await db.vp_call_log.create({
      data: {
        user_id: user.id,
        call_id: callId,
        phone_number: encrypt(phoneNumber),
        otp: encrypt(otp),
        status: 'INITIATED',
        cost: 0, // Will be updated on webhook
      },
    });

    return NextResponse.json({
      success: true,
      callId,
      message: 'OTP call initiated',
    });
  } catch (error: unknown) {
    console.error('Call initiation error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to initiate call' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
}