// ─── HTML & CSS Adventure for Kids (Premium) — seed ───────────────────────────
// Idempotent: the course is located by title, modules/lessons are inserted only
// while the course is empty, and quizzes/assignments/resources are keyed by
// (lesson_id, title). Question types below are the source types; 'short_answer'
// is mapped to 'essay' (the open-ended type the quiz pipeline accepts).
import { query } from '../pool'
import { KIDS_MODULES } from './data'
import type { KidsModuleData } from './types'

export const KIDS_COURSE_TITLE = 'HTML and CSS Adventure for Kids (Premium)'
export const KIDS_PRICE_CENTS = 4999

// Course outcomes (matches content/courses/html-css-kids-premium.json).
export const KIDS_OUTCOMES = [
  'Write HTML headings paragraphs lists images and links',
  'Style pages with colours fonts boxes and gradients',
  'Lay out rooms cards galleries heroes menus and forms',
  'Build and demo a responsive party page',
]

// Long-form course content shown on the course page (markdown, courses.content).
export const KIDS_COURSE_CONTENT = `# HTML & CSS Adventure for Kids (Premium)

A premium 5-module, 15-lesson adventure for ages 8-14. Every lesson is a colourful PowerPoint-style slide show with a quiz and an assignment. Ends with a party-page showcase.

## What you will build
- Friendly HTML pages with headings, paragraphs, lists, images and links
- Colourful styles: fonts, boxes, gradients and animations
- Layouts: rooms, cards, galleries, heroes, menus and forms
- A responsive party page you can demo to friends and family

## How it works
Each lesson is a bite-sized slide deck you can flip through, followed by a short quiz to check what you learned and a hands-on assignment to practise.
`

function mapQuestionType(source: 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank'): 'multiple_choice' | 'true_false' | 'essay' | 'fill_blank' {
  return source === 'short_answer' ? 'essay' : source
}

function correctAnswerFor(q: {
  questionType: 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank'
  correctAnswer: string | boolean | null
  options?: Array<{ id: string; text: string; isCorrect: boolean }> | null
}): string | null {
  if (q.questionType === 'multiple_choice' && q.options && q.options.length > 0) {
    const correct = q.options.find((o) => o.isCorrect)
    return correct?.id ?? q.options[0]?.id ?? null
  }
  if (q.questionType === 'true_false') {
    return q.correctAnswer ? 'true' : 'false'
  }
  if (typeof q.correctAnswer !== 'string') return null
  return q.correctAnswer
}

