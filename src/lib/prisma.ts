import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Shared runtime Prisma client. Prisma 7 needs a driver adapter (the connection
// URL is not read from schema.prisma). We use @prisma/adapter-pg (node-postgres),
// which connects directly and bypasses PostgREST/RLS — ideal for server-side reads.
//
// URL preference: DIRECT_URL (Supabase session pooler, :5432) if set, else
// DATABASE_URL. The session pooler works with the adapter's prepared statements;
// the :6543 transaction pooler (pgbouncer) can error on them.
//
// Cached on globalThis in dev so hot-reload doesn't open a new pool each change.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'No database URL set. Add DATABASE_URL (and ideally DIRECT_URL) to .env — see .env.example.',
    )
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
