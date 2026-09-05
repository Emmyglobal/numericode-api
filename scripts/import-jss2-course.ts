import fs from 'fs'
import path from 'path'
import { query, getPoolInstance } from '../src/db/pool'

async function main() {
  const file = path.resolve('C:/Users/User/Downloads/files (2)/data/courses/jss2-maths-first-term-w5-8.json')
  const raw = fs.readFileSync(file, 'utf8')
  const obj = JSON.parse(raw)
  const title = obj.courseTitle || obj.title || obj.courseId || 'JSS2 Mathematics — First Term (Weeks 5–8)'

  const { rows: existingCourses } = await query<{ id: string }>(`SELECT id FROM courses WHERE title = $1 LIMIT 1`, [title])
  if (existingCourses.length > 0) {
    console.log(`Course already exists: ${title} (${existingCourses[0].id})`)
    return
  }

  const { rows: trainerRows } = await query<{ id: string }>(`SELECT id FROM users WHERE role = 'trainer' AND status = 'active' ORDER BY created_at LIMIT 1`)
  const { rows: adminRows } = await query<{ id: string }>(`SELECT id FROM users WHERE role = 'admin' AND status = 'active' ORDER BY created_at LIMIT 1`)
  const instructorId = trainerRows[0]?.id ?? adminRows[0]?.id

  const lessonCount = Array.isArray(obj.lessons) ? obj.lessons.length : 0
  const description = obj.metadata?.notes || obj.description || `JSS2 mathematics course for ${obj.term || 'First Term'}.`
  const outcomes = Array.isArray(obj.metadata?.outcomes) ? obj.metadata.outcomes : []

  const { rows: insertedCourse } = await query<{ id: string }>(`
    INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes, duration, content)
    VALUES ($1, $2, $3, $4, $5, 'published', $6, $7, $8, $9)
    RETURNING id
  `, [
    title,
    description,
    obj.subject || 'mathematics',
    obj.metadata?.level || 'intermediate',
    instructorId,
    lessonCount,
    outcomes,
    obj.metadata?.duration || '4 weeks',
    JSON.stringify(obj),
  ])

  const courseId = insertedCourse[0].id
  const moduleTitle = obj.term || 'Term Lessons'
  const { rows: existingModule } = await query<{ id: string }>(`SELECT id FROM modules WHERE course_id = $1 AND title = $2 LIMIT 1`, [courseId, moduleTitle])
  const moduleId = existingModule[0]?.id ?? (await query<{ id: string }>(`INSERT INTO modules (course_id, title, position) VALUES ($1, $2, 0) RETURNING id`, [courseId, moduleTitle])).rows[0].id

  const lessons = Array.isArray(obj.lessons) ? obj.lessons : []
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i]
    const lessonTitle = lesson.title || `Lesson ${i + 1}`
    const contentValue = lesson.body?.explanation || JSON.stringify(lesson)
    const duration = Number(lesson.duration) || 35

    const { rows: existingLesson } = await query<{ id: string }>(`SELECT id FROM lessons WHERE module_id = $1 AND title = $2 LIMIT 1`, [moduleId, lessonTitle])
    if (existingLesson.length === 0) {
      await query(
        `INSERT INTO lessons (module_id, title, content, duration, position) VALUES ($1, $2, $3, $4, $5)`,
        [moduleId, lessonTitle, contentValue, duration, i]
      )
    }
  }

  console.log(`Inserted course: ${title} (${courseId}) with ${lessons.length} lessons`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('IMPORT_FAILED', err)
    process.exit(1)
  })
  .finally(async () => {
    try {
      const pool = await getPoolInstance()
      await pool.end()
    } catch {
      // no-op
    }
  })
