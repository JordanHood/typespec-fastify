import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fastify from "fastify";
import { registerRoutes } from "../generated/parameters/spread/router.js";
import { startServer } from "../helpers.js";
import { runScenario } from "../spector.js";
import type { Alias } from "../generated/parameters/spread/operations/alias.js";
import type { Model } from "../generated/parameters/spread/operations/model.js";

describe("Parameters.Spread", () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it("passes all scenarios", async () => {
    const aliasOps: Alias = {
      spreadAsRequestBody: async function (body) {
        return;
      },
      spreadParameterWithInnerModel: async function (id: any, body: any, xMsTestHeader: any) {
        return;
      },
      spreadAsRequestParameter: async function (id: any, body: any, xMsTestHeader: any) {
        return;
      },
      spreadWithMultipleParameters: async function (id: any, body: any, xMsTestHeader: any) {
        return;
      },
      spreadParameterWithInnerAlias: async function (id: any, body: any, xMsTestHeader: any) {
        return;
      },
    };

    const modelOps: Model = {
      spreadAsRequestBody: async function (body) {
        return;
      },
      spreadCompositeRequestOnlyWithBody: async function (body: any) {
        return;
      },
      spreadCompositeRequestWithoutBody: async function (name: any, testHeader: any) {
        return;
      },
      spreadCompositeRequest: async function (name: any, body: any, testHeader: any) {
        return;
      },
      spreadCompositeRequestMix: async function (name: any, body: any, testHeader: any) {
        return;
      },
    };

    const operations = {
      alias: aliasOps,
      model: modelOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario("parameters/spread", baseUrl);
    expect(status).toBe("pass");
  });
});
