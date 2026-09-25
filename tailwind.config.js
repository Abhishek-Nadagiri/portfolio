/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          dark: '#0B0B0D',
          'dark-2': '#111114',
          'dark-3': '#18181C',
          'dark-4': '#1F1F25',
          'dark-5': '#27272E',
          light: '#FAF9F6',
          'light-2': '#F2EFEA',
          'light-3': '#E8E4DD',
          'light-4': '#DEDAD2',
        },
        chrome: {
          50: '#F5F5F8',
          100: '#E0E0EA',
          200: '#C8C8D4',
          300: '#A0A0AE',
          400: '#7A7A88',
          500: '#5A5A66',
          600: '#3A3A44',
          700: '#2A2A32',
          800: '#1E1E24',
          900: '#14141A',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8D190',
          bright: '#FFD700',
          dark: '#8B6914',
          muted: '#A08B44',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'dock-bounce': 'dockBounce 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        dockBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backgroundSize: {
        '400': '400% 100%',
      },
    },
  },
  plugins: [],
}
