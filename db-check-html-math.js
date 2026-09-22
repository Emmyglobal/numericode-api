const {query}=require('./dist/db/pool').default;
async function main(){
  try{
    const dbp=await query('SELECT current_database()');
    console.log('DB:', dbp.rows[0]?.current_database || '?');
    const cs=await query(
      "SELECT c.title, c.status, c.enrollment_count, count(DISTINCT m.id::text) AS modules, "+
      "count(DISTINCT l.id::text) AS lessons, count(DISTINCT q.id::text) AS quizzes, "+
      "count(DISTINCT a.id::text) AS assignments, count(DISTINCT ql.id::text) AS quiz_lines, "+
      "count(DISTINCT aq.id::text) AS assignment_lines "+
      "FROM courses c LEFT JOIN modules m ON m.course_id=c.id "+
      "LEFT JOIN lessons l ON l.module_id=m.id "+
      "LEFT JOIN quizzes q ON q.course_id=c.id "+
      "LEFT JOIN assignments a ON a.course_id=c.id "+
      "LEFT JOIN quiz_questions ql ON ql.quiz_id=q.id "+
      "LEFT JOIN assignment_questions aq ON aq.assignment_id=a.id "+
      "WHERE c.title IN ('HTML & CSS Fundamentals','Mathematics to Coding') GROUP BY c.id, c.title, c.status, c.enrollment_count ORDER BY c.title"
    );
    if(cs.rows.length===0){console.log('Not found in DB');return}
    for(const r of cs.rows){
      console.log(JSON.stringify({
        title:r.title,status:r.status,enrollment_count:r.enrollment_count,
        modules:r.modules,lessons:r.lessons,quizzes:r.quizzes,assignments:r.assignments,
        quiz_lines:r.quiz_lines,assignment_lines:r.assignment_lines
      }));
    }
  }catch(e){console.error(e)}
}
main();