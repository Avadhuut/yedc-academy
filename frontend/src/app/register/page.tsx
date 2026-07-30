"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle } from "lucide-react";

export default function RegisterPage() {
  const { register, error, clearError } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setValidationError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }
    setValidationError("");

    setLoading(true);
    try {
      await register(fullName, email, password);
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";
      router.push(redirect);
    } catch (err) {
      // handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const activeError = validationError || error;

  return (
    <main className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-2 sm:p-4 font-sans relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="w-96 h-96 rounded-full bg-gold/10 blur-3xl absolute -top-24 -left-24 pointer-events-none" />

      {/* Main Split Card Container */}
      <div className="max-w-[900px] w-full bg-white border border-slate-200/80 rounded-[26px] overflow-hidden shadow-xl relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch my-auto">
        
        {/* Left Column: Form Section (7 Cols) */}
        <div className="lg:col-span-7 p-4 sm:p-5 lg:p-6 flex flex-col justify-between space-y-2.5">
          
          <div className="space-y-2.5">
            {/* Top Branding Header (Compact Rounded Logo Badge + Name + Subtitle) */}
            <div className="flex flex-col items-center justify-center text-center pt-1">
              <Link href="/" className="group flex flex-col items-center gap-1.5 hover:opacity-95 transition-opacity">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] overflow-hidden bg-white border border-slate-200/90 p-1.5 shadow-2xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/logo.png"
                    alt="YEDC Academy"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <div className="flex flex-col items-center leading-tight space-y-0.5">
                  <span className="font-heading font-black text-lg sm:text-xl text-[#855B00] tracking-tight group-hover:text-gold transition-colors">
                    YEDC Academy
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#855B00]/90 tracking-tight">
                    युवा उद्योजक विकास केंद्र
                  </span>
                </div>
              </Link>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-0.5 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] font-heading tracking-tight">
                Start Your Business Journey
              </h1>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-sm">
                Join over 12,000+ ambitious students and professionals mastering the art of business.
              </p>
            </div>

            {/* Error Notification */}
            {activeError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-[11px] py-1.5 px-3 rounded-[10px]">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="font-bold flex-1">{activeError}</span>
                <button
                  type="button"
                  onClick={() => {
                    setValidationError("");
                    if (error) clearError();
                  }}
                  className="text-red-400 hover:text-red-600 font-black text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              
              {/* Full Name */}
              <div className="space-y-0.5">
                <label className="block text-[11px] font-bold text-slate-600">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (activeError) setValidationError("");
                    }}
                    required
                    placeholder="John Doe"
                    className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-[#F0F4FF]/50 border border-slate-200 hover:border-slate-300 focus:border-[#855B00] focus:bg-white text-[#0F172A] placeholder-slate-400 text-xs font-semibold transition-all focus:outline-none"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-0.5">
                <label className="block text-[11px] font-bold text-slate-600">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (activeError) setValidationError("");
                    }}
                    required
                    placeholder="you@example.com"
                    className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-[#F0F4FF]/50 border border-slate-200 hover:border-slate-300 focus:border-[#855B00] focus:bg-white text-[#0F172A] placeholder-slate-400 text-xs font-semibold transition-all focus:outline-none"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-0.5">
                <label className="block text-[11px] font-bold text-slate-600">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (activeError) setValidationError("");
                    }}
                    required
                    placeholder="••••••••"
                    className="w-full h-10 pl-9 pr-9 rounded-[10px] bg-[#F0F4FF]/50 border border-slate-200 hover:border-slate-300 focus:border-[#855B00] focus:bg-white text-[#0F172A] placeholder-slate-400 text-xs font-semibold transition-all focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[9.5px] text-slate-400 font-medium pt-0.5">
                  Must be at least 8 characters long.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 rounded-full bg-gold hover:bg-gold-light text-[#0F172A] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Already have an account? Login */}
          <div className="text-[11px] text-slate-500 text-center font-semibold pt-1">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#0F172A] hover:text-gold font-bold underline underline-offset-2 transition-colors"
            >
              Login
            </Link>
          </div>

        </div>

        {/* Right Column: Testimonial Photo Card (5 Cols) */}
        <div className="lg:col-span-5 relative hidden lg:block min-h-[440px] overflow-hidden bg-slate-900">
          <Image
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
            alt="Business Education Masterclass"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent p-6 flex flex-col justify-end text-white space-y-2.5">
            
            {/* Stars */}
            <div className="flex gap-1 text-gold text-xs">
              {"★".repeat(5)}
            </div>

            {/* Testimonial Quote */}
            <p className="text-xs lg:text-xs font-bold leading-relaxed text-white font-serif">
              "The curriculum at YEDC transformed my approach to scale. It's the MasterClass of modern business education."
            </p>

            {/* Author */}
            <div className="pt-0.5">
              <span className="text-[11px] font-bold text-white block">Sarah Jenkins</span>
              <span className="text-[10px] text-slate-300 font-medium block">Founder, TechVision Inc.</span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
