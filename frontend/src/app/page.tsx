'use client';
import API_BASE_URL from '@/config/api';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Course {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  thumbnail: string;
  level: string;
  duration: string;
  category: { name: string };
  instructor: { name: string };
}

export default function Home() {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/courses`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && Array.isArray(result.data)) {
          setFeaturedCourses(result.data.slice(0, 3));
        }
      })
      .catch((err) => console.error('Failed to load courses', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-200 relative overflow-hidden flex flex-col">
      {/* Decorative background grids & blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Global Header */}
      <header className="z-10 bg-neutral-950/60 backdrop-blur-md border-b border-neutral-900/60 px-6 py-4 flex justify-between items-center sticky top-0">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base shadow-lg shadow-indigo-600/35">Y</span>
          YEDC Academy
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <Link href="/" className="text-white hover:text-white transition-colors">Home</Link>
          <Link href="/courses" className="hover:text-white transition-colors">Explore Courses</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          {user && user.role === 'ADMIN' && (
            <Link href="/admin/courses" className="text-indigo-400 hover:text-indigo-350 transition-colors font-semibold">Admin Panel</Link>
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

      {/* Hero Section */}
      <section className="z-10 text-center max-w-4xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
          Empowering India's Next Generation Entrepreneurs
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-100 to-neutral-500 mb-6 leading-[1.1]">
          Launch Your Startup. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Scale Your Business.</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          India's leading platform for practical entrepreneurship, growth hacking, and investment readiness. Learn directly from venture capitalists and unicorn operators.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/courses" className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 border border-indigo-500/30">
            Browse All Courses
          </Link>
          <Link href="/about" className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-sm font-semibold bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800 transition-all">
            Our Philosophy
          </Link>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-8 border-y border-neutral-900 bg-neutral-950/30 backdrop-blur-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <h3 className="text-3xl font-extrabold text-white">10K+</h3>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1">Students Educated</p>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-white">50M+</h3>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1">Funding Raised</p>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-white">95%</h3>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1">Satisfaction Rate</p>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-white">40+</h3>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1">Unicorn Mentors</p>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Featured Courses</h2>
            <p className="text-sm text-neutral-400">Curated masterclasses to help you scale fast</p>
          </div>
          <Link href="/courses" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors flex items-center gap-1.5">
            View all courses
            <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group bg-neutral-900/40 border border-neutral-800/80 rounded-xl overflow-hidden hover:border-neutral-700/80 transition-all flex flex-col shadow-lg shadow-black/20 hover:-translate-y-1 duration-300"
              >
                <div className="relative h-44 w-full bg-neutral-950 overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded">
                    {course.category.name}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1">
                    {course.level} • {course.duration}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-4 flex-1">
                    {course.subtitle}
                  </p>
                  <div className="border-t border-neutral-800/60 pt-4 flex justify-between items-center">
                    <span className="text-xs text-neutral-400 font-medium">By {course.instructor.name}</span>
                    <span className="text-sm font-bold text-white">₹{course.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="z-10 bg-neutral-950 border-t border-neutral-900 py-10 px-6 mt-auto">
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
