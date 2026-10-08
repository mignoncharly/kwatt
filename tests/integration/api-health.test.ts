import { afterEach, describe, expect, it } from 'vitest';
import { parseApiEnv } from '../../packages/config/src/env.js';
import { buildApi } from '../../apps/api/src/app.js';

const env = parseApiEnv({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://community:local@127.0.0.1:54329/community',
});

describe('API health routes', () => {
  let close: (() => Promise<void>) | undefined;

  afterEach(async () => {
    await close?.();
    close = undefined;
  });

  it('reports liveness without checking dependencies', async () => {
    const app = buildApi(env, {
      databaseProbe: async () => {
        throw new Error('database down');
      },
    });
    close = () => app.close();
    const response = await app.inject({ method: 'GET', url: '/healthz' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('reports readiness only after the database probe succeeds', async () => {
    const app = buildApi(env, { databaseProbe: async () => undefined });
    close = () => app.close();
    const response = await app.inject({ method: 'GET', url: '/readyz' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('returns a sanitized unavailable response when the database probe fails', async () => {
    const app = buildApi(env, {
      databaseProbe: async () => {
        throw new Error('private connection detail');
      },
    });
    close = () => app.close();
    const response = await app.inject({ method: 'GET', url: '/readyz' });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({ status: 'unavailable' });
    expect(response.body).not.toContain('private connection detail');
  });
});
