/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C1917',
        paper: '#FAFAF9',
        plum: {
          50: '#F3F2F7',
          100: '#E4E2EE',
          400: '#5A5580',
          600: '#3C3860',
          700: '#2C2A4A',
          900: '#1B1933',
        },
        amber: {
          400: '#F5A524',
          500: '#E8940F',
          600: '#C77B08',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F0EFED',
          200: '#E1DFDB',
          400: '#8A8580',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        tag: '2px 10px 2px 10px',
      },
    },
  },
  plugins: [],
};
