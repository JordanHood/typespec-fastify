import { For, List, refkey, SourceDirectory, type Refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import type { HttpOperation } from "@typespec/http";
import { RouteRegistration, getRouteRegistrationRef } from "./RouteRegistration.js";
import { fastifyLib } from "../external-packages/fastify.js";

export interface RoutesDirectoryProps {
  groupedOperations: Map<string, HttpOperation[]>;
  loadRoutesRef: Refkey;
}

/**
 * Generates the routes directory with individual route files and an index loader.
 */
export function RoutesDirectory(props: RoutesDirectoryProps) {
  const { groupedOperations, loadRoutesRef } = props;

  return (
    <SourceDirectory path="routes">
      {/* Individual route files per container */}
      <For each={Array.from(groupedOperations.entries())}>
        {function renderRoutes([containerName, operations]) {
          return (
            <ts.SourceFile path={`${containerName.toLowerCase()}.routes.ts`}>
              <RouteRegistration
                containerName={containerName}
                operations={operations}
              />
            </ts.SourceFile>
          );
        }}
      </For>

      {/* Routes loader/index file */}
      <ts.SourceFile path="index.ts">
        <ts.FunctionDeclaration
          name="loadRoutes"
          export
          refkey={loadRoutesRef}
          async
          parameters={[
            { name: "server", type: fastifyLib.FastifyInstance },
            { name: "operations", type: "any" }
          ]}
          returnType="void"
        >
          <List>
            <For each={Array.from(groupedOperations.keys())}>
              {function renderRegistration(containerName) {
                const routeRegRef = getRouteRegistrationRef(containerName);
                return (
                  <>
                    <ts.FunctionCallExpression
                      target={routeRegRef}
                      args={[<>server</>, <>operations</>]}
                    />
                    {";"}
                  </>
                );
              }}
            </For>
          </List>
        </ts.FunctionDeclaration>
      </ts.SourceFile>
    </SourceDirectory>
  );
}
