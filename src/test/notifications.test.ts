import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'

const app = createApp()
let adminToken: string

beforeAll(async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'emmanuel@numericode.com', password: 'password123' })
  adminToken = res.body.data.token
})
const auth = () => ({ Authorization: `Bearer ${adminToken}` })

describe('Notifications', () => {
  it('GET /api/notifications returns unreadCount and a list', async () => {
    const res = await request(app).get('/api/notifications').set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('unreadCount')
    expect(Array.isArray(res.body.data.notifications)).toBe(true)
  })

  it('requires authentication', async () => {
    const res = await request(app).get('/api/notifications')
    expect(res.status).toBe(401)
  })

  it('a new trainer registration creates a notification for every admin', async () => {
    const before = await request(app).get('/api/notifications').set(auth())
    const beforeCount = before.body.data.unreadCount

    await request(app).post('/api/auth/register').send({
      name: 'Notify Test Trainer', email: `notify-trainer-${Date.now()}@example.com`,
      password: 'password123', role: 'trainer',
    })

    const after = await request(app).get('/api/notifications').set(auth())
    expect(after.body.data.unreadCount).toBeGreaterThan(beforeCount)
    expect(after.body.data.notifications[0].type).toBe('trainer_approval')
  })

  it('PATCH /api/notifications/:id/read marks a single notification read', async () => {
    const list = await request(app).get('/api/notifications').set(auth())
    const unread = list.body.data.notifications.find((n: { isRead: boolean }) => !n.isRead)
    expect(unread).toBeDefined()

    const res = await request(app).patch(`/api/notifications/${unread.id}/read`).set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data.isRead).toBe(true)
  })

  it('PATCH /api/notifications/read-all clears unreadCount to 0', async () => {
    const res = await request(app).patch('/api/notifications/read-all').set(auth())
    expect(res.status).toBe(200)

    const after = await request(app).get('/api/notifications').set(auth())
    expect(after.body.data.unreadCount).toBe(0)
  })

  it('returns 404 for marking a nonexistent notification as read', async () => {
    const res = await request(app)
      .patch('/api/notifications/00000000-0000-0000-0000-000000000000/read')
      .set(auth())
    expect(res.status).toBe(404)
  })
})
