/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linkedin: {
          blue: '#0a66c2',
          'blue-dark': '#004182',
          'blue-light': '#378fe9',
          white: '#ffffff',
          'gray-light': '#f3f2ef',
          'gray-medium': '#666666',
          'gray-dark': '#000000',
          green: '#057642',
          'green-light': '#70b5f9',
          orange: '#dd5143'
        },
        primary: '#0a66c2',
        secondary: '#378fe9',
        success: '#057642',
        warning: '#dd5143',
        background: '#f3f2ef',
        surface: '#ffffff',
        text: {
          primary: '#000000',
          secondary: '#666666'
        }
      }
    },
  },
  plugins: [],
}
