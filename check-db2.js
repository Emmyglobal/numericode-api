// READ-ONLY deep inspection of two courses that share titles with the seeders.
require('dotenv/config')
const { Pool } = require('pg')
const url = new URL(process.env.DATABASE_URL)
url.searchParams.delete('sslmode')
const pool = new Pool({
  connectionString: url.toString(),
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
})

async function dump(title) {
  console.log(`\n########## ${title} ##########`)
  const c = await pool.query(
    'SELECT id, lesson_count, duration, duration IS NOT NULL AS has_duration, content IS NOT NULL AS has_content FROM courses WHERE title = $1',
    [title]
  )
  if (!c.rows.length) { console.log('  (course row MISSING)'); return }
  console.log(`  course: id=${c.rows[0].id} lesson_count=${c.rows[0].lesson_count} duration=${c.rows[0].duration}`)
  const courseId = c.rows[0].id
  const mods = await pool.query(
    'SELECT id, title, position FROM modules WHERE course_id = $1 ORDER BY position',
    [courseId]
  )
  for (const m of mods.rows) {
    const ls = await pool.query(
      'SELECT id, title, position, LENGTH(content) AS content_len FROM lessons WHERE module_id = $1 ORDER BY position',
      [m.id]
    )
    console.log(`  module pos=${m.position} "${m.title}" -> ${ls.rows.length} lessons`)
    for (const l of ls.rows) {
      const qz = await pool.query(
        'SELECT id, title, (SELECT COUNT(*)::int FROM quiz_questions qq WHERE qq.quiz_id = q.id) AS qn FROM quizzes q WHERE q.lesson_id = $1',
        [l.id]
      )
      const asg = await pool.query('SELECT COUNT(*)::int AS n FROM assignments WHERE lesson_id = $1', [l.id])
      const quizInfo = qz.rows.length ? `quiz="${qz.rows[0].title}" questions=${qz.rows[0].qn}` : 'NO QUIZ'
      console.log(`      - pos=${l.position} "${l.title}" content=${l.content_len}ch ${quizInfo} assignments=${asg.rows[0].n}`)
    }
  }
  const orphan = await pool.query(
    'SELECT COUNT(*)::int AS n FROM quizzes q WHERE q.course_id = $1 AND q.lesson_id IS NULL',
    [courseId]
  )
  console.log(`  course-level quizzes (lesson_id NULL): ${orphan.rows[0].n}`)
}

;(async () => {
  try {
    await dump('HTML & CSS Fundamentals')
    await dump('SS1 Mathematics — First Term')
    await dump('Mathematics to Coding: Logic, Numbers & Algorithms')
  } catch (e) {
    console.log('DB ERROR:', e.code || '', e.message)
  }
  await pool.end()
})()
