import { describe, it, expect } from 'vitest'
import { prerequisiteModule as prereq1 } from '../db/jss2-first-term/prerequisite'
import { module01 as m1 } from '../db/jss2-first-term/module-01'
import { module02 as m2 } from '../db/jss2-first-term/module-02'
import { module03 as m3 } from '../db/jss2-first-term/module-03'
import { module04 as m4 } from '../db/jss2-first-term/module-04'
import { module05 as m5 } from '../db/jss2-first-term/module-05'
import { module06 as m6 } from '../db/jss2-first-term/module-06'
import { module07 as m7 } from '../db/jss2-first-term/module-07'
import { module08 as m8 } from '../db/jss2-first-term/module-08'
import { module09 as m9 } from '../db/jss2-first-term/module-09'
import { module10 as m10 } from '../db/jss2-first-term/module-10'
import { prerequisiteModule as prereq2 } from '../db/jss2-second-term/prerequisite'
import { module01 as s2m1 } from '../db/jss2-second-term/module-01'
import { module02 as s2m2 } from '../db/jss2-second-term/module-02'
import { module03 as s2m3 } from '../db/jss2-second-term/module-03'
import { module04 as s2m4 } from '../db/jss2-second-term/module-04'
import { module05 as s2m5 } from '../db/jss2-second-term/module-05'
import { prerequisiteModule as prereq3 } from '../db/jss2-third-term/prerequisite'
import { module01 as t3m1 } from '../db/jss2-third-term/module-01'
import { module02 as t3m2 } from '../db/jss2-third-term/module-02'
import { module03 as t3m3 } from '../db/jss2-third-term/module-03'
import { module04 as t3m4 } from '../db/jss2-third-term/module-04'
import type { Jss2ModuleData } from '../db/jss2-first-term/types'

const TERM1: Jss2ModuleData[] = [prereq1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10]
const TERM2: Jss2ModuleData[] = [prereq2, s2m1, s2m2, s2m3, s2m4, s2m5]
const TERM3: Jss2ModuleData[] = [prereq3, t3m1, t3m2, t3m3, t3m4]

const AUTOGRADABLE = new Set(['multiple_choice', 'true_false', 'fill_blank'])
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/

function checkModule(mod: Jss2ModuleData) {
  expect(mod.title.length).toBeGreaterThan(0)
  expect(mod.lessons.length).toBeGreaterThan(0)
  for (const l of mod.lessons) {
    expect(l.title.length).toBeGreaterThan(0)
    expect(l.duration).toBeGreaterThan(0)
    expect(typeof l.content).toBe('string')
    expect(l.content).toMatch(/## /)
    // Compulsory pre-requisite quiz present in each term
    expect(l.quiz.title.length).toBeGreaterThan(0)
    expect(l.quiz.questions.length).toBeGreaterThanOrEqual(5)
    for (const q of l.quiz.questions) {
      expect(AUTOGRADABLE.has(q.questionType)).toBe(true)
      expect(q.correctAnswer.length).toBeGreaterThan(0)
      if (q.questionType === 'multiple_choice') {
        const opts = q.options as Array<{ id: string; isCorrect: boolean }>
        expect(opts.filter(o => o.isCorrect).length).toBe(1)
        expect(opts.find(o => o.id === q.correctAnswer)?.isCorrect).toBe(true)
      }
    }
    expect(l.assignment.title.length).toBeGreaterThan(0)
    expect(ISO.test(l.assignment.dueDate)).toBe(true)
    expect(l.assignment.totalMarks).toBe(20)
    expect(l.assignment.questions.length).toBeGreaterThanOrEqual(1)
  }
}

describe('JSS2 Mathematics Three-Term Courses — seed data integrity', () => {
  it('First Term registers full module set with a compulsory prerequisite quiz', () => {
    expect(TERM1.length).toBeGreaterThanOrEqual(11)
    TERM1.forEach(checkModule)
  })
  it('Second Term registers full module set', () => {
    expect(TERM2.length).toBeGreaterThanOrEqual(6)
    TERM2.forEach(checkModule)
  })
  it('Third Term registers full module set', () => {
    expect(TERM3.length).toBeGreaterThanOrEqual(5)
    TERM3.forEach(checkModule)
  })
})
