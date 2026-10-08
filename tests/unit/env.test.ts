import { describe, expect, it } from 'vitest';
import { ApiEnvSchema, WebEnvSchema, WorkerEnvSchema } from '../../packages/config/src/env.js';

describe('environment schemas', () => {
  it('applies safe local defaults while requiring a database URL', () => {
    expect(
      ApiEnvSchema.parse({
        DATABASE_URL: 'postgresql://community:local@127.0.0.1:54329/community',
      }),
    ).toMatchObject({ NODE_ENV: 'development', API_HOST: '127.0.0.1', API_PORT: 4000 });
  });

  it('rejects a missing database URL and malformed ports', () => {
    expect(ApiEnvSchema.safeParse({}).success).toBe(false);
    expect(
      ApiEnvSchema.safeParse({
        DATABASE_URL: 'postgresql://community:local@127.0.0.1/community',
        API_PORT: '70000',
      }).success,
    ).toBe(false);
  });

  it('rejects connection URLs with the wrong protocol', () => {
    expect(ApiEnvSchema.safeParse({ DATABASE_URL: 'https://localhost/community' }).success).toBe(
      false,
    );
    expect(WebEnvSchema.safeParse({ API_BASE_URL: 'ftp://localhost/api' }).success).toBe(false);
  });

  it('requires a valid Redis URL for the worker', () => {
    expect(WorkerEnvSchema.safeParse({ REDIS_URL: 'not a URL' }).success).toBe(false);
    expect(WorkerEnvSchema.safeParse({ REDIS_URL: 'https://localhost' }).success).toBe(false);
    expect(WorkerEnvSchema.safeParse({ REDIS_URL: 'redis://127.0.0.1:56379' }).success).toBe(true);
  });
});
