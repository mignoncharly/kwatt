import { HealthResponseSchema } from '@community/contracts/health';

export function GET() {
  return Response.json(HealthResponseSchema.parse({ status: 'ok' }), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
