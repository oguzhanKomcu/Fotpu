/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Stitch Brand Colors
        primary: {
          DEFAULT: "#7e47eb", // AI / Brand Violet
          coral: "#ff6e61",   // Splash & Accent Coral
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a77df1",
          500: "#7e47eb",
          600: "#6d28d9",
          700: "#5b21b6",
        },
        // Backgrounds (Light & Dark)
        background: {
          light: "#FCFCFC",
          lightAlt: "#f8f6f5",
          dark: "#161121",
          darkAlt: "#1a191d",
          darkDeep: "#23100f",
        },
        // Pastels for Outfits, Gradient & Cards
        pastel: {
          cream: "#FFFDD0",
          peach: "#FFDAB9",
          lavender: "#E6E6FA",
          pink: "#FADADD",
          mint: "#CFFDE1",
          sky: "#DDF3FF",
        },
        // Text & Content
        content: {
          dark: "#131118",
          charcoal: "#333333",
          muted: "#6f6388",
          subtle: "#888888",
          light: "#e3e3e3",
          white: "#FFFFFF",
        },
        // Rating & Accent Stars
        rating: {
          star: "#FBBF24",
          gold: "#EAB308",
          heart: "#EF4444",
        }
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px"
      }
    },
  },
  plugins: [],
};
