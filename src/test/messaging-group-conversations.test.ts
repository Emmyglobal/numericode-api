import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { query } from '../db/pool'

// ─────────────────────────────────────────────────────────────────────────────
// Focused regression test for POST /api/group-conversations.
//
// PATH NOTE: messaging.routes.ts declares `POST /group-conversations` and
// app.ts mounts that router at '/api', so the live endpoint is
// /api/group-conversations ('/api/messaging/…' is not mounted anywhere).
//
// THE BUG THIS PINS: the controller acquired its transaction client with
//   `const client = await req.app.locals.dbClient || getClient()`
// which parses as `(await dbClient) || getClient()` — the fallback branch is a
// *Promise*, so `client.query` / `client.release` did not exist and every
// authenticated call answered 500 ("client.query is not a function" /
// "client.release is not a function"). grading.controller.ts carries the same
// fix; these assertions fail (500) if it is reverted or reintroduced here.
//
// Fixtures are the shared users created by src/test/setup.ts against the
// isolated test database guarded by src/test/dbGuard.ts — nothing here depends
// on the Phase B authorization fixtures.
// ─────────────────────────────────────────────────────────────────────────────

const app = createApp()
const PASSWORD = 'password123'
const PATH = '/api/group-conversations'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const createdConversationIds: string[] = []

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

async function login(email: string): Promise<string> {
  const res = await request(app).post('/api/auth/login').send({ email, password: PASSWORD })
  if (res.status !== 200) throw new Error(`login failed for ${email}: ${JSON.stringify(res.body)}`)
  return res.body.data.token as string
}

async function userIdByEmail(email: string): Promise<string> {
  const { rows } = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', [email])
  if (!rows.length) throw new Error(`fixture user missing: ${email}`)
  return rows[0].id
}

async function countRows(sql: string, params: unknown[] = []): Promise<number> {
  const { rows } = await query<{ n: string | number }>(sql, params)
  return Number(rows[0].n)
}

async function createConversation(body: Record<string, unknown>, token: string) {
  const res = await request(app).post(PATH).set(auth(token)).send(body)
  if (res.status === 201) createdConversationIds.push(res.body.data.id as string)
  return res
}

let creatorToken: string
let creatorId: string
let memberId: string
let courseId: string

beforeAll(async () => {
  creatorToken = await login('kolade@gmail.com')
  creatorId = await userIdByEmail('kolade@gmail.com')
  memberId = await userIdByEmail('amaka@gmail.com')
  const { rows } = await query<{ id: string }>('SELECT id FROM courses ORDER BY created_at LIMIT 1')
  if (!rows.length) throw new Error('no course available for the course-scoped fixture')
  courseId = rows[0].id
})

afterAll(async () => {
  for (const id of createdConversationIds) {
    await query('DELETE FROM group_messages WHERE conversation_id = $1', [id])
    await query('DELETE FROM group_conversation_members WHERE conversation_id = $1', [id])
    await query('DELETE FROM group_conversations WHERE id = $1', [id])
  }
})

describe('POST /api/group-conversations', () => {
  it('rejects unauthenticated callers with 401', async () => {
    expect((await request(app).post(PATH).send({ title: 'x', memberIds: [] })).status).toBe(401)
    expect((await request(app).post(PATH).set(auth('not-a-token')).send({ title: 'x' })).status).toBe(401)
  })

  it('requires a title', async () => {
    expect((await createConversation({ memberIds: [memberId] }, creatorToken)).status).toBe(400)
  })

  it('creates the conversation through a resolved transaction client', async () => {
    const title = `MC regression ${Date.now()}`
    const res = await createConversation({ title, memberIds: [memberId] }, creatorToken)

    // The regression: this used to be 500 because the client was a Promise.
    expect(res.status).toBe(201)
    expect(res.body.data.id).toMatch(UUID_RE)
    expect(res.body.data.title).toBe(title)
    expect(res.body.data.createdBy).toBe(creatorId)

    // The transaction really committed: conversation + both members persisted.
    expect(await countRows('SELECT COUNT(*) n FROM group_conversations WHERE id = $1', [res.body.data.id])).toBe(1)
    expect(await countRows(
      'SELECT COUNT(*) n FROM group_conversation_members WHERE conversation_id = $1',
      [res.body.data.id]
    )).toBe(2)
    expect(await countRows(
      'SELECT COUNT(*) n FROM group_conversation_members WHERE conversation_id = $1 AND user_id = $2',
      [res.body.data.id, memberId]
    )).toBe(1)

    // …and it is readable back through the same pool.
    const list = await request(app).get(PATH).set(auth(creatorToken))
    expect(list.status).toBe(200)
    expect((list.body.data as Array<{ id: string }>).map(c => c.id)).toContain(res.body.data.id)
  })

  it('creates a course-scoped conversation', async () => {
    const res = await createConversation({ courseId, title: `MC course ${Date.now()}`, memberIds: [] }, creatorToken)
    expect(res.status).toBe(201)
    expect(res.body.data.courseId).toBe(courseId)
    expect(await countRows(
      'SELECT COUNT(*) n FROM group_conversation_members WHERE conversation_id = $1',
      [res.body.data.id]
    )).toBe(1)
  })

  it('returns its pooled client on every call (no connection leak)', async () => {
    // The pool caps at 10 connections; a client that is never released would
    // make later calls hang until they time out. Creating more conversations
    // than the pool size proves each call handed its client back.
    for (let i = 0; i < 12; i++) {
      const res = await createConversation({ title: `MC pool ${Date.now()}-${i}`, memberIds: [] }, creatorToken)
      expect(res.status).toBe(201)
    }
    expect(await countRows('SELECT COUNT(*) n FROM group_conversations WHERE created_by = $1', [creatorId]))
      .toBeGreaterThanOrEqual(13)
  })
})
