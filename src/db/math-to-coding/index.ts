// ─── Mathematics to Coding — Course Seed Data + Seeder ──────────────────────
// Single source of truth for the "Mathematics to Coding" course content.
// `ensureMathToCodingCourse()` (bottom of this file) is imported and invoked by
// seed.ts. Lessons carry fenced code blocks inside Markdown content; graded
// assignments are declared once per module (Module 0 is ungraded onboarding).

import { query } from '../pool'
import type { M2cModuleData, M2cLessonData, M2cAssignmentData } from './types'
import { module00 } from './module-00'
import { module01 } from './module-01'
import { module02 } from './module-02'
import { module03 } from './module-03'
import { module04 } from './module-04'
import { module05 } from './module-05'
import { module06 } from './module-06'
import { module07 } from './module-07'
import { module08 } from './module-08'
import { module09 } from './module-09'
import { module10 } from './module-10'
import { module11 } from './module-11'

/** All 12 modules (Module 0 = onboarding, Modules 1-10 = core, Module 11 = capstone). */
export const M2C_MODULES: M2cModuleData[] = [
  module00,
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
  module07,
  module08,
  module09,
  module10,
  module11,
]

export const M2C_COURSE_TITLE = 'Mathematics to Coding'

const M2C_LESSON_COUNT = M2C_MODULES.reduce((total, m) => total + m.lessons.length, 0)

const M2C_OUTCOMES = [
  'Translate arithmetic and number theory into working code with confidence.',
  'Apply Boolean algebra and logic to write correct conditional expressions.',
  'Use sets, functions and relations to model data and lookups.',
  'Recognise and generate sequences and series with loops, and reason about iteration.',
  'Design algorithms in pseudocode before writing a single line of code.',
  'Count combinations and compute basic probabilities for real problems.',
  'Represent data as vectors and matrices and implement the core linear algebra operations.',
  'Write recursive solutions and prove their correctness by induction.',
  'Analyse and compare algorithms using Big-O time and space complexity.',
  'Model problems with graph and tree structures and traverse them correctly.',
  'Deliver a capstone project that combines mathematics and code with tests and a Big-O report.',
]

const M2C_DESCRIPTION =
  'The mathematics you actually need to become a strong programmer, taught side by side with code. Covers computational thinking, logic and Boolean algebra, sets and functions, sequences and iteration, algorithms and pseudocode, combinatorics, vectors and matrices, recursion and induction, Big-O complexity, and graphs and trees — finishing with a capstone project.'

const M2C_COURSE_CONTENT = `# Welcome to Mathematics to Coding

Every topic in this course is taught twice: first the mathematics, then the code that puts it to work.

## Course Structure
- Module 0: Orientation & Prerequisite Check
- Module 1: Numbers & Computational Thinking
- Module 2: Logic & Boolean Algebra
- Module 3: Sets, Functions & Relations
- Module 4: Sequences, Iteration & Series
- Module 5: Algorithms & Pseudocode
- Module 6: Counting, Combinatorics & Probability Basics
- Module 7: Vectors, Matrices & Linear Algebra for Coders
- Module 8: Recursion & Mathematical Induction
- Module 9: Algorithmic Complexity & Big-O
- Module 10: Graphs, Trees & Data Structures Foundations
- Module 11: Capstone Project & Final Exam

## How to Study
- Read each lesson and then write and run the code yourself — the maths only sticks when you run it.
- Take each lesson Quiz as you go to check understanding.
- Complete each module Assignment; they extend the lesson idea to a new problem.
- Finish with the Capstone Project in Module 11, which combines concepts from at least four modules.`

