/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: "var(--poppins-font), sans-serif",
      },
      gridTemplateColumns: {
        '4-auto-1fr': 'repeat(4, minmax(auto, 1fr))',
      },
    },
  },
  plugins: [],
};

module.exports = config;
