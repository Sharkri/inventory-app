module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": ["error", { argsIgnorePattern: "^(err|req|res|next)$" }],
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
  },

  ignorePatterns: ["node_modules*/"],
};
