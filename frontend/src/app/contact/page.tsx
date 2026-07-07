'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);

    // Mock send request
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-200 relative overflow-hidden flex flex-col">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Global Header */}
      <header className="z-10 bg-neutral-950/60 backdrop-blur-md border-b border-neutral-900/60 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base shadow-lg shadow-indigo-600/35">Y</span>
          YEDC Academy
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/courses" className="hover:text-white transition-colors">Explore Courses</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="text-white hover:text-white transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/profile" className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/10">
              Dashboard ({user.fullName.split(' ')[0]})
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Content wrapper */}
      <section className="z-10 max-w-lg w-full mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Get in touch</h1>
          <p className="text-sm text-neutral-400">Have questions about our syllabus or startup programs?</p>
        </div>

        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-8 shadow-2xl shadow-black/50">
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs py-3 px-4 rounded-lg mb-6 text-center">
              Message sent successfully! We will get back to you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => { setName(e.target.value); if (success) setSuccess(false); }}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (success) setSuccess(false); }}
                placeholder="john@company.com"
                className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => { setMessage(e.target.value); if (success) setSuccess(false); }}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 border border-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-6">
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-neutral-600 font-medium">
            © 2026 Young Entrepreneur Development Centre. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-neutral-500 font-semibold">
            <Link href="/about" className="hover:text-neutral-400 transition-colors">Philosophy</Link>
            <Link href="/contact" className="hover:text-neutral-400 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
