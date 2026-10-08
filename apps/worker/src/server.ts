import 'dotenv/config';
import { Redis } from 'ioredis';
import { parseWorkerEnv } from '@community/config/env';
import { buildWorkerHealth } from './app.js';

async function main(): Promise<void> {
  const env = parseWorkerEnv();
  const redis = new Redis(env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });
  const app = buildWorkerHealth(env, async () => {
    if (redis.status === 'wait') await redis.connect();
    await redis.ping();
  });

  const shutdown = async () => {
    await app.close();
    if (redis.status !== 'end') await redis.quit();
  };
  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());

  try {
    await app.listen({ host: env.WORKER_HEALTH_HOST, port: env.WORKER_HEALTH_PORT });
  } catch (error) {
    if (redis.status !== 'end') await redis.quit();
    app.log.error({ err: error }, 'Worker health process failed to start');
    process.exitCode = 1;
  }
}

void main();
