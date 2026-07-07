'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
}

interface Instructor {
  id: number;
  name: string;
}

interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
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

interface LessonModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  sectionId: number | null;
  lessonId: number | null;
  title: string;
  videoUrl: string;
  pdfUrl: string;
  duration: number;
  previewEnabled: boolean;
  displayOrder: number;
}

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const { user, token } = useAuth();
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('details');

  // Form states (Details)
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [level, setLevel] = useState('BEGINNER');
  const [language, setLanguage] = useState('English');
  const [thumbnail, setThumbnail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [instructorId, setInstructorId] = useState('');

  // Dropdown options
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  // Curriculum states
  const [sections, setSections] = useState<Section[]>([]);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  
  // Section inline edit states
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');
  
  // Section creation inline state
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  
  // Lesson modal state
  const [lessonModal, setLessonModal] = useState<LessonModalState>({
    isOpen: false,
    mode: 'create',
    sectionId: null,
    lessonId: null,
    title: '',
    videoUrl: '',
    pdfUrl: '',
    duration: 0,
    previewEnabled: false,
    displayOrder: 1,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [curriculumActionLoading, setCurriculumActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [curriculumError, setCurriculumError] = useState<string | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Load course details, categories, and instructors
  const loadCourseData = async () => {
    if (!token) return;
    try {
      const [catRes, instRes, courseRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/categories'),
        fetch('http://localhost:8080/api/v1/instructors'),
        fetch(`http://localhost:8080/api/v1/admin/courses/${params.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const catData = await catRes.json();
      const instData = await instRes.json();
      const courseData = await courseRes.json();

      if (catData.status === 'SUCCESS' && Array.isArray(catData.data)) {
        setCategories(catData.data);
      }
      if (instData.status === 'SUCCESS' && Array.isArray(instData.data)) {
        setInstructors(instData.data);
      }

      if (courseData.status === 'SUCCESS' && courseData.data) {
        const c = courseData.data;
        setTitle(c.title);
        setSubtitle(c.subtitle || '');
        setDescription(c.description || '');
        setPrice(c.price.toString());
        setLevel(c.level);
        setLanguage(c.language || 'English');
        setThumbnail(c.thumbnail || '');
        setCategoryId(c.category.id.toString());
        setInstructorId(c.instructor.id.toString());
        
        // Sort sections and lessons by displayOrder just in case
        const sortedSections = (c.sections || []).map((sec: Section) => ({
          ...sec,
          lessons: (sec.lessons || []).sort((a, b) => a.displayOrder - b.displayOrder),
        })).sort((a: Section, b: Section) => a.displayOrder - b.displayOrder);

        setSections(sortedSections);

        // Open first section by default
        if (sortedSections.length > 0) {
          setOpenSections((prev) => {
            if (Object.keys(prev).length === 0) {
              return { [sortedSections[0].id]: true };
            }
            return prev;
          });
        }
      } else {
        setError(courseData.message || 'Failed to load course details');
      }
    } catch (err) {
      console.error('Failed to load course details', err);
      setError('Error fetching course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [token, params.id]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);

    const payload = {
      title,
      subtitle,
      description,
      price: parseFloat(price) || 0,
      level,
      language,
      thumbnail,
      categoryId: parseInt(categoryId),
      instructorId: parseInt(instructorId),
    };

    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/courses/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.status === 'SUCCESS') {
        alert('Course details updated successfully.');
        router.push('/admin/courses');
      } else {
        setError(result.message || 'Failed to update course details');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during details update.');
    } finally {
      setSaving(false);
    }
  };

  // Section CRUD Functions
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newSectionTitle.trim()) return;
    setCurriculumActionLoading(true);
    setCurriculumError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/courses/${params.id}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newSectionTitle,
          displayOrder: sections.length + 1,
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === 'SUCCESS') {
        setNewSectionTitle('');
        setIsCreatingSection(false);
        await loadCourseData();
      } else {
        setCurriculumError(result.message || 'Failed to create section');
      }
    } catch (err) {
      console.error(err);
      setCurriculumError('Error creating section');
    } finally {
      setCurriculumActionLoading(false);
    }
  };

  const handleUpdateSectionTitle = async (sectionId: number, currentOrder: number) => {
    if (!token || !editingSectionTitle.trim()) return;
    setCurriculumActionLoading(true);
    setCurriculumError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingSectionTitle,
          displayOrder: currentOrder,
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === 'SUCCESS') {
        setEditingSectionId(null);
        setEditingSectionTitle('');
        await loadCourseData();
      } else {
        setCurriculumError(result.message || 'Failed to update section title');
      }
    } catch (err) {
      console.error(err);
      setCurriculumError('Error updating section title');
    } finally {
      setCurriculumActionLoading(false);
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this section? This will delete all lessons inside this section.')) return;
    
    setCurriculumActionLoading(true);
    setCurriculumError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/sections/${sectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok && result.status === 'SUCCESS') {
        await loadCourseData();
      } else {
        setCurriculumError(result.message || 'Failed to delete section');
      }
    } catch (err) {
      console.error(err);
      setCurriculumError('Error deleting section');
    } finally {
      setCurriculumActionLoading(false);
    }
  };

  const handleMoveSection = async (sectionId: number, currentTitle: string, newOrder: number) => {
    if (!token || newOrder < 1 || newOrder > sections.length) return;
    setCurriculumActionLoading(true);
    setCurriculumError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: currentTitle,
          displayOrder: newOrder,
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === 'SUCCESS') {
        await loadCourseData();
      } else {
        setCurriculumError(result.message || 'Failed to move section');
      }
    } catch (err) {
      console.error(err);
      setCurriculumError('Error moving section');
    } finally {
      setCurriculumActionLoading(false);
    }
  };

  // Lesson CRUD Functions
  const handleOpenAddLessonModal = (sectionId: number, lessonsCount: number) => {
    setLessonModal({
      isOpen: true,
      mode: 'create',
      sectionId,
      lessonId: null,
      title: '',
      videoUrl: '',
      pdfUrl: '',
      duration: 0,
      previewEnabled: false,
      displayOrder: lessonsCount + 1,
    });
  };

  const handleOpenEditLessonModal = (sectionId: number, lesson: Lesson) => {
    setLessonModal({
      isOpen: true,
      mode: 'edit',
      sectionId,
      lessonId: lesson.id,
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      pdfUrl: lesson.pdfUrl || '',
      duration: lesson.duration,
      previewEnabled: lesson.previewEnabled,
      displayOrder: lesson.displayOrder,
    });
  };

  const handleLessonModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!lessonModal.title.trim()) return alert('Title is required');
    if (!lessonModal.videoUrl.trim()) return alert('Video URL is required');

    setCurriculumActionLoading(true);
    setCurriculumError(null);

    const payload = {
      title: lessonModal.title,
      videoUrl: lessonModal.videoUrl,
      pdfUrl: lessonModal.pdfUrl.trim() || null,
      duration: lessonModal.duration,
      previewEnabled: lessonModal.previewEnabled,
      displayOrder: lessonModal.displayOrder,
    };

    try {
      let res;
      if (lessonModal.mode === 'create') {
        res = await fetch(`http://localhost:8080/api/v1/admin/sections/${lessonModal.sectionId}/lessons`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`http://localhost:8080/api/v1/admin/lessons/${lessonModal.lessonId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (res.ok && result.status === 'SUCCESS') {
        setLessonModal((prev) => ({ ...prev, isOpen: false }));
        await loadCourseData();
      } else {
        setCurriculumError(result.message || 'Failed to save lesson');
      }
    } catch (err) {
      console.error(err);
      setCurriculumError('Error saving lesson');
    } finally {
      setCurriculumActionLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;

    setCurriculumActionLoading(true);
    setCurriculumError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok && result.status === 'SUCCESS') {
        await loadCourseData();
      } else {
        setCurriculumError(result.message || 'Failed to delete lesson');
      }
    } catch (err) {
      console.error(err);
      setCurriculumError('Error deleting lesson');
    } finally {
      setCurriculumActionLoading(false);
    }
  };

  const handleMoveLesson = async (lesson: Lesson, newOrder: number, maxOrder: number) => {
    if (!token || newOrder < 1 || newOrder > maxOrder) return;
    setCurriculumActionLoading(true);
    setCurriculumError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/v1/admin/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          pdfUrl: lesson.pdfUrl,
          duration: lesson.duration,
          previewEnabled: lesson.previewEnabled,
          displayOrder: newOrder,
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === 'SUCCESS') {
        await loadCourseData();
      } else {
        setCurriculumError(result.message || 'Failed to move lesson');
      }
    } catch (err) {
      console.error(err);
      setCurriculumError('Error moving lesson');
    } finally {
      setCurriculumActionLoading(false);
    }
  };

  const toggleSection = (sectionId: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
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
          Admin Dashboard
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <Link href="/admin/courses" className="text-white hover:text-white transition-colors">Courses</Link>
          <Link href="/courses" className="hover:text-white transition-colors">Public Site</Link>
        </nav>
      </header>

      {/* Hero Header */}
      <section className="z-10 max-w-4xl w-full mx-auto px-6 pt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Course Administration</h1>
            <p className="text-sm text-neutral-400">Configure details and curriculum for Course ID: {params.id}</p>
          </div>
          <Link
            href="/admin/courses"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold rounded-lg transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-800 mb-8 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'details'
                ? 'border-indigo-650 text-white font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Course Details
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`pb-3 px-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'curriculum'
                ? 'border-indigo-650 text-white font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Course Curriculum ({sections.length} Sections)
          </button>
        </div>
      </section>

      {/* Main View Area */}
      <section className="z-10 max-w-4xl w-full mx-auto px-6 pb-16 flex-1 flex flex-col">
        
        {/* TAB 1: DETAILS */}
        {activeTab === 'details' && (
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-8 shadow-2xl shadow-black/50">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-lg mb-6 text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Course Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Startup Foundations: Zero to One"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                  />
                </div>

                {/* Subtitle */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Subtitle / Brief tagline</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Master the frameworks to launch your business and raise initial capital"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed course description..."
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 transition-all resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Instructor</label>
                  <select
                    value={instructorId}
                    onChange={(e) => setInstructorId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                  />
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Thumbnail URL</label>
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://example.com/thumbnail.png"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500/80 transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-neutral-800/60 pt-6 flex justify-end gap-3">
                <Link
                  href="/admin/courses"
                  className="px-5 py-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 border border-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CURRICULUM */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            {curriculumError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-lg text-center font-medium">
                {curriculumError}
              </div>
            )}

            {/* Reorder/Action Spinner Overlay */}
            {curriculumActionLoading && (
              <div className="flex items-center justify-center gap-2 text-xs text-indigo-400 font-semibold py-1 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                <div className="w-3.5 h-3.5 border-2 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin" />
                Syncing curriculum layout...
              </div>
            )}

            {/* Sections Accordion */}
            <div className="space-y-4">
              {sections.map((section, sIdx) => (
                <div key={section.id} className="border border-neutral-800/80 rounded-2xl overflow-hidden bg-neutral-900/15 backdrop-blur-xl">
                  {/* Section Header */}
                  <div className="w-full px-5 py-4 flex justify-between items-center bg-neutral-900/50 border-b border-neutral-850/40">
                    <div className="flex-1 flex items-center gap-3">
                      {/* Expand / Collapse click */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-8 h-8 rounded-lg bg-neutral-950/40 hover:bg-neutral-950 flex items-center justify-center text-neutral-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <svg
                          className={`w-4 h-4 transform transition-transform ${openSections[section.id] ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Title display/input */}
                      {editingSectionId === section.id ? (
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                          <input
                            type="text"
                            value={editingSectionTitle}
                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-850 text-white text-xs font-semibold focus:outline-none focus:border-indigo-650"
                            placeholder="Ideation and Discovery"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateSectionTitle(section.id, section.displayOrder)}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-all cursor-pointer shadow-lg shadow-indigo-600/15"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setEditingSectionId(null);
                              setEditingSectionTitle('');
                            }}
                            className="p-2 bg-neutral-950 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-0.5">
                            Section {section.displayOrder}
                          </span>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2.5">
                            {section.title}
                            <button
                              onClick={() => {
                                setEditingSectionId(section.id);
                                setEditingSectionTitle(section.title);
                              }}
                              className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </h4>
                        </div>
                      )}
                    </div>

                    {/* Section controls */}
                    <div className="flex items-center gap-2">
                      {/* Move Up */}
                      {sIdx > 0 && (
                        <button
                          onClick={() => handleMoveSection(section.id, section.title, section.displayOrder - 1)}
                          title="Move Section Up"
                          className="p-1.5 rounded-lg bg-neutral-950/40 hover:bg-neutral-950 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      )}

                      {/* Move Down */}
                      {sIdx < sections.length - 1 && (
                        <button
                          onClick={() => handleMoveSection(section.id, section.title, section.displayOrder + 1)}
                          title="Move Section Down"
                          className="p-1.5 rounded-lg bg-neutral-950/40 hover:bg-neutral-950 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenAddLessonModal(section.id, section.lessons.length)}
                        className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        + Add Lesson
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        title="Delete Section"
                        className="p-1.5 rounded-lg bg-red-950/20 border border-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Lessons list */}
                  {openSections[section.id] && (
                    <div className="bg-neutral-950/40 divide-y divide-neutral-900/60 p-4 space-y-2">
                      {(section.lessons || []).map((lesson, lIdx) => (
                        <div key={lesson.id} className="p-3.5 bg-neutral-900/45 rounded-xl border border-neutral-850/40 hover:border-neutral-800 transition-all flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            {/* File types */}
                            <div className="w-7 h-7 rounded-full bg-neutral-950 flex items-center justify-center text-neutral-500">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-bold text-neutral-200 flex items-center gap-2">
                                {lesson.title}
                                {lesson.previewEnabled && (
                                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wide">
                                    Preview
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-semibold mt-0.5">
                                <span>Duration: {Math.floor(lesson.duration / 60)}m</span>
                                <span>•</span>
                                <span>Order: {lesson.displayOrder}</span>
                                {lesson.pdfUrl && (
                                  <>
                                    <span>•</span>
                                    <span className="text-indigo-400 flex items-center gap-0.5">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      PDF Included
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Lesson Actions */}
                          <div className="flex items-center gap-2">
                            {/* Reordering */}
                            {lIdx > 0 && (
                              <button
                                onClick={() => handleMoveLesson(lesson, lesson.displayOrder - 1, section.lessons.length)}
                                title="Move Lesson Up"
                                className="p-1 rounded bg-neutral-950/30 hover:bg-neutral-950 text-neutral-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                            )}
                            {lIdx < section.lessons.length - 1 && (
                              <button
                                onClick={() => handleMoveLesson(lesson, lesson.displayOrder + 1, section.lessons.length)}
                                title="Move Lesson Down"
                                className="p-1 rounded bg-neutral-950/30 hover:bg-neutral-950 text-neutral-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEditLessonModal(section.id, lesson)}
                              className="px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            >
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-1.5 rounded-lg bg-red-950/10 hover:bg-red-950/30 text-red-500 transition-colors cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}

                      {section.lessons.length === 0 && (
                        <div className="py-8 text-center text-neutral-500 font-semibold text-[11px]">
                          No lessons added yet. Click "+ Add Lesson" to configure one!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Section Creation Inline */}
            <div className="bg-neutral-950/20 border border-neutral-850 rounded-2xl p-5">
              {isCreatingSection ? (
                <form onSubmit={handleAddSection} className="flex gap-3 max-w-lg">
                  <input
                    type="text"
                    required
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="Startup Pitching Strategy"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-xs font-semibold focus:outline-none focus:border-indigo-650"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/10 border border-indigo-500/20 transition-all cursor-pointer"
                  >
                    Add Section
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingSection(false);
                      setNewSectionTitle('');
                    }}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsCreatingSection(true)}
                  className="w-full py-4 border border-dashed border-neutral-800 hover:border-neutral-700/80 rounded-xl text-neutral-500 hover:text-neutral-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer bg-neutral-950/5"
                >
                  <span className="text-base">+</span> Create New Section
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Lesson Modal Overlay */}
      {lessonModal.isOpen && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-neutral-850 flex justify-between items-center">
              <h3 className="font-extrabold text-white text-base">
                {lessonModal.mode === 'create' ? 'Add New Lesson' : 'Edit Lesson'}
              </h3>
              <button
                onClick={() => setLessonModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-neutral-500 hover:text-white transition-colors font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleLessonModalSubmit} className="p-6 space-y-5 text-xs font-semibold">
              {/* Title */}
              <div>
                <label className="block text-neutral-450 uppercase tracking-wider mb-2 text-[10px]">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonModal.title}
                  onChange={(e) => setLessonModal((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Lean Canvas Overview"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm font-medium focus:outline-none focus:border-indigo-650 transition-all"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-neutral-450 uppercase tracking-wider mb-2 text-[10px]">Video URL (Required)</label>
                <input
                  type="text"
                  required
                  value={lessonModal.videoUrl}
                  onChange={(e) => setLessonModal((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://sample-videos.com/video.mp4"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm font-medium focus:outline-none focus:border-indigo-650 transition-all"
                />
              </div>

              {/* PDF URL */}
              <div>
                <label className="block text-neutral-450 uppercase tracking-wider mb-2 text-[10px]">PDF Resource URL (Optional)</label>
                <input
                  type="text"
                  value={lessonModal.pdfUrl}
                  onChange={(e) => setLessonModal((prev) => ({ ...prev, pdfUrl: e.target.value }))}
                  placeholder="https://example.com/slide-deck.pdf"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm font-medium focus:outline-none focus:border-indigo-650 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-neutral-450 uppercase tracking-wider mb-2 text-[10px]">Duration (Seconds)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={lessonModal.duration}
                    onChange={(e) => setLessonModal((prev) => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm font-medium focus:outline-none focus:border-indigo-650 transition-all"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-neutral-450 uppercase tracking-wider mb-2 text-[10px]">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={lessonModal.displayOrder}
                    onChange={(e) => setLessonModal((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm font-medium focus:outline-none focus:border-indigo-650 transition-all"
                  />
                </div>
              </div>

              {/* Preview Toggle */}
              <div className="flex items-center gap-3 py-2 bg-neutral-950/30 px-3 rounded-xl border border-neutral-850/60">
                <input
                  type="checkbox"
                  id="previewEnabled"
                  checked={lessonModal.previewEnabled}
                  onChange={(e) => setLessonModal((prev) => ({ ...prev, previewEnabled: e.target.checked }))}
                  className="w-4 h-4 border border-neutral-850 rounded bg-neutral-950 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="previewEnabled" className="text-xs text-neutral-300 select-none cursor-pointer">
                  Enable Lesson Preview (Visitors can watch without enrolling)
                </label>
              </div>

              {/* Form buttons */}
              <div className="border-t border-neutral-850 pt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLessonModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/10 border border-indigo-500/20 transition-all cursor-pointer"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-6 mt-auto">
        <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-neutral-600 font-medium">
            © 2026 Young Entrepreneur Development Centre. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
