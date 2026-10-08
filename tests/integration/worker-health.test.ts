import { afterEach, describe, expect, it } from 'vitest';
import { parseWorkerEnv } from '../../packages/config/src/env.js';
import { buildWorkerHealth } from '../../apps/worker/src/app.js';

const env = parseWorkerEnv({ NODE_ENV: 'test', REDIS_URL: 'redis://127.0.0.1:56379' });

describe('worker health routes', () => {
  let close: (() => Promise<void>) | undefined;

  afterEach(async () => {
    await close?.();
    close = undefined;
  });

  it('keeps liveness independent of Redis', async () => {
    const app = buildWorkerHealth(env, async () => {
      throw new Error('redis down');
    });
    close = () => app.close();
    const response = await app.inject({ method: 'GET', url: '/healthz' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('returns unavailable when Redis cannot be reached', async () => {
    const app = buildWorkerHealth(env, async () => {
      throw new Error('private redis detail');
    });
    close = () => app.close();
    const response = await app.inject({ method: 'GET', url: '/readyz' });
    expect(response.statusCode).toBe(503);
    expect(response.body).not.toContain('private redis detail');
  });
});
