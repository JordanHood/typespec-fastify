import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 10000,
    isolate: false,
    include: [
      "test/e2e/parameters/basic.e2e.ts",
      "test/e2e/parameters/path.e2e.ts",
      "test/e2e/parameters/query.e2e.ts",
      "test/e2e/parameters/body-optionality.e2e.ts",
    ],
  },
});
