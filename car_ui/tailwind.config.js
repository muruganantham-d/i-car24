/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"   // This fixes the warning
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}