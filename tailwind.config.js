const formsPlugin = require("@tailwindcss/forms");

module.exports = {
  darkMode: "class",
  content: ["./views/**/*.pug"],
  theme: {
    extend: {
      colors: {
        light: "#fafafa",
        dark: "#262626",
        "dark-secondary": "#3f3f46",
      },
    },
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
    formsPlugin,
  ],
};
