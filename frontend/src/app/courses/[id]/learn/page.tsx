'use client';
import API_BASE_URL from '@/config/api';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
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
  instructor: { name: string; profileImage: string };
  sections: Section[];
}

interface ProgressRecord {
  lessonId: number;
  completed: boolean;
  watchPercentage: number;
}

export default function LearnPage({ params }: { params: { id: string } }) {
  const { user, token } = useAuth();
  const router = useRouter();
  
  // Data States
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [progressRecords, setProgressRecords] = useState<Record<number, ProgressRecord>>({});
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeLessonDetails, setActiveLessonDetails] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonloadError, setLessonLoadError] = useState('');
  
  // Video progress reporting throttling state
  const [lastReportedPercentage, setLastReportedPercentage] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/courses/${params.id}/learn`);
    }
  }, [user, router, params.id]);

  const handleDownloadCertificate = async () => {
    if (!token) return;
    setDownloadingCert(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${params.id}/certificates/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.status === 'SUCCESS' && result.data?.certificateNumber) {
        window.open(`${API_BASE_URL}/certificates/${result.data.certificateNumber}/download`, '_blank');
      } else {
        alert(result.message || 'Failed to claim certificate.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to server.');
    } finally {
      setDownloadingCert(false);
    }
  };

  // Load Course & Syllabus & Progress
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    // Fetch course details
    fetch(`${API_BASE_URL}/courses/${params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && result.data) {
          // If not enrolled, redirect back to course details
          if (!result.data.enrolled) {
            router.push(`/courses/${params.id}`);
            return;
          }
          setCourse(result.data);
          
          // Select first lesson by default
          if (result.data.sections && result.data.sections.length > 0) {
            const firstSec = result.data.sections.sort((a: Section, b: Section) => a.displayOrder - b.displayOrder)[0];
            if (firstSec.lessons && firstSec.lessons.length > 0) {
              const firstLes = firstSec.lessons.sort((a: Lesson, b: Lesson) => a.displayOrder - b.displayOrder)[0];
              setActiveLesson(firstLes);
            }
          }
        } else {
          router.push(`/courses/${params.id}`);
        }
      })
      .catch((err) => {
        console.error('Failed to load course details', err);
        router.push(`/courses/${params.id}`);
      });

    // Fetch user progress for this course
    fetch(`${API_BASE_URL}/me/progress?courseId=${params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && Array.isArray(result.data)) {
          const recordsMap: Record<number, ProgressRecord> = {};
          result.data.forEach((rec: ProgressRecord) => {
            recordsMap[rec.lessonId] = rec;
          });
          setProgressRecords(recordsMap);
        }
      })
      .catch((err) => console.error('Failed to load progress records', err))
      .finally(() => setLoading(false));
  }, [params.id, token, router]);

  // Fetch full details (secure video URL) of the active lesson
  useEffect(() => {
    if (!activeLesson || !token) return;
    
    setLessonLoadError('');
    setLastReportedPercentage(0);
    
    fetch(`${API_BASE_URL}/lessons/${activeLesson.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && result.data) {
          setActiveLessonDetails(result.data);
        } else {
          setLessonLoadError(result.message || 'Failed to load lesson content.');
        }
      })
      .catch(() => setLessonLoadError('Connection error while fetching lesson content.'));
  }, [activeLesson, token]);

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Report progress helper
  const reportProgress = (lessonId: number, watchPercentage: number, completed: boolean) => {
    if (!token) return;

    fetch(`${API_BASE_URL}/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ watchPercentage, completed })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'SUCCESS' && result.data) {
          setProgressRecords((prev) => ({
            ...prev,
            [lessonId]: {
              lessonId,
              completed: result.data.completed,
              watchPercentage: result.data.watchPercentage
            }
          }));
        }
      })
      .catch((err) => console.error('Failed to update progress', err));
  };

  // Video timeupdate tracking
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.duration || !activeLesson) return;
    
    const percentage = Math.round((video.currentTime / video.duration) * 100);
    // Report in increments of 5% to reduce server load
    if (percentage > lastReportedPercentage && percentage % 5 === 0) {
      reportProgress(activeLesson.id, percentage, percentage >= 90);
      setLastReportedPercentage(percentage);
    }
  };

  const handleVideoEnded = () => {
    if (!activeLesson) return;
    reportProgress(activeLesson.id, 100, true);
  };

  // Manual complete toggle
  const toggleComplete = () => {
    if (!activeLesson) return;
    const isCompleted = progressRecords[activeLesson.id]?.completed || false;
    reportProgress(activeLesson.id, isCompleted ? 0 : 100, !isCompleted);
  };

  // Find next lesson
  const getNextLesson = (): Lesson | null => {
    if (!activeLesson) return null;
    const allLessons: Lesson[] = [];
    course.sections
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .forEach((sec) => {
        sec.lessons
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .forEach((l) => allLessons.push(l));
      });

    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  const nextLesson = getNextLesson();

  const handleNextLessonClick = () => {
    if (nextLesson) {
      setActiveLesson(nextLesson);
    }
  };

  // Format second duration to string
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    return `${mins} min`;
  };

  // Calculate overall completed count
  const allLessonsList: Lesson[] = [];
  course.sections.forEach(s => s.lessons.forEach(l => allLessonsList.push(l)));
  const completedCount = allLessonsList.filter(l => progressRecords[l.id]?.completed).length;
  const totalLessonsCount = allLessonsList.length;
  const overallProgressPercentage = totalLessonsCount > 0 ? Math.round((completedCount * 100) / totalLessonsCount) : 0;

  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-200 flex flex-col overflow-hidden">
      
      {/* Header bar */}
      <header className="z-10 bg-neutral-950 border-b border-neutral-900 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/courses/${course.id}`}
            className="px-3.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white leading-none line-clamp-1">{course.title}</h1>
            <p className="text-[10px] text-neutral-500 mt-1 font-semibold">By {course.instructor.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          {overallProgressPercentage === 100 && (
            <button
              onClick={handleDownloadCertificate}
              disabled={downloadingCert}
              className="py-2 px-3 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-green-600/20 border border-green-500/30 cursor-pointer disabled:opacity-50"
            >
              {downloadingCert ? 'Claiming...' : '🎓 Download Certificate'}
            </button>
          )}
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white">Course Progress: {completedCount}/{totalLessonsCount} completed</p>
            <div className="w-40 bg-neutral-900 rounded-full h-1 mt-1.5 overflow-hidden border border-neutral-850">
              <div
                className="bg-indigo-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Media Pane (Left/Center) */}
        <section className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
          {/* Player Wrapper */}
          <div className="w-full aspect-video rounded-2xl bg-black border border-neutral-900 overflow-hidden shadow-2xl relative">
            {lessonloadError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-3xl mb-3">⚠️</span>
                <p className="text-sm font-bold text-white">{lessonloadError}</p>
                <p className="text-xs text-neutral-500 mt-1">Please try re-selecting the lesson or contact support.</p>
              </div>
            ) : activeLessonDetails ? (
              <video
                ref={videoRef}
                src={activeLessonDetails.videoUrl || ''}
                controls
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                className="w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Lesson Details Info */}
          {activeLesson && (
            <div className="space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">{activeLesson.title}</h2>
                  <p className="text-xs text-neutral-500 mt-1 font-semibold">Section Lesson • Duration: {formatSeconds(activeLesson.duration)}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={toggleComplete}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      progressRecords[activeLesson.id]?.completed
                        ? 'bg-green-600/10 border-green-500/20 text-green-400 hover:bg-green-600/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500/30 text-white shadow-md shadow-indigo-600/10'
                    }`}
                  >
                    {progressRecords[activeLesson.id]?.completed ? '✓ Completed' : 'Mark as Complete'}
                  </button>

                  {nextLesson && (
                    <button
                      onClick={handleNextLessonClick}
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Next Lesson →
                    </button>
                  )}
                </div>
              </div>

              {/* Resource Material Card */}
              {activeLessonDetails?.pdfUrl && (
                <div className="bg-neutral-900/40 border border-neutral-850 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-md shadow-black/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg text-indigo-400">
                      📄
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Lesson Resources & Slides</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 font-medium">Download auxiliary notes and code guidelines for this masterclass.</p>
                    </div>
                  </div>
                  <a
                    href={activeLessonDetails.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-4 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer shadow shadow-black/10"
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Syllabus Navigation Sidebar (Right) */}
        <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-neutral-900 bg-neutral-950/60 backdrop-blur-md flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-neutral-900 shrink-0">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Course Syllabus</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900/60">
            {course.sections
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((section) => (
                <div key={section.id} className="p-4 space-y-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Section {section.displayOrder}</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{section.title}</h4>
                  </div>
                  
                  <div className="space-y-1.5">
                    {section.lessons
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((lesson) => {
                        const isSelected = activeLesson?.id === lesson.id;
                        const isCompleted = progressRecords[lesson.id]?.completed || false;
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full p-2.5 rounded-lg flex items-center justify-between text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow shadow-indigo-600/25'
                                : 'bg-neutral-950/40 hover:bg-neutral-900 text-neutral-450 hover:text-neutral-200 border border-neutral-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                isCompleted
                                  ? isSelected
                                    ? 'bg-white text-indigo-600'
                                    : 'bg-green-600 text-white shadow shadow-green-600/10'
                                  : isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-neutral-900 border border-neutral-800'
                              }`}>
                                {isCompleted ? '✓' : lesson.displayOrder}
                              </div>
                              <div className="min-w-0">
                                <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                                  {lesson.title}
                                </p>
                                <span className={`text-[9px] font-medium block mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-neutral-500'}`}>
                                  {formatSeconds(lesson.duration)}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
          </div>
        </aside>

      </div>
    </main>
  );
}
