/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                surface: {
                    DEFAULT: '#ffffff',
                    dark: '#111827'
                },
                canvas: {
                    DEFAULT: '#f8fafc',
                    dark: '#0b1121'
                },
                panel: {
                    DEFAULT: '#ffffff',
                    dark: '#1f2937'
                }
            }
        },
    },
    plugins: [],
}