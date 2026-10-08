import 'dotenv/config';
import { Pool } from 'pg';
import { parseApiEnv } from '@community/config/env';
import { buildApi } from './app.js';

async function main(): Promise<void> {
  const env = parseApiEnv();
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    connectionTimeoutMillis: 3_000,
    idleTimeoutMillis: 30_000,
    keepAlive: true,
  });
  const app = buildApi(env, {
    databaseProbe: async () => {
      await pool.query('SELECT 1');
    },
  });

  const shutdown = async () => {
    await app.close();
    await pool.end();
  };
  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());

  try {
    await app.listen({ host: env.API_HOST, port: env.API_PORT });
  } catch (error) {
    await pool.end();
    app.log.error({ err: error }, 'API failed to start');
    process.exitCode = 1;
  }
}

void main();
