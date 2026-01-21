'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export default function BillingPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  async function fetchBillingData() {
    try {
      const balanceRes = await fetch('/api/billing/balance');
      const balanceData = await balanceRes.json();
      setBalance(balanceData.balance || 0);

      // Fetch transactions (you'll need to create this API route)
      // const transactionsRes = await fetch('/api/billing/transactions');
      // const transactionsData = await transactionsRes.json();
      // setTransactions(transactionsData.transactions || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Billing & Credits</h1>
              <p className="text-sm text-slate-500 mt-1">Manage your account balance and transactions</p>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Balance */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5da28c]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-[#eef6f4] p-2 rounded-lg text-[#5da28c]">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium">Current Balance</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">₦{balance.toFixed(2)}</h3>
                <button
                  onClick={() => setShowTopUpModal(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#5da28c] hover:bg-[#4a8572] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Credit
                </button>
              </div>
            </div>

            {/* This Month Spend */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <span className="material-symbols-outlined">trending_down</span>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  This Month
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Total Spent</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">₦0.00</h3>
              <p className="text-slate-400 text-xs mt-1">0 transactions</p>
            </div>

            {/* Average Cost */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  Average
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Avg. Cost per Call</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">₦3.50</h3>
              <p className="text-slate-400 text-xs mt-1">For successful calls</p>
            </div>
          </div>

          {/* Credit Packages */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Top-Up Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { amount: 100, bonus: 0, popular: false },
                { amount: 500, bonus: 25, popular: false },
                { amount: 1000, bonus: 100, popular: true },
                { amount: 5000, bonus: 750, popular: false },
              ].map((pkg) => (
                <button
                  key={pkg.amount}
                  onClick={() => setShowTopUpModal(true)}
                  className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                    pkg.popular
                      ? 'border-[#5da28c] bg-[#5da28c]/5'
                      : 'border-slate-200 hover:border-[#5da28c]/50'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 left-4 bg-[#5da28c] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="text-2xl font-bold text-slate-900">₦{pkg.amount}</div>
                  {pkg.bonus > 0 && (
                    <div className="text-xs text-[#5da28c] font-semibold mt-1">
                      + ₦{pkg.bonus} bonus
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-2">
                    ~{Math.floor(pkg.amount / 3.5)} calls
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] outline-none">
                  <option>All Transactions</option>
                  <option>Credits</option>
                  <option>Debits</option>
                </select>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#5da28c] hover:text-[#4a8572] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f9fafa] text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-right">Balance After</th>
                    <th className="px-6 py-4">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="material-symbols-outlined text-6xl text-slate-300">receipt_long</span>
                          <p className="text-slate-500 font-medium">No transactions yet</p>
                          <p className="text-sm text-slate-400">Your transaction history will appear here</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                          {format(new Date(txn.createdAt), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 text-slate-900">{txn.description}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            txn.type === 'CREDIT'
                              ? 'bg-green-50 text-green-600 border border-green-100'
                              : 'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {txn.type === 'CREDIT' ? 'add' : 'remove'}
                            </span>
                            {txn.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-right font-mono font-medium ${
                          txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {txn.type === 'CREDIT' ? '+' : '-'}₦{txn.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-900">
                          ₦{txn.balanceAfter.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {txn.id.slice(0, 8)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <TopUpModal onClose={() => setShowTopUpModal(false)} onSuccess={fetchBillingData} />
      )}
    </>
  );
}

function TopUpModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleTopUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment (in production, integrate with Paystack/Flutterwave)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create credit transaction
      const res = await fetch('/api/billing/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Top up error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Add Credit</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleTopUp}>
          <div className="mb-6">
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

          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Amount</span>
              <span className="font-semibold text-slate-900">₦{amount || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Estimated Calls</span>
              <span className="font-semibold text-slate-900">
                ~{amount ? Math.floor(parseFloat(amount) / 3.5) : 0}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Total</span>
                <span className="text-lg font-bold text-[#5da28c]">₦{amount || '0.00'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount}
              className="flex-1 px-4 py-3 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] disabled:opacity-50 font-bold"
            >
              {loading ? 'Processing...' : 'Add Credit'}
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-500 text-center mt-4">
          Secure payment powered by Paystack
        </p>
      </div>
    </div>
  );
}