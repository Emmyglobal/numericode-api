import { query } from '../pool'
import { prerequisiteModule } from './prerequisite'
import { module01 } from './module-01'
import { module02 } from './module-02'
import { module03 } from './module-03'
import { module04 } from './module-04'
import { module05 } from './module-05'
import { module06 } from './module-06'
import type { MlModuleData, MlLessonData } from './types'

// ─── Machine Learning — Beginner to Intermediate ──────────────────────────────
// Seeded through the standard courses/modules/lessons/quizzes/quiz_questions/
// assignments schema. Per-lesson quizzes and assignments are supported because
// the quizzes and assignments tables both carry a lesson_id foreign key
// (see src/db/migrate.ts). Idempotency mirrors ./ss2-mathematics/index.ts:
// course by title, modules/lessons only while the course has none, and each
// lesson's quiz/assignment located by (lesson_id, title) before insert.

export const ML_COURSE_TITLE = "Machine Learning — Beginner to Intermediate"

const ML_MODULES: MlModuleData[] = [
  prerequisiteModule,
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
]

const ML_LESSON_COUNT = ML_MODULES.reduce((total, m) => total + m.lessons.length, 0)

const ML_OUTCOMES = [
  'Write Python with NumPy and pandas to load, clean, and scale data for machine learning.',
  'Train and evaluate supervised learners (linear and logistic regression, k-NN, trees, ensembles, SVMs) and interpret their metrics.',
  'Apply unsupervised techniques (clustering, PCA, anomaly detection) to find structure in unlabeled data.',
  'Build, tune, and validate models responsibly using cross-validation, regularization, and proper evaluation metrics.',
  'Explain how neural networks learn and apply dropout and early stopping to reduce overfitting.',
  'Frame an ML problem, consider data ethics and bias, and deploy a simple model end-to-end.',
]

const ML_COURSE_CONTENT = `# Welcome to Machine Learning — Beginner to Intermediate

This is a hands-on, code-first course in Python using scikit-learn. You go from Python and data-handling basics to supervised, unsupervised, and neural-network models, finishing with a real project.

## Course Structure
- Module 1: Python & ML Foundations
- Module 2: Core Supervised Learning
- Module 3: Unsupervised Learning
- Module 4: Model Evaluation & Practice
- Module 5: Introduction to Neural Networks
- Module 6: Real-World ML

## How to Study
- Read each lesson and run every Practical Exercise in a Python environment (NumPy, pandas, and scikit-learn required).
- Take each lesson Quiz as you go to check understanding.
- Complete each Assignment — they extend the lesson idea to a new dataset.
- Build the Capstone in Module 6 combining everything you have learned.
`

export async function ensureMachineLearningCourse() {
  const { rows: instructors } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1"
  )
  const instructorId = instructors[0]?.id
  if (!instructorId) {
    console.log('  Machine Learning: no active trainer found — skipping seed.')
    return
  }

  const { rows: existingCourse } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [ML_COURSE_TITLE]
  )
  const courseId: string =
    existingCourse[0]?.id ??
    (
      await query<{ id: string }>(
        `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, content)
         VALUES ($1, $2, 'programming', 'beginner', $3, 'published', $4, $5, '8 Weeks', $6)
         RETURNING id`,
        [
          ML_COURSE_TITLE,
          'A hands-on, code-first Machine Learning course in Python with scikit-learn. Covers Python/NumPy/Pandas foundations, supervised and unsupervised learning, model evaluation, an introduction to neural networks, and a real-world capstone project.',
          instructorId,
          ML_LESSON_COUNT,
          ML_OUTCOMES,
          ML_COURSE_CONTENT,
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

  for (const [modulePosition, module] of ML_MODULES.entries()) {
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
  console.log(`  Seeded Machine Learning (${ML_MODULES.length} modules, ${ML_LESSON_COUNT} lessons).`)

  }

// Per-lesson quiz (located by lesson_id + title so re-seeding never duplicates).
async function ensureLessonQuiz(
  lessonId: string,
  courseId: string,
  lesson: MlLessonData,
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

// Per-lesson assignment (located by lesson_id + title so re-seeding never duplicates).
async function ensureLessonAssignment(
  lessonId: string,
  courseId: string,
  lesson: MlLessonData,
  instructorId: string
) {
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
  // instructorId retained for parity with the ss2 trainer-scoped pattern.
  void instructorId
}
