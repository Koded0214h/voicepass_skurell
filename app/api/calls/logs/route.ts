import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import { requireAuth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build filter
    const where: Prisma.vp_call_logWhereInput = { user_id: user.id };
    if (status) where.status = status;

    // Get logs
    const [logs, total] = await Promise.all([
      db.vp_call_log.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      db.vp_call_log.count({ where }),
    ]);

    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
    const IS_ENCRYPTION_CONFIGURED = ENCRYPTION_KEY && ENCRYPTION_KEY !== 'your-32-character-secret-key!!';

    // Decrypt phone numbers for display
    const decryptedLogs = logs.map(log => ({
      ...log,
      phone_number: IS_ENCRYPTION_CONFIGURED ? decrypt(log.phone_number || '') : log.phone_number,
      otp: undefined, // Never expose OTP
    }));

    // Filter by search if provided
    let filteredLogs = decryptedLogs;
    if (search) {
      filteredLogs = decryptedLogs.filter(log =>
        log.phone_number.includes(search) || log.call_id.includes(search)
      );
    }

    return NextResponse.json({
      logs: filteredLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}