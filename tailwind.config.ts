import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        verde: {
          DEFAULT: "#1a5c3a",
          mid: "#2d7a52",
          light: "#e8f4ed",
          muted: "#f2f8f4",
        },
        amarelo: {
          DEFAULT: "#f0b429",
          dark: "#c4911a",
          light: "#fff8e6",
          muted: "#fffcf0",
        },
        azul: {
          DEFAULT: "#003f6b",
          mid: "#1565a0",
          light: "#e3eef8",
        },
        dark: {
          DEFAULT: "#111613",
          2: "#1e2620",
        },
        body: "#3d4840",
        mid: "#6b7568",
        muted: {
          DEFAULT: "#f2f8f4",
          foreground: "#6b7568",
        },
        border: "#e2e8e4",
        bg: "#f8faf8",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          muted: "var(--primary-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          muted: "var(--accent-muted)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        input: "var(--border)",
        ring: "var(--primary)",
        secondary: {
          DEFAULT: "#2d7a52",
          foreground: "#ffffff",
        },
        sidebar: {
          DEFAULT: "#f8faf8",
          foreground: "#111613",
          primary: "#1a5c3a",
          "primary-foreground": "#ffffff",
          accent: "#e8f4ed",
          "accent-foreground": "#111613",
          border: "#e2e8e4",
          ring: "#1a5c3a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulse_soft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-in": "slide-in 0.4s ease-out forwards",
        pulse_soft: "pulse_soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
