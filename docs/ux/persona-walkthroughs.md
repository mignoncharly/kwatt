# Phase 2 persona walkthroughs

**Method:** Internal scenario-based design walkthroughs against the coded prototype and screen inventory. These are not sessions with recruited community members and do not establish measured usability. No users were contacted.

## Requester: adult traveler arranging station help

**Task:** Browse a safe request, create a request for themself, preview public/private details, compare offers, select one helper, confirm terms, coordinate privately, and record completion.

**Path reviewed:** Discovery → request detail → account/eligibility → request wizard → safe preview → request/offer list → offer comparison → agreement → private conversation → outcome or dispute.

**Findings:** The user can browse before registration. Adult eligibility is requested before account creation. The preview shows the public summary separately from private fields. The agreement requires a requester confirmation and a separate helper confirmation. The chat follows mutual confirmation. The outcome screen offers report and dispute routes, plus a return to browsing.

**Adjustment made:** Added a persistent prototype-only notice and a safe-summary panel before publication so the sample cannot be mistaken for a real request or private fields.

**Dead ends:** None in the reviewed path; each screen has a back or parent action. Unsupported “Other” requests have a pending/review route instead of a publish dead end.

## Helper: adult volunteer offering airport/station accompaniment

**Task:** Find a request, inspect its safe summary and assistance mode, submit availability and an optional counterproposal, and understand what happens after selection.

**Path reviewed:** Discovery → request detail → offer composer → offer submitted → requester selection/agreement → confirmed private conversation.

**Findings:** The public detail does not reveal precise itinerary or contact data. Offer composition can be cancelled or returned to the request. The requester controls selection; the helper does not see private conversation details before selection and mutual confirmation.

**Adjustment made:** The UI labels email verification exactly and describes compensation as a proposal agreed directly, with no platform payment processing.

**Dead ends:** None; the offer composer includes a path back to the request summary, with a route from there to discovery.

## Moderator: reviewing an “Other” request and a safety report

**Task:** Open the moderation queue, review a pending request/report, record a reason, approve or reject content, and see a clear local decision confirmation.

**Path reviewed:** Moderator view → queue → item review → reasoned local decision confirmation.

**Findings:** “Other” stays out of public discovery until approved. The moderator screen displays only the content needed for the decision and does not expose conversation history. Each action requires a reason and offers a clear return to the queue; actual audit logging is outside this prototype.

**Adjustment made:** Made the moderator experience a separate protected screen in the inventory and labeled its prototype entry as design-only.

**Dead ends:** None; every decision screen offers a return to the queue, which includes an empty state.

## Gate interpretation and remaining research

The three persona flows have completed an internal task walkthrough and have no dead ends in the prototype navigation check. This phase used internal scripted walkthroughs and did not recruit or contact participants. Moderated sessions with adult community members, including assistive-technology users, remain useful before beta and must not be represented as already completed.
