import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
  BookOpen,
  Award,
  Heart,
  Layers,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getFirstName = (name: string) => {
    if (!name) return "";
    return name.trim().split(/\s+/)[0];
  };

  const formatRole = (role: string) => {
    if (role === "ADMIN") return "Platform Admin";
    return "Entrepreneur";
  };

  return (
    <div className="flex items-center gap-4 relative">
      {/* Profile Trigger */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2.5 p-1 px-3 rounded-[16px] bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] transition-all duration-200 cursor-pointer text-left focus:outline-none"
      >
        <Avatar fullName={user.fullName} profileImage={user.profileImage} size="sm" />
        <span className="hidden sm:inline text-xs font-bold text-[#0F172A] font-heading">
          {getFirstName(user.fullName)}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Role-based Menu Dropdown */}
      <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
        {/* Top profile view */}
        <div className="p-3.5 flex items-center gap-3 border-b border-slate-100 pb-4">
          <Avatar fullName={user.fullName} profileImage={user.profileImage} size="md" />
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-[#0F172A] truncate font-heading">{user.fullName}</h4>
            <p className="text-[10px] text-gold font-extrabold uppercase tracking-wider mt-0.5">
              {formatRole(user.role)}
            </p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="py-2 space-y-0.5">
          {user.role === "ADMIN" ? (
            <>
              <Link
                href="/admin"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <Layers className="w-4 h-4 text-gold shrink-0" />
                Venture Console
              </Link>
              <Link
                href="/admin/courses"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <BookOpen className="w-4 h-4 text-gold shrink-0" />
                Program Console
              </Link>
              <Link
                href="/admin/students"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <Users className="w-4 h-4 text-gold shrink-0" />
                Entrepreneurs
              </Link>
              <Link
                href="/admin/payments"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <CreditCard className="w-4 h-4 text-gold shrink-0" />
                Payments
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <TrendingUp className="w-4 h-4 text-gold shrink-0" />
                Reports
              </Link>
              <Link
                href="/profile?tab=profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <Settings className="w-4 h-4 text-gold shrink-0" />
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile?tab=courses"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <BookOpen className="w-4 h-4 text-gold shrink-0" />
                My Programs
              </Link>
              <Link
                href="/profile?tab=courses"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <Award className="w-4 h-4 text-gold shrink-0" />
                Completion Certificates
              </Link>
              <Link
                href="/courses"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <Heart className="w-4 h-4 text-gold shrink-0" />
                Wishlist
              </Link>
              <Link
                href="/profile?tab=profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <User className="w-4 h-4 text-gold shrink-0" />
                Profile
              </Link>
              <Link
                href="/profile?tab=password"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 rounded-[16px] transition-all"
              >
                <Settings className="w-4 h-4 text-gold shrink-0" />
                Settings
              </Link>
            </>
          )}

          <div className="border-t border-slate-100 my-1.5" />

          <button
            onClick={() => {
              setIsDropdownOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-[#EF4444] hover:bg-red-50 rounded-[16px] transition-all cursor-pointer text-left focus:outline-none"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </Dropdown>
    </div>
  );
};

export default UserMenu;
