/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hospital: {
          lightBg: '#f8fafc',
          darkBg: '#0f172a',
          cardLight: '#ffffff',
          cardDark: '#1e293b',
          brandBlue: '#0284c7', // light blue
          darkBlue: '#1e3a8a',  // dark blue
          cyan: '#06b6d4',      // cyan
          emerald: '#10b981',   // emerald green
          red: '#ef4444',       // soft red
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
