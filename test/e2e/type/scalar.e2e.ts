import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fastify from "fastify";
import { registerRoutes } from "../generated/type/scalar/router.js";
import { startServer } from "../helpers.js";
import { runScenario } from "../spector.js";
import type { String } from "../generated/type/scalar/operations/string.js";
import type { Boolean } from "../generated/type/scalar/operations/boolean.js";
import type { Unknown } from "../generated/type/scalar/operations/unknown.js";
import type { DecimalType } from "../generated/type/scalar/operations/decimaltype.js";
import type { Decimal128Type } from "../generated/type/scalar/operations/decimal128type.js";
import type { DecimalVerify } from "../generated/type/scalar/operations/decimalverify.js";
import type { Decimal128Verify } from "../generated/type/scalar/operations/decimal128verify.js";

describe("Type.Scalar", () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it("passes all scenarios", async () => {
    const stringOps: String = {
      get: async function () {
        return {
          contentType: "application/json",
          body: "test",
        };
      },
      put: async function (body: string, contentType: "application/json") {
        return;
      },
    };

    const booleanOps: Boolean = {
      get: async function () {
        return {
          contentType: "application/json",
          body: true,
        };
      },
      put: async function (body: boolean, contentType: "application/json") {
        return;
      },
    };

    const unknownOps: Unknown = {
      get: async function () {
        return {
          contentType: "application/json",
          body: "test",
        };
      },
      put: async function (body: unknown, contentType: "application/json") {
        return;
      },
    };

    const decimalTypeOps: DecimalType = {
      responseBody: async function () {
        return {
          contentType: "application/json",
          body: 0.33333,
        };
      },
      requestBody: async function (
        body: number,
        contentType: "application/json",
      ) {
        return;
      },
      requestParameter: async function (options?: { value: number }) {
        return;
      },
    };

    const decimal128TypeOps: Decimal128Type = {
      responseBody: async function () {
        return {
          contentType: "application/json",
          body: 0.33333,
        };
      },
      requestBody: async function (
        body: number,
        contentType: "application/json",
      ) {
        return;
      },
      requestParameter: async function (options?: { value: number }) {
        return;
      },
    };

    const decimalVerifyOps: DecimalVerify = {
      prepareVerify: async function () {
        return [0.1, 0.1, 0.1];
      },
      verify: async function (body: number, contentType: "application/json") {
        return;
      },
    };

    const decimal128VerifyOps: Decimal128Verify = {
      prepareVerify: async function () {
        return [0.1, 0.1, 0.1];
      },
      verify: async function (body: number, contentType: "application/json") {
        return;
      },
    };

    const operations = {
      string: stringOps,
      boolean: booleanOps,
      unknown: unknownOps,
      decimaltype: decimalTypeOps,
      decimal128type: decimal128TypeOps,
      decimalverify: decimalVerifyOps,
      decimal128verify: decimal128VerifyOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario("type/scalar", baseUrl);
    expect(status).toBe("pass");
  });
});
