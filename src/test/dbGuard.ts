/**
 * ─── Test-database safety guard (fails closed) ────────────────────────────────
 *
 * The integration suite creates, updates and deletes rows (fixture users,
 * courses, payments, enrollments, …). Historically it connected to whatever
 * `DATABASE_URL` pointed at — including the hosted production database — because
 * nothing separated "the application's database" from "the tests' database".
 *
 * This guard makes that impossible. It is called at the very top of the Vitest
 * global setup, BEFORE any query runs, and refuses to continue unless the
 * configured target is provably a disposable TEST database:
 *
 *   1. Tests only ever use `DATABASE_URL_TEST`. A missing, blank or invalid
 *      value is a hard error — there is no fallback to `DATABASE_URL`, ever.
 *   2. The database name must end with `_test` (e.g. `numerycode_test`), so the
 *      production database (`…/postgres`) can never be selected by accident.
 *   3. Non-local hosts require an explicit `ALLOW_REMOTE_TEST_DB=1`
 *      acknowledgement (use that for a dedicated remote test project).
 *   4. Hosts that serve this project's production database are refused
 *      outright, even with the acknowledgement above.
 *   5. A `DATABASE_URL_TEST` identical to a production-like `DATABASE_URL` is
 *      refused (copy/paste protection).
 *
 * Error messages never contain credentials — only host, port and database name.
 */

/** Managed deployment platforms that must never host the test database. */
const PRODUCTION_HOST_SUFFIXES: readonly string[] = [
  '.supabase.co',
  '.supabase.com',
  '.onrender.com',
  '.railway.app',
]

/** Exact hostnames known to serve this project's production database. */
const KNOWN_PRODUCTION_HOSTS: readonly string[] = [
  'aws-1-eu-west-1.pooler.supabase.com',
]

/** Local, disposable hosts allowed without any extra acknowledgement. */
const LOCAL_HOSTS: readonly string[] = ['localhost', '127.0.0.1', '::1']

/** A test database name must end with this marker (case-insensitive). */
const TEST_DATABASE_SUFFIX = '_test'

const TEST_URL_VAR = 'DATABASE_URL_TEST'
const RUNTIME_URL_VAR = 'DATABASE_URL'
const REMOTE_ACK_VAR = 'ALLOW_REMOTE_TEST_DB'

export interface DatabaseTarget {
  /** The exact connection string supplied via `DATABASE_URL_TEST`. */
  url: string
  host: string
  port: string
  database: string
}

function stripIpv6Brackets(host: string): string {
  return host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host
}

/** Parse a postgres connection string into the fields used by the guard. */
export function parseDatabaseTarget(raw: string): DatabaseTarget {
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    // Never echo the raw value — it may contain a password.
    throw new Error('it is not a valid URL')
  }
  if (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') {
    throw new Error(`it must use the postgres:// or postgresql:// scheme (got "${parsed.protocol}//")`)
  }
  const host = stripIpv6Brackets(parsed.hostname || '')
  if (!host) throw new Error('it does not contain a host')

  return {
    url: raw,
    host,
    port: parsed.port || '5432',
    database: parsed.pathname.replace(/^\/+/, '') || 'postgres',
  }
}

/** Human-readable, credential-free description of a target ("host:port/db"). */
export function describeTarget(target: Pick<DatabaseTarget, 'host' | 'port' | 'database'>): string {
  return `${target.host}:${target.port}/${target.database}`
}

export function isLocalTarget(target: Pick<DatabaseTarget, 'host'>): boolean {
  return LOCAL_HOSTS.includes(target.host.toLowerCase())
}

/** True for hosts that belong to managed deployment platforms (or our own). */
export function isProductionHost(host: string): boolean {
  const normalized = host.toLowerCase()
  if (KNOWN_PRODUCTION_HOSTS.includes(normalized)) return true
  return PRODUCTION_HOST_SUFFIXES.some(suffix => normalized.endsWith(suffix))
}

export function isTestDatabaseName(database: string): boolean {
  return database.toLowerCase().endsWith(TEST_DATABASE_SUFFIX)
}