/** Creates (or heals) the premium kids course and all of its content. */
export async function ensureHtmlCssKidsPremiumCourse() {
  const { rows: trainers } = await query<{ id: string }>(
    "SELECT id FROM users WHERE role = 'trainer' AND status = 'active' AND account_activated = TRUE ORDER BY created_at LIMIT 1",
  )
  const instructorId = trainers[0]?.id
  if (!instructorId) {
    console.log('  Kids: no active trainer found — skipping seed.')
    return
  }
  const kidsLessons = KIDS_MODULES.flatMap((m) => m.lessons)

  const { rows: existing } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1 LIMIT 1',
    [KIDS_COURSE_TITLE],
  )
  let courseId = existing[0]?.id
  if (!courseId) {
    const { rows } = await query<{ id: string }>(
      `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, thumbnail_url, duration, content, access_level, price_cents, currency, premium_enabled)
       VALUES ($1, $2, 'programming', 'beginner', $3, 'published', $4, $5, $6, '10 Weeks', $7, 'premium', $8, 'NGN', TRUE)
       RETURNING id`,
      [
        KIDS_COURSE_TITLE,
        'A premium 5-module, 15-lesson adventure for ages 8-14. Every lesson is a colourful PowerPoint-style slide show with a quiz and an assignment. Ends with a party-page showcase.',
        instructorId,
        kidsLessons.length,
        KIDS_OUTCOMES,
        '/images/courses/html-css-kids.png',
        KIDS_COURSE_CONTENT,
        KIDS_PRICE_CENTS,
      ],
    )
    courseId = rows[0].id
  }

  // Modules and lessons are keyed by their unique positions so an interrupted
  // run resumes instead of starting over (and never duplicates rows).
  for (const [modulePosition, module] of KIDS_MODULES.entries()) {
    const { rows: existingModules } = await query<{ id: string }>(
      'SELECT id FROM modules WHERE course_id = $1 AND position = $2 LIMIT 1',
      [courseId, modulePosition],
    )
    let moduleId = existingModules[0]?.id
    if (!moduleId) {
      const { rows: modules } = await query<{ id: string }>(
        'INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id',
        [courseId, module.title, modulePosition],
      )
      moduleId = modules[0].id
    }
    for (const [lessonPosition, lesson] of module.lessons.entries()) {
      const { rows: existingLessons } = await query<{ id: string }>(
        'SELECT id FROM lessons WHERE module_id = $1 AND position = $2 LIMIT 1',
        [moduleId, lessonPosition],
      )
      let lessonId = existingLessons[0]?.id
      if (!lessonId) {
        const { rows: insertedLessons } = await query<{ id: string }>(
          `INSERT INTO lessons (module_id, title, content, duration, position)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [moduleId, lesson.title, lesson.content, lesson.estimatedDurationMinutes, lessonPosition],
        )
        lessonId = insertedLessons[0].id
      }

      await ensureLessonQuiz(lessonId, courseId, lesson, instructorId)
      await ensureLessonAssignment(lessonId, courseId, lesson)

      for (const resource of lesson.resources) {
        const { rows: existingResource } = await query<{ id: string }>(
          'SELECT id FROM resources WHERE lesson_id = $1 AND title = $2 LIMIT 1',
          [lessonId, resource.title],
        )
        if (existingResource[0]) continue
        await query(
          `INSERT INTO resources (lesson_id, title, type, url) VALUES ($1, $2, 'link', $3)`,
          [lessonId, resource.title, resource.url],
        )
      }
    }
  }
  console.log(`  Kids course ensured: ${KIDS_MODULES.length} modules, ${kidsLessons.length} lessons.`)
}


async function ensureLessonQuiz(lessonId: string, courseId: string, lesson: KidsModuleData['lessons'][number], instructorId: string) {
  const expectedCount = lesson.quiz.questions.length
  const { rows: existingQuiz } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, lesson.quiz.title],
  )
  let quizId = existingQuiz[0]?.id
  if (quizId) {
    // Heal a quiz left half-seeded by an interrupted run. Nothing references
    // quiz_questions, so dropping and re-inserting its questions is safe.
    const { rows: existingQuestions } = await query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM quiz_questions WHERE quiz_id = $1',
      [quizId],
    )
    if (Number(existingQuestions[0].count) === expectedCount) return quizId
    await query('DELETE FROM quiz_questions WHERE quiz_id = $1', [quizId])
  } else {
    const { rows } = await query<{ id: string }>(
      `INSERT INTO quizzes (course_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, TRUE, $8) RETURNING id`,
      [courseId, lessonId, lesson.quiz.title, lesson.quiz.description, lesson.quiz.timeLimit, lesson.quiz.passingScore, lesson.quiz.maxAttempts, instructorId],
    )
    quizId = rows[0].id
  }
  let position = 0
  for (const q of lesson.quiz.questions) {
    const options = formatOptions(q)
    await query(
      `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        quizId,
        q.question,
        mapQuestionType(q.questionType),
        options ? JSON.stringify(options) : null,
        correctAnswerFor(q),
        1,
        position++,
        q.explanation,
      ],
    )
  }
  return quizId
}

async function ensureLessonAssignment(lessonId: string, courseId: string, lesson: KidsModuleData['lessons'][number]) {
  if (!lesson.assignment) return
  const { rows: existing } = await query(
    'SELECT id FROM assignments WHERE lesson_id = $1 AND title = $2 LIMIT 1',
    [lessonId, lesson.assignment.title],
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
      'theory',
      JSON.stringify(lesson.assignment.questions),
    ],
  )
}


function formatOptions(q: {
  options?: Array<{ id: string; text: string; isCorrect: boolean }> | null
}): Array<{ id: string; text: string; isCorrect: boolean }> | null {
  if (!q.options) return null
  return q.options.map((o, i) => ({ id: String.fromCharCode(97 + i), text: o.text, isCorrect: o.isCorrect }))
}
