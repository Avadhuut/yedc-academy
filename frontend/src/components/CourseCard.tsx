import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Coins, Percent, Calendar, ArrowRight } from "lucide-react";

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

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
}

// Custom hook / helper to get realistic business metrics for YEDC programs
export const getBusinessMetrics = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("foundations") || t.includes("zero to one") || t.includes("cafe")) {
    return {
      investment: "₹5L - ₹8L",
      margin: "35% - 45%",
      launchTime: "4 - 6 weeks",
      templates: "12 SOPs & Models",
      certificate: "Yes",
    };
  } else if (t.includes("marketing") || t.includes("digital")) {
    return {
      investment: "₹50k - ₹1.5L",
      margin: "60% - 75%",
      launchTime: "2 weeks",
      templates: "8 Ads & Funnel Templates",
      certificate: "Yes",
    };
  } else if (t.includes("modelling") || t.includes("financial")) {
    return {
      investment: "₹8L - ₹12L",
      margin: "30% - 40%",
      launchTime: "6 - 8 weeks",
      templates: "5 Excel Financial Models",
      certificate: "Yes",
    };
  } else if (t.includes("growth") || t.includes("bootcamp")) {
    return {
      investment: "₹20k - ₹50k",
      margin: "50% - 60%",
      launchTime: "1 - 2 weeks",
      templates: "6 Analytics & Growth SOPs",
      certificate: "Yes",
    };
  }
  // Default values for fallback
  return {
    investment: "₹3L - ₹6L",
    margin: "35% - 50%",
    launchTime: "4 - 6 weeks",
    templates: "10 Business Frameworks",
    certificate: "Yes",
  };
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, enrolled = false }) => {
  const metrics = getBusinessMetrics(course.title);

  // Terminology updates
  const businessCategory = course.category.name.replace("Course", "Business").replace("Startup", "Launch");
  const businessTrainingDuration = course.duration;

  return (
    <div className="bg-white border border-slate-200 hover:border-gold/50 rounded-[16px] overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Thumbnail Header */}
      <div className="relative aspect-[21/9] sm:aspect-[16/8] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        <Image
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&h=340"}
          alt={course.title}
          fill
          sizes="(max-w-700px) 100vw, 33vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5 opacity-80" />

        {/* Category Pill Tag (Top Left) */}
        <span className="absolute top-2.5 left-2.5 bg-[#0F172A]/85 backdrop-blur-md border border-white/15 text-gold text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-heading shadow-sm">
          {businessCategory}
        </span>

        {/* Enrolled Badge (Top Right) */}
        {enrolled && (
          <span className="absolute top-2.5 right-2.5 bg-emerald-600 border border-emerald-400/50 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-heading shadow-md animate-pulse">
            ✓ ENROLLED
          </span>
        )}
      </div>

      {/* Content Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2.5">
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-gold transition-colors duration-200 font-heading line-clamp-1 leading-snug">
            {course.title.replace("Course", "Business Program")}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
            {course.subtitle}
          </p>
        </div>

        {/* Business Metrics Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 py-2 px-3 bg-slate-50 border border-slate-100 rounded-[12px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <Coins className="w-3.5 h-3.5 text-gold shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">Capital</span>
              <span className="text-[11px] font-bold text-[#0F172A] block truncate">{metrics.investment}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <Percent className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">Margin</span>
              <span className="text-[11px] font-extrabold text-emerald-600 block truncate">{metrics.margin}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">Launch</span>
              <span className="text-[11px] font-bold text-[#0F172A] block truncate">{metrics.launchTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">Duration</span>
              <span className="text-[11px] font-bold text-[#0F172A] block truncate">{businessTrainingDuration}</span>
            </div>
          </div>
        </div>

        {/* Footer: Fee & Interactive Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">
              {enrolled ? "Access" : "Fee"}
            </span>
            <span className="text-base font-black text-[#0F172A] leading-tight">
              {enrolled ? "Unlocked" : `₹${course.price}`}
            </span>
          </div>

          <Link
            href={enrolled ? `/courses/${course.id}/learn` : `/courses/${course.id}`}
            className={`h-8 px-3.5 rounded-[10px] text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer font-heading ${
              enrolled
                ? "bg-gold hover:bg-gold-light text-[#0F172A] shadow-md font-black"
                : "bg-gold hover:bg-gold-light text-[#0F172A] shadow-xs"
            }`}
          >
            <span>{enrolled ? "Start Learning ▶" : "Explore Program"}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
