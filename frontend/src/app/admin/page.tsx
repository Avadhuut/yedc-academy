"use client";
import API_BASE_URL from "@/config/api";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";
import { TrendingUp, Users, BookOpen, CreditCard, ChevronRight } from "lucide-react";

interface RecentEnrollment {
  id: number;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  purchasedAt: string;
}

interface CourseRevenue {
  courseId: number;
  courseTitle: string;
  revenue: number;
  enrollmentCount: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  recentEnrollments: RecentEnrollment[];
  courseRevenues: CourseRevenue[];
}

export default function AdminDashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/admin/analytics/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && result.data) {
          setData(result.data);
        }
      })
      .catch((err) => console.error("Failed to load analytics", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-background flex flex-col font-sans">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-background text-primaryText flex flex-col font-sans">
      <AdminNavbar />

      {/* Main Container */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-12 flex-1 flex flex-col space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-primaryText font-heading">Dashboard Overview</h1>
          <p className="text-xs text-secondaryText font-medium">
            Monitor financial reports, course enrollments, and student demographics
          </p>
        </div>

        {/* Counter cards */}
        {data && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider font-heading">Total Sales</span>
                <div className="w-6 h-6 rounded bg-gold/10 flex items-center justify-center text-gold">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primaryText font-heading">₹{data.totalRevenue.toLocaleString("en-IN")}</h3>
                <p className="text-[9px] text-brandEmerald font-bold mt-1">✓ Complete payments</p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider font-heading">Active Students</span>
                <div className="w-6 h-6 rounded bg-gold/10 flex items-center justify-center text-gold">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primaryText font-heading">{data.totalStudents}</h3>
                <p className="text-[9px] text-gold font-bold mt-1">ℹ Registered accounts</p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider font-heading">Active Modules</span>
                <div className="w-6 h-6 rounded bg-gold/10 flex items-center justify-center text-gold">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primaryText font-heading">{data.totalCourses}</h3>
                <p className="text-[9px] text-secondaryText font-bold mt-1">📚 Configured courses</p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider font-heading">Sales Vol</span>
                <div className="w-6 h-6 rounded bg-gold/10 flex items-center justify-center text-gold">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primaryText font-heading">{data.totalEnrollments}</h3>
                <p className="text-[9px] text-secondaryText font-bold mt-1">🎟 Course enrollments</p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Panels Grid */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Revenues Breakdown */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-primaryText font-heading">Popular Courses</h3>
                <p className="text-xs text-secondaryText mt-0.5 font-medium">Revenue generated by active masterclasses</p>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {data.courseRevenues.map((course) => (
                  <div
                    key={course.courseId}
                    className="p-3 bg-background border border-border rounded-xl flex items-center justify-between gap-4 hover:border-gold/25 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primaryText truncate font-heading">{course.courseTitle}</p>
                      <p className="text-[10px] text-mutedText mt-0.5 font-semibold">
                        {course.enrollmentCount} enrollment{course.enrollmentCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primaryText whitespace-nowrap">
                      ₹{course.revenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                {data.courseRevenues.length === 0 && (
                  <p className="text-xs text-secondaryText py-6 text-center font-medium">No transactions recorded yet.</p>
                )}
              </div>
            </div>

            {/* Recent Enrollments */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-primaryText font-heading">Recent Enrollments</h3>
                <p className="text-xs text-secondaryText mt-0.5 font-medium">Latest student registrations in the academy</p>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {data.recentEnrollments.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 bg-background border border-border rounded-xl flex items-center justify-between gap-4 hover:border-gold/25 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primaryText truncate font-heading">{entry.studentName}</p>
                      <p className="text-[10px] text-mutedText mt-0.5 font-semibold truncate">{entry.studentEmail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-gold truncate font-heading">{entry.courseTitle}</p>
                      <p className="text-[9px] text-[#6B7280] mt-0.5 font-semibold">{formatDate(entry.purchasedAt)}</p>
                    </div>
                  </div>
                ))}
                {data.recentEnrollments.length === 0 && (
                  <p className="text-xs text-secondaryText py-6 text-center font-medium">No enrollments recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
