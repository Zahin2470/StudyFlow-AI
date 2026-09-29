import type { Config } from "tailwindcss";

// Every color resolves from a CSS variable (defined in globals.css for
// :root and .dark) via the rgb(var(...) / <alpha-value>) pattern, so
// dark mode is a single class toggle on <html> that cascades through
// every component using these tokens — not a per-component dark: variant
// scattered across 80 files. See ARCHITECTURE.md §20.
const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: withOpacity("--color-ink"),
        paper: withOpacity("--color-paper"),
        surface: withOpacity("--color-surface"),
        indigo: {
          DEFAULT: withOpacity("--color-indigo"),
          hover: withOpacity("--color-indigo-hover"),
        },
        amber: withOpacity("--color-amber"),
        sage: withOpacity("--color-sage"),
        slate: {
          DEFAULT: withOpacity("--color-slate"),
          light: withOpacity("--color-slate-light"),
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      borderRadius: {
        card: "0.75rem",
      },
    },
  },
  plugins: [],
};
export default config;
