import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { query } from '../db/pool'

process.env.NODE_ENV = 'test'

async function cleanupGeneratedUsers() {
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
}

async function ensureFixtureUser(
  name: string,
  email: string,
  role: 'student' | 'trainer' | 'admin',
  status: 'active' | 'pending' | 'suspended',
  accountActivated = true
) {
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
}

beforeEach(async () => {
  await cleanupGeneratedUsers()
  await Promise.all([
    ensureFixtureUser('Emmanuel Nwafor', 'emmanuel@numerycode.com', 'admin', 'active', true),
    ensureFixtureUser('Chidi Obi', 'chidi@gmail.com', 'student', 'active', true),
    ensureFixtureUser('Emeka Nwosu', 'emeka@gmail.com', 'student', 'suspended', true),
  ])
})

beforeAll(async () => {
  await cleanupGeneratedUsers()
  await Promise.all([
    ensureFixtureUser('Emmanuel Nwafor', 'emmanuel@numerycode.com', 'admin', 'active', true),
    ensureFixtureUser('Chidi Obi', 'chidi@gmail.com', 'student', 'active', true),
    ensureFixtureUser('Emeka Nwosu', 'emeka@gmail.com', 'student', 'suspended', true),
  ])
})
