---
"typespec-fastify": minor
---

Add Zod schema validation and type-safe routes

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