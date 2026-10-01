import { query } from '../pool'
import type { Jss1AssignmentData, Jss1LessonData, Jss1ModuleData, Jss1QuizData } from './types'
import { module01 } from './module-01'
import { module02 } from './module-02'
import { module03 } from './module-03'
import { module04 } from './module-04'
import { module05 } from './module-05'
import { module06 } from './module-06'
import { module08 } from './module-08'
import { module09 } from './module-09'
import { module10 } from './module-10'

// ─── JSS1 Mathematics — Second Term ──────────────────────────────────────────
// Built from the "JSS 1 Checkpoint Mathematics Note 2025/2026" scheme of work:
// Week 1 Transformations I (midpoints, translation, reflection), 2
// Transformations II (rotations and enlargements), 3 Data Analysis, 4
// Statistics & Probability I, 5 Statistics & Probability II, 6 Percentage
// Increases & Decreases, 8 Interpreting & Data Presentations, 9 Indices &
// Standard Form, 10 Number Operations. Week 7 is MID TERM BREAK.
//
// Idempotent and convergent: modules and lessons are located by position and
// created only when missing, so an interrupted run heals itself and re-running
// never duplicates. Nothing is ever deleted.

export const JSS1_SECOND_TERM_TITLE = 'JSS1 Mathematics — Second Term'

const JSS1_SECOND_MODULES: Jss1ModuleData[] = [
  module01, module02, module03, module04, module05, module06, module08, module09, module10,
]

const JSS1_LESSON_COUNT = JSS1_SECOND_MODULES.reduce((total, m) => total + m.lessons.length, 0)

const JSS1_OUTCOMES = [
  'Find the midpoint of a segment, translate a shape with a vector, and reflect in a given mirror line.',
  'Carry out rotations using angle, direction and centre, and enlarge shapes using a scale factor.',
  'Choose and justify a suitable method for collecting data, and evaluate the use of sampling.',
  'Find complementary probabilities and multiply probabilities of independent events.',
  'Use addition and multiplication correctly for AND and OR combined events.',
  'Calculate percentage increases and decreases using the multiplier method.',
  'Interpret frequency diagrams, grouped data and class intervals, and distinguish discrete from continuous data.',
  'Apply the laws of indices and write numbers in standard form.',
  'Round accurately, and find the HCF and LCM of pairs of numbers.',
]

const JSS1_DESCRIPTION =
  'JSS1 Mathematics Second Term — transformations, data analysis, statistics and probability, ' +
  'percentage change, data presentation, indices and standard form, and number operations. ' +
  'A full term of worked examples, quizzes and assignments for secondary school students.'

const JSS1_COURSE_CONTENT = `# Welcome to JSS1 Mathematics — Second Term

A complete term of mathematics for JSS1 students, following the 2025/2026
checkpoint scheme of work.

## What you will cover
1. **Week 1 — Transformations I:** midpoints, translation with vectors, reflection in a mirror line.
2. **Week 2 — Transformations II:** rotations, enlargements and scale factors.
3. **Week 3 — Data Analysis:** collection methods, justification and sampling.
4. **Week 4 — Statistics and Probability I:** complementary and independent events, experimental probability.
5. **Week 5 — Statistics and Probability II:** combined events, AND and OR.
6. **Week 6 — Percentage Increases and Decreases:** the multiplier method.
7. **Week 8 — Interpreting and Data Presentations:** frequency diagrams, grouped data, class intervals.
8. **Week 9 — Indices and Standard Form:** the laws of indices and standard form.
9. **Week 10 — Number Operations:** rounding, HCF and LCM.

Week 7 is the mid-term break.

## How to study
- Read each lesson and work through every example before moving on.
- Attempt the quiz at the end of each lesson. You may retry up to 3 times.
- Submit the assignment showing all your working.`

export async function ensureJss1SecondTermCourse(): Promise<void> {
  const { rows: instructors } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1"
  )
  const instructorId = instructors[0]?.id
  if (!instructorId) {
    console.log('  JSS1 Second Term: no active trainer — skipping.')
    return
  }

  const { rows: existingCourse } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [JSS1_SECOND_TERM_TITLE]
  )
  const courseId: string = existingCourse[0]?.id ?? (await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, access_level, content)
     VALUES ($1, $2, 'mathematics', 'beginner', $3, 'published', $4, $5, '10 Weeks', 'free', $6) RETURNING id`,
    [JSS1_SECOND_TERM_TITLE, JSS1_DESCRIPTION, instructorId, JSS1_LESSON_COUNT, JSS1_OUTCOMES, JSS1_COURSE_CONTENT]
  )).rows[0].id

  await query(
    `UPDATE courses c SET instructor_id = $1 WHERE c.id = $2 AND c.instructor_id IN (SELECT id FROM users WHERE role = 'admin')`,
    [instructorId, courseId]
  )
  await query('UPDATE courses SET lesson_count = $1 WHERE id = $2', [JSS1_LESSON_COUNT, courseId])

  for (const [modulePosition, module] of JSS1_SECOND_MODULES.entries()) {
    const { rows: existingModules } = await query<{ id: string }>(
      'SELECT id FROM modules WHERE course_id = $1 AND position = $2 LIMIT 1',
      [courseId, modulePosition]
    )
    let moduleId = existingModules[0]?.id
    if (!moduleId) {
      const { rows: insertedModules } = await query<{ id: string }>(
        'INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id',
        [courseId, module.title, modulePosition]
      )
      moduleId = insertedModules[0].id
    }

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

      const { rows: existingResource } = await query<{ id: string }>(
        'SELECT id FROM resources WHERE lesson_id = $1 LIMIT 1',
        [lessonId]
      )
      if (!existingResource[0]) {
        await query(
          "INSERT INTO resources (lesson_id, title, type, url) VALUES ($1, 'Further practice (Khan Academy Mathematics)', 'link', 'https://www.khanacademy.org/math')",
          [lessonId]
        )
      }

      await ensureLessonQuiz(lessonId, courseId, lesson.quiz, instructorId)
      await ensureLessonAssignment(lessonId, courseId, lesson.assignment)
    }
  }

  console.log(`  Seeded ${JSS1_SECOND_TERM_TITLE} (${JSS1_SECOND_MODULES.length} modules, ${JSS1_LESSON_COUNT} lessons).`)
}

async function ensureLessonQuiz(
  lessonId: string,
  courseId: string,
  quiz: Jss1QuizData,
  instructorId: string,
): Promise<void> {
  const { rows: existingQuiz } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, quiz.title]
  )
  if (existingQuiz[0]) return

  const { rows: inserted } = await query<{ id: string }>(
    `INSERT INTO quizzes (course_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, false, true, $8) RETURNING id`,
    [courseId, lessonId, quiz.title, quiz.description, quiz.timeLimit, quiz.passingScore, quiz.maxAttempts, instructorId]
  )

  let position = 0
  for (const question of quiz.questions) {
    await query(
      `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        inserted[0].id,
        question.questionText,
        question.questionType,
        question.options ? JSON.stringify(question.options) : null,
        question.correctAnswer,
        question.points ?? 1,
        position++,
        question.explanation ?? null,
      ]
    )
  }
}

async function ensureLessonAssignment(
  lessonId: string,
  courseId: string,
  assignment: Jss1AssignmentData,
): Promise<void> {
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

export type { Jss1LessonData }