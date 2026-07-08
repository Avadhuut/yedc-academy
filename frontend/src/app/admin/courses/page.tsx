'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Course {
  id: number;
  title: string;
  price: number;
  level: string;
  status: string;
  category: { name: string };
  instructor: { name: string };
}

export default function AdminCoursesPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
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

    fetch('http://localhost:8080/api/v1/admin/courses', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && Array.isArray(result.data)) {
          setCourses(result.data);
        }
      })
      .catch((err) => console.error('Failed to load courses', err))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleStatus = async (courseId: number, currentStatus: string) => {
    if (!token) return;
    setUpdatingId(courseId);
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/courses/${courseId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (res.ok && result.status === 'SUCCESS') {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, status: newStatus } : c))
        );
      } else {
        alert(result.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
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
          <Link href="/admin/courses" className="text-white hover:text-white transition-colors">Courses</Link>
          <Link href="/admin/students" className="hover:text-white transition-colors">Students</Link>
          <Link href="/admin/payments" className="hover:text-white transition-colors">Payments</Link>
          <span className="text-neutral-700">|</span>
          <Link href="/courses" className="hover:text-white transition-colors">Public Site</Link>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-neutral-400">Control Panel</span>
        </div>
      </header>

      {/* Management Grid */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-12 flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Course Management</h1>
            <p className="text-sm text-neutral-400">Add, configure, and publish academy modules</p>
          </div>
          <Link
            href="/admin/courses/new"
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/20 border border-indigo-500/30 transition-all"
          >
            + Create New Course
          </Link>
        </div>

        {/* Courses Table */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/40 text-neutral-400 uppercase font-semibold tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Instructor</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-neutral-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-bold">{course.title}</div>
                      <div className="text-[10px] text-neutral-500 font-semibold">{course.level}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">{course.category.name}</td>
                    <td className="px-6 py-4 text-neutral-300">{course.instructor.name}</td>
                    <td className="px-6 py-4 text-neutral-300">₹{course.price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        course.status === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700/60'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(course.id, course.status)}
                        disabled={updatingId === course.id}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                          course.status === 'ACTIVE'
                            ? 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                            : 'bg-green-600/10 text-green-400 border-green-500/20 hover:bg-green-600/20'
                        }`}
                      >
                        {course.status === 'ACTIVE' ? 'Archive' : 'Publish'}
                      </button>
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 text-neutral-300 hover:text-white rounded text-[10px] font-bold transition-all"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="py-20 text-center text-neutral-500 font-semibold">
              No courses configured. Click the button above to launch one!
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
