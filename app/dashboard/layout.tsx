'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { UserProvider, SessionUser } from '../contexts/UserContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Handle cases where user is not authenticated or other errors
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Call Logs', href: '/dashboard/calls', icon: 'list_alt' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: 'analytics' },
  ];

  if (!loadingUser) {
    if (user?.role === 'admin') {
      navigation.push({ name: 'Users', href: '/dashboard/users', icon: 'group' });
    } else {
      navigation.push(
        { name: 'Billing', href: '/dashboard/billing', icon: 'credit_card' },
        { name: 'Settings', href: '/dashboard/settings', icon: 'settings' }
      );
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  // Helper for avatar initial
  const getAvatarInitial = (name: string | undefined | null) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  return (
    <UserProvider user={user}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        
        body {
          font-family: 'Manrope', sans-serif;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="flex h-screen w-full bg-[#f9fafa]">
        {/* Sidebar */}
        <aside className={`w-64 h-full flex flex-col bg-white border-r border-slate-200 shrink-0 z-20 transition-all duration-300 md:flex ${isSidebarOpen ? 'flex' : 'hidden'}`}>
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-[#5da28c] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
              </div>
              <div>
                <h1 className="text-slate-900 text-lg font-bold leading-none tracking-tight">VoicePass</h1>
                <p className="text-slate-500 text-xs font-medium">Admin Console</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard' || pathname === '/'
                  : pathname.startsWith(item.href) && pathname !== '/dashboard';
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                    isActive
                      ? 'bg-[#5da28c]/10 text-[#4a8572]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#5da28c] rounded-r-full"></div>
                  )}
                  <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                    {item.icon}
                  </span>
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Footer */}
          <div className="p-4 border-t border-slate-100">
            {loadingUser ? (
              <div className="flex items-center gap-3 p-2 rounded-lg animate-pulse">
                <div className="size-9 rounded-full bg-slate-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="size-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                  {getAvatarInitial(user?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Guest'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'guest@example.com'}</p>
                </div>
                <button onClick={handleLogout}>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">logout</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f9fafa] relative">
          {/* Top Header */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm">
             <button className="md:hidden p-2 text-slate-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowOTPModal(true)}
                className="flex items-center gap-2 bg-[#5da28c] hover:bg-[#4a8572] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Send OTP
              </button>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <OTPModal onClose={() => setShowOTPModal(false)} />
      )}
    </UserProvider>
  );
}

function OTPModal({ onClose }: { onClose: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate call');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Send Voice OTP</h2>

        {success ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg font-semibold text-green-600">
              OTP call initiated successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-900">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+2348012345678"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] outline-none text-slate-900"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-900">
                OTP Code
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#5da28c] outline-none text-slate-900"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                disabled={loading}
                className="flex-1 px-4 py-3 bg-[#5da28c] text-white rounded-lg hover:bg-[#4a8572] disabled:opacity-50 font-bold"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}