const MISSING_MESSAGE =
  `Refusing to run tests: a dedicated test database is not configured.\n` +
  `Set ${TEST_URL_VAR} to a disposable test database whose name ends with ` +
  `"${TEST_DATABASE_SUFFIX}" (for example ` +
  `postgresql://postgres:<local-password>@localhost:5432/numerycode_test) — see ` +
  `.env.test.example for the full setup, and run the migrations against it first:\n` +
  `  DATABASE_URL="$DATABASE_URL_TEST" npm run db:migrate\n` +
  `Tests never fall back to ${RUNTIME_URL_VAR}: that variable points at the ` +
  `deployed/production database, which the suite must never touch.`

/**
 * Fail-closed verification that a disposable test database is configured.
 *
 * @returns the verified test target, including the connection string to use.
 * @throws when the target is missing, unparsable, or not provably a test database.
 */
export function assertTestDatabaseConfigured(env: NodeJS.ProcessEnv): DatabaseTarget {
  const raw = (env[TEST_URL_VAR] ?? '').trim()
  if (!raw) throw new Error(MISSING_MESSAGE)

  let target: DatabaseTarget
  try {
    target = parseDatabaseTarget(raw)
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'it could not be parsed'
    throw new Error(`Refusing to run tests: ${TEST_URL_VAR} is not a usable connection string — ${reason}.`)
  }

  const described = describeTarget(target)
  const knownProductionHost = KNOWN_PRODUCTION_HOSTS.includes(target.host.toLowerCase())
  const local = isLocalTarget(target)
  const remoteAcknowledged = (env[REMOTE_ACK_VAR] ?? '').trim() === '1'

  // 1. The host that serves this project's production database is never acceptable.
  if (knownProductionHost) {
    throw new Error(
      `Refusing to run tests: ${TEST_URL_VAR} points at ${described}, which serves this ` +
      `project's production database. Create a disposable test database (for example ` +
      `${target.database === 'postgres' ? 'numerycode_test' : 'a *_test database'} on a local ` +
      `PostgreSQL) and point ${TEST_URL_VAR} at it.`
    )
  }

  // 2. Remote targets need an explicit, deliberate acknowledgement.
  if (!local && !remoteAcknowledged) {
    throw new Error(
      `Refusing to run tests: ${TEST_URL_VAR} host "${target.host}" is not local. ` +
      `If this really is a dedicated, disposable test database (for example a separate ` +
      `Supabase/Neon test project), set ${REMOTE_ACK_VAR}=1 to acknowledge it. ` +
      `Otherwise point ${TEST_URL_VAR} at a local test database.`
    )
  }

  // 3. Other managed-platform hosts (Supabase/Render/Railway) are where production lives.
  if (!local && isProductionHost(target.host)) {
    throw new Error(
      `Refusing to run tests: ${TEST_URL_VAR} points at ${described}, on a managed ` +
      `deployment platform. Use a local test database, or set ${REMOTE_ACK_VAR}=1 only if ` +
      `this is a separate test project that never holds production data.`
    )
  }

  // 4. The database name itself must be test-named.
  if (!isTestDatabaseName(target.database)) {
    throw new Error(
      `Refusing to run tests: database "${target.database}" is not a test database. ` +
      `The test database name must end with "${TEST_DATABASE_SUFFIX}" ` +
      `(for example "numerycode_test") so a production database can never be selected.`
    )
  }

  // 5. Copy/paste protection: the test URL must not BE a production connection.
  const runtimeRaw = (env[RUNTIME_URL_VAR] ?? '').trim()
  if (runtimeRaw) {
    try {
      const runtime = parseDatabaseTarget(runtimeRaw)
      const identical =
        runtime.host.toLowerCase() === target.host.toLowerCase() &&
        runtime.port === target.port &&
        runtime.database === target.database
      if (identical && isProductionHost(runtime.host)) {
        throw new Error(
          `Refusing to run tests: ${TEST_URL_VAR} is identical to a production-like ` +
          `${RUNTIME_URL_VAR} (${described}). Point ${TEST_URL_VAR} at a disposable test database.`
        )
      }
    } catch (err) {
      // A malformed DATABASE_URL is irrelevant here; only the identity check above matters.
      if (err instanceof Error && err.message.startsWith('Refusing to run tests:')) throw err
    }
  }

  return target
}
