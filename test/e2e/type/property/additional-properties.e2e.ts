import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fastify from "fastify";
import { registerRoutes } from "./generated/type/property/additional-properties/router.js";
import { startServer } from "./helpers.js";
import { runScenario } from "./spector.js";

describe.skip("Type.Property.Additional-properties", () => {
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
    const { status } = await runScenario("type/property/additional-properties", baseUrl);
    expect(status).toBe("pass");
  });
});
