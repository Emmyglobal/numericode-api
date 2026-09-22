import { query } from '../pool'
import { prerequisiteModule } from './prerequisite'
import { module01 } from './module-01'
import { module02 } from './module-02'
import { module03 } from './module-03'
import { module04 } from './module-04'
import { module05 } from './module-05'
import type { Ss1ModuleData, Ss1LessonData } from './types'

export const SS1_THIRD_TERM_TITLE = 'SS1 Mathematics — Third Term'

const SS1_MODULES: Ss1ModuleData[] = [
  prerequisiteModule,
  module01, module02, module03, module04, module05,
]

const SS1_LESSON_COUNT = SS1_MODULES.reduce((total, m) => total + m.lessons.length, 0)

const SS1_OUTCOMES = [
  'Calculate the surface area and volume of cubes, cuboids, cylinders, cones, spheres and frustums.',
  'Construct lines, angles and triangles accurately with ruler and compasses only.',
  'Construct the circumcircle and incircle of triangles and understand basic loci.',
  'Collect, organise and present data using frequency tables, bar charts and pie charts.',
  'Calculate the mean, median, mode and range of ungrouped and grouped data.',
  'Calculate probabilities of single and combined events using addition and multiplication rules.',
]

const SS1_COURSE_CONTENT = `# Welcome to SS1 Mathematics — Third Term

This course covers the full Third Term scheme: mensuration of solid shapes, geometrical construction, statistics (data presentation and averages), and probability.

## Course Structure
- Pre-requisite Quiz (compulsory — pass 70% to unlock; reviews Second Term work)
- Module 1: Week 1-2 — Surface Area and Volume of Solid Shapes
- Module 2: Week 3-4 — Geometrical Construction
- Module 3: Week 5 — Statistics I: Data Collection & Presentation
- Module 4: Week 6-7 — Statistics II: Mean, Median, Mode & Range
- Module 5: Week 8-10 — Probability

## How to Study
- Read each lesson carefully, working through every example.
- Complete the Class Activity questions as you go.
- Attempt the Quiz at the end of each lesson — you can retry up to 3 times.
- Complete the Assignment, showing all your working.

## Before You Start
The course opens with a compulsory **Pre-requisite Quiz — Second Term Review**. You must score 70% or higher to unlock the remaining lessons.`

const SS1_DESCRIPTION =
  'SS1 Mathematics Third Term — mensuration of solids, geometrical construction, statistics and probability. A complete Nigerian secondary school curriculum course with worked examples, quizzes, and assignments.'

const PREREQ_MODULE_TITLE = 'Pre-requisite — Second Term Review'

export async function ensureSs1ThirdTermCourse() {
  const { rows: instructors } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1"
  )
  const instructorId = instructors[0]?.id
  if (!instructorId) { console.log('  SS1 Third Term: no active trainer — skipping.'); return }

  const { rows: existingCourse } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [SS1_THIRD_TERM_TITLE]
  )
  const courseId: string = existingCourse[0]?.id ?? (await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, content)
     VALUES ($1, $2, 'mathematics', 'intermediate', $3, 'published', $4, $5, '10 Weeks', $6) RETURNING id`,
    [SS1_THIRD_TERM_TITLE, SS1_DESCRIPTION, instructorId, SS1_LESSON_COUNT, SS1_OUTCOMES, SS1_COURSE_CONTENT]
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

  // Previously this returned early whenever the course already had any modules.
  // That turned an interrupted seed into a permanently half-built course, so the
  // loop below now converges on the desired structure instead.

  for (const [modulePosition, module] of SS1_MODULES.entries()) {
    const { rows: insertedModules } = await query<{ id: string }>(
      'INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id',
      [courseId, module.title, modulePosition]
    )
    const moduleId = insertedModules[0].id
    for (const [lessonPosition, lesson] of module.lessons.entries()) {
      const { rows: insertedLessons } = await query<{ id: string }>(
        'INSERT INTO lessons (module_id, title, content, duration, position) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [moduleId, lesson.title, lesson.content, lesson.duration, lessonPosition]
      )
      const lessonId = insertedLessons[0].id
      await query(
        "INSERT INTO resources (lesson_id, title, type, url) VALUES ($1, 'Further practice (Khan Academy Mathematics)', 'link', 'https://www.khanacademy.org/math')",
        [lessonId]
      )
      const quizId = await ensureLessonQuiz(lessonId, courseId, lesson, instructorId)
      await ensureLessonAssignment(lessonId, courseId, lesson)

      // Link the prerequisite lesson's quiz as the course-level prerequisite gate.
      if (module.title === PREREQ_MODULE_TITLE) {
        await query(
          'UPDATE courses SET prerequisite_quiz_id = $1 WHERE id = $2 AND (prerequisite_quiz_id IS NULL OR prerequisite_quiz_id <> $1)',
          [quizId, courseId]
        )
      }
    }
  }
  console.log(`  Seeded SS1 Mathematics — Third Term (${SS1_MODULES.length} modules, ${SS1_LESSON_COUNT} lessons).`)
}

async function ensureLessonQuiz(lessonId: string, courseId: string, lesson: Ss1LessonData, instructorId: string): Promise<string> {
  const { rows: existingQuiz } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, lesson.quiz.title]
  )
  let quizId = existingQuiz[0]?.id

  if (!quizId) {
    const { rows: quizzes } = await query<{ id: string }>(
      `INSERT INTO quizzes (course_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, false, true, $8) RETURNING id`,
      [courseId, lessonId, lesson.quiz.title, lesson.quiz.description, lesson.quiz.timeLimit, lesson.quiz.passingScore, lesson.quiz.maxAttempts, instructorId]
    )
    quizId = quizzes[0].id
  } else {
    // An interrupted previous run can leave a quiz row behind with no questions.
    const { rows: questionCount } = await query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM quiz_questions WHERE quiz_id = $1',
      [quizId]
    )
    if (Number(questionCount[0].count) > 0) return quizId
  }

  let position = 0
  for (const q of lesson.quiz.questions) {
    await query(
      // NOTE: quiz_questions has no `explanation` column (see src/db/migrate.ts),
      // so the optional explanation carried on the seed types is not persisted.
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
  return quizId
}

async function ensureLessonAssignment(lessonId: string, courseId: string, lesson: Ss1LessonData) {
  const { rows: existing } = await query<{ id: string }>(
    'SELECT id FROM assignments WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, lesson.assignment.title]
  )
  if (existing[0]) return

  await query(
    `INSERT INTO assignments (course_id, lesson_id, title, description, due_date, total_marks, passing_score, assignment_type, questions)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      courseId,
      lessonId,
      lesson.assignment.title,
      lesson.assignment.description,
      lesson.assignment.dueDate,
      lesson.assignment.totalMarks,
      lesson.assignment.passingScore,
      lesson.assignment.assignmentType,
      JSON.stringify(lesson.assignment.questions),
    ]
  )
}