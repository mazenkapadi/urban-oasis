/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#d5d5e0',
          DEFAULT: '#cdcede',
          dark: '#e6e6f1',
        },
        background: {
          light: '#f9f9f9',
          dark: '#ece3e3',
        },
        // Add more colors if needed
      },
    },
  },
  plugins: [],
}
