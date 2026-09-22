// READ-ONLY inspection of the live database. No writes.
require('dotenv/config')
const { Pool } = require('pg')

// The connection string carries sslmode=require, which pg-connection-string maps
// to verify-full and overrides any explicit `ssl` option. Strip it so we can use
// the same trust settings the local environment needs.
const url = new URL(process.env.DATABASE_URL)
url.searchParams.delete('sslmode')

const pool = new Pool({
  connectionString: url.toString(),
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
})

;(async () => {
  try {
    const courses = await pool.query(
      'SELECT c.title, c.subject, c.level, c.status, c.lesson_count, ' +
        "(SELECT COUNT(*)::int FROM modules m WHERE m.course_id = c.id) AS modules, " +
        "(SELECT COUNT(*)::int FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = c.id) AS lessons " +
        'FROM courses c ORDER BY c.created_at'
    )
    console.log(`COURSES IN DB: ${courses.rows.length}`)
    for (const c of courses.rows) {
      console.log(
        `  [${c.status}] ${c.title} | ${c.subject}/${c.level} | modules=${c.modules} lessons=${c.lessons} (lesson_count=${c.lesson_count})`
      )
    }

    for (const [label, q] of [
      ['modules', 'SELECT COUNT(*)::int AS n FROM modules'],
      ['lessons', 'SELECT COUNT(*)::int AS n FROM lessons'],
      ['quizzes', 'SELECT COUNT(*)::int AS n FROM quizzes'],
      ['quiz_questions', 'SELECT COUNT(*)::int AS n FROM quiz_questions'],
      ['assignments', 'SELECT COUNT(*)::int AS n FROM assignments'],
    ]) {
      const r = await pool.query(q)
      console.log(`TOTAL ${label} = ${r.rows[0].n}`)
    }

    console.log('\nTARGET COURSES:')
    for (const title of [
      'HTML & CSS Fundamentals',
      'Mathematics to Coding',
      'Complete React Development',
      'SS1 Mathematics — First Term',
      'SS1 Mathematics — Second Term',
      'SS1 Mathematics — Third Term',
    ]) {
      const r = await pool.query('SELECT id, status FROM courses WHERE title = $1 LIMIT 1', [title])
      console.log(`  ${r.rows[0] ? 'PRESENT  ' : 'MISSING  '} ${title}${r.rows[0] ? ` (status=${r.rows[0].status})` : ''}`)
    }
  } catch (e) {
    console.log('DB ERROR:', e.code || '', e.message)
  }
  await pool.end()
})()
