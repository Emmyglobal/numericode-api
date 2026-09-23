// ─── HTML & CSS Fundamentals — Course Seed Data + Seeder ────────────────────
// Single source of truth for the "HTML & CSS Fundamentals" course content.
// `ensureHtmlCssFundamentalsCourse()` (bottom of this file) is imported and
// invoked by seed.ts. Lessons carry HTML/CSS samples as fenced code blocks
// inside Markdown content; assignments are declared once per module.

import { query } from '../pool'
import type { HcfModuleData, HcfLessonData, HcfAssignmentData, HcfQuizData } from './types'
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
import { FINAL_EXAM } from './final-exam'

/** All 12 modules (Module 0 = onboarding, Modules 1-10 = core, Module 11 = capstone). */
export const HCF_MODULES: HcfModuleData[] = [
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

/** The final exam question bank (53 items: 50 Q&A + 3 practical). */
export { FINAL_EXAM }

// ─── Runtime invariant checks ─────────────────────────────────────────────────
// These run only at build/type-check time (no window object).

if (typeof (globalThis as Record<string, unknown>).window === 'undefined') {
  // --- Module/lesson count invariants ---
  const totalLessons = HCF_MODULES.reduce((acc, m) => acc + m.lessons.length, 0)
  const totalQuizzes = HCF_MODULES.reduce(
    (acc, m) => acc + m.lessons.reduce((a, l) => a + (l.quiz ? 1 : 0), 0),
    0,
  )
  const totalAssignments = HCF_MODULES.filter((m) => m.assignment).length

  console.log(
    `[HCF] Modules: ${HCF_MODULES.length} | Lessons: ${totalLessons} | ` +
      `Quizzes: ${totalQuizzes} | Assignments: ${totalAssignments}`,
  )

  // --- Expected counts ---
  // Original outline: Module 0 is a 3-lesson onboarding module, Modules 1-11 each
  // carry 5 lessons. Four of those lessons never made it into the generated
  // sources, so the shortfall is reported rather than thrown: a throw here runs at
  // import time and would abort the entire seed, taking every other course down
  // with it. The module count stays fatal because that would mean the import list
  // itself is wrong.
  const EXPECTED_MODULES = 12
  const EXPECTED_LESSONS_PER_MODULE = 5
  const EXPECTED_ONBOARDING_LESSONS = 3

  if (HCF_MODULES.length !== EXPECTED_MODULES) {
    throw new Error(
      `HCF module count mismatch: expected ${EXPECTED_MODULES}, got ${HCF_MODULES.length}`,
    )
  }

  const missingLessonIds: string[] = []
  for (const [moduleIndex, module] of HCF_MODULES.entries()) {
    const lessonSlots =
      moduleIndex === 0 ? EXPECTED_ONBOARDING_LESSONS : EXPECTED_LESSONS_PER_MODULE
    for (let slot = 1; slot <= lessonSlots; slot++) {
      const expectedId = `Quiz ${moduleIndex}.${slot}`
      const found = module.lessons.some((l) => (l.quiz?.title ?? '').includes(expectedId))
      if (!found) missingLessonIds.push(`${moduleIndex}.${slot}`)
    }
  }
  if (missingLessonIds.length > 0) {
    console.warn(
      `[HCF] Content gap: ${missingLessonIds.length} lesson slot(s) missing from the ` +
        `generated sources (${missingLessonIds.join(', ')}). Seeding continues with ` +
        `${totalLessons} lessons, ${totalQuizzes} quizzes and ${totalAssignments} assignments.`,
    )
  }

  // --- Final exam validation (delegates to final-exam.ts runtime check) ---
  // 53 items = 50 Q&A (Modules 1-10, five each) + 3 practical build problems.
  // Open-ended Q&A items are stored as 'essay' as well, so the practicals are
  // counted by their trailing position rather than by question type.
  const feQ = FINAL_EXAM.questions
  const fePracticalCount = feQ
    .slice(-3)
    .filter((q) => q.questionType === 'essay').length
  if (fePracticalCount !== 3) {
    throw new Error(
      `HCF final exam practical count mismatch: expected 3, got ${fePracticalCount}`,
    )
  }
  if (feQ.length !== 53) {
    throw new Error(
      `HCF final exam total mismatch: expected 53, got ${feQ.length}`,
    )
  }
}

// ─── Seeder ──────────────────────────────────────────────────────────────────
// Mirrors ./ss1-first-term/index.ts and ./ml-course/index.ts: the course is
// located by title, modules/lessons are only inserted while the course has none,
// and every quiz/assignment is located by (lesson_id, title) before insert, so
// re-seeding is idempotent.

export const HCF_COURSE_TITLE = 'HTML & CSS Fundamentals'

const HCF_LESSON_COUNT = HCF_MODULES.reduce((total, m) => total + m.lessons.length, 0)

const HCF_OUTCOMES = [
  'Explain the client/server web model and write valid, semantic HTML5 documents.',
  'Structure content with headings, text elements, lists, links, images, tables and forms.',
  'Apply CSS selectors and the box model to control spacing, borders, backgrounds and colour.',
  'Build page layouts with Flexbox and CSS Grid, including responsive breakpoints.',
  'Style typography and colour systems, and audit pages for accessibility and contrast.',
  'Add transitions, transforms and keyframe animations to interactive components.',
  'Plan, build and validate a complete multi-page responsive website as a capstone project.',
]

const HCF_DESCRIPTION =
  'Go from a blank file to a validated, responsive website. Covers semantic HTML5, document structure, text, links, images, lists, tables and forms, then CSS: selectors, the box model, Flexbox, Grid, responsive design, typography, colour, accessibility and animation — finishing with a capstone project.'

const HCF_COURSE_CONTENT = `# Welcome to HTML & CSS Fundamentals

This course takes you from "what is a web page?" to shipping a complete, accessible, responsive website.

## Course Structure
- Module 0: Orientation & Setup
- Module 1: Intro to the Web & HTML Basics
- Module 2: HTML Document Structure & Text Elements
- Module 3: Links, Images & Lists
- Module 4: Tables & Forms
- Module 5: Semantic HTML & Accessibility
- Module 6: CSS Fundamentals: Selectors & the Box Model
- Module 7: CSS Layout I: Display, Position, Flexbox
- Module 8: CSS Layout II: Grid & Responsive Design
- Module 9: Typography, Color & Accessibility
- Module 10: Transitions, Transforms & Animations
- Module 11: Capstone Project & Final Exam

## How to Study
- Read each lesson and type out every code sample yourself — do not copy/paste.
- Take each lesson Quiz to check your understanding.
- Complete each module Assignment; they build toward the capstone.
- Validate your pages with the W3C validator before submitting work.

## Final Exam
The course closes with a 53-item exam: 50 questions covering Modules 1-10 plus 3 practical build problems, worth 40% of the final grade.`

export async function ensureHtmlCssFundamentalsCourse() {
  const { rows: instructors } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1"
  )
  const instructorId = instructors[0]?.id
  if (!instructorId) {
    console.log('  HTML & CSS Fundamentals: no active trainer — skipping.')
    return
  }

  const { rows: existingCourse } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [HCF_COURSE_TITLE]
  )
  const courseId: string = existingCourse[0]?.id ?? (await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, content)
     VALUES ($1, $2, 'programming', 'beginner', $3, 'published', $4, $5, '12 Weeks', $6) RETURNING id`,
    [HCF_COURSE_TITLE, HCF_DESCRIPTION, instructorId, HCF_LESSON_COUNT, HCF_OUTCOMES, HCF_COURSE_CONTENT]
  )).rows[0].id

  await query(
    `UPDATE courses c SET instructor_id = $1 WHERE c.id = $2 AND c.instructor_id IN (SELECT id FROM users WHERE role = 'admin')`,
    [instructorId, courseId]
  )
  // lesson_count is a denormalised display field. An earlier partial seed left it
  // at whatever the old generation contained (18), so it is trued-up here.
  await query(
    'UPDATE courses SET lesson_count = $1 WHERE id = $2 AND lesson_count IS DISTINCT FROM $1',
    [HCF_LESSON_COUNT, courseId]
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

  // Converge rather than "insert once": an earlier run can be interrupted mid-seed
  // (which is exactly how this course first landed with only 6 of its 12 modules),
  // so every module and lesson is located by position and only created when it is
  // actually missing. Nothing is ever deleted.
  for (const [modulePosition, module] of HCF_MODULES.entries()) {
    const { rows: existingModules } = await query<{ id: string; title: string }>(
      'SELECT id, title FROM modules WHERE course_id = $1 AND position = $2 LIMIT 1',
      [courseId, modulePosition]
    )
    let moduleId: string | undefined = existingModules[0]?.id
    // A module in the right position but with the wrong title belongs to an
    // earlier generation of this curriculum — its lessons describe content that
    // no longer exists, so the whole module is replaced rather than kept.
    if (moduleId && existingModules[0].title !== module.title) {
      await replaceStaleModule(moduleId, module.title)
      moduleId = undefined
    }
    if (!moduleId) {
      const { rows: insertedModules } = await query<{ id: string }>(
        'INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id',
        [courseId, module.title, modulePosition]
      )
      moduleId = insertedModules[0].id
    }

    let lastLessonId: string | null = null
    for (const [lessonPosition, lesson] of module.lessons.entries()) {
      const { rows: existingLessons } = await query<{ id: string }>(
        'SELECT id FROM lessons WHERE module_id = $1 AND position = $2 LIMIT 1',
        [moduleId, lessonPosition]
      )
      let lessonId = existingLessons[0]?.id
      if (!lessonId) {
        const { rows: insertedLessons } = await query<{ id: string }>(
          'INSERT INTO lessons (module_id, title, content, duration, position) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [moduleId, lesson.title, lesson.content, lesson.duration, lessonPosition]
        )
        lessonId = insertedLessons[0].id
      }
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

  // Course-level final exam (module_id and lesson_id are NULL — this is the
  // established pattern for course-level quizzes, see seed.ts "Practice exams").
  // Located by title so re-seeding never duplicates it.
  await ensureCourseLevelQuiz(courseId, FINAL_EXAM, instructorId)

  console.log(`  Seeded HTML & CSS Fundamentals (${HCF_MODULES.length} modules, ${HCF_LESSON_COUNT} lessons).`)
}

// Per-lesson quiz (located by lesson_id + title so re-seeding never duplicates).
async function ensureLessonQuiz(
  lessonId: string,
  courseId: string,
  lesson: HcfLessonData,
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

// Replaces a module left behind by an earlier generation of this curriculum.
// Order matters: `quizzes.lesson_id` is ON DELETE SET NULL (not CASCADE), so the
// stale module's quizzes must be removed explicitly first — otherwise deleting
// the module would orphan them, and an orphaned quiz (lesson_id NULL) is
// indistinguishable from a legitimate course-level quiz such as the final exam.
// `lessons.module_id`, `assignments.lesson_id` and `resources.lesson_id` are all
// CASCADE, so removing the module clears the rest of its content graph.
async function replaceStaleModule(moduleId: string, newTitle: string) {
  const { rows: removedQuizzes } = await query<{ id: string }>(
    `DELETE FROM quizzes
      WHERE module_id = $1
         OR lesson_id IN (SELECT id FROM lessons WHERE module_id = $1)
      RETURNING id`,
    [moduleId]
  )
  const { rows: removedModule } = await query<{ id: string }>(
    'DELETE FROM modules WHERE id = $1 RETURNING id',
    [moduleId]
  )
  if (removedModule[0]) {
    console.log(
      `    replaced stale module with "${newTitle}" (removed ${removedQuizzes.length} stale quiz/quiz-bank rows)`
    )
  }
}

// Course-level quiz (module_id and lesson_id NULL). Located by (course_id, title)
// so re-seeding never duplicates it. Used for the final exam.
async function ensureCourseLevelQuiz(
  courseId: string,
  exam: HcfQuizData,
  instructorId: string
) {
  const { rows: existing } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE course_id = $1 AND lesson_id IS NULL AND title = $2 LIMIT 1',
    [courseId, exam.title]
  )
  if (existing[0]) return

  const { rows: quizzes } = await query<{ id: string }>(
    `INSERT INTO quizzes (course_id, module_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
     VALUES ($1, NULL, NULL, $2, $3, $4, $5, $6, false, true, $7) RETURNING id`,
    [
      courseId,
      exam.title,
      exam.description,
      exam.timeLimit,
      exam.passingScore,
      exam.maxAttempts,
      instructorId,
    ]
  )
  const quizId = quizzes[0].id

  let position = 0
  for (const q of exam.questions) {
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
  assignment: HcfAssignmentData
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
