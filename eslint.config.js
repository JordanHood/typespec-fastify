// @ts-check
import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default tsEslint.config(
  {
    ignores: [
      "**/dist/**/*",
      "**/.temp/**/*",
      "**/tsp-output/**/*",
      "**/test/fixtures/tsp-output/**/*",
      "**/test/e2e/generated/**/*",
      "**/coverage/**/*",
      "**/examples/**/*",
      "**/temp/**/*",
      "**/eng/scripts/**/*",
    ],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
);
