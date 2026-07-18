import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { query } from './pool'

async function seed() {
  console.log('Seeding database...')

  const passwordHash = await bcrypt.hash('password123', 10)

  // ── Users ──────────────────────────────────────────────────────────────────
  const { rows: users } = await query<{ id: string; email: string }>(`
    INSERT INTO users (name, email, password_hash, role, status)
    VALUES
      ('Emmanuel Nwafor', 'emmanuel@numericode.com', $1, 'admin',   'active'),
      ('Trainer One',     'trainer@numericode.com',  $1, 'trainer', 'active'),
      ('Kolade Adebayo',  'kolade@gmail.com',         $1, 'student', 'active'),
      ('Amaka Okonkwo',   'amaka@gmail.com',          $1, 'student', 'active'),
      
      ('Chidi Obi',       'chidi@gmail.com',          $1, 'student', 'active'),
      ('Ngozi Eze',       'ngozi@gmail.com',          $1, 'student', 'active'),
      ('Emeka Nwosu',     'emeka@gmail.com',          $1, 'student', 'suspended')
    RETURNING id, email
  `, [passwordHash])

  const admin   = users.find(u => u.email === 'emmanuel@numericode.com')!
  const trainer = users.find(u => u.email === 'trainer@numericode.com')!
  const kolade   = users.find(u => u.email === 'kolade@gmail.com')!
  const amaka    = users.find(u => u.email === 'amaka@gmail.com')!

  // ── Courses ────────────────────────────────────────────────────────────────
  const { rows: courses } = await query<{ id: string; title: string }>(`
    INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes)
    VALUES
      ('Foundation Mathematics', 'Build a rock-solid foundation in arithmetic, fractions, algebra, and geometry.',
        'mathematics', 'beginner', $1, 'published', 24,
        ARRAY['Master arithmetic operations','Solve algebraic equations','Understand geometry basics']),
      ('JavaScript for Beginners', 'Start your programming journey with JavaScript.',
        'programming', 'beginner', $1, 'published', 30,
        ARRAY['Understand variables and data types','Write functions and loops','Manipulate the DOM']),
      ('Algebra & Equations', 'Master algebraic thinking from linear equations to systems of equations.',
        'mathematics', 'intermediate', $1, 'published', 28,
        ARRAY['Solve linear equations','Graph linear functions','Tackle quadratic equations']),
      ('React & TypeScript', 'Build modern, type-safe web applications with React 18 and TypeScript.',
        'programming', 'advanced', $2, 'published', 40,
        ARRAY['Build React components','Manage state with hooks','Use TypeScript with React'])
    RETURNING id, title
  `, [admin.id, trainer.id])

  const foundationMath = courses.find(c => c.title === 'Foundation Mathematics')!
  const jsForBeginners  = courses.find(c => c.title === 'JavaScript for Beginners')!

  // ── Modules + Lessons for Foundation Mathematics ────────────────────────────
  const { rows: modules } = await query<{ id: string }>(`
    INSERT INTO modules (course_id, title, position) VALUES
      ($1, 'Numbers & Arithmetic', 0),
      ($1, 'Fractions & Decimals', 1),
      ($1, 'Introduction to Algebra', 2)
    RETURNING id
  `, [foundationMath.id])

  await query(`
    INSERT INTO lessons (module_id, title, duration, position) VALUES
      ($1, 'Introduction to Numbers',   20, 0),
      ($1, 'Addition & Subtraction',    25, 1),
      ($1, 'Multiplication & Division', 30, 2)
  `, [modules[0].id])

  // ── Live classes ───────────────────────────────────────────────────────────
  await query(`
    INSERT INTO live_classes (course_id, title, date, duration, meet_url, status) VALUES
      ($1, 'Algebra Q&A Session',    '2026-07-05T10:00:00Z', 60, 'https://meet.google.com/abc-defg-hij', 'scheduled'),
      ($1, 'Fractions Deep Dive',    '2026-07-12T10:00:00Z', 60, 'https://meet.google.com/abc-defg-hij', 'scheduled'),
      ($2, 'JavaScript Q&A',         '2026-07-04T14:00:00Z', 60, 'https://zoom.us/j/123456',             'scheduled')
  `, [foundationMath.id, jsForBeginners.id])

  // ── Enrollments ────────────────────────────────────────────────────────────
  await query(`
    INSERT INTO enrollments (user_id, course_id, progress) VALUES
      ($1, $3, 42),
      ($1, $4, 25),
      ($2, $3, 88)
  `, [kolade.id, amaka.id, foundationMath.id, jsForBeginners.id])

  // ── Assignments ────────────────────────────────────────────────────────────
  const { rows: assignments } = await query<{ id: string }>(`
    INSERT INTO assignments (course_id, title, due_date) VALUES
      ($1, 'Fractions Worksheet',    '2026-07-08T23:59:59Z'),
      ($2, 'Build a Calculator',     '2026-07-10T23:59:59Z'),
      ($1, 'Number Patterns Quiz',   '2026-06-28T23:59:59Z')
    RETURNING id
  `, [foundationMath.id, jsForBeginners.id])

  await query(`
    INSERT INTO submissions (assignment_id, user_id, status) VALUES
      ($1, $4, 'pending'),
      ($2, $4, 'pending'),
      ($3, $4, 'overdue')
  `, [assignments[0].id, assignments[1].id, assignments[2].id, kolade.id])

  // ── Announcements ──────────────────────────────────────────────────────────
  await query(`
    INSERT INTO announcements (title, body, audience, created_by) VALUES
      ('New Course: React & TypeScript Now Live!', 'We are excited to announce the launch of our most advanced course.', 'all', $1),
      ('Live Class Reschedule Notice', 'The Algebra live class has been moved. Please check your dashboard.', 'students', $1)
  `, [admin.id])

  console.log('Seed complete.')
  console.log(`  Admin:   emmanuel@numericode.com / password123`)
  console.log(`  Trainer: trainer@numericode.com   / password123`)
  console.log(`  Student: kolade@gmail.com          / password123`)
  process.exit(0)
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1) })
