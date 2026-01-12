import { For, SourceDirectory } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import type { HttpOperation } from "@typespec/http";
import { OperationInterface } from "./OperationInterface.js";

export interface OperationsDirectoryProps {
  groupedOperations: Map<string, HttpOperation[]>;
}

/**
 * Generates the operations directory with operation interface files.
 */
export function OperationsDirectory(props: OperationsDirectoryProps) {
  return (
    <SourceDirectory path="operations">
      <For each={Array.from(props.groupedOperations.entries())}>
        {([containerName, operations]) => (
          <ts.SourceFile path={`${containerName.toLowerCase()}.ts`}>
            <OperationInterface
              containerName={containerName}
              operations={operations}
            />
          </ts.SourceFile>
        )}
      </For>
    </SourceDirectory>
  );
}
