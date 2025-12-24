/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37', // Champagne Gold
          hover: '#FFD700',   // Bright Gold
        },
        accent: '#CD7F32', // Bronze
        gold: {
          champagne: '#D4AF37',
          bright: '#FFD700',
          antique: '#957C3D',
        },
        background: {
          light: '#F5F7FA',
          dark: '#0A0A0A', // Deep Black
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1B1B1B', // Rich Charcoal
          elevated: '#2C2C2C', // Charcoal Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}