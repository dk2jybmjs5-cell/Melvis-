import type { Config } from "tailwindcss";

// MELVIS tokens. Colours are CSS variables so dark mode swaps one set.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        sky: "rgb(var(--sky) / <alpha-value>)",
        lavender: "rgb(var(--lavender) / <alpha-value>)",
        tide: "rgb(var(--tide) / <alpha-value>)",
        alert: "rgb(var(--alert) / <alpha-value>)",
      },
      fontFamily: {
        display: ['"Literata"', "Georgia", "serif"],
        sans: ['"Atkinson Hyperlegible"', "system-ui", "sans-serif"],
      },
      borderRadius: { soft: "14px", pill: "999px" },
    },
  },
  plugins: [],
} satisfies Config;
