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

      let dbHost = hostname
      let dbPort = port

      const database = parsed.pathname.replace(/^\//, '') || 'postgres'
      const user = decodeURIComponent(parsed.username)
      const password = decodeURIComponent(parsed.password)

      // ── SSL ────────────────────────────────────────────────────────────────────
      const sslMode =
        (parsed.searchParams.get('sslmode') || '').toLowerCase()
      const isLocal = ['localhost', '127.0.0.1', '::1'].includes(
        dbHost.toLowerCase()
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

      // ── IPv4 override ──────────────────────────────────────────────────────────
      //
      // Render's free tier cannot reach IPv6. Every Supabase host (pooler AND
      // direct) publishes an AAAA record alongside its A record, and Node's "first"
      // or "verbatim" resolution order may hand the IPv6 address to pg — which
      // then tries a TCP connect to an IPv6 address and fails with ENETUNREACH.
      //
      // The `pg` driver ignores the `family` pool option, so we resolve to a
      // *numeric IPv4 address ourselves* and pass that to the Pool. pg then never
      // opens an IPv6 socket.
      //
      // Furthermore, if the original DATABASE_URL still targets
      // `<something>.supabase.co` (the direct IPv6-only host, e.g.
      // `db.<ref>.supabase.co:6543`), we auto-redirect to the IPv4-capable
      // transaction/session pooler. User/password/database are kept verbatim.
      // ────────────────────────────────────────────────────────────────────────────
      let host = dbHost

      // --- Auto-redirect: any `.supabase.co` or `.supabase.com` host → pooler ---
      const isSupabaseDirect =
        /\.supabase\.co$/i.test(hostname) ||
        /\.supabase\.com$/i.test(hostname)
      if (isSupabaseDirect) {
        dbHost =
          process.env.SUPABASE_POOLER_HOST ||
          'aws-1-eu-west-1.pooler.supabase.com'
        dbPort = parseInt(process.env.SUPABASE_POOLER_PORT || '5432', 10)
        host = dbHost
        console.warn(
          `[db] DATABASE_URL targets a Supabase host (${hostname}:${port}); ` +
            `redirecting to the IPv4 pooler ${dbHost}:${dbPort} ` +
            `(credentials/SSL preserved).`
        )
      }

      // --- Force numeric IPv4 (A-record) resolution ---
      if (net.isIP(host) === 0) {
        try {
          const { address } = await dnsPromises.lookup(host, { family: 4 })
          if (address) {
            host = address
            console.log(`[db] Resolved ${dbHost} → ${host} (IPv4)`)
          }
        } catch (err) {
          // No IPv4 (A) record — the hostname points to IPv6 only.
          // On Render this would cause ENETUNREACH. If we already redirected from
          // a Supabase host and the *pooler* also has no A record (unusual), try
          // the default pooler fallback.
          if (!isLocal) {
            console.warn(
              `[db] Host "${host}" has no resolvable IPv4 (A) record; ` +
                `Render cannot reach its IPv6 address. Make sure DATABASE_URL ` +
                `points to an IPv4-capable host (e.g. a Supabase/Neon pooler, ` +
                `port 6543/5432 with an A record). (${(err as Error).message})`
            )
          }
        }
      }

      const pool = new Pool({
        user,
        password,
        host,
        port: dbPort,
        database,
        ssl: useSsl
          ? {
              rejectUnauthorized: false,
              // Keep SNI/certificate hostname correct even though `host` is now
              // a raw numeric IP.
              servername: dbHost,
            }
          : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      })

      // IMPORTANT: never `process.exit()` here. The pool emits 'error' for
      // *transient*, expected conditions — most notably when Supabase's
      // Supavisor / pgBouncer pooler closes an idle connection (it does this
      // aggressively, especially on the free tier). Killing the whole process on
      // those events caused Render to report "Application exited early" and crash
      // -loop after every successful deploy (migrations ran, then the process
      // died). Log and continue; `pg` will just open a fresh connection next.
      pool.on('error', (err) => {
        console.error(
          '[db] Pool error (transient — idle connection dropped. Keeping the ' +
            'server alive.):',
          err.message ?? err
        )
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

