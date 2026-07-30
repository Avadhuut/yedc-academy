import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import API_BASE_URL from "@/config/api";
import { BookOpen, ChevronRight, Award, Shield, Library } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Cafe", description: "Espresso bars, quick service, and cafe operations." },
  { id: 2, name: "Bakery", description: "Commercial baking, deck ovens, and cake packaging." },
  { id: 3, name: "Restaurant", description: "Fast-casual and fine-dine QSR models." },
  { id: 4, name: "Snacks Business", description: "Frying, roasting, and pouch packaging." },
  { id: 5, name: "Cloud Kitchen", description: "Low-overhead dark kitchens and delivery scaling." },
  { id: 6, name: "Food Processing", description: "Sauce manufacturing, industrial mixers, and FSSAI." },
  { id: 7, name: "Dry Fruits", description: "Vacuum sealing, grading, and gift box packaging." },
  { id: 8, name: "Digital Marketing", description: "Meta ads, local SEO, and client acquisition." }
];

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dynamic fetch categories from backend API
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && Array.isArray(result.data) && result.data.length > 0) {
          setCategories(result.data);
        }
      })
      .catch((err) => console.error("Failed to load categories for MegaMenu", err));
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Keyboard navigation: Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Icons array to assign unique styles to course categories dynamically
  const categoryIcons = [
    <Library className="w-4.5 h-4.5 text-gold" key="1" />,
    <Award className="w-4.5 h-4.5 text-gold" key="2" />,
    <Shield className="w-4.5 h-4.5 text-gold" key="3" />,
    <BookOpen className="w-4.5 h-4.5 text-gold" key="4" />,
  ];

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[640px] bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-xl z-50 transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2 focus:outline-none"
      role="menu"
      tabIndex={-1}
      aria-label="Explore Program Categories"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 pb-2 border-b border-slate-100 mb-1">
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-heading">
            Business Categories
          </h4>
        </div>

        {categories.length > 0 ? (
          categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.id}`}
              onClick={onClose}
              className="flex gap-3.5 p-3 rounded-[16px] hover:bg-slate-50 transition-all duration-200 ease-out group text-left"
              role="menuitem"
            >
              <div className="flex-shrink-0 mt-0.5">
                {categoryIcons[idx % categoryIcons.length]}
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#0F172A] group-hover:text-gold transition-colors duration-200 ease-out font-heading truncate">
                  {cat.name.replace("Course", "Business")}
                </h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-2 py-4 text-center text-xs text-slate-400 font-medium">
            Loading categories catalog...
          </div>
        )}

        <div className="col-span-2 pt-2 border-t border-slate-100 mt-2 flex justify-between items-center text-[10px] font-semibold">
          <span className="text-slate-400">Curated business launch blueprints.</span>
          <Link
            href="/courses"
            onClick={onClose}
            className="text-gold font-bold hover:underline transition-colors flex items-center gap-0.5"
          >
            All Programs <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
