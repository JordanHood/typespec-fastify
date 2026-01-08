import type {
  Enum,
  Model,
  ModelProperty,
  Program,
  Scalar,
  Type,
  Union,
} from "@typespec/compiler";
import { isArrayModelType, isRecordModelType } from "@typespec/compiler";

/**
 * Maps a TypeSpec type to a TypeScript type string representation.
 * This is a simplified version for generating type annotations in interfaces.
 */
export function mapTypeSpecTypeToTypeScript(program: Program, type: Type): string {
  switch (type.kind) {
    case "String":
      return "string";

    case "Number":
      return "number";

    case "Boolean":
      return "boolean";

    case "Intrinsic":
      if (type.name === "null") return "null";
      if (type.name === "void") return "void";
      if (type.name === "unknown") return "unknown";
      if (type.name === "never") return "never";
      return "any";

    case "Model": {
      if (isArrayModelType(program, type)) {
        const itemType = type.indexer?.value;
        if (itemType) {
          return `${mapTypeSpecTypeToTypeScript(program, itemType)}[]`;
        }
        return "unknown[]";
      }

      if (isRecordModelType(program, type)) {
        const valueType = type.indexer?.value;
        if (valueType) {
          return `Record<string, ${mapTypeSpecTypeToTypeScript(program, valueType)}>`;
        }
        return "Record<string, unknown>";
      }

      // Reference to a named model
      if (type.name) {
        return type.name;
      }

      // Anonymous model - generate inline type
      const properties: string[] = [];
      for (const [propName, prop] of type.properties) {
        const optional = prop.optional ? "?" : "";
        const propType = mapTypeSpecTypeToTypeScript(program, prop.type);
        properties.push(`${propName}${optional}: ${propType}`);
      }
      return `{ ${properties.join("; ")} }`;
    }

    case "Scalar": {
      // Map common scalars
      return mapScalarToTypeScript(type);
    }

    case "Union": {
      const variants: string[] = [];
      for (const variant of type.variants.values()) {
        variants.push(mapTypeSpecTypeToTypeScript(program, variant.type));
      }
      return variants.join(" | ");
    }

    case "Enum": {
      if (type.name) {
        return type.name;
      }
      // Anonymous enum - should not happen in well-formed TypeSpec
      return "string";
    }

    case "Tuple": {
      const elements = type.values.map(function mapElement(v) {
        return mapTypeSpecTypeToTypeScript(program, v);
      });
      return `[${elements.join(", ")}]`;
    }

    case "ModelProperty": {
      return mapTypeSpecTypeToTypeScript(program, type.type);
    }

    default:
      // Fallback for unhandled types
      return "unknown";
  }
}

function mapScalarToTypeScript(scalar: Scalar): string {
  // Handle standard library scalars
  const scalarName = scalar.name;

  switch (scalarName) {
    case "string":
      return "string";
    case "int8":
    case "int16":
    case "int32":
    case "int64":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
    case "safeint":
    case "float":
    case "float32":
    case "float64":
    case "decimal":
    case "decimal128":
    case "numeric":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "plainDate":
    case "plainTime":
    case "utcDateTime":
    case "offsetDateTime":
      return "string"; // For now, represent dates as strings
    case "duration":
      return "string";
    case "bytes":
      return "Buffer";
    case "url":
      return "string";
    default:
      // If it's a custom scalar, use its name if available
      return scalar.name || "unknown";
  }
}

/**
 * Gets a safe identifier name from a TypeSpec type
 */
export function getTypeName(type: Type): string {
  if ("name" in type && typeof type.name === "string") {
    return type.name;
  }
  return "Anonymous";
}
