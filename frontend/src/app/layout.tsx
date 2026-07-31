import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { inter, manrope, jetbrainsMono } from "@/app/fonts";

export const metadata: Metadata = {
  title: "YEDC Academy | India's Most Trusted Entrepreneurship Platform",
  description: "Learn practical entrepreneurship from experienced business mentors and scale your venture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background text-[#0F172A] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-white overflow-x-hidden w-full">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
