/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-blue': '#E8F0FF',
        'pastel-blue': '#B3D9FF',
        'accent-blue': '#4F63DB',
        'light-gray': '#F8F9FA',
        'border-gray': '#E0E3E8',
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(135deg, #E8F0FF 0%, #B3D9FF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4F63DB 0%, #6B7FFF 100%)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}