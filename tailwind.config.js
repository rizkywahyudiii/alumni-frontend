/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Inter jadi default pengganti sans standar
      },
      colors: {
        // Palet Hijau Success yang kita tentukan
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0', // Hijau muda (blob)
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Hijau utama (Emerald)
          600: '#059669', // Hover state
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
}