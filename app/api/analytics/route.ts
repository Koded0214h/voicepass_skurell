import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { subDays, format } from 'date-fns';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    // Fallback to the specific user ID if not logged in (for testing purposes as requested)
    const userId = user?.id || 'cmkng3gbr0003122pr9yiizlq';

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    const now = new Date();
    let startDate = subDays(now, 7);
    if (timeRange === '24h') startDate = subDays(now, 1);
    if (timeRange === '30d') startDate = subDays(now, 30);
    if (timeRange === '90d') startDate = subDays(now, 90);

    const callLogs = await db.vp_call_log.findMany({
      where: {
        user_id: userId,
        created_at: {
          gte: startDate,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const totalCalls = callLogs.length;
    const successfulCalls = callLogs.filter(log => log.status === 'COMPLETED' || log.status === 'ANSWERED').length;
    const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;
    
    const totalDuration = callLogs.reduce((acc, log) => acc + (log.duration || 0), 0);
    const avgResponseTime = totalCalls > 0 ? totalDuration / totalCalls : 0;

    // Peak Hour
    const hourCounts: Record<number, number> = {};
    callLogs.forEach(log => {
      const hour = new Date(log.created_at).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    let peakHour = 0;
    let maxCalls = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCalls) {
        maxCalls = count;
        peakHour = parseInt(hour);
      }
    });

    // Cost Efficiency
    const totalCost = callLogs.reduce((acc, log) => acc + (log.cost || 0), 0);
    const costPerSuccess = successfulCalls > 0 ? totalCost / successfulCalls : 0;

    // Call Distribution
    const callDistribution = Array.from({ length: 24 }).map((_, i) => ({
      hour: `${i}h`,
      calls: hourCounts[i] || 0,
    }));

    // Status Breakdown
    const statusCounts: Record<string, number> = {};
    callLogs.forEach(log => {
      statusCounts[log.status] = (statusCounts[log.status] || 0) + 1;
    });
    const callStatusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      percentage: totalCalls > 0 ? Math.round((count / totalCalls) * 100) : 0,
    }));

    // Daily Spend Trend
    const dailySpend: Record<string, number> = {};
    callLogs.forEach(log => {
      const day = format(new Date(log.created_at), 'EEE');
      dailySpend[day] = (dailySpend[day] || 0) + (log.cost || 0);
    });
    const dailySpendTrend = Object.entries(dailySpend).map(([day, amount]) => ({
      day,
      amount,
    }));

    // Top Performing Hours
    const hourStats: Record<number, { total: number, success: number }> = {};
    callLogs.forEach(log => {
      const hour = new Date(log.created_at).getHours();
      if (!hourStats[hour]) hourStats[hour] = { total: 0, success: 0 };
      hourStats[hour].total++;
      if (log.status === 'COMPLETED' || log.status === 'ANSWERED') {
        hourStats[hour].success++;
      }
    });
    
    const topPerformingHours = Object.entries(hourStats)
      .map(([hour, stats]) => ({
        hour: `${hour}h`,
        calls: stats.total,
        successRate: (stats.success / stats.total) * 100,
      }))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 3);

    // Performance Insights
    const dayStats: Record<string, { total: number; success: number }> = {};
    callLogs.forEach(log => {
      const day = format(log.created_at, 'EEE');
      if (!dayStats[day]) dayStats[day] = { total: 0, success: 0 };
      dayStats[day].total++;
      // @ts-ignore
      if (log.status === 'COMPLETED' || log.status === 'ANSWERED') {
        dayStats[day].success++;
      }
    });

    let bestDay = 'N/A';
    let maxSuccessRate = -1;
    Object.entries(dayStats).forEach(([day, stats]) => {
      const rate = stats.total > 0 ? (stats.success / stats.total) * 100 : 0;
      if (rate > maxSuccessRate && stats.total > 0) {
        maxSuccessRate = rate;
        bestDay = day;
      }
    });

    const daysMap: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '90d': 90 };
    const days = daysMap[timeRange] || 7;
    const avgDailyCalls = (totalCalls / days).toFixed(1);

    const smsRate = 5.0;
    const equivalentSmsCost = successfulCalls * smsRate;
    const savings = Math.max(0, equivalentSmsCost - totalCost);
    const costSavings = '₦' + savings.toFixed(2);

    // Volume Trend (Dynamic based on timeRange)
    let volumeTrend = [];
    if (timeRange === '24h') {
        const hourMap = new Map();
        for(let i=0; i<24; i++) hourMap.set(i, 0);
        callLogs.forEach(log => {
            const hour = new Date(log.created_at).getHours();
            hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
        });
        volumeTrend = Array.from(hourMap.entries()).map(([label, value]) => ({ label: `${label}:00`, value }));
    } else {
        const dailyCounts: Record<string, number> = {};
        // Process in reverse (chronological) order for the graph
        [...callLogs].reverse().forEach(log => {
             const day = format(new Date(log.created_at), 'MMM dd');
             dailyCounts[day] = (dailyCounts[day] || 0) + 1;
        });
        volumeTrend = Object.entries(dailyCounts).map(([label, value]) => ({ label, value }));
    }

    // Daily Performance (Success vs Failed)
    const dailyPerfMap: Record<string, { success: number, failed: number }> = {};
    // Process in reverse (chronological) order
    [...callLogs].reverse().forEach(log => {
        const day = format(new Date(log.created_at), 'EEE');
        if (!dailyPerfMap[day]) dailyPerfMap[day] = { success: 0, failed: 0 };
        if (log.status === 'COMPLETED' || log.status === 'ANSWERED') dailyPerfMap[day].success++;
        else if (log.status === 'FAILED') dailyPerfMap[day].failed++;
    });
    const dailyPerformance = Object.entries(dailyPerfMap).map(([day, stats]) => ({ day, ...stats }));

    return NextResponse.json({
      kpis: {
        totalCalls,
        successRate: successRate.toFixed(1) + '%',
        avgResponseTime: avgResponseTime.toFixed(2) + 's',
        peakHour: `${peakHour}:00`,
        costEfficiency: '₦' + costPerSuccess.toFixed(2),
      },
      hourly: callDistribution,
      status: callStatusBreakdown,
      dailySpend: dailySpendTrend,
      topHours: topPerformingHours,
      insights: {
        bestDay,
        avgDailyCalls,
        costSavings,
      },
      volumeTrend,
      dailyPerformance
    });

  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}