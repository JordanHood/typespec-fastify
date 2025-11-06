import { resolvePath } from "@typespec/compiler";
import { createTestLibrary, TypeSpecTestLibrary } from "@typespec/compiler/testing";
import { fileURLToPath } from "url";

export const TypespecEmitterFastifyTestLibrary: TypeSpecTestLibrary = createTestLibrary({
  name: "typespec-emitter-fastify",
  packageRoot: resolvePath(fileURLToPath(import.meta.url), "../../../../"),
});
