const formsPlugin = require("@tailwindcss/forms");

module.exports = {
  content: ["./views/**/*.pug"],
  theme: {
    extend: {},
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
    formsPlugin,
  ],
};
