import { describe, it, expect } from 'vitest'
import {
  assertTestDatabaseConfigured,
  describeTarget,
  isLocalTarget,
  isProductionHost,
  isTestDatabaseName,
  parseDatabaseTarget,
} from './dbGuard'

/**
 * Unit tests for the fail-closed test-database guard.
 *
 * These exercise the guard's decision logic only — they never open a database
 * connection, so they are safe to run in any environment.
 */

const LOCAL_TEST_URL = 'postgresql://postgres:local-password@localhost:5432/numerycode_test'
const PRODUCTION_HOST = 'aws-1-eu-west-1.pooler.supabase.com'
const PRODUCTION_URL = `postgresql://postgres:production-secret@${PRODUCTION_HOST}:5432/postgres?sslmode=require`

/** Build a ProcessEnv-like record without casting. */
function envWith(values: Record<string, string>): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {}
  for (const [key, value] of Object.entries(values)) env[key] = value
  return env
}

describe('dbGuard — target parsing', () => {
  it('extracts host, port and database from a connection string', () => {
    expect(parseDatabaseTarget(LOCAL_TEST_URL)).toEqual({
      url: LOCAL_TEST_URL,
      host: 'localhost',
      port: '5432',
      database: 'numerycode_test',
    })
  })

  it('defaults to port 5432 when none is given and strips IPv6 brackets', () => {
    expect(parseDatabaseTarget('postgresql://u:p@db.example.com/numerycode_test').port).toBe('5432')
    expect(parseDatabaseTarget('postgresql://u:p@[::1]:5433/numerycode_test').host).toBe('::1')
  })

  it('falls back to the "postgres" database name when the path is empty', () => {
    expect(parseDatabaseTarget('postgresql://u:p@localhost:5432').database).toBe('postgres')
  })

  it('rejects a non-postgres scheme and a malformed URL without echoing the secret', () => {
    expect(() => parseDatabaseTarget('https://example.com/numerycode_test')).toThrow(/scheme/)
    expect(() => parseDatabaseTarget('not a url with production-secret')).toThrow(/valid URL/)
    try {
      parseDatabaseTarget('not a url with production-secret')
    } catch (err) {
      expect(String(err)).not.toContain('production-secret')
    }
  })
})

describe('dbGuard — host and name predicates', () => {
  it('recognises local hosts', () => {
    expect(isLocalTarget({ host: 'localhost' })).toBe(true)
    expect(isLocalTarget({ host: '127.0.0.1' })).toBe(true)
    expect(isLocalTarget({ host: '::1' })).toBe(true)
    expect(isLocalTarget({ host: 'aws-1-eu-west-1.pooler.supabase.com' })).toBe(false)
  })

  it('recognises deployment-platform hosts', () => {
    expect(isProductionHost(PRODUCTION_HOST)).toBe(true)
    expect(isProductionHost('abc.supabase.co')).toBe(true)
    expect(isProductionHost('numericode-api.onrender.com')).toBe(true)
    expect(isProductionHost('foo.up.railway.app')).toBe(true)
    expect(isProductionHost('localhost')).toBe(false)
  })

  it('requires the _test suffix on the database name', () => {
    expect(isTestDatabaseName('numerycode_test')).toBe(true)
    expect(isTestDatabaseName('NUMERYCODE_TEST')).toBe(true)
    expect(isTestDatabaseName('postgres')).toBe(false)
    expect(isTestDatabaseName('test')).toBe(false)
  })

  it('describes a target without any credentials', () => {
    const described = describeTarget(parseDatabaseTarget(PRODUCTION_URL))
    expect(described).toBe(`${PRODUCTION_HOST}:5432/postgres`)
    expect(described).not.toContain('production-secret')
  })
})

