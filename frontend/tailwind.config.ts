import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
        },
        brandBlue: "#2563EB",
        brandEmerald: "#10B981",
        brandOrange: "#F59E0B",
        brandRed: "#EF4444",
        brandPurple: "#8B5CF6",
        primaryText: "var(--foreground)",
        secondaryText: "var(--foreground-secondary)",
        mutedText: "var(--muted)",
        disabledText: "var(--disabled)",
        // Backward compatibility mappings
        foreground: "var(--foreground)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
