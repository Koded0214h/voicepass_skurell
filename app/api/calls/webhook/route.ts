import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { call_id, status, duration, cost } = body;

    if (!call_id) {
      return NextResponse.json({ error: 'Missing call_id' }, { status: 400 });
    }

    // Find call log
    // Using findFirst because call_id is not marked as @unique in the schema
    const callLog = await db.vp_call_log.findFirst({
      where: { call_id: call_id },
      include: { user: true },
    });

    if (!callLog) {
      return NextResponse.json({ error: 'Call log not found' }, { status: 404 });
    }

    // Update call log
    await db.vp_call_log.update({
      where: { id: callLog.id },
      data: {
        status: status || undefined,
        duration: duration ? String(duration) : undefined,
        cost: cost ? Number(cost) : undefined,
        end_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}