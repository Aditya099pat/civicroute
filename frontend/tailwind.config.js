/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080d1a',
          card: '#0f172a',
          cardInner: '#131e36',
          cardHover: '#162340',
          border: '#1e293b',
          borderLight: '#2a3a5c',
          accent: '#2563eb',
          accentHover: '#1d4ed8',
          textMuted: '#94a3b8',
          textSubtle: '#64748b'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
