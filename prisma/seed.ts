import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../apps/api/src/generated/prisma/client.ts';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required to seed the local fixture.');

const databaseUrl = new URL(connectionString);
if (!['localhost', '127.0.0.1', '::1', '[::1]'].includes(databaseUrl.hostname)) {
  throw new Error('Seed fixtures are restricted to a local database.');
}
if (databaseUrl.pathname !== '/community') {
  throw new Error('Seed fixtures are restricted to the local community database.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

try {
  await prisma.bootstrapFixture.upsert({
    where: { key: 'bootstrap-ready' },
    create: {
      key: 'bootstrap-ready',
      description: 'Local-only fixture verifying database migration and seed setup.',
    },
    update: {
      description: 'Local-only fixture verifying database migration and seed setup.',
    },
  });
} finally {
  await prisma.$disconnect();
}
