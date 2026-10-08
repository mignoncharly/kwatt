import 'dotenv/config';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { parseWebEnv } from '@community/config/env';

const command = process.argv[2];
if (command !== 'dev' && command !== 'start') {
  throw new Error('Expected the web command to be dev or start.');
}

const env = parseWebEnv();
const require = createRequire(import.meta.url);
const nextCli = require.resolve('next/dist/bin/next');
const child = spawn(
  process.execPath,
  [nextCli, command, '--hostname', env.WEB_HOST, '--port', String(env.WEB_PORT)],
  { stdio: 'inherit', env: process.env, windowsHide: true },
);

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => child.kill(signal));
}
child.once('error', (error) => {
  console.error('Unable to start the Next.js process.', error);
  process.exitCode = 1;
});
child.once('exit', (code) => {
  process.exitCode = code ?? 1;
});
