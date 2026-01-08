# TypeSpec Fastify Emitter

Generates Fastify server code from TypeSpec HTTP service definitions using the Alloy Framework.

> **⚠️ Early Development Notice**
>
> This project is in early development (v0.0.1) and not production-ready. Expect breaking changes and missing features.

## Installation

```bash
npm install --save-dev typespec-fastify
```

## Features

- Route handlers generated from TypeSpec operations
- TypeScript operation interfaces for business logic
- Automatic parameter extraction (path, query, headers, body)
- Type-safe code generation
- User-controlled server lifecycle

## Usage

### 1. Configure TypeSpec

Create `tspconfig.yaml`:

```yaml
emit:
  - "typespec-fastify"
options:
  "typespec-fastify":
    "output-dir": "{project-root}/src/generated"
```

### 2. Define Service

Create `main.tsp`:

```typespec
import "@typespec/http";
using TypeSpec.Http;

@service
namespace PetStore;

model Pet {
  id: int32;
  name: string;
  age: int32;
}

@route("/pets")
interface Pets {
  @get list(@query limit?: int32): Pet[];
  @get get(@path petId: int32): Pet;
  @post create(@body pet: Pet): Pet;
}
```

### 3. Compile

```bash
npx tsp compile .
```

### 4. Implement

```typescript
import fastify from "fastify";
import { registerRoutes } from "./generated/router.js";
import type { Pets } from "./generated/operations/pets.js";

const petsOperations: Pets = {
  async list(options) {
    return [{ id: 1, name: "Fluffy", age: 3 }];
  },
  async get(petId) {
    return { id: petId, name: "Fluffy", age: 3 };
  },
  async create(body) {
    return { ...body, id: 123 };
  },
};

const server = fastify({ logger: true });
await registerRoutes(server, { pets: petsOperations });
await server.listen({ port: 3000 });
```

## Generated Structure

```text
generated/
├── router.ts              # registerRoutes() function
├── models/
│   └── petstore.ts       # TypeScript types
├── operations/
│   └── pets.ts           # Operation interfaces
└── routes/
    ├── pets.routes.ts    # Route handlers
    └── index.ts          # Route loader
```

## How It Works

The emitter generates route registration code, not a complete server. You provide:

- Fastify instance and configuration
- Operation implementations (business logic)
- Server lifecycle management

Generated code handles:

- Route registration
- Parameter extraction and mapping
- Type-safe operation interfaces
- Basic error handling

## Limitations

**Critical Issues:**

- Status codes hardcoded to 200 (operation result statusCode ignored)
- Single service only (first @service namespace)
- No versioning support

**Type Safety:**

- Uses `as any` casts for request objects
- No schema validation
- No request/response validation

**Missing Features:**

- OpenAPI metadata (@doc, @summary, @tag)
- Authentication/security decorators
- Custom middleware generation
- Content-type negotiation
- File upload support

## Testing

Tests use Vitest.

```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:ui       # Browser UI
npm run test:coverage # Coverage report
```

## Development

```bash
npm run build   # Build
npm run watch   # Watch mode

# Link for testing
npm link
cd /path/to/test-project
npm link typespec-fastify
```

## Architecture

**Built with:**

- Alloy Framework (JSX-based code generation)
- TypeSpec HTTP (service definitions)
- TypeSpec Emitter Framework (compiler integration)

**Components:**

- `src/emitter.tsx` - Main orchestration
- `src/components/` - Code generation
- `src/utils/` - HTTP helpers, type mapping
- `src/testing/` - Test infrastructure

## Roadmap

**v0.0.2:**

- Status code extraction
- Schema validation
- Multiple services

**v0.1.0:**

- Remove `as any` casts
- OpenAPI metadata
- Versioning

**v1.0.0:**

- Feature parity with @typespec/http-server-js
- Content-type handling
- Authentication decorators

## Contributing

Contributions welcome.

## License

MIT
