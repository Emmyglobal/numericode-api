import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { query } from '../db/pool'
import { app, F, auth, countRows, setupPhaseB, teardownPhaseB, UNKNOWN_UUID, NOT_A_UUID } from './phaseB.helpers'
beforeAll(setupPhaseB)
afterAll(teardownPhaseB)
const threadPath = (id: string) => `/api/forums/forum/threads/${id}`
const categoryPath = (id: string) => `/api/forums/forum/categories/${id}`
const postPath = (t: string, p: string) => `/api/forums/forum/threads/${t}/posts/${p}`
async function createThread(token: string, title: string) {
  const res = await request(app).post('/api/forums/forum/threads').set(auth(token)).send({ categoryId: F.forumCategoryA, title, body: 'phaseB body' })
  expect(res.status).toBe(201)
  return res.body.data.id as string
}
async function createPost(token: string, threadId: string, body: string) {
  const res = await request(app).post(`/api/forums/forum/threads/${threadId}/posts`).set(auth(token)).send({ body })
  expect(res.status).toBe(201)
  return res.body.data.id as string
}
describe('forums category ownership', () => {
  it('rejects unauthenticated forum writes with 401', async () => {
    expect((await request(app).post('/api/forums/forum/categories').send({ name: 'x' })).status).toBe(401)
    expect((await request(app).put(categoryPath(F.forumCategoryA)).send({ name: 'x' })).status).toBe(401)
    expect((await request(app).delete(threadPath(F.threadByStudent))).status).toBe(401)
    expect((await request(app).post(`/api/forums/forum/threads/${F.threadByStudent}/posts`).send({ body: 'x' })).status).toBe(401)
  })
  it('lets an enrolled student READ categories but not CREATE one', async () => {
    const list = await request(app).get(`/api/forums/courses/${F.courseA}/forum/categories`).set(auth(F.studentToken))
    expect(list.status).toBe(200)
    const create = await request(app).post('/api/forums/forum/categories').set(auth(F.studentToken)).send({ courseId: F.courseA, name: 'Student category' })
    expect(create.status).toBe(403)
    expect(await countRows("SELECT COUNT(*) n FROM forum_categories WHERE name='Student category'")).toBe(0)
  })
  it('blocks a trainer from creating a category on another course', async () => {
    const before = await countRows('SELECT COUNT(*) n FROM forum_categories WHERE course_id=$1', [F.courseA])
    const res = await request(app).post('/api/forums/forum/categories').set(auth(F.intruderToken)).send({ courseId: F.courseA, name: 'Intruder category' })
    expect(res.status).toBe(403)
    expect(await countRows('SELECT COUNT(*) n FROM forum_categories WHERE course_id=$1', [F.courseA])).toBe(before)
  })
  it('lets the owner create a category but never into a missing course', async () => {
    const own = await request(app).post('/api/forums/forum/categories').set(auth(F.ownerToken)).send({ courseId: F.courseA, name: 'Owner phaseB category' })
    expect(own.status).toBe(201)
    expect(own.body.data.courseId).toBe(F.courseA)
    expect((await request(app).post('/api/forums/forum/categories').set(auth(F.ownerToken)).send({ courseId: UNKNOWN_UUID, name: 'Ghost' })).status).toBe(404)
    expect((await request(app).post('/api/forums/forum/categories').set(auth(F.studentToken)).send({ name: 'Global by student' })).status).toBe(403)
    const g = await request(app).post('/api/forums/forum/categories').set(auth(F.adminToken)).send({ name: 'PhaseB global category' })
    expect(g.status).toBe(201)
    await request(app).delete(categoryPath(g.body.data.id)).set(auth(F.adminToken))
  })
  it('renames only through the owning instructor', async () => {
    expect((await request(app).put(categoryPath(F.forumCategoryA)).set(auth(F.intruderToken)).send({ name: 'Hijacked' })).status).toBe(403)
    const { rows } = await query('SELECT name FROM forum_categories WHERE id=$1', [F.forumCategoryA])
    expect(rows[0].name).not.toBe('Hijacked')
    expect((await request(app).put(categoryPath(F.forumCategoryA)).set(auth(F.ownerToken)).send({ description: 'd' })).status).toBe(200)
    expect((await request(app).put(categoryPath(UNKNOWN_UUID)).set(auth(F.ownerToken)).send({ description: 'g' })).status).toBe(404)
    expect((await request(app).put(categoryPath(NOT_A_UUID)).set(auth(F.ownerToken)).send({ description: 'g' })).status).toBe(404)
  })
  it('deletes only through the owning instructor', async () => {
    const scratch = (await request(app).post('/api/forums/forum/categories').set(auth(F.ownerToken)).send({ courseId: F.courseA, name: 'PhaseB scratch' })).body.data.id as string
    expect((await request(app).delete(categoryPath(scratch)).set(auth(F.studentToken))).status).toBe(403)
    expect((await request(app).delete(categoryPath(scratch)).set(auth(F.intruderToken))).status).toBe(403)
    expect(await countRows('SELECT COUNT(*) n FROM forum_categories WHERE id=$1', [scratch])).toBe(1)
    expect((await request(app).delete(categoryPath(scratch)).set(auth(F.ownerToken))).status).toBe(200)
    expect(await countRows('SELECT COUNT(*) n FROM forum_categories WHERE id=$1', [scratch])).toBe(0)
  })
})
describe('forums thread and post authorship', () => {
  it('edits a thread only as its author or an admin', async () => {
    const tid = await createThread(F.studentToken, 'PhaseB author thread')
    expect((await request(app).put(threadPath(tid)).set(auth(F.otherStudentToken)).send({ title: 'Hijack' })).status).toBe(403)
    expect((await request(app).put(threadPath(tid)).set(auth(F.ownerToken)).send({ title: 'Rewrite' })).status).toBe(403)
    const { rows } = await query('SELECT title FROM forum_threads WHERE id=$1', [tid])
    expect(rows[0].title).toBe('PhaseB author thread')
    expect((await request(app).put(threadPath(tid)).set(auth(F.studentToken)).send({ title: 'Edited' })).status).toBe(200)
    expect((await request(app).put(threadPath(tid)).set(auth(F.adminToken)).send({ title: 'Moderated' })).status).toBe(200)
    expect((await request(app).put(threadPath(UNKNOWN_UUID)).set(auth(F.adminToken)).send({ title: 'Ghost' })).status).toBe(404)
  })
  it('deletes a thread only as its author or an admin', async () => {
    const tid = await createThread(F.studentToken, 'PhaseB deletable')
    expect((await request(app).delete(threadPath(tid)).set(auth(F.otherStudentToken))).status).toBe(403)
    expect((await request(app).delete(threadPath(tid)).set(auth(F.ownerToken))).status).toBe(403)
    expect((await request(app).delete(threadPath(tid)).set(auth(F.studentToken))).status).toBe(200)
    expect(await countRows('SELECT COUNT(*) n FROM forum_threads WHERE id=$1', [tid])).toBe(0)
    const at = await createThread(F.otherStudentToken, 'PhaseB admindel')
    expect((await request(app).delete(threadPath(at)).set(auth(F.adminToken))).status).toBe(200)
    expect((await request(app).delete(threadPath(UNKNOWN_UUID)).set(auth(F.adminToken))).status).toBe(404)
  })
  it('binds a post to its parent and only the author may change it', async () => {
    const tid = await createThread(F.studentToken, 'PhaseB post thread')
    const pid = await createPost(F.otherStudentToken, tid, 'PhaseB reply')
    expect((await request(app).put(postPath(F.threadByStudent, pid)).set(auth(F.otherStudentToken)).send({ body: 'moved' })).status).toBe(404)
    expect((await request(app).put(postPath(tid, pid)).set(auth(F.studentToken)).send({ body: 'rewritten' })).status).toBe(403)
    const { rows } = await query('SELECT body FROM forum_posts WHERE id=$1', [pid])
    expect(rows[0].body).toBe('PhaseB reply')
    expect((await request(app).put(postPath(tid, pid)).set(auth(F.otherStudentToken)).send({ body: 'edited' })).status).toBe(200)
    expect((await request(app).put(postPath(tid, pid)).set(auth(F.otherStudentToken)).send({ body: 'x', isSolution: true })).status).toBe(403)
    const sol = await request(app).put(postPath(tid, pid)).set(auth(F.studentToken)).send({ isSolution: true })
    expect(sol.status).toBe(200)
    expect(sol.body.data.isSolution).toBe(true)
    expect((await request(app).delete(postPath(tid, pid)).set(auth(F.studentToken))).status).toBe(403)
    expect((await request(app).delete(postPath(tid, pid)).set(auth(F.otherStudentToken))).status).toBe(200)
    await request(app).delete(threadPath(tid)).set(auth(F.studentToken))
  })
})
