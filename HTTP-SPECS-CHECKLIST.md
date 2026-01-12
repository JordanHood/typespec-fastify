# HTTP Specs Feature Checklist

Status of @typespec/http-specs scenario support in typespec-fastify.

**Total Scenarios:** 57
**Compiles:** 25 (44%)
**E2E Passing:** 0 (0%)

**Note:** "Compiles" means the emitter can generate code without errors, but doesn't mean the generated code actually works correctly. E2E tests validate actual HTTP behavior with tsp-spector.

## Authentication (4)

- [ ] authentication/api-key
- [ ] authentication/http/custom
- [ ] authentication/oauth2
- [ ] authentication/union

## Documentation (1)

- [ ] documentation

## Encoding (5)

- [ ] encode/array
- [ ] encode/bytes
- [ ] encode/datetime
- [ ] encode/duration
- [ ] encode/numeric

## Parameters (6)

- [ ] parameters/basic
- [ ] parameters/body-optionality
- [ ] parameters/collection-format
- [ ] parameters/path
- [ ] parameters/query
- [ ] parameters/spread

## Payload (6)

- [ ] payload/content-negotiation
- [ ] payload/json-merge-patch
- [ ] payload/media-type
- [ ] payload/multipart
- [ ] payload/pageable
- [ ] payload/xml

## Response (1)

- [ ] response/status-code-range

## Routes (1)

- [ ] routes

## Serialization (1)

- [ ] serialization/encoded-name/json

## Server (5)

- [ ] server/endpoint/not-defined
- [ ] server/path/multiple
- [ ] server/path/single
- [ ] server/versions/not-versioned
- [ ] server/versions/versioned

## Special Headers (2)

- [ ] special-headers/conditional-request
- [ ] special-headers/repeatability

## Special Words (1)

- [ ] special-words

## Streaming (1)

- [ ] streaming/jsonl

## Type System (20)

### Arrays & Collections
- [ ] type/array
- [ ] type/dictionary

### Enums
- [ ] type/enum/extensible
- [ ] type/enum/fixed

### Models
- [ ] type/model/empty
- [ ] type/model/inheritance/enum-discriminator
- [ ] type/model/inheritance/nested-discriminator
- [ ] type/model/inheritance/not-discriminated
- [ ] type/model/inheritance/recursive
- [ ] type/model/inheritance/single-discriminator
- [ ] type/model/usage
- [ ] type/model/visibility

### Properties
- [ ] type/property/additional-properties
- [ ] type/property/nullable
- [ ] type/property/optionality
- [ ] type/property/value-types

### Other Types
- [ ] type/scalar
- [ ] type/union
- [ ] type/union/discriminated

## Versioning (6)

- [ ] versioning/added
- [ ] versioning/madeOptional
- [ ] versioning/removed
- [ ] versioning/renamedFrom
- [ ] versioning/returnTypeChangedFrom
- [ ] versioning/typeChangedFrom

## Priority Roadmap

### v0.1.0 (Current)
Basic functionality working but no scenario compliance yet.

### v0.2.0 (Next)
Focus on core HTTP features:
- [ ] parameters/basic
- [ ] parameters/path
- [ ] parameters/query
- [ ] parameters/body-optionality
- [ ] response/status-code-range
- [ ] routes

### v0.3.0
Type system support:
- [ ] type/model/*
- [ ] type/enum/*
- [ ] type/union
- [ ] type/property/*

### v0.4.0
Advanced features:
- [ ] encode/*
- [ ] serialization/*
- [ ] payload/content-negotiation
- [ ] payload/media-type

### v1.0.0
Full compliance:
- [ ] authentication/*
- [ ] versioning/*
- [ ] streaming/*
- [ ] server/versions/*
- [ ] All remaining scenarios
