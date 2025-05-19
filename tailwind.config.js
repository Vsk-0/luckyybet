/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#202329",
        foreground: "#ffffff",
        border: "#3f3f46",
        primary: {
          DEFAULT: "#ffd700",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#2a2d35",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1a1d24",
          foreground: "#a1a1aa",
        },
      },
    },
  },
  plugins: [],
}
