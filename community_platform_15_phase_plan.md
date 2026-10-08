# Community Assistance Platform — Production Implementation Plan

## Product mandate
Build a complete, production-ready, installable PWA for mutual assistance, initially serving Cameroonian communities in Germany and welcoming other participants. This is not a throwaway MVP. Keep scope disciplined: every included feature must be complete, secure, accessible, tested and operational. The platform coordinates help; it is not an employer, carrier, escrow service, emergency service or guarantor of payment.

### Immutable product rules
- A requester chooses **volunteer/free**, **compensated** (proposed amount and currency), or **flexible** (volunteer preferred, compensation possible). Helpers may accept or propose terms; neither side is automatically charged.
- No platform-managed payment, wallet, subscription, AI matching, native apps, social feed or paid promotion in v1.
- Requester can post for another adult traveler with appropriate permission. Minors and vulnerable-person cases need a separately approved safeguarding policy; do not enable unsupervised minor accompaniment by default.
- Never promise identity checks unless performed. Verification states distinguish email/phone verification, manual document review, and unverified.
- Public pages do not reveal exact home addresses, phone numbers, booking codes, identity documents or precise travel itinerary details. Share links reveal only safe summaries.
- Community-centered, not nationality-gated. Launch locales fr, en, de. Accessible mobile-first UX and low-bandwidth support.
- Commercial private-car passenger transport, medical/legal advice, childcare, money transfers and emergency assistance are outside scope pending legal and safety approval.
- Completion of each phase requires tests, documentation, security review as relevant, and a human-readable handoff. Do not silently advance across failed gates.

## Recommended baseline architecture
TypeScript monorepo with pnpm; Next.js App Router PWA (web); NestJS or Fastify modular API (choose one and document ADR); PostgreSQL with Prisma or Drizzle (choose one); Redis for queues/rate limits; object storage (S3-compatible) for private media; background worker; transactional email; web push where supported; host-installed PostgreSQL and Redis with separate systemd app services behind Nginx, TLS, monitoring, and backups. Do not use Docker. Prefer proven libraries and avoid custom auth/crypto. Authentication via maintained solution with secure sessions and email verification; optional phone verification based on cost and abuse risk. Use an EU-region deployment and privacy-conscious observability. No external managed dependencies unless explicitly configured and budgeted. Separate environments and secrets.

## Phase 1 — Product requirements and bounded scope
**Build:** Write PRD, personas (requester, traveler, helper, moderator, admin), use cases, non-goals, accessibility and non-functional requirements, glossary and success measures. Specify 3–5 categories: airport/station accompaniment, newcomer orientation, everyday practical help, appointment accompaniment (nonprofessional), other subject to moderation. Define adult-only initial policy, community conduct, geography, supported locales, and payments-outside-platform disclosure.
**Deliver:** `/docs/product/PRD.md`, feature inventory, decision log, requirements-to-test traceability matrix, wireflow map.
**Gate:** Every user journey has a written acceptance test; no unresolved contradictory requirement.

## Phase 2 — UX research, information architecture and design system
**Build:** Map discovery, posting, offer, selection, coordination, completion, disputes, account deletion and moderator flows. Design phone-first responsive screens for all states: empty/loading/error/offline, validation, permission denied, expired and cancelled. Accessible design tokens, components, forms, typography, focus management, keyboard and screen reader behavior. Translate real interface strings for fr/en/de with fallback strategy.
**Deliver:** Screen inventory, clickable prototype or coded component gallery, content style guide, accessibility checklist.
**Gate:** Usability walkthroughs for three core personas; WCAG 2.2 AA target for applicable screens; no dead-end flows.

## Phase 3 — Repository, environments and delivery pipeline
**Build:** Monorepo structure, package management, lint/format/typecheck, commit hooks, unit/integration/e2e harness, CI, environment schemas, host-service development setup, Nginx and systemd deployment templates, staging/prod config, dependency scanning, SBOM, migrations and seed fixtures. Document local bootstrap and deployment rollback.
**Deliver:** Reproducible setup, CI workflows, sample env file without secrets, ADRs, health endpoints.
**Gate:** Clean clone boots with documented commands; CI green; secrets never committed.

## Phase 4 — Data model and authorization foundation
**Build:** Model users, profiles, languages, location (coarse public), categories, requests, assistance modes, offers, assignments, conversations/messages, attachments, notifications, reports, moderation actions, verification records, audit events, consents, deletion jobs. Use foreign keys, uniqueness, indexes, optimistic locking/versioning and retention policies. Enforce role- and resource-level authorization in API/services, not only UI.
**Deliver:** Versioned migrations, ERD, policy matrix, repository tests, seed data.
**Gate:** Tenant/user isolation and forbidden transitions tested; migration up/down/backup restore tested.

