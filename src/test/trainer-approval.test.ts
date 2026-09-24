import { describe, it, expect, vi, afterAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'
import { sendEmailVerificationEmail, sendActivationEmail, sendAccountApprovedEmail } from '../utils/mailer'

// Mock ONLY the SendGrid entry points this lifecycle exercises — no real email
// is ever sent from tests. The raw verification token the backend "emails" is
// captured from the mock, so the complete register → verify → approve → login
// flow runs against the real API and database.
vi.mock('../utils/mailer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/mailer')>()
  return {
    ...actual,
    sendEmailVerificationEmail: vi.fn(async () => {}),
    sendActivationEmail: vi.fn(async () => {}),
    sendAccountApprovedEmail: vi.fn(async () => {}),
    sendAdminApprovalEmail: vi.fn(async () => {}),
  }
})

const app = createApp()

afterAll(async () => {
  // Fixture emails use a domain the global setup does not clean (the @example.com
  // cleanup in a parallel test file could delete a user mid-test); remove them here.
  try {
    await query(`DELETE FROM users WHERE email LIKE '%@numerycode-test.local'`)
  } catch { /* cleanup is best-effort */ }
})

const validPolicyAcceptance = {
  termsAccepted: true,
  privacyPolicyAcknowledged: true,
  acceptableUseAccepted: true,
}

describe('Trainer Approval Lifecycle', () => {
  it('a newly registered trainer must verify their email AND be approved before they can log in', async () => {
    const email = `pending-trainer-${Date.now()}@numerycode-test.local`
    const mockVerificationEmail = vi.mocked(sendEmailVerificationEmail)
    mockVerificationEmail.mockClear()

    // 1. Register as trainer — registration emails a verification link immediately
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Pending Trainer', email, password: 'password123', role: 'trainer', ...validPolicyAcceptance,
    })
    expect(registerRes.status).toBe(201)
    expect(registerRes.body.data.pendingApproval).toBe(true)
    expect(registerRes.body.data.verificationEmailSent).toBe(true)
    expect(registerRes.body.data.token).toBeUndefined()

    expect(mockVerificationEmail).toHaveBeenCalledTimes(1)
    const verificationToken = mockVerificationEmail.mock.calls[0][2] as string
    expect(verificationToken).toBeTypeOf('string')

    // 2. Unverified + pending → no login (both reasons reported)
    let blockedLogin = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(blockedLogin.status).toBe(401)
    expect(blockedLogin.body.message).toMatch(/awaiting admin approval/i)

    // 3. Clicking the emailed link verifies the email address
    const verifyRes = await request(app).post('/api/auth/verify-email').send({ token: verificationToken })
    expect(verifyRes.status).toBe(200)

    const { rows: verifiedRows } = await query<{ account_activated: boolean; email_verified_at: Date | null }>(
      'SELECT account_activated, email_verified_at FROM users WHERE email = $1', [email]
    )
    expect(verifiedRows[0].account_activated).toBe(true)
    expect(verifiedRows[0].email_verified_at).not.toBeNull()

    // 4. Admin approval is still required — login stays blocked
    blockedLogin = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(blockedLogin.status).toBe(401)
    expect(blockedLogin.body.message).toMatch(/awaiting admin approval/i)

    // 5. Admin logs in and approves
    const adminLogin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numerycode.com', password: 'password123' })
    const adminToken = adminLogin.body.data.token

    const usersRes = await request(app).get('/api/admin/users').set({ Authorization: `Bearer ${adminToken}` })
    const pendingUser = usersRes.body.data.find((u: { email: string }) => u.email === email)
    expect(pendingUser.status).toBe('pending')

    const approveRes = await request(app)
      .patch(`/api/admin/users/${pendingUser.id}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({ status: 'active' })
    expect(approveRes.status).toBe(200)
    expect(approveRes.body.data.status).toBe('active')

    // Already verified → no second activation link is emailed; the
    // "approved, you can log in" notice is sent instead.
    expect(vi.mocked(sendActivationEmail)).not.toHaveBeenCalled()
    expect(vi.mocked(sendAccountApprovedEmail)).toHaveBeenCalledTimes(1)

    // 6. Now the trainer can log in
    const successLogin = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(successLogin.status).toBe(200)
    expect(successLogin.body.data.user.role).toBe('trainer')
    expect(successLogin.body.data.token).toBeTypeOf('string')
  })

  it('admin approval alone does NOT verify the email — the emailed link is still required', async () => {
    const email = `approve-unverified-${Date.now()}@numerycode-test.local`
    await request(app).post('/api/auth/register').send({
      name: 'Unverified Approve', email, password: 'password123', role: 'trainer', ...validPolicyAcceptance,
    })

    const adminLogin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numerycode.com', password: 'password123' })
    const adminToken = adminLogin.body.data.token
    const usersRes = await request(app).get('/api/admin/users').set({ Authorization: `Bearer ${adminToken}` })
    const user = usersRes.body.data.find((u: { email: string }) => u.email === email)

    const mockActivation = vi.mocked(sendActivationEmail)
    mockActivation.mockClear()
    await request(app).patch(`/api/admin/users/${user.id}`).set({ Authorization: `Bearer ${adminToken}` }).send({ status: 'active' })

    // Approval issues a FRESH verification link (7 days) for the unverified account…
    expect(mockActivation).toHaveBeenCalledTimes(1)
    const rawToken = mockActivation.mock.calls[0][3] as string

    // …and login stays blocked until that link is clicked.
    const blocked = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(blocked.status).toBe(401)
    expect(blocked.body.message).toMatch(/not been verified/i)

    // Clicking the approval link completes verification and unlocks login.
    const verify = await request(app).post('/api/auth/verify-email').send({ token: rawToken })
    expect(verify.status).toBe(200)
    const ok = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(ok.status).toBe(200)
  })

  it('admin can suspend an active trainer, blocking further login', async () => {
    const email = `suspend-test-${Date.now()}@example.com`
    await request(app).post('/api/auth/register').send({
      name: 'To Suspend', email, password: 'password123', role: 'trainer', ...validPolicyAcceptance,
    })

    const adminLogin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numerycode.com', password: 'password123' })
    const adminToken = adminLogin.body.data.token

    const usersRes = await request(app).get('/api/admin/users').set({ Authorization: `Bearer ${adminToken}` })
    const user = usersRes.body.data.find((u: { email: string }) => u.email === email)

    // Approve then immediately suspend
    await request(app).patch(`/api/admin/users/${user.id}`).set({ Authorization: `Bearer ${adminToken}` }).send({ status: 'active' })
    await request(app).patch(`/api/admin/users/${user.id}`).set({ Authorization: `Bearer ${adminToken}` }).send({ status: 'suspended' })

    const blockedLogin = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(blockedLogin.status).toBe(401)
    expect(blockedLogin.body.message).toMatch(/suspended/i)
  })

  it('rejects an invalid status value', async () => {
    const adminLogin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numerycode.com', password: 'password123' })
    const adminToken = adminLogin.body.data.token
    const usersRes = await request(app).get('/api/admin/users').set({ Authorization: `Bearer ${adminToken}` })
    const anyUser = usersRes.body.data[0]

    const res = await request(app)
      .patch(`/api/admin/users/${anyUser.id}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({ status: 'not-a-real-status' })
    expect(res.status).toBe(400)
  })
})
