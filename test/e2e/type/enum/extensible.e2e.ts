import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fastify from "fastify";
import { registerRoutes } from "./generated/type/enum/extensible/router.js";
import { startServer } from "./helpers.js";
import { runScenario } from "./spector.js";

describe.skip("Type.Enum.Extensible", () => {
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
    const { status } = await runScenario("type/enum/extensible", baseUrl);
    expect(status).toBe("pass");
  });
});
