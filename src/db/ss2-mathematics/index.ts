import { query } from '../pool'
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
import { module12 } from './module-12'
import type { Ss2ModuleData } from './types'

// ─── SS2 Mathematics — First Term ────────────────────────────────────────────
// A complete, student-ready 12-week course seeded through the standard
// courses/modules/lessons/resources/quiz tables (no new tables, no new API).
//
// Idempotency strategy (mirrors ./curriculum.ts):
//  - the course is located by its exact title (stable identifier);
//  - modules/lessons/resources are only inserted while the course has none;
//  - the examination quiz is located by (course_id, title) before insert.
// Re-running this seed — on boot or via `npm run db:seed` — never duplicates.

export const SS2_COURSE_TITLE = 'SS2 Mathematics — First Term'

const SS2_MODULES: Ss2ModuleData[] = [
  module01, module02, module03, module04, module05, module06,
  module07, module08, module09, module10, module11, module12,
]

const SS2_LESSON_COUNT = SS2_MODULES.reduce((total, m) => total + m.lessons.length, 0)

const SS2_OUTCOMES = [
  'Use logarithm tables and standard form, including numbers less than 1',
  'Approximate numbers and calculate percentage errors to a stated degree of accuracy',
  'Solve problems on arithmetic and geometric progressions, series and means',
  'Solve quadratic equations by factorization, completing the square and the formula',
  'Solve simultaneous linear and quadratic equations algebraically and from word problems',
  'Draw and interpret linear and quadratic graphs, including graphical solutions',
]

const SS2_COURSE_CONTENT = `# Welcome to SS2 Mathematics — First Term

This is a complete 12-week course. Each week has its own module containing structured lessons with learning objectives, worked examples, class activities and assignments.

## Weekly Outline
1. **Week 1 — Revision:** variation, sectors, logarithms of numbers greater than 1, standard form.
2. **Week 2 — Logarithms of Numbers Less Than 1:** bar characteristics, operations with logarithms, simple logarithmic equations.
3. **Week 3 — Approximation & Percentage Error:** decimal places, significant figures, percentage error, degree of accuracy.
4. **Week 4 — Sequence & Series:** sequences and arithmetic progression.
5. **Week 5 — Sequence & Series:** sums of A.P., means, geometric progression and series.
6. **Week 6 — Revision of Quadratic Equations:** factorization, completing the square, the formula, roots, word problems.
7. **Week 7 — Revision of First Half's Work:** comprehensive revision and revision test.
8. **Week 8 — Quadratic Equations:** advanced equations, word problems and mixed practice.
9. **Week 9 — Simultaneous Equations:** linear pairs, one linear and one quadratic, word problems.
10. **Week 10 — Graphs:** linear and quadratic graphs, graphical solutions, applications.
11. **Week 11 — Revision of First Term Work:** comprehensive revision and practice examination.
12. **Week 12 — Examination:** the First Term Examination.

## How to Study
- Read each lesson slowly and copy every worked example into your notebook.
- Attempt the Class Activity before checking with your teacher.
- Complete every Assignment — they mirror WAEC question styles.
- Use the revision modules (Weeks 7 and 11) to test yourself under exam conditions.`
/** Idempotently seed the SS2 Mathematics — First Term course and its exam quiz. */
export async function ensureSS2MathematicsCourse() {
  const { rows: instructors } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1"
  )
    const instructorId = instructors[0]?.id
  if (!instructorId) {
    console.log('  SS2 Mathematics: no active trainer found — skipping seed.')
    return
  }


  // Course (identified by its exact title — never duplicated).
  const { rows: existingCourse } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [SS2_COURSE_TITLE]
  )
  const courseId =
    existingCourse[0]?.id ??
    (
      await query<{ id: string }>(
        `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, content)
         VALUES ($1, $2, 'mathematics', 'intermediate', $3, 'published', $4, $5, '12 Weeks', $6)
         RETURNING id`,
        [
          SS2_COURSE_TITLE,
          'This SS2 Mathematics First Term course covers logarithms, approximation and percentage error, sequences and series, quadratic equations, simultaneous equations, and graphical methods. Students will develop mathematical problem-solving skills through structured lessons, worked examples, class activities, assignments, revision exercises, and examination preparation.',
          instructorId,
          SS2_LESSON_COUNT,
          SS2_OUTCOMES,
          SS2_COURSE_CONTENT,
        ]
      )
    ).rows[0].id

  // Ownership enforcement: if the course is currently owned by an admin (not a
  // trainer) reassign it to the demo trainer so it shows up in the Trainer
  // Portal and is editable through the owner-gated trainer routes — mirroring
  // how src/db/seed.ts assigns instructor_id = trainer.id to its courses.
  await query(
    `UPDATE courses c SET instructor_id = $1
      WHERE c.id = $2
        AND c.instructor_id IN (SELECT id FROM users WHERE role = 'admin')`,
    [instructorId, courseId]
  )

  // Enroll the demo students (kolade, amaka) so they can open the course
  // immediately from the student dashboard — mirroring the demo-enrollment
  // pattern in src/db/seed.ts (ON CONFLICT keeps this idempotent).
  const { rows: demoStudents } = await query<{ id: string }>(
    "SELECT id FROM users WHERE email IN ('kolade@gmail.com', 'amaka@gmail.com') AND role = 'student'"
  )
  for (const s of demoStudents) {
    await query(
      'INSERT INTO enrollments (user_id, course_id, progress) VALUES ($1, $2, 0) ON CONFLICT (user_id, course_id) DO NOTHING',
      [s.id, courseId]
    )
  }

  // Modules + lessons (only while the course has no modules yet).
  const { rows: moduleCount } = await query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM modules WHERE course_id = $1',
    [courseId]
  )
  if (Number(moduleCount[0].count) > 0) return

  for (const [modulePosition, module] of SS2_MODULES.entries()) {
    const { rows: insertedModules } = await query<{ id: string }>(
      'INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id',
      [courseId, module.title, modulePosition]
    )
    for (const [lessonPosition, lesson] of module.lessons.entries()) {
      const { rows: insertedLessons } = await query<{ id: string }>(
        'INSERT INTO lessons (module_id, title, content, duration, position) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [insertedModules[0].id, lesson.title, lesson.content, lesson.duration, lessonPosition]
      )
      await query(
        "INSERT INTO resources (lesson_id, title, type, url) VALUES ($1, 'Further practice (Khan Academy Mathematics)', 'link', 'https://www.khanacademy.org/math')",
        [insertedLessons[0].id]
      )
    }
  }
  console.log(`  Seeded SS2 Mathematics — First Term (${SS2_MODULES.length} modules, ${SS2_LESSON_COUNT} lessons).`)

  await ensureSS2ExaminationQuiz(courseId, instructorId)
}
/**
 * Seed the First Term Examination quiz for the SS2 Mathematics course.
 * Uses the existing quizzes/quiz_questions system (same pattern as the HTML
 * Foundations Examination in ./curriculum.ts). Located by (course_id, title),
 * so re-running never duplicates questions.
 */
