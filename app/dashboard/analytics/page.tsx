'use client';

import { useState } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

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

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm font-medium">Success Rate</span>
                <div className="bg-green-50 p-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">98.5%</div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="material-symbols-outlined text-green-600 text-[14px]">trending_up</span>
                <span className="text-green-600 font-semibold">+2.3%</span>
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
              <div className="text-3xl font-bold text-slate-900">2.4s</div>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="material-symbols-outlined text-green-600 text-[14px]">trending_down</span>
                <span className="text-green-600 font-semibold">-0.3s</span>
                <span className="text-slate-400">faster</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm font-medium">Peak Hour</span>
                <div className="bg-purple-50 p-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-purple-600 text-[18px]">trending_up</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">14:00</div>
              <div className="text-xs text-slate-400 mt-2">Most active time</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm font-medium">Cost Efficiency</span>
                <div className="bg-orange-50 p-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-orange-600 text-[18px]">savings</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">₦3.42</div>
              <div className="text-xs text-slate-400 mt-2">per successful call</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Distribution */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Call Distribution by Hour</h3>
              <div className="h-64 flex items-end justify-between gap-1">
                {Array.from({ length: 24 }, (_, i) => {
                  const height = Math.random() * 80 + 20;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div 
                        className="w-full bg-[#5da28c] rounded-t hover:bg-[#4a8572] transition-all cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`${i}:00 - ${Math.floor(height * 10)} calls`}
                      ></div>
                      {i % 3 === 0 && (
                        <span className="text-[10px] text-slate-400">{i}h</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Call Status Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: 'Completed', value: 85, color: 'bg-[#5da28c]' },
                  { label: 'Answered', value: 10, color: 'bg-blue-500' },
                  { label: 'Failed', value: 3, color: 'bg-red-500' },
                  { label: 'No Answer', value: 2, color: 'bg-yellow-500' },
                ].map((item) => (
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
              </div>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Geographic Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { country: 'Nigeria', flag: '🇳🇬', calls: 8540, percentage: 72 },
                { country: 'Ghana', flag: '🇬🇭', calls: 2100, percentage: 18 },
                { country: 'Kenya', flag: '🇰🇪', calls: 1180, percentage: 10 },
              ].map((location) => (
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
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Spend Trend */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Daily Spend Trend</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const height = Math.random() * 70 + 30;
                  const amount = (height * 2).toFixed(2);
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-semibold text-slate-700">₦{amount}</div>
                      <div 
                        className="w-full bg-gradient-to-t from-[#5da28c] to-[#5da28c]/50 rounded-t hover:from-[#4a8572] hover:to-[#4a8572]/50 transition-all cursor-pointer"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-slate-500">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Performing Hours */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Top Performing Hours</h3>
              <div className="space-y-3">
                {[
                  { time: '14:00 - 15:00', calls: 450, successRate: 99.2 },
                  { time: '10:00 - 11:00', calls: 420, successRate: 98.8 },
                  { time: '16:00 - 17:00', calls: 380, successRate: 98.5 },
                  { time: '12:00 - 13:00', calls: 350, successRate: 97.9 },
                ].map((slot, index) => (
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
                  <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">Best Day</div>
                    <div className="text-xl font-bold text-slate-900">Thursday</div>
                    <div className="text-xs text-slate-500">99.1% success rate</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">Avg Daily Calls</div>
                    <div className="text-xl font-bold text-slate-900">1,780</div>
                    <div className="text-xs text-slate-500">+12% from last week</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">Cost Savings</div>
                    <div className="text-xl font-bold text-green-600">₦2,450</div>
                    <div className="text-xs text-slate-500">vs SMS this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}