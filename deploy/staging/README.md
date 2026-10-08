# Staging

Use the host-native systemd and Nginx setup described in [the deployment runbook](../README.md). Store staging values from `.env.staging.example` in the approved secret store and inject them through `/etc/community-assistance/production.env` or an equivalent protected path.

Use an isolated EU-region database and Redis service with synthetic data only. Require TLS, restrict administrative access, and verify backup restore before accepting test accounts. Exercise migrations against a disposable copy before promotion. This directory contains templates only; it does not contain credentials or deploy to a host.
