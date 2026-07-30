"use client";
import API_BASE_URL from "@/config/api";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";

interface Payment {
  id: number;
  transactionId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paidAt: string;
}

export default function AdminPaymentsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/admin/payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && Array.isArray(result.data)) {
          setPayments(result.data);
        }
      })
      .catch((err) => console.error("Failed to load payments", err))
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

  // Filter payments by search query
  const filtered = payments.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.studentEmail.toLowerCase().includes(q) ||
      p.courseTitle.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q)
    );
  });

  // Compute totals
  const totalSuccessRevenue = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const successCount = payments.filter((p) => p.status === "SUCCESS").length;

  return (
    <main className="min-h-screen bg-background text-primaryText flex flex-col font-sans">
      <AdminNavbar />

      {/* Main Content */}
      <section className="z-10 max-w-6xl w-full mx-auto px-6 py-12 flex-1 flex flex-col space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primaryText font-heading">Payment History</h1>
            <p className="text-xs text-secondaryText font-medium">Complete audit log of all student transactions</p>
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by student, course, or Txn ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 rounded-xl bg-surface border border-border hover:border-gold/50 focus:border-gold text-primaryText placeholder-mutedText text-xs focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider font-heading">Total Revenue</span>
            <h3 className="text-2xl font-bold text-primaryText font-heading">₹{totalSuccessRevenue.toLocaleString("en-IN")}</h3>
            <p className="text-[9px] text-brandEmerald font-bold mt-1">✓ Completed transactions</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider font-heading">Successful Payments</span>
            <h3 className="text-2xl font-bold text-primaryText font-heading">{successCount}</h3>
            <p className="text-[9px] text-gold font-bold mt-1">ℹ Cleared receipts</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider font-heading">Total Records</span>
            <h3 className="text-2xl font-bold text-primaryText font-heading">{payments.length}</h3>
            <p className="text-[9px] text-secondaryText font-bold mt-1">📋 All transaction records</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50 text-secondaryText uppercase font-bold tracking-wider">
                  <th className="px-5 py-4 font-heading">Student</th>
                  <th className="px-5 py-4 font-heading">Course</th>
                  <th className="px-5 py-4 font-heading">Txn ID</th>
                  <th className="px-5 py-4 font-heading">Method</th>
                  <th className="px-5 py-4 font-heading">Amount</th>
                  <th className="px-5 py-4 font-heading">Status</th>
                  <th className="px-5 py-4 font-heading">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium text-secondaryText">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-primaryText font-bold font-heading">{p.studentName}</div>
                      <div className="text-[10px] text-mutedText font-semibold mt-0.5">{p.studentEmail}</div>
                    </td>
                    <td className="px-5 py-4 text-primaryText max-w-[160px]">
                      <span className="block truncate font-heading">{p.courseTitle}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-[9px] text-secondaryText bg-background px-2 py-0.5 rounded-lg border border-border">
                        {p.transactionId}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-background text-primaryText border border-border">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-primaryText font-bold">₹{p.amount.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                          p.status === "SUCCESS"
                            ? "bg-brandEmerald/10 text-brandEmerald border border-brandEmerald/25"
                            : p.status === "PENDING"
                            ? "bg-brandOrange/10 text-brandOrange border border-brandOrange/25"
                            : "bg-brandRed/10 text-brandRed border border-brandRed/25"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">{formatDate(p.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-secondaryText font-medium text-xs">
              No payment records found.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
