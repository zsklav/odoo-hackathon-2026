import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Shared runtime Prisma client. Prisma 7 needs a driver adapter (the connection
// URL is not read from schema.prisma). We use @prisma/adapter-pg (node-postgres),
// which connects directly and bypasses PostgREST/RLS — ideal for server-side reads.
//
// Always use DATABASE_URL (Supabase transaction pooler, :6543, pgbouncer=true) for
// runtime app queries — it supports far more concurrent clients than DIRECT_URL's
// session-mode pooler, which is capped at 15 and is reserved for `prisma db push`/
// migrations only. adapter-pg doesn't use named/cached prepared statements unless
// explicitly configured, so it's compatible with pgbouncer's transaction mode.
//
// Cached on globalThis in dev so hot-reload doesn't open a new pool each change.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'No database URL set. Add DATABASE_URL to .env — see .env.example.',
    )
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
