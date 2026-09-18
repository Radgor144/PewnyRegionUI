/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
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