import { describe, it, expect, vi, afterAll } from 'vitest'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'
import { sendEmailVerificationEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from '../utils/mailer'

// ─── Email verification (registration + password recovery) ────────────────────
// These tests exercise the REAL API and database; only the SendGrid entry
// points are mocked so no email is ever sent. The raw tokens the API "emails"
// are captured from the mocks and used to drive the verification endpoints —
// i.e. the tests do exactly what a user clicking the emailed link does.

vi.mock('../utils/mailer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/mailer')>()
  return {
    ...actual,
    sendEmailVerificationEmail: vi.fn(async () => {}),
    sendPasswordResetEmail: vi.fn(async () => {}),
    sendPasswordChangedEmail: vi.fn(async () => {}),
    sendAdminApprovalEmail: vi.fn(async () => {}),
    sendActivationEmail: vi.fn(async () => {}),
    sendAccountApprovedEmail: vi.fn(async () => {}),
  }
})

const app = createApp()

const sha256 = (raw: string) => crypto.createHash('sha256').update(raw).digest('hex')

const validPolicyAcceptance = {
  termsAccepted: true,
  privacyPolicyAcknowledged: true,
  acceptableUseAccepted: true,
}

function registerUser(email: string) {
  return request(app).post('/api/auth/register').send({
    name: 'Unit Five User', email, password: 'password123', role: 'trainer', ...validPolicyAcceptance,
  })
}

afterAll(async () => {
  // Fixture emails use a domain the global setup does not clean (the @example.com
  // cleanup in a parallel test file could delete a user mid-test); remove them here.
  try {
    await query(`DELETE FROM users WHERE email LIKE '%@numerycode-test.local'`)
  } catch { /* cleanup is best-effort */ }
})

describe('Email verification — registration', () => {
  it('emails a hashed single-use token at registration and blocks login until it is used', async () => {
    const email = `verify-register-${Date.now()}@numerycode-test.local`
    const mockVerifyMail = vi.mocked(sendEmailVerificationEmail)
    mockVerifyMail.mockClear()

    const res = await registerUser(email)
    expect(res.status).toBe(201)
    expect(res.body.data.pendingApproval).toBe(true)
    expect(res.body.data.verificationEmailSent).toBe(true)
    expect(res.body.data.token).toBeUndefined()

    // The registration email carried the raw token…
    expect(mockVerifyMail).toHaveBeenCalledTimes(1)
    const [to, , rawToken] = mockVerifyMail.mock.calls[0]
    expect(to).toBe(email)
    expect(rawToken).toBeTypeOf('string')
    expect(rawToken.length).toBeGreaterThanOrEqual(64)

    // …and only its SHA-256 hash is stored, unused and unexpired.
    const { rows: tokenRows } = await query<{ used: boolean; expires_at: Date }>(
      'SELECT used, expires_at FROM activation_tokens WHERE token = $1', [sha256(rawToken)]
    )
    expect(tokenRows.length).toBe(1)
    expect(tokenRows[0].used).toBe(false)
    expect(new Date(tokenRows[0].expires_at).getTime()).toBeGreaterThan(Date.now())

    // Unverified email → login blocked (the account is also pending approval).
    const blocked = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(blocked.status).toBe(401)

    // Clicking the emailed link verifies the mailbox.
    const verified = await request(app).post('/api/auth/verify-email').send({ token: rawToken })
    expect(verified.status).toBe(200)

    const { rows: userRows } = await query<{ account_activated: boolean; email_verified_at: Date | null }>(
      'SELECT account_activated, email_verified_at FROM users WHERE email = $1', [email]
    )
    expect(userRows[0].account_activated).toBe(true)
    expect(userRows[0].email_verified_at).not.toBeNull()

    // Single use: the same link never works twice.
    const reused = await request(app).post('/api/auth/verify-email').send({ token: rawToken })
    expect(reused.status).toBe(400)
    expect(reused.body.message).toMatch(/invalid or expired/i)
  })

  it('rejects unknown and expired verification tokens', async () => {
    const unknown = await request(app).post('/api/auth/verify-email').send({ token: 'not-a-real-token' })
    expect(unknown.status).toBe(400)

    const email = `verify-expired-${Date.now()}@numerycode-test.local`
    await registerUser(email)
    const { rows } = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', [email])
    const expiredRaw = `expired-${crypto.randomUUID()}`
    await query(
      `INSERT INTO activation_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() - INTERVAL '1 minute')`,
      [rows[0].id, sha256(expiredRaw)]
    )

    const expired = await request(app).post('/api/auth/verify-email').send({ token: expiredRaw })
    expect(expired.status).toBe(400)
    expect(expired.body.message).toMatch(/invalid or expired/i)
  })
})

