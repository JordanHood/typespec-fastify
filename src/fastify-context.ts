import { createContext, type NamePolicy } from "@alloy-js/core";
import type { Program } from "@typespec/compiler";
import type { HttpService } from "@typespec/http";

export interface FastifyContext {
  program: Program;
  httpService: HttpService;
  namePolicy: NamePolicy;
}

export const FastifyContext = createContext<FastifyContext>();

export function createFastifyContext(
  program: Program,
  httpService: HttpService,
  namePolicy: NamePolicy,
): FastifyContext {
  return {
    program,
    httpService,
    namePolicy,
  };
}

export function useFastifyContext(): FastifyContext {
  return FastifyContext.use();
}
