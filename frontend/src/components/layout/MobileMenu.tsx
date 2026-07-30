import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import API_BASE_URL from "@/config/api";

interface Category {
  id: number;
  name: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Cafe" },
  { id: 2, name: "Bakery" },
  { id: 3, name: "Restaurant" },
  { id: 4, name: "Snacks Business" },
  { id: 5, name: "Cloud Kitchen" },
  { id: 6, name: "Food Processing" },
  { id: 7, name: "Dry Fruits" },
  { id: 8, name: "Digital Marketing" }
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/categories`)
        .then((res) => res.json())
        .then((result) => {
          if (result.status === "SUCCESS" && Array.isArray(result.data) && result.data.length > 0) {
            setCategories(result.data);
          }
        })
        .catch((err) => console.error("Failed to load categories for mobile menu", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLinkActive = (path: string) => pathname === path;

  return (
    <div className="absolute top-[73px] left-6 right-6 bg-white border border-[#E5E7EB] rounded-[24px] p-6 flex flex-col gap-4 md:hidden shadow-xl z-40 animate-in slide-in-from-top-4 duration-200 ease-out">
      <Link
        href="/"
        onClick={onClose}
        className={`text-sm font-bold p-2.5 rounded-[16px] hover:bg-slate-50 transition-all duration-200 ease-out ${
          isLinkActive("/") ? "text-gold" : "text-[#334155] hover:text-[#0F172A]"
        }`}
      >
        Home
      </Link>
      
      <div className="border-t border-slate-100 my-0.5" />
      
      <Link
        href="/courses"
        onClick={onClose}
        className={`text-sm font-bold p-2.5 rounded-[16px] hover:bg-slate-50 transition-all duration-200 ease-out ${
          isLinkActive("/courses") ? "text-gold" : "text-[#334155] hover:text-[#0F172A]"
        }`}
      >
        Explore Programs
      </Link>

      <div className="border-t border-slate-100 my-0.5" />

      <Link
        href="/about"
        onClick={onClose}
        className={`text-sm font-bold p-2.5 rounded-[16px] hover:bg-slate-50 transition-all duration-200 ease-out ${
          isLinkActive("/about") ? "text-gold" : "text-[#334155] hover:text-[#0F172A]"
        }`}
      >
        About Us
      </Link>
      <Link
        href="/contact"
        onClick={onClose}
        className={`text-sm font-bold p-2.5 rounded-[16px] hover:bg-slate-50 transition-all duration-200 ease-out ${
          isLinkActive("/contact") ? "text-gold" : "text-[#334155] hover:text-[#0F172A]"
        }`}
      >
        Contact
      </Link>
    </div>
  );
};

export default MobileMenu;
