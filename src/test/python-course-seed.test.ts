import { describe, it, expect } from 'vitest'
import { module01 } from '../db/python-course/module-01'
import { module02 } from '../db/python-course/module-02'
import { module03 } from '../db/python-course/module-03'
import { module04 } from '../db/python-course/module-04'
import { module05 } from '../db/python-course/module-05'
import { module06 } from '../db/python-course/module-06'
import type { ModuleData } from '../db/python-course/types'

const PYTHON_MODULES: ModuleData[] = [module01, module02, module03, module04, module05, module06]

const AUTOGRADABLE = new Set(['multiple_choice', 'true_false', 'fill_blank'])
const ASSIGNMENT_TYPES = new Set(['theory', 'subjective', 'file', 'mixed'])
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/

function assertValidQuestion(q: { questionText: string; questionType: string; correctAnswer: string; options?: unknown }) {
  expect(q.questionText.length).toBeGreaterThan(0)
  expect(AUTOGRADABLE.has(q.questionType)).toBe(true)
  expect(q.correctAnswer.length).toBeGreaterThan(0)
  if (q.questionType === 'multiple_choice') {
    expect(Array.isArray(q.options)).toBe(true)
    const opts = q.options as Array<{ id: string; isCorrect: boolean }>
    expect(opts.length).toBe(4)
    expect(opts.filter(o => o.isCorrect).length).toBe(1)
    expect(opts.find(o => o.id === q.correctAnswer)?.isCorrect).toBe(true)
  }
  if (q.questionType === 'true_false') expect(['true', 'false']).toContain(q.correctAnswer)
}

describe('Python course — seed data integrity', () => {
  it('registers at least one module with titled lessons', () => {
    expect(PYTHON_MODULES.length).toBeGreaterThan(0)
    PYTHON_MODULES.forEach(m => {
      expect(m.title.length).toBeGreaterThan(0)
      expect(m.lessons.length).toBeGreaterThan(0)
    })
  })

  it('every lesson matches the ModuleData contract', () => {
    for (const m of PYTHON_MODULES) {
      for (const l of m.lessons) {
        expect(l.title.length).toBeGreaterThan(0)
        expect(l.duration).toBeGreaterThan(0)
        expect(typeof l.content).toBe('string')
        expect(l.content).toMatch(/## Learning Objectives/)
        expect(l.content).toMatch(/## Key Takeaways/)
        expect(l.content).toMatch(/## Quiz Answer Key/)
        expect(l.quiz.title.length).toBeGreaterThan(0)
        expect(l.quiz.questions.length).toBe(5)
        l.quiz.questions.forEach(assertValidQuestion)
        expect(l.assignment.title.length).toBeGreaterThan(0)
        expect(ISO.test(l.assignment.dueDate)).toBe(true)
        expect(l.assignment.totalMarks).toBe(20)
        expect(l.assignment.passingScore).toBe(10)
        expect(ASSIGNMENT_TYPES.has(l.assignment.assignmentType)).toBe(true)
        expect(l.assignment.questions.length).toBeGreaterThanOrEqual(2)
        expect(l.assignment.questions.reduce((s: number, q: { marks: number }) => s + q.marks, 0)).toBe(20)
      }
    }
  })
})
