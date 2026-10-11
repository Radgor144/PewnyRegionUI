import { colors } from './src/lib/colors';

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
                surface: colors.surface,
                canvas: colors.canvas,
                panel: colors.panel
            }
        },
    },
    plugins: [],
}