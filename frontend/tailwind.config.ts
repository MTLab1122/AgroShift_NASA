import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#166534", // Primary agricultural deep green
          hover: "#14532d",
          light: "#22c55e",
        },
        nasa: {
          blue: "#0B3D91", // Official NASA Insignia Blue
          lightBlue: "#38BDF8", // Sky blue
          red: "#DC2626", // Danger red / NASA vector red
          dark: "#0F172A", // Dark background
          light: "#E6F1FF",
        },
        agro: {
          green: "#166534",
          freshLeaf: "#22C55E",
          success: "#16A34A",
          sky: "#38BDF8",
          soil: "#92400E",
          amber: "#F59E0B",
          danger: "#DC2626",
          cleanWhite: "#FFFFFF",
          lightBg: "#F8FAFC",
          muted: "#64748B",
          border: "#E2E8F0",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "28px",
        "3xl": "32px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08)",
        hover: "0 8px 24px rgba(15, 23, 42, 0.12)",
        floating: "0 16px 40px rgba(15, 23, 42, 0.16)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        soft: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 250ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-up": "fadeUp 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-down": "fadeDown 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "scale-in": "scaleIn 250ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        float: "float 4s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(0.99)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
