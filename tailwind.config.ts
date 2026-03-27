import type { Config } from "tailwindcss";

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Jost", "Segoe UI", "sans-serif"],
        display: ["Jost", "Segoe UI", "sans-serif"],
      },
      screens: {
        nav: "900px",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease",
        slideUp: "slideUp 0.25s ease",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
