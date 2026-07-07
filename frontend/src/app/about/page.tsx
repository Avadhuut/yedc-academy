'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AboutPage() {
  const { user } = useAuth();

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
          <Link href="/about" className="text-white hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          {user && user.role === 'ADMIN' && (
            <Link href="/admin/courses" className="text-indigo-400 hover:text-indigo-355 transition-colors font-semibold">Admin Panel</Link>
          )}
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
      <section className="z-10 max-w-3xl w-full mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight text-center md:text-left">
          About YEDC Academy
        </h1>
        <p className="text-base text-neutral-400 leading-relaxed mb-6 font-medium">
          The Young Entrepreneur Development Centre (YEDC) was founded with a singular, powerful mission: to bridge the gap between academic business theories and the high-velocity realities of building scalable startups in India.
        </p>
        <p className="text-sm text-neutral-500 leading-relaxed mb-8">
          Traditional business schools often focus heavily on corporate case studies and management heuristics. At YEDC, we believe that launching a successful startup requires practical, execution-first frameworks: validating customer demand before writing code, constructing agile minimum viable products, scaling customer acquisition channels profitably, and understanding unit economics deeply.
        </p>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 shadow-md">
            <h4 className="font-bold text-white text-sm mb-2">Practical Masterclasses</h4>
            <p className="text-xs text-neutral-400">Step-by-step guides showing execution, not just high-level slides.</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 shadow-md">
            <h4 className="font-bold text-white text-sm mb-2">Unicorn Mentors</h4>
            <p className="text-xs text-neutral-400">Learn directly from individuals who have scaled startups to millions of users.</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 shadow-md">
            <h4 className="font-bold text-white text-sm mb-2">Funding Readiness</h4>
            <p className="text-xs text-neutral-400">Understand what investors look for and pitch with confidence.</p>
          </div>
        </div>

        <div className="text-center md:text-left">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/25 border border-indigo-500/30 transition-all"
          >
            Explore our curriculum
          </Link>
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
