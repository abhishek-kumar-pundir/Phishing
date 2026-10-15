/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070C",
          900: "#0A0F1C",
          850: "#0D1322",
          800: "#111827",
          700: "#1C2333",
          600: "#2A3348",
        },
        mist: {
          900: "#1B212B",
          800: "#2A3140",
          700: "#3B4456",
          600: "#4E596D",
          500: "#718096",
          400: "#8592A6",
          300: "#9AA6BA",
          200: "#BCC5D3",
          100: "#E6EAF2",
          50: "#F5F7FB",
        },
        signal: {
          scan: "#5B8DEF",
          scanSoft: "#7FA6F5",
          safe: "#2BB673",
          safeSoft: "#4FD196",
          danger: "#E2661C",
          dangerSoft: "#F08A4B",
          warn: "#E0B84B",
          idle: "#3A4459",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 20px 60px -20px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(91,141,239,0.25), 0 0 40px -8px rgba(91,141,239,0.35)",
        glowSafe: "0 0 0 1px rgba(43,182,115,0.25), 0 0 40px -8px rgba(43,182,115,0.35)",
        glowDanger: "0 0 0 1px rgba(226,102,28,0.25), 0 0 40px -8px rgba(226,102,28,0.35)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
        drift: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "120% 40%" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out both",
        pulseGlow: "pulseGlow 1.8s ease-in-out infinite",
        dash: "dash 0.9s ease-out forwards",
        drift: "drift 14s linear infinite",
      },
    },
  },
  plugins: [],
};
