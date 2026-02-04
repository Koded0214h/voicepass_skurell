import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const callId = searchParams.get('callId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const view = searchParams.get('view');
    
    const isAdminView = user.role === 'admin' && view === 'admin';

    // Single call status lookup for modal polling
    if (callId) {
      const whereCall: { call_id: string; user_id?: number } = { call_id: callId };
      if (user.role !== 'admin') whereCall.user_id = Number(user.id);
      const log = await db.vp_call_log.findFirst({
        where: whereCall,
        include: { user: { select: { name: true, email: true } } },
      });
      //console.log('Call log:', log);
      return NextResponse.json({ log: log || null });
    }

    const where: any = {};

    if (!isAdminView) {
      where.user_id = Number(user.id);
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Fetch logs
    const logs = await db.vp_call_log.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { created_at: 'desc' },
    });

    let filteredLogs = logs;

    // Apply search filter if present
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = logs.filter(log =>
        (log.phone_number || '').toLowerCase().includes(searchLower) ||
        (log.call_id || '').toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = filteredLogs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return NextResponse.json({
      logs: paginatedLogs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    });
  } catch (error) {
    console.error('Logs error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}