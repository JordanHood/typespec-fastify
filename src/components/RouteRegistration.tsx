import { For, List, refkey, type Refkey, type Children } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { useTSNamePolicy } from "@alloy-js/typescript";
import type { HttpOperation } from "@typespec/http";
import { isVoidType } from "@typespec/compiler";
import { getHttpVerb } from "../utils/http-helpers.js";
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
  const namePolicy = useTSNamePolicy();
  const functionName = namePolicy.getName(
    `register_${containerName}_routes`,
    "function",
  );
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
          {(operation) => {
            const verb = getHttpVerb(operation);
            const rawPath = operation.uriTemplate || operation.path;

            const optionalParams = new Set();
            for (const param of operation.parameters.parameters) {
              if (param.type === "path" && param.param.optional) {
                optionalParams.add(param.param.name);
              }
            }

            const path = rawPath.replace(/\{([^}]+)\}/g, function(match, p1) {
              const paramName = p1.startsWith("/") ? p1.slice(1) : p1;
              const prefix = p1.startsWith("/") ? "/:" : ":";
              const suffix = optionalParams.has(paramName) ? "?" : "";
              return prefix + paramName + suffix;
            });

            const opName = namePolicy.getName(
              operation.operation.name,
              "function",
            );

            return (
              <>
                <ts.FunctionCallExpression
                  target={<>fastify.{verb}</>}
                  args={[
                    <>'{path}'</>,
                    generateRouteHandler(operation, opName, namePolicy),
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

function generateRouteHandler(
  operation: HttpOperation,
  opName: string,
  namePolicy: ReturnType<typeof useTSNamePolicy>,
) {
  const callArgs: Children[] = [];

  for (const param of operation.parameters.parameters) {
    if (param.type === "path") {
      const paramName = namePolicy.getName(param.param.name, "parameter");
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
          (Array.isArray({headerAccess}) ? {headerAccess}[0] : {headerAccess}) as string
        </>,
      );
    }
  }

  const queryParams = operation.parameters.parameters.filter(
    (p) => p.type === "query",
  );

  if (queryParams.length > 0) {
    const optionsObj = (
      <ts.ObjectExpression>
        {queryParams.map((param, index) => {
          const paramName = namePolicy.getName(
            param.param.name,
            "object-member-data",
          );
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

  const isVoid = isVoidType(operation.operation.returnType);
  const is204Response = operation.responses.some(function (r) {
    return r.statusCodes === 204;
  });
  const isNoContent = isVoid || is204Response;

  return (
    <ts.FunctionExpression
      async
      parameters={[
        { name: "request", type: fastifyLib.FastifyRequest },
        { name: "reply", type: fastifyLib.FastifyReply },
      ]}
    >
      <List>
        <>try {"{"}
        </>
        <List>
          <ts.VarDeclaration name="result">
            await{" "}
            <ts.FunctionCallExpression
              target={<>operations.{opName}</>}
              args={callArgs}
            />
          </ts.VarDeclaration>
          {isNoContent ? (
            <>reply.code(result.statusCode).send();</>
          ) : (
            <>reply.code(result.statusCode).send(result.body);</>
          )}
        </List>
        <>{"}"} catch (error) {"{"}
        </>
        <List>
          <>
            reply.code(500).send({"{"} error: error instanceof Error ?
            error.message : 'Internal server error' {"}"});
          </>
        </List>
        <>{"}"}
        </>
      </List>
    </ts.FunctionExpression>
  );
}
