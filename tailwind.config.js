/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This tells Tailwind to scan all your React components
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#E923F4',
        'deep-purple': '#72076E',
        'midnight-blue': '#2B0245', // Perfect for our background
        'royal-blue': '#250096',
        'bright-blue': '#5600F4', // Great for buttons and highlights
      },
    },
  },
  plugins: [],
}