## Phase 5 — Authentication, profiles and privacy controls
**Build:** Email signup/login, verification, secure session renewal/revocation, password reset, optional passkeys only if low complexity, abuse throttling, profile languages/city, helper availability, account preferences, consent records, export and deletion requests. Display verification levels truthfully. Avoid exposing sensitive details in public profiles.
**Deliver:** Full auth and account UI/API, admin-safe account recovery runbook.
**Gate:** OWASP auth checks, session fixation/CSRF/XSS controls, privacy export/deletion integration tests.

## Phase 6 — Requests and geographic discovery
**Build:** Create/edit/pause/cancel/expire requests, categories, airport/station fields, coarse location and destination, date/time with time zone, number of adult travelers, assistance needs, language, free/paid/flexible choice, proposed compensation and expense handling, share-safe summary, image/file policy. Search by category, city/region, date, language, status, compensation mode. Prevent unsafe content and expired request responses.
**Deliver:** Feed, filters, request detail and posting wizard, scheduled expiry jobs.
**Gate:** All compensation modes and request states covered by API/e2e tests; public/private field redaction verified.

## Phase 7 — Offers, selection and lifecycle integrity
**Build:** Helpers submit/withdraw offers with availability and optional counterproposal. Requester can compare offers, select one, decline others and reopen if selection falls through. Both sides explicitly confirm agreed terms and travel plan. Implement transactional state machine OPEN→OFFERED→SELECTED→CONFIRMED→IN_PROGRESS→COMPLETED, plus CANCELLED/EXPIRED/DISPUTED with guarded transitions. Use idempotency keys and concurrency controls to prevent double assignment.
**Deliver:** Offer inbox, request management, state-transition audit trail.
**Gate:** Concurrent selection tests, cancellation rules and edge cases pass.

## Phase 8 — Private messaging and coordination
**Build:** Private request-scoped conversations between authorized parties; no public phone exposure; message delivery/read state, timestamps, reporting/blocking, abuse filters and retention. Protect attachments with signed short-lived URLs, size/type scanning and access checks. Add clear handover instructions and a private meeting-point field only after confirmation. Avoid exposing precise location to unselected helpers.
**Deliver:** Responsive inbox, message API, attachment pipeline, moderation access controls.
**Gate:** Unauthorized access and IDOR tests pass; attachment malware/type/size policy tested.

## Phase 9 — Notifications and WhatsApp distribution
**Build:** In-app notification center, transactional email for key events, opt-in web push with browser support detection and graceful fallback, digest/rate limits, notification preferences, retry queues and dead-letter handling. Native WhatsApp share intent and copyable share links with safe Open Graph previews; no WhatsApp API integration or automated group messaging.
**Deliver:** Templates in three locales, notification queue dashboard, unsubscribe controls.
**Gate:** No sensitive personal details in push/email previews; delivery retries and opt-outs tested.

## Phase 10 — Trust, safety and verification operations
**Build:** Clear community rules, restricted categories, age eligibility, verification workflows, report/block tools, no-show and emergency guidance, post-incident handling, repeat-offender controls, risk flags for new accounts, optional manual ID verification through an approved secure process (never store ID documents casually). Traveler consent and safe public handoff/check-in procedures. Define who is responsible for insurance, expenses, compensation, and permitted assistance. Do not imply insured/verified without evidence.
**Deliver:** Trust center, safety playbooks, helper review workflow, incident escalation matrix.
**Gate:** Safety scenario tabletop test; legal review of paid help/transport boundaries and privacy terms before public launch.

## Phase 11 — Admin and community moderation
**Build:** RBAC admin console, user/request/report search, moderation queue, warning/suspension/ban, appeals, audit logs, category and localized content configuration, verification approvals, limited analytics. Enforce dual-control or reauthentication for high-risk actions; admin impersonation prohibited or tightly audited.
**Deliver:** Admin console, moderator handbook, action reason codes and audit exports.
**Gate:** Moderator cannot access unrelated sensitive data; all privileged actions logged and tested.

## Phase 12 — PWA quality, internationalization and accessibility
**Build:** Manifest, installability, icons, service worker with safe offline shell and drafts, update strategy, caching exclusions for private content, graceful connectivity recovery, fr/en/de full translation, locale-aware dates/currency/time zones, accessible forms and contrast, performance budgets, mobile data usage optimizations, SEO for safe public pages, social preview metadata.
**Deliver:** Lighthouse and accessibility reports, device/browser matrix, offline test plan.
**Gate:** No sensitive data cached in shared/public caches; real-device Android/iOS browser checks; documented push limitations.

