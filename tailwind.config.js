/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-dark': '#210203',     // Licorice (Background/Main Theme)
                'primary-light': '#DAD4EF',    // Lavender (Main Heading)
                'text-gray': '#D1D5DB',        // Soft Gray (Text)
                'detail-gray': '#9CA3AF',      // Light Gray (Details)
                'accent-blue': '#C44900',      // Accent Mahogany
                'accent-charcoal': '#464C5D',  // Accent Charcoal
                'accent-sunset': '#EEC584',    // Accent Sunset
                'neutral-white': '#FFFFFF',    // White (For Cards)
                'neutral-black': '#111827',    // Black (For Text)

            },
            fontFamily: {
                archivo: [ 'Archivo', 'sans-serif' ],
                inter: [ 'Inter', 'sans-serif' ],
                roboto: [ 'Roboto', 'sans-serif' ],
            },
            fontSize: {
                'h1': '4rem',       // 64px
                'h2': '3rem',       // 48px
                'h3': '2.25rem',    // 36px
                'body': '1rem',     // 16px
                'small': '0.875rem' // 14px
            },
            fontWeight: {
                regular: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                light: 300,
            },
        },
    },
    plugins: [],
}