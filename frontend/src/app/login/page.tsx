"use client";
import API_BASE_URL from "@/config/api";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { login, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowLoading, setSlowLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Forgot password states
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotEmail, setForgotPasswordEmail] = useState("");
  const [forgotMessage, setForgotPasswordMessage] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setValidationError("Please fill in all required fields.");
      return;
    }
    setValidationError("");
    setLoading(true);
    setSlowLoading(false);
    const slowTimer = setTimeout(() => setSlowLoading(true), 2000);

    try {
      await login(email, password);
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";
      router.push(redirect);
    } catch (err) {
      // handled by AuthContext
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      setSlowLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (response.ok) {
        setForgotPasswordMessage("A reset code has been generated. Please enter it below.");
        setResetMode(true);
      } else {
        const data = await response.json();
        setForgotPasswordMessage(data.message || "Failed to send reset code.");
      }
    } catch (err) {
      setForgotPasswordMessage("Failed to connect to backend service.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !resetCode || !newPassword) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, resetCode, newPassword }),
      });
      if (response.ok) {
        setForgotPasswordMessage("Password reset successfully! You can now log in.");
        setTimeout(() => {
          setForgotPasswordMode(false);
          setResetMode(false);
          setForgotPasswordMessage("");
        }, 2000);
      } else {
        const data = await response.json();
        setForgotPasswordMessage(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setForgotPasswordMessage("Failed to connect to backend service.");
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
          
          {!forgotPasswordMode ? (
            <div className="space-y-2.5">
              {/* Top Branding Header (Compact Rounded Logo Badge + Name + Marathi Subtitle Below) */}
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
                  Welcome Back
                </h1>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-sm">
                  Continue your journey towards business mastery. Sign in to access your premium courses and resources.
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

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                
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
                      placeholder="you@company.com"
                      className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-[#F0F4FF]/50 border border-slate-200 hover:border-slate-300 focus:border-[#855B00] focus:bg-white text-[#0F172A] placeholder-slate-400 text-xs font-semibold transition-all focus:outline-none"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password with Forgot Password link */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-600">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(true);
                        setForgotPasswordEmail(email);
                      }}
                      className="text-[11px] font-bold text-[#855B00] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
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
                </div>

                {/* Dark Navy Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>{slowLoading ? "Connecting to secure server..." : "Signing In..."}</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* Forgot Password Interactive Panel */
            <div className="space-y-3 my-auto">
              <button
                onClick={() => {
                  setForgotPasswordMode(false);
                  setResetMode(false);
                  setForgotPasswordMessage("");
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>

              <div className="space-y-0.5">
                <h1 className="text-xl font-black text-[#0F172A] font-heading tracking-tight">
                  {resetMode ? "Reset Password" : "Forgot Password?"}
                </h1>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {resetMode
                    ? "Enter your reset code and your new password."
                    : "Enter your registered email to receive a password reset code."}
                </p>
              </div>

              {forgotMessage && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] py-2 px-3 rounded-[10px] font-semibold">
                  {forgotMessage}
                </div>
              )}

              {!resetMode ? (
                <form onSubmit={handleForgotPassword} className="space-y-2.5">
                  <div className="relative">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      placeholder="you@company.com"
                      className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-[#F0F4FF]/50 border border-slate-200 text-xs font-semibold focus:outline-none"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 rounded-full bg-[#0F172A] text-white font-bold text-xs shadow-xs"
                  >
                    {loading ? "Sending..." : "Send Reset Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-2.5">
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                    placeholder="Enter Reset Code"
                    className="w-full h-10 px-3 rounded-[10px] bg-[#F0F4FF]/50 border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="New Password"
                    className="w-full h-10 px-3 rounded-[10px] bg-[#F0F4FF]/50 border border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 rounded-full bg-[#0F172A] text-white font-bold text-xs shadow-xs"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Don't have an account? Sign Up */}
          {!forgotPasswordMode && (
            <div className="text-[11px] text-slate-500 text-center font-semibold pt-1">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#855B00] hover:underline font-bold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

        </div>

        {/* Right Column: Corporate Office View Showcase Card (5 Cols) */}
        <div className="lg:col-span-5 relative hidden lg:block min-h-[440px] overflow-hidden bg-slate-900">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
            alt="Corporate Executive Office"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-6 flex flex-col justify-end">
            
            {/* Translucent Glass Quote Card */}
            <div className="bg-slate-950/50 backdrop-blur-md border border-white/20 rounded-[18px] p-4 text-white space-y-1 shadow-lg">
              <p className="text-xs font-bold leading-relaxed text-gold font-serif">
                "The best investment you can make is in your own capabilities."
              </p>
              <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest block pt-0.5">
                YEDC ACADEMY PRINCIPLES
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
