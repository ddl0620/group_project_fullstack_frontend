// tailwind.config.js
const { heroui } = require("@heroui/react");
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};