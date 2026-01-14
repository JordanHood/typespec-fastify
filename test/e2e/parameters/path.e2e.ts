import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fastify from "fastify";
import { registerRoutes } from "../generated/parameters/path/router.js";
import { startServer } from "../helpers.js";
import { runScenario } from "../spector.js";
import type { Path } from "../generated/parameters/path/operations/path.js";

describe("Parameters.Path", () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it("passes all scenarios", async () => {
    const pathOps: Path = {
      normal: async function (name) {
        return;
      },
      optional: async function (name) {
        return;
      },
    };

    const operations = {
      path: pathOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario("parameters/path", baseUrl);
    expect(status).toBe("pass");
  });
});
