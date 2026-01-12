#!/usr/bin/env node
import { writeFile, mkdir, readdir } from "fs/promises";
import { resolve, join, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { existsSync, readdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const generatedDir = resolve(projectRoot, "test/e2e/generated");
const testOutputDir = resolve(projectRoot, "test/e2e");

function findGeneratedScenarios(dir, basePath = "") {
  const scenarios = [];

  if (!existsSync(dir)) {
    return scenarios;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const scenarioPath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (existsSync(join(fullPath, "router.ts"))) {
        scenarios.push({ name: entry.name, path: scenarioPath });
      } else {
        scenarios.push(...findGeneratedScenarios(fullPath, scenarioPath));
      }
    }
  }

  return scenarios;
}

function generateTestFile(scenario) {
  const testName = scenario.path.replace(/\//g, "-");
  const className = scenario.path
    .split("/")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(".");

  const importPath = `./generated/${scenario.path}`;

  return `import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fastify from "fastify";
import { registerRoutes } from "${importPath}/router.js";
import { startServer } from "./helpers.js";
import { runScenario } from "./spector.js";

describe.skip("${className}", () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it("passes all scenarios", async () => {
    // TODO: Import operation interfaces and implement handlers
    // const operations = { ... };

    const app = fastify({ logger: false });
    // TODO: Register routes with operations
    // await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario("${scenario.path}", baseUrl);
    expect(status).toBe("pass");
  });
});
`;
}

async function main() {
  console.log("🔨 Generating E2E test stubs...\n");

  const scenarios = findGeneratedScenarios(generatedDir);

  console.log(`Found ${scenarios.length} compiled scenarios\n`);

  for (const scenario of scenarios) {
    const testFileDir = join(testOutputDir, dirname(scenario.path));
    const testFileName = `${basename(scenario.path)}.e2e.ts`;
    const testFilePath = join(testFileDir, testFileName);

    if (existsSync(testFilePath)) {
      console.log(`⏭️  Skipped (exists): ${scenario.path}`);
      continue;
    }

    await mkdir(testFileDir, { recursive: true });

    const testContent = generateTestFile(scenario);
    await writeFile(testFilePath, testContent, "utf8");
    console.log(`✅ ${scenario.path}`);
  }

  console.log(`\n✅ Generated ${scenarios.length} E2E test stubs`);
  console.log("Edit test files to implement operation handlers");
}

main();
