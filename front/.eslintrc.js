module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "@vue/prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "max-len": ["error", { code: 120, ignoreComments: true, ignoreUrls: true }],
    "arrow-parens": ["error", "always"],
    "vue/no-unused-components": "off",
    "vue/no-v-html": "off",
    "vue/padding-line-between-blocks": ["error", "always"],
    "vue/multi-word-component-names": "off",
    curly: ["error", "multi-line"],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      { blankLine: "always", prev: "directive", next: "*" },
      { blankLine: "any", prev: "directive", next: "directive" },
      { blankLine: "always", prev: "block-like", next: "*" },
      { blankLine: "always", prev: "*", next: "block-like" },
      { blankLine: "always", prev: "*", next: "return" },
    ],
    "prettier/prettier": [
      "warn",
      {
        printWidth: 100,
        tabWidth: 2,
      },
    ],
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
};