describe('Email verification — resend', () => {
  it('re-sends a fresh working link without revealing whether the account exists', async () => {
    const email = `verify-resend-${Date.now()}@numerycode-test.local`
    await registerUser(email)
    const mockVerifyMail = vi.mocked(sendEmailVerificationEmail)

    // Unknown address → identical generic response, no email.
    mockVerifyMail.mockClear()
    const unknown = await request(app).post('/api/auth/resend-verification')
      .send({ email: `nobody-${Date.now()}@numerycode-test.local` })
    expect(unknown.status).toBe(200)
    expect(unknown.body.data.message).toMatch(/if an account/i)
    expect(mockVerifyMail).not.toHaveBeenCalled()

    // Known unverified address → generic response + a new working link.
    const resent = await request(app).post('/api/auth/resend-verification').send({ email })
    expect(resent.status).toBe(200)
    expect(mockVerifyMail).toHaveBeenCalledTimes(1)
    const rawToken = mockVerifyMail.mock.calls[0][2]
    const verified = await request(app).post('/api/auth/verify-email').send({ token: rawToken })
    expect(verified.status).toBe(200)

    // Already verified → nothing further is sent (response stays identical).
    mockVerifyMail.mockClear()
    const again = await request(app).post('/api/auth/resend-verification').send({ email })
    expect(again.status).toBe(200)
    expect(mockVerifyMail).not.toHaveBeenCalled()
  })

  it('an active but unverified account is unlocked by the resend link', async () => {
    const email = `verify-active-${Date.now()}@numerycode-test.local`
    const passwordHash = await bcrypt.hash('password123', 10)
    await query(
      `INSERT INTO users (name, email, password_hash, role, status, account_activated)
       VALUES ('Active Unverified', $1, $2, 'student', 'active', FALSE)`,
      [email, passwordHash]
    )

    const blocked = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(blocked.status).toBe(401)
    expect(blocked.body.message).toMatch(/not been verified/i)

    const mockVerifyMail = vi.mocked(sendEmailVerificationEmail)
    mockVerifyMail.mockClear()
    const resent = await request(app).post('/api/auth/resend-verification').send({ email })
    expect(resent.status).toBe(200)
    const rawToken = mockVerifyMail.mock.calls[0][2]

    const verified = await request(app).post('/api/auth/verify-email').send({ token: rawToken })
    expect(verified.status).toBe(200)

    const ok = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(ok.status).toBe(200)
    expect(ok.body.data.token).toBeTypeOf('string')
  })
})

describe('Email verification — password recovery', () => {
  it('completing a password reset verifies the email address and sends a security notice', async () => {
    const email = `verify-recovery-${Date.now()}@numerycode-test.local`
    await registerUser(email)
    const { rows: users } = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', [email])
    const userId = users[0].id

    // The account starts unverified.
    const { rows: before } = await query<{ account_activated: boolean; email_verified_at: Date | null }>(
      'SELECT account_activated, email_verified_at FROM users WHERE id = $1', [userId]
    )
    expect(before[0].account_activated).toBe(false)
    expect(before[0].email_verified_at).toBeNull()

    // The user requests a reset — the raw link token is what the email carries.
    const mockResetMail = vi.mocked(sendPasswordResetEmail)
    mockResetMail.mockClear()
    const forgot = await request(app).post('/api/auth/forgot-password').send({ email })
    expect(forgot.status).toBe(200)
    expect(mockResetMail).toHaveBeenCalledTimes(1)
    const rawResetToken = mockResetMail.mock.calls[0][2]

    const mockChangedMail = vi.mocked(sendPasswordChangedEmail)
    mockChangedMail.mockClear()
    const reset = await request(app).post('/api/auth/reset-password')
      .send({ token: rawResetToken, password: 'newpassword123' })
    expect(reset.status).toBe(200)

    // Clicking the emailed reset link proves mailbox ownership → email verified.
    const { rows: after } = await query<{ account_activated: boolean; email_verified_at: Date | null; password_hash: string }>(
      'SELECT account_activated, email_verified_at, password_hash FROM users WHERE id = $1', [userId]
    )
    expect(after[0].account_activated).toBe(true)
    expect(after[0].email_verified_at).not.toBeNull()
    expect(await bcrypt.compare('newpassword123', after[0].password_hash)).toBe(true)

    // The reset link stays single-use.
    const reuse = await request(app).post('/api/auth/reset-password')
      .send({ token: rawResetToken, password: 'whatever123' })
    expect(reuse.status).toBe(400)

    // A security notice confirms the change.
    expect(mockChangedMail).toHaveBeenCalledTimes(1)
  })
})