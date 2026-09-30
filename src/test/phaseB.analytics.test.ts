import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app, F, auth, countRows, setupPhaseB, teardownPhaseB, UNKNOWN_UUID, NOT_A_UUID } from './phaseB.helpers'
beforeAll(setupPhaseB)
afterAll(teardownPhaseB)
const track = (t: string | null, b: object) => { const r = request(app).post('/api/analytics/track').send(b); return t ? r.set(auth(t)) : r }
const engagement = (t: string | null, c: string) => { const r = request(app).get(`/api/analytics/courses/${c}/engagement`); return t ? r.set(auth(t)) : r }
describe('analytics object authz', () => {
  it('rejects unauthenticated analytics with 401', async () => {
    expect((await engagement(null, F.courseA)).status).toBe(401)
    expect((await track(null, { courseId: F.courseA, timeSpent: 60 })).status).toBe(401)
  })
  it('records activity only for a course the caller belongs to', async () => {
    expect((await track(F.studentToken, { courseId: F.courseA, timeSpent: 60, interactions: 2 })).status).toBe(200)
    expect((await track(F.studentToken, { courseId: F.courseA, timeSpent: 60, lessonId: F.lessonB })).status).toBe(400)
    expect((await track(F.otherStudentToken, { courseId: F.courseA, timeSpent: 60 })).status).toBe(403)
    expect(await countRows('SELECT COUNT(*) n FROM learning_analytics WHERE user_id=$1 AND course_id=$2', [F.otherStudentId, F.courseA])).toBe(0)
    expect((await track(F.ownerToken, { courseId: F.courseA, timeSpent: 60 })).status).toBe(200)
    expect((await track(F.intruderToken, { courseId: F.courseA, timeSpent: 60 })).status).toBe(403)
    expect((await track(F.ownerToken, { courseId: UNKNOWN_UUID, timeSpent: 60 })).status).toBe(404)
    // The own-scope read must be filtered by the *caller's* id: the same course
    // read by a different student shows none of the first student's activity.
    const mine = await request(app).get(`/api/analytics/courses/${F.courseA}`).set(auth(F.studentToken))
    expect(mine.status).toBe(200)
    expect(mine.body.data.courseId).toBe(F.courseA)
    expect(Number(mine.body.data.totalTimeSpent)).toBeGreaterThan(0)
    const other = await request(app).get(`/api/analytics/courses/${F.courseA}`).set(auth(F.otherStudentToken))
    expect(other.status).toBe(200)
    expect(Number(other.body.data.totalTimeSpent)).toBe(0)
    expect(other.body.data.lessonAnalytics).toHaveLength(0)
  })
  it('exposes engagement report only to the course owner', async () => {
    expect((await engagement(F.studentToken, F.courseA)).status).toBe(403)
    expect((await engagement(F.otherStudentToken, F.courseA)).status).toBe(403)
    expect((await engagement(F.intruderToken, F.courseA)).status).toBe(403)
    expect((await engagement(F.ownerToken, F.courseA)).status).toBe(200)
    expect((await engagement(F.adminToken, F.courseA)).status).toBe(200)
    expect((await engagement(F.ownerToken, UNKNOWN_UUID)).status).toBe(404)
    expect((await engagement(F.ownerToken, NOT_A_UUID)).status).toBe(404)
  })
})
describe('drip content and prerequisites course-scoped', () => {
  const pathFor = (c: string) => `/api/courses/${c}/drip-content`
  const preFor = (c: string) => `/api/courses/${c}/prerequisites`
  const releaseDate = new Date(Date.now() + 864e5).toISOString()
  it('schedules drip only through the owning instructor', async () => {
    expect((await request(app).get(pathFor(F.courseA)).set(auth(F.studentToken))).status).toBe(200)
    expect((await request(app).post(pathFor(F.courseA)).set(auth(F.studentToken)).send({})).status).toBe(403)
    expect((await request(app).post(pathFor(F.courseA)).set(auth(F.intruderToken)).send({})).status).toBe(403)
    expect((await request(app).post(pathFor(F.courseA)).set(auth(F.ownerToken)).send({ moduleId: F.moduleB, releaseDate })).status).toBe(400)
    expect((await request(app).post(pathFor(F.courseA)).set(auth(F.ownerToken)).send({ lessonId: F.lessonB, releaseDate })).status).toBe(400)
    expect((await request(app).post(pathFor(F.courseA)).set(auth(F.ownerToken)).send({ courseId: F.courseB, moduleId: F.moduleA, releaseDate })).status).toBe(400)
    expect((await request(app).post(pathFor(F.courseA)).set(auth(F.ownerToken)).send({ moduleId: F.moduleA, releaseDate })).status).toBe(201)
    expect((await request(app).post(pathFor(UNKNOWN_UUID)).set(auth(F.adminToken)).send({ moduleId: F.moduleA, releaseDate })).status).not.toBe(201)
  })
  it('defines prerequisites only through the owning instructor', async () => {
    expect((await request(app).get(preFor(F.courseA)).set(auth(F.studentToken))).status).toBe(200)
    expect((await request(app).post(preFor(F.courseA)).set(auth(F.studentToken)).send({ prerequisiteId: F.courseB })).status).toBe(403)
    expect((await request(app).post(preFor(F.courseA)).set(auth(F.intruderToken)).send({ prerequisiteId: F.courseB })).status).toBe(403)
    expect((await request(app).post(preFor(F.courseA)).set(auth(F.ownerToken)).send({ courseId: F.courseB, prerequisiteId: F.courseB })).status).toBe(400)
    expect((await request(app).post(preFor(F.courseA)).set(auth(F.ownerToken)).send({ prerequisiteId: F.courseB })).status).toBe(201)
  })
})
