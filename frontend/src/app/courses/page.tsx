"use client";
import API_BASE_URL from "@/config/api";
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { PrimaryButton } from "@/components/Buttons";
import { Search, AlertTriangle } from "lucide-react";

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

const DEFAULT_BUSINESS_PROGRAMS: Course[] = [
  {
    id: 1,
    title: "Café Startup & Operations Masterclass",
    subtitle: "Master commercial espresso bars, menu planning, equipment sizing, and layout configuration.",
    price: 2999,
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    level: "BEGINNER",
    duration: "6 Weeks",
    category: { id: 1, name: "Cafe" },
    instructor: { name: "Dr. Anirudh Sharma" }
  },
  {
    id: 2,
    title: "Commercial Bakery & Pastry Venture",
    subtitle: "Learn commercial deck oven setup, bulk baking ingredient sourcing, and cake packaging.",
    price: 3499,
    thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    level: "INTERMEDIATE",
    duration: "4 Weeks",
    category: { id: 2, name: "Bakery" },
    instructor: { name: "Sneha Iyer" }
  },
  {
    id: 3,
    title: "Restaurant & QSR Business Model",
    subtitle: "Build scalable fast-casual & fine-dine restaurant models with low food-waste SOPs.",
    price: 3999,
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    level: "ADVANCED",
    duration: "8 Weeks",
    category: { id: 3, name: "Restaurant" },
    instructor: { name: "Dr. Anirudh Sharma" }
  },
  {
    id: 4,
    title: "Packaged Snacks & Namkeen Business",
    subtitle: "Setup commercial frying, roasting, nitrogen pouch packaging, and distributor channels.",
    price: 2499,
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    level: "BEGINNER",
    duration: "3 Weeks",
    category: { id: 4, name: "Snacks Business" },
    instructor: { name: "Priya Nair" }
  },
  {
    id: 5,
    title: "Cloud Kitchen & Delivery Brand Scale",
    subtitle: "Low-overhead multi-brand delivery kitchen setup, Zomato/Swiggy algorithm optimization.",
    price: 2799,
    thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    level: "INTERMEDIATE",
    duration: "3 Weeks",
    category: { id: 5, name: "Cloud Kitchen" },
    instructor: { name: "Priya Nair" }
  },
  {
    id: 6,
    title: "Food Processing & Sauce Manufacturing",
    subtitle: "Commercial recipe scaling, shelf-life stabilization, industrial mixers, and FSSAI licensing.",
    price: 3999,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    level: "ADVANCED",
    duration: "8 Weeks",
    category: { id: 6, name: "Food Processing" },
    instructor: { name: "Dr. Anirudh Sharma" }
  },
  {
    id: 7,
    title: "Dry Fruits Processing & Export Packaging",
    subtitle: "Sourcing premium nuts, vacuum sealing, gift packaging, and B2B wholesale distribution.",
    price: 3199,
    thumbnail: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
    level: "INTERMEDIATE",
    duration: "4 Weeks",
    category: { id: 7, name: "Dry Fruits" },
    instructor: { name: "Aditya Roy" }
  },
  {
    id: 8,
    title: "Digital Marketing & Client Acquisition",
    subtitle: "Customer acquisition funnels, local Google My Business SEO, and high-ticket client retainers.",
    price: 1999,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    level: "BEGINNER",
    duration: "2 Weeks",
    category: { id: 8, name: "Digital Marketing" },
    instructor: { name: "Priya Nair" }
  }
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Cafe", description: "Espresso bars & specialty cafes" },
  { id: 2, name: "Bakery", description: "Commercial deck oven setup & packaging" },
  { id: 3, name: "Restaurant", description: "Fast-casual & fine-dine models" },
  { id: 4, name: "Snacks Business", description: "Packaged snacks & namkeen ventures" },
  { id: 5, name: "Cloud Kitchen", description: "Multi-brand delivery kitchens" },
  { id: 6, name: "Food Processing", description: "Sauce manufacturing & FSSAI licensing" },
  { id: 7, name: "Dry Fruits", description: "Processing, vacuum sealing & export" },
  { id: 8, name: "Digital Marketing", description: "Client acquisition & local SEO" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_BUSINESS_PROGRAMS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Read URL search parameter triggers on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catId = params.get("category");
      const catName = params.get("name");
      if (catId) {
        setSelectedCategory(parseInt(catId, 10));
      } else if (catName) {
        setSearchQuery(catName);
      }
      if (params.get("focus") === "true") {
        setTimeout(() => {
          searchRef.current?.focus();
        }, 100);
      }
    }
  }, []);

  // Load categories
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    fetch(`${API_BASE_URL}/categories`, { signal: controller.signal })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && Array.isArray(result.data) && result.data.length > 0) {
          setCategories(result.data);
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeoutId));
  }, []);

  // Fetch courses on category or search query change
  useEffect(() => {
    // 1. Instantly apply local filtering for 0ms page response
    let fallback = DEFAULT_BUSINESS_PROGRAMS;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      fallback = fallback.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.subtitle.toLowerCase().includes(q) || 
        c.category.name.toLowerCase().includes(q)
      );
    } else if (selectedCategory !== null) {
      fallback = fallback.filter(c => c.category.id === selectedCategory);
    }
    setCourses(fallback);

    // 2. Quiet background fetch with 1.2s timeout so network delay never hangs UI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    let url = `${API_BASE_URL}/courses`;
    if (searchQuery.trim() !== "") {
      url = `${API_BASE_URL}/courses/search?keyword=${encodeURIComponent(searchQuery)}`;
    } else if (selectedCategory !== null) {
      url = `${API_BASE_URL}/courses?categoryId=${selectedCategory}`;
    }

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && Array.isArray(result.data) && result.data.length > 0) {
          setCourses(result.data);
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeoutId));
  }, [selectedCategory, searchQuery]);

  // Execute keyword search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setSelectedCategory(null);
      return;
    }
    setSelectedCategory(null);
  };

  return (
    <main className="min-h-screen bg-background text-[#0F172A] flex flex-col font-sans pt-16">
      <Navbar />

      {/* Explore catalog wrapper */}
      <div className="z-10 max-w-screen-xl w-full mx-auto px-6 py-6 flex-1 flex flex-col space-y-5">
        <div className="text-center md:text-left space-y-0.5">
          <span className="text-[9px] font-extrabold text-gold uppercase tracking-wider block font-heading">
            Vetted Blueprints
          </span>
          <h1 className="text-2xl font-black text-[#0F172A] font-heading">Explore Business Programs</h1>
          <p className="text-xs text-slate-500 font-semibold">
            Learn execution directly from successful founders & marketing mentors.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-[18px] p-4 shadow-sm space-y-4">
          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex gap-2.5 max-w-2xl">
            <div className="relative flex-1">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search programs by name or business type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-[12px] bg-slate-50 border border-slate-200 hover:border-gold/35 focus:border-gold focus:ring-2 focus:ring-gold/20 text-[#0F172A] placeholder-slate-400 text-xs focus:outline-none transition-premium font-semibold"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <PrimaryButton type="submit" className="h-10 text-xs px-5 rounded-[12px]">
              Search
            </PrimaryButton>
          </form>

          {/* Business Categories Section */}
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest font-heading">
                Business Categories
              </label>
              {selectedCategory !== null && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                  className="text-xs font-bold text-gold hover:underline cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className={`h-8 px-3.5 rounded-[10px] text-xs font-bold border transition-all duration-200 active:scale-[0.97] cursor-pointer ${
                  selectedCategory === null
                    ? "bg-gold text-[#0F172A] border-transparent shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-[#0F172A] hover:border-slate-300"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => {
                const displayName = cat.name.replace("Course", "Business").replace("Startup", "Launch");
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery("");
                    }}
                    className={`h-8 px-3.5 rounded-[10px] text-xs font-bold border transition-all duration-200 active:scale-[0.97] cursor-pointer ${
                      isSelected
                        ? "bg-gold text-[#0F172A] border-transparent shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-[#0F172A] hover:border-slate-300"
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-[16px] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-gold" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0F172A] font-heading">No programs found</h3>
              <p className="text-xs text-slate-500 font-semibold">
                Try adjusting your search criteria or select an alternative category.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
