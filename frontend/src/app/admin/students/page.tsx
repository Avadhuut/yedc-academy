'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserAccount {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminStudentsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:8080/api/v1/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && Array.isArray(result.data)) {
          setUsers(result.data);
        }
      })
      .catch((err) => console.error('Failed to load users', err))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleUserStatus = async (userId: number, currentStatus: string) => {
    if (!token) return;
    setUpdatingId(userId);
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (res.ok && result.status === 'SUCCESS') {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
      } else {
        alert(result.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating user status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter users by search query
  const filteredUsers = users.filter((u) => {
    const matchQuery = searchQuery.trim().toLowerCase();
    if (matchQuery === '') return true;
    return (
      u.fullName.toLowerCase().includes(matchQuery) ||
      u.email.toLowerCase().includes(matchQuery)
    );
  });

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
          <Link href="/admin/students" className="text-white hover:text-white transition-colors">Students</Link>
          <Link href="/admin/payments" className="hover:text-white transition-colors">Payments</Link>
          <span className="text-neutral-700">|</span>
          <Link href="/courses" className="hover:text-white transition-colors">Public Site</Link>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-neutral-400">Control Panel</span>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-12 flex-1 flex flex-col space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Student Management</h1>
            <p className="text-sm text-neutral-400">View user metadata and deactivate/activate student memberships</p>
          </div>
          
          {/* Keyword Search */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-indigo-500/80 transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/40 text-neutral-400 uppercase font-semibold tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {filteredUsers.map((acc) => (
                  <tr key={acc.id} className="hover:bg-neutral-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-bold">{acc.fullName}</div>
                      <div className="text-[10px] text-neutral-500 font-semibold">{acc.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-350">{acc.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        acc.role === 'ADMIN'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {acc.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">{formatDate(acc.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        acc.status === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {acc.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleUserStatus(acc.id, acc.status)}
                          disabled={updatingId === acc.id}
                          className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                            acc.status === 'ACTIVE'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                              : 'bg-green-600/10 text-green-400 border border-green-500/20 hover:bg-green-600/20'
                          }`}
                        >
                          {updatingId === acc.id ? (
                            <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                          ) : acc.status === 'ACTIVE' ? (
                            'Deactivate'
                          ) : (
                            'Reactivate'
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-20 text-center text-neutral-500 font-semibold">
              No matching registered accounts found.
            </div>
          )}
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-6 mt-12">
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-neutral-600 font-medium">
            © 2026 Young Entrepreneur Development Centre. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
