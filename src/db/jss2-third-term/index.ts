import { query } from '../pool'
import { prerequisiteModule } from './prerequisite'
import { module01 } from './module-01'
import { module02 } from './module-02'
import { module03 } from './module-03'
import { module04 } from './module-04'
import type { Jss2ModuleData, Jss2LessonData } from './types'

export const JSS2_THIRD_TERM_TITLE = 'JSS2 Mathematics — Third Term'
const JSS2_MODULES: Jss2ModuleData[] = [prerequisiteModule, module01, module02, module03, module04]
const JSS2_LESSON_COUNT = JSS2_MODULES.reduce((t, m) => t + m.lessons.length, 0)
const JSS2_OUTCOMES = ['Construct angles and polygons.', 'Solve problems on elevation, depression, bearing and distance.', 'Present and interpret statistical data.', 'Compute and apply probability.']
const JSS2_CONTENT = '# Welcome to JSS2 Mathematics — Third Term\n\n## Structure\n- Pre-requisite Quiz (compulsory)\n- Module 1: Angles & Polygons\n- Module 2: Elevation & Bearing\n- Module 3: Statistics, Review & Probability I\n- Module 4: Probability II & Review'

export async function ensureJss2ThirdTermCourse() {
  const { rows: instructors } = await query<{ id: string }>("SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1")
  const instructorId = instructors[0]?.id
  if (!instructorId) { console.log('  JSS2 Third Term: no active trainer — skipping.'); return }
  const { rows: existingCourse } = await query<{ id: string }>('SELECT id FROM courses WHERE title = $1 LIMIT 1', [JSS2_THIRD_TERM_TITLE])
  const courseId: string = existingCourse[0]?.id ?? (await query<{ id: string }>(
    `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, content)
     VALUES ($1, $2, 'mathematics', 'intermediate', $3, 'published', $4, $5, '12 Weeks', $6) RETURNING id`,
    [JSS2_THIRD_TERM_TITLE, 'JSS2 Mathematics Third Term — Nigerian curriculum.', instructorId, JSS2_LESSON_COUNT, JSS2_OUTCOMES, JSS2_CONTENT])).rows[0].id
  await query(`UPDATE courses c SET instructor_id = $1 WHERE c.id = $2 AND c.instructor_id IN (SELECT id FROM users WHERE role = 'admin')`, [instructorId, courseId])
  const { rows: demoStudents } = await query<{ id: string }>("SELECT id FROM users WHERE email IN ('kolade@gmail.com', 'amaka@gmail.com') AND role = 'student'")
  for (const s of demoStudents) { await query('INSERT INTO enrollments (user_id, course_id, progress) VALUES ($1, $2, 0) ON CONFLICT (user_id, course_id) DO NOTHING', [s.id, courseId]) }
  const { rows: moduleCount } = await query<{ count: string }>('SELECT COUNT(*)::text AS count FROM modules WHERE course_id = $1', [courseId])
  if (Number(moduleCount[0].count) > 0) return
  for (const [modulePosition, module] of JSS2_MODULES.entries()) {
    const { rows: insertedModules } = await query<{ id: string }>('INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id', [courseId, module.title, modulePosition])
    const moduleId = insertedModules[0].id
    for (const [lessonPosition, lesson] of module.lessons.entries()) {
      const { rows: insertedLessons } = await query<{ id: string }>('INSERT INTO lessons (module_id, title, content, duration, position) VALUES ($1, $2, $3, $4, $5) RETURNING id', [moduleId, lesson.title, lesson.content, lesson.duration, lessonPosition])
      const lessonId = insertedLessons[0].id
      await ensureLessonQuiz(lessonId, courseId, lesson, instructorId)
      await ensureLessonAssignment(lessonId, courseId, lesson, instructorId)
    }
  }
  console.log(`  Seeded JSS2 Third Term (${JSS2_MODULES.length} modules, ${JSS2_LESSON_COUNT} lessons).`)
  /*__HELPERS__*/
}

async function ensureLessonQuiz(lessonId: string, courseId: string, lesson: Jss2LessonData, instructorId: string) {
  const { rows: existingQuiz } = await query<{ id: string }>('SELECT id FROM quizzes WHERE lesson_id = $1 AND title = $2 LIMIT 1', [lessonId, lesson.quiz.title])
  if (existingQuiz[0]) return
  const { rows: quizzes } = await query<{ id: string }>(`INSERT INTO quizzes (course_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, false, true, $8) RETURNING id`, [courseId, lessonId, lesson.quiz.title, lesson.quiz.description, lesson.quiz.timeLimit, lesson.quiz.passingScore, lesson.quiz.maxAttempts, instructorId])
  const quizId = quizzes[0].id
  let position = 0
  for (const q of lesson.quiz.questions) { await query(`INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [quizId, q.questionText, q.questionType, q.options ? JSON.stringify(q.options) : null, q.correctAnswer, q.points ?? 1, position++]) }
}

async function ensureLessonAssignment(lessonId: string, courseId: string, lesson: Jss2LessonData, instructorId: string) {
  const { rows: existing } = await query<{ id: string }>('SELECT id FROM assignments WHERE lesson_id = $1 AND title = $2 LIMIT 1', [lessonId, lesson.assignment.title])
  if (existing[0]) return
  await query(`INSERT INTO assignments (course_id, lesson_id, title, description, due_date, total_marks, passing_score, assignment_type, questions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [courseId, lessonId, lesson.assignment.title, lesson.assignment.description, lesson.assignment.dueDate, lesson.assignment.totalMarks, lesson.assignment.passingScore, lesson.assignment.assignmentType, JSON.stringify(lesson.assignment.questions)])
  void instructorId
}
