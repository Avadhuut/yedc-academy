'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Lesson {
  id: number;
  title: string;
  videoUrl: string | null;
  pdfUrl: string | null;
  duration: number;
  previewEnabled: boolean;
  displayOrder: number;
}

interface Section {
  id: number;
  title: string;
  displayOrder: number;
  lessons: Lesson[];
}

interface CourseDetails {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  thumbnail: string;
  language: string;
  level: string;
  duration: string;
  category: { name: string };
  instructor: { name: string; bio: string; experience: string; profileImage: string };
  sections: Section[];
}

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  
  // Preview video modal state
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/courses/${params.id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && result.data) {
          setCourse(result.data);
          // Open first section by default
          if (result.data.sections && result.data.sections.length > 0) {
            setOpenSections({ [result.data.sections[0].id]: true });
          }
        }
      })
      .catch((err) => console.error('Failed to load course details', err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Course not found</h2>
        <p className="text-sm text-neutral-500 mb-6">The course you are looking for does not exist or has been archived.</p>
        <Link href="/courses" className="px-6 py-3 bg-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-all">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const toggleSection = (sectionId: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
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

      {/* Course Hero Banner */}
      <section className="z-10 bg-neutral-950/40 border-b border-neutral-900/80 py-12 px-6">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="inline-flex items-center py-1 px-2.5 rounded text-[10px] font-bold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
              {course.category.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 font-medium">
              {course.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-semibold pt-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {course.duration} Duration
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                {course.level} Level
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 7.31 16.5 3 18" /></svg>
                {course.language} Audio
              </span>
            </div>
          </div>
          <div className="md:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/40 text-center flex flex-col items-center">
            <div className="w-full aspect-video rounded-xl bg-neutral-950 overflow-hidden mb-5">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            </div>
            <div className="text-3xl font-extrabold text-white mb-2">₹{course.price}</div>
            <p className="text-xs text-neutral-500 mb-5 font-semibold">One-time payment • Lifetime access</p>
            <Link
              href="/login"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/25 border border-indigo-500/30 transition-all"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      {/* Details Sections */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Core Info & Syllabus (left) */}
        <div className="md:col-span-2 space-y-10">
          {/* About */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">About this Course</h2>
            <p className="text-sm text-neutral-400 leading-relaxed font-medium">
              {course.description}
            </p>
          </div>

          {/* Curriculum */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Course Curriculum</h2>
            <p className="text-xs text-neutral-500 mb-6">Explore the sections and preview available lessons</p>

            <div className="space-y-3">
              {course.sections.map((section) => (
                <div key={section.id} className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/20">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-5 py-4 flex justify-between items-center bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors text-left"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">
                        Section {section.displayOrder}
                      </span>
                      <h4 className="text-sm font-bold text-white">{section.title}</h4>
                    </div>
                    <svg
                      className={`w-5 h-5 text-neutral-500 transform transition-transform ${openSections[section.id] ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openSections[section.id] && (
                    <div className="border-t border-neutral-900/60 divide-y divide-neutral-900/60 bg-neutral-950/50">
                      {section.lessons.map((lesson) => (
                        <div key={lesson.id} className="px-5 py-3.5 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            {lesson.previewEnabled ? (
                              <button
                                onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                                className="w-6 h-6 rounded-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 flex items-center justify-center cursor-pointer transition-colors"
                              >
                                <svg className="w-3 h-3 fill-indigo-400 pl-0.5" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </button>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-neutral-900 text-neutral-600 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-neutral-200">{lesson.title}</p>
                              <span className="text-[10px] text-neutral-500 font-medium">Duration: {formatDuration(lesson.duration)}</span>
                            </div>
                          </div>
                          {lesson.previewEnabled && (
                            <button
                              onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Watch Preview
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructor panel (right) */}
        <div className="md:col-span-1">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 shadow-lg shadow-black/10">
            <h3 className="text-base font-bold text-white mb-4">Your Instructor</h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={course.instructor.profileImage}
                alt={course.instructor.name}
                className="w-14 h-14 rounded-full object-cover border border-neutral-800"
              />
              <div>
                <h4 className="font-bold text-white text-sm">{course.instructor.name}</h4>
                <p className="text-[10px] text-neutral-500 font-semibold">{course.instructor.experience}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              {course.instructor.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Video Modal Overlay */}
      {previewVideoUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Lesson Preview</h3>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-neutral-500 hover:text-white transition-colors font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-video bg-black">
              {/* Using standard HTML5 video tag to play preview video */}
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-6 mt-auto">
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
