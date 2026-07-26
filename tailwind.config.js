/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F1EA',
        paper: '#FBFAF6',
        ink: '#161512',
        smoke: '#6B675E',
        line: '#E4DFD3',
        lime: {
          DEFAULT: '#B6E82E',
          soft: '#EAF7C4',
          dark: '#8CC000',
        },
        plum: {
          DEFAULT: '#5B3FA8',
          soft: '#E9E3F7',
          dark: '#4A3190',
        },
        coral: {
          DEFAULT: '#FF6B4A',
          soft: '#FFE2D9',
        },
        teal: {
          DEFAULT: '#1F9E8F',
          soft: '#D2F0EC',
        },
        gold: {
          DEFAULT: '#F5B301',
          soft: '#FCEBBE',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        hard: '4px 4px 0 0 #161512',
        'hard-sm': '2px 2px 0 0 #161512',
        'hard-lg': '6px 6px 0 0 #161512',
        soft: '0 12px 40px -12px rgba(22,21,18,0.18)',
      },
      borderRadius: {
        xl2: '1.5rem',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};
