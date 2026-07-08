'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Payment {
  id: number;
  transactionId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paidAt: string;
}

export default function AdminPaymentsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:8080/api/v1/admin/payments', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && Array.isArray(result.data)) {
          setPayments(result.data);
        }
      })
      .catch((err) => console.error('Failed to load payments', err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter payments by search query
  const filtered = payments.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.studentEmail.toLowerCase().includes(q) ||
      p.courseTitle.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q)
    );
  });

  // Compute totals
  const totalSuccessRevenue = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const successCount = payments.filter((p) => p.status === 'SUCCESS').length;

  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-200 relative overflow-hidden flex flex-col">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Global Header */}
      <header className="z-10 bg-neutral-950/60 backdrop-blur-md border-b border-neutral-900/60 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base shadow-lg shadow-indigo-600/35">Y</span>
          YEDC Admin
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/admin/courses" className="hover:text-white transition-colors">Courses</Link>
          <Link href="/admin/students" className="hover:text-white transition-colors">Students</Link>
          <Link href="/admin/payments" className="text-white hover:text-white transition-colors">Payments</Link>
          <span className="text-neutral-700">|</span>
          <Link href="/courses" className="hover:text-white transition-colors">Public Site</Link>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-neutral-400">Control Panel</span>
        </div>
      </header>

      {/* Main Content */}
      <section className="z-10 max-w-6xl w-full mx-auto px-6 py-12 flex-1 flex flex-col space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Payment History</h1>
            <p className="text-sm text-neutral-400">Complete audit log of all student transactions</p>
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by student, course, or Txn ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-indigo-500/80 transition-all"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 shadow-lg shadow-black/15">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Total Revenue</span>
            <h3 className="text-2xl font-extrabold text-white mt-2">₹{totalSuccessRevenue.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] text-green-400 font-semibold mt-1">✓ Completed transactions</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 shadow-lg shadow-black/15">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Successful Payments</span>
            <h3 className="text-2xl font-extrabold text-white mt-2">{successCount}</h3>
            <p className="text-[10px] text-indigo-400 font-semibold mt-1">ℹ Cleared receipts</p>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 shadow-lg shadow-black/15">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Total Records</span>
            <h3 className="text-2xl font-extrabold text-white mt-2">{payments.length}</h3>
            <p className="text-[10px] text-neutral-500 font-semibold mt-1">📋 All transaction records</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/40 text-neutral-400 uppercase font-semibold tracking-wider">
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Txn ID</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-900/10 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-white font-bold">{p.studentName}</div>
                      <div className="text-[10px] text-neutral-500 font-semibold">{p.studentEmail}</div>
                    </td>
                    <td className="px-5 py-4 text-neutral-300 max-w-[160px]">
                      <span className="block truncate">{p.courseTitle}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-[10px] text-neutral-400 bg-neutral-950/60 px-2 py-0.5 rounded border border-neutral-800">
                        {p.transactionId}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white font-extrabold">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'SUCCESS'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : p.status === 'PENDING'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-400 whitespace-nowrap">{formatDate(p.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-neutral-500 font-semibold">
              No payment records found.
            </div>
          )}
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-6 mt-12">
        <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-neutral-600 font-medium">
            © 2026 Young Entrepreneur Development Centre. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
