import { describe, it, expect } from 'vitest'
import { REACT_LESSON_COUNT, REACT_MODULES } from '../db/react-course/modules'
import { readinessQuestions, READINESS_PASSING_SCORE, READINESS_QUIZ_TITLE } from '../db/react-course/prerequisite'

/**
 * Data-integrity tests for the Complete React Development course.
 *
 * They assert that the seeded curriculum is complete and self-consistent —
 * slides, quizzes with explanations, assignments with rubrics and a prerequisite
 * readiness check that deliberately contains no React questions — without needing
 * a live database, because the seed inserts exactly this data.
 */
const AUTOGRADABLE = new Set(['multiple_choice', 'true_false', 'fill_blank'])
const SLIDE_TYPES = new Set([
  'title', 'objectives', 'content', 'example', 'code', 'callout',
  'try-it', 'mistakes', 'knowledge-check', 'summary', 'assignment',
])
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
const CONTENT_MODULES = REACT_MODULES.filter(m => !m.title.startsWith('Start Here'))
const LESSONS = REACT_MODULES.flatMap(m => m.lessons)
const CONTENT_LESSONS = CONTENT_MODULES.flatMap(m => m.lessons)

describe('React course — curriculum structure', () => {
  it('ships the readiness check plus the content modules', () => {
    expect(CONTENT_MODULES.length).toBeGreaterThanOrEqual(6)
    expect(REACT_MODULES[0].title).toMatch(/Readiness/)
    expect(REACT_LESSON_COUNT).toBe(REACT_MODULES.reduce((t, m) => t + m.lessons.length, 0))
  })

  it('gives every module a title and at least one lesson', () => {
    REACT_MODULES.forEach(m => {
      expect(m.title.trim().length).toBeGreaterThan(0)
      expect(m.lessons.length).toBeGreaterThan(0)
    })
  })

  it('numbers lessons R<module>.<lesson> so ordering is deterministic', () => {
    CONTENT_MODULES.forEach((m, moduleIndex) => {
      m.lessons.forEach((lesson, lessonIndex) => {
        expect(lesson.title).toMatch(new RegExp(`^R${moduleIndex + 1}\\.${lessonIndex + 1} `))
      })
    })
  })
})

