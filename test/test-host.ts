// import { Diagnostic, resolvePath } from "@typespec/compiler";
// import {
//   createTestHost,
//   createTestWrapper,
//   expectDiagnosticEmpty,
// } from "@typespec/compiler/testing";
// import { TypespecEmitterFastifyTestLibrary } from "../src/testing/index.js";

// export async function createTypespecEmitterFastifyTestHost() {
//   return createTestHost({
//     libraries: [TypespecEmitterFastifyTestLibrary],
//   });
// }

// export async function createTypespecEmitterFastifyTestRunner() {
//   const host = await createTypespecEmitterFastifyTestHost();

//   return createTestWrapper(host, {
//     compilerOptions: {
//       noEmit: false,
//       emit: ["typespec-emitter-fastify"],
//     },
//   });
// }

// export async function emitWithDiagnostics(
//   code: string
// ): Promise<[Record<string, string>, readonly Diagnostic[]]> {
//   const runner = await createTypespecEmitterFastifyTestRunner();
//   await runner.compileAndDiagnose(code, {
//     outputDir: "tsp-output",
//   });
//   const emitterOutputDir = "./tsp-output/typespec-emitter-fastify";
//   const files = await runner.program.host.readDir(emitterOutputDir);

//   const result: Record<string, string> = {};
//   for (const file of files) {
//     result[file] = (await runner.program.host.readFile(resolvePath(emitterOutputDir, file))).text;
//   }
//   return [result, runner.program.diagnostics];
// }

// export async function emit(code: string): Promise<Record<string, string>> {
//   const [result, diagnostics] = await emitWithDiagnostics(code);
//   expectDiagnosticEmpty(diagnostics);
//   return result;
// }
