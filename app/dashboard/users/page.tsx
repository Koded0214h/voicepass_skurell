'use client';
import { useEffect, useState, useCallback } from 'react';
import { formatDate } from '../../../lib/utils';
import { Eye, X, Trash2, UserPlus, Check } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface User {
    id: number;
    email: string;
    phone_number: string;
    role: string;
    balance: number;
    created_at: string;
    last_login?: string;
    name?: string;
    company?: string;
    is_active?: boolean;
}

const roleColorMap: { [key: string]: { background: string; text: string; border: string; dot: string } } = {
    admin: { background: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-500' },
    user: { background: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500' },
};

function UserProfileTab({ user }: { user: User }) {
    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="space-y-1">
                <p className="text-slate-500 font-medium">Name</p>
                <p className="text-slate-800">{user.name || '-'}</p>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500 font-medium">Email</p>
                <p className="text-slate-800">{user.email}</p>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500 font-medium">Phone Number</p>
                <p className="text-slate-800">{user.phone_number || '-'}</p>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500 font-medium">Company</p>
                <p className="text-slate-800">{user.company || '-'}</p>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500 font-medium">Role</p>
                <p className="text-slate-800 capitalize">{user.role}</p>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500 font-medium">Balance</p>
                <p className="text-slate-800 font-mono">₦{user.balance.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500 font-medium">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <span className={`size-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {user.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500 font-medium">Created At</p>
                <p className="text-slate-800 text-xs">{formatDate(user.created_at, 'MMM dd, yyyy HH:mm:ss')}</p>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500 font-medium">Last Login</p>
                <p className="text-slate-800 text-xs">{user.last_login ? formatDate(user.last_login, 'MMM dd, yyyy HH:mm:ss') : 'Never'}</p>
            </div>
        </div>
    );
}

function SuccessModal({ message, onClose }: { message: string, onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs mx-4 p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={40} className="text-green-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Success!</h2>
                <p className="text-slate-500 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-3 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] font-bold"
                >
                    Done
                </button>
            </div>
        </div>
    );
}

function UserFundingTab({ user, onSuccess }: { user: User; onSuccess: () => void }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    async function handleTopUp(e: React.FormEvent) {
        e.preventDefault();
        if (loading) return;

        const topUpAmount = parseFloat(amount);
        if (isNaN(topUpAmount) || topUpAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/users/${user.id}/topup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: topUpAmount }),
            });

            if (res.ok) {
                setSuccessMessage(`Successfully funded ${user.name || user.email} with ₦${topUpAmount.toFixed(2)}.`);
                setShowSuccessModal(true);
                onSuccess();
            } else {
                const errorData = await res.json();
                alert(`Funding failed: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Top up error:', error);
            alert('An error occurred during top-up.');
        } finally {
            setLoading(false);
            setAmount('');
        }
    }
    
    return (
        <>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Top-Up</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[100, 500, 1000, 5000].map((pkgAmount) => (
                                <button
                                    key={pkgAmount}
                                    onClick={() => setAmount(pkgAmount.toString())}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${amount === pkgAmount.toString() ? 'border-[#5da28c] bg-[#5da28c]/5' : 'border-slate-200 hover:border-[#5da28c]/50'}`}
                                >
                                    <div className="text-xl font-bold text-slate-900">₦{pkgAmount}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Custom Amount</h3>
                        <form onSubmit={handleTopUp}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Amount (₦)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    min="100"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none text-lg font-semibold"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !amount}
                                className="w-full px-4 py-3 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] disabled:opacity-50 font-bold"
                            >
                                {loading ? 'Processing...' : `Fund User (₦${amount || '0.00'})`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {showSuccessModal && <SuccessModal message={successMessage} onClose={() => setShowSuccessModal(false)} />}
        </>
    );
}

function UserDetailsModal({ user, onClose, onDataChange }: { user: User; onClose: () => void, onDataChange: () => void }) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{user.name || user.email}</h2>
                        <p className="text-sm text-slate-500">User Details</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                
                <div>
                    <div className="border-b border-slate-200">
                        <nav className="flex gap-4 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`shrink-0 border-b-2 px-1 py-3 text-sm font-medium ${activeTab === 'profile' ? 'border-[#5da28c] text-[#5da28c]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('funding')}
                                className={`shrink-0 border-b-2 px-1 py-3 text-sm font-medium ${activeTab === 'funding' ? 'border-[#5da28c] text-[#5da28c]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Funding
                            </button>
                        </nav>
                    </div>

                    <div>
                        {activeTab === 'profile' && <UserProfileTab user={user} />}
                        {activeTab === 'funding' && <UserFundingTab user={user} onSuccess={() => {
                            onDataChange();
                            // No need to switch tab, admin might want to perform another funding operation
                        }} />}
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

function CreateUserModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        phone_number: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Create New User</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input type="text" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                            <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input type="tel" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input type="password" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <div className="pt-4"><button type="submit" disabled={loading} className="w-full px-4 py-2.5 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] font-bold disabled:opacity-50">{loading ? 'Creating...' : 'Create User'}</button></div>
                </form>
            </div>
        </div>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [companyFilter, setCompanyFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const currentUser = useUser();

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
            });

            if (roleFilter !== 'ALL') {
                params.append('role', roleFilter);
            }

            const res = await fetch(`/api/users?${params}`, { cache: 'no-store' });
            const data = await res.json();

            setUsers(data.users || []);
            setTotal(data.pagination?.total || 0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    }, [page, roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = users.filter(user =>
        ((user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!companyFilter || (user.company && user.company.toLowerCase().includes(companyFilter.toLowerCase())))
    );

    const totalPages = Math.ceil(total / 20);

    function handleExport() {
        const headers = ['Name', 'Email', 'Company', 'Phone Number', 'Role', 'Balance', 'Status', 'Created At'];
        const rows = users.map(user => [
            user.name || '-',
            user.email,
            user.company || '-',
            user.phone_number || '-',
            user.role,
            user.balance.toFixed(2),
            user.is_active ? 'Active' : 'Inactive',
            formatDate(user.created_at, 'yyyy-MM-dd HH:mm:ss')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `users_${formatDate(new Date().toISOString(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }



    async function handleDeleteUser(userId: number) {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchUsers();
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    }

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
                        <p className="text-sm text-slate-500 mt-1">View and manage all registered users</p>
                    </div>
                    <div className="flex gap-3">
                        {currentUser?.role === 'admin' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center justify-center gap-2 bg-[#5da28c] hover:bg-[#4a8572] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all"
                            >
                                <UserPlus size={18} />
                                Create User
                            </button>
                        )}
                        <button
                            onClick={handleExport}
                            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold py-2.5 px-4 rounded-lg transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                                    search
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Company Filter */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                                    apartment
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by company..."
                                    value={companyFilter}
                                    onChange={(e) => setCompanyFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Role
                            </label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] focus:border-[#5da28c] outline-none transition-all"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchTerm || roleFilter !== 'ALL' || companyFilter) && (
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
                            {companyFilter && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                                    Company: {companyFilter}
                                    <button onClick={() => setCompanyFilter('')} className="hover:text-slate-900">
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </span>
                            )}
                            {roleFilter !== 'ALL' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                                    Role: <span className="capitalize">{roleFilter}</span>
                                    <button onClick={() => setRoleFilter('ALL')} className="hover:text-slate-900">
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setRoleFilter('ALL');
                                    setCompanyFilter('');
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
                                    <th className="px-4 py-3 md:px-6 md:py-4">Name</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Email</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Company</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Role</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Status</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-right">Balance</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Joined</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 md:px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-2 h-2 bg-[#5da28c] rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-[#5da28c] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-[#5da28c] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 md:px-6 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <span className="material-symbols-outlined text-6xl text-slate-300">group</span>
                                                <p className="text-slate-500 font-medium">No users found</p>
                                                <p className="text-sm text-slate-400">Try adjusting your filters or search term</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-slate-900">
                                                {user.name || user.email.split('@')[0]}
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-slate-900">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-slate-700">
                                                {user.company || '-'}
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${roleColorMap[user.role]?.background || 'bg-gray-100'} ${roleColorMap[user.role]?.text || 'text-gray-700'} ${roleColorMap[user.role]?.border || 'border-gray-200'}`}>
                                                    <span className={`size-1.5 rounded-full ${roleColorMap[user.role]?.dot || 'bg-gray-500'}`}></span>
                                                    <span className="capitalize">{user.role}</span>
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                                    <span className={`size-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-right font-mono text-slate-900 font-medium">
                                                ₦{user.balance.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-slate-600 font-mono text-xs">
                                                {formatDate(user.created_at, 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => setSelectedUser(user)} 
                                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    {currentUser?.role === 'admin' && user.id !== parseInt(currentUser.id) && (
                                                        <>
                                                            
                                                            <button 
                                                                onClick={() => handleDeleteUser(user.id)} 
                                                                className="text-red-400 hover:text-red-600 transition-colors"
                                                                title="Delete user"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && filteredUsers.length > 0 && (
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
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                    page === pageNum
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
            {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} onDataChange={fetchUsers} />}
            {showCreateModal && <CreateUserModal onClose={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); fetchUsers(); }} />}
        </div>
    );
}