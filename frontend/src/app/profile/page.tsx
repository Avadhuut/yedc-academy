"use client";
import API_BASE_URL from "@/config/api";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import {
  BookOpen,
  User,
  Lock,
  LogOut,
  ChevronRight,
  Award,
  Smartphone,
  CheckCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { user, token, loading, logout, updateUser } = useAuth();
  const router = useRouter();

  // Profile fields state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password fields state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Courses states
  const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [downloadingCertId, setDownloadingCertId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'courses'>("courses");

  // Read URL search parameter for active tab selection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "profile" || tab === "password" || tab === "courses") {
        setActiveTab(tab as any);
      }
    }
  }, []);

  // Load enrolled courses
  useEffect(() => {
    if (user && token && activeTab === "courses") {
      setCoursesLoading(true);
      fetch(`${API_BASE_URL}/me/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status === "SUCCESS" && Array.isArray(result.data)) {
            setEnrolledPrograms(result.data);
          }
        })
        .catch((err) => console.error("Failed to load business programs", err))
        .finally(() => setCoursesLoading(false));
    }
  }, [user, token, activeTab]);

  // Check auth
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        setFullName(user.fullName || "");
        setPhone(user.phone || "");
        setProfileImage(user.profileImage || "");
      }
    }
  }, [user, loading, router]);

  const handleDownloadCertificate = async (courseId: number) => {
    if (!token) return;
    setDownloadingCertId(courseId);
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${courseId}/certificates/claim`, {
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
      setDownloadingCertId(null);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setProfileLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phone, profileImage: profileImage || null }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile.");
      }

      updateUser(result.data);
      setProfileMessage("Profile updated successfully!");
    } catch (err: any) {
      setProfileError(err.message || "An error occurred while updating profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    setPasswordLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update password.");
      }

      setPasswordMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "An error occurred while changing password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-background flex flex-col font-sans pt-24">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-[#0F172A] flex flex-col font-sans pt-24">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 max-w-screen-xl w-full mx-auto p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <aside className="md:col-span-1 space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-5 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold to-gold-light mx-auto flex items-center justify-center text-xl font-black text-[#0F172A] uppercase shadow-inner">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-[#0F172A] text-sm font-heading">{user.fullName}</h3>
              <span className="inline-flex items-center mt-1.5 px-3.5 py-1 rounded-[16px] text-[10px] font-extrabold tracking-wider bg-gold/10 text-gold border border-gold/20 uppercase font-heading">
                {user.role === "ADMIN" ? "Platform Admin" : "Entrepreneur"}
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-2.5 space-y-1">
            <button
              onClick={() => setActiveTab("courses")}
              className={`w-full text-left px-4 py-3 rounded-[16px] text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "courses"
                  ? "bg-gold text-[#0F172A]"
                  : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-50"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              My Programs
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 rounded-[16px] text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-gold text-[#0F172A]"
                  : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-50"
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              Edit Profile
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-4 py-3 rounded-[16px] text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "password"
                  ? "bg-gold text-[#0F172A]"
                  : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-50"
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              Change Password
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-[16px] text-xs font-bold text-[#EF4444] hover:bg-red-50 transition-all flex items-center gap-3 cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          </div>
        </aside>

        {/* Tab content panel */}
        <section className="md:col-span-3">
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 shadow-sm">
            
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] font-heading">My Enrolled Programs</h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Access your launch blueprints and track execution progress.</p>
                </div>

                {coursesLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                  </div>
                ) : enrolledPrograms.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-slate-200 bg-slate-50 rounded-[24px] space-y-4">
                    <p className="text-xs text-slate-500 font-semibold">You have not unlocked any business blueprints yet.</p>
                    <Link href="/courses">
                      <PrimaryButton className="text-xs">Browse Business Programs</PrimaryButton>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {enrolledPrograms.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-slate-50 border border-slate-200 rounded-[24px] overflow-hidden flex flex-col shadow-sm hover:border-gold/30 transition-all duration-200"
                      >
                        <div className="h-36 w-full relative bg-white overflow-hidden border-b border-slate-200">
                          <img
                            src={item.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600"}
                            alt={item.courseTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-[#0F172A] line-clamp-1 group-hover:text-gold transition-colors font-heading">
                              {item.courseTitle.replace("Course", "Business Program")}
                            </h3>
                            <p className="text-[10px] text-slate-500 line-clamp-2 font-semibold leading-relaxed">
                              {item.courseSubtitle}
                            </p>
                          </div>

                          {/* Progress meter */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>Module Progress</span>
                              <span>{item.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden relative">
                              <div
                                className="bg-gold h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${item.progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 border-t border-slate-200/60 pt-4">
                            <Link href={`/courses/${item.courseId}/learn`} className="flex-1">
                              <PrimaryButton className="w-full h-10 text-xs font-black shadow-md flex items-center justify-center gap-2">
                                <span>
                                  {item.progressPercentage === 0
                                    ? "Start Learning Now ▶"
                                    : item.progressPercentage === 100
                                    ? "Review Modules ▶"
                                    : "Continue Learning ▶"}
                                </span>
                              </PrimaryButton>
                            </Link>

                            {item.progressPercentage === 100 && (
                              <PrimaryButton
                                onClick={() => handleDownloadCertificate(item.courseId)}
                                disabled={downloadingCertId === item.courseId}
                                className="h-10 text-xs px-4 whitespace-nowrap bg-[#0F172A] text-white hover:bg-slate-800"
                              >
                                {downloadingCertId === item.courseId ? "Claiming..." : "🎓 Claim Certificate"}
                              </PrimaryButton>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] font-heading">Account Settings</h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Manage your public information and profile attributes.</p>
                </div>

                {profileMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs py-3 px-4 rounded-[16px] font-bold">
                    {profileMessage}
                  </div>
                )}
                {profileError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs py-3 px-4 rounded-[16px] font-bold">
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full h-12 px-4 rounded-[16px] bg-slate-50 border border-slate-200 hover:border-gold/30 focus:border-gold text-[#0F172A] text-sm focus:outline-none transition-all duration-200 font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Email Address (Static)
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full h-12 px-4 rounded-[16px] bg-slate-100 border border-slate-200 text-slate-400 text-sm cursor-not-allowed font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99999 99999"
                      className="w-full h-12 px-4 rounded-[16px] bg-slate-50 border border-slate-200 hover:border-gold/30 focus:border-gold text-[#0F172A] text-sm focus:outline-none transition-all duration-200 font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full h-12 px-4 rounded-[16px] bg-slate-50 border border-slate-200 hover:border-gold/30 focus:border-gold text-[#0F172A] text-sm focus:outline-none transition-all duration-200 font-semibold"
                    />
                  </div>

                  <PrimaryButton type="submit" loading={profileLoading} className="px-6 h-11 text-xs">
                    Save Changes
                  </PrimaryButton>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] font-heading">Security Details</h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Update your account credentials.</p>
                </div>

                {passwordMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs py-3 px-4 rounded-[16px] font-bold">
                    {passwordMessage}
                  </div>
                )}
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs py-3 px-4 rounded-[16px] font-bold">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full h-12 px-4 rounded-[16px] bg-slate-50 border border-slate-200 hover:border-gold/30 focus:border-gold text-[#0F172A] text-sm focus:outline-none transition-all duration-200 font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full h-12 px-4 rounded-[16px] bg-slate-50 border border-slate-200 hover:border-gold/30 focus:border-gold text-[#0F172A] text-sm focus:outline-none transition-all duration-200 font-semibold"
                    />
                  </div>

                  <PrimaryButton type="submit" loading={passwordLoading} className="px-6 h-11 text-xs">
                    Update Password
                  </PrimaryButton>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
