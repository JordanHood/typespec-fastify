# TypeSpec Fastify Emitter

Generates Fastify server code from TypeSpec HTTP service definitions using the Alloy Framework.

> [!IMPORTANT]
> This project is in early development and not production-ready. Expect breaking changes and missing features.

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

## Architecture

**Built with:**

- Alloy Framework (JSX-based code generation)
- TypeSpec HTTP (service definitions)
- TypeSpec Emitter Framework (compiler integration)

## Contributing

Contributions welcome.

## License

MIT
