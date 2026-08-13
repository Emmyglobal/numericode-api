import 'dotenv/config'
import dns from 'dns'
import dnsPromises from 'dns/promises'
import net from 'net'
import { Pool } from 'pg'

// Prefer IPv4 for any hostname the driver has to resolve itself (safety net
// for the localhost/fallback path). Render's free tier cannot reach IPv6.
try {
  dns.setDefaultResultOrder('ipv4first')
} catch {
  // older Node — allow defaults
}

// ─────────────────────────────────────────────────────────────────────────────
// Connection pooling with forced IPv4 connectivity.
//
// Render (free tier) and several cloud/serverless hosts fail with
//   connect ENETUNREACH <ipv6>:5432 - Local (:::0)
// because they cannot reach the IPv6 (AAAA) address that modern Postgres
// providers (Supabase, Neon, …) publish alongside their IPv4 (A) record, and
// Node's DNS `verbatim` order sometimes hands the IPv6 address to the driver
// first. The `pg` driver ignores the `family` pool option, so instead we
// resolve the host to its IPv4 address ourselves and pass that numeric IP to
// the driver — it then never even opens an IPv6 socket.
//
// Because DNS resolution is async, the pool is created lazily and cached. All
// existing callers already `await` `query()` / `getClient()`, so this stays
// backward compatible.
// ─────────────────────────────────────────────────────────────────────────────

let cachedPool: Pool | null = null
let poolPromise: Promise<Pool> | null = null

async function getPool(): Promise<Pool> {
  if (cachedPool) return cachedPool
  if (!poolPromise) {
    poolPromise = (async () => {
      const raw = process.env.DATABASE_URL
      if (!raw) {
        throw new Error(
          'DATABASE_URL is not set. Provide a PostgreSQL connection string.'
        )
      }

      const parsed = new URL(raw)
      const hostname = parsed.hostname || 'localhost'
      const port = parseInt(parsed.port || '5432', 10)
      const database = parsed.pathname.replace(/^\//, '') || 'postgres'
      const user = decodeURIComponent(parsed.username)
      const password = decodeURIComponent(parsed.password)

      // Use SSL for any remote (non-localhost) database so Supabase/Neon/etc.
      // still connect securely even if NODE_ENV is not set to 'production'
      // (this deploy reported "Environment: development"). Localhost (local
      // dev / CI plain Postgres) connects without TLS. An explicit
      // sslmode=disable or ssl=false in the URL always wins.
      const sslMode =
        (parsed.searchParams.get('sslmode') || '').toLowerCase()
      const isLocal = ['localhost', '127.0.0.1', '::1'].includes(
        hostname.toLowerCase()
      )
      const useSsl =
        sslMode !== 'disable' &&
        parsed.searchParams.get('ssl') !== 'false' &&
        (sslMode === 'require' ||
          sslMode === 'verify-ca' ||
          sslMode === 'verify-full' ||
          parsed.searchParams.get('ssl') === 'true' ||
          process.env.NODE_ENV === 'production' ||
          !isLocal)

      // Force IPv4 (A-record) resolution; fall back to the hostname if the
      // host has no A record (e.g. localhost, a Unix-socket path, etc.).
      let host = hostname
      if (net.isIP(hostname) === 0) {
        try {
          const { address } = await dnsPromises.lookup(hostname, { family: 4 })
          if (address) host = address
        } catch {
          // no A record — keep the hostname
        }
      }

      const pool = new Pool({
        user,
        password,
        host,
        port,
        database,
        ssl: useSsl
          ? {
              rejectUnauthorized: false,
              // Keep SNI/certificate hostname correct even though `host` is now
              // a raw numeric IP.
              servername: hostname,
            }
          : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      })

      pool.on('error', (err) => {
        console.error('PostgreSQL pool error:', err)
        process.exit(-1)
      })

      cachedPool = pool
      return pool
    })()
  }
  return poolPromise
}

export const query = async <T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> => {
  const result = await (await getPool()).query(text, params)
  return { rows: result.rows as T[], rowCount: result.rowCount }
}

export const getClient = async () => (await getPool()).connect()

/** Grab the (lazily created) shared pool — used by migrations/scripts. */
export const getPoolInstance = getPool

/** Close the shared pool — used by standalone scripts (e.g. db:migrate). */
export const endPool = async () => {
  const p = await getPool()
  await p.end()
  cachedPool = null
  poolPromise = null
}