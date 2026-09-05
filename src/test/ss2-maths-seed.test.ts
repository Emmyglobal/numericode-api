import { describe, it, expect } from 'vitest'
import { module01 } from '../db/ss2-mathematics/module-01'
import { module02 } from '../db/ss2-mathematics/module-02'
import { module03 } from '../db/ss2-mathematics/module-03'
import { module04 } from '../db/ss2-mathematics/module-04'
import { module05 } from '../db/ss2-mathematics/module-05'
import { module06 } from '../db/ss2-mathematics/module-06'
import { module07 } from '../db/ss2-mathematics/module-07'
import { module08 } from '../db/ss2-mathematics/module-08'
import { module09 } from '../db/ss2-mathematics/module-09'
import { module10 } from '../db/ss2-mathematics/module-10'
import { module11 } from '../db/ss2-mathematics/module-11'
import { module12 } from '../db/ss2-mathematics/module-12'
import { prerequisiteModule } from '../db/ss2-mathematics/prerequisite'
import { LESSON_EXTRAS } from '../db/ss2-mathematics/lesson-extras'
import type { Ss2ModuleData } from '../db/ss2-mathematics/types'

// ─── SS2 Mathematics — seed-data integrity (no database required) ─────────────

const MODULES: Ss2ModuleData[] = [
  prerequisiteModule,
  module01, module02, module03, module04, module05, module06,
  module07, module08, module09, module10, module11, module12,
]

const ALL_LESSONS = MODULES.flatMap(m => m.lessons)
const TEACHING_LESSONS = ALL_LESSONS.filter(l => !l.title.startsWith('Pre-requisite'))

const AUTOGRADABLE = new Set(['multiple_choice', 'true_false', 'fill_blank'])
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/

function assertValidQuizQuestion(q: {
  questionText: string
  questionType: string
  correctAnswer: string
  options?: unknown
}) {
  expect(q.questionText.length).toBeGreaterThan(0)
  expect(AUTOGRADABLE.has(q.questionType)).toBe(true)
  expect(q.correctAnswer.length).toBeGreaterThan(0)
  if (q.questionType === 'multiple_choice') {
    const opts = q.options as Array<{ id: string; isCorrect: boolean }>
    expect(opts?.length).toBe(4)
    expect(opts.filter(o => o.isCorrect).length).toBe(1)
    expect(opts.find(o => o.id === q.correctAnswer)?.isCorrect).toBe(true)
  }
  if (q.questionType === 'true_false') {
    expect(['true', 'false']).toContain(q.correctAnswer)
  }
}

describe('SS2 Mathematics — seed data integrity', () => {
  it('has a pre-requisite module as the first module with a 12-question compulsory quiz', () => {
    expect(MODULES[0].title).toMatch(/Pre-requisite/)
    const prereq = MODULES[0].lessons[0]
    expect(prereq.quiz).toBeDefined()
    expect(prereq.quiz!.questions.length).toBe(12)
    expect(prereq.quiz!.passingScore).toBe(70)
    expect(prereq.assignment).toBeDefined()
    prereq.quiz!.questions.forEach(assertValidQuizQuestion)
  })

  it('covers EVERY teaching lesson with extras (exercise + quiz + assignment), with no orphan keys', () => {
    // No missing keys.
    const missing = TEACHING_LESSONS.filter(l => !LESSON_EXTRAS[l.title]).map(l => l.title)
    expect(missing).toEqual([])
    // No orphan keys (extras for lessons that do not exist).
    const titles = new Set(TEACHING_LESSONS.map(l => l.title))
    const orphans = Object.keys(LESSON_EXTRAS).filter(k => !titles.has(k))
    expect(orphans).toEqual([])
  })

  it('every extras bundle passes the quiz/assignment/exercise contract', () => {
    for (const [title, extras] of Object.entries(LESSON_EXTRAS)) {
      // Exercise: a hands-on section appended to the lesson body.
      expect(extras.exercise, title).toMatch(/## Practical Exercise/)
      expect(extras.exercise.length, title).toBeGreaterThan(80)
      // Quiz: 5 auto-gradable questions, 70% pass.
      expect(extras.quiz.questions.length, title).toBe(5)
      expect(extras.quiz.passingScore, title).toBe(70)
      expect(extras.quiz.maxAttempts, title).toBe(3)
      expect(extras.quiz.timeLimit, title).toBeGreaterThan(0)
      extras.quiz.questions.forEach(q => assertValidQuizQuestion(q))
      // Assignment: 20 marks, questions sum to 20, ISO due date.
      expect(extras.assignment.totalMarks, title).toBe(20)
      expect(extras.assignment.passingScore, title).toBe(10)
      expect(ISO.test(extras.assignment.dueDate), title).toBe(true)
      const sum = extras.assignment.questions.reduce((s, q) => s + q.marks, 0)
      expect(sum, title).toBe(20)
      extras.assignment.questions.forEach(q => {
        expect(q.id.length, title).toBeGreaterThan(0)
        expect(q.title.length, title).toBeGreaterThan(0)
      })
    }
  })

  it('module/lesson counts are the full First Term scheme', () => {
    expect(MODULES.length).toBe(13) // pre-requisite + 12 teaching weeks
    expect(TEACHING_LESSONS.length).toBe(40)
    expect(Object.keys(LESSON_EXTRAS).length).toBe(40)
  })
})
