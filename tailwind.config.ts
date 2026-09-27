import type { Config } from "tailwindcss";

// Design tokens — see ARCHITECTURE.md section 7 for the reasoning behind
// this specific palette/type choice (deliberately not the default
// cream+terracotta or all-black+neon AI-generated look).
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213C",
        paper: "#F7F7F5",
        indigo: {
          DEFAULT: "#3454D1",
          hover: "#2A44AD",
        },
        amber: "#E8A33D",
        sage: "#5B8266",
        slate: {
          DEFAULT: "#A9AFBC",
          light: "#E4E6EA",
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
