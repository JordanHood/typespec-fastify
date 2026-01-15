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
      "**/test/e2e/payload/**/*",
      "**/test/e2e/type/**/*",
      "**/test/e2e/parameters/collection-format.e2e.ts",
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
