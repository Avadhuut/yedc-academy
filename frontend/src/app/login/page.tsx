'use client';
import API_BASE_URL from '@/config/api';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotEmail, setForgotPasswordEmail] = useState('');
  const [forgotMessage, setForgotPasswordMessage] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/profile';
      router.push(redirect);
    } catch (err) {
      // error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (response.ok) {
        setForgotPasswordMessage('A reset code has been sent (check server application logs).');
        setResetMode(true);
      } else {
        const data = await response.json();
        setForgotPasswordMessage(data.message || 'Failed to send reset code.');
      }
    } catch (err) {
      setForgotPasswordMessage('Failed to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !resetCode || !newPassword) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, resetCode, newPassword }),
      });
      if (response.ok) {
        setForgotPasswordMessage('Password has been reset successfully. Please log in.');
        setTimeout(() => {
          setForgotPasswordMode(false);
          setResetMode(false);
          setEmail(forgotEmail);
          setForgotPasswordMessage('');
        }, 2000);
      } else {
        const data = await response.json();
        setForgotPasswordMessage(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setForgotPasswordMessage('Failed to connect to backend.');
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
          {!forgotPasswordMode ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-sm text-neutral-400 mb-6">Enter your credentials to access your account</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-lg mb-6 flex justify-between items-center animate-shake">
                  <span>{error}</span>
                  <button onClick={clearError} className="text-red-400 hover:text-red-300 transition-colors font-bold ml-2">✕</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) clearError(); }}
                    required
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordMode(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (error) clearError(); }}
                      required
                      placeholder="••••••••"
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
                  ) : 'Sign In'}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-neutral-500">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                    Create account
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-sm text-neutral-400 mb-6">
                {!resetMode ? 'Enter your email to receive a password reset verification code.' : 'Enter the code and your new password.'}
              </p>

              {forgotMessage && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs py-3 px-4 rounded-lg mb-6">
                  {forgotMessage}
                </div>
              )}

              {!resetMode ? (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : 'Request Reset Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Reset Verification Code</label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      required
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : 'Save New Password'}
                  </button>
                </form>
              )}

              <button
                onClick={() => {
                  setForgotPasswordMode(false);
                  setResetMode(false);
                  setForgotPasswordMessage('');
                  clearError();
                }}
                className="w-full mt-4 text-sm text-neutral-400 hover:text-neutral-300 font-medium transition-colors text-center"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
