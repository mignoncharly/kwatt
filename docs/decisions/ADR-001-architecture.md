# ADR-001: Phase 1 application architecture

**Status:** Accepted as baseline for Phase 3 setup  
**Date:** 2026-10-08  
**Scope:** Architecture direction only; Phase 1 contains no runtime application

## Context

The workspace contains the implementation plan but no application, package configuration, or deployment stack. The product needs an accessible PWA, server-enforced authorization, private messaging/media, asynchronous notifications, auditable moderation, and EU-region operations. The specification offers API and ORM alternatives and recommends a TypeScript monorepo.

## Decision

Use a TypeScript monorepo managed by pnpm workspaces.

| Package/service | Responsibility |
|---|---|
| apps/web | Next.js App Router PWA, public safe pages, member screens, localized interface |
| apps/api | Fastify HTTP API, OpenAPI contract, auth integration, server-side authorization and domain modules |
| apps/worker | Idempotent jobs for email, push, expiry, deletion, and media scanning |
| packages/contracts | Shared schemas and API client inputs; API remains the authorization authority |
| packages/i18n | fr/en/de catalogs and locale validation |
| packages/ui | Accessible components and tokens after Phase 2 design decisions |
| packages/config | Validated environment schemas and shared TypeScript/lint/format settings |
| prisma | PostgreSQL schema, migrations, and seed fixtures |

Use PostgreSQL as system of record and Prisma for typed access and migrations. Keep bounded modules for identity/profile, requests/discovery, offers/lifecycle, messaging, notifications, trust/moderation, privacy/data rights, and administration. Enforce resource authorization in API services. Use database constraints and transactions for lifecycle changes and helper selection, with version checks and idempotency keys for concurrent/retried actions.

Use Redis for rate limits and queue transport, with BullMQ and a separately deployed worker. Use a transactional outbox for events that cannot be lost between database commit and queue publication. Jobs must be idempotent, have bounded retries, and expose exhausted failures for review/replay. Phase 3 must pin a compatible version and verify its current scheduler/retry APIs.

Use Better Auth for maintained email/password, verification, and cookie-session primitives, integrated into Fastify. Keep session records server-side in PostgreSQL, use secure same-origin cookies, revoke sessions on security events, and configure explicit origin/CSRF protection for mutations. The library does not replace application authorization; validate its exact configuration in Phase 5.

Serve web and API under one origin behind a TLS-terminating reverse proxy. Keep the API independently deployable while avoiding broad CORS and cross-origin cookies. Private attachments may use EU-region S3-compatible storage only after Phase 8 access checks, signed access, type/size controls, malware scanning, and retention are operational. Never use a public bucket.

Select email and optional push providers only after region, processing terms, cost, budget, secrets, and delivery monitoring are approved. Provider choice remains deferred in D-012. Do not add analytics, identity, payment, or messaging vendors by default.

Use host-installed PostgreSQL and Redis for local development. Run web, API, and worker as separate least-privilege systemd services behind Nginx; do not use Docker. Production still requires an EU hosting, TLS certificate, secret storage, backup, and monitoring decision. Keep production credentials out of the repository.

## Rationale and alternatives

Next.js App Router supports the web routing and server/client rendering needs. Fastify plugin boundaries support a modular API with TypeScript schemas. Better Auth documents Fastify integration and email verification, avoiding custom password/session primitives. Prisma transactions fit guarded lifecycle updates. A modular monolith keeps pilot operations manageable while API and worker processes can be deployed separately.

NestJS was not selected because the current module set does not need its additional conventions. Drizzle was not selected because Prisma's migration and typed-model workflow is a better baseline for a new data-heavy system. An API embedded only in Next.js was not selected because notifications, expiry, deletion, and media scanning need an independently deployable worker/API boundary. Custom authentication is rejected for security-sensitive password and session handling.

## Security and operations constraints

- Build public responses and Open Graph metadata from explicit allowlists, never by serializing full request records.
- Enforce deny-by-default role and resource authorization in the API; shared schemas and UI visibility grant no access.
- Exclude private content from service-worker/shared caches; redact message bodies, tokens, contact details, and precise itinerary from logs.
- Make jobs idempotent and privileged actions auditable.
- Keep data and backups in reviewed EU-region systems; rehearse restoration before launch.
- Pin and scan dependencies in Phase 3; compatibility and security checks gate upgrades.

## Official references checked 2026-10-08

- [Next.js App Router](https://nextjs.org/docs/app)
- [Fastify plugins](https://fastify.dev/docs/latest/Reference/Plugins/) and [TypeScript support](https://fastify.dev/docs/latest/Reference/TypeScript/)
- [Better Auth Fastify integration](https://better-auth.com/docs/integrations/fastify), [email verification](https://better-auth.com/docs/concepts/email), and [Prisma adapter](https://better-auth.com/docs/adapters/prisma)
- [Prisma transactions](https://www.prisma.io/docs/orm/fundamentals/transactions)
- [pnpm workspaces](https://pnpm.io/workspaces)
- [BullMQ queues](https://docs.bullmq.io/guide/queues), [retries](https://docs.bullmq.io/guide/jobs/retrying-failing-job), and [job schedulers](https://docs.bullmq.io/guide/job-schedulers/)
