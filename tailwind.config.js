const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Raleway", ...defaultTheme.fontFamily.serif],
        primary: ["Raleway", "sans-serif"],
        secondary: ["Roboto", "sans-serif"],
      },
    },
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },
    plugins: [
      // rest of the code
      require("@tailwindcss/line-clamp"),
    ],
  },
};