## Phase 13 — Security, privacy, compliance and resilience
**Build:** Threat model; OWASP ASVS-aligned controls; rate limiting, spam protection, CSP, secure cookies, CSRF, SSRF protections, dependency audit, secure uploads, database encryption/transport, secret rotation, GDPR data mapping, lawful basis and retention schedule, consent/rights workflows, processor agreements, cookie choices if nonessential tracking is used. Germany-specific legal review for platform terms, Impressum, consumer rules, intermediary liability and passenger transport. Backups, restoration drills, observability, incident response, uptime alerts, abuse load testing.
**Deliver:** Security test report, DPIA screening, data inventory, privacy notice/terms drafts for legal review, incident runbooks, restore evidence.
**Gate:** No unresolved critical/high security findings; legal and privacy blockers resolved before launch.

## Phase 14 — Staging, beta operations and launch readiness
**Build:** Production-like staging with anonymized/seeded data, full e2e tests, manual QA, accessibility audit, load tests, chaos/failure cases, email/push tests, migration rehearsal, rollback, support process, moderator staffing, verified helper onboarding, feature flags, monitoring and alerting. Pilot with invited adult users across selected German cities; collect real completion and safety metrics. Fix blockers before launch.
**Deliver:** Release candidate, launch checklist, support FAQ, moderation coverage schedule, release notes, test evidence.
**Gate:** No P0/P1 bugs; critical journeys pass on supported devices; backup restore and rollback proven; safety and legal approvals documented.

## Phase 15 — Production deployment, verification and handover
**Build:** Deploy to EU VPS with TLS, domain/DNS, hardened reverse proxy, least-privilege containers, managed secrets, database migrations, scheduled jobs, offsite encrypted backups, retention, alerts and error tracking. Run smoke tests against production with non-sensitive test users; verify signup, post, offer, select, chat, notifications, report, completion and account deletion. Publish community rules, privacy notice, terms, Impressum and contact/support details. Document ownership, maintenance, upgrades, on-call and post-launch monitoring.
**Deliver:** Live platform, deployment/rollback and disaster recovery runbooks, architecture and API docs, operator/admin manual, final acceptance report, prioritized post-launch backlog.
**Gate:** Production readiness checklist signed off by human owner; no false claim of launch until domain, credentials, legal review, verification and monitoring are confirmed.

## Cross-phase engineering requirements
- Test pyramid: unit, integration, contract, e2e; CI gates on typecheck, lint, migrations, tests and dependency scans.
- Security: deny by default; validate all inputs; enforce server-side authorization; audit privileged changes; redact logs; use idempotent jobs.
- Operational: health/readiness checks, structured logs with correlation IDs, metrics, alerts, backups and restore drills; queue retries and dead-letter handling.
- Data protection: data minimization, private-by-default, encryption in transit, least privilege, user export/deletion, explicit retention and data processor inventory.
- Quality: WCAG 2.2 AA target, FR/EN/DE, responsive mobile-first, graceful slow/offline network handling, browser matrix and performance budgets.
- Documentation: maintain `docs/decisions`, API schema, environment inventory, deployment and support playbooks, change log, test matrix.

## Agent execution contract
1. Begin each phase by inspecting repository state and the previous phase report. Do not overwrite existing work or assume a greenfield repository without checking.
2. Produce a short implementation plan, identify dependencies, and make only phase-scoped changes.
3. Implement production-grade code, migrations, tests, docs and operational hooks together; never mark TODOs as complete.
4. Run checks and record exact commands, outcomes and unresolved risks. Distinguish verified facts from assumptions.
5. Stop at blockers, legal ambiguity, missing credentials, unsafe assumptions or failing tests; ask for a decision instead of inventing one.
6. Finish each phase with: files changed; features delivered; tests passed/failed; security/privacy considerations; manual steps; deployment impact; acceptance criteria status; next-phase prerequisites.
7. Never deploy, purchase services, charge users, contact users or publish personal data without explicit authorization.
8. Never claim the product is complete based only on a successful build. Completion requires phase 15 operational acceptance.

## Launch definition of done
A real adult requester can register, publish a safe community-help request with the chosen compensation mode, share it via WhatsApp, receive offers, select and coordinate with a helper privately, confirm and complete the assistance, report problems and manage their data. Moderators can act on reports; notifications work; the service is localized, accessible, secured, monitored, backed up, legally reviewed and recoverable.
