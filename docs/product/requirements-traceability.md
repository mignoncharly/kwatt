# Requirements-to-test traceability

These written acceptance scenarios describe product behavior; they do not claim that application behavior already exists. Each requirement maps to at least one scenario. Later implementation phases should turn them into automated API/end-to-end tests where practical and retain manual accessibility and operational checks where automation cannot prove the outcome.

## Requirement matrix

| Requirement | Summary | Acceptance test IDs |
|---|---|---|
| REQ-001 | Adult account and traveler eligibility | AT-01, AT-03 |
| REQ-002 | Germany service and open community | AT-02 |
| REQ-003 | Categories and prohibited assistance | AT-04, AT-18 |
| REQ-004 | Request for self or permitted adult | AT-03 |
| REQ-005 | Assistance modes without platform payments | AT-05 |
| REQ-006 | Safe public discovery and sharing | AT-06 |
| REQ-007 | Offers, selection, concurrency, mutual confirmation | AT-07, AT-08 |
| REQ-008 | Private coordination and sensitive detail access | AT-09 |
| REQ-009 | Lifecycle, cancellation, expiry, dispute | AT-10 |
| REQ-010 | Reports, blocks, least-privilege moderation | AT-11 |
| REQ-011 | Accurate verification labels | AT-12 |
| REQ-012 | Export, deletion, and approved retention | AT-13 |
| REQ-013 | Localization and accessibility | AT-14 |
| REQ-014 | Offline and low-bandwidth behavior | AT-15 |
| REQ-015 | Notification privacy and opt-outs | AT-16 |
| REQ-016 | Authorization, security, and auditability | AT-17 |
| REQ-017 | Emergency and safeguarding boundary | AT-18 |

## Acceptance scenarios

### AT-01 — Adult eligibility
Given a person starts registration, when they attest that they are at least 18, registration may continue. If they cannot attest to being 18 or older, the service does not create an eligible account or accept a request. The initial flow does not request full date of birth.

### AT-02 — Germany service and open community
Given an adult of any nationality uses the service, when the requested assistance takes place in Germany, they can use the same discovery and request rules as any adult. If assistance would take place outside Germany, the request is rejected and no public listing is created.

### AT-03 — Request for another traveler
Given an eligible requester creates a request for another person, when they attest the traveler is an adult and has given permission, the request can proceed. A minor traveler or missing permission attestation prevents publication.

### AT-04 — Categories and prohibited assistance
Given a requester chooses a category, when content asks for childcare, medical/legal advice, money transfer, emergency response, vulnerable-person support, or private-car passenger transport, publication is blocked with an explanation. “Other” remains absent from discovery and share previews until moderator approval.

### AT-05 — Assistance modes and direct terms
Given a requester creates otherwise valid requests, when they choose volunteer/free, compensated with an EUR amount, or flexible, each mode is saved and presented accurately. Compensation is a direct proposed agreement; the platform never collects a payment, fee, deposit, or transfer.

### AT-06 — Safe public discovery and sharing
Given a request is public, when a visitor opens its detail page or share link, output contains only approved summary fields and omits exact address, phone, booking code, precise itinerary, identity document, private meeting point, and messages. Private-field values cannot leak into page metadata or social previews.

### AT-07 — Offers and one selection
Given an open request, when an eligible helper submits or withdraws an offer with availability and optional counterproposal, the requester can compare current offers. If two selection attempts race, at most one helper is selected and all outcomes leave a valid request state.

### AT-08 — Mutual confirmation
Given a helper is selected, when either party has not confirmed the proposed terms and plan, the request is not confirmed and private handoff details stay unavailable. When both confirm the same version, the request becomes confirmed exactly once.

### AT-09 — Private coordination
Given a confirmed request, when its requester/traveler or selected helper opens the conversation, they can access request-scoped messages. An unselected helper or unrelated account receives no message or attachment data. Precise meeting details are available only in the authorized private flow after confirmation.

### AT-10 — Lifecycle edge cases
Given a request in any lifecycle state, when a participant attempts an allowed cancellation, expiry, completion, or dispute transition, the state changes under documented rules and an audit event is recorded. Stale, duplicate, or forbidden transitions are rejected without overwriting newer state.

### AT-11 — Report, block, and moderator action
Given a member reports or blocks another, the report is private to authorized moderators and the block affects the reporting account. A moderator acts only within granted scope, supplies a reason, and creates an immutable audit record; ordinary moderators cannot retrieve unrelated private conversations.

### AT-12 — Truthful verification
Given an account has email verification only, its profile says email verified and does not imply phone or identity review. Unverified, phone-verified, and manually reviewed states are distinct and shown only after the corresponding check occurred.

### AT-13 — Data rights
Given an authenticated account holder requests export or deletion, the request has a visible status and is processed under the approved retention schedule. Data is deleted or de-identified where required; retained records have a documented basis, restricted access, and end date.

### AT-14 — Locale and accessibility
Given a user selects fr, en, or de, registration, request creation, offer selection, reporting, and data tasks expose critical controls and errors in that locale. Each core journey is keyboard-operable and screen-reader tested; errors identify fields and recovery without color alone.

### AT-15 — Low bandwidth and offline
Given connectivity is slow or unavailable, public text and draft editing remain usable with a clear connection state. Offline storage contains only permitted non-sensitive draft fields; private requests, messages, account data, and attachments are neither cached nor submitted until online.

### AT-16 — Notification privacy
Given notification preferences are configured, key events use only opted-in channels and unsubscribe/revocation takes effect. Email and push omit contact details, exact locations, booking codes, precise itinerary, and message bodies; retries do not create duplicate user-visible events.

### AT-17 — Authorization and security
Given an unauthenticated, unrelated, suspended, or insufficiently privileged actor calls an API, protected reads and writes are denied without confirming protected data exists. Inputs are validated, abuse limits applied, sensitive values redacted from logs, and privileged changes audited.

### AT-18 — Emergency and safeguarding boundary
Given a request describes immediate danger, a minor, or a vulnerable-person case, the service does not present community matching as emergency or safeguarding support. It gives approved safety guidance, prevents unsupported publication, and routes the case to a reviewed escalation process.
