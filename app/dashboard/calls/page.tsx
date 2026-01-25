'use client';
import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Eye, X } from 'lucide-react';

interface CallLog {
    id: string;
    user_id: number;
    call_id: string;
    gender: string;
    cost: number;
    language: string;
    phone_number: string;
    otp: string;
    status: string;
    duration: string;
    created_at: string;
    start_time: string;
    answer_time: string;
    ring_time: string;
    end_at: string;
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

function CallDetailsModal({ call, onClose }: { call: CallLog; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Call Details</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-slate-500 font-medium">Call ID</p>
                        <p className="text-slate-800 font-mono text-xs">{call.call_id}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 font-medium">Phone Number</p>
                        <p className="text-slate-800">{call.phone_number}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 font-medium">Status</p>
                        <p className="text-slate-800 capitalize">{call.status}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 font-medium">Cost</p>
                        <p className="text-slate-800 font-mono">₦{call.cost.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 font-medium">Duration</p>
                        <p className="text-slate-800">{call.duration ? `${call.duration}s` : '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 font-medium">Gender</p>
                        <p className="text-slate-800">{call.gender}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 font-medium">Language</p>
                        <p className="text-slate-800">{call.language}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 font-medium">OTP</p>
                        <p className="text-slate-800 font-mono">{call.otp}</p>
                    </div>
                    <div className="space-y-1 col-span-full border-t border-slate-100 pt-4 mt-2">
                        <p className="text-slate-500 font-medium">Timestamps</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500">Created At</p>
                        <p className="text-slate-800 text-xs">{format(new Date(call.created_at), 'MMM dd, yyyy HH:mm:ss')}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500">Start Time</p>
                        <p className="text-slate-800 text-xs">{call.start_time ? format(new Date(call.start_time), 'MMM dd, yyyy HH:mm:ss') : '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500">Answer Time</p>
                        <p className="text-slate-800 text-xs">{call.answer_time ? format(new Date(call.answer_time), 'MMM dd, yyyy HH:mm:ss') : '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500">End Time</p>
                        <p className="text-slate-800 text-xs">{call.end_at ? format(new Date(call.end_at), 'MMM dd, yyyy HH:mm:ss') : '-'}</p>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
export default function CallLogsPage() {
    const [calls, setCalls] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);

    useEffect(() => {
        fetchCalls();
    }, [fetchCalls]);

    const fetchCalls = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
            });

            if (statusFilter !== 'ALL') {
                params.append('status', statusFilter.replace(/ /g, '_').toUpperCase());
            }

            const res = await fetch(`/api/calls/logs?${params}`, { cache: 'no-store' });
            const data = await res.json();

            const transformedLogs = (data.logs || []).map((log: CallLog) => {
                let status = log.status.replace(/_/g, ' ').toLowerCase();
                if (status === 'completed') {
                    status = 'answered';
                }
                return {
                    ...log,
                    status,
                };
            });

            setCalls(transformedLogs);
            setTotal(data.pagination?.total || 0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching calls:', error);
            setLoading(false);
        }
    }, [page, statusFilter, setLoading, setCalls, setTotal]);

    const filteredCalls = calls.filter(call =>
        call.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (call.call_id && call.call_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    const totalPages = Math.ceil(total / 20);

    function handleExport() {
        const headers = ['Time', 'Call ID', 'Phone Number', 'Duration', 'Status', 'Cost'];
        const rows = calls.map(call => [
            format(new Date(call.created_at), 'yyyy-MM-dd HH:mm:ss'),
            call.call_id,
            call.phone_number,
            call.duration ? `00:${String(call.duration).padStart(2, '0')}` : '00:00',
            call.status.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            call.cost.toFixed(2)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `call_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Call Logs</h1>
                        <p className="text-sm text-slate-500 mt-1">View and manage all voice OTP calls</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#5da28c] hover:bg-[#4a8572] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                                    search
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by phone number or call ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none transition-all"
                            >
                                <option value="ALL">All Status</option>
                                <option value="answered">Answered</option>
                                <option value="failed">Failed</option>
                                <option value="no answer">No Answer</option>
                                <option value="busy">Busy</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchTerm || statusFilter !== 'ALL') && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                            <span className="text-sm text-slate-600">Active filters:</span>
                            {searchTerm && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                                    Search: {searchTerm}
                                    <button onClick={() => setSearchTerm('')} className="hover:text-slate-900">
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </span>
                            )}
                            {statusFilter !== 'ALL' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                                    Status: <span className="capitalize">{statusFilter}</span>
                                    <button onClick={() => setStatusFilter('ALL')} className="hover:text-slate-900">
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('ALL');
                                }}
                                className="text-xs text-[#5da28c] hover:text-[#4a8572] font-semibold ml-auto"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f9fafa] text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Call ID</th>
                                    <th className="px-6 py-4">Phone Number</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Cost</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-2 h-2 bg-[#5da28c] rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-[#5da28c] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-[#5da28c] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCalls.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <span className="material-symbols-outlined text-6xl text-slate-300">call_log</span>
                                                <p className="text-slate-500 font-medium">No call logs found</p>
                                                <p className="text-sm text-slate-400">Try adjusting your filters or search term</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCalls.map((call) => (
                                        <tr key={call.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                                                {format(new Date(call.created_at), 'MMM dd, HH:mm:ss')}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-700">
                                                {call.call_id ? `${call.call_id.slice(0, 12)}...` : '-'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {call.phone_number.slice(0, -4)}***{call.phone_number.slice(-4)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {call.duration ? `${call.duration}s` : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColorMap[call.status]?.background || 'bg-gray-100'} ${statusColorMap[call.status]?.text || 'text-gray-700'} ${statusColorMap[call.status]?.border || 'border-gray-200'}`}>
                                                    <span className={`size-1.5 rounded-full ${statusColorMap[call.status]?.dot || 'bg-gray-500'}`}></span>
                                                    <span className="capitalize">{call.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-900 font-medium">
                                                ₦{call.cost.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => setSelectedCall(call)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                                    <Eye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && filteredCalls.length > 0 && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Showing <span className="font-medium text-slate-900">{((page - 1) * 20) + 1}</span> to{' '}
                                <span className="font-medium text-slate-900">{Math.min(page * 20, total)}</span> of{' '}
                                <span className="font-medium text-slate-900">{total}</span> results
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${page === pageNum
                                                        ? 'bg-[#5da28c] text-white'
                                                        : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {selectedCall && <CallDetailsModal call={selectedCall} onClose={() => setSelectedCall(null)} />}
        </div>
    );
}