/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-dark': '#11151A',     // Black (Background/Dark Theme)
                'primary-light': '#F9FAFB',    // Off-white (Background/Light Theme)

                'text-gray': '#F4EDE4',        // Soft Beige (Text)
                'detail-gray': '#F9E3CC',      // Light Peach/Beige (Details)
                'accent-orange': '#FF8C42',    // Vibrant Orange (Accent)
                'accent-yellow': '#FFD166',    // Soft Yellow-Orange (Accent)

                'neutral-white': '#FFFAF0',    // Warm White (For Cards)
                'neutral-black': '#262626',    // Soft Black (For Text)
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