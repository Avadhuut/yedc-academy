"use client";
import API_BASE_URL from "@/config/api";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { Shield, Plus } from "lucide-react";

interface Course {
  id: number;
  title: string;
  price: number;
  level: string;
  status: string;
  category: { name: string };
  instructor: { name: string };
}

export default function AdminCoursesPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/admin/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && Array.isArray(result.data)) {
          setCourses(result.data);
        }
      })
      .catch((err) => console.error("Failed to load courses", err))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleStatus = async (courseId: number, currentStatus: string) => {
    if (!token) return;
    setUpdatingId(courseId);
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (res.ok && result.status === "SUCCESS") {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, status: newStatus } : c))
        );
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
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

      {/* Management Grid */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-12 flex-1 flex flex-col space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primaryText font-heading">Course Management</h1>
            <p className="text-xs text-secondaryText font-medium">Add, configure, and publish academy modules</p>
          </div>
          <Link href="/admin/courses/new">
            <PrimaryButton className="h-10 text-xs px-4">
              <Plus className="w-4 h-4" /> Create New Course
            </PrimaryButton>
          </Link>
        </div>

        {/* Courses Table */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50 text-secondaryText uppercase font-bold tracking-wider">
                  <th className="px-6 py-4 font-heading">Title</th>
                  <th className="px-6 py-4 font-heading">Category</th>
                  <th className="px-6 py-4 font-heading">Instructor</th>
                  <th className="px-6 py-4 font-heading">Price</th>
                  <th className="px-6 py-4 font-heading">Status</th>
                  <th className="px-6 py-4 text-right font-heading">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium text-secondaryText">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-primaryText font-bold font-heading">{course.title}</div>
                      <div className="text-[10px] text-mutedText font-semibold mt-0.5">{course.level}</div>
                    </td>
                    <td className="px-6 py-4">{course.category.name}</td>
                    <td className="px-6 py-4">{course.instructor.name}</td>
                    <td className="px-6 py-4 text-primaryText font-semibold">₹{course.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          course.status === "ACTIVE"
                            ? "bg-brandEmerald/10 text-brandEmerald border border-brandEmerald/20"
                            : "bg-slate-100 text-mutedText border border-border"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(course.id, course.status)}
                        disabled={updatingId === course.id}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          course.status === "ACTIVE"
                            ? "bg-transparent text-secondaryText border-border hover:text-primaryText hover:border-slate-300"
                            : "bg-brandEmerald/10 text-brandEmerald border border-brandEmerald/25 hover:bg-brandEmerald/20"
                        }`}
                      >
                        {course.status === "ACTIVE" ? "Archive" : "Publish"}
                      </button>
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <button className="px-3 py-1.5 bg-transparent border border-border hover:border-gold/50 text-primaryText rounded-xl text-[10px] font-bold transition-all cursor-pointer">
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="py-20 text-center text-secondaryText font-medium text-xs">
              No courses configured. Click the button above to launch one!
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
