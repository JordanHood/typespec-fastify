# TypeSpec Fastify Emitter

A TypeSpec emitter that generates Fastify server code from TypeSpec HTTP service definitions using the Alloy Framework.

## Features

- ✅ Generates complete Fastify application setup
- ✅ OpenAPI/Swagger integration with fastify-swagger
- ✅ TypeBox schema generation for request/response validation
- ✅ Error handling with standard HTTP error schemas
- ✅ TypeScript types from TypeSpec models
- ✅ Clean, maintainable code structure

## Installation

```bash
npm install --save-dev typespec-emitter-fastify
```

## Usage

### 1. Create a TypeSpec Configuration

Create a `tspconfig.yaml` file in your project:

```yaml
emit:
  - "typespec-emitter-fastify"
options:
  "typespec-emitter-fastify":
    "output-dir": "{project-root}/src/generated"
```

### 2. Define Your TypeSpec Service

Create your TypeSpec files (e.g., `main.tsp`):

```typespec
import "@typespec/http";

using Http;

@service({ title: "Pet Store API" })
@server("https://api.example.com", "Production server")
namespace PetStore;

model Pet {
  id: int32;
  name: string;
  age: int32;
}

@route("/pets")
namespace Pets {
  @get
  op listPets(): {
    @statusCode statusCode: 200;
    @body pets: Pet[];
  };

  @get
  op getPet(@path petId: int32): {
    @statusCode statusCode: 200;
    @body pet: Pet;
  };
}
```

### 3. Compile Your TypeSpec

```bash
npx tsp compile .
```

## Generated Output Structure

The emitter generates the following structure:

```
output-dir/
├── app.ts                    # Fastify app creation with middleware
├── server.ts                 # Server startup function
├── types/
│   └── models.ts            # TypeScript type definitions
├── schemas/
│   └── errors.ts            # TypeBox error response schemas
├── routes/
│   └── loader.ts            # Route registration
└── interfaces/
    └── operations.ts        # Operation interfaces for business logic
```

### Generated Files

#### `app.ts`

Contains the `createApp()` function that sets up:
- Fastify instance with logging
- Swagger/OpenAPI documentation
- Route registration
- Global error handler

#### `server.ts`

Contains the `start()` function that:
- Creates the Fastify app
- Listens on configurable host/port from environment variables
- Logs server startup information

#### `schemas/errors.ts`

TypeBox schemas for standard HTTP errors:
- `Error400Schema` - Bad Request
- `Error404Schema` - Not Found
- `Error500Schema` - Internal Server Error

## Current Status

This is an initial implementation with basic infrastructure in place. The following features are functional:

- ✅ Basic project structure
- ✅ Fastify app and server generation
- ✅ Error schema generation
- ✅ Component-based architecture using Alloy Framework

### Upcoming Features

- 🚧 Route handler generation from TypeSpec operations
- 🚧 TypeBox schema generation for request/response validation
- 🚧 TypeScript type generation from TypeSpec models
- 🚧 Operation interface generation for business logic
- 🚧 OpenAPI metadata integration

## Development

### Building

```bash
npm run build
```

### Testing

Link the emitter to a test project:

```bash
npm link
cd /path/to/test-project
npm link typespec-emitter-fastify
```

## Architecture

This emitter uses:
- **Alloy Framework** (`@alloy-js/core`, `@alloy-js/typescript`) for code generation
- **TypeSpec HTTP** (`@typespec/http`) for HTTP service definitions
- **Emitter Framework** (`@typespec/emitter-framework`) for TypeSpec integration

### Component Structure

- `src/emitter.tsx` - Main emitter entry point
- `src/fastify-context.ts` - Shared context provider
- `src/components/` - Generation components for each output file
- `src/utils/` - Helper utilities for parameter extraction, naming, etc.

## Contributing

This emitter is under active development. Contributions are welcome!

## License

UNLICENSED
