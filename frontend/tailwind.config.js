/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Flat near-black neutral surfaces
        surface: {
          canvas: "#090A0C",    // Background
          subtle: "#0E1014",    // Faint inset / wells
          card: "#121419",      // Primary card surface
          raised: "#181B22",    // Raised popovers / hover
          border: "#20242D",    // 1px hairline border
          borderLight: "#2A303C",
        },
        // ONE accent color across the interface
        brand: {
          DEFAULT: "#38C0E4",
          soft: "#38C0E41A",    // 10% opacity
          muted: "#38C0E433",   // 20% opacity
          hover: "#4ED0F2",
        },
        // Verdict states ONLY - green/red/amber appear strictly for verdicts & review states
        verdict: {
          legit: "#22C55E",
          legitSoft: "#22C55E1A",
          phish: "#EF4444",
          phishSoft: "#EF44441A",
          review: "#F59E0B",
          reviewSoft: "#F59E0B1A",
          neutral: "#4B5563",
        },
        // Neutral typography scales
        mist: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["'Geist Sans'", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["'Geist Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        reveal: "reveal 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
