'use client';

import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Chart, registerables } from 'chart.js';
import { Phone, TrendingUp, Wallet, Plus, CheckCircle, AlertCircle, AlertTriangle, PhoneCall, PhoneForwarded, Key, Eye, X } from 'lucide-react';

Chart.register(...registerables);

interface DashboardStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  balance: number;
  successRate: number;
}

interface RecentCall {
  id: string;
  phone_number: string;
  status: string;
  cost: number;
  duration: number | null;
  created_at: string;
  call_id: string;
}

const statusColorMap: { [key: string]: { background: string; text: string; border: string; dot: string } } = {
    answered: { background: 'bg-[#5da28c]/10', text: 'text-[#4a8572]', border: 'border-[#5da28c]/20', dot: 'bg-[#5da28c]' },
    failed: { background: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-500' },
    'no answer': { background: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500' },
    busy: { background: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-500' },
    unavailable: { background: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-500' },
    initiated: { background: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500' },
    ringing: { background: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', dot: 'bg-yellow-500' },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [volumeFilter, setVolumeFilter] = useState('Day');
  const [selectedCall, setSelectedCall] = useState<RecentCall | null>(null);
  
  // Chart Data State
  const [volumeTrend, setVolumeTrend] = useState<{ label: string, value: number }[]>([]);
  const [deliveryPerformance, setDeliveryPerformance] = useState<{ day: string, success: number, failed: number }[]>([]);

  const volumeChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const volumeChartInstance = useRef<Chart | null>(null);
  const performanceChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [logsRes, balanceRes, analyticsRes] = await Promise.all([
          fetch('/api/calls/logs?limit=5', { cache: 'no-store' }),
          fetch('/api/billing/balance', { cache: 'no-store' }),
          fetch(`/api/analytics?timeRange=${volumeFilter === 'Day' ? '24h' : volumeFilter === 'Week' ? '7d' : '30d'}`, { cache: 'no-store' }),
        ]);

        if (!logsRes.ok || !balanceRes.ok || !analyticsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const logsData = await logsRes.json();
        const balanceData = await balanceRes.json();
        const analyticsData = await analyticsRes.json();

        const allLogs = (logsData.logs || []).map((log: RecentCall) => {
          let status = log.status.replace(/_/g, ' ').toLowerCase();
          if (status === 'completed') {
            status = 'answered';
          }
          return { ...log, status };
        });
        const successful = allLogs.filter((l: RecentCall) => 
          l.status === 'answered'
        );
        const failed = allLogs.filter((l: RecentCall) => l.status === 'failed');

        setStats({
          totalCalls: allLogs.length,
          successfulCalls: successful.length,
          failedCalls: failed.length,
          balance: balanceData.balance,
          successRate: allLogs.length > 0 ? (successful.length / allLogs.length) * 100 : 0,
        });

        setRecentCalls(allLogs.slice(0, 5));
        setVolumeTrend(analyticsData.volumeTrend || []);
        setDeliveryPerformance(analyticsData.dailyPerformance || []);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [volumeFilter]);

  // Initialize Volume Chart
  useEffect(() => {
    if (volumeChartInstance.current) {
      volumeChartInstance.current.destroy();
    }

    if (volumeChartRef.current && volumeTrend.length > 0) {
      const ctx = volumeChartRef.current.getContext('2d');
      if (ctx) {
        volumeChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: volumeTrend.map(d => d.label),
            datasets: [{
              label: 'Calls',
              data: volumeTrend.map(d => d.value),
              borderColor: '#5da28c',
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, 'rgba(93, 162, 140, 0.2)');
                gradient.addColorStop(1, 'rgba(93, 162, 140, 0)');
                return gradient;
              },
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { maxTicksLimit: 6, font: { size: 10 } } },
              y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } }
            }
          }
        });
      }
    }
  }, [volumeTrend]);

  // Initialize Performance Chart
  useEffect(() => {
    if (performanceChartInstance.current) {
      performanceChartInstance.current.destroy();
    }

    if (performanceChartRef.current && deliveryPerformance.length > 0) {
      const ctx = performanceChartRef.current.getContext('2d');
      if (ctx) {
        performanceChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: deliveryPerformance.map(d => d.day),
            datasets: [
              {
                label: 'Success',
                data: deliveryPerformance.map(d => d.success),
                backgroundColor: '#5da28c',
                borderRadius: 4,
              },
              {
                label: 'Failed',
                data: deliveryPerformance.map(d => d.failed),
                backgroundColor: '#e2e8f0',
                borderRadius: 4,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 10 } } },
              y: { beginAtZero: true, grid: { display: false }, display: false }
            }
          }
        });
      }
    }
  }, [deliveryPerformance]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <style jsx>{`
        @keyframes growUp {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .bar-animate {
          transform-origin: bottom;
          animation: growUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .line-animate {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 2s ease-out forwards;
        }
      `}</style>

      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Card 1: Total Calls */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:border-[#5da28c]/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#eef6f4] p-2 rounded-lg text-[#5da28c]">
                  <Phone className="size-6" />
                </div>
                <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="size-3.5 mr-1" />
                  12%
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Voice Pass</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {stats?.totalCalls.toLocaleString() || '0'}
                </h3>
                <p className="text-slate-400 text-xs mt-1">This month</p>
              </div>
            </div>

            {/* Card 2: Current Balance */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5da28c]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="bg-[#eef6f4] p-2 rounded-lg text-[#5da28c]">
                  <Wallet className="size-6" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-slate-500 text-sm font-medium">Current Balance</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  ₦{(stats?.balance || 0).toFixed(2)}
                </h3>
                <div className="mt-4">
                  <button className="w-full flex items-center justify-center gap-2 bg-[#5da28c] hover:bg-[#4a8572] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all shadow-sm shadow-[#5da28c]/20">
                    <Plus className="size-[18px]" />
                    Add Credit
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Success Rate */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:border-[#5da28c]/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#eef6f4] p-2 rounded-lg text-[#5da28c]">
                  <CheckCircle className="size-6" />
                </div>
                <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  Optimal
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Success Rate</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {stats?.successRate.toFixed(1)}%
                </h3>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className="bg-[#5da28c] h-1.5 rounded-full" 
                    style={{ width: `${stats?.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Card 4: Failed Calls */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:border-[#5da28c]/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-50 p-2 rounded-lg text-red-500">
                  <AlertCircle className="size-6" />
                </div>
                <a className="text-xs font-semibold text-[#5da28c] hover:underline" href="/calls">
                  View logs
                </a>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Failed Calls</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {stats?.failedCalls || 0}
                </h3>
                <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                  <AlertTriangle className="size-[14px]" />
                  {stats?.failedCalls ? 'Requires attention' : 'All good!'}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Call Volume Trends</h3>
                  <p className="text-sm text-slate-500">Voice & OTP delivery over time</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['Day', 'Week', 'Month'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setVolumeFilter(filter)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        volumeFilter === filter
                          ? 'bg-white shadow-sm text-slate-800 font-semibold'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-64 w-full">
                {volumeTrend.length > 0 ? (
                  <canvas ref={volumeChartRef}></canvas>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    No data available for this period
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Delivery Performance</h3>
                  <p className="text-sm text-slate-500">Success vs Failed counts by day</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full bg-[#5da28c]"></div>
                    <span className="text-slate-600">Success</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full bg-slate-200"></div>
                    <span className="text-slate-600">Failed</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 w-full">
                {deliveryPerformance.length > 0 ? (
                  <canvas ref={performanceChartRef}></canvas>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    No performance data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
              <Link href="/dashboard/calls" className="text-sm text-[#5da28c] font-semibold hover:text-[#4a8572] transition-colors">
                View All Logs
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f9fafa] text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Cost</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentCalls.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No recent calls
                      </td>
                    </tr>
                  ) : (
                    recentCalls.map((call) => (
                      <tr key={call.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                          {format(new Date(call.created_at), 'MMM dd, HH:mm:ss')}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {call.phone_number.length > 8
                            ? `${call.phone_number.slice(0, 4)}••••${call.phone_number.slice(-4)}`
                            : call.phone_number
                          }
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Key className="text-slate-400 size-[18px]" />
                            <span className="text-slate-600">OTP Code</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {call.duration ? `00:${String(call.duration).padStart(2, '0')}` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColorMap[call.status]?.background || 'bg-gray-100'} ${statusColorMap[call.status]?.text || 'text-gray-700'} ${statusColorMap[call.status]?.border || 'border-gray-200'}`}>
                            <span className={`size-1.5 rounded-full ${statusColorMap[call.status]?.dot || 'bg-gray-500'}`}></span>
                            <span className="capitalize">{call.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-900">
                          ₦{call.cost.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedCall(call)}
                            className="p-2 text-slate-400 hover:text-[#5da28c] hover:bg-[#5da28c]/10 rounded-full transition-colors"
                          >
                            <Eye className="size-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedCall && (
          <CallDetailsModal call={selectedCall} onClose={() => setSelectedCall(null)} />
        )}
      </div>
    </>
  );
}

