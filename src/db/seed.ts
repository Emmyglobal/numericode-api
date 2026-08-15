import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { query } from './pool'

export async function seed() {
  console.log('Seeding database...')


  // Idempotency guard: `seed()` is invoked by index.ts on every boot (and is
  // also exposed as `npm run db:seed`). Re-running must be a clean no-op so we
  // never violate the UNIQUE(email) constraint OR duplicate rows in tables that
  // have no unique key (e.g. courses). If any demo user already exists, skip.
  const DEMO_EMAILS = [
    'emmanuel@numericode.com',
    'nwaforugochukwu21@gmail.com',
    'trainer@numericode.com',
    'kolade@gmail.com',
    'amaka@gmail.com',
  ]
  const { rows: existing } = await query<{ email: string }>(
    'SELECT email FROM users WHERE email = ANY($1)',
    [DEMO_EMAILS]
  )
  if (existing.length > 0) {
    console.log('Database already seeded; ensuring admin/trainer accounts exist.')
    // Still ensure admin + trainer accounts are present and correct — they may
    // have been removed, changed, or (if someone registered via the API) created
    // with a non-admin role by the self-service registration endpoint.
    const passwordHash = await bcrypt.hash('password123', 10)
    const ADMIN_ACCOUNTS = [
      { name: 'Emmanuel Nwafor', email: 'emmanuel@numericode.com', role: 'admin' },
      { name: 'Ugochukwu Nwafor', email: 'nwaforugochukwu21@gmail.com', role: 'admin' },
      { name: 'Trainer One', email: 'trainer@numericode.com', role: 'trainer' },
    ]
    for (const acct of ADMIN_ACCOUNTS) {
      const { rows: found } = await query<{ id: string; role: string }>(
        'SELECT id, role FROM users WHERE email = $1',
        [acct.email]
      )
      if (found.length === 0) {
        // Account doesn't exist → create it
        await query(
          `INSERT INTO users (name, email, password_hash, role, status, account_activated)
           VALUES ($1, $2, $3, $4, 'active', TRUE)`,
          [acct.name, acct.email, passwordHash, acct.role]
        )
        console.log(`  Created ${acct.role} account: ${acct.email}`)
      } else {
        // Account exists — ensure correct role, active status, activated
        const { rows: updated } = await query(
          `UPDATE users
           SET role              = $1,
               status            = 'active',
               account_activated = TRUE
           WHERE email = $2
             AND (role IS DISTINCT FROM $1
               OR status IS DISTINCT FROM 'active'
               OR account_activated IS DISTINCT FROM TRUE)
           RETURNING id`,
          [acct.role, acct.email]
        )
        if (updated.length > 0) {
          console.log(`  Restored/corrected ${acct.role} account: ${acct.email}`)
        }
      }
    }
    console.log('Admin/trainer account check complete.')
    return
  }


  const passwordHash = await bcrypt.hash('password123', 10)

  // ── Users ──────────────────────────────────────────────────────────────────
  const { rows: users } = await query<{ id: string; email: string }>(`
    INSERT INTO users (name, email, password_hash, role, status, account_activated)
    VALUES
      ('Emmanuel Nwafor', 'emmanuel@numericode.com', $1, 'admin',   'active', TRUE),
      ('Ugochukwu Nwafor', 'nwaforugochukwu21@gmail.com', $1, 'admin', 'active', TRUE),
                  ('Trainer One',     'trainer@numericode.com',  $1, 'trainer', 'active', TRUE),
      ('Kolade Adebayo',  'kolade@gmail.com',         $1, 'student', 'active', TRUE),
      ('Amaka Okonkwo',   'amaka@gmail.com',          $1, 'student', 'active', TRUE),
      
                  ('Chidi Obi',       'chidi@gmail.com',          $1, 'student', 'active', TRUE),
      ('Ngozi Eze',       'ngozi@gmail.com',          $1, 'student', 'active', TRUE),
      ('Emeka Nwosu',     'emeka@gmail.com',          $1, 'student', 'suspended', TRUE)
    RETURNING id, email
  `, [passwordHash])

  const admin   = users.find(u => u.email === 'emmanuel@numericode.com')!
  const adminUgochukwu = users.find(u => u.email === 'nwaforugochukwu21@gmail.com')!
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

  // ── Forum Categories ────────────────────────────────────────────────────────
  await query(`
    INSERT INTO forum_categories (course_id, name, description, position) VALUES
      ($1, 'General Discussion', 'General questions and discussions about the course', 0),
      ($1, 'Homework Help', 'Get help with assignments and homework', 1),
      ($2, 'General Discussion', 'General questions and discussions about the course', 0),
      ($2, 'Code Review', 'Share your code and get feedback', 1)
    ON CONFLICT DO NOTHING
  `, [foundationMath.id, jsForBeginners.id])

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

  // ── Grade Categories ────────────────────────────────────────────────────────
  await query(`
    INSERT INTO grade_categories (course_id, name, weight) VALUES
      ($1, 'Assignments', 60),
      ($1, 'Quizzes', 40)
    ON CONFLICT (course_id, name) DO NOTHING
  `, [foundationMath.id])

  // ── Quizzes with Questions ──────────────────────────────────────────────────
  const { rows: quizzes } = await query<{ id: string }>(`
    INSERT INTO quizzes (course_id, title, description, time_limit, passing_score, max_attempts, created_by)
    VALUES
      ($1, 'Numbers & Arithmetic Quiz', 'Test your knowledge of basic arithmetic operations.', 15, 60, 2, $2),
      ($1, 'Fractions & Decimals Quiz', 'Assess your understanding of fractions and decimals.', 20, 70, 2, $2)
    RETURNING id
  `, [foundationMath.id, trainer.id])

  // Quiz 1 Questions - Numbers & Arithmetic
  await query(`
    INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position) VALUES
      ($1, 'What is the result of 15 + 27?', 'multiple_choice', 
        '[{"id":"a","text":"42","isCorrect":true},{"id":"b","text":"32","isCorrect":false},{"id":"c","text":"52","isCorrect":false},{"id":"d","text":"37","isCorrect":false}]', 'a', 10, 0),
      ($1, 'What is 144 divided by 12?', 'multiple_choice',
        '[{"id":"a","text":"10","isCorrect":false},{"id":"b","text":"12","isCorrect":true},{"id":"c","text":"14","isCorrect":false},{"id":"d","text":"11","isCorrect":false}]', 'b', 10, 1),
      ($1, 'The result of 7 × 8 is 56.', 'true_false', NULL, 'true', 10, 2),
      ($1, 'What is the square root of 81?', 'fill_blank', NULL, '9', 15, 3),
      ($1, 'If a triangle has sides 3, 4, and 5, is it a right triangle? (yes/no)', 'fill_blank', NULL, 'yes', 15, 4)
  `, [quizzes[0].id])

  // Quiz 2 Questions - Fractions & Decimals
  await query(`
    INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position) VALUES
      ($1, 'What is 1/4 expressed as a decimal?', 'multiple_choice',
        '[{"id":"a","text":"0.25","isCorrect":true},{"id":"b","text":"0.5","isCorrect":false},{"id":"c","text":"0.75","isCorrect":false},{"id":"d","text":"0.1","isCorrect":false}]', 'a', 10, 0),
      ($1, 'What is 3/5 + 1/5?', 'multiple_choice',
        '[{"id":"a","text":"3/10","isCorrect":false},{"id":"b","text":"4/5","isCorrect":true},{"id":"c","text":"2/5","isCorrect":false},{"id":"d","text":"4/10","isCorrect":false}]', 'b', 10, 1),
      ($1, 'The decimal 0.75 is equal to 3/4.', 'true_false', NULL, 'true', 10, 2),
      ($1, 'What is 0.2 as a fraction in simplest form? (e.g. 1/5)', 'fill_blank', NULL, '1/5', 15, 3),
      ($1, 'Explain how to convert a fraction to a decimal in your own words.', 'essay', NULL, NULL, 15, 4)
  `, [quizzes[1].id])

  // ── Learning Analytics ──────────────────────────────────────────────────────
  // Get lessons to reference for analytics
  const { rows: lessons } = await query<{ id: string }>(
    'SELECT id FROM lessons LIMIT 3'
  )

  if (lessons.length > 0) {
    await query(`
      INSERT INTO learning_analytics (user_id, course_id, lesson_id, time_spent, interactions, last_accessed)
      VALUES
        ($1, $2, $3, 3600, 45, NOW() - INTERVAL '2 days'),
        ($1, $2, $4, 2400, 28, NOW() - INTERVAL '1 day'),
        ($1, $2, $5, 1800, 15, NOW()),
        ($3, $2, $3, 7200, 80, NOW() - INTERVAL '3 days')
      ON CONFLICT (user_id, course_id, lesson_id) DO NOTHING
    `, [kolade.id, foundationMath.id, lessons[0].id, lessons[1].id, lessons[2].id, amaka.id])
  }

  // Complete a quiz attempt for analytics/grade demo
  const { rows: existingQuizzes } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE course_id = $1 LIMIT 1',
    [foundationMath.id]
  )
  if (existingQuizzes.length > 0) {
    // Get the questions for this quiz
    const { rows: quizQuestions } = await query<{ id: string; question_type: string; correct_answer: string | null }>(
      'SELECT id, question_type, correct_answer FROM quiz_questions WHERE quiz_id = $1 AND question_type != $2',
      [existingQuizzes[0].id, 'essay']
    )

    if (quizQuestions.length > 0) {
      // Build sample answers
      const sampleAnswers: Record<string, string> = {}
      for (const q of quizQuestions) {
        if (q.correct_answer) {
          sampleAnswers[q.id] = q.correct_answer
        } else {
          sampleAnswers[q.id] = quizQuestions[0].correct_answer || ''
        }
      }

      // Create a completed attempt
      await query(
        `INSERT INTO quiz_attempts (quiz_id, user_id, completed_at, score, passed, answers)
         VALUES ($1, $2, NOW(), 85.00, TRUE, $3)
         ON CONFLICT (quiz_id, user_id, started_at) DO NOTHING`,
        [existingQuizzes[0].id, kolade.id, JSON.stringify(sampleAnswers)]
      )
    }
  }

  // ── Announcements ──────────────────────────────────────────────────────────
  await query(`
    INSERT INTO announcements (title, body, audience, created_by) VALUES
      ('New Course: React & TypeScript Now Live!', 'We are excited to announce the launch of our most advanced course.', 'all', $1),
      ('Live Class Reschedule Notice', 'The Algebra live class has been moved. Please check your dashboard.', 'students', $1)
  `, [admin.id])

  console.log('Seed complete.')
  console.log(`  Admin:   emmanuel@numericode.com      / password123`)
  console.log(`  Admin:   nwaforugochukwu21@gmail.com  / password123`)
  console.log(`  Trainer: trainer@numericode.com        / password123`)
      console.log(`  Student: kolade@gmail.com               / password123`)
}

// Only auto-run when invoked directly (`npm run db:seed`). When imported by
// index.ts the caller controls execution — and must not be killed by exit().
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err)
      process.exit(1)
    })
}
