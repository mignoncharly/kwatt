# Feature inventory

This is the first public-version scope. Phase 1 delivers requirements only; it does not deliver runnable product features.

## Included in V1

| Capability | Boundary | Planned phase |
|---|---|---|
| Adult accounts and profiles | Email verification, adult attestation, languages/city, helper availability, preferences, export/deletion | 5 |
| Categories and requests | Four named categories plus moderator-reviewed “Other”; self or permitted adult traveler | 6 |
| Assistance terms | Volunteer/free, compensated with proposed EUR amount, or flexible; no platform payments or fees | 6 |
| Discovery and sharing | Coarse location, broad date, language, category, status, mode; safe field allowlist | 6, 9 |
| Offers and selection | Availability, counterproposal, one selection, decline/reopen, mutual confirmation, concurrency protection, audit | 7 |
| Private coordination | Authorized request-scoped conversations, report/block, secure attachments after scanning controls | 8 |
| Notifications | In-app/email, opt-in web push, safe previews, preferences, retries, unsubscribe | 9 |
| Trust and moderation | Rules, report/block, risk flags, warnings/suspensions/bans, appeals, “Other” review, audit, handoff guidance | 10, 11 |
| Accessible multilingual PWA | Responsive installable web, complete fr/en/de, safe offline shell and non-sensitive drafts | 2, 12 |
| Operations and privacy | EU hosting, separated environments, security, backups, monitoring, data rights, legal review, runbooks | 3, 13–15 |

## Excluded from V1

- Platform-managed payments, escrow, wallet, subscriptions, fees, paid promotion, or money transfers.
- Native apps, social feed, AI matching, automated WhatsApp or group messaging.
- Employment placement, private-car passenger transport, carriage of people/goods, childcare, medical/legal advice, emergency response.
- Minor and vulnerable-person cases until a separate safeguarding policy is approved.
- Public phone numbers, exact addresses/meeting points, booking codes, identity documents, or precise itineraries.
- Any guarantee of identity, safety, insurance, suitability, compensation, or completion.

## Deferred and conditional

| Capability | Condition |
|---|---|
| Phone verification | Review cost, abuse benefit, privacy, accessibility, and provider before selection |
| Manual ID review | Approve secure collection, trained operations, access, and retention process |
| Compensated help | German legal and safety approval before public launch |
| Additional currencies/geographies | Product, legal, moderation, and support review |
| Attachments | Private storage, signed access, type/size checks, scanning, retention, authorization tests |
| Web push | Support detection, opt-in/revocation, safe payloads, and delivery operations |
| Precise meeting details | Authorized private flow only after both parties confirm |
| Offline drafts | Non-sensitive fields only, clear local-device disclosure and deletion |

## Phase boundary

Phase 1 establishes product requirements, decisions, test traceability, and wireflows. Phase 2 may design screens against this inventory. A capability is not implemented until its assigned phase passes its acceptance gate.
