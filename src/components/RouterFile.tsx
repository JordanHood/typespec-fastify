import { code, type Refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { fastifyLib } from "../external-packages/fastify.js";

export interface RouterFileProps {
  namespace: string;
  loadRoutesRef: Refkey;
}

/**
 * Generates the router.ts file which creates a router registration function.
 * Similar to http-server-js createPetStoreRouter pattern.
 */
export function RouterFile(props: RouterFileProps) {
  const functionName = `create${props.namespace}Router`;

  return (
    <ts.SourceFile path="router.ts">
      <ts.FunctionDeclaration
        name={functionName}
        export
        async
        parameters={[
          { name: "server", type: fastifyLib.FastifyInstance },
          { name: "operations", type: "any" }
        ]}
        returnType="void"
      >
        {code`await ${(
          <ts.FunctionCallExpression
            target={props.loadRoutesRef}
            args={[<>server</>, <>operations</>]}
          />
        )};`}
      </ts.FunctionDeclaration>
    </ts.SourceFile>
  );
}
