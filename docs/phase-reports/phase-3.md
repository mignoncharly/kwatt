# Phase 3 handoff: repository, environments, and delivery pipeline

**Status:** Native-service implementation updated; acceptance gate pending local database setup and remote CI  
**Scope:** Phase 3 only; Phase 4 has not started  
**Specification:** `community_platform_15_phase_plan.md`

## Implemented

- Initialized a pnpm 11.20.0 workspace for Node 24 with web, API, worker, configuration, contracts, i18n, and UI packages. Direct dependencies are pinned and the lockfile is reproducible.
- Added Prettier, ESLint, TypeScript checks for workspace packages and Prisma tooling, Vitest unit/service integration suites, Playwright browser checks, and a Husky pre-commit formatter hook.
- Added startup-validated Zod environment schemas for PostgreSQL, Redis, host/port, and HTTP API URLs. The local bootstrap creates a random password in ignored `.env` and refuses to overwrite an existing file.
- Replaced the Compose-based local dependency stack with host-installed PostgreSQL and Redis. Local service ports use the standard loopback endpoints; the bootstrap generates a random PostgreSQL role password.
- Added separate hardened systemd unit templates for web, API, and worker, plus an Nginx TLS reverse-proxy template that omits query strings from its access log format.
- Added API and worker liveness/readiness routes. Liveness is dependency independent; readiness checks PostgreSQL/Redis and returns a generic 503 on failure. Responses are no-store, security headers are present, and Fastify automatic request logging is disabled to avoid query-string leakage.
- Added one infrastructure-only `bootstrap_fixture` migration and deterministic seed. Seed execution is limited to loopback databases named `community`. Phase 4 replaces this fixture with the product schema and authorization model.
- Added staging/production environment templates with no credentials, a pinned-action GitHub CI workflow, moderate-severity dependency audit, high-confidence secret scan, and CycloneDX SBOM generation.
- Updated dependency pins after the audit found vulnerable transitive packages. The audited lockfile now resolves patched versions and the moderate-or-higher audit is clean.

## Files changed

- Repository and tooling: `.gitignore`, `.npmrc`, `.prettierignore`, `.prettierrc.json`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `eslint.config.mjs`, `tsconfig.base.json`, `tsconfig.tools.json`, `vitest.config.ts`, `playwright.config.ts`, `.husky/pre-commit`.
- CI and local operations: `.github/workflows/ci.yml`, `README.md`, `.env.example`, `.env.staging.example`, `.env.production.example`, `scripts/setup-local.mjs`, `scripts/check-secrets.mjs`.
- Runtime packages: `apps/web/**`, `apps/api/**`, `apps/worker/**`, `packages/config/**`, `packages/contracts/**`, `packages/i18n/**`, and `packages/ui/**`.
- Database setup: `prisma.config.ts`, `prisma/schema.prisma`, `prisma/migrations/migration_lock.toml`, `prisma/migrations/20261008120000_bootstrap_fixture/migration.sql`, and `prisma/seed.ts`.
- Tests: `tests/unit/env.test.ts`, `tests/unit/locale.test.ts`, `tests/integration/api-health.test.ts`, `tests/integration/worker-health.test.ts`, and `tests/e2e/health.spec.ts`.
- Decisions and operations: `docs/decisions/ADR-001-architecture.md`, `docs/decisions/ADR-002-repository-delivery.md`, `deploy/README.md`, `deploy/nginx/community-platform.conf`, the three `deploy/systemd/*.service` units, `deploy/staging/README.md`, and `deploy/production/README.md`.

The ignored local `.env`, dependency installation, build output, browser cache, and generated `sbom.json` are workspace artifacts, not tracked source files.

## Checks performed

Ran from `C:\\kwatt`:

- `pnpm install --frozen-lockfile` — passed with pnpm 11.20.0.
- `pnpm check` — passed. Prettier, ESLint, app and Prisma-tooling typechecks, package builds, and Next.js 16.4.0 production build all succeeded.
- `pnpm test` — passed: 6 unit tests, 5 Fastify service integration tests, and 1 Playwright browser test. The local Chromium binary was installed in the workspace cache for this run.
- Prisma schema validation and client generation — passed with Prisma 7.10.0.
- Dependency audit at moderate severity or higher — passed: no known vulnerabilities found.
- Secret scan — passed. `.env` is ignored by Git and was not included in the repository status.
- SBOM — generated and parsed as CycloneDX 1.7 with 448 components.
- Live process checks — API `/healthz` returned 200 and `/readyz` returned a sanitized 503 while PostgreSQL was unavailable; worker `/healthz` returned 200.

## Security, privacy, and risks

The systemd and Nginx files are templates only; no host configuration was installed or changed. PostgreSQL and Redis remain private services. Hosting provider, EU region, domain, certificates, and secret storage still require owner selection. D-012 defers external messaging providers. Fastify request logging stays disabled, and the Nginx access format omits query strings.

No product-domain tables, authentication, user workflows, provider integrations, or public deployment were introduced. Application processes are intended to run on the host under systemd; this workspace did not receive host-level service changes.

## Acceptance gate and remaining manual work

Earlier code-level checks and security scans passed in the prior Node 24 workspace. They have not been repeated in this checkout. The Phase 3 gate is **not yet satisfied**:

- This host has systemd, Nginx, PostgreSQL, and Redis active. PostgreSQL accepts connections, but the current account has no matching database role and needs an administrator to create the local role/database. Redis requires authentication; a dedicated local credential must be provisioned and placed in ignored `.env`.
- The current host runs Node 22.23.0, below the pinned Node 24.19.x. Remote CI must confirm the pinned runtime path.
- The supplied GitHub repository was empty and this workspace had no `.git` directory. Initialize and push the reviewed source to the supplied remote; then confirm its CI workflow is green.

The root README now documents host-native setup. After a local administrator provisions the database role and Redis credentials, run migrations, seed, start the app services, and verify readiness. Do not start Phase 4 before those gate checks pass.

**Deployment or external services:** none. No system packages, Nginx configuration, systemd units, or production services were changed on the host.  
**Readiness:** Native deployment templates are in place; acceptance and Phase 4 readiness remain pending database/Redis setup and remote CI verification.
