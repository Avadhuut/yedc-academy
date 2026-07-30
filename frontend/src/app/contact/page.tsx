"use client";
import API_BASE_URL from "@/config/api";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, GraduationCap, Briefcase, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Cafe");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          businessCategory,
          message,
        }),
      });

      const result = await res.json();

      if (res.ok && result.status === "SUCCESS") {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setError(result.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to backend server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 text-[#0F172A] flex flex-col font-sans pt-16">
      <Navbar />

      <section className="z-10 max-w-screen-xl w-full mx-auto px-6 py-4 md:py-6 lg:py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Info & Touchpoints */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#0F172A] tracking-tight">
                Connect with Excellence
              </h1>
              <div className="w-12 h-1 bg-[#855B00] rounded-full" />
            </div>

            {/* Contact Touchpoints */}
            <div className="space-y-6 pt-2">
              
              {/* General Inquiries */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-serif text-[#0F172A]">General Inquiries</h3>
                  <p className="text-xs text-slate-500 font-semibold block">hello@yedcacademy.in</p>
                  <p className="text-xs text-slate-500 font-semibold block">+91 22 4567 8900</p>
                </div>
              </div>

              {/* Admissions Support */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-serif text-[#0F172A]">Admissions Support</h3>
                  <p className="text-xs text-slate-500 font-semibold block">admissions@yedcacademy.in</p>
                  <p className="text-xs text-slate-400 font-medium block">Mon - Sat, 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              {/* Corporate Training */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-serif text-[#0F172A]">Corporate Training</h3>
                  <p className="text-xs text-slate-500 font-semibold block">partnerships@yedcacademy.in</p>
                  <p className="text-xs text-slate-400 font-medium block">Custom solutions for your workforce</p>
                </div>
              </div>

            </div>

            {/* Response Time Box */}
            <div className="bg-[#F0F4FF]/70 border border-blue-100 rounded-[20px] p-5 space-y-1 mt-6">
              <span className="text-[10px] font-extrabold text-[#855B00] uppercase tracking-wider block font-heading">
                RESPONSE TIME
              </span>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Our concierge team typically responds within 4 business hours.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form Card */}
          <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-[32px] p-8 sm:p-10 shadow-lg shadow-slate-200/50">
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs py-3.5 px-4 rounded-[16px] mb-6 text-center font-bold">
                Thank you! Your message has been received. Our concierge team will reach out to you within 4 business hours.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs py-3 px-4 rounded-[16px] mb-6 text-center font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (success) setSuccess(false);
                      if (error) setError("");
                    }}
                    placeholder="Aarav Sharma"
                    className="w-full h-12 px-4 rounded-[14px] bg-[#F0F4FF]/50 border border-slate-100 hover:border-slate-200 focus:border-[#855B00] focus:bg-white text-[#0F172A] placeholder-slate-400 text-sm focus:outline-none transition-all font-semibold"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (success) setSuccess(false);
                      if (error) setError("");
                    }}
                    placeholder="aarav@company.com"
                    className="w-full h-12 px-4 rounded-[14px] bg-[#F0F4FF]/50 border border-slate-100 hover:border-slate-200 focus:border-[#855B00] focus:bg-white text-[#0F172A] placeholder-slate-400 text-sm focus:outline-none transition-all font-semibold"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (success) setSuccess(false);
                      if (error) setError("");
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full h-12 px-4 rounded-[14px] bg-[#F0F4FF]/50 border border-slate-100 hover:border-slate-200 focus:border-[#855B00] focus:bg-white text-[#0F172A] placeholder-slate-400 text-sm focus:outline-none transition-all font-semibold"
                  />
                </div>

                {/* Business Category */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Business Category</label>
                  <select
                    value={businessCategory}
                    onChange={(e) => {
                      setBusinessCategory(e.target.value);
                      if (success) setSuccess(false);
                      if (error) setError("");
                    }}
                    className="w-full h-12 px-4 rounded-[14px] bg-[#F0F4FF]/50 border border-slate-100 hover:border-slate-200 focus:border-[#855B00] focus:bg-white text-[#0F172A] text-sm focus:outline-none transition-all font-semibold cursor-pointer"
                  >
                    <option value="Cafe">Cafe</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Snacks Business">Snacks Business</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Dry Fruits">Dry Fruits</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                </div>

              </div>

              {/* Your Message */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600">Your Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (success) setSuccess(false);
                    if (error) setError("");
                  }}
                  placeholder="Tell us about your business vision..."
                  className="w-full p-4 rounded-[14px] bg-[#F0F4FF]/50 border border-slate-100 hover:border-slate-200 focus:border-[#855B00] focus:bg-white text-[#0F172A] placeholder-slate-400 text-sm focus:outline-none transition-all resize-none font-semibold"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-8 rounded-full bg-[#704D00] hover:bg-[#855B00] text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
