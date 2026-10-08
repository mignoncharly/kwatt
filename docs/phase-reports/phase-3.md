# Phase 3 handoff: repository, environments, and delivery pipeline

**Status:** Native-service implementation and remote CI complete; local database acceptance remains pending  
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
- Fixed TypeScript workspace builds so package builds emit the JavaScript exports required by Next.js and the systemd runtime.
- Initialized the supplied GitHub repository on `main`; added an install-time Husky permission repair so generated hooks run on this host.

## Files changed

- Repository and tooling: `.gitignore`, `.npmrc`, `.prettierignore`, `.prettierrc.json`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `eslint.config.mjs`, TypeScript workspace configs, `tsconfig.base.json`, `tsconfig.tools.json`, `vitest.config.ts`, `playwright.config.ts`, `.husky/pre-commit`, and `scripts/ensure-git-hooks.mjs`.
- CI and local operations: `.github/workflows/ci.yml`, `README.md`, `.env.example`, `.env.staging.example`, `.env.production.example`, `scripts/setup-local.mjs`, `scripts/check-secrets.mjs`.
- Runtime packages: `apps/web/**`, `apps/api/**`, `apps/worker/**`, `packages/config/**`, `packages/contracts/**`, `packages/i18n/**`, and `packages/ui/**`.
- Database setup: `prisma.config.ts`, `prisma/schema.prisma`, `prisma/migrations/migration_lock.toml`, `prisma/migrations/20261008120000_bootstrap_fixture/migration.sql`, and `prisma/seed.ts`.
- Tests: `tests/unit/env.test.ts`, `tests/unit/locale.test.ts`, `tests/integration/api-health.test.ts`, `tests/integration/worker-health.test.ts`, and `tests/e2e/health.spec.ts`.
- Decisions and operations: `docs/decisions/ADR-001-architecture.md`, `docs/decisions/ADR-002-repository-delivery.md`, `deploy/README.md`, `deploy/nginx/community-platform.conf`, the three `deploy/systemd/*.service` units, `deploy/staging/README.md`, and `deploy/production/README.md`.

The ignored local `.env`, dependency installation, build output, browser cache, and generated `sbom.json` are workspace artifacts, not tracked source files.

## Checks performed

Earlier checks reported from `C:\\kwatt`:

- `pnpm install --frozen-lockfile` — passed with pnpm 11.20.0.
- `pnpm check` — passed. Prettier, ESLint, app and Prisma-tooling typechecks, package builds, and Next.js 16.4.0 production build all succeeded.
- `pnpm test` — passed: 6 unit tests, 5 Fastify service integration tests, and 1 Playwright browser test. The local Chromium binary was installed in the workspace cache for this run.
- Prisma schema validation and client generation — passed with Prisma 7.10.0.
- Dependency audit at moderate severity or higher — passed: no known vulnerabilities found.
- Secret scan — passed. `.env` is ignored by Git and was not included in the repository status.
- SBOM — generated and parsed as CycloneDX 1.7 with 448 components.
- Live process checks — API `/healthz` returned 200 and `/readyz` returned a sanitized 503 while PostgreSQL was unavailable; worker `/healthz` returned 200.

Checks in this workspace:

- `corepack pnpm install --frozen-lockfile` — passed. Host Node is 22.23.1, so pnpm emitted the expected warning that the project requires Node 24.
- `corepack pnpm format:check` and `corepack pnpm check` — passed under Node 22.23.1: formatting, lint, typechecks, package and Next.js builds, 6 unit tests, and 5 integration tests.
- `corepack pnpm db:validate` and `corepack pnpm db:generate` — passed with Prisma 7.10.0.
- `node scripts/check-secrets.mjs` — passed on the staged source.
- Husky pre-commit — ran `lint-staged` and Prettier successfully for the follow-up commits.
- GitHub Actions [CI run 37855395376](https://github.com/mignoncharly/kwatt/actions/runs/37855395376) — passed on Node 24: install, Prisma validation/generation, lint/typecheck/build/unit/integration checks, secret scan, moderate-severity audit, Chromium install, browser test, CycloneDX SBOM generation, and artifact upload. Runtime: 1m19s.
- `corepack pnpm db:migrate:dev` — blocked with Prisma P1000 because the generated `community` database password has not been provisioned in the host PostgreSQL role. The seed and live readiness checks were therefore not run here.

## Security, privacy, and risks

The systemd and Nginx files are templates only; no host configuration was installed or changed. PostgreSQL and Redis remain private services. Hosting provider, EU region, domain, certificates, and secret storage still require owner selection. D-012 defers external messaging providers. Fastify request logging stays disabled, and the Nginx access format omits query strings.

No product-domain tables, authentication, user workflows, provider integrations, or public deployment were introduced. Application processes are intended to run on the host under systemd; this workspace did not receive host-level service changes.

## Acceptance gate and remaining manual work

Remote CI is green and the source is pushed to the supplied `origin/main`. The full host bootstrap gate remains **pending**:

- This host has systemd, Nginx, PostgreSQL, and Redis active. PostgreSQL accepts connections, but the current account cannot provision the generated database role; `db:migrate:dev` returned P1000. Redis requires authentication, and an administrator must provision a dedicated local ACL user and place its URL in ignored `.env`.
- Node 22.23.1 is installed on this host; the repository requires Node 24.19.x. The GitHub workflow verified the pinned Node 24 path.
- After database and Redis credentials are provisioned, run the migration and seed sequence, start web/API/worker, and verify their health and readiness endpoints. Do not start Phase 4 before this host bootstrap gate passes.

**Deployment:** Nginx and systemd configurations are templates only. No host packages, `/etc` files, app services, or production deployment were changed. Source was pushed to GitHub and CI completed successfully.  
**Readiness:** Remote CI gate passed; local database migration, seed, and live readiness remain pending host-admin setup.
