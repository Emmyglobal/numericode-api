import { query } from '../pool'
import { module01 } from './module-01'
import { module02 } from './module-02'
import { module03 } from './module-03'
import { module04 } from './module-04'
import { module05 } from './module-05'
import { module06 } from './module-06'
import { prerequisiteModule } from './prerequisite'
import type { ModuleData, LessonData } from './types'

// ─── Python Course — Beginner to Intermediate ───────────────────────────────
// Seeded through the standard schema (same as ../ml-course, ../ss2-mathematics).
// Idempotent: course by title, modules only while empty, quiz/assignment keyed
// by (lesson_id, title) before insert.

export const PYTHON_COURSE_TITLE = 'Python Programming — Beginner to Intermediate'

const PYTHON_MODULES: ModuleData[] = [
  prerequisiteModule,
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
]
const PYTHON_LESSON_COUNT = PYTHON_MODULES.reduce((t, m) => t + m.lessons.length, 0)

const PYTHON_OUTCOMES = [
  'Write clean Python with variables, lists, functions, and control flow.',
  'Manipulate strings, dictionaries, sets, and nested data structures.',
  'Read and write files (text, CSV, JSON) and use packages with virtual environments.',
  'Use NumPy arrays and pandas DataFrames to load, clean, and summarize data.',
  'Apply object-oriented programming with classes, methods, and inheritance.',
  'Build small end-to-end Python projects with HTTP requests and data analysis.',
]

const PYTHON_COURSE_CONTENT = `# Welcome to Python Programming

A hands-on, code-first Python course from first program to a real data-analysis project.

## Course Structure
- Module 1: Python Foundations
- Module 2: Collections & Data Structures
- Module 3: Files, Modules & Environments
- Module 4: Data with NumPy & Pandas
- Module 5: Object-Oriented Python
- Module 6: Capstone & Next Steps
`

export async function ensurePythonCourse() {
  const { rows: instructors } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1"
  )
  const instructorId = instructors[0]?.id
  if (!instructorId) {
    console.log('  Python: no active trainer found — skipping seed.')
    return
  }

  const { rows: existingCourse } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [PYTHON_COURSE_TITLE]
  )
  const courseId: string =
    existingCourse[0]?.id ??
    (
      await query<{ id: string }>(
        `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, content)
         VALUES ($1, $2, 'programming', 'beginner', $3, 'published', $4, $5, '8 Weeks', $6)
         RETURNING id`,
        [
          PYTHON_COURSE_TITLE,
          'A hands-on, code-first Python course covering fundamentals, data structures, NumPy/pandas, OOP, and a capstone project.',
          instructorId,
          PYTHON_LESSON_COUNT,
          PYTHON_OUTCOMES,
          PYTHON_COURSE_CONTENT,
        ]
      )
    ).rows[0].id

  await query(
    `UPDATE courses c SET instructor_id = $1
       WHERE c.id = $2 AND c.instructor_id IN (SELECT id FROM users WHERE role = 'admin')`,
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
  if (Number(moduleCount[0].count) > 0) return

  for (const [modulePosition, module] of PYTHON_MODULES.entries()) {
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
      await ensureLessonQuiz(lessonId, courseId, lesson, instructorId)
      await ensureLessonAssignment(lessonId, courseId, lesson, instructorId)
    }
  }
  console.log(`  Seeded Python (${PYTHON_MODULES.length} modules, ${PYTHON_LESSON_COUNT} lessons).`)
  }

async function ensureLessonQuiz(lessonId: string, courseId: string, lesson: LessonData, instructorId: string) {
  const { rows: existingQuiz } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, lesson.quiz.title]
  )
  if (existingQuiz[0]) return
  const { rows: quizzes } = await query<{ id: string }>(
    `INSERT INTO quizzes (course_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, false, true, $8) RETURNING id`,
    [courseId, lessonId, lesson.quiz.title, lesson.quiz.description, lesson.quiz.timeLimit, lesson.quiz.passingScore, lesson.quiz.maxAttempts, instructorId]
  )
  const quizId = quizzes[0].id
  let position = 0
  for (const q of lesson.quiz.questions) {
    await query(
      `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [quizId, q.questionText, q.questionType, q.options ? JSON.stringify(q.options) : null, q.correctAnswer, q.points ?? 1, position++]
    )
  }
}

async function ensureLessonAssignment(lessonId: string, courseId: string, lesson: LessonData, instructorId: string) {
  const { rows: existing } = await query<{ id: string }>(
    'SELECT id FROM assignments WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, lesson.assignment.title]
  )
  if (existing[0]) return
  await query(
    `INSERT INTO assignments (course_id, lesson_id, title, description, due_date, total_marks, passing_score, assignment_type, questions)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [courseId, lessonId, lesson.assignment.title, lesson.assignment.description, lesson.assignment.dueDate, lesson.assignment.totalMarks, lesson.assignment.passingScore, lesson.assignment.assignmentType, JSON.stringify(lesson.assignment.questions)]
  )
  void instructorId
}
