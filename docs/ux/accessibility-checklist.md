# Accessibility checklist

**Target:** WCAG 2.2 AA for applicable screens. This is a design and prototype checklist, not a conformance certification.

## Interaction and semantics

- [x] Use semantic header, navigation, main, section, form, button, and link elements in the coded prototype.
- [x] Include a skip link and one screen-level heading per prototype screen.
- [x] Use native form controls with persistent labels, grouped radio options, required indicators, and connected instructions.
- [x] Provide visible keyboard focus and return focus to the screen heading after in-prototype navigation.
- [x] Announce routine status and validation feedback through live regions.
- [x] Keep all prototype paths operable without a pointer; do not require hover.
- [x] Use 44 px minimum control heights in the prototype.
- [x] Respect reduced-motion preference and allow browser zoom/reflow.
- [ ] Confirm every implemented production flow with keyboard-only and screen-reader testing.
- [ ] Confirm forced-colors/high-contrast behavior and 200% zoom in supported browsers.

## Visual and language

- [x] Contrast pairs for text, primary actions, focus, errors, and boundaries are measured by the local check.
- [x] Status meaning is conveyed with text, not color alone.
- [x] Interface copy is defined for fr/en/de and locale fallback is explicit.
- [x] Errors, offline, denied, expired, and cancelled states have recovery guidance in the screen inventory.
- [ ] Fluent human review of safety-critical fr/de translations before production.
- [ ] Test long translations, user text, and browser text scaling in the Phase 2 device walkthrough.

## Privacy and cognitive access

- [x] Public/share-safe detail is separated from private meeting and travel details.
- [x] No private content is cached or sent by this local prototype.
- [x] Compensation and verification wording avoids unsupported guarantees.
- [x] Form instructions explain permission and the adult-only policy before submission.
- [ ] Validate comprehension with adult community participants before public pilot.
