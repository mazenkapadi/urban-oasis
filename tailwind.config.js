/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-dark': '#0A0C0F',
                'primary-light': '#F9FAFB',
                'accent-orange': '#EE703C',
                'accent-red': '#EB2032',
                'accent-blue': '#0056FF',
                'accent-purple': '#8B5CF6',
                'Dark-D1': '#171717',
                'Dark-D2': '#171A1C',
                'Light-L1': '#E4E0DB',
                'Light-L2': '#F2F0EB',
                'Light-L3': '#EEEDE9',
            },
            fontFamily: {
                archivo: [ 'Archivo', 'sans-serif' ],
                inter: [ 'Inter', 'sans-serif' ],
                roboto: [ 'Roboto', 'sans-serif' ],
                lalezar: [ 'Lalezar', 'sans-serif' ],
            },
            fontSize: {
                h1: '4rem', // 64px (Use Lalezar in all-caps for H1)
                h2: '3rem', // 48px (Use Roboto Bold for buttons)
                h3: '2.25rem', // 36px
                h4: '1.5rem', // 24px
                body: '1rem', // 16px (Use Roboto Regular for body text)
                small: '0.875rem', // 14px
                button: '1.125rem', // 18px (Roboto Bold for emphasized buttons)
            },
            fontWeight: {
                thin: 100,
                light: 300,
                regular: 400,
                medium: 500,
                bold: 700,
                black: 900,
            },
        },
    },
    plugins: [],
};