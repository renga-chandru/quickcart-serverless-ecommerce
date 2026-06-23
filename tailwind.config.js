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
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          dark: 'rgb(var(--color-secondary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-secondary-light) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light) / <alpha-value>)',
        },
        bgLight: '#F8FAFC',
        bgDark: 'rgb(var(--color-bg-dark) / <alpha-value>)',
        cardLight: '#FFFFFF',
        cardDark: 'rgb(var(--color-card-dark) / <alpha-value>)',
        slate: {
          50: 'rgb(var(--slate-50) / <alpha-value>)',
          100: 'rgb(var(--slate-100) / <alpha-value>)',
          200: 'rgb(var(--slate-200) / <alpha-value>)',
          300: 'rgb(var(--slate-300) / <alpha-value>)',
          400: 'rgb(var(--slate-400) / <alpha-value>)',
          450: 'rgb(var(--slate-450) / <alpha-value>)',
          455: 'rgb(var(--slate-455) / <alpha-value>)',
          500: 'rgb(var(--slate-500) / <alpha-value>)',
          550: 'rgb(var(--slate-550) / <alpha-value>)',
          600: 'rgb(var(--slate-600) / <alpha-value>)',
          650: 'rgb(var(--slate-650) / <alpha-value>)',
          655: 'rgb(var(--slate-655) / <alpha-value>)',
          700: 'rgb(var(--slate-700) / <alpha-value>)',
          755: 'rgb(var(--slate-755) / <alpha-value>)',
          800: 'rgb(var(--slate-800) / <alpha-value>)',
          805: 'rgb(var(--slate-805) / <alpha-value>)',
          850: 'rgb(var(--slate-850) / <alpha-value>)',
          900: 'rgb(var(--slate-900) / <alpha-value>)',
          950: 'rgb(var(--slate-950) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


