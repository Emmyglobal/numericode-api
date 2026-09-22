const {query} = require('./dist/db/pool')
async function main() {
  const r = await query('SELECT count(*)::text AS n FROM courses')
  console.log('courses:', r.rows[0].n)
  const cs = await query('SELECT title,subject,level,status,lesson_count FROM courses ORDER BY title')
  for (const c of cs.rows) console.log('  ' + c.title + ' | ' + c.subject + ' | ' + c.level + ' | ' + c.status + ' | lessons:' + c.lesson_count)
}
main().catch(e => console.error(e))
