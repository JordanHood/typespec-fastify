import { createTypeSpecLibrary, JSONSchemaType } from "@typespec/compiler";

export type EmitterOptions = Record<string, never>;

const EmitterOptionsSchema: JSONSchemaType<EmitterOptions> = {
  type: "object",
  additionalProperties: false,
  properties: {},
  required: [],
};

export const $lib = createTypeSpecLibrary({
  name: "typespec-emitter-fastify",
  diagnostics: {
    "http-emit-disabled": {
      severity: "error",
      messages: {
        default:
          "Cannot emit Fastify server due to errors in HTTP service definition.",
      },
    },
    "no-services-in-program": {
      severity: "error",
      messages: {
        default:
          "No services found in the program. Use @service decorator to define a service.",
      },
    },
  },
  emitter: {
    options: EmitterOptionsSchema,
  },
});

export const { reportDiagnostic, createDiagnostic } = $lib;
