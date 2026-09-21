// ─── React Course — Complete React Development (premium, slide-based) ────────
// Seeded through the standard schema (same tables/pattern as ../js-course).
// Idempotent: the course is found by title, modules are only inserted while the
// course has none, and quizzes/assignments are keyed by (lesson_id, title).
import { query } from '../pool'
import { READINESS_PASSING_SCORE, READINESS_QUIZ_TITLE } from './prerequisite'
import { REACT_LESSON_COUNT, REACT_MODULES } from './modules'
import type { LessonData } from './types'

export const REACT_COURSE_TITLE = 'Complete React Development'

/**
 * Premium price in minor units (kobo). Stored in `courses.price_cents`, which is
 * the single source of truth — the catalogue, course page and checkout all read
 * that column, so the price is never hard-coded in the UI.
 */
export const REACT_PRICE_CENTS = 2_500_000 // ₦25,000

const REACT_OUTCOMES = [
  'Explain what React is and how it renders a user interface.',
  'Create and combine reusable components with props.',
  'Manage changing data with state and React hooks.',
  'Handle events, forms and user input correctly.',
  'Render lists and conditional UI with keys and states for loading, empty and error cases.',
  'Fetch data from an API and show loading and error feedback.',
  'Build multi-page applications with React Router, including protected routes.',
  'Structure, debug, test and deploy a medium-sized React project.',
]

const REACT_COURSE_CONTENT = `# Complete React Development

Build modern, interactive web applications with React — step by step.

## Who This Course Is For
Teenagers, complete beginners, university students and adult learners who already know some HTML, CSS and JavaScript.

## How You Will Learn
Every lesson is a short slide presentation: a simple explanation, a worked example, a code walkthrough, a hands-on "Try It" activity, the mistakes to avoid, a quick check and a summary. Each lesson ends with a quiz, and the bigger lessons include a graded assignment.

## Course Structure
- Module 1: Welcome to React
- Module 2: Setting Up a Modern React Project
- Module 3: JSX Fundamentals
- Module 4: Components
- Module 5: Props
- Module 6: State and Interactivity
- Module 7: Events and Forms
- Module 8: Rendering Lists and Conditional UI
- Module 9: React Hooks
- Module 10: Working with APIs
- Module 11: React Router
- Module 12: Building Real Applications
- Module 13: Modern React Patterns
- Module 14: Professional React Development
- Module 15: Final Project — Student Learning Dashboard

## Before You Start
The course opens with the **${READINESS_QUIZ_TITLE}**, a short assessment of the HTML, CSS and JavaScript foundations you need. Score ${READINESS_PASSING_SCORE}% to unlock the lessons.
`

const REACT_DESCRIPTION =
  'Build modern, interactive web applications with React — step by step. A friendly, project-based course for beginners that starts with your first component and ends with a complete student learning dashboard.'

