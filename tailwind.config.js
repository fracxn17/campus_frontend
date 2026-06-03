/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./main.tsx"
  ],
  theme: {
    extend: {
      colors: {
        darkBg: 'var(--color-bg)',
        cardBg: 'var(--color-card)',
        borderPurple: 'var(--color-border)',
        lavenderPurple: '#804A8A',
        darkGrape: '#3A0353',
        lightSaffron: '#F8D299',
        warmSaffron: '#F59E51',
        primary: {
          50: 'var(--color-accent-light)',
          100: 'var(--color-accent-light)',
          200: 'var(--color-accent-hover)',
          300: 'var(--color-accent-hover)',
          400: 'var(--color-accent)',
          500: 'var(--color-accent)',
          600: 'var(--color-accent)',
          700: 'var(--color-accent-hover)',
          800: 'var(--color-accent-hover)',
          900: 'var(--color-accent-hover)',
        }
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