export async function ensureMathToCodingCourse() {
  const { rows: instructors } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1"
  )
  const instructorId = instructors[0]?.id
  if (!instructorId) {
    console.log('  Mathematics to Coding: no active trainer — skipping.')
    return
  }

  const { rows: existingCourse } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [M2C_COURSE_TITLE]
  )
  const courseId: string = existingCourse[0]?.id ?? (await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, content)
     VALUES ($1, $2, 'mathematics', 'beginner', $3, 'published', $4, $5, '12 Weeks', $6) RETURNING id`,
    [M2C_COURSE_TITLE, M2C_DESCRIPTION, instructorId, M2C_LESSON_COUNT, M2C_OUTCOMES, M2C_COURSE_CONTENT]
  )).rows[0].id

  await query(
    `UPDATE courses c SET instructor_id = $1 WHERE c.id = $2 AND c.instructor_id IN (SELECT id FROM users WHERE role = 'admin')`,
    [instructorId, courseId]
  )

  const { rows: demoStudents } = await query<{ id: string }>(
    "SELECT id FROM users WHERE email IN ('kolade@gmail.com', 'amaka@gmail.com') AND role = 'student'"
  )
  for (const s of demoStudents) {
    await query(
      'INSERT INTO enrollments (user_id, course_id, progress) VALUES ($1, $2, 0) ON CONFLICT (user_id, course_id) DO NOTHING',
      [s.id, courseId]
    )
  }

  const { rows: moduleCount } = await query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM modules WHERE course_id = $1',
    [courseId]
  )
  if (Number(moduleCount[0].count) > 0) {
    console.log(`  Mathematics to Coding already seeded (${moduleCount[0].count} modules).`)
    return
  }

  for (const [modulePosition, module] of M2C_MODULES.entries()) {
    const { rows: insertedModules } = await query<{ id: string }>(
      'INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id',
      [courseId, module.title, modulePosition]
    )
    const moduleId = insertedModules[0].id
    let lastLessonId: string | null = null
    for (const [lessonPosition, lesson] of module.lessons.entries()) {
      const { rows: insertedLessons } = await query<{ id: string }>(
        'INSERT INTO lessons (module_id, title, content, duration, position) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [moduleId, lesson.title, lesson.content, lesson.duration, lessonPosition]
      )
      const lessonId = insertedLessons[0].id
      lastLessonId = lessonId
      await ensureLessonQuiz(lessonId, courseId, lesson, instructorId)
    }
    // Assignments in this course are declared once per module (see ./types.ts).
    // The student course viewer loads assignments by lesson_id, so a module's
    // assignment is attached to that module's final lesson.
    if (module.assignment && lastLessonId) {
      await ensureModuleAssignment(lastLessonId, courseId, module.assignment)
    }
  }
  console.log(`  Seeded Mathematics to Coding (${M2C_MODULES.length} modules, ${M2C_LESSON_COUNT} lessons).`)
}

// Per-lesson quiz (located by lesson_id + title so re-seeding never duplicates).
async function ensureLessonQuiz(
  lessonId: string,
  courseId: string,
  lesson: M2cLessonData,
  instructorId: string
) {
  const quizTitle = lesson.quiz.title
  const { rows: existingQuiz } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, quizTitle]
  )
  if (existingQuiz[0]) return

  const { rows: quizzes } = await query<{ id: string }>(
    `INSERT INTO quizzes (course_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, false, true, $8) RETURNING id`,
    [
      courseId,
      lessonId,
      quizTitle,
      lesson.quiz.description,
      lesson.quiz.timeLimit,
      lesson.quiz.passingScore,
      lesson.quiz.maxAttempts,
      instructorId,
    ]
  )
  const quizId = quizzes[0].id

  let position = 0
  for (const q of lesson.quiz.questions) {
    await query(
      `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        quizId,
        q.questionText,
        q.questionType,
        q.options ? JSON.stringify(q.options) : null,
        q.correctAnswer,
        q.points ?? 1,
        position++,
      ]
    )
  }
}

// Module assignment, attached to the module's final lesson (located by
// lesson_id + title so re-seeding never duplicates).
async function ensureModuleAssignment(
  lessonId: string,
  courseId: string,
  assignment: M2cAssignmentData
) {
  const { rows: existing } = await query<{ id: string }>(
    'SELECT id FROM assignments WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, assignment.title]
  )
  if (existing[0]) return

  await query(
    `INSERT INTO assignments (course_id, lesson_id, title, description, due_date, total_marks, passing_score, assignment_type, questions)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      courseId,
      lessonId,
      assignment.title,
      assignment.description,
      assignment.dueDate,
      assignment.totalMarks,
      assignment.passingScore,
      assignment.assignmentType,
      JSON.stringify(assignment.questions),
    ]
  )
}
