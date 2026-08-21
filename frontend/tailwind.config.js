/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf0',
          100: '#fffae0',
          200: '#fff3b3',
          300: '#ffe680',
          400: '#ffd44d',
          500: '#f5b814',
          600: '#d9960b',
          700: '#b37207',
          800: '#8f560c',
          900: '#75450e',
          950: '#432304',
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fde6e6',
          200: '#fbd0d0',
          300: '#f7aaab',
          400: '#f07779',
          500: '#e3474a',
          600: '#cf2b2e',
          700: '#ab2023',
          800: '#8c1f21',
          900: '#751f21',
          950: '#400c0d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
