import Fastify, { LogController, type FastifyInstance } from 'fastify';
import type { WorkerEnv } from '@community/config/env';
import { HealthResponseSchema } from '@community/contracts/health';

export function buildWorkerHealth(
  env: WorkerEnv,
  redisProbe: () => Promise<void>,
): FastifyInstance {
  const app = Fastify({
    logger: env.NODE_ENV !== 'test',
    logController: new LogController({ disableRequestLogging: true }),
  });

  app.addHook('onSend', async (_request, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('Cache-Control', 'no-store');
    return payload;
  });

  app.get('/healthz', async () => HealthResponseSchema.parse({ status: 'ok' }));
  app.get('/readyz', async (_request, reply) => {
    try {
      await redisProbe();
      return HealthResponseSchema.parse({ status: 'ok' });
    } catch {
      return reply.code(503).send(HealthResponseSchema.parse({ status: 'unavailable' }));
    }
  });

  return app;
}
