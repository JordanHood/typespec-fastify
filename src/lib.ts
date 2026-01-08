import { createTypeSpecLibrary, JSONSchemaType } from "@typespec/compiler";

export interface EmitterOptions {
  /**
   * If set to true, the emitter will not format the generated code using Prettier.
   */
  "no-format"?: boolean;
}

const EmitterOptionsSchema: JSONSchemaType<EmitterOptions> = {
  type: "object",
  additionalProperties: false,
  properties: {
    "no-format": {
      type: "boolean",
      nullable: true,
      default: false,
      description:
        "If set to true, the emitter will not format the generated code using Prettier.",
    },
  },
  required: [],
};

export const $lib = createTypeSpecLibrary({
  name: "typespec-emitter-fastify",
  diagnostics: {
    "http-emit-disabled": {
      severity: "error",
      messages: {
        default: "Cannot emit Fastify server due to errors in HTTP service definition.",
      },
    },
    "no-services-in-program": {
      severity: "error",
      messages: {
        default: "No services found in the program. Use @service decorator to define a service.",
      },
    },
  },
  emitter: {
    options: EmitterOptionsSchema,
  },
});

export const { reportDiagnostic, createDiagnostic } = $lib;
