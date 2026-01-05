/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        border: 'var(--border-default)',
        brand: 'var(--accent-brand)',
      },
      fontFamily: {
        primary: ['Asimovian', 'Rubik', 'sans-serif'],
        secondary: ['Assistant', 'Rubik', 'sans-serif'],
        sans: ['Assistant', 'Rubik', 'sans-serif'], // Make secondary the default sans
      },
    },
  },
  plugins: [],
}