function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <PhoneCall className="size-9 text-[#5da28c] animate-pulse" />
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#5da28c] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-[#5da28c] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[#5da28c] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <PhoneForwarded className="size-9 text-[#5da28c] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CallDetailsModal({ call, onClose }: { call: RecentCall; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="size-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#eef6f4] p-3 rounded-full text-[#5da28c]">
            <PhoneCall className="size-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Call Details</h3>
            <p className="text-sm text-slate-500">ID: {call.call_id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs font-medium text-slate-500 mb-1">Recipient</p>
              <p className="text-sm font-bold text-slate-900">{call.phone_number}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs font-medium text-slate-500 mb-1">Date & Time</p>
              <p className="text-sm font-bold text-slate-900">{format(new Date(call.created_at), 'MMM dd, yyyy HH:mm')}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs font-medium text-slate-500 mb-1">Duration</p>
              <p className="text-sm font-bold text-slate-900">{call.duration ? `${call.duration}s` : '-'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs font-medium text-slate-500 mb-1">Cost</p>
              <p className="text-sm font-bold text-slate-900">₦{call.cost.toFixed(3)}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Status</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColorMap[call.status]?.background || 'bg-gray-100'} ${statusColorMap[call.status]?.text || 'text-gray-700'} ${statusColorMap[call.status]?.border || 'border-gray-200'}`}>
              <span className={`size-1.5 rounded-full ${statusColorMap[call.status]?.dot || 'bg-gray-500'}`}></span>
              <span className="capitalize">{call.status}</span>
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}