import Fastify, { LogController, type FastifyInstance } from 'fastify';
import type { ApiEnv } from '@community/config/env';
import { HealthResponseSchema } from '@community/contracts/health';

export interface ApiDependencies {
  databaseProbe: () => Promise<void>;
}

export function buildApi(env: ApiEnv, dependencies: ApiDependencies): FastifyInstance {
  const app = Fastify({
    logController: new LogController({ disableRequestLogging: true }),
    logger:
      env.NODE_ENV === 'test'
        ? false
        : {
            level: env.NODE_ENV === 'production' ? 'info' : 'debug',
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.body.password',
                'req.body.token',
                'req.body.email',
                'req.body.message',
              ],
              censor: '[REDACTED]',
            },
          },
    bodyLimit: 1_048_576,
    trustProxy: false,
  });

  app.addHook('onSend', async (_request, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('Cache-Control', 'no-store');
    return payload;
  });

  app.get('/healthz', async () => HealthResponseSchema.parse({ status: 'ok' }));

  app.get('/readyz', async (_request, reply) => {
    try {
      await dependencies.databaseProbe();
      return HealthResponseSchema.parse({ status: 'ok' });
    } catch {
      return reply.code(503).send(HealthResponseSchema.parse({ status: 'unavailable' }));
    }
  });

  return app;
}
