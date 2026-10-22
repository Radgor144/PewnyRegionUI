export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                bg: 'var(--color-bg)',
                surface: 'var(--color-panel)',
                canvas: 'var(--color-panel)',
                'canvas-dark': 'var(--color-panel-alt)',
                panel: 'var(--color-panel)',
                'panel-dark': 'var(--color-panel-alt)',
                border: 'var(--color-border)',
                text: 'var(--color-text)',
                'text-muted': 'var(--color-text-muted)',
                dot: 'var(--color-dot)',
                grid: 'var(--color-chart-grid)',
                axis: 'var(--color-chart-axis)',
                'chart-text': 'var(--color-chart-text)',
                'line-average': 'var(--color-chart-average)',
                'tooltip-bg': 'var(--color-tooltip-bg)',
                'tooltip-text': 'var(--color-tooltip-text)',
            },
        },
    },
    plugins: [],
};
