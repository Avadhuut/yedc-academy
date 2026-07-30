import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/layout/UserMenu";
import { Menu, X } from "lucide-react";

export const AdminNavbar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLinkActive = (path: string) => pathname === path;

  return (
    <header className="z-50 bg-white/80 backdrop-blur border-b border-black/[0.08] px-6 py-4 flex justify-between items-center sticky top-0 transition-all duration-200">
      {/* Left: Logo & Hamburger menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-secondaryText hover:text-primaryText rounded-xl hover:bg-surface-hover transition-colors cursor-pointer"
          aria-label="Toggle admin menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link
          href="/admin"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-primaryText"
        >
          <span className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-[#0B0B0F] text-base font-bold shadow-lg shadow-[#D4AF37]/15">
            Y
          </span>
          <span className="font-heading">YEDC Admin</span>
        </Link>
      </div>

      {/* Center: Admin options list (Desktop) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link
          href="/admin"
          className={`transition-colors duration-150 ${
            isLinkActive("/admin") ? "text-[#D4AF37]" : "text-secondaryText hover:text-primaryText"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/courses"
          className={`transition-colors duration-150 ${
            pathname.startsWith("/admin/courses") ? "text-[#D4AF37]" : "text-secondaryText hover:text-primaryText"
          }`}
        >
          Courses
        </Link>
        <Link
          href="/admin/students"
          className={`transition-colors duration-150 ${
            isLinkActive("/admin/students") ? "text-[#D4AF37]" : "text-secondaryText hover:text-primaryText"
          }`}
        >
          Students
        </Link>
        <Link
          href="/admin/payments"
          className={`transition-colors duration-150 ${
            isLinkActive("/admin/payments") ? "text-[#D4AF37]" : "text-secondaryText hover:text-primaryText"
          }`}
        >
          Payments
        </Link>
        <span className="text-secondaryText/20">|</span>
        <Link
          href="/"
          className="text-secondaryText hover:text-primaryText transition-colors duration-150"
        >
          Public Site
        </Link>
      </nav>

      {/* Right: User Avatar Menu */}
      <div className="flex items-center gap-4">
        <span className="hidden lg:inline text-[9px] font-extrabold text-gold uppercase tracking-wider bg-gold/10 border border-gold/20 py-1.5 px-3 rounded-xl font-heading">
          Admin Area
        </span>
        <UserMenu />
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[73px] left-0 right-0 bg-surface border-b border-white/5 p-6 flex flex-col gap-4 md:hidden shadow-2xl z-40 animate-in slide-in-from-top-4 duration-150">
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-sm font-bold p-2.5 rounded-xl hover:bg-background/40 transition-colors ${
              isLinkActive("/admin") ? "text-[#D4AF37]" : "text-[#A8ADB7]"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-sm font-bold p-2.5 rounded-xl hover:bg-background/40 transition-colors ${
              pathname.startsWith("/admin/courses") ? "text-[#D4AF37]" : "text-[#A8ADB7]"
            }`}
          >
            Courses
          </Link>
          <Link
            href="/admin/students"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-sm font-bold p-2.5 rounded-xl hover:bg-background/40 transition-colors ${
              isLinkActive("/admin/students") ? "text-[#D4AF37]" : "text-[#A8ADB7]"
            }`}
          >
            Students
          </Link>
          <Link
            href="/admin/payments"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-sm font-bold p-2.5 rounded-xl hover:bg-background/40 transition-colors ${
              isLinkActive("/admin/payments") ? "text-[#D4AF37]" : "text-[#A8ADB7]"
            }`}
          >
            Payments
          </Link>
          <div className="border-t border-white/5 my-1" />
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-bold p-2.5 text-secondaryText hover:text-primaryText rounded-xl transition-colors"
          >
            Go to Public Site
          </Link>
        </div>
      )}
    </header>
  );
};
export default AdminNavbar;
