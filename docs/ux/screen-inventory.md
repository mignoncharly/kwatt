# Screen inventory and information architecture

**Phase:** 2 — UX research, information architecture, and design system  
**Audience:** Adult requesters, travelers, helpers, moderators, administrators  
**Primary layout:** Mobile-first responsive web app; public discovery works without an account

## Navigation model

Public navigation provides Browse, How it works, Community rules, Sign in, and locale selection. Signed-in members add My requests, Offers, Messages, Notifications, and Account. Moderators receive a separate protected Moderation queue. Admin configuration is separately permissioned and is not exposed in public navigation.

A user can return to the previous step or a stable parent screen from every multi-step flow. Confirmation and destructive actions provide a clear cancel path. The local prototype includes a design-only flow switch for reviewing requester, helper, and moderator journeys; this switch is not part of the product interface.

## Screen inventory

| ID | Screen | Persona/access | Main task | Required states and recovery |
|---|---|---|---|---|
| UX-01 | Public discovery | Everyone | Browse and filter safe summaries; start request | Loading, empty results with filter reset, connection error, offline, localized content |
| UX-02 | Public request detail | Everyone | Review coarse location/date/mode; share safe link; offer help | Expired/cancelled, not found, share unavailable with copy-link fallback |
| UX-03 | Sign up/sign in | Adult | Verify email and attest age eligibility | Validation, verification pending, resend rate limit, network error, under-18 denial |
| UX-04 | Profile and preferences | Signed-in member | Set display name, language, city/region, availability, notification preferences | Empty profile, validation, permission denied, save error, offline |
| UX-05 | Request wizard | Requester | Choose self/adult traveler, category, location, broad date, language, needs, and mode | Required-field validation, conditional permission attestation, “Other” pending state, unsupported-request denial |
| UX-06 | Safe request preview | Requester | Check public summary and private fields before publication | Validation errors, privacy reminders, edit, cancel, publish confirmation |
| UX-07 | Request management | Requester | Pause, edit, cancel, review status and offers | Empty, loading, expired, cancelled, permission denied, stale update |
| UX-08 | Offer composer | Helper | Send availability and optional terms proposal | Validation, duplicate offer, request expired/closed, network retry |
| UX-09 | Offer comparison | Requester | Compare eligible offers and select one | Empty offers, withdraw/decline, stale offer, concurrent selection conflict |
| UX-10 | Agreement confirmation | Requester and selected helper | Confirm the same terms and plan | Waiting for other party, changed terms requiring reconfirmation, expired/cancelled |
| UX-11 | Private conversation | Confirmed participants | Coordinate privately; share meeting detail by choice | Empty conversation, sending/error, offline, unauthorized, blocked, attachment scanning |
| UX-12 | Outcome | Requester and helper | Confirm completion, cancel, or dispute | Completion pending other party, cancellation reason, disputed, stale transition |
| UX-13 | Report/block | Signed-in member | Submit a private report or block a member | Validation, duplicate report, confirmation, network error |
| UX-14 | Notifications | Signed-in member | Read events and adjust channel preferences | Empty, offline, opt-in denied, delivery failure, unsubscribe |
| UX-15 | Account data rights | Signed-in member | Export data or request deletion | Identity recheck, processing, completion, retention exception, cancellation before processing |
| UX-16 | Moderator queue | Moderator | Review “Other” requests and reports | Empty queue, loading, stale item, permission denied, service error |
| UX-17 | Moderation decision | Moderator | Approve/reject, warn/suspend, record reason, appeal path | Required reason, reauthentication, concurrent moderation update, audit confirmation |
| UX-18 | Admin configuration | Administrator | Manage categories, localized content, roles, and audit export | Reauthentication, permission denied, validation, audit confirmation |

## Global state treatment

| State | User feedback | Recovery |
|---|---|---|
| Loading | Keep page structure and announce progress without moving focus unexpectedly | Preserve entered values; allow cancel where safe |
| Empty | Explain why there is no content and show one relevant next action | Clear filters, browse, or start a request |
| Error | Plain-language cause when known; never expose stack traces or private data | Retry safely; preserve form values; provide support route |
| Offline | Persistent text status and disabled network action labels | Keep only permitted non-sensitive drafts and retry explicitly |
| Validation | Inline message tied to the control with an accessible description; summary for long forms | Focus first invalid field; never rely on color alone |
| Permission denied | State that access is unavailable without confirming whether another person's resource exists | Return to a permitted parent page |
| Expired | Show that the request or offer is no longer actionable | Browse current requests or contact support through an approved route |
| Cancelled | Explain who cancelled only if policy permits and show resulting next step | Return to request list; do not offer invalid transitions |

## Information architecture constraints

- Public discovery and social previews expose only allowlisted summaries.
- Exact addresses, phone numbers, booking codes, precise itinerary, documents, and private meeting points appear only in authorized private flows after mutual confirmation.
- “Other” content stays out of public discovery until a moderator approves it.
- Account, messaging, and moderation screens require server-side authorization even when hidden in navigation.
- Offline mode never caches private request, account, message, or attachment content.
