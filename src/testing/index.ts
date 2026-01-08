import {
  createTestLibrary,
  findTestPackageRoot,
  type TypeSpecTestLibrary,
} from "@typespec/compiler/testing";

export const TypespecFastifyTestLibrary: TypeSpecTestLibrary =
  createTestLibrary({
    name: "typespec-fastify",
    packageRoot: await findTestPackageRoot(import.meta.url),
  });
