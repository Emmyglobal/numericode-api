// READ-ONLY: does anything have progress tied to the colliding/thin courses?
require('dotenv/config')
const { Pool } = require('pg')
const url = new URL(process.env.DATABASE_URL)
url.searchParams.delete('sslmode')
const pool = new Pool({
  connectionString: url.toString(),
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
})

;(async () => {
  try {
    const r = await pool.query(`
      SELECT c.title,
             (SELECT COUNT(*)::int FROM enrollments e WHERE e.course_id = c.id)                       AS enrollments,
             (SELECT COUNT(*)::int FROM lesson_completions lc
                JOIN lessons l ON l.id = lc.lesson_id
                JOIN modules m ON m.id = l.module_id
               WHERE m.course_id = c.id)                                                              AS completions,
             (SELECT COUNT(*)::int FROM submissions s
                JOIN assignments a ON a.id = s.assignment_id
               WHERE a.course_id = c.id)                                                              AS submissions,
             (SELECT COUNT(*)::int FROM quizzes q WHERE q.course_id = c.id)                            AS quizzes,
             (SELECT COUNT(*)::int FROM assignments a WHERE a.course_id = c.id)                        AS assignments
        FROM courses c
       ORDER BY c.title
    `)
    console.log('title | enrollments | lesson_completions | submissions | quizzes | assignments')
    for (const x of r.rows) {
      console.log(
        `${x.title} | ${x.enrollments} | ${x.completions} | ${x.submissions} | ${x.quizzes} | ${x.assignments}`
      )
    }
  } catch (e) {
    console.log('DB ERROR:', e.code || '', e.message)
  }
  await pool.end()
})()
