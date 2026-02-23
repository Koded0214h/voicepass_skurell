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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
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

    // Date filtering
    // Since created_at in schema is String? @db.VarChar(100), we need to be careful.
    // However, if we can assume it's ISO format or similar, we can use it.
    if (startDate || endDate) {
        where.created_at = {};
        if (startDate) {
            // Prisma might struggle with String range if not ISO. 
            // If they are stored as ISO strings, it works.
            where.created_at.gte = startDate;
        }
        if (endDate) {
            // Add time to end date to include the full day
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            where.created_at.lte = end.toISOString();
        }
    }

    // Fetch logs
    const logs = await db.vp_call_log.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            user_type: true,
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

    // Calculate total cost for the current selection (useful for billing)
    const totalCost = filteredLogs.reduce((acc, log) => acc + (log.cost || 0), 0);

    // Pagination
    const total = filteredLogs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return NextResponse.json({
      logs: paginatedLogs,
      totalCost,
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