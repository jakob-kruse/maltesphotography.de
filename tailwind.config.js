const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        opacityHighlight: 'opacityHighlight 2s ease-in-out forwards',
      },
      keyframes: {
        opacityHighlight: {
          '0%': { opacity: 0.5 },
          '100%': { opacity: 0.05 },
        },
      },
    },
  },
  darkMode: 'class',
  daisyui: {
    themes: ['light', 'halloween'],
    darkTheme: 'halloween',
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
