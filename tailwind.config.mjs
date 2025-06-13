const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./node_modules/@heroui/theme/dist/components/(button).js', './src/**/*.{js,jsx,ts,tsx}', './index.html'],
  plugins: [heroui()],
};
