/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#14161A",
          50: "#F7F8FA",
          100: "#EDEFF3",
          200: "#DBDFE6",
          300: "#B8C0CC",
          400: "#8991A0",
          500: "#5C6474",
          600: "#3F4553",
          700: "#2A2E38",
          800: "#1B1E25",
          900: "#14161A",
        },
        brand: {
          50: "#EEF0F8",
          100: "#D8DCEF",
          200: "#B1B9DF",
          300: "#8A97CF",
          400: "#5E6EB0",
          500: "#3A4585",
          600: "#2D3557",
          700: "#232A44",
          800: "#191E31",
          900: "#10131F",
        },
        amber: {
          50: "#FDF6EA",
          100: "#FAEBCB",
          200: "#F3D28E",
          300: "#EDBC5C",
          400: "#E8A33D",
          500: "#CC8724",
          600: "#A56B1C",
        },
        moss: {
          50: "#EBF6F0",
          100: "#CEEBDA",
          200: "#9CD6B5",
          300: "#63BC8B",
          400: "#2F9E68",
          500: "#237E52",
          600: "#1B6141",
        },
        clay: {
          50: "#FBEDE6",
          100: "#F3CFBC",
          200: "#E6A481",
          300: "#D67A4C",
          400: "#C9541D",
          500: "#A34317",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,22,26,0.04), 0 1px 12px rgba(20,22,26,0.04)",
        pop: "0 8px 24px rgba(20,22,26,0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
