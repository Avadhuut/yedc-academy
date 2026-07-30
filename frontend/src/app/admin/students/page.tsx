"use client";
import API_BASE_URL from "@/config/api";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";

interface UserAccount {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminStudentsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

    fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && Array.isArray(result.data)) {
          setUsers(result.data);
        }
      })
      .catch((err) => console.error("Failed to load users", err))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleUserStatus = async (userId: number, currentStatus: string) => {
    if (!token) return;
    setUpdatingId(userId);
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (res.ok && result.status === "SUCCESS") {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
      } else {
        alert(result.message || "Failed to update user status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating user status");
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

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter users by search query
  const filteredUsers = users.filter((u) => {
    const matchQuery = searchQuery.trim().toLowerCase();
    if (matchQuery === "") return true;
    return (
      u.fullName.toLowerCase().includes(matchQuery) ||
      u.email.toLowerCase().includes(matchQuery)
    );
  });

  return (
    <main className="min-h-screen bg-background text-primaryText flex flex-col font-sans">
      <AdminNavbar />

      {/* Main Content Area */}
      <section className="z-10 max-w-5xl w-full mx-auto px-6 py-12 flex-1 flex flex-col space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primaryText font-heading">Student Management</h1>
            <p className="text-xs text-secondaryText font-medium">View user metadata and deactivate/activate student memberships</p>
          </div>

          {/* Keyword Search */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 rounded-xl bg-surface border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-xs focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50 text-secondaryText uppercase font-bold tracking-wider">
                  <th className="px-6 py-4 font-heading">Name</th>
                  <th className="px-6 py-4 font-heading">Email</th>
                  <th className="px-6 py-4 font-heading">Role</th>
                  <th className="px-6 py-4 font-heading">Registered On</th>
                  <th className="px-6 py-4 font-heading">Status</th>
                  <th className="px-6 py-4 text-right font-heading">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium text-secondaryText">
                {filteredUsers.map((acc) => (
                  <tr key={acc.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-primaryText font-bold font-heading">{acc.fullName}</div>
                      <div className="text-[10px] text-mutedText font-semibold mt-0.5">{acc.phone || "No phone"}</div>
                    </td>
                    <td className="px-6 py-4">{acc.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                          acc.role === "ADMIN"
                            ? "bg-brandPurple/10 text-brandPurple border border-brandPurple/20"
                            : "bg-gold/10 text-gold border border-gold/20"
                        }`}
                      >
                        {acc.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(acc.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          acc.status === "ACTIVE"
                            ? "bg-brandEmerald/10 text-brandEmerald border border-brandEmerald/20"
                            : "bg-brandRed/10 text-brandRed border border-brandRed/20"
                        }`}
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {acc.role !== "ADMIN" && (
                        <button
                          onClick={() => toggleUserStatus(acc.id, acc.status)}
                          disabled={updatingId === acc.id}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                            acc.status === "ACTIVE"
                              ? "bg-transparent text-brandRed border-brandRed/20 hover:bg-brandRed/10"
                              : "bg-brandEmerald/10 text-brandEmerald border border-brandEmerald/25 hover:bg-brandEmerald/20"
                          }`}
                        >
                          {updatingId === acc.id ? (
                            <div className="w-3.5 h-3.5 border border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
                          ) : acc.status === "ACTIVE" ? (
                            "Deactivate"
                          ) : (
                            "Reactivate"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-20 text-center text-secondaryText font-medium text-xs">
              No matching registered accounts found.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
