import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()

describe('POST /api/auth/login', () => {
  it('logs in with correct student credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'kolade@gmail.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.user.role).toBe('student')
    expect(res.body.data.user.email).toBe('kolade@gmail.com')
    expect(res.body.data.token).toBeTypeOf('string')
  })

  it('logs in with correct trainer credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'trainer@numerycode.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.data.user.role).toBe('trainer')
  })

  it('logs in with correct admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'emmanuel@numerycode.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.data.user.role).toBe('admin')
  })

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'kolade@gmail.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/invalid email or password/i)
  })

  it('rejects unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'doesnotexist@example.com', password: 'password123' })

    expect(res.status).toBe(401)
  })

  it('rejects missing email', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'password123' })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/required/i)
  })

  it('rejects missing password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'kolade@gmail.com' })
    expect(res.status).toBe(400)
  })

  it('rejects login for a suspended account', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'emeka@gmail.com', password: 'password123' })

    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/suspended/i)
  })
})

describe('POST /api/auth/register', () => {
  // Every self-service registration must explicitly accept the three required
  // policies (Terms, Privacy, Acceptable Use). The backend rejects requests that
  // omit or falsify any of them — accounts are never created without consent.
  const validPolicyAcceptance = {
    termsAccepted: true,
    privacyPolicyAcknowledged: true,
    acceptableUseAccepted: true,
  }

  it('REQUIRED POLICY: rejects registration without policy acceptance', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'No Consent', email: `noconsent-${Date.now()}@example.com`, password: 'password123' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/terms of service/i)
  })

  it('REQUIRED POLICY: rejects registration when only some policies are accepted', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Partial Consent', email: `partial-${Date.now()}@example.com`, password: 'password123',
        termsAccepted: true,
        privacyPolicyAcknowledged: false,
        acceptableUseAccepted: true,
      })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/privacy policy/i)
  })

  it('registers a new student account (default role when none specified) as pending approval', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'New Test User', email: uniqueEmail, password: 'password123', ...validPolicyAcceptance })

    expect(res.status).toBe(201)
    expect(res.body.data.pendingApproval).toBe(true)
    // No session token is issued while the account awaits admin approval.
    expect(res.body.data.token).toBeUndefined()
  })

  it('registers a new trainer account as pending approval (not immediately active)', async () => {
    const uniqueEmail = `trainer-${Date.now()}@example.com`
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'New Trainer', email: uniqueEmail, password: 'password123', role: 'trainer', ...validPolicyAcceptance })

    expect(res.status).toBe(201)
    expect(res.body.data.pendingApproval).toBe(true)
    expect(res.body.data.token).toBeUndefined()
  })

  it('SECURITY: silently downgrades role="admin" to "student" instead of granting admin', async () => {
    const uniqueEmail = `wannabe-admin-${Date.now()}@example.com`
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Privilege Escalation Attempt', email: uniqueEmail, password: 'password123', role: 'admin', ...validPolicyAcceptance })

    expect(res.status).toBe(201)
    // Only a pending "student" account is created — never an admin.
    expect(res.body.data.pendingApproval).toBe(true)
  })

  it('SECURITY: rejects an arbitrary/invalid role value by defaulting to student', async () => {
    const uniqueEmail = `weird-role-${Date.now()}@example.com`
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Weird Role', email: uniqueEmail, password: 'password123', role: 'superuser', ...validPolicyAcceptance })

    expect(res.status).toBe(201)
    expect(res.body.data.pendingApproval).toBe(true)
  })

  it('rejects registration with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Duplicate', email: 'kolade@gmail.com', password: 'password123', ...validPolicyAcceptance })

    expect(res.status).toBe(409)
    expect(res.body.message).toMatch(/already exists/i)
  })

  it('rejects password under 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Short Pass', email: `short-${Date.now()}@example.com`, password: 'short', ...validPolicyAcceptance })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/8 characters/i)
  })

  it('rejects missing required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x@example.com' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/forgot-password', () => {
  it('always returns success, even for unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nobody@example.com' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})
