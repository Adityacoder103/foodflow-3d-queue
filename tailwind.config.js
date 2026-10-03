/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 20px 45px rgba(15, 23, 42, 0.28)',
      },
      colors: {
        night: '#071420',
        panel: '#101c2d',
        glint: '#8ae0ff',
      },
    },
  },
  plugins: [],
};
