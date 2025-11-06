import { createTypeSpecLibrary } from "@typespec/compiler";

export const $lib = createTypeSpecLibrary({
  name: "typespec-emitter-fastify",
  diagnostics: {
    "http-emit-disabled": {
      severity: "error",
      messages: {
        default: "Cannot emit Fastify server due to errors in HTTP service definition.",
      },
    },
  },
});

export const { reportDiagnostic, createDiagnostic } = $lib;
