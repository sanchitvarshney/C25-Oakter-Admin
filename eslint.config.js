import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/react-in-jsx-scope": "off",
      "no-undef": "off",
      "react/display-name": "off",
      "react/jsx-filename-extension": "off",
      "no-param-reassign": "off",
      "react/prop-types": "off",
      "react/require-default-props": "off",
      "react/no-array-index-key": "off",
      "react/jsx-props-no-spreading": "off",
      "react/forbid-prop-types": "off",
      "import/order": "off",
      "import/no-cycle": "off",
      "no-console": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "prefer-destructuring": "off",
      "no-shadow": "off",
      "import/no-named-as-default": "off",
      "import/no-extraneous-dependencies": "off",
      "jsx-a11y/no-autofocus": "off",
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
);
