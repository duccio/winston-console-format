module.exports = {
  parser: "@typescript-eslint/parser", // ESLint Parser
  extends: [
    "plugin:@typescript-eslint/recommended", // Recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  rules: {
    "prettier/prettier": [
      "warn",
      {
        semi: false, // Print semicolons at the ends of statements
        printWidth: 120 // Specify the line length that the printer will wrap on
      }
    ],
    semi: 0,
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
    "@typescript-eslint/no-parameter-properties": 0
  }
}
