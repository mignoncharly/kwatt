# Production

Use the host-native systemd and Nginx setup described in [the deployment runbook](../README.md). Store `.env.production.example` values in the approved secret store and inject them at runtime. Production requires an EU-region data plane, TLS, private database/Redis networking, least-privilege service identities, encrypted offsite backups, monitoring, and a rehearsed restore process.

Do not use the local seed command in production. Promote immutable artifacts only after staging verification and a reviewed migration plan. Keep the previous application release available for rollback. Hosting provider, region, domain, and secret-manager selection remain pending owner decisions.
