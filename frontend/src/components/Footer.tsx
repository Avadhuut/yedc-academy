import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <footer className="z-10 bg-[#0F172A] text-white border-t border-slate-800 py-16 px-6">
      <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 text-lg font-bold tracking-tight text-white">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shrink-0 shadow-sm border border-slate-700">
              <Image
                src="/logo.png"
                alt="युवा उद्योजक विकास केंद्र (YEDC Academy)"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading font-black text-base text-white">YEDC Academy</span>
              <span className="text-[10px] font-extrabold text-slate-400">युवा उद्योजक विकास केंद्र</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-sm font-medium leading-relaxed">
            India's most trusted platform for practical business education. Learn direct from entrepreneurs who have built, validated, and scaled real ventures.
          </p>
        </div>

        {/* Programs Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Programs</h4>
          <ul className="space-y-3 text-xs font-semibold">
            <li>
              <Link href="/courses" className="text-slate-400 hover:text-gold transition-colors duration-150">
                Explore Programs
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-slate-400 hover:text-gold transition-colors duration-150">
                About Our Mission
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-400 hover:text-gold transition-colors duration-150">
                Talk to a Mentor
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Legal</h4>
          <ul className="space-y-3 text-xs font-semibold">
            <li>
              <Link href="/privacy" className="text-slate-400 hover:text-gold transition-colors duration-150">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund" className="text-slate-400 hover:text-gold transition-colors duration-150">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-slate-400 hover:text-gold transition-colors duration-150">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-screen-xl w-full mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-slate-500 font-medium">
          © {new Date().getFullYear()} Young Entrepreneur Development Centre (YEDC). All rights reserved.
        </p>
        <div className="flex gap-6 text-[10px] text-slate-400 font-bold">
          <a href="#" className="hover:text-gold transition-colors duration-150">LinkedIn</a>
          <a href="#" className="hover:text-gold transition-colors duration-150">Twitter</a>
          <a href="#" className="hover:text-gold transition-colors duration-150">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
