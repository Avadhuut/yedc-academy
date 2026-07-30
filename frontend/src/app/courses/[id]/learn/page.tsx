"use client";
import API_BASE_URL from "@/config/api";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import {
  ArrowLeft,
  Award,
  Play,
  CheckCircle,
  FileText,
  ChevronRight,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  Check,
  Sparkles,
  BookOpen,
  ChevronDown,
  Layers,
} from "lucide-react";
import { getBlueprintDetails } from "@/utils/blueprint";

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
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  // Data States
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [progressRecords, setProgressRecords] = useState<Record<number, ProgressRecord>>({});
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeLessonDetails, setActiveLessonDetails] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonloadError, setLessonLoadError] = useState("");

  // Video progress reporting throttling state
  const [lastReportedPercentage, setLastReportedPercentage] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);

  // Active resource tab state
  const [activeResourceTab, setActiveResourceTab] = useState<'toolkit' | 'checklist' | 'overview'>("toolkit");
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/courses/${params.id}/learn`);
    }
  }, [user, authLoading, router, params.id]);

  const handleDownloadCertificate = async () => {
    if (!token) return;
    setDownloadingCert(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${params.id}/certificates/claim`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === "SUCCESS" && result.data?.certificateNumber) {
        window.open(`${API_BASE_URL}/certificates/${result.data.certificateNumber}/download`, "_blank");
      } else {
        alert(result.message || "Failed to claim certificate.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to server.");
    } finally {
      setDownloadingCert(false);
    }
  };

  // Load Course & Syllabus & Progress
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetch(`${API_BASE_URL}/courses/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && result.data) {
          let courseData = result.data;

          // Provide fallback roadmap sections if backend returns empty sections
          if (!courseData.sections || courseData.sections.length === 0) {
            const fallbackSections: Section[] = [
              {
                id: 301,
                title: "Module 1: Business Operations & Machinery Setup",
                displayOrder: 1,
                lessons: [
                  {
                    id: 3001,
                    title: "Standard Operating Procedures & Layout Planning",
                    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    duration: 900,
                    previewEnabled: true,
                    displayOrder: 1
                  },
                  {
                    id: 3002,
                    title: "Equipment Selection & Vendor Procurement",
                    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    pdfUrl: null,
                    duration: 1200,
                    previewEnabled: false,
                    displayOrder: 2
                  }
                ]
              },
              {
                id: 302,
                title: "Module 2: Compliance, Licensing & Scale",
                displayOrder: 2,
                lessons: [
                  {
                    id: 3003,
                    title: "FSSAI Registration & Legal Blueprint",
                    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    pdfUrl: null,
                    duration: 1100,
                    previewEnabled: false,
                    displayOrder: 1
                  }
                ]
              }
            ];
            courseData = { ...courseData, sections: fallbackSections };
          }

          setCourse(courseData);
          if (courseData.sections && courseData.sections.length > 0) {
            const firstSec = courseData.sections.sort(
              (a: Section, b: Section) => a.displayOrder - b.displayOrder
            )[0];
            if (firstSec.lessons && firstSec.lessons.length > 0) {
              setActiveLesson(firstSec.lessons.sort((a: Lesson, b: Lesson) => a.displayOrder - b.displayOrder)[0]);
            }
          }
        }
      })
      .catch((err) => console.error("Failed to load blueprint details", err));

    // Fetch user progress
    if (token) {
      fetch(`${API_BASE_URL}/me/progress?courseId=${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status === "SUCCESS" && Array.isArray(result.data)) {
            const map: Record<number, ProgressRecord> = {};
            result.data.forEach((rec: ProgressRecord) => {
              map[rec.lessonId] = rec;
            });
            setProgressRecords(map);
          }
        })
        .catch((err) => console.error("Failed to load progress records", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [params.id, token]);

  // Load active lesson details
  useEffect(() => {
    if (!activeLesson) return;
    setLessonLoadError("");

    if (token) {
      fetch(`${API_BASE_URL}/lessons/${activeLesson.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status === "SUCCESS" && result.data) {
            setActiveLessonDetails(result.data);
            setLastReportedPercentage(0);
          } else {
            setActiveLessonDetails(activeLesson);
          }
        })
        .catch(() => {
          setActiveLessonDetails(activeLesson);
        });
    } else {
      setActiveLessonDetails(activeLesson);
    }
  }, [activeLesson, params.id, token]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !token || !activeLesson) return;

    const currentPercent = Math.round((video.currentTime * 100) / video.duration);

    if (currentPercent >= lastReportedPercentage + 10 && currentPercent < 100) {
      setLastReportedPercentage(currentPercent);
      reportProgress(activeLesson.id, currentPercent, false);
    }
  };

  const handleVideoEnded = () => {
    const targetLessonId = activeLessonDetails?.id || activeLesson?.id;
    if (targetLessonId) {
      reportProgress(targetLessonId, 100, true);
    }
    if (autoAdvance && nextLesson) {
      setActiveLesson(nextLesson);
    }
  };

  const reportProgress = async (lessonId: number, percent: number, completed: boolean) => {
    // Optimistic local update
    setProgressRecords((prev) => ({
      ...prev,
      [lessonId]: { lessonId, watchPercentage: percent, completed },
    }));

    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ watchPercentage: percent, completed }),
      });
      const result = await res.json();
      if (result.status === "SUCCESS" && result.data) {
        setProgressRecords((prev) => ({
          ...prev,
          [lessonId]: {
            lessonId: result.data.lessonId || lessonId,
            watchPercentage: result.data.watchPercentage ?? percent,
            completed: result.data.completed ?? completed,
          },
        }));
      }
    } catch (err) {
      console.error("Progress report failed", err);
    }
  };

  const toggleComplete = () => {
    const currentLessonId = activeLessonDetails?.id || activeLesson?.id;
    if (!currentLessonId) return;
    const currentRecord = progressRecords[currentLessonId];
    const isCompleted = currentRecord ? currentRecord.completed : false;
    reportProgress(currentLessonId, isCompleted ? 0 : 100, !isCompleted);
  };

  const getNextLesson = (): Lesson | null => {
    if (!course || !activeLesson) return null;
    const sortedSections = [...course.sections].sort((a, b) => a.displayOrder - b.displayOrder);
    let foundActive = false;

    for (const section of sortedSections) {
      const sortedLessons = [...section.lessons].sort((a, b) => a.displayOrder - b.displayOrder);
      for (const lesson of sortedLessons) {
        if (foundActive) return lesson;
        if (lesson.id === activeLesson.id) {
          foundActive = true;
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();

  const handleNextLessonClick = () => {
    if (nextLesson) {
      setActiveLesson(nextLesson);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    return `${mins} min`;
  };

  if (loading || authLoading) {
    return (
      <main className="min-h-screen bg-[#0F172A] flex flex-col font-sans">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-[#0F172A] flex items-center justify-center font-sans p-6 text-center text-white">
        <div className="space-y-4">
          <AlertTriangle className="w-12 h-12 text-gold mx-auto" />
          <h2 className="text-xl font-bold font-heading">Access Forbidden</h2>
          <Link href="/profile">
            <PrimaryButton>Back to Dashboard</PrimaryButton>
          </Link>
        </div>
      </main>
    );
  }

  const allLessonsList: Lesson[] = [];
  course.sections.forEach((s) => s.lessons.forEach((l) => allLessonsList.push(l)));
  const completedCount = allLessonsList.filter((l) => progressRecords[l.id]?.completed).length;
  const totalLessonsCount = allLessonsList.length;
  const overallProgressPercentage =
    totalLessonsCount > 0 ? Math.round((completedCount * 100) / totalLessonsCount) : 0;

  const bp = getBlueprintDetails(course.title);

  return (
    <main className="min-h-screen bg-[#0B1120] text-[#0F172A] flex flex-col font-sans overflow-x-hidden">
      
      {/* Sleek Executive Dark Header */}
      <header className="z-30 bg-[#0F172A] border-b border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center shrink-0 shadow-lg">
        
        {/* Left: Back Button & Program Branding */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link href={`/courses/${course.id}`}>
            <button className="h-9 px-3 rounded-[12px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Overview</span>
            </button>
          </Link>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 p-1 shrink-0 relative overflow-hidden hidden md:block">
              <Image src="/logo.png" alt="YEDC" fill className="object-contain p-0.5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-black text-white leading-tight font-heading truncate">
                {bp.blueprintTitle}
              </h1>
              <p className="text-[10px] font-bold text-gold/90 truncate">
                Mentor: {course.instructor.name}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Progress Meter & Certificate Claim */}
        <div className="flex items-center gap-4 shrink-0">
          {overallProgressPercentage === 100 && (
            <button
              onClick={handleDownloadCertificate}
              disabled={downloadingCert}
              className="h-9 px-3.5 rounded-full bg-gold hover:bg-gold-light text-[#0F172A] font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{downloadingCert ? "Claiming..." : "🎓 Claim Certificate"}</span>
            </button>
          )}

          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/70 py-1.5 px-3 rounded-full">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest leading-none">
                Progress: {completedCount}/{totalLessonsCount} ({overallProgressPercentage}%)
              </span>
            </div>
            <div className="w-20 sm:w-28 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
          </div>
        </div>

      </header>

      {/* Main Learning Workspace Container (Split 2-Column Cinema Mode) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Column: Proportioned Cinema Video Player & Lesson Resources (8 Cols) */}
        <section className="lg:col-span-8 flex flex-col overflow-y-auto bg-[#0F172A]/40 p-3 sm:p-5 lg:p-6 space-y-4 border-r border-slate-800">
          
          {/* Cinema Mode Video Viewport Box (Proportioned height so title & controls fit on screen) */}
          <div className="w-full aspect-video max-h-[58vh] rounded-[20px] overflow-hidden bg-slate-950 border border-slate-800 relative shadow-2xl shrink-0 select-none" onContextMenu={(e) => e.preventDefault()}>
            
            {/* DRM Anti-Piracy Dynamic Licensed Watermark Overlay */}
            <div className="absolute top-3 right-3 pointer-events-none z-20 bg-[#0F172A]/75 backdrop-blur-xs text-white/70 text-[10px] font-mono px-3 py-1 rounded-md border border-white/10 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Protected Content • YEDC Academy • Licensed to: {user?.email || "Student Access"}</span>
            </div>

            {activeLessonDetails ? (
              activeLessonDetails.videoUrl ? (
                <video
                  ref={videoRef}
                  src={activeLessonDetails.videoUrl || "/videos/sample.mp4"}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onError={(e) => {
                    const videoEl = e.currentTarget;
                    if (!videoEl.dataset.fallbackTried1) {
                      videoEl.dataset.fallbackTried1 = "true";
                      videoEl.src = "/videos/sample.mp4";
                      videoEl.load();
                      videoEl.play().catch(() => {});
                    } else if (!videoEl.dataset.fallbackTried2) {
                      videoEl.dataset.fallbackTried2 = "true";
                      videoEl.src = "https://www.w3schools.com/html/mov_bbb.mp4";
                      videoEl.load();
                      videoEl.play().catch(() => {});
                    }
                  }}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-3 p-6 text-center bg-slate-900">
                  <FileText className="w-12 h-12 text-gold animate-bounce" />
                  <p className="text-xs font-bold text-white">This module is a reading & template resource.</p>
                  {activeLessonDetails.pdfUrl && (
                    <a
                      href={activeLessonDetails.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PrimaryButton className="text-xs h-10 px-5">Download Blueprint PDF</PrimaryButton>
                    </a>
                  )}
                </div>
              )
            ) : lessonloadError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-6 text-center space-y-3 bg-slate-900">
                <AlertTriangle className="w-10 h-10 text-gold" />
                <p className="text-xs font-bold">{lessonloadError}</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Module Action Toolbar */}
          {activeLessonDetails && (
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-[22px] shadow-sm space-y-4 text-left">
              
              {/* Header Title + Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div>
                  <span className="text-[10px] font-extrabold text-[#855B00] uppercase tracking-wider block">
                    ACTIVE MODULE ({formatSeconds(activeLessonDetails.duration)})
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-[#0F172A] font-heading leading-tight">
                    {activeLessonDetails.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={toggleComplete}
                    className={`h-9 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      progressRecords[activeLessonDetails.id]?.completed
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{progressRecords[activeLessonDetails.id]?.completed ? "Completed" : "Mark Complete"}</span>
                  </button>

                  {nextLesson && (
                    <PrimaryButton
                      onClick={handleNextLessonClick}
                      className="h-9 px-4 text-xs font-bold rounded-full shadow-xs flex items-center gap-1"
                    >
                      <span>Next Module</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </PrimaryButton>
                  )}
                </div>
              </div>

              {/* Resource Download & Execution Tabs */}
              <div className="space-y-3">
                <div className="flex gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
                  {[
                    { id: "toolkit", label: "Launch Toolkit Templates", icon: FileSpreadsheet },
                    { id: "checklist", label: "Execution Checklist", icon: CheckCircle },
                    { id: "overview", label: "Module Overview", icon: BookOpen }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeResourceTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveResourceTab(tab.id as any)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                          isActive
                            ? "bg-gold/15 text-[#855B00] border border-gold/30"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {activeResourceTab === "toolkit" && (
                  <div className="space-y-2.5 pt-1">
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Download editable financial & operational models for this blueprint phase:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {bp.toolkit.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 px-3 bg-slate-50 border border-slate-200/80 rounded-[14px] hover:border-gold/30 transition-all">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileSpreadsheet className="w-4 h-4 text-gold shrink-0" />
                            <span className="text-xs font-bold text-[#0F172A] truncate">{item}</span>
                          </div>
                          <button
                            onClick={() => alert(`Downloading template: ${item}`)}
                            className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-gold hover:border-gold transition-colors cursor-pointer shrink-0"
                            title={`Download ${item}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeResourceTab === "checklist" && (
                  <div className="space-y-2 pt-1 text-xs font-semibold text-slate-600">
                    <p className="font-bold text-[#0F172A]">Action items to complete for this phase:</p>
                    <div className="space-y-1.5 bg-slate-50 border border-slate-200/80 p-3 rounded-[14px]">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Perform local market sizing and demographic field survey</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Verify equipment electrical load and floorplan dimensions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>File state FSSAI food business registration code</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeResourceTab === "overview" && (
                  <div className="space-y-2 pt-1 text-xs text-slate-600 leading-relaxed font-semibold">
                    <p>{course.description}</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </section>

        {/* Right Column: Sleek Organized Business Roadmap Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 bg-white flex flex-col h-full overflow-hidden border-l border-slate-200">
          
          {/* Sidebar Top Header */}
          <div className="p-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold" />
              <h3 className="font-heading font-black text-xs text-[#0F172A] uppercase tracking-wider">
                Business Roadmap ({course.sections.length} Modules)
              </h3>
            </div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="rounded border-slate-300 text-gold focus:ring-gold"
              />
              <span>Auto-next</span>
            </label>
          </div>

          {/* Syllabus Modules Accordion List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-3 space-y-3">
            {course.sections
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((section) => {
                const sectionCompletedCount = section.lessons.filter(l => progressRecords[l.id]?.completed).length;

                return (
                  <div key={section.id} className="bg-slate-50/70 border border-slate-200/90 rounded-[18px] overflow-hidden p-3 space-y-2.5">
                    
                    {/* Section Title Header */}
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <div>
                        <span className="text-[9.5px] font-extrabold text-[#855B00] uppercase tracking-wider block">
                          Module {section.displayOrder}
                        </span>
                        <h4 className="text-xs font-black text-[#0F172A] font-heading line-clamp-1">
                          {section.title}
                        </h4>
                      </div>
                      <span className="text-[9.5px] font-extrabold bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full shrink-0">
                        {sectionCompletedCount}/{section.lessons.length} Done
                      </span>
                    </div>

                    {/* Lessons inside Section */}
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
                              className={`w-full p-2.5 rounded-[14px] border flex items-center justify-between text-left transition-all duration-200 cursor-pointer focus:outline-none ${
                                isSelected
                                  ? "bg-gold text-[#0F172A] border-transparent shadow-sm shadow-gold/20 font-bold"
                                  : "bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black ${
                                    isCompleted
                                      ? isSelected
                                        ? "bg-[#0F172A] text-gold"
                                        : "bg-emerald-500 text-white"
                                      : isSelected
                                      ? "bg-[#0F172A]/20 text-[#0F172A]"
                                      : "bg-slate-100 border border-slate-300 text-slate-500"
                                  }`}
                                >
                                  {isCompleted ? "✓" : lesson.displayOrder}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold truncate leading-snug">
                                    {lesson.title}
                                  </p>
                                  <span className={`text-[9.5px] block font-semibold mt-0.5 ${isSelected ? "text-[#0F172A]/70" : "text-slate-400"}`}>
                                    {formatSeconds(lesson.duration)}
                                  </span>
                                </div>
                              </div>

                              {isSelected && (
                                <Play className="w-3.5 h-3.5 fill-current shrink-0 ml-2 animate-pulse" />
                              )}
                            </button>
                          );
                        })}
                    </div>

                  </div>
                );
              })}
          </div>

        </aside>

      </div>
    </main>
  );
}
