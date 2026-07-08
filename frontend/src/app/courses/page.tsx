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
  category: { id: number; name: string };
  instructor: { name: string };
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Load categories
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && Array.isArray(result.data)) {
          setCategories(result.data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch courses on category or load
  useEffect(() => {
    if (searchQuery.trim() !== '') return; // Let search handler take care of keyword query
    setLoading(true);
    let url = `${API_BASE_URL}/courses`;
    if (selectedCategory !== null) {
      url += `?categoryId=${selectedCategory}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && Array.isArray(result.data)) {
          setCourses(result.data);
        }
      })
      .catch((err) => console.error('Failed to load courses', err))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  // Execute keyword search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSelectedCategory(null);
      return;
    }
    setLoading(true);
    setSelectedCategory(null); // clear category filter on keyword submit

    fetch(`${API_BASE_URL}/courses/search?keyword=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && Array.isArray(result.data)) {
          setCourses(result.data);
        }
      })
      .catch((err) => console.error('Search failed', err))
      .finally(() => setLoading(false));
  };

  // Filter courses by Level client-side
  const filteredCourses = courses.filter((course) => {
    if (selectedLevel === 'ALL') return true;
    return course.level.toUpperCase() === selectedLevel.toUpperCase();
  });

  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-200 relative overflow-hidden flex flex-col">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Global Header */}
      <header className="z-10 bg-neutral-950/60 backdrop-blur-md border-b border-neutral-900/60 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base shadow-lg shadow-indigo-600/35">Y</span>
          YEDC Academy
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/courses" className="text-white hover:text-white transition-colors">Explore Courses</Link>
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

      {/* Explore catalog wrapper */}
      <div className="z-10 max-w-5xl w-full mx-auto px-6 py-12 flex-1 flex flex-col">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white mb-2">Explore Masterclasses</h1>
          <p className="text-sm text-neutral-400">Learn execution directly from successful founders & marketing operators</p>
        </div>

        {/* Filter bar */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 shadow-xl shadow-black/20 mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="md:col-span-2 relative flex gap-2">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer border border-indigo-500/30"
              >
                Search
              </button>
            </form>

            {/* Level filter */}
            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Level:</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
              >
                <option value="ALL">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="border-t border-neutral-800/60 pt-5">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Categories</label>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === null
                    ? 'bg-indigo-600 text-white border-indigo-500/30 shadow-md shadow-indigo-600/10'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-500/30 shadow-md shadow-indigo-600/10'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-12 h-12 text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-1">No courses found</h3>
            <p className="text-sm text-neutral-500">Try adjusting your filters or search keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
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
      </div>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-6 mt-12">
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
