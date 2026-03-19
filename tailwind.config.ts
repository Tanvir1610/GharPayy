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
        gold: {
          300: "#F0C07A",
          400: "#E0A15A",
          500: "#C68642",
          600: "#A86C2E",
          700: "#8A521E",
        },
        brown: {
          900: "#0F0702",
          800: "#1A0D05",
          700: "#2A1408",
          600: "#3D1F0C",
          500: "#4E2A10",
          400: "#6B3A18",
        },
        stone: {
          50:  "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans:    ["'DM Sans'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0F0702 0%, #1A0D05 45%, #2A1408 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #C68642 0%, #E0A15A 100%)",
        "card-gradient":
          "linear-gradient(145deg, #1A0D05 0%, #2A1408 100%)",
      },
      boxShadow: {
        "gold-sm": "0 2px 8px rgba(198, 134, 66, 0.2)",
        "gold-md": "0 4px 20px rgba(198, 134, 66, 0.3)",
        "gold-lg": "0 8px 40px rgba(198, 134, 66, 0.4)",
        "dark-sm": "0 2px 8px rgba(0, 0, 0, 0.4)",
        "dark-md": "0 4px 20px rgba(0, 0, 0, 0.5)",
        "dark-lg": "0 8px 40px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease forwards",
        "fade-in":   "fadeIn 0.5s ease forwards",
        "shimmer":   "shimmer 2s linear infinite",
        "float":     "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
