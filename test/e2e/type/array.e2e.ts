import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fastify from "fastify";
import { registerRoutes } from "../generated/type/array/router.js";
import { startServer } from "../helpers.js";
import { runScenario } from "../spector.js";
import type { Int32Value } from "../generated/type/array/operations/int32value.js";
import type { Int64Value } from "../generated/type/array/operations/int64value.js";
import type { BooleanValue } from "../generated/type/array/operations/booleanvalue.js";
import type { StringValue } from "../generated/type/array/operations/stringvalue.js";
import type { Float32Value } from "../generated/type/array/operations/float32value.js";
import type { DatetimeValue } from "../generated/type/array/operations/datetimevalue.js";
import type { DurationValue } from "../generated/type/array/operations/durationvalue.js";
import type { UnknownValue } from "../generated/type/array/operations/unknownvalue.js";
import type { ModelValue } from "../generated/type/array/operations/modelvalue.js";
import type { NullableFloatValue } from "../generated/type/array/operations/nullablefloatvalue.js";
import type { NullableBooleanValue } from "../generated/type/array/operations/nullablebooleanvalue.js";
import type { NullableInt32Value } from "../generated/type/array/operations/nullableint32value.js";
import type { NullableStringValue } from "../generated/type/array/operations/nullablestringvalue.js";
import type { NullableModelValue } from "../generated/type/array/operations/nullablemodelvalue.js";

describe("Type.Array", () => {
  let serverAbortController: AbortController;

  beforeEach(() => {
    serverAbortController = new AbortController();
  });

  afterEach(() => {
    serverAbortController.abort();
  });

  it("passes all scenarios", async () => {
    const int32ValueOps: Int32Value = {
      get: async function () {
        return [1, 2];
      },
      put: async function (body: Array<number>) {
        return;
      },
    };

    const int64ValueOps: Int64Value = {
      get: async function () {
        return [BigInt("9223372036854775807"), BigInt("-9223372036854775807")];
      },
      put: async function (body: Array<bigint>) {
        return;
      },
    };

    const booleanValueOps: BooleanValue = {
      get: async function () {
        return [true, false];
      },
      put: async function (body: Array<boolean>) {
        return;
      },
    };

    const stringValueOps: StringValue = {
      get: async function () {
        return ["hello", ""];
      },
      put: async function (body: Array<string>) {
        return;
      },
    };

    const float32ValueOps: Float32Value = {
      get: async function () {
        return [43.125];
      },
      put: async function (body: Array<number>) {
        return;
      },
    };

    const datetimeValueOps: DatetimeValue = {
      get: async function () {
        return [new Date("2022-08-26T18:38:00Z")];
      },
      put: async function (body: Array<Date>) {
        return;
      },
    };

    const durationValueOps: DurationValue = {
      get: async function () {
        return ["P123DT22H14M12.011S"];
      },
      put: async function (body: Array<string>) {
        return;
      },
    };

    const unknownValueOps: UnknownValue = {
      get: async function () {
        return [1, "hello", null];
      },
      put: async function (body: Array<unknown>) {
        return;
      },
    };

    const modelValueOps: ModelValue = {
      get: async function () {
        return [{ property: "hello" }, { property: "world" }];
      },
      put: async function (body) {
        return;
      },
    };

    const nullableFloatValueOps: NullableFloatValue = {
      get: async function () {
        return [1.25, null, 3.0];
      },
      put: async function (body) {
        return;
      },
    };

    const nullableBooleanValueOps: NullableBooleanValue = {
      get: async function () {
        return [true, null, false];
      },
      put: async function (body) {
        return;
      },
    };

    const nullableInt32ValueOps: NullableInt32Value = {
      get: async function () {
        return [1, null, 3];
      },
      put: async function (body) {
        return;
      },
    };

    const nullableStringValueOps: NullableStringValue = {
      get: async function () {
        return ["hello", null, "world"];
      },
      put: async function (body) {
        return;
      },
    };

    const nullableModelValueOps: NullableModelValue = {
      get: async function () {
        return [{ property: "hello" }, null, { property: "world" }];
      },
      put: async function (body) {
        return;
      },
    };

    const operations = {
      int32value: int32ValueOps,
      int64value: int64ValueOps,
      booleanvalue: booleanValueOps,
      stringvalue: stringValueOps,
      float32value: float32ValueOps,
      datetimevalue: datetimeValueOps,
      durationvalue: durationValueOps,
      unknownvalue: unknownValueOps,
      modelvalue: modelValueOps,
      nullablefloatvalue: nullableFloatValueOps,
      nullablebooleanvalue: nullableBooleanValueOps,
      nullableint32value: nullableInt32ValueOps,
      nullablestringvalue: nullableStringValueOps,
      nullablemodelvalue: nullableModelValueOps,
    };

    const app = fastify({ logger: false });
    await registerRoutes(app, operations);

    const baseUrl = await startServer(app, serverAbortController.signal);
    const { status } = await runScenario("type/array", baseUrl);
    expect(status).toBe("pass");
  });
});
