import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { Script } from "node:vm";

const read = (path) => fs.readFileSync(path, "utf8");
const files = [
  "docs/ux/screen-inventory.md",
  "docs/ux/design-system.md",
  "docs/ux/content-style-guide.md",
  "docs/ux/accessibility-checklist.md",
  "docs/ux/persona-walkthroughs.md",
  "docs/ux/prototype/index.html",
  "docs/ux/prototype/styles.css",
  "docs/ux/prototype/prototype.js",
  "docs/ux/prototype/messages-en.js",
  "docs/ux/prototype/messages-fr.js",
  "docs/ux/prototype/messages-de.js",
  "docs/ux/prototype/README.md"
];
for (const file of files) assert.ok(fs.existsSync(file), "missing deliverable: " + file);

const html = read("docs/ux/prototype/index.html");
const css = read("docs/ux/prototype/styles.css");
const js = read("docs/ux/prototype/prototype.js");
const inventory = read("docs/ux/screen-inventory.md");
const personas = read("docs/ux/persona-walkthroughs.md");
const a11y = read("docs/ux/accessibility-checklist.md");
new Script(js, { filename: "prototype.js" });

const locales = {};
for (const lang of ["en", "fr", "de"]) {
  const context = { window: {} };
  new Script(read("docs/ux/prototype/messages-" + lang + ".js")).runInNewContext(context);
  locales[lang] = context.window.PROTOTYPE_MESSAGES[lang];
  assert.ok(locales[lang] && Object.keys(locales[lang]).length > 0, lang + " dictionary loaded");
}
const enKeys = Object.keys(locales.en).sort();
for (const lang of ["fr", "de"]) {
  assert.deepEqual(Object.keys(locales[lang]).sort(), enKeys, lang + " dictionary has complete key parity");
}
const uiKeys = [...html.matchAll(/data-i18n=["']([^"']+)["']/g)].map((match) => match[1]);
for (const key of new Set(uiKeys)) {
  for (const lang of ["en", "fr", "de"]) {
    assert.ok(locales[lang][key], "missing " + lang + " translation for " + key);
  }
}
const dynamicKeys = [...js.matchAll(/\bt\(["']([^"']+)["']\)/g)].map((match) => match[1]);
for (const key of new Set(dynamicKeys)) {
  for (const lang of ["en", "fr", "de"]) assert.ok(locales[lang][key], "missing dynamic " + lang + " translation for " + key);
}
assert.match(js, /messages\.en\s*&&\s*messages\.en\[key\]/, "English fallback exists");
assert.match(js, /\|\| key/, "missing-key fallback is visible");

