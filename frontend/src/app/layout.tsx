import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

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
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
