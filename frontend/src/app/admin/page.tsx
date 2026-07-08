'use client';
import API_BASE_URL from '@/config/api';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface RecentEnrollment {
  id: number;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  purchasedAt: string;
}

interface CourseRevenue {
  courseId: number;
  courseTitle: string;
  revenue: number;
  enrollmentCount: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  recentEnrollments: RecentEnrollment[];
  courseRevenues: CourseRevenue[];
}

export default function AdminDashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/admin/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && result.data) {
          setData(result.data);
        }
      })
      .catch((err) => console.error('Failed to load analytics', err))
      .finally(() => setLoading(false));
  }, [token]);

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          YEDC Admin
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <Link href="/admin" className="text-white hover:text-white transition-colors">Dashboard</Link>
          <Link href="/admin/courses" className="hover:text-white transition-colors">Courses</Link>
          <Link href="/admin/students" className="hover:text-white transition-colors">Students</Link>
          <Link href="/admin/payments" className="hover:text-white transition-colors">Payments</Link>
          <span className="text-neutral-700">|</span>
          <Link href="/courses" className="hover:text-white transition-colors">Public Site</Link>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-neutral-400">Control Panel</span>
        </div>
      </header>

      {/* Main Container */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-12 flex-1 flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-sm text-neutral-400">Monitor financial reports, course enrollments, and student demographics</p>
        </div>

        {/* Counter cards */}
        {data && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 shadow-lg shadow-black/15 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Total Sales</span>
              <h3 className="text-2xl font-extrabold text-white mt-2">₹{data.totalRevenue.toLocaleString('en-IN')}</h3>
              <p className="text-[10px] text-green-400 font-semibold mt-1">✓ Complete payments</p>
            </div>
            
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 shadow-lg shadow-black/15 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Active Students</span>
              <h3 className="text-2xl font-extrabold text-white mt-2">{data.totalStudents}</h3>
              <p className="text-[10px] text-indigo-400 font-semibold mt-1">ℹ Registered accounts</p>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 shadow-lg shadow-black/15 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Active Modules</span>
              <h3 className="text-2xl font-extrabold text-white mt-2">{data.totalCourses}</h3>
              <p className="text-[10px] text-neutral-450 font-semibold mt-1">📚 Configured courses</p>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 shadow-lg shadow-black/15 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Sales Vol</span>
              <h3 className="text-2xl font-extrabold text-white mt-2">{data.totalEnrollments}</h3>
              <p className="text-[10px] text-indigo-450 font-semibold mt-1">🎟 Course enrollments</p>
            </div>
          </div>
        )}

        {/* Dashboard Panels Grid */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Course Revenues Breakdown */}
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 shadow-xl shadow-black/20 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Popular Courses</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Revenue generated by active masterclasses</p>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {data.courseRevenues.map((course) => (
                  <div key={course.courseId} className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-900/80 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{course.courseTitle}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 font-semibold">{course.enrollmentCount} enrollments</p>
                    </div>
                    <span className="text-xs font-extrabold text-white whitespace-nowrap">
                      ₹{course.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                {data.courseRevenues.length === 0 && (
                  <p className="text-xs text-neutral-500 py-6 text-center">No transactions recorded yet.</p>
                )}
              </div>
            </div>

            {/* Recent Enrollments */}
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 shadow-xl shadow-black/20 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Recent Enrollments</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Latest student registrations in the academy</p>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {data.recentEnrollments.map((entry) => (
                  <div key={entry.id} className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-900/80 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{entry.studentName}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 font-semibold truncate">{entry.studentEmail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-indigo-400 truncate">{entry.courseTitle}</p>
                      <p className="text-[9px] text-neutral-500 mt-0.5 font-semibold">{formatDate(entry.purchasedAt)}</p>
                    </div>
                  </div>
                ))}
                {data.recentEnrollments.length === 0 && (
                  <p className="text-xs text-neutral-500 py-6 text-center">No enrollments recorded yet.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-6 mt-auto">
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-neutral-600 font-medium">
            © 2026 Young Entrepreneur Development Centre. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
