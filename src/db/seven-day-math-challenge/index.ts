import { query } from '../pool'
import type { ChallengeModuleData, ChallengeQuizData } from './types'
import { day1 } from './day1'
import { day2 } from './day2'
import { day3 } from './day3'
import { day4 } from './day4'
import { day5 } from './day5'
import { day6 } from './day6'
import { day7 } from './day7'

// ─── 7-Day Mathematics Challenge ───────────────────────────────────────────────
// NumeryCode's free-entry user-acquisition course. Seeded through the standard
// courses / modules / lessons / quizzes / quiz_questions tables — no new tables,
// no new API surface, no new challenge system. Students use the normal
// enrolment, lesson viewer, quiz and progress flow.
//
// Idempotency (mirrors ./ss2-mathematics/index.ts):
//   - the course is located by its exact title (stable identifier);
//   - modules/lessons/quizzes are only inserted while the course has none;
//   - each quiz is located by (lesson_id, title) before insert.
// `seed()` runs on every boot and via `npm run db:seed`, so re-running must be
// a clean no-op.

export const CHALLENGE_COURSE_TITLE = '7-Day Mathematics Challenge'

const CHALLENGE_DESCRIPTION =
  'Build stronger Mathematics skills in just 7 days. Learn one important topic each day, ' +
  'practise what you learn, and test your understanding with short quizzes.'

const CHALLENGE_OUTCOMES = [
  'By the end of this challenge, students should have stronger confidence with algebra, indices, ' +
    'logarithms, simultaneous equations and quadratic equations.',
]

const CHALLENGE_MODULES: ChallengeModuleData[] = [day1, day2, day3, day4, day5, day6, day7]

const CHALLENGE_LESSON_COUNT = CHALLENGE_MODULES.reduce(
  (total, module) => total + module.lessons.length,
  0,
)

const CHALLENGE_QUIZ_COUNT = CHALLENGE_MODULES.reduce(
  (total, module) => total + module.lessons.filter((lesson) => lesson.quiz).length,
  0,
)

const CHALLENGE_QUESTION_COUNT = CHALLENGE_MODULES.reduce(
  (total, module) =>
    total + module.lessons.reduce((sum, lesson) => sum + (lesson.quiz?.questions.length ?? 0), 0),
  0,
)

/** The course landing page shown on the public course detail view. */
const COURSE_CONTENT = `# Welcome to the 7-Day Mathematics Challenge

Seven days, five important topics, one clear goal: stronger confidence in the
mathematics you meet every day in secondary school.

## What you will cover
1. **Day 1 — Algebra Basics:** variables, terms, like terms and simple equations.
2. **Day 2 — Indices:** what indices mean and the laws you need.
3. **Day 3 — Logarithms:** the meaning of logs and their basic laws.
4. **Day 4 — Simultaneous Equations:** elimination and substitution.
5. **Day 5 — Quadratic Equations:** factorisation and the quadratic formula.
6. **Day 6 — Mixed Practice:** all five topics together.
7. **Day 7 — Final Challenge:** revision and a 15-question assessment.

## How to work through it
- Read the lesson, then try the practice questions **before** opening the quiz.
- Every quiz shows your score straight away, and you can retry it up to three times.
- Your progress is saved, so you can stop and come back later.

## This course is free
There is nothing to pay and no code to redeem. Enrol, then start on Day 1.`

/**
 * Inserts the lesson's quiz (with per-question explanations) unless it exists.
 * Located by (lesson_id, title), so re-seeding never duplicates questions.
 */
async function ensureLessonQuiz(
  lessonId: string,
  courseId: string,
  quiz: ChallengeQuizData,
  instructorId: string,
): Promise<void> {
  const { rows: existing } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, quiz.title],
  )
  if (existing[0]) return

  const { rows: inserted } = await query<{ id: string }>(
    `INSERT INTO quizzes (course_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, false, true, $8) RETURNING id`,
    [
      courseId,
      lessonId,
      quiz.title,
      quiz.description,
      quiz.timeLimit,
      quiz.passingScore,
      quiz.maxAttempts,
      instructorId,
    ],
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
      ],
    )
  }
}

