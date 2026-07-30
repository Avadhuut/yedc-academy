import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "./Inter-roman.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./Inter-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const manrope = localFont({
  src: [
    {
      path: "./Manrope-roman.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: [
    {
      path: "./JetBrainsMono-roman.woff2",
      weight: "100 800",
      style: "normal",
    },
    {
      path: "./JetBrainsMono-italic.woff2",
      weight: "100 800",
      style: "italic",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
