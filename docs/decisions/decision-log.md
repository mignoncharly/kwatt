# Phase 1 decision log

“Deferred” means a later-phase decision or evidence dependency. It does not authorize a feature before its condition is met.

| ID | Status | Decision | Reason and follow-up |
|---|---|---|---|
| D-001 | Decided | Accounts and travelers must be 18+; use an eligibility attestation and avoid full birth-date collection | Adult-only initial safeguarding scope with data minimization |
| D-002 | Decided | Assistance occurs in Germany; nationality and ethnicity do not gate access | Bounded launch geography while welcoming all adults |
| D-003 | Decided | Four named categories plus “Other”; “Other” stays private until moderator approval | Resolves category scope and unsafe public listings |
| D-004 | Decided | Airport/station accompaniment may use walking or public transit; private-car passenger transport and carriage are excluded | Resolves accompaniment versus passenger-transport boundary |
| D-005 | Decided | Compensated requests show a proposed EUR amount; any agreement is direct; the platform never collects, holds, or transfers money | Supports the required mode while honoring payments-outside-platform |
| D-006 | Decided | Public launch of compensated help requires qualified German legal and safety review | Explicit future launch gate, not a claim of legal clearance |
| D-007 | Decided | A requester acting for another traveler attests that the traveler is an adult and gave permission; no minor cases | Resolves third-party posting under adult-only scope |
| D-008 | Decided | Public/share output uses an allowlist and coarse location/broad date; contact, exact address, booking, precise itinerary, documents, and private handoff stay private | Resolves public discovery against privacy rules |
| D-009 | Decided | Verification labels name only checks actually completed | Prevents false identity/trust claims |
| D-010 | Decided | Locale order is user choice, supported browser locale, then English fallback | Provides predictable fr/en/de behavior |
| D-011 | Decided | Baseline is pnpm workspaces, Next.js App Router, Fastify, PostgreSQL/Prisma, Redis/BullMQ, and Better Auth; see ADR-001 | Closes offered architecture alternatives |
| D-012 | Deferred | Select email and optional phone/push providers after region, processing terms, cost, abuse value, and budget review | No managed dependency is configured or budgeted |
| D-013 | Deferred | Select pilot cities, volume, and moderator staffing during beta planning | Requires demand and operational evidence |
| D-014 | Deferred | Approve retention periods, lawful bases, and deletion exceptions before launch with privacy/legal review | Depends on data mapping and Phase 13 review |
| D-015 | Deferred | Set numerical performance and availability targets after device matrix and workload assumptions | Avoids unsupported commitments |
| D-016 | Deferred | Enable manual identity-document review only after secure collection, trained operations, retention, and incident process approval | Optional capability; casual document storage is prohibited |

## Contradiction and risk review

D-001 through D-008 resolve the apparent conflicts: adult-only scope governs traveler flows; direct proposed compensation remains distinct from platform payment handling; station/airport accompaniment excludes passenger carriage; safe sharing uses an allowlist; and a Germany launch remains open to people of every nationality.

No contradictory product requirement remains open for Phase 1. Legal approval, provider selection, pilot staffing, retention policy, and numerical service targets remain later-phase gates and do not authorize public launch or expansion.