export async function ensureSevenDayMathChallengeCourse(): Promise<void> {
  // Same trainer-lookup pattern as the other course seeders, so the course is
  // owned by a real active trainer and appears in the Trainer Portal.
  const { rows: instructors } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1",
  )
  const instructorId = instructors[0]?.id
  if (!instructorId) {
    console.log('  7-Day Mathematics Challenge: no active trainer found — skipping seed.')
    return
  }

  // Course (identified by its exact title — never duplicated).
  const { rows: existingCourse } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [CHALLENGE_COURSE_TITLE],
  )

  let courseId = existingCourse[0]?.id
  if (!courseId) {
    // access_level = 'free' is what makes this the free-entry course: the
    // enrolment, entitlement and content gates only engage for 'premium', so a
    // free course is reachable with a plain enrolment and no payment. The
    // schema defaults (price_cents = 0, currency = 'NGN') are left in place
    // rather than restated here.
    const { rows: inserted } = await query<{ id: string }>(
      `INSERT INTO courses (title, description, subject, level, instructor_id, status,
                            lesson_count, outcomes, duration, access_level, content)
       VALUES ($1, $2, 'mathematics', 'beginner', $3, 'published', $4, $5, '7 Days', 'free', $6)
       RETURNING id`,
      [
        CHALLENGE_COURSE_TITLE,
        CHALLENGE_DESCRIPTION,
        instructorId,
        CHALLENGE_LESSON_COUNT,
        CHALLENGE_OUTCOMES,
        COURSE_CONTENT,
      ],
    )
    courseId = inserted[0].id
  }

  // Keep lesson_count honest if this course already existed from an earlier
  // seed run (cheap, and idempotent).
  await query('UPDATE courses SET lesson_count = $1 WHERE id = $2', [
    CHALLENGE_LESSON_COUNT,
    courseId,
  ])

  // Ownership enforcement (same as the other seeders): reassign to the demo
  // trainer if an admin currently owns it, so it is editable in the Trainer
  // Portal through the owner-gated trainer routes.
  await query(
    `UPDATE courses c SET instructor_id = $1
      WHERE c.id = $2
        AND c.instructor_id IN (SELECT id FROM users WHERE role = 'admin')`,
    [instructorId, courseId],
  )

  // Modules + lessons (only while the course has no modules yet).
  const { rows: moduleCount } = await query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM modules WHERE course_id = $1',
    [courseId],
  )
  if (Number(moduleCount[0].count) > 0) return

  for (const [modulePosition, module] of CHALLENGE_MODULES.entries()) {
    const { rows: insertedModule } = await query<{ id: string }>(
      'INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id',
      [courseId, module.title, modulePosition],
    )

    for (const [lessonPosition, lesson] of module.lessons.entries()) {
      const { rows: insertedLesson } = await query<{ id: string }>(
        `INSERT INTO lessons (module_id, title, content, duration, position)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [insertedModule[0].id, lesson.title, lesson.content, lesson.duration, lessonPosition],
      )

      // A short "Further practice" link on every lesson, matching the other
      // seeded courses. Free resource — no premium gate applies.
      await query(
        `INSERT INTO resources (lesson_id, title, type, url)
         VALUES ($1, 'Further practice (Khan Academy Mathematics)', 'link', 'https://www.khanacademy.org/math')`,
        [insertedLesson[0].id],
      )

      if (lesson.quiz) {
        await ensureLessonQuiz(insertedLesson[0].id, courseId, lesson.quiz, instructorId)
      }
    }
  }

  console.log(
    `  Seeded ${CHALLENGE_COURSE_TITLE} ` +
      `(${CHALLENGE_MODULES.length} modules, ${CHALLENGE_LESSON_COUNT} lessons, ` +
      `${CHALLENGE_QUIZ_COUNT} quizzes, ${CHALLENGE_QUESTION_COUNT} questions).`,
  )
}
