'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      router.push('/dashboard');
      router.refresh();
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
    <div className="bg-[#f9fafb] dark:bg-[#18181b] min-h-screen flex flex-col items-center justify-center p-4 selection:bg-primary/20 selection:text-primary font-display">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        
        body {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>

      <main className="w-full max-w-[480px] animate-in fade-in zoom-in duration-500 ease-out">
        <div className="bg-white dark:bg-[#27272a] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-zinc-800 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5da18b] to-transparent opacity-60"></div>
          
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="h-12 w-12 rounded-xl bg-[#5da18b]/10 flex items-center justify-center text-[#5da18b] transition-transform group-hover:scale-110 duration-300">
                <span className="material-symbols-outlined text-[28px]">phone_in_talk</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                VoicePass
              </h1>
            </div>
            
            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create an Account</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sign up to access the billing dashboard
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-900 dark:text-slate-200" htmlFor="fullname">
                Full Name
              </label>
              <input
                className="flex h-11 w-full rounded-lg border border-[#e4e4e7] dark:border-[#3f3f46] bg-transparent px-3 py-1 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5da18b] focus-visible:border-[#5da18b]"
                id="fullname"
                placeholder="John Doe"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-900 dark:text-slate-200" htmlFor="email">
                Email Address
              </label>
              <input
                className="flex h-11 w-full rounded-lg border border-[#e4e4e7] dark:border-[#3f3f46] bg-transparent px-3 py-1 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5da18b] focus-visible:border-[#5da18b]"
                id="email"
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-900 dark:text-slate-200" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <input
                  className="flex h-11 w-full rounded-lg border border-[#e4e4e7] dark:border-[#3f3f46] bg-transparent px-3 py-1 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5da18b] focus-visible:border-[#5da18b] pr-10"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-900 dark:text-slate-200" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  className="flex h-11 w-full rounded-lg border border-[#e4e4e7] dark:border-[#3f3f46] bg-transparent px-3 py-1 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5da18b] focus-visible:border-[#5da18b] pr-10"
                  id="confirm-password"
                  placeholder="••••••••"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-colors bg-[#5da18b] text-white hover:bg-[#4a8572] h-11 px-8 w-full shadow-sm mt-4 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account? 
            <Link className="font-semibold text-[#5da18b] hover:text-[#4a8572] hover:underline underline-offset-4 transition-colors ml-1" href="/login">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 flex justify-center items-center gap-2 text-slate-400 dark:text-slate-600 opacity-80">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span className="text-xs font-medium">Secured by VoicePass</span>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23000000\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
    </div>
  );
}