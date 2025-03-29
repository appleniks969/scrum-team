/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Only apply dark mode with the 'dark' class
  theme: {
    extend: {
      colors: {
        // Define custom colors here
      },
      spacing: {
        // Define custom spacing here
      },
      fontFamily: {
        // Define custom fonts here
      },
      borderRadius: {
        // Define custom border radius here
      },
      boxShadow: {
        // Define custom shadows here
      },
    },
  },
  plugins: [
    // Add any plugins here
  ],
};
