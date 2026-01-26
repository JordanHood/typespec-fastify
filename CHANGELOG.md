# typespec-fastify

## 0.3.0

### Minor Changes

- [#5](https://github.com/JordanHood/typespec-fastify/pull/5) [`5c5d212`](https://github.com/JordanHood/typespec-fastify/commit/5c5d212f87ea7386be379b9336a00c195cefd9fc) Thanks [@JordanHood](https://github.com/JordanHood)! - Add Zod schema validation and type-safe routes

  This release adds comprehensive Zod validation support using fastify-type-provider-zod and typespec-zod:
  - Runtime validation with Zod schemas for all route parameters, query strings, and request bodies
  - Full type inference in route handlers (removed `as any` casts)
  - Automatic validator and serializer compiler setup
  - New peer dependencies: `zod`, `fastify-type-provider-zod`, and `typespec-zod`
  - Single typed server instance per route file for cleaner generated code

  Breaking changes:
  - New required peer dependencies must be installed alongside this package
  - Generated routes now use `ZodTypeProvider` instead of untyped Fastify instances

  All e2e tests passing with full type safety.

## 0.2.0

### Minor Changes

- [#2](https://github.com/JordanHood/typespec-fastify/pull/2) [`3f52684`](https://github.com/JordanHood/typespec-fastify/commit/3f52684acc3fb25d5d28a41903bac827aa638b5e) Thanks [@JordanHood](https://github.com/JordanHood)! - Add user-controlled response handling and path parameter support

  **Breaking Changes:**
  - Operations now return `Promise<NoContentResponse>` or `Promise<ResponseWithBody<T>>` instead of `Promise<void>`
  - Users control HTTP status codes via the `statusCode` property in response objects
  - Response types defined in `models/response-types.ts`

  **New Features:**
  - Path parameter conversion from TypeSpec `{param}` syntax to Fastify `:param` syntax
  - Optional path parameter support using Fastify's `:param?` syntax
  - Header type casting to handle `string | string[] | undefined`
  - Support for RFC6570 URI templates

  **Improvements:**
  - E2E test infrastructure with 5 parameter test suites (20 scenarios passing)
  - Separate type-checking configuration with `tsconfig.test.json`
  - Improved build scripts handling circular dependencies
  - Silent mode for e2e code generation (`--silent` flag)

## 0.1.0

### Minor Changes

- [`02b0e90`](https://github.com/JordanHood/typespec-fastify/commit/02b0e908e743961d159565d89215cd3c352fa887) Thanks [@JordanHood](https://github.com/JordanHood)! - Initial release

  Working TypeSpec to Fastify code generator with:
  - Route generation from TypeSpec operations
  - Operation interfaces for business logic
  - Type-safe TypeScript generation
  - Error handling in route handlers
  - Plugin-style pattern for user control
