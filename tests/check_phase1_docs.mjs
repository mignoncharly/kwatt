import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const product = path.join(root, 'docs', 'product');
const decisions = path.join(root, 'docs', 'decisions');
const read = (file) => readFile(file, 'utf8');

const requiredFiles = [
  path.join(product, 'PRD.md'),
  path.join(product, 'feature-inventory.md'),
  path.join(product, 'requirements-traceability.md'),
  path.join(product, 'wireflow.md'),
  path.join(decisions, 'decision-log.md'),
  path.join(decisions, 'ADR-001-architecture.md'),
  path.join(root, 'docs', 'phase-reports', 'phase-1.md')
];
for (const file of requiredFiles) await access(file);
console.log('PASS: all Phase 1 deliverables exist');

const prd = await read(path.join(product, 'PRD.md'));
for (const heading of [
  '# Product requirements document',
  '## Outcomes and success measures',
  '## People and roles',
  '## Eligibility, geography, categories, and conduct',
  '## Core journeys',
  '## Non-goals and launch boundaries',
  '## Accessibility and internationalization',
  '## Non-functional requirements',
  '## Glossary'
]) assert.ok(prd.includes(heading), `PRD is missing: ${heading}`);
console.log('PASS: PRD covers required topics');

const trace = await read(path.join(product, 'requirements-traceability.md'));
const scenarios = [...trace.matchAll(/^### (AT-\d{2}) —/gm)].map((match) => match[1]);
const references = [];
for (const line of trace.split(/\r?\n/)) {
  if (!line.startsWith('| REQ-')) continue;
  const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean);
  assert.equal(cells.length, 3, `Malformed requirement row: ${line}`);
  references.push(...cells[2].split(',').map((id) => id.trim()));
}
assert.ok(scenarios.length > 0, 'No acceptance scenarios are defined');
assert.equal(new Set(scenarios).size, scenarios.length, 'Scenario IDs must be unique');
assert.deepEqual([...new Set(references)].sort(), [...scenarios].sort(), 'Requirement mappings and scenarios must match');
console.log(`PASS: ${scenarios.length} acceptance scenarios map to all requirements`);

const wireflow = await read(path.join(product, 'wireflow.md'));
assert.ok((wireflow.match(/flowchart /g) ?? []).length >= 2, 'Expected request and account/moderation diagrams');
console.log('PASS: wireflow contains both journey diagrams');

const log = await read(path.join(decisions, 'decision-log.md'));
assert.ok(log.includes('| Decided |') && log.includes('| Deferred |'), 'Decision log needs decided and deferred records');
assert.ok(log.includes('No contradictory product requirement remains open'), 'Decision log must state conflict review outcome');
console.log('PASS: decision log records resolutions and deferred items');
