"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PrimaryButton } from "@/components/Buttons";
import {
  BookOpen,
  Users,
  Wrench,
  TrendingUp,
  Target,
  Eye,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function AboutPage() {
  const differentiators = [
    {
      icon: <BookOpen className="w-5 h-5 text-gold" />,
      title: "Practical Business Training",
      description:
        "Learn through real-world business programs designed by industry experts and successful entrepreneurs."
    },
    {
      icon: <Users className="w-5 h-5 text-gold" />,
      title: "Expert Mentorship",
      description:
        "Receive guidance from experienced professionals who have built and managed successful businesses."
    },
    {
      icon: <Wrench className="w-5 h-5 text-gold" />,
      title: "Complete Business Setup Support",
      description:
        "From choosing the right business model to project reports, machinery guidance, vendor connections, and business planning—we support every stage of your journey."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-gold" />,
      title: "Growth Beyond Launch",
      description:
        "Our goal isn't just to help you start a business, but to help you grow it sustainably with marketing insights and expansion strategies."
    }
  ];

  const stats = [
    { value: "100+", label: "Business Programs" },
    { value: "20,000+", label: "Entrepreneurs Guided" },
    { value: "15+", label: "Years Experience" },
    { value: "100+", label: "Industry Experts" }
  ];

  const reasons = [
    "100+ Practical Business Programs",
    "Industry Expert Trainers",
    "Business Launch Roadmaps",
    "Project Reports & Documentation",
    "Vendor & Machinery Guidance",
    "Government Scheme Awareness",
    "Business Planning Support",
    "Marketing & Branding Guidance",
    "Lifetime Learning Access",
    "Community of Entrepreneurs"
  ];

  return (
    <main className="min-h-screen bg-background text-[#0F172A] flex flex-col font-sans pt-20">
      <Navbar />

      {/* 1. Header & Hero Section */}
      <section className="pt-8 pb-10 md:pt-12 md:pb-12 px-6 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-[#E5E7EB]">
        <div className="max-w-screen-xl mx-auto space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[11px] font-extrabold bg-gold/10 text-gold border border-gold/20 tracking-wider uppercase font-heading">
            <Sparkles className="w-3 h-3" /> ABOUT YEDC
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight font-heading leading-tight max-w-3xl mx-auto">
            More Than a Training Institute. <br />
            <span className="text-gold">Your Business Launch Partner.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-semibold leading-relaxed">
            YEDC empowers aspiring entrepreneurs with practical business programs, expert guidance, and end-to-end support to launch and grow real businesses.
          </p>
        </div>
      </section>

      {/* 2. Side-by-Side Intro Description & Image */}
      <section className="py-8 md:py-12 px-6 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Image of Real Entrepreneurs */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[20px] overflow-hidden border border-slate-200 shadow-md bg-slate-900 aspect-[16/10]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="YEDC Business Launch Guidance"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider block font-heading">
                  Young Entrepreneur Development Center
                </span>
                <p className="text-xs font-bold text-slate-100 font-heading">
                  Empowering 20,000+ Business Founders Across India
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Narrative */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] font-heading leading-tight">
              Transforming Ideas into <span className="text-gold">Successful Businesses</span>
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                At YEDC (Young Entrepreneur Development Center), we believe entrepreneurship should be accessible to everyone with the passion to build something of their own.
              </p>
              <p>
                We don&apos;t just teach business concepts—we help aspiring entrepreneurs transform ideas into successful businesses through practical training, expert mentorship, and end-to-end business guidance.
              </p>
              <p>
                Whether you dream of opening a café, bakery, restaurant, food processing unit, manufacturing business, or any of 100+ business opportunities, YEDC provides the knowledge, tools, and confidence to launch successfully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What Makes YEDC Different (Compact Feature Cards) */}
      <section className="py-8 md:py-12 px-6 bg-slate-50/60 border-b border-[#E5E7EB]">
        <div className="max-w-screen-xl mx-auto space-y-8">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider block font-heading">
              Our Core Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] font-heading">
              What Makes YEDC Different
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Execution-first support engineered specifically for Indian entrepreneurs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {differentiators.map((diff, i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E7EB] hover:border-gold/50 rounded-[20px] p-5 space-y-3 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    {diff.icon}
                  </div>
                  <h3 className="text-sm font-black text-[#0F172A] font-heading leading-snug">
                    {diff.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {diff.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Vision & Mission Cards (Side-by-Side Horizontal Layout) */}
      <section className="py-8 md:py-12 px-6 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision Card */}
          <div className="bg-slate-50/60 border border-[#E5E7EB] rounded-[20px] p-5 sm:p-6 flex items-start gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-gold" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-[#0F172A] font-heading">
                Our Vision
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                To empower aspiring entrepreneurs by making practical business education accessible, enabling them to build successful and sustainable businesses.
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-slate-50/60 border border-[#E5E7EB] rounded-[20px] p-5 sm:p-6 flex items-start gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-gold" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-[#0F172A] font-heading">
                Our Mission
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                To provide practical training, expert mentorship, business planning, and launch support that transforms entrepreneurial dreams into real businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Entrepreneurs Choose YEDC (Compact 2-Column Grid) */}
      <section className="py-8 md:py-12 px-6 bg-slate-50/60 border-b border-[#E5E7EB]">
        <div className="max-w-screen-xl mx-auto space-y-8">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider block font-heading">
              The YEDC Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] font-heading">
              Why Entrepreneurs Choose YEDC
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Comprehensive end-to-end guidance designed for real-world execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {reasons.map((reason, i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-3 shadow-xs hover:border-gold/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 font-heading">
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action (Compact CTA Banner) */}
      <section className="py-8 md:py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto bg-[#0F172A] text-white rounded-[24px] p-6 sm:p-10 text-center space-y-5 shadow-lg relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Ready to Build Your Business?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-semibold">
            Join thousands of aspiring entrepreneurs who have trusted YEDC to transform their business ideas into reality.
          </p>
          <div className="pt-2 flex justify-center">
            <Link href="/courses">
              <PrimaryButton className="h-11 px-7 text-xs">
                Explore Business Programs <ArrowRight className="w-4 h-4" />
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
