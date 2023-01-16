const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Raleway', ...defaultTheme.fontFamily.serif],
      },
    },
    container: {
      center: true,
      padding: '1rem',
    },
    
   
  },
}