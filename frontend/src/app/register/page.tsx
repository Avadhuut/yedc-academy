'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, error, clearError } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    setLoading(true);
    try {
      await register(fullName, email, password, phone || undefined);
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/';
      router.push(redirect);
    } catch (err) {
      // error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base shadow-lg shadow-indigo-600/35">Y</span>
            YEDC Academy
          </Link>
          <p className="text-sm text-neutral-500 mt-2">India's Entrepreneurship Education Hub</p>
        </div>

        {/* Auth Box */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
          <p className="text-sm text-neutral-400 mb-6">Join YEDC Academy and start your journey today</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-lg mb-6 flex justify-between items-center animate-shake">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-400 hover:text-red-300 transition-colors font-bold ml-2">✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); if (error) clearError(); }}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) clearError(); }}
                required
                placeholder="john@company.com"
                className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99999 99999"
                className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) clearError(); }}
                  required
                  placeholder="•••••••• (Min 6 chars)"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all cursor-pointer shadow-lg shadow-indigo-600/25 border border-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
