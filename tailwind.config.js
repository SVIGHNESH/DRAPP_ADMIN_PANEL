/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          900: 'var(--color-900)',
          800: 'var(--color-800)',
          700: 'var(--color-700)',
          600: 'var(--color-600)',
          500: 'var(--color-500)',
          400: 'var(--color-400)',
          300: 'var(--color-300)',
          200: 'var(--color-200)',
          100: 'var(--color-100)',
        },
        accent: {
          cyan: '#0077B6',
          teal: '#00B4D8',
          rose: '#E63946',
          amber: '#F4A261',
          violet: '#7B5EA7',
          pink: '#D62598',
          emerald: '#2D9E6B',
        }
      }
    },
  },
  plugins: [],
}