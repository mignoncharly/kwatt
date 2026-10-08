# ADR-002: Repository and delivery foundation

**Status:** Accepted for Phase 3  
**Date:** 2026-10-08  
**Scope:** Reproducible repository setup, local development, CI, and release operations

## Context

Phase 1 established a TypeScript pnpm monorepo with Next.js, Fastify, PostgreSQL/Prisma, Redis/BullMQ, and a separate worker. Phase 3 needs reproducible package resolution, environment validation, host dependency services, health checks, test harnesses, migration fixtures, dependency security checks, and rollback documentation. External email/phone/push provider selection remains deferred in D-012.

## Decisions

- Pin Node.js 24.19.x and pnpm 11.20.0. Pin direct npm dependencies and commit the generated pnpm lockfile. CI uses the same runtime and frozen lockfile installs.
- Keep the accepted package boundaries: `apps/web`, `apps/api`, `apps/worker`, and shared `packages/config`, `contracts`, `i18n`, and `ui`.
- Use host-installed PostgreSQL and Redis for local development. Keep database and cache endpoints private and configure local service credentials outside the application repository.
- Run web, API, and worker as separate systemd services under a dedicated unprivileged account. Put Nginx in front of loopback-only app listeners; do not use Docker or Compose.
- Use Prisma 7.10 with its PostgreSQL driver adapter. Prisma 8 was not selected because its current release status is release candidate; avoid adopting a breaking ORM major during the foundation phase.
- Validate runtime environment variables with Zod at process startup. Keep templates secret-free, generate a random local database password, and refuse to overwrite an existing local environment file.
- Disable Fastify automatic request logs because default URL logging can expose query parameters; retain redaction rules for sensitive headers and fields.
- Keep liveness checks independent from dependencies. Readiness checks the API database connection and worker Redis connection; return a generic 503 body on failure.
- Use Vitest for unit and service integration tests and Playwright for a real browser smoke test. The Phase 3 service integration tests inject failure/success probes; full DB lifecycle and repository tests belong to Phase 4.
- Run formatting, lint, type checks, builds, test suites, dependency audit, secret scan, and CycloneDX SBOM generation in GitHub Actions. The workflow is verification-only; it does not deploy.
- Keep one local-only `BootstrapFixture` migration and deterministic seed to verify setup. Phase 4 replaces this foundation table with the domain schema.
- Do not configure vendor, hosting, or production credentials. Document environment requirements and rollback practices until provider and region decisions are approved.

## Consequences

A clean clone needs host-installed PostgreSQL and Redis. The repository contains systemd and Nginx templates, but does not install packages, change `/etc`, or start/stop shared host services. The local seed refuses non-loopback hosts and databases. Hosting provider and EU region remain deployment decisions; D-012 covers external messaging providers.

## References

- [pnpm workspaces](https://pnpm.io/workspaces)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Fastify TypeScript](https://fastify.dev/docs/latest/Reference/TypeScript/)
- [Prisma release status](https://www.prisma.io/docs/orm/release-status)
- [Prisma 7 PostgreSQL adapter](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql)
- [CycloneDX npm tool](https://github.com/CycloneDX/cyclonedx-node-npm)
