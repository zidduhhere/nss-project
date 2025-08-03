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
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};