describe('React course — lesson content', () => {
  it('gives the readiness lesson its own short deck', () => {
    const readiness = LESSONS.find(l => l.title === READINESS_QUIZ_TITLE)
    expect(readiness).toBeDefined()
    expect(readiness!.slides.length).toBeGreaterThanOrEqual(4)
    expect(readiness!.quiz.questions.length).toBeGreaterThanOrEqual(20)
  })

  it('gives every teaching lesson objectives, a deck and a summary', () => {
    for (const lesson of CONTENT_LESSONS) {
      expect(lesson.title.trim().length).toBeGreaterThan(0)
      expect(lesson.duration).toBeGreaterThan(0)
      expect(lesson.slides.length).toBeGreaterThanOrEqual(6)
      expect(lesson.content).toMatch(/## Learning Objectives/)
      expect(lesson.content).toMatch(/## Lesson Summary/)
      expect(lesson.slides[0].type).toBe('title')
      expect(lesson.slides.some(s => s.type === 'objectives')).toBe(true)
      expect(lesson.slides.some(s => s.type === 'summary')).toBe(true)
      // Practice-first: every lesson contains a hands-on activity.
      expect(lesson.slides.some(s => s.type === 'try-it')).toBe(true)
    }
  })

  it('uses only known slide types with unique ids', () => {
    for (const lesson of LESSONS) {
      const ids = lesson.slides.map(s => s.id)
      expect(new Set(ids).size).toBe(ids.length)
      for (const slide of lesson.slides) {
        expect(SLIDE_TYPES.has(slide.type)).toBe(true)
        expect(slide.id.length).toBeGreaterThan(0)
      }
    }
  })

  it('gives every slide type the payload it needs to render', () => {
    for (const lesson of LESSONS) {
      for (const slide of lesson.slides) {
        if (slide.type === 'content' || slide.type === 'code') expect((slide.content ?? '').length).toBeGreaterThan(0)
        if (slide.type === 'code') expect((slide.code ?? '').length).toBeGreaterThan(0)
        if (slide.type === 'objectives' || slide.type === 'summary' || slide.type === 'mistakes') {
          expect((slide.items ?? []).length).toBeGreaterThan(0)
        }
        if (slide.type === 'callout') expect((slide.callout?.content ?? '').length).toBeGreaterThan(0)
        if (slide.type === 'example') expect((slide.example?.content ?? '').length).toBeGreaterThan(0)
        if (slide.type === 'try-it') {
          expect((slide.tryIt?.task ?? '').length).toBeGreaterThan(0)
          expect((slide.tryIt?.steps ?? []).length).toBeGreaterThan(0)
        }
        if (slide.type === 'knowledge-check') {
          const q = slide.question
          expect((q?.question ?? '').length).toBeGreaterThan(0)
          expect(q?.options.length).toBe(4)
          expect(q!.correctIndex).toBeGreaterThanOrEqual(0)
          expect(q!.correctIndex).toBeLessThan(4)
        }
      }
    }
  })

  it('teaches with code in at least half of the lessons', () => {
    const withCode = LESSONS.filter(l => l.slides.some(s => s.type === 'code'))
    expect(withCode.length).toBeGreaterThanOrEqual(Math.ceil(LESSONS.length / 2))
  })
})

describe('React course — quizzes', () => {
  it('gives every lesson a 5+ question quiz that passes at 70%', () => {
    for (const lesson of LESSONS) {
      expect(lesson.quiz.title.length).toBeGreaterThan(0)
      expect(lesson.quiz.questions.length).toBeGreaterThanOrEqual(5)
      expect(lesson.quiz.passingScore).toBe(70)
      expect(lesson.quiz.maxAttempts).toBe(3)
      expect(lesson.quiz.timeLimit).toBeGreaterThan(0)
    }
  })

  it('validates every question and always explains the answer', () => {
    for (const lesson of LESSONS) {
      for (const q of lesson.quiz.questions) {
        expect(q.questionText.length).toBeGreaterThan(0)
        expect(AUTOGRADABLE.has(q.questionType)).toBe(true)
        expect(q.correctAnswer.length).toBeGreaterThan(0)
        expect((q.explanation ?? '').length).toBeGreaterThan(0)
        expect(q.points ?? 1).toBeGreaterThan(0)
        if (q.questionType === 'multiple_choice') {
          const opts = q.options ?? []
          expect(opts.length).toBe(4)
          expect(opts.filter(o => o.isCorrect).length).toBe(1)
          expect(opts.find(o => o.id === q.correctAnswer)?.isCorrect).toBe(true)
        }
        if (q.questionType === 'true_false') expect(['true', 'false']).toContain(q.correctAnswer)
      }
    }
  })

  it('asks contextual understanding questions rather than one-line trivia', () => {
    for (const lesson of LESSONS) {
      for (const q of lesson.quiz.questions) {
        expect(q.questionText.split(' ').length).toBeGreaterThanOrEqual(3)
      }
      const averageWords = lesson.quiz.questions
        .reduce((total, q) => total + q.questionText.split(' ').length, 0) / lesson.quiz.questions.length
      expect(averageWords).toBeGreaterThanOrEqual(5)
    }
  })
})

describe('React course — assignments', () => {
  const assignments = LESSONS.flatMap(l => (l.assignment ? [l.assignment] : []))

  it('ships graded assignments with rubrics', () => {
    expect(assignments.length).toBeGreaterThanOrEqual(5)
    for (const a of assignments) {
      expect(a.title.length).toBeGreaterThan(0)
      expect(ISO.test(a.dueDate)).toBe(true)
      expect(a.totalMarks).toBeGreaterThan(0)
      expect(a.passingScore).toBe(Math.ceil(a.totalMarks * 0.5))
      expect(a.questions.length).toBeGreaterThan(0)
      expect(a.questions.reduce((sum, q) => sum + q.marks, 0)).toBe(a.totalMarks)
      expect(a.description).toMatch(/## Learning Goal/)
      expect(a.description).toMatch(/## Requirements/)
      expect(a.description).toMatch(/## Submission Instructions/)
      expect(a.description).toMatch(/## Grading Criteria/)
      for (const q of a.questions) {
        expect(Object.keys(q.rubric ?? {}).length).toBeGreaterThan(0)
        expect((q.modelAnswer ?? '').length).toBeGreaterThan(0)
      }
    }
  })
})

describe('React readiness check', () => {
  it('has 20+ auto-graded questions and a 70% threshold', () => {
    expect(READINESS_QUIZ_TITLE).toBe('React Readiness Check')
    expect(READINESS_PASSING_SCORE).toBe(70)
    expect(readinessQuestions.length).toBeGreaterThanOrEqual(20)
    for (const q of readinessQuestions) {
      expect(AUTOGRADABLE.has(q.questionType)).toBe(true)
      expect(q.correctAnswer.length).toBeGreaterThan(0)
      expect((q.explanation ?? '').length).toBeGreaterThan(0)
    }
  })

  it('tests the foundations and never tests React itself', () => {
    for (const q of readinessQuestions) {
      expect(q.questionText).not.toMatch(/\bReact\b|\bJSX\b|\buseState\b|\bcomponent\b/i)
    }
  })
})
