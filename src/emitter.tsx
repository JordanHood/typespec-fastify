import { createNamePolicy, SourceDirectory } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import type { EmitContext, Diagnostic } from "@typespec/compiler";
import { NoTarget } from "@typespec/compiler";
import { Output, writeOutput } from "@typespec/emitter-framework";
import { getHttpService } from "@typespec/http";
import { FastifyContext } from "./fastify-context.js";
import { createFastifyContext } from "./fastify-context.js";
import { FastifyApp } from "./components/app.js";
import { FastifyServer } from "./components/server.js";
import { RouteHandlers } from "./components/route-handlers.js";
import { RouteLoader } from "./components/route-loader.js";
import { Schemas } from "./components/schemas.js";
import { Types } from "./components/types.js";
import { ErrorHandlers } from "./components/error-handlers.js";
import { OperationsInterface } from "./components/operations-interface.js";
import { reportDiagnostic } from "./lib.js";

export async function $onEmit(context: EmitContext) {
  const [httpService, diagnostics] = getHttpService(context.program, context.program);

  const diagnosticsAreError = diagnostics.some(function (d: Diagnostic) {
    return d.severity === "error";
  });

  if (diagnosticsAreError) {
    reportDiagnostic(context.program, {
      code: "http-emit-disabled",
      target: NoTarget,
      messageId: "default",
    });
    return;
  }

  const namePolicy = createNamePolicy(function (name) {
    return name;
  });

  const fastifyContext: FastifyContext = createFastifyContext(
    context.program,
    httpService,
    namePolicy,
  );

  await writeOutput(
    context.program,
    <Output namePolicy={namePolicy} program={context.program}>
      <FastifyContext.Provider value={fastifyContext}>
        <ts.SourceFile path="app.ts">
          <FastifyApp />
        </ts.SourceFile>

        <ts.SourceFile path="server.ts">
          <FastifyServer />
        </ts.SourceFile>

        <SourceDirectory path="types">
          <ts.SourceFile path="models.ts">
            <Types />
          </ts.SourceFile>
        </SourceDirectory>

        <SourceDirectory path="schemas">
          <ts.SourceFile path="errors.ts">
            <ErrorHandlers />
          </ts.SourceFile>
          <Schemas />
        </SourceDirectory>

        <SourceDirectory path="routes">
          <RouteHandlers />
          <ts.SourceFile path="loader.ts">
            <RouteLoader />
          </ts.SourceFile>
        </SourceDirectory>

        <SourceDirectory path="interfaces">
          <ts.SourceFile path="operations.ts">
            <OperationsInterface />
          </ts.SourceFile>
        </SourceDirectory>
      </FastifyContext.Provider>
    </Output>,
    context.emitterOutputDir,
  );
}
