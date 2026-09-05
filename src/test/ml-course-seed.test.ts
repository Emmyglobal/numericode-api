import { describe, it, expect } from 'vitest'
import { module01 } from '../db/ml-course/module-01'
import { module02 } from '../db/ml-course/module-02'
import { module03 } from '../db/ml-course/module-03'
import { module04 } from '../db/ml-course/module-04'
import { module05 } from '../db/ml-course/module-05'
import { module06 } from '../db/ml-course/module-06'
import type { MlModuleData } from '../db/ml-course/types'

const ML_MODULES: MlModuleData[] = [module01, module02, module03, module04, module05, module06]

// ─── Machine Learning — seed-data integrity (no database required) ─────────────
// Only the data-shape invariants are checked here. New module-N.ts files are
// appended to ML_MODULES below as they are created.
// Modules added to ML_MODULES as new module-N.ts files are created.
// Only data-shape invariants are checked here — no database required.
const AUTOGRADABLE = new Set(['multiple_choice', 'true_false', 'fill_blank'])
const ASSIGNMENT_TYPES = new Set(['theory', 'subjective', 'file', 'mixed'])
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/

function assertValidQuestion(q: {
  questionText: string
  questionType: string
  correctAnswer: string
  options?: unknown
}) {
  expect(q.questionText.length).toBeGreaterThan(0)
  expect(AUTOGRADABLE.has(q.questionType)).toBe(true)
  expect(q.correctAnswer.length).toBeGreaterThan(0)
  if (q.questionType === 'multiple_choice') {
    expect(Array.isArray(q.options)).toBe(true)
    const opts = q.options as Array<{ id: string; isCorrect: boolean }>
    expect(opts.length).toBe(4)
    const correct = opts.filter(o => o.isCorrect)
    expect(correct.length).toBe(1)
    expect(opts.find(o => o.id === q.correctAnswer)?.isCorrect).toBe(true)
  }
  if (q.questionType === 'true_false') {
    expect(['true', 'false']).toContain(q.correctAnswer)
  }
}

describe('Machine Learning course — seed data integrity', () => {
  it('registers at least one module with titled lessons', () => {
    expect(ML_MODULES.length).toBeGreaterThan(0)
    ML_MODULES.forEach(m => {
      expect(m.title.length).toBeGreaterThan(0)
      expect(m.lessons.length).toBeGreaterThan(0)
    })
  })

  it('every lesson matches the MlLessonData contract', () => {
    for (const m of ML_MODULES) {
      for (const l of m.lessons) {
        expect(l.title.length).toBeGreaterThan(0)
        expect(l.duration).toBeGreaterThan(0)
        expect(typeof l.content).toBe('string')
        // Body must carry the standardized sections used across the course.
        expect(l.content).toMatch(/## Learning Objectives/)
        expect(l.content).toMatch(/## Key Takeaways/)
        expect(l.content).toMatch(/## Quiz Answer Key/)
        // Quiz: 5 auto-gradable questions each.
        expect(l.quiz.title.length).toBeGreaterThan(0)
        expect(l.quiz.description.length).toBeGreaterThan(0)
        expect(typeof l.quiz.timeLimit).toBe('number')
        expect(l.quiz.passingScore).toBe(70)
        expect(l.quiz.maxAttempts).toBe(3)
        expect(l.quiz.questions.length).toBe(5)
        l.quiz.questions.forEach(assertValidQuestion)
        // Assignment: 20 marks, two questions summing to 20, ISO due date.
        expect(l.assignment.title.length).toBeGreaterThan(0)
        expect(ISO.test(l.assignment.dueDate)).toBe(true)
        expect(l.assignment.totalMarks).toBe(20)
        expect(l.assignment.passingScore).toBe(10)
        expect(ASSIGNMENT_TYPES.has(l.assignment.assignmentType)).toBe(true)
                expect(l.assignment.questions.length).toBeGreaterThanOrEqual(2)
        expect(l.assignment.questions.reduce((s: number, q: { marks: number }) => s + q.marks, 0)).toBe(20)
        expect(
          l.assignment.questions.every((q: { id: string; title: string; type: string; marks: number }) => q.id && q.title && q.type && q.marks > 0)
        ).toBe(true)
      }
    }
  })

  it('module lesson count matches the seeded lesson set', () => {
    const n = ML_MODULES.reduce((t, m) => t + m.lessons.length, 0)
    expect(n).toBe(29)
  })
})