describe('dbGuard — fail-closed behaviour', () => {
  it('refuses to run when DATABASE_URL_TEST is missing (never falls back to DATABASE_URL)', () => {
    const env = envWith({ DATABASE_URL: PRODUCTION_URL })
    expect(() => assertTestDatabaseConfigured(env)).toThrow(/dedicated test database is not configured/)
    expect(() => assertTestDatabaseConfigured(env)).toThrow(/never fall back to DATABASE_URL/)
  })

  it('refuses a blank or whitespace-only DATABASE_URL_TEST', () => {
    expect(() => assertTestDatabaseConfigured(envWith({ DATABASE_URL_TEST: '   ' }))).toThrow(
      /dedicated test database is not configured/
    )
  })

  it('refuses an unusable connection string', () => {
    expect(() =>
      assertTestDatabaseConfigured(envWith({ DATABASE_URL_TEST: 'https://x/numerycode_test' }))
    ).toThrow(/not a usable connection string/)
  })

  it('refuses the host that serves the production database, even with the remote acknowledgement', () => {
    const env = envWith({
      DATABASE_URL_TEST: `postgresql://postgres:secret@${PRODUCTION_HOST}:5432/numerycode_test`,
      ALLOW_REMOTE_TEST_DB: '1',
    })
    expect(() => assertTestDatabaseConfigured(env)).toThrow(/production database/)
  })

  it('refuses any other managed-platform host (production lives there)', () => {
    const env = envWith({
      DATABASE_URL_TEST: 'postgresql://postgres:secret@db.abcdefgh.supabase.co:5432/numerycode_test',
      ALLOW_REMOTE_TEST_DB: '1',
    })
    expect(() => assertTestDatabaseConfigured(env)).toThrow(/managed deployment platform/)
  })

  it('refuses a remote host without an explicit acknowledgement', () => {
    const env = envWith({
      DATABASE_URL_TEST: 'postgresql://postgres:secret@test-db.internal.example:5432/numerycode_test',
    })
    expect(() => assertTestDatabaseConfigured(env)).toThrow(/is not local/)
    expect(() => assertTestDatabaseConfigured(env)).toThrow(/ALLOW_REMOTE_TEST_DB=1/)
  })

  it('refuses a local database that is not test-named', () => {
    const env = envWith({ DATABASE_URL_TEST: 'postgresql://postgres:local-password@localhost:5432/postgres' })
    expect(() => assertTestDatabaseConfigured(env)).toThrow(/"postgres" is not a test database/)
  })

  it('refuses a DATABASE_URL_TEST identical to a production-like DATABASE_URL (copy/paste)', () => {
    const env = envWith({ DATABASE_URL: PRODUCTION_URL, DATABASE_URL_TEST: PRODUCTION_URL })
    expect(() => assertTestDatabaseConfigured(env)).toThrow(/production-like DATABASE_URL|production database/)
  })

  it('never leaks credentials in refusal messages', () => {
    const env = envWith({
      DATABASE_URL_TEST: `postgresql://postgres:production-secret@${PRODUCTION_HOST}:5432/numerycode_test`,
    })
    try {
      assertTestDatabaseConfigured(env)
      throw new Error('expected the guard to refuse this target')
    } catch (err) {
      expect(String(err)).not.toContain('production-secret')
    }
  })
})

describe('dbGuard — accepted configurations', () => {
  it('accepts a local test database even when a production DATABASE_URL is present in the environment', () => {
    const env = envWith({
      DATABASE_URL: PRODUCTION_URL, // present in .env during normal development
      DATABASE_URL_TEST: LOCAL_TEST_URL,
    })
    expect(assertTestDatabaseConfigured(env).url).toBe(LOCAL_TEST_URL)
  })

  it('accepts the CI layout where DATABASE_URL and DATABASE_URL_TEST are the same local test database', () => {
    const env = envWith({
      DATABASE_URL: 'postgresql://postgres:password@localhost:5432/numerycode_test',
      DATABASE_URL_TEST: 'postgresql://postgres:password@localhost:5432/numerycode_test',
    })
    expect(assertTestDatabaseConfigured(env).database).toBe('numerycode_test')
  })

  it('accepts a separate, explicitly acknowledged non-platform remote test database', () => {
    const env = envWith({
      DATABASE_URL_TEST: 'postgresql://postgres:secret@test-db.internal.example:5432/numerycode_test',
      ALLOW_REMOTE_TEST_DB: '1',
    })
    expect(assertTestDatabaseConfigured(env).host).toBe('test-db.internal.example')
  })
})
