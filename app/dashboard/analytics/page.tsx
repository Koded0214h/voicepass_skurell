'use client';

import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  // State for dynamic data (initialize as empty or with default structure)
  const [kpiData, setKpiData] = useState({
    successRate: 'N/A',
    avgResponseTime: 'N/A',
    peakHour: 'N/A',
    costEfficiency: 'N/A',
  });
  const [hourlyDistribution, setHourlyDistribution] = useState<Array<{ hour: string; calls: number }>>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<Array<{ label: string; value: number; color: string }>>([]);
  const [geographicDistribution, setGeographicDistribution] = useState<Array<{ country: string; flag: string; calls: number; percentage: number }>>([]);
  const [dailySpendTrend, setDailySpendTrend] = useState<Array<{ day: string; amount: number }>>([]);
  const [topPerformingHours, setTopPerformingHours] = useState<Array<{ time: string; calls: number; successRate: number }>>([]);
  const [performanceInsights, setPerformanceInsights] = useState({
    bestDay: 'N/A',
    avgDailyCalls: 'N/A',
    costSavings: 'N/A',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setKpiData(data.kpis);
        setHourlyDistribution(data.hourly);
        setStatusBreakdown(data.status);
        setGeographicDistribution(data.geographic ?? []);
        setDailySpendTrend(data.dailySpend);
        setTopPerformingHours(data.topHours);
        setPerformanceInsights(data.insights);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange]);


  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse-animate {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
              <p className="text-sm text-slate-500 mt-1">Detailed insights into your VoicePass performance</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] outline-none text-sm font-medium"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button className="flex items-center gap-2 bg-[#5da28c] hover:bg-[#4a8572] text-white text-sm font-bold py-2 px-4 rounded-lg transition-all">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Report
              </button>
            </div>
          </div>

          {loading && <div className="text-center py-8 text-slate-500">Loading analytics data...</div>}
          {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}

          {!loading && !error && (
            <>
              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Replace with dynamic data */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-500 text-sm font-medium">Success Rate</span>
                    <div className="bg-green-50 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{kpiData.successRate}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    {/* Dynamic trend icon and value */}
                    <span className="material-symbols-outlined text-slate-400 text-[14px]">trending_flat</span>
                    <span className="text-slate-400">vs last period</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-500 text-sm font-medium">Avg Response Time</span>
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-blue-600 text-[18px]">schedule</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{kpiData.avgResponseTime}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    {/* Dynamic trend icon and value */}
                    <span className="material-symbols-outlined text-slate-400 text-[14px]">trending_flat</span>
                    <span className="text-slate-400">vs last period</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-500 text-sm font-medium">Peak Hour</span>
                    <div className="bg-purple-50 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-purple-600 text-[18px]">trending_up</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{kpiData.peakHour}</div>
                  <div className="text-xs text-slate-400 mt-2">Most active time</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-500 text-sm font-medium">Cost Efficiency</span>
                    <div className="bg-orange-50 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-orange-600 text-[18px]">savings</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{kpiData.costEfficiency}</div>
                  <div className="text-xs text-slate-400 mt-2">per successful call</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hourly Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Call Distribution by Hour</h3>
                  <div className="h-64 flex items-end justify-between gap-1">
                    {/* Use hourlyDistribution data here */}
                    {hourlyDistribution.map((data, i) => {
                      // Example: height calculation based on actual calls
                      // const maxCalls = Math.max(...hourlyDistribution.map(d => d.calls));
                      // const height = maxCalls > 0 ? (data.calls / maxCalls) * 80 + 20 : 20; // Example: scale to 20-100%
                      const height = data.calls === 0 ? 5 : (data.calls / 100) * 80 + 20; // Placeholder scaling
                      return (
                        <div key={data.hour} className="flex-1 flex flex-col items-center gap-1 group">
                          <div 
                            className="w-full bg-[#5da28c] rounded-t hover:bg-[#4a8572] transition-all cursor-pointer"
                            style={{ height: `${height}%` }}
                            title={`${data.hour} - ${data.calls} calls`}
                          ></div>
                          {i % 3 === 0 && ( // Display hour labels every 3 hours
                            <span className="text-[10px] text-slate-400">{data.hour.replace('h', '')}h</span>
                          )}
                        </div>
                      );
                    })}
                    {hourlyDistribution.length === 0 && <p className="text-center text-slate-400 w-full">No hourly data available.</p>}
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Call Status Breakdown</h3>
                  <div className="space-y-4">
                    {/* Use statusBreakdown data here */}
                    {statusBreakdown.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">{item.label}</span>
                          <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {statusBreakdown.length === 0 && <p className="text-center text-slate-400">No status breakdown data available.</p>}
                  </div>
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Geographic Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Use geographicDistribution data here */}
                  {geographicDistribution.map((location) => (
                    <div key={location.country} className="border border-slate-100 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{location.flag}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{location.country}</div>
                          <div className="text-sm text-slate-500">{location.calls.toLocaleString()} calls</div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-[#5da28c] rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-slate-500 mt-1">{location.percentage}%</div>
                    </div>
                  ))}
                  {geographicDistribution.length === 0 && <p className="text-center text-slate-400 w-full col-span-full">No geographic data available.</p>}
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Spend Trend */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Daily Spend Trend</h3>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {/* Use dailySpendTrend data here */}
                    {dailySpendTrend.map((data) => {
                      // Example: height calculation based on actual amount
                      // const maxAmount = Math.max(...dailySpendTrend.map(d => d.amount));
                      // const height = maxAmount > 0 ? (data.amount / maxAmount) * 70 + 30 : 30; // Example: scale to 30-100%
                      const height = data.amount === 0 ? 10 : (data.amount / 100) * 70 + 30; // Placeholder scaling
                      return (
                        <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-xs font-semibold text-slate-700">₦{data.amount.toFixed(2)}</div>
                          <div 
                            className="w-full bg-gradient-to-t from-[#5da28c] to-[#5da28c]/50 rounded-t hover:from-[#4a8572] hover:to-[#4a8572]/50 transition-all cursor-pointer"
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="text-xs text-slate-500">{data.day}</span>
                        </div>
                      );
                    })}
                    {dailySpendTrend.length === 0 && <p className="text-center text-slate-400 w-full">No daily spend data available.</p>}
                  </div>
                </div>

                {/* Top Performing Hours */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Top Performing Hours</h3>
                  <div className="space-y-3">
                    {/* Use topPerformingHours data here */}
                    {topPerformingHours.map((slot, index) => (
                      <div key={slot.time} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5da28c]/10 text-[#5da28c] font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 text-sm">{slot.time}</div>
                          <div className="text-xs text-slate-500">{slot.calls} calls</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600">{slot.successRate}%</div>
                          <div className="text-xs text-slate-500">success</div>
                        </div>
                      </div>
                    ))}
                    {topPerformingHours.length === 0 && <p className="text-center text-slate-400">No top performing hours data available.</p>}
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-gradient-to-br from-[#5da28c]/10 to-blue-50 rounded-xl p-6 border border-[#5da28c]/20">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-[#5da28c] text-3xl">insights</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Performance Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Use performanceInsights data here */}
                      <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Best Day</div>
                        <div className="text-xl font-bold text-slate-900">{performanceInsights.bestDay}</div>
                        <div className="text-xs text-slate-500">99.1% success rate</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Avg Daily Calls</div>
                        <div className="text-xl font-bold text-slate-900">{performanceInsights.avgDailyCalls}</div>
                        <div className="text-xs text-slate-500">vs last week</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Cost Savings</div>
                        <div className="text-xl font-bold text-green-600">{performanceInsights.costSavings}</div>
                        <div className="text-xs text-slate-500">vs SMS this month</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}