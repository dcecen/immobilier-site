/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './admin.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f4f7fb', 100: '#e6ecf3', 200: '#cdd7e4',
          300: '#a8b9ce', 400: '#7d96b4', 500: '#5d7a9e',
          600: '#3f5e89', 700: '#2c4a73', 800: '#1f3a5f',
          900: '#142b52', 950: '#0e1f3a',
        },
        sand: {
          50:  '#fdf5ed', 100: '#fae6d2', 200: '#f4cba5',
          300: '#ecaa6f', 400: '#e08e44', 500: '#d87a2e',
          600: '#b46220', 700: '#8d4c1c', 800: '#6d3c19', 900: '#553014',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.10)',
        card: '0 1px 0 rgba(15,23,42,0.04), 0 12px 32px -12px rgba(15,23,42,0.18)',
      },
    },
  },
  plugins: [],
}
