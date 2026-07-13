import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans:    ["Space Grotesk", "DM Sans", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        border:     "oklch(var(--border))",
        input:      "oklch(var(--input))",
        ring:       "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        "ice-header-gradient": "linear-gradient(180deg, #FFFFFF 0%, #A6F7FF 100%)",
        primary: {
          DEFAULT:    "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT:    "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT:              "oklch(var(--sidebar))",
          foreground:           "oklch(var(--sidebar-foreground))",
          primary:              "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent:               "oklch(var(--sidebar-accent))",
          "accent-foreground":  "oklch(var(--sidebar-accent-foreground))",
          border:               "oklch(var(--sidebar-border))",
          ring:                 "oklch(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        xl:   "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        pill: "9999px",
      },
      boxShadow: {
        glass:      "0 4px 32px oklch(0.6 0.14 210 / 18%), inset 0 1px 0 oklch(0.99 0.005 220 / 70%)",
        "glass-hover": "0 8px 48px oklch(0.6 0.14 210 / 24%), inset 0 1px 0 oklch(0.99 0.005 220 / 85%)",
        "cyan-glow": "0 0 24px oklch(0.7 0.14 200 / 38%), 0 0 48px oklch(0.7 0.14 200 / 20%)",
        "card-lift": "0 16px 48px oklch(0.6 0.14 210 / 20%)",
        phone:      "0 40px 100px oklch(0.6 0.14 210 / 28%), 0 0 60px oklch(0.7 0.14 200 / 22%)",
        /* ── Cryo extensions (dark steel) ── */
        "cryo-glass":      "0 1px 0 rgba(255,255,255,0.10) inset, 0 -1px 0 rgba(0,0,0,0.30) inset, 0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px oklch(0.78 0.14 195 / 0.08)",
        "cryo-glass-strong": "0 1px 0 rgba(255,255,255,0.14) inset, 0 -1px 0 rgba(0,0,0,0.40) inset, 0 20px 60px rgba(0,0,0,0.55), 0 0 32px oklch(0.78 0.14 195 / 0.12)",
        "cryo-cyan-glow":  "0 0 24px oklch(0.78 0.14 195 / 0.38%), 0 0 48px oklch(0.55 0.22 260 / 0.22%)",
        "cryo-ice-depth":  "0 24px 64px rgba(0,0,0,0.55), 0 8px 24px oklch(0.55 0.22 260 / 0.18%), inset 0 1px 0 rgba(255,255,255,0.10)",
        "cryo-floating":    "0 24px 64px rgba(0,0,0,0.55), 0 8px 24px oklch(0.55 0.22 260 / 0.18%), 0 0 0 1px rgba(255,255,255,0.08)",
        "cryo-vault-glow": "0 0 0 1px oklch(0.78 0.14 195 / 0.50%), 0 0 32px oklch(0.78 0.14 195 / 0.32%), 0 0 64px oklch(0.55 0.22 260 / 0.22%)",
        "glass-button-glow": "0 0 24px oklch(0.78 0.14 195 / 0.40%), 0 8px 16px oklch(0.55 0.22 260 / 0.30%), inset 0 1px 0 rgba(255,255,255,0.30%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        /* ── Cryo keyframes ── */
        "frost-spreading": {
          "0%":   { clipPath: "inset(0 100% 0 0)", opacity: "0.4" },
          "50%":  { clipPath: "inset(0 0 0 0)", opacity: "0.9" },
          "100%": { clipPath: "inset(0 0 0 0)", opacity: "0.7" },
        },
        "particles-drifting": {
          "0%":   { transform: "translate(0, 0)", opacity: "0" },
          "10%":  { opacity: "0.8" },
          "90%":  { opacity: "0.6" },
          "100%": { transform: "translate(20px, -40px)", opacity: "0" },
        },
        "mist-rising": {
          "0%":   { transform: "translateY(20px) scale(1)", opacity: "0" },
          "30%":  { opacity: "0.5" },
          "100%": { transform: "translateY(-40px) scale(1.15)", opacity: "0" },
        },
        "light-refracting": {
          "0%, 100%": { filter: "hue-rotate(0deg) brightness(1)" },
          "50%":      { filter: "hue-rotate(12deg) brightness(1.12)" },
        },
        "ice-thickening": {
          "0%":   { backdropFilter: "blur(20px)", opacity: "0.85" },
          "100%": { backdropFilter: "blur(36px)", opacity: "1" },
        },
        "crystallize": {
          "0%":   { transform: "scale(0.85) rotate(0deg)", opacity: "0.5" },
          "50%":  { transform: "scale(1.05) rotate(8deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "0.9" },
        },
        "ice-grows-outward": {
          "0%":   { transform: "scale(0.6)", opacity: "0" },
          "60%":  { opacity: "0.9" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "frozen-glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 24px oklch(0.93 0.11 200 / 20%), 0 0 48px oklch(0.62 0.19 258 / 12%)" },
          "50%":      { boxShadow: "0 0 36px oklch(0.93 0.11 200 / 36%), 0 0 72px oklch(0.62 0.19 258 / 22%)" },
        },
        "subtle-melting": {
          "0%, 100%": { transform: "translateY(0) scaleY(1)" },
          "50%":      { transform: "translateY(2px) scaleY(0.985)" },
        },
        "condensation-shift": {
          "0%, 100%": { transform: "translate(0, 0)", opacity: "0.7" },
          "50%":      { transform: "translate(2px, -1px)", opacity: "0.9" },
        },
        "snowfall": {
          "0%":   { transform: "translateY(-10px) translateX(0)", opacity: "0" },
          "10%":  { opacity: "0.7" },
          "100%": { transform: "translateY(100vh) translateX(20px)", opacity: "0" },
        },
        "aurora-glow": {
          "0%, 100%": { opacity: "0.4", transform: "translateX(-5%) scale(1)" },
          "50%":      { opacity: "0.7", transform: "translateX(5%) scale(1.08)" },
        },
        "ice-shatter": {
          "0%":   { transform: "scale(1)", opacity: "1", filter: "blur(0)" },
          "50%":  { transform: "scale(1.08)", opacity: "0.8", filter: "blur(1px)" },
          "100%": { transform: "scale(0.92)", opacity: "0", filter: "blur(3px)" },
        },
        "glint-sweep": {
          "0%":   { transform: "translateX(-150%) skewX(-20deg)", opacity: "0" },
          "20%":  { opacity: "0.15" },
          "50%":  { transform: "translateX(250%) skewX(-20deg)", opacity: "0.15" },
          "80%":  { opacity: "0.15" },
          "100%": { transform: "translateX(-150%) skewX(-20deg)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        /* ── Cryo animations ── */
        "frost-spreading":      "frost-spreading 1.2s cubic-bezier(0.16, 1, 0.3, 1) both",
        "particles-drifting":   "particles-drifting 8s linear infinite",
        "mist-rising":          "mist-rising 6s ease-out infinite",
        "light-refracting":     "light-refracting 7s ease-in-out infinite",
        "ice-thickening":       "ice-thickening 0.6s ease-out both",
        "crystallize":          "crystallize 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "ice-grows-outward":    "ice-grows-outward 1.4s ease-out infinite",
        "frozen-glow-pulse":    "frozen-glow-pulse 4s ease-in-out infinite",
        "subtle-melting":       "subtle-melting 5s ease-in-out infinite",
        "condensation-shift":   "condensation-shift 14s ease-in-out infinite",
        "snowfall":             "snowfall 12s linear infinite",
        "aurora-glow":          "aurora-glow 10s ease-in-out infinite",
        "ice-shatter":          "ice-shatter 0.5s ease-out both",
        "glint-sweep":          "glint-sweep 3s ease-in-out infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
