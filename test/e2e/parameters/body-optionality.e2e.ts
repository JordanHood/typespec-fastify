import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fastify from "fastify";
import { registerRoutes } from "../generated/parameters/body-optionality/router.js";
import { startServer } from "../helpers.js";
import { runScenario } from "../spector.js";
import type { BodyOptionality } from "../generated/parameters/body-optionality/operations/bodyoptionality.js";
import type { OptionalExplicit } from "../generated/parameters/body-optionality/operations/optionalexplicit.js";

describe("Parameters.Body-optionality", () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it("passes all scenarios", async () => {
    const bodyOptionalityOps: BodyOptionality = {
      requiredExplicit: async function (body) {
        return;
      },
      requiredImplicit: async function (body) {
        return;
      },
    };

    const optionalExplicitOps: OptionalExplicit = {
      set: async function (body) {
        return;
      },
      omit: async function (body) {
        return;
      },
    };

    const operations = {
      bodyoptionality: bodyOptionalityOps,
      optionalexplicit: optionalExplicitOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario(
      "parameters/body-optionality",
      baseUrl,
    );
    expect(status).toBe("pass");
  });
});