async function ensureSS2ExaminationQuiz(courseId: string, instructorId: string) {
  const quizTitle = 'SS2 Mathematics — First Term Examination'
  const { rows: existingQuiz } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE course_id = $1 AND title = $2',
    [courseId, quizTitle]
  )
  if (existingQuiz[0]) return

  const { rows: quizzes } = await query<{ id: string }>(
    `INSERT INTO quizzes (course_id, title, description, time_limit, passing_score, max_attempts, created_by)
     VALUES ($1, $2, $3, 60, 50, 3, $4) RETURNING id`,
    [
      courseId,
      quizTitle,
      'Objective and theory examination covering logarithms, approximation and percentage error, sequences and series, quadratic equations, simultaneous equations, and graphs.',
      instructorId,
    ]
  )
  await query(
    `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position) VALUES
    ($1, 'The characteristic of log 0.00052 is bar-four (4).', 'true_false', NULL, 'true', 5, 0),
    ($1, 'Express 8076.5 in standard form.', 'multiple_choice', '[{"id":"a","text":"8.0765 x 10^3","isCorrect":true},{"id":"b","text":"8.0765 x 10^-3","isCorrect":false},{"id":"c","text":"80.765 x 10^2","isCorrect":false},{"id":"d","text":"8.0765 x 10^4","isCorrect":false}]', 'a', 5, 1),
    ($1, 'log 2 + log 5 equals:', 'multiple_choice', '[{"id":"a","text":"log 7","isCorrect":false},{"id":"b","text":"log 10 = 1","isCorrect":true},{"id":"c","text":"log 0.1","isCorrect":false},{"id":"d","text":"10","isCorrect":false}]', 'b', 5, 2),
    ($1, 'The 20th term of the A.P. 7, 11, 15, ... is:', 'multiple_choice', '[{"id":"a","text":"83","isCorrect":true},{"id":"b","text":"87","isCorrect":false},{"id":"c","text":"79","isCorrect":false},{"id":"d","text":"91","isCorrect":false}]', 'a', 5, 3),
    ($1, 'The sum of the first 12 terms of the A.P. -4, -1, 2, ... is:', 'multiple_choice', '[{"id":"a","text":"150","isCorrect":false},{"id":"b","text":"156","isCorrect":true},{"id":"c","text":"162","isCorrect":false},{"id":"d","text":"168","isCorrect":false}]', 'b', 5, 4),
    ($1, 'The sum to infinity of the G.P. 12 + 4 + 4/3 + ... is:', 'multiple_choice', '[{"id":"a","text":"18","isCorrect":true},{"id":"b","text":"16","isCorrect":false},{"id":"c","text":"20","isCorrect":false},{"id":"d","text":"24","isCorrect":false}]', 'a', 5, 5),
    ($1, 'The roots of 2x^2 - 9x + 4 = 0 are:', 'multiple_choice', '[{"id":"a","text":"x = 1/2 and x = 4","isCorrect":true},{"id":"b","text":"x = -1/2 and x = -4","isCorrect":false},{"id":"c","text":"x = 2 and x = -2","isCorrect":false},{"id":"d","text":"x = 9 and x = 4","isCorrect":false}]', 'a', 5, 6),
    ($1, 'If the roots of a quadratic equation are 2 and -5, the equation is:', 'multiple_choice', '[{"id":"a","text":"x^2 - 3x - 10 = 0","isCorrect":false},{"id":"b","text":"x^2 + 3x - 10 = 0","isCorrect":true},{"id":"c","text":"x^2 - 3x + 10 = 0","isCorrect":false},{"id":"d","text":"x^2 + 10x - 3 = 0","isCorrect":false}]', 'b', 5, 7),
    ($1, 'Solve the pair x + y = 8 and x - y = 2.', 'fill_blank', NULL, 'x = 5, y = 3', 5, 8),
    ($1, '0.006897 correct to 3 significant figures is 0.00690.', 'true_false', NULL, 'true', 5, 9),
    ($1, 'Solve 2x^2 - 9x + 4 = 0 by factorization, showing all working. (6 marks)', 'essay', NULL, NULL, 10, 10),
    ($1, 'The 3rd term of a G.P. is 12 and the 6th term is 96. Find the first term, the common ratio and the sum of the first 8 terms. (10 marks)', 'essay', NULL, NULL, 10, 11)`,
    [quizzes[0].id]
  )
  console.log('  Seeded SS2 Mathematics — First Term Examination quiz (12 questions).')
}
// __END__
