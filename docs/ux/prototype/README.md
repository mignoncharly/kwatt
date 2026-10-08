# Clickable UX prototype

Open `index.html` in a current desktop or mobile browser. The prototype is static and has no build step, server, account, network request, or persistent storage. Sample content and form submissions remain in the current page only.

Use the language selector for English, French, and German. The walkthrough menu opens the requester, helper, and moderator routes. Screen changes move keyboard focus to the new page heading; Tab and Shift+Tab operate the controls.

This file is a design artifact. Verification, offers, messages, reports, moderation, export, and deletion are simulated and are not sent or saved. It is not a deployable product implementation.

Run the static Phase 2 checks from the workspace root:

```powershell
node --input-type=module -e "import('./tests/check_phase2_ux.mjs')"
```

The checks cover document presence, locale-key parity and coverage, route targets, control labels, accessibility hooks, selected color-contrast pairs, and the absence of network or persistent-storage calls. They do not replace browser, screen-reader, real-device, or user research sessions.
