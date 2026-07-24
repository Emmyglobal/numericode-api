import 'dotenv/config'
import { query } from './pool'

/**
 * One-time script to add default forum categories for all courses
 * that don't already have any categories.
 */
async function seedForumCategories() {
  console.log('Seeding forum categories for existing courses...')

  const { rows: courses } = await query<{ id: string; title: string }>(
    `SELECT id, title FROM courses WHERE id NOT IN (
      SELECT DISTINCT course_id FROM forum_categories WHERE course_id IS NOT NULL
    )`
  )

  if (courses.length === 0) {
    console.log('All courses already have forum categories. Nothing to do.')
    process.exit(0)
  }

  for (const course of courses) {
    await query(
      `INSERT INTO forum_categories (course_id, name, description, position) VALUES
       ($1, 'General Discussion', 'General questions and discussions about the course', 0),
       ($1, 'Homework Help', 'Get help with assignments and homework', 1)
      ON CONFLICT DO NOTHING`,
      [course.id]
    )
    console.log(`  Added categories for: ${course.title}`)
  }

  console.log(`Done. Added forum categories to ${courses.length} course(s).`)
  process.exit(0)
}

seedForumCategories().catch(err => {
  console.error('Failed to seed forum categories:', err)
  process.exit(1)
})