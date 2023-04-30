const formsPlugin = require("@tailwindcss/forms");
const plugin = require("tailwindcss/plugin");

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
    plugin(({ addVariant, addUtilities }) => {
      addUtilities({
        ".flex-center": {
          "justify-content": "center",
          "align-items": "center",
        },
      });

      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    }),
  ],
};
