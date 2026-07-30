'use client';
export const dynamic = 'force-dynamic';
import API_BASE_URL from '@/config/api';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AdminNavbar } from '@/components/AdminNavbar';
import { Footer } from '@/components/Footer';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import { ChevronDown } from 'lucide-react';

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
        fetch(`${API_BASE_URL}/categories`),
        fetch(`${API_BASE_URL}/instructors`),
        fetch(`${API_BASE_URL}/admin/courses/${params.id}`, {
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
      const res = await fetch(`${API_BASE_URL}/admin/courses/${params.id}`, {
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
      const res = await fetch(`${API_BASE_URL}/admin/courses/${params.id}/sections`, {
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
      const res = await fetch(`${API_BASE_URL}/admin/sections/${sectionId}`, {
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
      const res = await fetch(`${API_BASE_URL}/admin/sections/${sectionId}`, {
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
      const res = await fetch(`${API_BASE_URL}/admin/sections/${sectionId}`, {
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
        res = await fetch(`${API_BASE_URL}/admin/sections/${lessonModal.sectionId}/lessons`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/admin/lessons/${lessonModal.lessonId}`, {
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
      const res = await fetch(`${API_BASE_URL}/admin/lessons/${lessonId}`, {
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
      const res = await fetch(`${API_BASE_URL}/admin/lessons/${lesson.id}`, {
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
      <main className="min-h-screen bg-background flex flex-col font-sans">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-primaryText flex flex-col font-sans">
      <AdminNavbar />

      {/* Hero Header */}
      <section className="z-10 max-w-4xl w-full mx-auto px-6 pt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primaryText font-heading">Course Administration</h1>
            <p className="text-xs text-secondaryText font-medium">Configure details and curriculum for Course ID: {params.id}</p>
          </div>
          <Link href="/admin/courses">
            <SecondaryButton className="h-10 text-xs px-4">
              ← Back to Catalog
            </SecondaryButton>
          </Link>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border mb-8 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'details'
                ? 'border-gold text-primaryText'
                : 'border-transparent text-secondaryText hover:text-primaryText'
            }`}
          >
            Course Details
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`pb-3 px-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'curriculum'
                ? 'border-gold text-primaryText'
                : 'border-transparent text-secondaryText hover:text-primaryText'
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
          <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="bg-brandRed/10 border border-brandRed/20 text-brandRed text-xs py-3 px-4 rounded-xl mb-6 text-center font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">Course Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Startup Foundations: Zero to One"
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-sm focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Subtitle */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Master the frameworks to launch your business and raise initial capital"
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-sm focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed course description..."
                    className="w-full p-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-sm focus:outline-none transition-all duration-200 resize-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText text-sm focus:outline-none transition-all duration-200 cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Instructor */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">Instructor</label>
                  <select
                    value={instructorId}
                    onChange={(e) => setInstructorId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText text-sm focus:outline-none transition-all duration-200 cursor-pointer"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText text-sm focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText text-sm focus:outline-none transition-all duration-200 cursor-pointer"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText text-sm focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Thumbnail URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">Thumbnail URL</label>
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://example.com/thumbnail.png"
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-sm focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-border pt-6 flex justify-end gap-3">
                <Link href="/admin/courses">
                  <SecondaryButton type="button" className="h-10 text-xs">
                    Cancel
                  </SecondaryButton>
                </Link>
                <PrimaryButton type="submit" loading={saving} className="h-10 text-xs">
                  Save Changes
                </PrimaryButton>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CURRICULUM */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            {curriculumError && (
              <div className="bg-brandRed/10 border border-brandRed/20 text-brandRed text-xs py-3 px-4 rounded-xl text-center font-bold">
                {curriculumError}
              </div>
            )}

            {/* Reorder/Action Spinner Overlay */}
            {curriculumActionLoading && (
              <div className="flex items-center justify-center gap-2 text-xs text-gold font-semibold py-2 bg-gold/5 rounded-xl border border-gold/10">
                <div className="w-3.5 h-3.5 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                Syncing curriculum layout...
              </div>
            )}

            {/* Sections Accordion */}
            <div className="space-y-4">
              {sections.map((section, sIdx) => (
                <div key={section.id} className="border border-border rounded-2xl overflow-hidden bg-slate-50/50">
                  {/* Section Header */}
                  <div className="w-full px-5 py-4 flex justify-between items-center bg-surface border-b border-border">
                    <div className="flex-1 flex items-center gap-3">
                      {/* Expand / Collapse click */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-8 h-8 rounded-xl bg-background hover:bg-surface-hover flex items-center justify-center text-secondaryText hover:text-primaryText border border-border transition-colors cursor-pointer"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transform transition-transform ${openSections[section.id] ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Title display/input */}
                      {editingSectionId === section.id ? (
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                          <input
                            type="text"
                            value={editingSectionTitle}
                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                            className="flex-1 h-9 px-3 rounded-xl bg-background border border-border text-primaryText text-xs font-semibold focus:outline-none focus:border-gold"
                            placeholder="Ideation and Discovery"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateSectionTitle(section.id, section.displayOrder)}
                            className="p-2 bg-brandEmerald hover:bg-emerald-600 rounded-xl text-white font-bold transition-all cursor-pointer"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setEditingSectionId(null);
                              setEditingSectionTitle('');
                            }}
                            className="p-2 bg-background hover:bg-surface-hover rounded-xl text-secondaryText hover:text-primaryText border border-border transition-all cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[9px] font-bold text-gold uppercase tracking-wider block">
                            Section {section.displayOrder}
                          </span>
                          <h4 className="text-sm font-bold text-primaryText flex items-center gap-2.5 font-heading">
                            {section.title}
                            <button
                              onClick={() => {
                                setEditingSectionId(section.id);
                                setEditingSectionTitle(section.title);
                              }}
                              className="text-mutedText hover:text-primaryText transition-colors cursor-pointer"
                            >
                              ✏️
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
                          className="p-1.5 rounded-xl bg-background hover:bg-surface-hover border border-border text-secondaryText hover:text-primaryText transition-colors cursor-pointer"
                        >
                          ▲
                        </button>
                      )}

                      {/* Move Down */}
                      {sIdx < sections.length - 1 && (
                        <button
                          onClick={() => handleMoveSection(section.id, section.title, section.displayOrder + 1)}
                          title="Move Section Down"
                          className="p-1.5 rounded-xl bg-background hover:bg-surface-hover border border-border text-secondaryText hover:text-primaryText transition-colors cursor-pointer"
                        >
                          ▼
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenAddLessonModal(section.id, section.lessons.length)}
                        className="px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold text-[10px] font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        + Add Lesson
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        title="Delete Section"
                        className="p-1.5 rounded-xl bg-brandRed/10 border border-brandRed/20 hover:bg-brandRed/20 text-brandRed transition-colors cursor-pointer"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {/* Lessons list */}
                  {openSections[section.id] && (
                    <div className="bg-background/40 divide-y divide-border p-4 space-y-2">
                      {(section.lessons || []).map((lesson, lIdx) => (
                        <div key={lesson.id} className="p-3.5 bg-background border border-border rounded-xl hover:border-gold/25 transition-all flex justify-between items-center text-xs text-secondaryText">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-gold">
                              ▶
                            </div>
                            <div>
                              <p className="font-bold text-primaryText flex items-center gap-2 font-heading">
                                {lesson.title}
                                {lesson.previewEnabled && (
                                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-brandEmerald/10 text-brandEmerald border border-brandEmerald/20 uppercase tracking-wide">
                                    Preview
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-mutedText font-semibold mt-0.5">
                                <span>Duration: {Math.floor(lesson.duration / 60)}m</span>
                                <span>•</span>
                                <span>Order: {lesson.displayOrder}</span>
                                {lesson.pdfUrl && (
                                  <>
                                    <span>•</span>
                                    <span className="text-gold flex items-center gap-0.5">
                                      PDF
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Move Up */}
                            {lIdx > 0 && (
                              <button
                                onClick={() => handleMoveLesson(lesson, lesson.displayOrder - 1, section.lessons.length)}
                                className="p-1 text-[10px] bg-surface hover:bg-surface-hover border border-border rounded-lg text-secondaryText hover:text-primaryText transition-colors cursor-pointer"
                              >
                                ▲
                              </button>
                            )}
                            {/* Move Down */}
                            {lIdx < section.lessons.length - 1 && (
                              <button
                                onClick={() => handleMoveLesson(lesson, lesson.displayOrder + 1, section.lessons.length)}
                                className="p-1 text-[10px] bg-surface hover:bg-surface-hover border border-border rounded-lg text-secondaryText hover:text-primaryText transition-colors cursor-pointer"
                              >
                                ▼
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenEditLessonModal(section.id, lesson)}
                              className="px-2.5 py-1 bg-surface hover:bg-surface-hover border border-border hover:border-gold/50 text-primaryText rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-1.5 bg-brandRed/10 border border-brandRed/20 hover:bg-brandRed/20 text-brandRed rounded-xl transition-all cursor-pointer text-[10px]"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}
                      {section.lessons.length === 0 && (
                        <p className="text-xs text-mutedText py-4 text-center">No lessons configured for this section yet.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Create Section Box */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              {!isCreatingSection ? (
                <SecondaryButton
                  onClick={() => setIsCreatingSection(true)}
                  className="h-10 text-xs"
                >
                  + Add Section
                </SecondaryButton>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider">New Section Title</label>
                    <input
                      type="text"
                      required
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="e.g., Marketing Strategy & Positioning"
                      className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-sm focus:outline-none transition-all duration-200"
                    />
                  </div>
                  <div className="flex gap-3">
                    <SecondaryButton
                      onClick={() => {
                        setIsCreatingSection(false);
                        setNewSectionTitle('');
                      }}
                      className="h-10 text-xs"
                    >
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton
                      onClick={handleAddSection}
                      className="h-10 text-xs px-4"
                    >
                      Add Section
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </section>

      {/* Lesson Edit/Create Modal Overlay */}
      {lessonModal.isOpen && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative p-6 space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-primaryText font-heading">
                {lessonModal.mode === 'create' ? 'Add New Lesson' : 'Edit Lesson'}
              </h3>
              <p className="text-xs text-secondaryText font-medium">Specify the access links and duration specifications.</p>
            </div>

            <form onSubmit={handleLessonModalSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-secondaryText uppercase tracking-wider">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonModal.title}
                  onChange={(e) => setLessonModal((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Unit Economics: LTV to CAC Ratio"
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-sm focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-secondaryText uppercase tracking-wider">Video Resource URL</label>
                <input
                  type="text"
                  required
                  value={lessonModal.videoUrl}
                  onChange={(e) => setLessonModal((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://sample-videos.com/video.mp4"
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-sm focus:outline-none transition-all duration-200"
                />
              </div>

              {/* PDF URL */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-secondaryText uppercase tracking-wider">PDF Resource URL (Optional)</label>
                <input
                  type="text"
                  value={lessonModal.pdfUrl}
                  onChange={(e) => setLessonModal((prev) => ({ ...prev, pdfUrl: e.target.value }))}
                  placeholder="https://example.com/slide-deck.pdf"
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-sm focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-secondaryText uppercase tracking-wider">Duration (Seconds)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={lessonModal.duration}
                    onChange={(e) => setLessonModal((prev) => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText text-sm focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Display Order */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-secondaryText uppercase tracking-wider">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={lessonModal.displayOrder}
                    onChange={(e) => setLessonModal((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))}
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border hover:border-gold/50 focus:border-gold text-primaryText text-sm focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Preview Toggle */}
              <div className="flex items-center gap-3 py-2.5 bg-background border border-border rounded-xl px-4">
                <input
                  type="checkbox"
                  id="previewEnabled"
                  checked={lessonModal.previewEnabled}
                  onChange={(e) => setLessonModal((prev) => ({ ...prev, previewEnabled: e.target.checked }))}
                  className="w-4 h-4 rounded border-border bg-background text-gold focus:ring-gold"
                />
                <label htmlFor="previewEnabled" className="text-xs text-secondaryText font-medium select-none cursor-pointer">
                  Enable Lesson Preview (Visitors can watch without enrolling)
                </label>
              </div>

              {/* Form buttons */}
              <div className="border-t border-border pt-5 flex justify-end gap-3">
                <SecondaryButton
                  type="button"
                  onClick={() => setLessonModal((prev) => ({ ...prev, isOpen: false }))}
                  className="h-10 text-xs"
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  className="h-10 text-xs px-4"
                >
                  Save Lesson
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