const screenTags = [...html.matchAll(/<section\b[^>]*data-screen[^>]*>/g)];
assert.equal(screenTags.length, 22, "clickable gallery includes the 21 workflow/state screens plus the state gallery");
const screenIds = new Set();
for (const match of screenTags) {
  const tag = match[0];
  const id = tag.match(/\bid=["']([^"']+)["']/)?.[1];
  assert.ok(id && id.startsWith("screen-"), "every screen has a screen ID");
  assert.ok(!screenIds.has(id), "screen IDs are unique: " + id);
  screenIds.add(id);
  const end = html.indexOf("</section>", match.index);
  assert.ok(end > match.index, id + " closes");
  const block = html.slice(match.index, end + "</section>".length);
  assert.match(block, /<h1\b[^>]*tabindex=["']-1["'][^>]*>/, id + " has a focusable page heading");
  assert.match(tag, /aria-labelledby=/, id + " has a named section");
  assert.ok(/data-go=["']/.test(block), id + " has a navigation route out");
}
for (const match of html.matchAll(/data-go=["']([^"']+)["']/g)) {
  assert.ok(screenIds.has("screen-" + match[1]), "navigation target exists: " + match[1]);
}
for (const match of html.matchAll(/data-demo=["']([^"']+)["']/g)) {
  assert.ok(["requester", "helper", "moderator"].includes(match[1]), "persona path is supported");
}
for (const id of ["loadingTitle", "emptyTitle", "errorTitle", "offlineTitle", "validationTitle", "deniedTitle", "expiredTitle", "disputedTitle", "cancelledTitle"]) {
  assert.ok(html.includes('data-i18n="' + id + '"'), "state gallery includes " + id);
}
assert.equal((inventory.match(/^\| UX-\d{2} \|/gm) || []).length, 18, "inventory accounts for all 18 screen families");
assert.match(personas, /Requester[\s\S]*Helper[\s\S]*Moderator/, "three persona walkthroughs are documented");
assert.match(personas, /no dead ends/i, "walkthroughs record the dead-end check");
assert.match(personas, /actual audit logging is outside this prototype/i, "moderation preview does not claim a real audit");
assert.match(personas, /not sessions with recruited community members/i, "walkthrough limits are explicit");
assert.match(a11y, /WCAG 2\.2 AA/, "accessibility target is explicit");

const controls = [...html.matchAll(/<(input|select|textarea)\b[^>]*\bid=["']([^"']+)["'][^>]*>/gi)];
for (const match of controls) {
  const id = match[2];
  const hasFor = new RegExp("<label\\b[^>]*\\bfor=[\"']" + id + "[\"']").test(html);
  const controlIndex = match.index;
  const openLabel = html.lastIndexOf("<label", controlIndex);
  const closeLabel = html.lastIndexOf("</label>", controlIndex);
  const wrapped = openLabel > closeLabel && html.indexOf("</label>", openLabel) > controlIndex;
  assert.ok(hasFor || wrapped, "form control has a programmatic label: " + id);
}
assert.match(html, /id="account-email"[^>]*aria-describedby="signup-error"/, "signup error is associated with the email control");
assert.match(js, /heading\.focus\(\{ preventScroll: true \}\)/, "screen navigation moves focus to its heading");
assert.match(js, /language === "en"[\s\S]*date === "weekday"/, "localized filters compare stable option values");
assert.match(js, /amount.value \+ " EUR"/, "compensation preview includes the proposed amount");
assert.match(js, /showScreen\("dispute-sent"\)/, "dispute form reaches a confirmation screen");
assert.match(js, /setInvalidState\(field, error/, "validation errors are associated with controls");
assert.match(css, /:focus-visible/, "keyboard focus is visible");
assert.match(css, /prefers-reduced-motion:\s*reduce/, "reduced motion is supported");
assert.match(css, /forced-colors:\s*active/, "forced-colors mode is supported");
assert.match(css, /@media \(max-width: 640px\)/, "phone layout breakpoint exists");
assert.match(css, /min-height:\s*44px/, "interactive targets include 44px minimum height");
assert.match(html, /<meta name="viewport"/, "viewport is configured");
assert.match(html, /data-i18n="prototypeOnly"/, "prototype limitations are shown");
assert.match(html, /value="weekday" data-i18n="weekdayMornings"/, "date filter has locale-independent values");
assert.match(html, /id="dispute-form"/, "dispute journey has a dedicated form");

const colors = Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map((match) => [match[1], match[2]]));
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255).map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
const textPairs = [
  ["ink", "canvas"], ["ink", "surface"], ["muted", "canvas"], ["muted", "surface"],
  ["brand", "surface"], ["brand-dark", "surface"], ["focus", "surface"], ["danger", "surface"],
  ["warning", "surface"], ["brand-dark", "soft-green"]
];
for (const [foreground, background] of textPairs) {
  assert.ok(contrast(colors[foreground], colors[background]) >= 4.5, "text contrast " + foreground + " on " + background);
}
assert.ok(contrast(colors.border, colors.surface) >= 3, "control border contrast");
assert.ok(contrast(colors.focus, colors.canvas) >= 3, "focus indicator contrast");
assert.ok(contrast(colors.warning, "#FFF8EC") >= 4.5, "warning notice text contrast");

assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|sendBeacon|innerHTML|insertAdjacentHTML|eval\s*\(/, "prototype performs no network or persistent storage operations");
assert.doesNotMatch(html, /https?:\/\//, "prototype loads no remote resources");
assert.match(html, /aria-live="polite"/, "async status region exists");
assert.match(html, /No real request|no real request/, "prototype disclosure is present");

console.log("Phase 2 UX checks passed: deliverables, 18-screen inventory, 22-screen route structure, locale coverage, flow targets, form labels, accessibility hooks, WCAG contrast pairs, and local-only behavior.");
