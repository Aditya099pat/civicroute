/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f1f2f4',
        surface: '#ffffff',
        borderSubtle: '#e2e4e8',
        borderMuted: '#d4d6db',
        brand: {
          bg: '#f1f2f4',
          card: '#ffffff',
          cardInner: '#f8fafc',
          border: '#e2e4e8',
          accent: '#4f46e5', // indigo-600
          accentHover: '#4338ca', // indigo-700
          textMuted: '#52525b',
          textSubtle: '#71717a'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
