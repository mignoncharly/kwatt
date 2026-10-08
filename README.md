# Community Assistance Platform

This repository is the application and delivery foundation for the community assistance platform. It uses the accepted Phase 1 architecture: Next.js web, Fastify API, a separate worker, PostgreSQL/Prisma, Redis/BullMQ, and shared TypeScript packages. Domain features are introduced in later phases.

## Prerequisites

- Node.js 24.19.x and pnpm 11.20.0 (the package manager and exact version are pinned in `package.json`).
- PostgreSQL and Redis installed as host services and bound to loopback for local development.
- Git.

The package lockfile pins the complete dependency graph. Do not edit generated dependencies by hand; update the direct pin and lockfile together, then run the CI checks.

## Clean-clone local bootstrap

From the repository root:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm bootstrap
```

`pnpm bootstrap` creates `.env` with a random local database password and refuses to overwrite an existing file. Create the matching local PostgreSQL role and database using an administrator account. The password is in the ignored `.env` file as `POSTGRES_PASSWORD`:

```sql
CREATE ROLE community LOGIN PASSWORD '<POSTGRES_PASSWORD from .env>';
CREATE DATABASE community OWNER community;
```

If the role already exists, update its password with `ALTER ROLE community WITH LOGIN PASSWORD '...';`. If the database already exists, ensure `community` owns it. Keep the credentials local and do not reuse them in staging or production.

Set `REDIS_URL` in `.env` to the local Redis endpoint. If the host Redis service requires ACL authentication, use a dedicated local Redis user and URL-encode its credentials. Keep Redis bound to loopback.

Continue with:

```sh
corepack pnpm db:validate
corepack pnpm db:generate
corepack pnpm db:migrate:dev
corepack pnpm db:seed
corepack pnpm dev
```

The seed command refuses non-local hosts and databases. PostgreSQL and Redis must remain reachable only on loopback or another private interface.

The web app is at http://127.0.0.1:3000. API liveness is at http://127.0.0.1:4000/healthz; readiness checks PostgreSQL at http://127.0.0.1:4000/readyz. Worker readiness checks Redis at http://127.0.0.1:4010/readyz. The web service health route is http://127.0.0.1:3000/api/health.

Use `systemctl status postgresql redis-server` to inspect the local database services. Service start/stop commands require the host administrator and affect all local applications, so the repository does not start or stop them automatically.

## Checks

```sh
pnpm check
pnpm test:e2e
pnpm security:secrets
pnpm security:deps
pnpm sbom --sbom-format cyclonedx --out sbom.json
```

`pnpm check` runs formatting validation, lint, type checking, production builds, unit tests, and Fastify integration tests. Browser tests run separately because they need the built web app and a Playwright browser. CI runs all checks, dependency audit, secret scan, and uploads the generated CycloneDX SBOM as a build artifact.

## Environment and deployment

`.env.example` is a non-secret local template. `.env.staging.example` and `.env.production.example` list runtime inputs without credentials. Supply actual values through an environment-specific secret store; never copy secrets into tracked files.

The application runs as three dedicated systemd services behind Nginx. PostgreSQL and Redis run as host services or approved private services. The deployment provider, EU hosting region, domain, certificate issuer, and secret store still need owner selection. See [deploy/README.md](deploy/README.md) for the systemd and Nginx templates and release procedure.

### Rollback procedure

1. Stop promotion and record the release identifier, migration identifier, and observed error.
2. If the migration is additive and backward-compatible, redeploy the previous web/API/worker artifact while keeping the database migration applied.
3. Disable the affected operation with a reviewed configuration change if rollback would otherwise repeat a failure.
4. Restore a database backup only when data integrity is affected and the restore point has been verified. A restore can discard writes made after that point; capture those writes before restore where possible.
5. Run health checks, verify queue processing and critical user journeys, and monitor before resuming promotion.

Migrations must use expand/contract changes so the previous application version remains compatible during rollback. Destructive schema changes require a later release after old code is no longer deployed. No automated rollback or production credentials are configured in this phase.

## Phase boundaries

Phase 3 includes an infrastructure-only `bootstrap_fixture` table used to verify migration and seed setup. Phase 4 replaces and extends this with the product data model and authorization policies. No account, request, offer, message, or moderation behavior is implemented here.
