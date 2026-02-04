import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phoneNumber, otp } = await req.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 });
    }

    // Normalize: remove + and spaces; 080... → 23480...; +234... → 234...
    let formattedPhone = String(phoneNumber).replace(/\s/g, '').replace(/^\+/, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '234' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('234')) {
      formattedPhone = '234' + formattedPhone;
    }

    // Check balance directly on vp_user
    const dbUser = await db.vp_user.findUnique({
      where: { id: Number(user.id) },
      select: { balance: true, api_key: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const callCost = 3.5; // Fixed cost per call for now

    if ((dbUser.balance || 0) < callCost) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 402 });
    }

    // Call external VoicePass API
    const response = await fetch("https://api.voicepass.skurel.com/send-voice-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + dbUser.api_key
      },
      body: JSON.stringify({
        phone: formattedPhone,
        otp: otp
      })
    });
    console.log('VoicePass API response:', response);
    console.log('VoicePass API request headers:', {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + dbUser.api_key,
      phone: formattedPhone,
      otp: otp
    });
    const data = await response.json().catch(() => ({}));
    // Call may succeed even if provider returns non-2xx; treat as success if we got a call_id or explicit success
    const providerSuccess = response.ok || data?.call_id != null || data?.status === 'queue';

    if (!providerSuccess) {
      console.error('VoicePass API error:', response.status, data);
      return NextResponse.json({ error: 'Failed to initiate call via provider' }, { status: 502 });
    }

    // Create call log so modal can poll status (balance/transactions handled by backend)
    const callId = data.call_id || `CID-${Date.now()}`;
    /*await db.vp_call_log.create({
      data: {
        user_id: Number(user.id),
        call_id: callId,
        phone_number: formattedPhone,
        otp: otp,
        status: (data.status && String(data.status).toUpperCase()) || 'INITIATED',
        cost: callCost,
        created_at: new Date().toISOString(),
        duration: '0',
      }
    });
    */
    return NextResponse.json({
      success: true,
      callId,
      message: 'Call initiated successfully'
    });

  } catch (error) {
    console.error('Initiate call error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}