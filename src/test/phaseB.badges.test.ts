import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { query } from '../db/pool'
import { app, F, auth, countRows, setupPhaseB, teardownPhaseB, UNKNOWN_UUID, NOT_A_UUID } from './phaseB.helpers'
beforeAll(setupPhaseB)
afterAll(teardownPhaseB)
describe('badges platform definitions admin-only', () => {
  it('rejects unauthenticated badge access with 401', async () => {
    expect((await request(app).get('/api/badges')).status).toBe(401)
    expect((await request(app).post('/api/badges').send({})).status).toBe(401)
    expect((await request(app).post('/api/badges/award').send({})).status).toBe(401)
    expect((await request(app).get('/api/certificate-templates')).status).toBe(401)
    expect((await request(app).post(`/api/assignments/${F.assignmentA}/late-penalty`).send({})).status).toBe(401)
  })
  it('keeps badge CRUD admin-only', async () => {
    const payload = { name: 'PB badge', description: 'x', criteria: { type: 'manual' } }
    expect((await request(app).post('/api/badges').set(auth(F.studentToken)).send(payload)).status).toBe(403)
    expect((await request(app).post('/api/badges').set(auth(F.ownerToken)).send(payload)).status).toBe(403)
    expect((await request(app).get('/api/badges').set(auth(F.studentToken))).status).toBe(200)
    const created = await request(app).post('/api/badges').set(auth(F.adminToken)).send(payload)
    expect(created.status).toBe(201)
    const nb = created.body.data.id as string
    expect((await request(app).put(`/api/badges/${nb}`).set(auth(F.ownerToken)).send({ name: 'Hijack' })).status).toBe(403)
    expect((await request(app).put(`/api/badges/${nb}`).set(auth(F.adminToken)).send({ name: 'Renamed' })).status).toBe(200)
    expect((await request(app).delete(`/api/badges/${nb}`).set(auth(F.ownerToken))).status).toBe(403)
    expect(await countRows('SELECT COUNT(*) n FROM badges WHERE id=$1', [nb])).toBe(1)
    expect((await request(app).delete(`/api/badges/${nb}`).set(auth(F.adminToken))).status).toBe(200)
    expect(await countRows('SELECT COUNT(*) n FROM badges WHERE id=$1', [nb])).toBe(0)
    expect((await request(app).put(`/api/badges/${UNKNOWN_UUID}`).set(auth(F.adminToken)).send({ name: 'Ghost' })).status).toBe(404)
    // Malformed ids are 404s, never a driver error.
    expect((await request(app).put(`/api/badges/${NOT_A_UUID}`).set(auth(F.adminToken)).send({ name: 'Ghost' })).status).toBe(404)
    expect((await request(app).delete(`/api/badges/${NOT_A_UUID}`).set(auth(F.adminToken))).status).toBe(404)
  })
  it('awards badges only inside an instructed course', async () => {
    const award = (t: string, b: object) => request(app).post('/api/badges/award').set(auth(t)).send(b)
    expect((await award(F.studentToken, { userId: F.studentId, badgeId: F.badgeId })).status).toBe(403)
    expect((await award(F.studentToken, { userId: F.studentId, badgeId: F.badgeId, courseId: F.courseA })).status).toBe(403)
    expect((await award(F.intruderToken, { userId: F.studentId, badgeId: F.badgeId, courseId: F.courseA })).status).toBe(403)
    expect((await award(F.intruderToken, { userId: F.studentId, badgeId: F.badgeId, courseId: UNKNOWN_UUID })).status).toBe(404)
    const own = await award(F.ownerToken, { userId: F.studentId, badgeId: F.badgeId, courseId: F.courseA })
    expect(own.status).toBe(201)
    expect(own.body.data.userId).toBe(F.studentId)
    expect((await award(F.adminToken, { userId: F.studentId, badgeId: UNKNOWN_UUID, courseId: F.courseA })).status).toBe(404)
    expect((await award(F.adminToken, { userId: UNKNOWN_UUID, badgeId: F.badgeId, courseId: F.courseA })).status).toBe(404)
    expect((await award(F.adminToken, { userId: F.studentId, badgeId: NOT_A_UUID, courseId: F.courseA })).status).toBe(404)
    expect((await award(F.adminToken, { userId: NOT_A_UUID, badgeId: F.badgeId, courseId: F.courseA })).status).toBe(404)
    // A malformed course id is a 404 for an admin too — never a 500 from the driver.
    expect((await award(F.adminToken, { userId: F.studentId, badgeId: F.badgeId, courseId: NOT_A_UUID })).status).toBe(404)
    expect((await award(F.adminToken, { userId: F.studentId, badgeId: F.badgeId, courseId: F.courseB })).status).toBe(201)
    expect((await request(app).get('/api/my/badges').set(auth(F.studentToken))).status).toBe(200)
  })
  it('keeps certificate templates admin-only', async () => {
    const payload = { name: 'PB tpl', htmlTemplate: '<h1>x</h1>' }
    expect((await request(app).post('/api/certificate-templates').set(auth(F.ownerToken)).send(payload)).status).toBe(403)
    const created = await request(app).post('/api/certificate-templates').set(auth(F.adminToken)).send(payload)
    expect(created.status).toBe(201)
    expect((await request(app).get('/api/certificate-templates').set(auth(F.studentToken))).status).toBe(200)
    expect((await request(app).put(`/api/certificate-templates/${NOT_A_UUID}`).set(auth(F.adminToken)).send({ name: 'x' })).status).toBe(404)
    expect((await request(app).delete(`/api/certificate-templates/${NOT_A_UUID}`).set(auth(F.adminToken))).status).toBe(404)
    await query('DELETE FROM certificate_templates WHERE id=$1', [created.body.data.id])
  })
})
describe('late penalty assignment ownership', () => {
  const pathFor = (a: string) => `/api/assignments/${a}/late-penalty`
  const payload = { penaltyPerHour: 2, maxPenalty: 20, gracePeriod: 15 }
  it('reads openly but writes only through the owning instructor', async () => {
    expect((await request(app).get(pathFor(F.assignmentA)).set(auth(F.studentToken))).status).toBe(200)
    expect((await request(app).post(pathFor(F.assignmentA)).set(auth(F.studentToken)).send(payload)).status).toBe(403)
    expect((await request(app).post(pathFor(F.assignmentA)).set(auth(F.intruderToken)).send(payload)).status).toBe(403)
    expect(await countRows('SELECT COUNT(*) n FROM late_submission_penalties WHERE assignment_id=$1', [F.assignmentA])).toBe(0)
    const own = await request(app).post(pathFor(F.assignmentA)).set(auth(F.ownerToken)).send(payload)
    expect(own.status).toBe(200)
    expect(own.body.data.assignmentId).toBe(F.assignmentA)
    expect((await request(app).post(pathFor(UNKNOWN_UUID)).set(auth(F.ownerToken)).send(payload)).status).toBe(404)
    expect((await request(app).post(pathFor(NOT_A_UUID)).set(auth(F.ownerToken)).send(payload)).status).toBe(404)
    expect((await request(app).delete(pathFor(F.assignmentA)).set(auth(F.intruderToken))).status).toBe(403)
    expect((await request(app).delete(pathFor(F.assignmentA)).set(auth(F.ownerToken))).status).toBe(200)
    expect(await countRows('SELECT COUNT(*) n FROM late_submission_penalties WHERE assignment_id=$1', [F.assignmentA])).toBe(0)
  })
})
