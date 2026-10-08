import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set([
  '.git',
  'node_modules',
  '.next',
  'dist',
  'coverage',
  'test-results',
]);
const allowedEnvironmentTemplates = new Set([
  '.env.example',
  '.env.staging.example',
  '.env.production.example',
]);
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api[_-]?key|client[_-]?secret|password|access[_-]?token)\s*[:=]\s*["']?(?:[A-Za-z0-9+/=_-]{28,})\b/i,
  /\b(?:gh[pousr]_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{30,})\b/,
];

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);
const forbiddenTrackedEnv = tracked.filter((file) => {
  const base = path.basename(file);
  return base.startsWith('.env') && !allowedEnvironmentTemplates.has(base);
});
if (forbiddenTrackedEnv.length) {
  console.error(
    `Secret scan failed: environment files must not be committed: ${forbiddenTrackedEnv.join(', ')}`,
  );
  process.exitCode = 1;
}

const findings = [];
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    const relative = path.relative(root, fullPath);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) await visit(fullPath);
      continue;
    }
    if (!entry.isFile() || entry.name === '.env' || entry.name.startsWith('.env.local')) continue;
    if (allowedEnvironmentTemplates.has(entry.name)) continue;
    if (entry.name === 'pnpm-lock.yaml') continue;
    const content = await readFile(fullPath, 'utf8').catch(() => '');
    if (secretPatterns.some((pattern) => pattern.test(content))) findings.push(relative);
  }
}
await visit(root);

if (findings.length) {
  console.error(`Potential hard-coded secret material found in: ${findings.join(', ')}`);
  process.exitCode = 1;
} else if (!process.exitCode) {
  console.log(
    'Secret scan passed: no committed environment files or high-confidence secret patterns found.',
  );
}
