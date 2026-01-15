---
"typespec-fastify": minor
---

Add user-controlled response handling and path parameter support

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