/** Creates (or heals) the premium React course and all of its content. */
export async function ensureReactCourse() {
  const { rows: trainers } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1"
  )
  const instructorId = trainers[0]?.id
  if (!instructorId) {
    console.log('  React: no active trainer found — skipping seed.')
    return
  }

  const { rows: existing } = await query<{ id: string }>('SELECT id FROM courses WHERE title = $1 LIMIT 1', [REACT_COURSE_TITLE])
  let courseId = existing[0]?.id
  if (!courseId) {
    const { rows } = await query<{ id: string }>(
      `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, content, access_level, price_cents)
       VALUES ($1, $2, 'programming', 'beginner', $3, 'published', $4, $5, '12 Weeks', $6, 'premium', $7)
       RETURNING id`,
      [REACT_COURSE_TITLE, REACT_DESCRIPTION, instructorId, REACT_LESSON_COUNT, REACT_OUTCOMES, REACT_COURSE_CONTENT, REACT_PRICE_CENTS]
    )
    courseId = rows[0].id
  } else {
    // Backfill only while the course still looks unconfigured, so an admin's later
    // price/description edits are never overwritten by a re-run of the seed.
    await query(
      `UPDATE courses
          SET access_level = 'premium', price_cents = $1, lesson_count = $2,
              outcomes = $3, content = $4, subject = 'programming'
        WHERE id = $5 AND access_level = 'free' AND price_cents = 0`,
      [REACT_PRICE_CENTS, REACT_LESSON_COUNT, REACT_OUTCOMES, REACT_COURSE_CONTENT, courseId]
    )
  }
  await query(
    `UPDATE courses c SET instructor_id = $1
       WHERE c.id = $2 AND c.instructor_id IN (SELECT id FROM users WHERE role = 'admin')`,
    [instructorId, courseId]
  )

  const { rows: moduleCount } = await query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM modules WHERE course_id = $1', [courseId]
  )
  let readinessQuizId: string | null = null

  if (Number(moduleCount[0].count) === 0) {
    for (const [modulePosition, mod] of REACT_MODULES.entries()) {
      const { rows: insertedModules } = await query<{ id: string }>(
        'INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id',
        [courseId, mod.title, modulePosition]
      )
      const moduleId = insertedModules[0].id
      for (const [lessonPosition, lesson] of mod.lessons.entries()) {
        const { rows: insertedLessons } = await query<{ id: string }>(
          `INSERT INTO lessons (module_id, title, content, duration, position, slides)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [moduleId, lesson.title, lesson.content, lesson.duration, lessonPosition, JSON.stringify(lesson.slides)]
        )
        const lessonId = insertedLessons[0].id
        const quizId = await ensureLessonQuiz(lessonId, courseId, lesson, instructorId)
        await ensureLessonAssignment(lessonId, courseId, lesson)
        if (lesson.title === READINESS_QUIZ_TITLE) readinessQuizId = quizId
      }
    }
    console.log(`  Seeded React course (${REACT_MODULES.length} modules, ${REACT_LESSON_COUNT} lessons).`)
  }

  // Course-level prerequisite gate: the readiness quiz created above, or an
  // existing one from an earlier run — the seed stays safe to run repeatedly.
  if (!readinessQuizId) {
    const { rows } = await query<{ id: string }>(
      'SELECT id FROM quizzes WHERE course_id = $1 AND title = $2 ORDER BY created_at LIMIT 1',
      [courseId, READINESS_QUIZ_TITLE]
    )
    readinessQuizId = rows[0]?.id ?? null
  }
  if (readinessQuizId) {
    await query(
      'UPDATE courses SET prerequisite_quiz_id = $1 WHERE id = $2 AND (prerequisite_quiz_id IS NULL OR prerequisite_quiz_id <> $1)',
      [readinessQuizId, courseId]
    )
  }
}

/** Inserts the lesson quiz (with per-question explanations) unless it exists. */
async function ensureLessonQuiz(lessonId: string, courseId: string, lesson: LessonData, instructorId: string): Promise<string> {
  const { rows: existingQuiz } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE lesson_id = $1 AND title = $2 LIMIT 1', [lessonId, lesson.quiz.title]
  )
  if (existingQuiz[0]) return existingQuiz[0].id

  const { rows } = await query<{ id: string }>(
    `INSERT INTO quizzes (course_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, false, true, $8) RETURNING id`,
    [courseId, lessonId, lesson.quiz.title, lesson.quiz.description, lesson.quiz.timeLimit, lesson.quiz.passingScore, lesson.quiz.maxAttempts, instructorId]
  )
  const quizId = rows[0].id
  let position = 0
  for (const q of lesson.quiz.questions) {
    await query(
      `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [quizId, q.questionText, q.questionType, q.options ? JSON.stringify(q.options) : null, q.correctAnswer, q.points ?? 1, position++, q.explanation ?? null]
    )
  }
  return quizId
}

/** Inserts the lesson assignment unless one with the same title already exists. */
async function ensureLessonAssignment(lessonId: string, courseId: string, lesson: LessonData) {
  if (!lesson.assignment) return
  const { rows: existing } = await query<{ id: string }>(
    'SELECT id FROM assignments WHERE lesson_id = $1 AND title = $2 LIMIT 1', [lessonId, lesson.assignment.title]
  )
  if (existing[0]) return
  await query(
    `INSERT INTO assignments (course_id, lesson_id, title, description, due_date, total_marks, passing_score, assignment_type, questions)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      courseId, lessonId, lesson.assignment.title, lesson.assignment.description, lesson.assignment.dueDate,
      lesson.assignment.totalMarks, lesson.assignment.passingScore, lesson.assignment.assignmentType,
      JSON.stringify(lesson.assignment.questions),
    ]
  )
}
