# Product requirements document

**Product:** Community assistance platform  
**Status:** Phase 1 baseline  
**Initial service area:** Germany  
**Locales:** French (fr), English (en), German (de)

## Product purpose

Help adults in Germany find and coordinate practical community assistance. The initial communities include Cameroonians in Germany, while access remains open regardless of nationality or background. The platform coordinates arrangements; it is not an employer, carrier, escrow service, emergency service, or guarantor of payment or identity.


## Outcomes and success measures

The first public service is a Germany-focused pilot. Pilot cities and launch timing require beta evidence. Measure request completion, time to first eligible offer, offer-to-confirmation rate, safety reports per 100 confirmed requests, moderator response time, data-rights completion, and accessibility task success. Establish baselines before setting numerical targets. Do not treat registrations or page views as proof of useful or safe outcomes. Analytics must minimize personal data and exclude precise location and message content.

## People and roles

Roles may overlap for an adult. A traveler may be the requester or another adult.

| Persona | Needs | Constraints |
|---|---|---|
| Requester | Describe a need, choose terms, compare offers, coordinate privately | Adult account holder; keeps sensitive itinerary/contact data private; responsible for truthful details and direct agreements |
| Traveler | Receive help arranged by themself or another adult | Must be an adult; requester attests to permission; no proof collected in v1 |
| Helper | Find requests, state availability, and agree terms | Adult account holder; decides whether they can help; no identity/background check is implied |
| Moderator | Review “Other” requests and reports, enforce rules | Least-privilege access; reason and audit record for actions |
| Administrator | Configure service, accounts, roles, and operations | Least privilege; reauthentication for high-risk actions; audited access; no impersonation |

## Eligibility, geography, categories, and conduct

- Accounts and travelers must be 18 or older. Use an adult eligibility attestation; do not collect full date of birth without a separately justified need.
- Assistance must take place in Germany. A traveler may arrive from or depart to another country, but the requested help occurs in Germany.
- Do not gate or rank by nationality, ethnicity, language, religion, gender, or migration status.
- Categories: airport/station accompaniment; newcomer orientation; everyday practical help; nonprofessional appointment accompaniment; “Other,” hidden until moderator approval.
- Airport/station help may include meeting, navigation, walking, and public-transit accompaniment. Private-car passenger transport and carriage of people or goods are excluded.
- Appointment accompaniment is nonprofessional; it does not include diagnosis, treatment, legal advice, representation, or guaranteed professional interpretation.
- Childcare, minor or vulnerable-person cases, emergency assistance, money transfers, and commercial private-car passenger transport are out of scope pending separately approved policies.
- Conduct rules prohibit harassment, threats, discrimination, coercion, fraud, impersonation, and requests for credentials or booking codes. Members must respect consent and the right to decline or end an arrangement.
- The service is not an emergency service. Immediate danger is escalated under a reviewed moderator playbook with appropriate local emergency guidance.

## Core journeys

1. An adult browses a safe public request and shares its safe summary.
2. An adult registers, verifies email, and posts for themself or, with permission, another adult.
3. The requester chooses volunteer/free, compensated, or flexible terms. Compensation is a proposed EUR amount, agreed directly; the platform never handles funds.
4. An adult helper offers availability and may counterpropose.
5. The requester selects one helper; both parties confirm the same terms and plan.
6. The selected parties coordinate privately and may share precise meeting details after confirmation.
7. Parties complete, cancel, or report a problem; either may block another member.
8. A moderator reviews “Other” content or reports and records a reasoned action.
9. An account holder requests export or deletion and sees the outcome.

Written acceptance scenarios are in [requirements-to-test traceability](requirements-traceability.md); the main paths are in the [wireflow map](wireflow.md).

## Functional requirements

- Adult registration/sign-in, verified email, profile language and city/region, helper availability, preferences, and truthful verification labels.
- Request creation and management for self or an adult traveler with permission; five categories and moderator review of “Other.”
- Volunteer/free, compensated with proposed EUR amount, or flexible terms. No charge, fee, escrow, wallet, or transfer.
- Discovery by category, coarse location, broad date, language, status, and assistance mode. Public and share output excludes exact address, phone, booking code, precise itinerary, identity documents, private meeting point, and messages.
- Offers, optional counterproposals, one selected helper, decline/reopen, mutual confirmation, guarded lifecycle, cancellation, expiry, dispute, and audit history.
- Request-scoped private messaging to authorized participants. Attachments only after secure access, scanning, type/size, and retention controls exist.
- In-app and transactional notifications; opt-in web push where supported; safe previews, preferences, retries, and unsubscribe.
- Moderation, reporting/blocking, account export/deletion, and limited privacy-conscious analytics.

## Non-goals and launch boundaries

No platform payments, wallet, subscriptions, fees, paid promotion, AI matching, social feed, native apps, WhatsApp API/group messaging, commercial job placement, passenger carriage, emergency response, childcare, medical/legal advice, money transfers, or guarantee of identity, safety, insurance, or completion.

Compensated help is a direct proposed agreement. Public launch requires qualified German legal and safety review of boundaries, disclosures, tax/consumer implications, and moderation guidance. This decision does not introduce platform payment handling.

## Accessibility and internationalization

- Target WCAG 2.2 AA. Core journeys must support keyboard-only use, screen readers, zoom, visible focus, sufficient contrast, labeled controls, plain language, and recoverable errors.
- Provide complete fr/en/de interface and operational strings. Explicit user choice wins, then supported browser locale, then en fallback. Do not leave safety-critical actions untranslated.
- Use locale-aware number/currency formats and explicit time zones.
- Keep discovery text-first for slow networks and avoid autoplay. Offline storage may contain only non-sensitive drafts; never cache private requests, conversations, attachments, or account data in shared caches.

## Non-functional requirements

| Area | Requirement |
|---|---|
| Privacy | Private by default; allowlisted public fields; no precise itinerary, exact address, phone, booking code, or identity document in public/share output |
| Authorization | Deny by default; enforce role and resource checks in API/services and test cross-user isolation |
| Security | Maintained auth/crypto; revocable secure sessions; validation, throttling, CSRF/origin protection, CSP, redacted logs, least privilege |
| Data protection | EU-region data and backups; data inventory, lawful-basis and retention review, processors, export/deletion before launch |
| Reliability | Health/readiness, correlated structured logs, idempotent jobs, retries/dead letters, encrypted backups, restore/rollback runbooks |
| Performance | Set mobile budgets in Phase 2/12 and report measurements and conditions before setting launch thresholds |
| Scale | Start with an invited regional pilot; assess demand and moderation capacity before expansion |
| Compatibility | Select current mobile/desktop browsers in Phase 2; responsive layouts and connectivity recovery |
| Operations | Separate environments, no committed secrets, audited privileged actions, synthetic/anonymized staging data |
| Maintainability | TypeScript monorepo, domain boundaries, migrations, API contracts, CI checks, and operator runbooks |

## Glossary

| Term | Meaning |
|---|---|
| Assistance mode | Volunteer/free, compensated, or flexible terms |
| Compensated | Proposed direct amount; the platform does not process it |
| Flexible | Volunteer preferred; compensation may be discussed directly |
| Safe summary | Allowlisted public/share content without direct contact or sensitive travel details |
| Requester / traveler / helper | Adult who creates a request / receives help / offers help |
| Confirmed request | Selected helper and both parties have confirmed the same terms and plan |
| Verification level | Factual record of a specific check, not a general safety endorsement |
| “Other” request | Request hidden from public discovery until moderator approval |
