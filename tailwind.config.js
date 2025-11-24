/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        isans: ["Instrument Sans", "sans-serif"],
      },
      colors: {
        // NSS Primary Theme - Based on gradient colors #0F2027, #203A43, #2C5364
        nss: {
          50: "#f7f8f9", // Very light blue-gray
          100: "#e8eef2", // Light blue-gray
          200: "#d1dce5", // Lighter blue-gray
          300: "#b3c4d1", // Light blue-gray
          400: "#8fa5b8", // Medium blue-gray
          500: "#2C5364", // Primary color (lightest of the three)
          600: "#203A43", // Middle color
          700: "#1a3139", // Darker variant
          800: "#0F2027", // Darkest of the three
          900: "#0c1a1f", // Very dark variant
          950: "#081318", // Ultra dark variant
        },
        // Blood / Donation palette centered on #c1121f
        blood: {
          50: "#fff5f5",
          100: "#ffe3e5",
          200: "#ffc6cc",
          300: "#ffa3aa",
          400: "#f8717a",
          500: "#e84751",
          600: "#c1121f", // Base requested color
          700: "#9a0e19",
          800: "#770b13",
          900: "#59080e",
          950: "#2f0407",
        },
        // Tree / Green initiative palette centered on #3a5a40
        tree: {
          50: "#f4f8f5", // very light mist green
          100: "#e4efe7", // light green wash
          200: "#c5decb", // pale desaturated green
          300: "#a2caaa", // soft green
          400: "#7daf86", // medium green
          500: "#5e9468", // balanced mid tone
          600: "#4a7553", // deeper supporting tone
          700: "#3a5a40", // base requested color
          800: "#2f4834", // dark accent
          900: "#253a2a", // deepest shade
          950: "#132016", // near-black green
        },
        primary: {
          50: "#f7f8f9",
          100: "#e8eef2",
          200: "#d1dce5",
          300: "#b3c4d1",
          400: "#8fa5b8",
          500: "#2C5364", // Main NSS primary color
          600: "#203A43",
          700: "#1a3139",
          800: "#0F2027",
          900: "#0c1a1f",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "nss-gradient":
          "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
        "nss-light-gradient":
          "linear-gradient(135deg, #f7f8f9 0%, #e8eef2 50%, #d1dce5 100%)",
        "tree-main-gradient":
          "linear-gradient(135deg, #2f4834 0%, #3a5a40 55%, #4a7553 100%)",
        "blood-main-gradient":
          "linear-gradient(135deg, #770b13 0%, #9a0e19 55%, #c1121f 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "fadeIn": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '10%': { opacity: '0.1' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
