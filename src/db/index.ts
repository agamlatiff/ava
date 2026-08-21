import { loadEnvConfig } from '@next/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

loadEnvConfig(process.cwd())

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/our_app'

const globalForDb = globalThis as unknown as {
  pgClient: postgres.Sql | undefined
}

// Reuse existing connection in dev to avoid pool leaks during hot reload
const client = globalForDb.pgClient ?? postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

if (process.env.NODE_ENV !== 'production') globalForDb.pgClient = client

export const db = drizzle(client, { schema })
export * from './schema'
