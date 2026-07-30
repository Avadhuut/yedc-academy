"use client";

import API_BASE_URL from "@/config/api";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import {
  Shield,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  HelpCircle,
  Star,
  Users,
  Layers,
  CheckCircle,
  Building,
  Target,
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  thumbnail: string;
  level: string;
  duration: string;
  category: { name: string };
  instructor: { name: string; profileImage?: string };
}

export default function Home() {
  const [featuredPrograms, setFeaturedPrograms] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/courses`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "SUCCESS" && Array.isArray(result.data)) {
          setFeaturedPrograms(result.data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Failed to load business programs", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSmoothScroll = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Business Categories
  const categories = [
    {
      name: "Cafe",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80",
      description: "Quick-service espresso bars & dessert lounges."
    },
    {
      name: "Bakery",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
      description: "Artisanal breads, commercial cakes & pastry units."
    },
    {
      name: "Restaurant",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
      description: "Casual dining, fine-dine concepts & QSR models."
    },
    {
      name: "Snacks Business",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
      description: "Namkeen, packaged chips & roasted snack production."
    },
    {
      name: "Cloud Kitchen",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80",
      description: "Low-overhead, delivery-only digital brands."
    },
    {
      name: "Food Processing",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
      description: "Commercial sauces, jams, and ready-to-eat products."
    },
    {
      name: "Dry Fruits",
      image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80",
      description: "Premium packaging, roasting & export distribution."
    },
    {
      name: "Digital Marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
      description: "Customer acquisition strategies for physical brands."
    }
  ];

  // Success Stories
  const successStories = [
    {
      before: "Software Engineer",
      after: "Café Owner",
      name: "Aditya Roy",
      businessName: "Third Wave Espresso Lounge",
      location: "Pune, Maharashtra",
      revenue: "₹4.5 Lakhs / month",
      story: "I wanted to exit coding but had zero commercial food experience. YEDC's blueprint walked me through menu creation, layout planning, and machine sourcing. I broke even in month 3.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      before: "Corporate Manager",
      after: "Bakery Brand Founder",
      name: "Sneha Iyer",
      businessName: "The Crumb Factory",
      location: "Bengaluru, Karnataka",
      revenue: "₹5.8 Lakhs / month",
      story: "I had baking skills but didn't know how to set up a commercial deck oven or source bulk ingredients. The supplier lists and cost sheets in the program saved me months of trial and error.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      before: "Mechanical Engineer",
      after: "Food Processing Owner",
      name: "Rajesh Kulkarni",
      businessName: "Sahyadri Spices & Foods",
      location: "Nashik, Maharashtra",
      revenue: "₹8.2 Lakhs / month",
      story: "FSSAI compliance and commercial batch machinery sourcing were completely unknown to me. YEDC provided direct manufacturer contacts and shelf-life testing procedures.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      before: "School Teacher",
      after: "Cloud Kitchen Founder",
      name: "Kavita Sharma",
      businessName: "Zaika Express Multi-Brand Kitchen",
      location: "Indore, Madhya Pradesh",
      revenue: "₹6.1 Lakhs / month",
      story: "I started with zero restaurant experience. The blueprint taught me cloud kitchen menu optimization, Zomato/Swiggy algorithm hacks, and precise portion packaging cost sheets.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      before: "Sales Executive",
      after: "Snacks Manufacturer",
      name: "Vikram Salunkhe",
      businessName: "Kolhapuri Namkeen Unit",
      location: "Kolhapur, Maharashtra",
      revenue: "₹7.4 Lakhs / month",
      story: "YEDC's program gave me precise oil absorption formulas and automated frying machine specs. Today my packaged namkeen is distributed across 120+ retail stores.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      before: "Banking Associate",
      after: "Dry Fruits Brand Founder",
      name: "Meera Deshmukh",
      businessName: "Royal Nut Harvest & Packaging",
      location: "Mumbai, Maharashtra",
      revenue: "₹9.5 Lakhs / month",
      story: "Sourcing direct from farms without middlemen saved me 35% on raw material costs. The packaging & vacuum sealing SOPs gave my product a luxury retail look.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"
    }
  ];

  const experts = [
    {
      name: "Dr. Rajesh Patil",
      role: "Food Processing & Tech Director",
      experience: "18+ Yrs Exp",
      specialty: "Machinery Layout, FSSAI & Shelf-Life SOPs",
      bio: "Former R&D Lead at Parle & Britannia. Has guided 450+ entrepreneurs in setting up commercial food processing & packaging plants.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
      projects: "320+ Plant Setups"
    },
    {
      name: "Ananya Deshmukh",
      role: "Commercial Bakery & QSR Lead",
      experience: "14+ Yrs Exp",
      specialty: "Recipe Scaling, Deck Ovens & Costing Sheets",
      bio: "Master Pastry Chef & Franchise Operations Strategist. Trained over 600+ bakery owners in batch production & raw material sourcing.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      projects: "500+ Bakeries Launched"
    },
    {
      name: "Sanjay Verma",
      role: "Industrial Manufacturing Advisor",
      experience: "20+ Yrs Exp",
      specialty: "Automation, Project Reports & Govt Loans",
      bio: "Senior Industrial Mechanical Specialist. Expert in PMEGP/CMEGP government loan subsidies, factory compliance, and line automation.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
      projects: "₹45 Cr Subsidies"
    },
    {
      name: "Priya Kulkarni",
      role: "Dairy & FMCG Supply Chain Director",
      experience: "12+ Yrs Exp",
      specialty: "Cold Chain, Vendor Networks & Branding",
      bio: "FMCG Brand Growth Mentor. Specialist in establishing distributor channels, cold chain logistics, and retail store placement across India.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      projects: "150+ Brands Scaled"
    }
  ];

  const stats = [
    { value: "100+", label: "Business Programs" },
    { value: "200+", label: "Entrepreneurs Guided" },
    { value: "5", label: "Years Experience" },
    { value: "10+", label: "Industry Experts" }
  ];

  const faqs = [
    {
      question: "Will YEDC help me buy equipment?",
      answer: "Yes, every blueprint includes verified vendor lists and direct manufacturer contacts for commercial machinery. You buy directly from suppliers without middlemen markups."
    },
    {
      question: "Are these programs suitable for complete beginners?",
      answer: "Absolutely. We start from ground-zero: registering your business name, setting up menu pricing, acquiring licenses, and configuring basic operations before moving into advanced marketing."
    },
    {
      question: "What resource files are included with the program?",
      answer: "You obtain downloadable MS Excel costing spreadsheets, recipe scaling calculators, vendor contact lists, layout designs, and printable SOP PDFs for employee training."
    }
  ];

  return (
    <main className="min-h-screen bg-background text-[#0F172A] flex flex-col font-sans pt-16">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-8 pb-10 md:pt-10 md:pb-12 lg:pt-12 lg:pb-14 px-6 border-b border-[#E5E7EB] bg-gradient-to-b from-white to-[#F8FAFC] overflow-hidden">
        <div className="absolute inset-0 bg-radial-gold-ambient pointer-events-none" />
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0F172A] font-heading leading-[1.1] max-w-2xl">
              From Dream to <span className="text-gold">Business</span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight font-heading">
              Learn How to Start Any Business with Industry Experts
            </h2>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
              Master every stage of your entrepreneurial journey with practical business programs, project reports, vendor networks, machinery guidance, government scheme support, and expert mentorship—all designed to help you launch with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/courses" className="w-full sm:w-auto">
                <PrimaryButton className="w-full sm:w-auto">
                  Explore Business Programs <ArrowRight className="w-4.5 h-4.5" />
                </PrimaryButton>
              </Link>
              <SecondaryButton
                onClick={() => handleSmoothScroll("success-stories")}
                className="w-full sm:w-auto"
              >
                Watch Success Stories
              </SecondaryButton>
            </div>
          </div>

          {/* Right Column: 3-Image Collage inside Soft Blue Container Frame */}
          <div className="lg:col-span-5 max-w-[520px] w-full mx-auto lg:mx-0">
            <div className="bg-[#E8F0FE]/70 p-3.5 rounded-[36px] shadow-sm border border-blue-100/60">
              <div className="grid grid-cols-2 gap-3.5 h-[430px] w-full">
                
                {/* 1. Left Tall Vertical Image Card */}
                <div className="col-span-1 h-full rounded-[24px] overflow-hidden relative border border-white/80 shadow-xs group">
                  <Image
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
                    alt="Entrepreneur Team at Work"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* 2. Right Column - 2 Stacked Image Cards */}
                <div className="col-span-1 flex flex-col gap-3.5 h-full">
                  
                  {/* Top Right Card */}
                  <div className="h-1/2 rounded-[24px] overflow-hidden relative border border-white/80 shadow-xs group">
                    <Image
                      src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                      alt="Commercial Kitchen & Plating"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Bottom Right Card */}
                  <div className="h-1/2 rounded-[24px] overflow-hidden relative border border-white/80 shadow-xs group">
                    <Image
                      src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                      alt="Espresso Bar Barista Training"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Impact Section */}
      <section className="py-10 md:py-12 px-6 bg-white border-b border-[#E5E7EB] relative z-20">
        <div className="max-w-screen-xl mx-auto space-y-6">

          {/* Section Header */}
          <div className="text-center space-y-1.5 max-w-2xl mx-auto">
            <span className="text-[10px] sm:text-[11px] font-extrabold text-gold uppercase tracking-widest block font-heading">
              OUR IMPACT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] font-heading">
              Helping Entrepreneurs Build Successful Businesses
            </h2>
          </div>

          {/* Stats Bar */}
          <div className="bg-[#0F172A] text-white rounded-[24px] px-6 py-4 sm:py-5 shadow-lg border border-slate-800/80">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-0.5 pt-3 lg:pt-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-gold font-heading tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-300 uppercase tracking-widest font-heading">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Featured Business Programs */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-slate-50 border-b border-[#E5E7EB]">
        <div className="max-w-screen-xl mx-auto space-y-12">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-heading">
                Featured Business Programs
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-semibold">
                Click on a category to explore complete training programs and tools.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-gold hover:text-gold-light text-sm font-bold transition-colors flex items-center gap-1"
            >
              View all Programs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Business Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/courses?category=${i + 1}&name=${encodeURIComponent(cat.name)}`}
                className="group bg-white border border-[#E5E7EB] hover:border-gold/40 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-w-700px) 100vw, 25vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-gold transition-colors font-heading leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium leading-normal">
                      {cat.description}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1 text-[11px] font-extrabold text-gold uppercase tracking-wider">
                    Explore Program <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>



        </div>
      </section>

      {/* 4. Success Stories */}
      <section id="success-stories" className="py-10 md:py-14 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/60 border-b border-[#E5E7EB] overflow-hidden relative">
        <div className="space-y-6">

          {/* Header Block */}
          <div className="text-center space-y-2 max-w-xl mx-auto px-6">
            <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider block font-heading">
              Real Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-heading">
              Entrepreneurs Sourced from YEDC
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-semibold">
              Before and After cases of verified startups running across India.
            </p>
          </div>

          {/* Continuous Infinite Marquee Track (Right to Left) */}
          <div className="relative w-full overflow-hidden py-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-44 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-44 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10" />

            <div className="animate-marquee gap-6 flex items-stretch">
              {[...successStories, ...successStories].map((story, i) => (
                <div
                  key={i}
                  className="w-[360px] sm:w-[420px] shrink-0 bg-white border border-slate-200/90 hover:border-gold/60 p-6 sm:p-7 rounded-[28px] space-y-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300 group"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-wider">
                      <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200/80 shrink-0">
                        Before: {story.before}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                        After: {story.after}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium italic">
                      "{story.story}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden relative bg-slate-100 border border-slate-200 shrink-0">
                        <Image
                          src={story.image}
                          alt={story.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate font-heading">
                          {story.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-500 truncate">
                          {story.businessName}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                          {story.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-xl">
                      <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold block">
                        Monthly Revenue
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 font-heading">
                        {story.revenue}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Meet Our Experts */}
      <section id="experts" className="py-12 md:py-16 lg:py-20 px-6 bg-slate-50/70 border-b border-[#E5E7EB]">
        <div className="max-w-screen-xl mx-auto space-y-12">

          {/* Header */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider block font-heading">
              Field Mentors
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-heading">
              Meet Our Experts
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-semibold">
              Learn directly from seasoned industry practitioners with proven execution experience.
            </p>
          </div>

          {/* Compact & Clean Experts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {experts.map((expert, i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E7EB] hover:border-gold/50 rounded-[20px] p-5 text-center shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center space-y-3 group"
              >
                {/* Circular Portrait */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden relative mx-auto border-2 border-gold/30 ring-2 ring-gold/10 shadow-sm group-hover:scale-105 transition-transform duration-500 shrink-0">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    sizes="96px"
                    className="object-cover object-top"
                  />
                </div>

                <div className="space-y-0.5 w-full">
                  <h3 className="text-sm font-black text-[#0F172A] font-heading leading-snug">
                    {expert.name}
                  </h3>
                  <p className="text-[11px] font-bold text-gold uppercase tracking-wider font-heading">
                    {expert.role}
                  </p>
                </div>

                <p className="text-[11px] text-slate-500 leading-normal font-medium">
                  {expert.specialty}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-3xl w-full mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider block font-heading">
              Support
            </span>
            <h2 className="text-3xl font-black text-[#0F172A] font-heading">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500 font-semibold">Got questions about our blueprints? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-[#E5E7EB] rounded-[24px] overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-sm text-[#0F172A] hover:text-gold transition-colors focus:outline-none"
                >
                  <span className="font-heading text-sm font-black">{faq.question}</span>
                  <span className="text-gold text-lg font-bold">{activeFaq === index ? "−" : "+"}</span>
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6 text-xs text-slate-500 leading-relaxed font-semibold border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-[#0F172A] text-white rounded-[24px] p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
            Ready to Start Your Business?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-semibold">
            Gain immediate access to verified launch blueprints, supplier contacts, costing sheets, and certificates.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/courses">
              <PrimaryButton className="w-full sm:w-auto h-12 text-xs">
                Explore Business Programs <ArrowRight className="w-4 h-4" />
              </PrimaryButton>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto h-12 px-6 rounded-[16px] bg-transparent border border-slate-700 hover:border-gold text-white hover:text-gold font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                Talk to a Mentor
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
