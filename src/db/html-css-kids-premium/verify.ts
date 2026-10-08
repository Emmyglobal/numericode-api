import { query, endPool } from '../pool'
import { KIDS_MODULES } from './data'

async function main(): Promise<void> {
  const TITLE = 'HTML and CSS Adventure for Kids (Premium)'
  const { rows: c } = await query(
    'SELECT id, lesson_count, access_level, price_cents, currency, premium_enabled, instructor_id FROM courses WHERE title = $1',
    [TITLE],
  )
  console.log('courses:', c.length, JSON.stringify(c[0] && {
    lesson_count: c[0].lesson_count,
    access_level: c[0].access_level,
    price_cents: c[0].price_cents,
    currency: c[0].currency,
    premium_enabled: c[0].premium_enabled,
    has_instructor: Boolean(c[0].instructor_id),
  }))
  const cid = c[0]?.id
  if (!cid) process.exit(1)

  const one = async (sql: string) => (await query(sql, [cid])).rows[0].n as number
  console.log('modules:', await one('SELECT count(*)::int AS n FROM modules WHERE course_id = $1'))
  console.log('lessons:', await one('SELECT count(*)::int AS n FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = $1'))
  console.log('quizzes:', await one('SELECT count(*)::int AS n FROM quizzes WHERE course_id = $1'))
  console.log('quiz_questions:', await one('SELECT count(*)::int AS n FROM quiz_questions qq JOIN quizzes z ON z.id = qq.quiz_id WHERE z.course_id = $1'))
  console.log('assignments:', await one('SELECT count(*)::int AS n FROM assignments WHERE course_id = $1'))
  console.log('resources:', await one('SELECT count(*)::int AS n FROM resources res JOIN lessons l ON l.id = res.lesson_id JOIN modules m ON m.id = l.module_id WHERE m.course_id = $1'))

  // Question-type spread + essay mapping sanity.
  const { rows: types } = await query(
    `SELECT qq.question_type, count(*)::int AS n FROM quiz_questions qq
     JOIN quizzes z ON z.id = qq.quiz_id
     WHERE z.course_id = $1 GROUP BY qq.question_type ORDER BY qq.question_type`,
    [cid],
  )
  console.log('question_types:', JSON.stringify(types))

  const expL = KIDS_MODULES.reduce((s, m) => s + m.lessons.length, 0)
  const expQ = KIDS_MODULES.reduce((s, m) => s + m.lessons.reduce((s2, l) => s2 + l.quiz.questions.length, 0), 0)
  const expA = KIDS_MODULES.reduce((s, m) => s + m.lessons.filter((l) => l.assignment).length, 0)
  const expR = KIDS_MODULES.reduce((s, m) => s + m.lessons.reduce((s2, l) => s2 + l.resources.length, 0), 0)
  console.log('expected: lessons=' + expL + ' questions=' + expQ + ' assignments=' + expA + ' resources=' + expR)

  await endPool()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
