import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { startOfDay, endOfDay, subDays, format, getDay, getHours } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || '7d';

    let startDate: Date;
    switch (timeRange) {
      case '24h':
        startDate = subDays(new Date(), 1);
        break;
      case '7d':
        startDate = subDays(new Date(), 7);
        break;
      case '30d':
        startDate = subDays(new Date(), 30);
        break;
      case '90d':
        startDate = subDays(new Date(), 90);
        break;
      default:
        startDate = subDays(new Date(), 7); // Default to 7 days
    }

    // Fetch all relevant call logs for the user within the time range
    const callLogs = await db.callLog.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Initialize metrics
    let totalCalls = callLogs.length;
    let successfulCalls = 0;
    let failedCalls = 0;
    let totalResponseTime = 0;
    const hourlyCallCounts: { [key: string]: number } = {};
    const callStatusCounts: { [key: string]: number } = {
      COMPLETED: 0,
      ANSWERED: 0,
      FAILED: 0,
      'NO ANSWER': 0,
    };
    const dailySpend: { [key: string]: number } = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 24; i++) {
      hourlyCallCounts[`${i}h`] = 0;
    }
    for (const dayName of dayNames) {
      dailySpend[dayName] = 0;
    }

    callLogs.forEach(log => {
      // Status counts
      const status = log.status as keyof typeof callStatusCounts;
      if (callStatusCounts[status] !== undefined) {
        callStatusCounts[status]++;
      } else {
        // Handle unexpected statuses gracefully
        console.warn(`Unexpected call status: ${log.status}`);
      }

      // Response time (assuming duration can act as response time for simplicity, or add a dedicated field)
      if (log.duration) {
        totalResponseTime += log.duration;
      }

      // Hourly distribution
      const hour = getHours(log.createdAt);
      hourlyCallCounts[`${hour}h`]++;

      // Daily spend
      const dayOfWeek = getDay(log.createdAt); // 0 for Sunday, 1 for Monday, etc.
      const dayName = dayNames[dayOfWeek];
      dailySpend[dayName] += log.cost ?? 0; // Convert Decimal to number for summation
    });

    successfulCalls = callStatusCounts.COMPLETED + callStatusCounts.ANSWERED;
    failedCalls = callStatusCounts.FAILED + callStatusCounts['NO ANSWER'];

    const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;
    const avgResponseTime = totalCalls > 0 ? totalResponseTime / totalCalls : 0; // In seconds
    
    // Peak Hour (simple max count for now)
    let peakHour = 'N/A';
    let maxCallsInHour = -1;
    for (const hour in hourlyCallCounts) {
      if (hourlyCallCounts[hour] > maxCallsInHour) {
        maxCallsInHour = hourlyCallCounts[hour];
        peakHour = hour;
      }
    }

    // Cost Efficiency (Cost per successful call)
    const costEfficiency = successfulCalls > 0 ? (callLogs.reduce((sum, log) => sum + (log.cost ?? 0), 0) / successfulCalls) : 0;

    // Daily Spend Trend for the chart (ordered correctly)
    const currentDay = getDay(new Date());
    const orderedDailySpend = [];
    for (let i = 0; i < 7; i++) {
        const dayIndex = (currentDay - (6 - i) + 7) % 7; // Get days from 6 days ago to today
        orderedDailySpend.push({
            day: dayNames[dayIndex],
            amount: dailySpend[dayNames[dayIndex]] || 0
        });
    }


    // Top Performing Hours (example logic, can be refined)
    const topPerformingHours = Object.entries(hourlyCallCounts)
      .map(([hour, calls]) => ({
        time: hour,
        calls,
        successRate: totalCalls > 0 ? (callStatusCounts.COMPLETED + callStatusCounts.ANSWERED) / totalCalls * 100 : 0 // Simplified for now
      }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 3); // Get top 3

    // Performance Insights (placeholders for now, actual calculations are more complex)
    const performanceInsights = {
      bestDay: 'N/A', // Requires more complex daily aggregation
      avgDailyCalls: 'N/A', // Requires more complex daily aggregation
      costSavings: 'N/A', // Requires comparison with other services/periods
    };
    
    return NextResponse.json({
      kpis: {
        successRate: successRate.toFixed(1) + '%',
        avgResponseTime: avgResponseTime.toFixed(1) + 's',
        peakHour: peakHour,
        costEfficiency: '₦' + costEfficiency.toFixed(2),
      },
      hourly: Object.entries(hourlyCallCounts).map(([hour, calls]) => ({ hour, calls })),
      status: [
        { label: 'Completed', value: callStatusCounts.COMPLETED, color: 'bg-[#5da28c]' },
        { label: 'Answered', value: callStatusCounts.ANSWERED, color: 'bg-blue-500' },
        { label: 'Failed', value: callStatusCounts.FAILED, color: 'bg-red-500' },
        { label: 'No Answer', value: callStatusCounts['NO ANSWER'], color: 'bg-yellow-500' },
      ],
      geographic: [], // Placeholder, requires country data in logs
      dailySpend: orderedDailySpend,
      topHours: topPerformingHours,
      insights: performanceInsights,
    });
  } catch (error) {
    console.error('Fetch analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}