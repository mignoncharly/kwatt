# Design system baseline

**Status:** Phase 2 design baseline for implementation review. Tokens are proposals until coded product screens pass browser, accessibility, and device checks.

## Visual direction

Use a calm, community-centered visual language with clear hierarchy, generous whitespace, and restrained color. Avoid government-service coldness and avoid playful styling that could make safety or compensation terms seem casual. Use text and shape alongside color for all statuses.

## Color tokens

| Token | Value | Use |
|---|---|---|
| Canvas | #F5F7F4 | Page background |
| Surface | #FFFFFF | Main content surface |
| Ink | #18312D | Primary text |
| Muted ink | #4D625D | Supporting text |
| Brand | #165B52 | Primary actions and active navigation |
| Focus | #006B62 | Visible keyboard focus |
| Border | #71827C | Control and panel boundaries |
| Error | #9A2828 | Error text and destructive status |
| Warning | #784600 | Safety and pending status |
| Soft green | #E8F3EE | Subtle success or informational background |

Contrast pairs that carry text or control boundaries are checked by the Phase 2 documentation test. Production implementation must recheck colors after design changes and in all themes.

## Typography and spacing

- Use the platform system sans-serif stack; no remote font dependency.
- Body text starts at 16 CSS px with line-height of at least 1.5. Secondary annotations remain comfortably readable and never carry essential instructions alone.
- Use a clear heading hierarchy, one H1 per screen, sentence case, and short labels.
- Base spacing uses a 4 px unit with 8/12/16/24/32 px rhythm. Keep form controls at least 44 px high and leave adequate separation between independent actions.
- Content width is about 68 rem on desktop; forms and reading text use narrower measures. Single-column content stacks on small screens.

## Components and behavior

| Component | Design rule |
|---|---|
| Button | Native button or link; one primary action per group; descriptive label; 44 px minimum target; visible focus |
| Text field | Persistent visible label, optional hint, inline error connected by an accessible description; never use placeholder as the only label |
| Select/radio | Native controls with fieldset/legend for related choices; all options have visible text |
| Request card | City/region, broad date, category, mode, short summary; no phone, exact address, booking, or itinerary |
| Status | Text label plus optional color/icon; use exact verification level such as “Email verified” |
| Alert | Routine updates use a status live region, blocking errors use an alert live region; concise and actionable |
| Dialog/confirmation | Native dialog or page-level confirmation; explain consequence, focus first action, provide cancel |
| Stepper | Text labels and current step announced; allow back without losing safe draft values |
| Navigation | Semantic landmarks; current page identified; hidden destinations do not grant permissions |
| Empty/error panel | State the condition and a single useful recovery action |

## Motion and responsive behavior

Use no motion for essential meaning. Keep transitions short and optional; honor reduced-motion preference. At narrow widths, stack forms and cards, keep primary actions visible, avoid horizontal page scrolling, and preserve readable order. Do not require hover to reveal information.

## Design review gates

Before implementation acceptance, check each component at narrow and wide widths, keyboard and screen-reader operation, 200% zoom, high contrast/forced colors, long localized labels, validation and error states, and slow/offline recovery. Phase 12 performs broader real-device and PWA checks.
