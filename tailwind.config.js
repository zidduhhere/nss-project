/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // NSS Blue Theme
        nss: {
          50: "#eff6ff", // Very light blue
          100: "#dbeafe", // Light blue
          200: "#bfdbfe", // Lighter blue
          300: "#93c5fd", // Light blue
          400: "#60a5fa", // Medium light blue
          500: "#3b82f6", // Primary blue (NSS blue)
          600: "#2563eb", // Darker blue
          700: "#1d4ed8", // Dark blue
          800: "#1e40af", // Very dark blue
          900: "#1e3a8a", // Darkest blue
          950: "#172554", // Ultra dark blue
        },
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Main NSS blue
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
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
          "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)",
        "nss-light-gradient":
          "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      fontFamily: {
        clash: ["ClashDisplay", "sans-serif"],
      },
    },
  },
  plugins: [],
};
