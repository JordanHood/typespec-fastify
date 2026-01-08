import { For, List, refkey, type Refkey, type Children } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import type { HttpOperation } from "@typespec/http";
import {
  toCamelCase,
  toPascalCase,
  getHttpVerb,
} from "../utils/http-helpers.js";
import { fastifyLib } from "../external-packages/fastify.js";
import { getOperationInterfaceRef } from "./OperationInterface.js";

export interface RouteRegistrationProps {
  containerName: string;
  operations: HttpOperation[];
}

/**
 * Creates a refkey for a route registration function.
 * This allows the loadRoutes function to reference it with automatic imports.
 */
export function getRouteRegistrationRef(containerName: string): Refkey {
  return refkey(containerName, "route-registration");
}

/**
 * Generates Fastify route registration functions.
 * This creates a function that registers all routes for a resource.
 */
export function RouteRegistration(props: RouteRegistrationProps) {
  const { containerName, operations } = props;
  const functionName = `register${toPascalCase(containerName)}Routes`;
  const interfaceRef = getOperationInterfaceRef(containerName);
  const routeRegRef = getRouteRegistrationRef(containerName);

  return (
    <ts.FunctionDeclaration
      name={functionName}
      export
      refkey={routeRegRef}
      async
      parameters={[
        { name: "fastify", type: fastifyLib.FastifyInstance },
        { name: "operations", type: interfaceRef },
      ]}
      returnType="void"
    >
      <List>
        <For each={operations} hardline>
          {function renderRoute(operation) {
            const verb = getHttpVerb(operation);
            const path = operation.path;
            const opName = toCamelCase(operation.operation.name);

            return (
              <>
                <ts.FunctionCallExpression
                  target={<>fastify.{verb}</>}
                  args={[
                    <>'{path}'</>,
                    generateRouteHandler(operation, opName),
                  ]}
                />
                {";"}
              </>
            );
          }}
        </For>
      </List>
    </ts.FunctionDeclaration>
  );
}

function generateRouteHandler(operation: HttpOperation, opName: string) {
  const callArgs: Children[] = [];

  for (const param of operation.parameters.parameters) {
    if (param.type === "path") {
      const paramName = toCamelCase(param.param.name);
      callArgs.push(<>(request.params as any).{paramName}</>);
    }
  }

  if (operation.parameters.body) {
    callArgs.push(<>request.body as any</>);
  }

  for (const param of operation.parameters.parameters) {
    if (param.type === "header") {
      const headerKey = param.name.toLowerCase();
      const headerAccess = <>request.headers['{headerKey}']</>;
      callArgs.push(
        <>
          Array.isArray({headerAccess}) ? {headerAccess}[0] : {headerAccess}
        </>,
      );
    }
  }

  const queryParams = operation.parameters.parameters.filter(
    function isQuery(p) {
      return p.type === "query";
    },
  );

  if (queryParams.length > 0) {
    const optionsObj = (
      <ts.ObjectExpression>
        {queryParams.map(function renderQueryProp(param, index) {
          const paramName = toCamelCase(param.param.name);
          return (
            <>
              {index > 0 && ", "}
              {paramName}: (request.query as any).{paramName}
            </>
          );
        })}
      </ts.ObjectExpression>
    );
    callArgs.push(optionsObj);
  }

  return (
    <ts.FunctionExpression
      async
      parameters={[
        { name: "request", type: fastifyLib.FastifyRequest },
        { name: "reply", type: fastifyLib.FastifyReply },
      ]}
    >
      <List>
        <>try {"{"}</>
        <List>
          <ts.VarDeclaration name="result">
            await{" "}
            <ts.FunctionCallExpression
              target={<>operations.{opName}</>}
              args={callArgs}
            />
          </ts.VarDeclaration>
          <>
            <ts.FunctionCallExpression
              target={<>reply.code</>}
              args={[<>200</>]}
            />
            .
            <ts.FunctionCallExpression
              target={<>send</>}
              args={[<>result</>]}
            />
            {";"}
          </>
        </List>
        {"}"} catch (error) {"{"}
        <List>
          <>
            <ts.FunctionCallExpression
              target={<>reply.code</>}
              args={[<>500</>]}
            />
            .
            <ts.FunctionCallExpression
              target={<>send</>}
              args={[
                <>
                  {"{"} error: error instanceof Error ? error.message :
                  'Internal server error' {"}"}
                </>,
              ]}
            />
            {";"}
          </>
        </List>
        {"}"}
      </List>
    </ts.FunctionExpression>
  );
}
