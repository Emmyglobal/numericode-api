import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { query } from '../db/pool'
import { app, F, auth, countRows, setupPhaseB, teardownPhaseB, UNKNOWN_UUID, NOT_A_UUID } from './phaseB.helpers'
beforeAll(setupPhaseB)
afterAll(teardownPhaseB)
const rubricsPath = (a: string) => `/api/grading/assignments/${a}/rubrics`
const rubricPath = (r: string) => `/api/grading/rubrics/${r}`
const scoresPath = (s: string) => `/api/grading/submissions/${s}/rubric-scores`
const newRubric = (n = 'PB owner rubric') => ({ criteriaName: n, maxScore: 10 })
describe('grading rubric ownership', () => {
  it('rejects unauthenticated grading access with 401', async () => {
    expect((await request(app).get(rubricsPath(F.assignmentA))).status).toBe(401)
    expect((await request(app).post(rubricsPath(F.assignmentA)).send({})).status).toBe(401)
    expect((await request(app).put(rubricPath(F.rubricA)).send({})).status).toBe(401)
    expect((await request(app).get(`/api/grading/courses/${F.courseA}/grade-report`)).status).toBe(401)
  })
  it('lists and creates rubrics only through the owning instructor', async () => {
    expect((await request(app).get(rubricsPath(F.assignmentA)).set(auth(F.studentToken))).status).toBe(403)
    expect((await request(app).get(rubricsPath(F.assignmentA)).set(auth(F.intruderToken))).status).toBe(403)
    expect((await request(app).get(rubricsPath(F.assignmentA)).set(auth(F.ownerToken))).status).toBe(200)
    expect((await request(app).get(rubricsPath(UNKNOWN_UUID)).set(auth(F.ownerToken))).status).toBe(404)
    expect((await request(app).post(rubricsPath(F.assignmentA)).set(auth(F.studentToken)).send(newRubric())).status).toBe(403)
    expect((await request(app).post(rubricsPath(F.assignmentA)).set(auth(F.intruderToken)).send(newRubric())).status).toBe(403)
    expect((await request(app).post(rubricsPath(F.assignmentA)).set(auth(F.ownerToken)).send({ assignmentId: F.assignmentB, ...newRubric() })).status).toBe(400)
    const created = await request(app).post(rubricsPath(F.assignmentA)).set(auth(F.ownerToken)).send(newRubric())
    expect(created.status).toBe(201)
    expect(created.body.data.assignmentId).toBe(F.assignmentA)
    await request(app).delete(rubricPath(created.body.data.id)).set(auth(F.ownerToken))
  })
  it('rewrites a rubric only through the owning instructor', async () => {
    expect((await request(app).put(rubricPath(F.rubricA)).set(auth(F.intruderToken)).send({ criteriaName: 'Hijack' })).status).toBe(403)
    const { rows } = await query('SELECT criteria_name FROM grading_rubrics WHERE id=$1', [F.rubricA])
    expect(rows[0].criteria_name).toBe('RA')
    expect((await request(app).put(rubricPath(F.rubricB)).set(auth(F.ownerToken)).send({ criteriaName: 'x' })).status).toBe(403)
    expect((await request(app).put(rubricPath(F.rubricA)).set(auth(F.ownerToken)).send({ criteriaName: 'RA edited' })).status).toBe(200)
    expect((await request(app).put(rubricPath(UNKNOWN_UUID)).set(auth(F.ownerToken)).send({ criteriaName: 'x' })).status).toBe(404)
    expect((await request(app).put(rubricPath(NOT_A_UUID)).set(auth(F.ownerToken)).send({ criteriaName: 'x' })).status).toBe(404)
  })
  it('deletes a rubric only through the owning instructor', async () => {
    const c = (await request(app).post(rubricsPath(F.assignmentA)).set(auth(F.ownerToken)).send(newRubric('PB doomed'))).body.data.id as string
    expect((await request(app).delete(rubricPath(c)).set(auth(F.intruderToken))).status).toBe(403)
    expect(await countRows('SELECT COUNT(*) n FROM grading_rubrics WHERE id=$1', [c])).toBe(1)
    expect((await request(app).delete(rubricPath(c)).set(auth(F.ownerToken))).status).toBe(200)
    expect(await countRows('SELECT COUNT(*) n FROM grading_rubrics WHERE id=$1', [c])).toBe(0)
  })
})
describe('rubric scores stay inside their course', () => {
  it('grades only through the owner with its own rubrics', async () => {
    expect((await request(app).post(scoresPath(F.submissionA)).set(auth(F.studentToken)).send({ scores: [] })).status).toBe(403)
    expect((await request(app).post(scoresPath(F.submissionA)).set(auth(F.intruderToken)).send({ scores: [{ rubricId: F.rubricA, score: 9 }] })).status).toBe(403)
    expect(await countRows('SELECT COUNT(*) n FROM rubric_scores WHERE submission_id=$1', [F.submissionA])).toBe(0)
    expect((await request(app).post(scoresPath(F.submissionA)).set(auth(F.ownerToken)).send({ scores: [{ rubricId: F.rubricB, score: 9 }] })).status).toBe(400)
    expect(await countRows('SELECT COUNT(*) n FROM rubric_scores WHERE submission_id=$1', [F.submissionA])).toBe(0)
    const own = await request(app).post(scoresPath(F.submissionA)).set(auth(F.ownerToken)).send({ scores: [{ rubricId: F.rubricA, score: 9, feedback: 'Well done' }] })
    expect(own.status).toBe(200)
    expect(own.body.data.totalScore).toBe(9)
    expect((await request(app).post(scoresPath(UNKNOWN_UUID)).set(auth(F.ownerToken)).send({ scores: [] })).status).toBe(404)
  })
  it('reads feedback only as submitter instructor or admin', async () => {
    expect((await request(app).get(scoresPath(F.submissionA))).status).toBe(401)
    expect((await request(app).get(scoresPath(F.submissionA)).set(auth(F.otherStudentToken))).status).toBe(403)
    expect((await request(app).get(scoresPath(F.submissionA)).set(auth(F.intruderToken))).status).toBe(403)
    const self = await request(app).get(scoresPath(F.submissionA)).set(auth(F.studentToken))
    expect(self.status).toBe(200)
    expect(Array.isArray(self.body.data)).toBe(true)
    expect((await request(app).get(scoresPath(F.submissionA)).set(auth(F.ownerToken))).status).toBe(200)
    expect((await request(app).get(scoresPath(F.submissionA)).set(auth(F.adminToken))).status).toBe(200)
    expect((await request(app).get(scoresPath(UNKNOWN_UUID)).set(auth(F.adminToken))).status).toBe(404)
  })
})
describe('categories reports visibility', () => {
  const catPath = (c: string) => `/api/grading/courses/${c}/grade-categories`
  const catOne = (c: string) => `/api/grading/grade-categories/${c}`
  const repPath = (c: string) => `/api/grading/courses/${c}/grade-report`
  const visPath = (c: string) => `/api/grading/courses/${c}/grade-visibility`
  it('manages grade categories only through the owner', async () => {
    expect((await request(app).get(catPath(F.courseA)).set(auth(F.studentToken))).status).toBe(403)
    expect((await request(app).get(catPath(F.courseA)).set(auth(F.intruderToken))).status).toBe(403)
    expect((await request(app).get(catPath(F.courseA)).set(auth(F.ownerToken))).status).toBe(200)
    expect((await request(app).get(catPath(UNKNOWN_UUID)).set(auth(F.ownerToken))).status).toBe(404)
    expect((await request(app).post(catPath(F.courseA)).set(auth(F.ownerToken)).send({ courseId: F.courseB, name: 'Hijack', weight: 10 })).status).toBe(400)
    expect((await request(app).post(catPath(F.courseA)).set(auth(F.intruderToken)).send({ name: 'x', weight: 10 })).status).toBe(403)
    const created = await request(app).post(catPath(F.courseA)).set(auth(F.ownerToken)).send({ name: `PB cat ${Date.now()}`, weight: 10 })
    expect(created.status).toBe(201)
    const nc = created.body.data.id as string
    expect((await request(app).put(catOne(nc)).set(auth(F.intruderToken)).send({ weight: 99 })).status).toBe(403)
    const { rows } = await query('SELECT weight FROM grade_categories WHERE id=$1', [nc])
    expect(Number(rows[0].weight)).not.toBe(99)
    expect((await request(app).put(catOne(nc)).set(auth(F.ownerToken)).send({ weight: 25 })).status).toBe(200)
    expect((await request(app).delete(catOne(nc)).set(auth(F.intruderToken))).status).toBe(403)
    expect((await request(app).delete(catOne(nc)).set(auth(F.ownerToken))).status).toBe(200)
    expect((await request(app).delete(catOne(UNKNOWN_UUID)).set(auth(F.ownerToken))).status).toBe(404)
  })
  it('shows grade report only to course members', async () => {
    expect((await request(app).get(repPath(F.courseA)).set(auth(F.studentToken))).status).toBe(200)
    expect((await request(app).get(repPath(F.courseA)).set(auth(F.otherStudentToken))).status).toBe(403)
    expect((await request(app).get(repPath(F.courseA)).set(auth(F.intruderToken))).status).toBe(403)
    expect((await request(app).get(repPath(F.courseA)).set(auth(F.ownerToken))).status).toBe(200)
    expect((await request(app).get(repPath(F.courseA)).set(auth(F.adminToken))).status).toBe(200)
    expect((await request(app).get(repPath(UNKNOWN_UUID)).set(auth(F.adminToken))).status).toBe(404)
  })
  it('manages visibility and exports only through the owner', async () => {
    expect((await request(app).put(visPath(F.courseA)).set(auth(F.studentToken)).send({ showGrades: true })).status).toBe(403)
    expect((await request(app).put(visPath(F.courseA)).set(auth(F.intruderToken)).send({ showGrades: true })).status).toBe(403)
    expect((await request(app).put(visPath(F.courseA)).set(auth(F.ownerToken)).send({ showGrades: true })).status).toBe(200)
    expect((await request(app).put(visPath(UNKNOWN_UUID)).set(auth(F.ownerToken)).send({ showGrades: true })).status).toBe(404)
    expect((await request(app).get(`/api/grading/courses/${F.courseA}/export/csv`).set(auth(F.studentToken))).status).toBe(403)
    expect((await request(app).get(`/api/grading/courses/${F.courseA}/export/csv`).set(auth(F.intruderToken))).status).toBe(403)
    expect((await request(app).get(`/api/grading/courses/${F.courseA}/export/csv`).set(auth(F.ownerToken))).status).toBe(200)
  })
})
