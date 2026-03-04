/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        safari: {
          orange: '#E67E22',
          stone: '#F4F1EA',
          dark: '#1C1C1C',
        }
      }
    },
  },
  plugins: [],
}
