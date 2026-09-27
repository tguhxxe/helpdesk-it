/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter Variable", "Inter", "Arial", "sans-serif"] },
      colors: { ink: "#181b23", accent: "#3455db" },
      boxShadow: { panel: "0 2px 8px rgba(24, 27, 35, 0.03)" },
    },
  },
  plugins: [],
};
