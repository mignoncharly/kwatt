import { z } from 'zod';

const nodeEnvironment = z.enum(['development', 'test', 'production']).default('development');
const port = z.coerce.number().int().min(1).max(65_535);

function urlWithProtocols(protocols: readonly string[]) {
  return z
    .string()
    .url()
    .refine((value) => {
      try {
        return protocols.includes(new URL(value).protocol);
      } catch {
        return false;
      }
    }, 'URL uses an unsupported protocol.');
}

export const ApiEnvSchema = z.object({
  NODE_ENV: nodeEnvironment,
  API_HOST: z.string().trim().min(1).default('127.0.0.1'),
  API_PORT: port.default(4000),
  DATABASE_URL: urlWithProtocols(['postgres:', 'postgresql:']),
});

export const WorkerEnvSchema = z.object({
  NODE_ENV: nodeEnvironment,
  WORKER_HEALTH_HOST: z.string().trim().min(1).default('127.0.0.1'),
  WORKER_HEALTH_PORT: port.default(4010),
  REDIS_URL: urlWithProtocols(['redis:', 'rediss:']),
});

export const WebEnvSchema = z.object({
  NODE_ENV: nodeEnvironment,
  WEB_HOST: z.string().trim().min(1).default('127.0.0.1'),
  WEB_PORT: port.default(3000),
  API_BASE_URL: urlWithProtocols(['http:', 'https:']).default('http://127.0.0.1:4000'),
});

export type ApiEnv = z.infer<typeof ApiEnvSchema>;
export type WorkerEnv = z.infer<typeof WorkerEnvSchema>;
export type WebEnv = z.infer<typeof WebEnvSchema>;

export function parseApiEnv(input: NodeJS.ProcessEnv = process.env): ApiEnv {
  return ApiEnvSchema.parse(input);
}

export function parseWorkerEnv(input: NodeJS.ProcessEnv = process.env): WorkerEnv {
  return WorkerEnvSchema.parse(input);
}

export function parseWebEnv(input: NodeJS.ProcessEnv = process.env): WebEnv {
  return WebEnvSchema.parse(input);
}
