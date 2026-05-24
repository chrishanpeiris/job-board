import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma in Next.js.
// In development, Next.js hot-reload creates new module instances which would
// exhaust the SQLite connection limit. We cache the client on globalThis to
// reuse it across hot-reloads.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
