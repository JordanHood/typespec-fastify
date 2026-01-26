// @ts-check
import neostandard from "neostandard";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
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
  ...neostandard({
    ts: true,
  }),
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "react/jsx-key": "off",
    },
  },
];
