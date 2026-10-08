# Host-native deployment

The application runs as separate systemd services for the web app, API, and worker. Nginx terminates TLS and proxies to loopback-only application listeners. Docker and Compose are not used. PostgreSQL and Redis run as private host services or approved private services.

The checked-in staging and production environment files are templates only. They contain no credentials. The hosting provider, EU region, domain, certificate issuer, and secret store still require owner selection. D-012 concerns email, phone, and push providers; it does not select infrastructure vendors.

## First host setup

These steps are an operator runbook. They are not run by CI and do not change the current development host.

1. Provision a supported Linux host with systemd, Node.js 24.19.x, pnpm 11.20.0, Nginx, PostgreSQL, and Redis. Keep PostgreSQL and Redis on private interfaces and create dedicated database/cache credentials.
2. Create the unprivileged service account and release directories:

   ```sh
   sudo useradd --system --home /nonexistent --shell /usr/sbin/nologin community-assistance
   sudo install -d -o root -g community-assistance -m 0750 /srv/community-assistance/releases
   sudo install -d -o root -g community-assistance -m 0750 /etc/community-assistance
   ```

3. Build a versioned release in `/srv/community-assistance/releases/<release-id>` with `pnpm install --frozen-lockfile`, `pnpm db:validate`, `pnpm db:generate`, and `pnpm build`. Make release files readable by `community-assistance`; keep the web `.next/cache` directory writable by that account.
4. Add `/srv/community-assistance/current` as a symlink to the release. Put the real environment values in `/etc/community-assistance/production.env`, owned by `root:community-assistance` with mode `0640`. Use the production template as a key list.
5. Review the three units in `systemd/`, copy them to `/etc/systemd/system/`, then run `sudo systemctl daemon-reload`. Apply migrations as a separate release action with the same environment file before starting the app services.
6. Replace the example domain and certificate paths in `nginx/community-platform.conf`. Install it under `/etc/nginx/sites-available/`, enable it in `sites-enabled/`, confirm the certificate files exist, then run `sudo nginx -t` and `sudo systemctl reload nginx`.
7. Start and enable `community-assistance-web`, `community-assistance-api`, and `community-assistance-worker`. Check `/api/health`, `/healthz`, `/readyz`, and the worker's journal before accepting traffic.

The Nginx access log format records the request path without query strings. Review log retention and access as personal data. The app listeners bind to `127.0.0.1`; expose only Nginx on the public interface. The API and worker do not enable CORS.

## Release and rollback

Build an immutable release, validate it, run the migration, then atomically update the `current` symlink and restart all three systemd units. Keep the previous release available. If the release fails, point `current` back to the previous release and restart the services. Leave additive migrations in place when the older application remains compatible; restore a database backup only for verified data-integrity damage. See the root README for the database rollback cautions.

No provider credentials, host changes, public deployment, backup target, or monitoring integration are configured by this repository. Verify backup restoration, alerting, TLS renewal, and system updates with the chosen operator before staging or production use.
