import { randomBytes } from 'node:crypto';
import { open, readFile } from 'node:fs/promises';

const target = new URL('../.env', import.meta.url);

try {
  await readFile(target, 'utf8');
  console.log('Existing .env found; left unchanged.');
  process.exit(0);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const password = randomBytes(32).toString('base64url');
const contents = `NODE_ENV=development
API_HOST=127.0.0.1
API_PORT=4000
WEB_HOST=127.0.0.1
WEB_PORT=3000
WORKER_HEALTH_HOST=127.0.0.1
WORKER_HEALTH_PORT=4010
POSTGRES_USER=community
POSTGRES_DB=community
POSTGRES_PASSWORD=${password}
DATABASE_URL=postgresql://community:${password}@127.0.0.1:5432/community?schema=public
REDIS_URL=redis://127.0.0.1:6379
API_BASE_URL=http://127.0.0.1:4000
`;

let handle;
try {
  handle = await open(target, 'wx', 0o600);
  await handle.writeFile(contents, 'utf8');
  console.log('Created .env with a random local-only database password.');
} catch (error) {
  if (error.code === 'EEXIST') console.log('Another process created .env; left it unchanged.');
  else throw error;
} finally {
  await handle?.close();
}
