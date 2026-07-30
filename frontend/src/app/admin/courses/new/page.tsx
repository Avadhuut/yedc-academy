"use client";
import API_BASE_URL from "@/config/api";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";

interface Category {
  id: number;
  name: string;
}

interface Instructor {
  id: number;
  name: string;
}

export default function NewCoursePage() {
  const { user, token } = useAuth();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [level, setLevel] = useState("BEGINNER");
  const [language, setLanguage] = useState("English");
  const [thumbnail, setThumbnail] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [instructorId, setInstructorId] = useState("");

  // Dropdown options
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Load dropdown lists
  useEffect(() => {
    if (!token) return;

    const loadDropdowns = async () => {
      try {
        const [catRes, instRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/instructors`),
        ]);

        const catData = await catRes.json();
        const instData = await instRes.json();

        if (catData.status === "SUCCESS" && Array.isArray(catData.data)) {
          setCategories(catData.data);
          if (catData.data.length > 0) setCategoryId(catData.data[0].id.toString());
        }
        if (instData.status === "SUCCESS" && Array.isArray(instData.data)) {
          setInstructors(instData.data);
          if (instData.data.length > 0) setInstructorId(instData.data[0].id.toString());
        }
      } catch (err) {
        console.error("Failed to load form dependencies", err);
        setError("Failed to fetch categories or instructors");
      } finally {
        setLoading(false);
      }
    };

    loadDropdowns();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const res = await fetch(`${API_BASE_URL}/admin/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.status === "SUCCESS") {
        router.push("/admin/courses");
      } else {
        setError(result.message || "Failed to create course");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during submission.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || user.role !== "ADMIN") {
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

      {/* Form Area */}
      <section className="z-10 max-w-2xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-primaryText font-heading">Create New Course</h1>
          <p className="text-xs text-secondaryText font-medium">Populate course details to register a draft module</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="bg-brandRed/10 border border-brandRed/20 text-brandRed text-xs py-3 px-4 rounded-xl mb-6 text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
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
                  {instructors.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
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
                Create Course
              </PrimaryButton>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
