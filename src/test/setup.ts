import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { query } from '../db/pool'

process.env.NODE_ENV = 'test'

async function cleanupGeneratedUsers() {
  try {
    await query(
      `DELETE FROM users
       WHERE email LIKE '%@example.com'
          OR name IN (
            'New Test User',
            'Pending Trainer',
            'To Suspend',
            'New Trainer',
            'Weird Role',
            'Privilege Escalation Attempt',
            'No Consent',
            'Partial Consent',
            'Short Pass',
            'New Student',
            'Student User',
            'Suspended User',
            'Duplicate',
            'Test User'
          )`
    )
  } catch (err: any) {
    // If the test DB host is temporarily unreachable (DNS/ENOTFOUND), surface a
    // clear warning but do not cause an unhandled rejection in hooks — tests
    // should fail with a clearer message from the first failing DB operation.
    console.warn('cleanupGeneratedUsers: database cleanup skipped due to error:', err?.message ?? err)
  }
}

async function ensureFixtureUser(
  name: string,
  email: string,
  role: 'student' | 'trainer' | 'admin',
  status: 'active' | 'pending' | 'suspended',
  accountActivated = true
) {
  try {
    const { rows } = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', [email])
    if (rows.length > 0) {
      await query(
        `UPDATE users
         SET name = $1,
             role = $2,
             status = $3,
             account_activated = $4
         WHERE email = $5`,
        [name, role, status, accountActivated, email]
      )
      return
    }

    const passwordHash = await bcrypt.hash('password123', 10)
    await query(
      `INSERT INTO users (name, email, password_hash, role, status, account_activated)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, passwordHash, role, status, accountActivated]
    )
  } catch (err: any) {
    console.warn(`ensureFixtureUser: skipped fixture ${email} due to DB error:`, err?.message ?? err)
  }
}

beforeEach(async () => {
  try {
    await cleanupGeneratedUsers()
    await Promise.all([
      ensureFixtureUser('Emmanuel Nwafor', 'emmanuel@numerycode.com', 'admin', 'active', true),
      ensureFixtureUser('Chidi Obi', 'chidi@gmail.com', 'student', 'active', true),
      ensureFixtureUser('Emeka Nwosu', 'emeka@gmail.com', 'student', 'suspended', true),
    ])
  } catch (err: any) {
    console.warn('beforeEach: test setup encountered an error:', err?.message ?? err)
  }
})

beforeAll(async () => {
  try {
    await cleanupGeneratedUsers()
    await Promise.all([
      ensureFixtureUser('Emmanuel Nwafor', 'emmanuel@numerycode.com', 'admin', 'active', true),
      ensureFixtureUser('Chidi Obi', 'chidi@gmail.com', 'student', 'active', true),
      ensureFixtureUser('Emeka Nwosu', 'emeka@gmail.com', 'student', 'suspended', true),
    ])
  } catch (err: any) {
    console.warn('beforeAll: test global setup encountered an error:', err?.message ?? err)
  }
})
