'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "@/components/layout/UserMenu";
import { NavLink } from "@/components/ui/NavLink";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEscKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out"
      onKeyDown={handleEscKey}
    >
      <header className={`w-full transition-all duration-300 ease-out ${
        isScrolled ? "px-6 pt-3" : "px-0 pt-0"
      }`}>
        <div className={`mx-auto w-full flex justify-between items-center transition-all duration-300 ease-out ${
          isScrolled
            ? "max-w-screen-xl h-14 rounded-[16px] bg-white/80 backdrop-blur-md border border-[#E5E7EB] px-6 shadow-md shadow-[#0F172A]/5"
            : "max-w-full h-16 bg-white/95 border-b border-[#E5E7EB] px-8 sm:px-12 md:px-16"
        }`}>
          
          {/* Left: Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#334155] hover:text-[#0F172A] rounded-xl hover:bg-slate-100 transition-all duration-200 ease-out cursor-pointer"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle main menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              href="/"
              className="flex items-center gap-2.5 text-[#0F172A] group"
            >
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-200/80 p-0.5 shrink-0 shadow-2xs group-hover:border-gold/50 transition-colors">
                <Image
                  src="/logo.png"
                  alt="युवा उद्योजक विकास केंद्र (YEDC Academy)"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-heading font-black text-sm text-[#0F172A] tracking-tight group-hover:text-gold transition-colors">YEDC Academy</span>
                <span className="text-[9px] font-extrabold text-slate-500 tracking-tight">युवा उद्योजक विकास केंद्र</span>
              </div>
            </Link>
          </div>

          {/* Center: Centered Navigation (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-8 text-xs lg:text-sm font-semibold">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/courses">Explore Programs</NavLink>
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>

          {/* Right: Actions, Search & User Avatar */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/profile?tab=courses">
                  <button className="h-9 px-3.5 rounded-[14px] bg-[#855B00]/10 hover:bg-[#855B00]/15 border border-[#855B00]/25 text-[#855B00] font-black text-xs transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer">
                    <span className="hidden sm:inline">My Purchased Courses</span>
                    <span className="sm:hidden">My Courses</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </button>
                </Link>
                <UserMenu />
              </>
            ) : (
              <div className="flex items-center gap-2.5 lg:gap-4">
                <Link
                  href="/login"
                  className="text-[#334155] hover:text-[#0F172A] text-xs font-bold transition-colors duration-200 ease-out cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="h-9 px-4 rounded-[16px] bg-gold hover:bg-gold-light text-[#0F172A] font-bold text-xs flex items-center justify-center transition-all duration-200 ease-out shadow-sm cursor-pointer"
                >
                  Launch Business
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Collapsible Mobile Menu panel */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
};

export default Navbar;
