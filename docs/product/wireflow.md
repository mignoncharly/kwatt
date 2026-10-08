# Wireflow map

This is a requirements-level map for Phase 1. Phase 2 will add screen-level wireframes and loading, empty, error, offline, validation, denied, expired, and cancelled states.

## Request and helper journey

```mermaid
flowchart TD
    A[Public discovery] --> B[Safe request list]
    B --> C[Safe request detail]
    C --> D[Copy link or WhatsApp share intent]
    C --> E{Signed in?}
    E -- No --> F[Adult eligibility attestation]
    F --> G[Email signup and verification]
    E -- Yes --> H[Create request]
    G --> H
    H --> I{Requester or traveler?}
    I -- Self --> J[Enter request details]
    I -- Another adult --> K[Attest adult traveler permission]
    K --> J
    J --> L[Choose category and assistance mode]
    L --> M{Category is Other?}
    M -- Yes --> N[Pending moderator review]
    N --> O{Approved?}
    O -- No --> P[Private decision and edit or close]
    O -- Yes --> Q[Safe public request]
    M -- No --> Q
    Q --> R[Eligible helper sends offer]
    R --> S[Requester compares offers]
    S --> T[Select one helper]
    T --> U[Both parties confirm terms and travel plan]
    U --> V{Both confirmed?}
    V -- No --> S
    V -- Yes --> W[Private request conversation]
    W --> X[Share precise meeting details by choice]
    X --> Y[In progress]
    Y --> Z{Outcome}
    Z -- Completed --> AA[Both parties confirm completion]
    Z -- Cancelled --> AB[Record cancellation]
    Z -- Problem --> AC[Dispute and report path]
    AC --> AD[Moderator review and audit]
    C --> AE[Report or block]
    AE --> AD
```

## Account and moderation journeys

```mermaid
flowchart LR
    A[Account settings] --> B[Request data export]
    A --> C[Request account deletion]
    B --> D[Identity and request status]
    C --> E[Retention and deletion workflow]
    E --> F[Confirm completion or explain lawful retention]
    G[Moderator queue] --> H[Review assigned content only]
    H --> I[Record reason and action]
    I --> J[Audit event]
    J --> K[Notify affected user safely]
```

## Privacy boundary

Public pages and share previews use only allowlisted fields: category, coarse city/region, broad date, assistance mode, language, and moderated summary. They omit exact address, phone number, precise itinerary, booking code, identity document, private meeting point, and messages. Phases 6, 8, and 9 must test the actual API and metadata outputs against this boundary.
