/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#176448', pressed: '#12523B' },
        ink: '#1D2420',
        muted: '#66716B',
        subtle: '#F8F9F8',
        divider: '#E5E9E6',
        input: '#7A867E',
        error: '#A12B2B',
      },
    },
  },
  plugins: [],
};
