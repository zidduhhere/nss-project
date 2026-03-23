/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        isans: ["Instrument Sans", "sans-serif"],
      },
      colors: {
        // shadcn CSS variable colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // Keep existing primary scale
          50: "#f7f8f9",
          100: "#e8eef2",
          200: "#d1dce5",
          300: "#b3c4d1",
          400: "#8fa5b8",
          500: "#2C5364",
          600: "#203A43",
          700: "#1a3139",
          800: "#0F2027",
          900: "#0c1a1f",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // NSS Primary Theme
        nss: {
          50: "#f7f8f9",
          100: "#e8eef2",
          200: "#d1dce5",
          300: "#b3c4d1",
          400: "#8fa5b8",
          500: "#2C5364",
          600: "#203A43",
          700: "#1a3139",
          800: "#0F2027",
          900: "#0c1a1f",
          950: "#081318",
        },
        // Blood / Donation palette
        blood: {
          50: "#fff5f5",
          100: "#ffe3e5",
          200: "#ffc6cc",
          300: "#ffa3aa",
          400: "#f8717a",
          500: "#e84751",
          600: "#c1121f",
          700: "#9a0e19",
          800: "#770b13",
          900: "#59080e",
          950: "#2f0407",
        },
        // Tree / Green initiative palette
        tree: {
          50: "#f4f8f5",
          100: "#e4efe7",
          200: "#c5decb",
          300: "#a2caaa",
          400: "#7daf86",
          500: "#5e9468",
          600: "#4a7553",
          700: "#3a5a40",
          800: "#2f4834",
          900: "#253a2a",
          950: "#132016",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '10%': { opacity: '0.1' },
          '100%': { opacity: '1' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
