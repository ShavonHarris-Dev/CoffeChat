/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          bean: '#3C2415',
          dark: '#5D4037',
          medium: '#8D6E63',
          light: '#BCAAA4',
          cream: '#F5F5DC',
          latte: '#D7CCC8',
          espresso: '#4E342E',
          mocha: '#6F4E37',
          caramel: '#D2691E',
          vanilla: '#F3E5AB'
        },
        primary: '#8D6E63',
        secondary: '#D2691E',
        accent: '#6F4E37',
        success: '#A5D6A7',
        warning: '#FFB74D',
        error: '#E57373',
        background: '#FFF8E1',
        surface: '#FFFFFF',
        'surface-warm': '#FAF0E6',
        text: {
          primary: '#3C2415',
          secondary: '#5D4037',
          light: '#8D6E63'
        }
      }
    },
  },
  plugins: [],
}
