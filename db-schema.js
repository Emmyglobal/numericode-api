const {query} = require('./dist/db/pool')
async function main() {
  // quiz_questions columns
  const qc = await query(`SELECT column_name,data_type FROM information_schema.columns WHERE table_name='quiz_questions' ORDER BY ordinal_position`)
  console.log('quiz_questions columns:')
  for (const r of qc.rows) console.log('  '+r.column_name+' ('+r.data_type+')')
  // check which seeders already inserted
  const qs = await query(`SELECT q.id, q.title, q.lesson_id, l.title AS lesson_title, m.title AS module_title FROM quizzes q JOIN lessons l ON l.id=q.lesson_id JOIN modules m ON m.id=l.module_id WHERE m.title LIKE 'SS1%' ORDER BY m.position, q.id`)
  console.log('\nSS1 quizzes already in DB ('+qs.rows.length+'):')
  for (const r of qs.rows) console.log('  ['+r.module_title+'] '+r.lesson_title+' -> '+r.title)
  // count quiz_questions
  const nq = await query(`SELECT count(*)::text AS n FROM quiz_questions JOIN quizzes q ON q.id=quiz_questions.quiz_id JOIN lessons l ON l.id=q.lesson_id WHERE l.module_id IN (SELECT id FROM modules WHERE title LIKE 'SS1%')`)
  console.log('\nSS1 quiz_questions rows:', nq.rows[0].n)
}
main().catch(e=>console.error(e))
