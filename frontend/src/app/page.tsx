import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Decorative blurred blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 text-center max-w-3xl">
        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
          Next.js + Spring Boot Platform Active
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-500 mb-6 leading-none">
          YEDC Academy
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
          India's most trusted platform for practical entrepreneurship education and business growth.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all cursor-pointer shadow-lg shadow-indigo-600/25 border border-indigo-500/30">
            Sign In / Register
          </Link>
          <Link href="/profile" className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-neutral-900 text-neutral-200 hover:bg-neutral-800 border border-neutral-800 transition-all cursor-pointer">
            My Profile
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-neutral-600 font-medium">
        © 2026 Young Entrepreneur Development Centre. All rights reserved.
      </footer>
    </main>
  );
}
