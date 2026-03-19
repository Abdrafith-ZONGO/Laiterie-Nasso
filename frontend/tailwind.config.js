/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm':  '640px',
        'md':  '768px',
        'lg':  '1024px',
        'xl':  '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      // ── Plus aucune couleur custom ici ──
      // Header  → couleurs dans const C de Header.jsx
      // Footer  → couleurs dans const C de Footer.jsx
      // Le reste du site → voir ci-dessous si besoin
    },
  },
  plugins: [],
};