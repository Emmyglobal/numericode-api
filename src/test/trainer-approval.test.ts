import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()

describe('Trainer Approval Lifecycle', () => {
  it('a newly registered trainer is pending, cannot log in, admin approves, then they can log in', async () => {
    const email = `pending-trainer-${Date.now()}@example.com`

    // 1. Register as trainer
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Pending Trainer', email, password: 'password123', role: 'trainer',
    })
    expect(registerRes.status).toBe(201)
    expect(registerRes.body.data.pendingApproval).toBe(true)
    expect(registerRes.body.data.token).toBeUndefined()

    // 2. Cannot log in yet
    const blockedLogin = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(blockedLogin.status).toBe(401)
    expect(blockedLogin.body.message).toMatch(/awaiting admin approval/i)

    // 3. Admin logs in and approves
    const adminLogin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numericode.com', password: 'password123' })
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

    // 4. Now the trainer can log in
    const successLogin = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
    expect(successLogin.status).toBe(200)
    expect(successLogin.body.data.user.role).toBe('trainer')
    expect(successLogin.body.data.token).toBeTypeOf('string')
  })

  it('admin can suspend an active trainer, blocking further login', async () => {
    const email = `suspend-test-${Date.now()}@example.com`
    await request(app).post('/api/auth/register').send({ name: 'To Suspend', email, password: 'password123', role: 'trainer' })

    const adminLogin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numericode.com', password: 'password123' })
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
    const adminLogin = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numericode.com', password: 'password123' })
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
