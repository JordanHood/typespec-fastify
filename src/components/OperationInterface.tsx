import { For, List, refkey, type Refkey, type Children } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import type { HttpOperation } from "@typespec/http";
import { TypeExpression } from "@typespec/emitter-framework/typescript";
import { toCamelCase } from "../utils/http-helpers.js";

export interface OperationInterfaceProps {
  containerName: string;
  operations: HttpOperation[];
}

/**
 * Creates a refkey for an operation interface.
 * This allows other components to reference this interface and
 * Alloy will automatically generate the import.
 */
export function getOperationInterfaceRef(containerName: string): Refkey {
  return refkey(containerName, "operation-interface");
}

/**
 * Generates a TypeScript interface for a group of HTTP operations.
 * Following the http-server-js pattern, this creates an interface with methods
 * for each operation that the user will implement.
 */
export function OperationInterface(props: OperationInterfaceProps) {
  const { containerName, operations } = props;
  const interfaceRef = getOperationInterfaceRef(containerName);

  return (
    <ts.InterfaceDeclaration name={containerName} export refkey={interfaceRef}>
      <List>
        <For each={operations} hardline semicolon>
          {function renderOperationMethod(operation) {
            const opName = toCamelCase(operation.operation.name);
            const parameters: {
              name: string;
              type: Children;
              optional?: boolean;
            }[] = [];

            for (const param of operation.parameters.parameters) {
              if (param.type === "path") {
                const paramName = toCamelCase(param.param.name);
                parameters.push({
                  name: paramName,
                  type: <TypeExpression type={param.param.type} />,
                });
              }
            }

            if (operation.parameters.body) {
              parameters.push({
                name: "body",
                type: <TypeExpression type={operation.parameters.body.type} />,
              });
            }

            for (const param of operation.parameters.parameters) {
              if (param.type === "header") {
                const paramName = toCamelCase(param.param.name);
                parameters.push({
                  name: paramName,
                  type: <TypeExpression type={param.param.type} />,
                  optional: param.param.optional,
                });
              }
            }

            const queryParams = operation.parameters.parameters.filter(
              function isQuery(p) {
                return p.type === "query";
              },
            );

            if (queryParams.length > 0) {
              const optionsType = (
                <ts.InterfaceExpression>
                  {queryParams.map(function renderQueryParam(param) {
                    const paramName = toCamelCase(param.param.name);
                    return (
                      <>
                        <ts.InterfaceMember
                          name={paramName}
                          optional={param.param.optional}
                        >
                          <TypeExpression type={param.param.type} />
                        </ts.InterfaceMember>
                        {"; "}
                      </>
                    );
                  })}
                </ts.InterfaceExpression>
              );
              parameters.push({
                name: "options",
                type: optionsType,
                optional: true,
              });
            }

            const returnType = (
              <>
                Promise&lt;
                <TypeExpression type={operation.operation.returnType} />
                &gt;
              </>
            );

            return (
              <ts.InterfaceMethod
                name={opName}
                parameters={parameters}
                returnType={returnType}
              />
            );
          }}
        </For>
      </List>
    </ts.InterfaceDeclaration>
  );
}
