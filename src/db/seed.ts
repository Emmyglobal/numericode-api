import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { query } from './pool'
import { ensureCurriculumCatalog } from './curriculum'
import { ensureSS2MathematicsCourse } from './ss2-mathematics'

export async function seed() {
  console.log('Seeding database...')


  // Idempotency guard: `seed()` is invoked by index.ts on every boot (and is
  // also exposed as `npm run db:seed`). Re-running must be a clean no-op so we
  // never violate the UNIQUE(email) constraint OR duplicate rows in tables that
  // have no unique key (e.g. courses). If any demo user already exists, skip.
  const DEMO_EMAILS = [
    'emmanuel@numerycode.com',
    'nwaforugochukwu21@gmail.com',
    'trainer@numerycode.com',
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
      { name: 'Emmanuel Nwafor', email: 'emmanuel@numerycode.com', role: 'admin' },
      { name: 'Ugochukwu Nwafor', email: 'nwaforugochukwu21@gmail.com', role: 'admin' },
      { name: 'Trainer One', email: 'trainer@numerycode.com', role: 'trainer' },
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

    // The list of available teachers shown to students during registration is
    // derived from active users who teach at least one *published* course. If the
    // demo accounts exist but the demo courses are missing (this happens when the
    // DB was previously seeded incompletely / reset of content while keeping
    // accounts), that list comes back empty and students cannot pick a trainer.
    // Recreate the demo published courses whenever the DB has none, so the
    // "Preferred Teacher" dropdown is always populated.
    const { rows: courseCount } = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM courses`
    )
    if (Number(courseCount[0]?.count ?? 0) === 0) {
      // Prefer an active trainer as the instructor; fall back to an admin so the
      // recovery is always self-healing.
      const { rows: trainerRows } = await query<{ id: string }>(
        `SELECT id FROM users WHERE role = 'trainer' AND status = 'active' ORDER BY created_at LIMIT 1`
      )
      const { rows: adminRows } = await query<{ id: string }>(
        `SELECT id FROM users WHERE role = 'admin' AND status = 'active' ORDER BY created_at LIMIT 1`
      )
      const instructorId = trainerRows[0]?.id ?? adminRows[0]?.id
      if (instructorId) {
        await query(
          `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes)
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
              'programming', 'advanced', $1, 'published', 40,
              ARRAY['Build React components','Manage state with hooks','Use TypeScript with React'])`,
          [instructorId]
        )
                console.log('  Recreated demo published courses so available teachers appear in registration.')
      } else {
        console.log('  No active trainer/admin account found; skipping course recovery.')
      }
    } else {
      console.log('  Demo courses already present — skipping course recovery.')
    }

    // ── Content recovery: modules + lessons + enrollments ───────────────────────
    // The interactive board and collaborative code editor only render against a
    // *lesson*, and a student can only open a lesson they are enrolled in
    // (see studentCanAccess in boards/code-editor controllers). If the demo
    // accounts exist but the content graph is missing, recreate lessons +
    // enrollments so BOTH the Trainer and Student screens have real content to
    // collaborate on during live teaching.
    {
                        // Ensure the demo students exist AND are active/activated. We upsert with
      // ON CONFLICT (email) because a self-service registration may have created
      // these demo emails as `status='pending'` (awaiting admin approval), which
      // would block login entirely (see the `login` gate on status='pending').
      // Forcing status='active' + account_activated=TRUE keeps the demo students
      // usable so they can reach the interactive board / code editor.
      const DEMO_STUDENTS = [
        { name: 'Kolade Adebayo', email: 'kolade@gmail.com' },
        { name: 'Amaka Okonkwo',  email: 'amaka@gmail.com' },
      ]
      for (const s of DEMO_STUDENTS) {
        const { rows: before } = await query<{ status: string; account_activated: boolean }>(
          'SELECT status, account_activated FROM users WHERE email = $1', [s.email]
        )
        await query(
          `INSERT INTO users (name, email, password_hash, role, status, account_activated)
           VALUES ($1, $2, $3, 'student', 'active', TRUE)
           ON CONFLICT (email) DO UPDATE SET
             name              = EXCLUDED.name,
             password_hash       = EXCLUDED.password_hash,
             role                = 'student',
             status              = 'active',
             account_activated   = TRUE`,
          [s.name, s.email, passwordHash]
        )
        const created = before.length === 0
        console.log(`  ${created ? 'Created' : 'Ensured active'} demo student account: ${s.email}`)
      }

      // Resolve the course + student IDs we need below.
      const { rows: fmRows } = await query<{ id: string }>('SELECT id FROM courses WHERE title = $1', ['Foundation Mathematics'])
      const { rows: jsRows } = await query<{ id: string }>('SELECT id FROM courses WHERE title = $1', ['JavaScript for Beginners'])
      const { rows: koladeRows } = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', ['kolade@gmail.com'])
      const { rows: amakaRows }  = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', ['amaka@gmail.com'])
      const kolade = koladeRows[0]
      const amaka  = amakaRows[0]

      // Modules + lessons (the lesson graph that powers boards & code editors).
      const { rows: lessonCount } = await query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM lessons`)
      if (Number(lessonCount[0]?.count ?? 0) === 0 && fmRows[0] && jsRows[0]) {
        const { rows: fmModules } = await query<{ id: string }>(
          `INSERT INTO modules (course_id, title, position) VALUES
             ($1, 'Numbers & Arithmetic', 0),
             ($1, 'Fractions & Decimals', 1),
             ($1, 'Introduction to Algebra', 2)
          RETURNING id`, [fmRows[0].id]
        )
        await query(
          `INSERT INTO lessons (module_id, title, duration, position) VALUES
             ($1, 'Introduction to Numbers',       20, 0),
             ($1, 'Addition & Subtraction',        25, 1),
             ($1, 'Multiplication & Division',     30, 2)`, [fmModules[0].id]
        )
        const { rows: jsModules } = await query<{ id: string }>(
          `INSERT INTO modules (course_id, title, position) VALUES
             ($1, 'JavaScript Fundamentals', 0),
             ($1, 'Functions & Scope',       1),
             ($1, 'DOM & ES6',               2)
          RETURNING id`, [jsRows[0].id]
        )
        await query(
          `INSERT INTO lessons (module_id, title, duration, position) VALUES
             ($1, 'Getting Started with JS',          15, 0),
             ($1, 'Functions and Arrow Functions',      25, 1),
             ($1, 'DOM Manipulation',                   35, 2)`, [jsModules[0].id]
        )
        console.log('  Recreated demo lessons so the interactive board & code editor have content.')
      } else {
        console.log('  Demo lessons already present -- skipping lesson recovery.')
      }

      // Enrollments (without these, students cannot open lesson boards / editors).
      const { rows: enrollmentCount } = await query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM enrollments`)
      if (Number(enrollmentCount[0]?.count ?? 0) === 0 && kolade && amaka && fmRows[0] && jsRows[0]) {
        await query(
          `INSERT INTO enrollments (user_id, course_id, progress) VALUES
             ($1, $3, 42),
             ($1, $4, 25),
             ($2, $3, 88)
          ON CONFLICT (user_id, course_id) DO NOTHING`,
          [kolade.id, amaka.id, fmRows[0].id, jsRows[0].id]
        )
        console.log('  Recreated demo enrollments so students can access lesson boards & code editors.')
      } else {
        console.log('  Demo enrollments already present -- skipping enrollment recovery.')
      }
        }

    // ── Content recovery: modules + lessons + enrollments ───────────────────────
    await ensureCurriculumCatalog()
    await ensureSS2MathematicsCourse()
    return
  }


  const passwordHash = await bcrypt.hash('password123', 10)

  // ── Users ──────────────────────────────────────────────────────────────────
  const { rows: users } = await query<{ id: string; email: string }>(`
    INSERT INTO users (name, email, password_hash, role, status, account_activated)
    VALUES
      ('Emmanuel Nwafor', 'emmanuel@numerycode.com', $1, 'admin',   'active', TRUE),
      ('Ugochukwu Nwafor', 'nwaforugochukwu21@gmail.com', $1, 'admin', 'active', TRUE),
                  ('Trainer One',     'trainer@numerycode.com',  $1, 'trainer', 'active', TRUE),
      ('Kolade Adebayo',  'kolade@gmail.com',         $1, 'student', 'active', TRUE),
      ('Amaka Okonkwo',   'amaka@gmail.com',          $1, 'student', 'active', TRUE),
      
                  ('Chidi Obi',       'chidi@gmail.com',          $1, 'student', 'active', TRUE),
      ('Ngozi Eze',       'ngozi@gmail.com',          $1, 'student', 'active', TRUE),
      ('Emeka Nwosu',     'emeka@gmail.com',          $1, 'student', 'suspended', TRUE)
    RETURNING id, email
  `, [passwordHash])

  const admin   = users.find(u => u.email === 'emmanuel@numerycode.com')!
  const adminUgochukwu = users.find(u => u.email === 'nwaforugochukwu21@gmail.com')!
  const trainer = users.find(u => u.email === 'trainer@numerycode.com')!
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

  // ── Prerequisite Quiz Course: Sequences & Series (SS2) ─────────────────────
  // A course-level quiz that students must PASS before the course content unlocks.
  // This mirrors the quiz HTML format delivered to students and validates the
  // prerequisite-quiz gating feature end-to-end.
  // NOTE: courses.title has no UNIQUE constraint, so we check existence first
  // instead of using ON CONFLICT (title).
  const { rows: seqExisting } = await query<{ id: string }>(
    'SELECT id FROM courses WHERE title = $1',
    ['Sequences & Series — SS2 Practice']
  )
  let sequencesCourse = seqExisting[0]
  if (!sequencesCourse) {
    const { rows: seqCourseRows } = await query<{ id: string }>(
      `INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes)
       VALUES
         ('Sequences & Series — SS2 Practice',
          'Twenty questions covering arithmetic progressions, geometric progressions, sums, means, and sigma notation. You must pass this quiz to open the course.',
          'mathematics', 'beginner', $1, 'published', 5,
          ARRAY['Identify AP and GP sequences','Calculate terms and sums','Apply sigma notation','Use arithmetic and geometric means'])
       RETURNING id`,
      [trainer.id]
    )
    sequencesCourse = seqCourseRows[0]
  }

    // Prerequisite quiz (course-level: module_id and lesson_id are NULL).
  let seqQuizId: string | undefined
  const { rows: existingSeqQuiz } = await query<{ id: string }>(
    'SELECT id FROM quizzes WHERE course_id = $1 AND lesson_id IS NULL LIMIT 1',
    [sequencesCourse.id]
  )
  if (existingSeqQuiz.length > 0) {
    seqQuizId = existingSeqQuiz[0].id
  } else {
    const { rows: seqQuizRows } = await query<{ id: string }>(
      `INSERT INTO quizzes (course_id, module_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
       VALUES ($1, NULL, NULL, 'Sequences & Series — SS2 Practice', 'Twenty questions covering arithmetic progressions, geometric progressions, sums, means, and sigma notation.', 20, 60, 2, FALSE, TRUE, $2)
       RETURNING id`,
      [sequencesCourse.id, trainer.id]
    )
    seqQuizId = seqQuizRows[0].id
  }

  // Link the quiz as this course's prerequisite (idempotent).
  await query(
    'UPDATE courses SET prerequisite_quiz_id = $1 WHERE id = $2',
    [seqQuizId, sequencesCourse.id]
  )

  // Quiz questions — the 20-question SS2 Sequences & Series set (your format).
  const seqQuestions: Array<{ text: string; type: string; opts: string; correct: string; pts: number }> = [
    { text: 'Find the 10th term of the AP: 3, 7, 11, 15, …',                       type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '36', isCorrect: false }, { id: 'b', text: '39', isCorrect: true }, { id: 'c', text: '43', isCorrect: false }, { id: 'd', text: '40', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'What is the common difference of the AP: 5, 9, 13, 17, …?',           type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '3', isCorrect: false }, { id: 'b', text: '4', isCorrect: true }, { id: 'c', text: '5', isCorrect: false }, { id: 'd', text: '9', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'Find the sum of the first 15 terms of an AP with a = 4 and d = 3.',   type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '360', isCorrect: false }, { id: 'b', text: '375', isCorrect: true }, { id: 'c', text: '390', isCorrect: false }, { id: 'd', text: '345', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'An AP has first term 2 and common difference 5. What is the 20th term?', type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '95', isCorrect: false }, { id: 'b', text: '97', isCorrect: true }, { id: 'c', text: '102', isCorrect: false }, { id: 'd', text: '92', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'Find the 6th term of the GP: 2, 6, 18, 54, …',                        type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '162', isCorrect: false }, { id: 'b', text: '486', isCorrect: true }, { id: 'c', text: '324', isCorrect: false }, { id: 'd', text: '972', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'What is the common ratio of the GP: 81, 27, 9, 3, …?',              type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '1/3', isCorrect: true }, { id: 'b', text: '3', isCorrect: false }, { id: 'c', text: '1/9', isCorrect: false }, { id: 'd', text: '1/27', isCorrect: false }]), correct: 'a', pts: 5 },
    { text: 'Find the sum of the first 5 terms of a GP with a = 3 and r = 2.',     type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '93', isCorrect: true }, { id: 'b', text: '96', isCorrect: false }, { id: 'c', text: '90', isCorrect: false }, { id: 'd', text: '81', isCorrect: false }]), correct: 'a', pts: 5 },
    { text: 'Find the sum to infinity of a GP with a = 8 and r = 1/2.',            type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '4', isCorrect: false }, { id: 'b', text: '8', isCorrect: false }, { id: 'c', text: '16', isCorrect: true }, { id: 'd', text: '32', isCorrect: false }]), correct: 'c', pts: 5 },
    { text: 'Three numbers in AP have a sum of 27. What is the middle number?',    type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '8', isCorrect: false }, { id: 'b', text: '9', isCorrect: true }, { id: 'c', text: '10', isCorrect: false }, { id: 'd', text: '13.5', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'Chidi saves ₦500 in the first month and increases his saving by ₦100 every month after. How much has he saved after 12 months?', type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '₦12,600', isCorrect: true }, { id: 'b', text: '₦11,600', isCorrect: false }, { id: 'c', text: '₦13,200', isCorrect: false }, { id: 'd', text: '₦12,000', isCorrect: false }]), correct: 'a', pts: 5 },
  ]
  for (let i = 0; i < seqQuestions.length; i++) {
    await query(
      `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [seqQuizId, seqQuestions[i].text, seqQuestions[i].type, seqQuestions[i].opts, seqQuestions[i].correct, seqQuestions[i].pts, i]
    )
  }

  const seqQuestions2: Array<{ text: string; type: string; opts: string; correct: string; pts: number }> = [
    { text: 'If x − 2, x + 1, and 2x + 3 are consecutive terms of an AP, find x.', type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '1', isCorrect: true }, { id: 'b', text: '2', isCorrect: false }, { id: 'c', text: '3', isCorrect: false }, { id: 'd', text: '0', isCorrect: false }]), correct: 'a', pts: 5 },
    { text: 'What is the next term in the sequence: 1, 4, 9, 16, …?',          type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '20', isCorrect: false }, { id: 'b', text: '25', isCorrect: true }, { id: 'c', text: '21', isCorrect: false }, { id: 'd', text: '24', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'What is the next term in the sequence: 2, 3, 5, 8, 13, …?',        type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '18', isCorrect: false }, { id: 'b', text: '20', isCorrect: false }, { id: 'c', text: '21', isCorrect: true }, { id: 'd', text: '19', isCorrect: false }]), correct: 'c', pts: 5 },
    { text: 'How many terms of the AP 2, 5, 8, … must be added to give a sum of 950?', type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '22', isCorrect: false }, { id: 'b', text: '25', isCorrect: true }, { id: 'c', text: '28', isCorrect: false }, { id: 'd', text: '20', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'Find the geometric mean of 4 and 16.',                            type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '10', isCorrect: false }, { id: 'b', text: '8', isCorrect: true }, { id: 'c', text: '6', isCorrect: false }, { id: 'd', text: '12', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'Find the arithmetic mean of 12 and 20.',                          type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '16', isCorrect: true }, { id: 'b', text: '15', isCorrect: false }, { id: 'c', text: '18', isCorrect: false }, { id: 'd', text: '14', isCorrect: false }]), correct: 'a', pts: 5 },
    { text: 'Evaluate: Σ (2n + 1) for n = 1 to 5.',                            type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '30', isCorrect: false }, { id: 'b', text: '33', isCorrect: false }, { id: 'c', text: '35', isCorrect: true }, { id: 'd', text: '40', isCorrect: false }]), correct: 'c', pts: 5 },
    { text: 'An AP has first term 5 and last term 41 across 10 terms. Find the common difference.', type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '3', isCorrect: false }, { id: 'b', text: '4', isCorrect: true }, { id: 'c', text: '5', isCorrect: false }, { id: 'd', text: '3.6', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'How many terms are in the GP: 3, 6, 12, …, 384?',                 type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '7', isCorrect: false }, { id: 'b', text: '8', isCorrect: true }, { id: 'c', text: '9', isCorrect: false }, { id: 'd', text: '6', isCorrect: false }]), correct: 'b', pts: 5 },
    { text: 'Which of these sequences is geometric?',                          type: 'multiple_choice', opts: JSON.stringify([{ id: 'a', text: '2, 4, 6, 8', isCorrect: false }, { id: 'b', text: '3, 9, 27, 81', isCorrect: true }, { id: 'c', text: '1, 3, 6, 10', isCorrect: false }, { id: 'd', text: '5, 10, 15, 20', isCorrect: false }]), correct: 'b', pts: 5 },
  ]
  for (let i = 0; i < seqQuestions2.length; i++) {
    await query(
      `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [seqQuizId, seqQuestions2[i].text, seqQuestions2[i].type, seqQuestions2[i].opts, seqQuestions2[i].correct, seqQuestions2[i].pts, 10 + i]
    )
  }

  // Modules + lessons for the Sequences course.
  const { rows: seqModules } = await query<{ id: string }>(
    `INSERT INTO modules (course_id, title, position) VALUES
       ($1, 'Introduction to Sequences', 0),
       ($1, 'Arithmetic Progressions', 1),
       ($1, 'Geometric Progressions', 2),
       ($1, 'Series and Sigma Notation', 3)
     RETURNING id`,
    [sequencesCourse.id]
  )
  await query(
    `INSERT INTO lessons (module_id, title, duration, position) VALUES
       ($1, 'What Is a Sequence?', 15, 0),
       ($1, 'Recognising APs and GPs', 20, 1),
       ($2, 'Finding the nth Term', 25, 0),
       ($2, 'Sum of an Arithmetic Series', 30, 1),
       ($3, 'Finding the Common Ratio', 25, 0),
       ($3, 'Sum to Infinity', 30, 1),
       ($4, 'Sigma Notation', 35, 0),
       ($4, 'Word Problems on Series', 40, 1)`,
    [seqModules[0].id, seqModules[1].id, seqModules[2].id, seqModules[3].id]
  )

  // Assignment for the Sequences course.
  await query(
    `INSERT INTO assignments (course_id, title, description, due_date, total_marks, passing_score)
     VALUES ($1, 'Sequences & Series Assignment', 'Answer the word problems and show your working for full marks.', '2026-08-30T23:59:59Z', 100, 50)`,
    [sequencesCourse.id]
  )


  // ── Practice exams (course-level quizzes, lesson_id NULL) ──────────────────
  // Real past-paper sets ingested from the NumeryCode practice formats.
  // Idempotent by unique quiz title, questions stored in the same jsonb
  // options shape the grader expects ({id:'a'..'d', text, isCorrect}).
  async function seedPracticeExam(
    courseId: string,
    createdBy: string,
    meta: { title: string; description: string; timeLimit: number },
    questions: Array<[string, [string, string, string, string], number]>,
    pointsPerQuestion: number,
  ) {
    const { rows: found } = await query<{ id: string }>(
      'SELECT id FROM quizzes WHERE title = $1 LIMIT 1',
      [meta.title],
    )
    if (found.length > 0) return
    const { rows: inserted } = await query<{ id: string }>(
      `INSERT INTO quizzes (course_id, module_id, lesson_id, title, description, time_limit, passing_score, max_attempts, shuffle_questions, show_results, created_by)
       VALUES ($1, NULL, NULL, $2, $3, $4, 60, 99, FALSE, TRUE, $5)
       RETURNING id`,
      [courseId, meta.title, meta.description, meta.timeLimit, createdBy],
    )
    const quizId = inserted[0].id
    const letters = ['a', 'b', 'c', 'd']
    for (let i = 0; i < questions.length; i++) {
      const [text, opts, correct] = questions[i]
      await query(
        `INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, points, position)
         VALUES ($1, $2, 'multiple_choice', $3, $4, $5, $6)`,
        [
          quizId,
          text,
          JSON.stringify(opts.map((t, oi) => ({ id: letters[oi], text: t, isCorrect: oi === correct }))),
          letters[correct],
          pointsPerQuestion,
          i + 1,
        ],
      )
    }
  }

  // JavaScript Quiz — 20 questions · 20 minutes (Fundamentals → Async).
  await seedPracticeExam(jsForBeginners.id, trainer.id,
    { title: 'JavaScript Quiz', description: '20 questions covering fundamentals, functions & scope, arrays & objects, ES6+ features, and asynchronous JavaScript.', timeLimit: 20 },
    [
      ['Which keyword declares a block-scoped variable that can be reassigned?', ['const', 'let', 'var', 'static'], 1],
      ['What is the output of: typeof null?', ['"null"', '"undefined"', '"object"', '"number"'], 2],
      ['Which operator checks both value and type equality?', ['==', '=', '===', '!='], 2],
      ['What does NaN === NaN evaluate to?', ['true', 'false', 'undefined', 'Throws an error'], 1],
      ['What is a closure in JavaScript?', ['A function that has no parameters', 'A function that retains access to its outer scope\'s variables after the outer function returns', 'A function that runs immediately', 'A syntax error'], 1],
      ['Which of these creates an arrow function?', ['function() {}', '=> function() {}', '() => {}', 'function => {}'], 2],
      ['What does this refer to inside a regular function called as a standalone function (non-strict mode)?', ['The function itself', 'undefined', 'The global object', 'null'], 2],
      ['What is the output of:\nfunction foo() {\n  console.log(a);\n  var a = 5;\n}\nfoo();', ['5', 'undefined', 'ReferenceError', 'null'], 1],
      ['Which method adds an element to the end of an array?', ['push()', 'pop()', 'shift()', 'unshift()'], 0],
      ['What does [1, 2, 3].map(x => x * 2) return?', ['[1, 2, 3]', '[2, 4, 6]', '6', 'undefined'], 1],
      ['Which method removes the last element of an array and returns it?', ['shift()', 'pop()', 'slice()', 'splice()'], 1],
      ['What is the correct way to check if a variable obj is an array?', ['typeof obj === "array"', 'obj instanceof Object', 'Array.isArray(obj)', 'obj.isArray()'], 2],
      ['What does the spread operator do in [...arr1, ...arr2]?', ['Merges arr1 and arr2 into a new array', 'Deletes arr1 and arr2', 'Compares arr1 and arr2', 'Converts arrays to objects'], 0],
      ['What does template literal syntax use?', ['Single quotes', 'Double quotes', 'Backticks', 'Square brackets'], 2],
      ['Which of these correctly destructures an object?', ['let {name, age} = person;', 'let [name, age] = person;', 'let (name, age) = person;', 'let name, age = person;'], 0],
      ['What is the default value of b in function greet(a, b = "world") {} if called as greet("hello")?', ['undefined', 'null', '"world"', 'Throws an error'], 2],
      ['What does a Promise represent?', ['A synchronous function', 'An eventual completion (or failure) of an asynchronous operation', 'A loop', 'A variable type'], 1],
      ['What keyword pauses execution of an async function until a Promise resolves?', ['wait', 'pause', 'await', 'hold'], 2],
      ['Which method is used to handle a rejected Promise?', ['.then()', '.catch()', '.finally()', '.resolve()'], 1],
      ['What does setTimeout(() => console.log("hi"), 0) do relative to synchronous code?', ['Runs immediately, before synchronous code', 'Runs after all synchronous code finishes, even with a 0ms delay', 'Never runs', 'Throws an error'], 1],
    ],
    5,
  )
  // WAEC Mathematics Practice Exam — 50 questions · 50 minutes.
  await seedPracticeExam(sequencesCourse.id, trainer.id,
    { title: 'WAEC Mathematics Practice Exam', description: '50 WAEC-style questions covering Number & Numeration, Algebraic Processes, Geometry & Mensuration, Trigonometry, Statistics & Probability, and Vectors & Matrices.', timeLimit: 50 },
    [
      ['Convert 243 base five to base ten.', ['63', '70', '73', '83'], 2],
      ['Simplify: 3/4 − 1/6', ['7/12', '5/12', '1/2', '2/3'], 0],
      ['Find the LCM of 12 and 18.', ['24', '36', '48', '72'], 1],
      ['Convert 0.666… (recurring) to a fraction in its lowest terms.', ['2/3', '3/5', '5/6', '6/9'], 0],
      ['Simplify: (2³ × 2²) ÷ 2⁴', ['2', '4', '8', '16'], 0],
      ['A number, when increased by 20%, becomes 96. Find the number.', ['72', '76', '80', '84'], 2],
      ['Simplify: 5.6 × 100', ['5.6', '56', '560', '5600'], 2],
      ['Find the HCF of 24 and 36.', ['6', '8', '12', '18'], 2],
      ['Simplify: 3(2x − 5) − 2(x − 4)', ['4x − 7', '4x − 23', '8x − 23', '4x + 7'], 0],
      ['Solve: x/3 + 2 = 5', ['x = 6', 'x = 9', 'x = 3', 'x = 15'], 1],
      ['Factorise completely: 6x² − 9x', ['3x(2x − 3)', '3(2x² − 3x)', 'x(6x − 9)', '3x(2x + 3)'], 0],
      ['Expand: (x + 3)(x − 2)', ['x² + x − 6', 'x² − x − 6', 'x² + 5x − 6', 'x² − 5x + 6'], 0],
      ['Given 2x + 3y = 12 and x = 3, find y.', ['2', '3', '4', '6'], 0],
      ['If y varies directly as x and y = 12 when x = 4, find y when x = 7.', ['14', '18', '21', '28'], 2],
      ['Simplify: (a²b)(ab²)', ['a²b²', 'a³b³', 'ab', 'a³b²'], 1],
      ['Solve: 3 − 2x ≤ 7', ['x ≥ −2', 'x ≤ −2', 'x ≥ 2', 'x ≤ 2'], 0],
      ['The nth term of a sequence is Tₙ = 3n + 2. Find the 5th term.', ['15', '17', '19', '21'], 1],
      ['A regular polygon has an exterior angle of 40°. How many sides does it have?', ['6', '7', '8', '9'], 3],
      ['Find the perimeter of a rectangle with length 12 cm and width 8 cm.', ['20 cm', '32 cm', '40 cm', '96 cm'], 2],
      ['Find the volume of a cylinder with radius 7 cm and height 10 cm (take π = 22/7).', ['440 cm³', '1540 cm³', '220 cm³', '770 cm³'], 1],
      ['A triangle has base 10 cm and height 6 cm. Find its area.', ['16 cm²', '30 cm²', '60 cm²', '32 cm²'], 1],
      ['Find the total surface area of a cube with side 4 cm.', ['16 cm²', '64 cm²', '96 cm²', '48 cm²'], 2],
      ['Two similar triangles have corresponding sides in ratio 2 : 3. Find the ratio of their areas.', ['2 : 3', '4 : 6', '4 : 9', '8 : 27'], 2],
      ['The bearing of P from Q is N60°E. Find the bearing of Q from P.', ['S60°W', 'N60°W', 'S30°E', 'N30°W'], 0],
      ['Find the area of a trapezium with parallel sides 8 cm and 12 cm, and height 5 cm.', ['40 cm²', '50 cm²', '60 cm²', '100 cm²'], 1],
      ['The angle of elevation of the top of a tower from a point 50 m away is 30°. Find the height, to 1 d.p.', ['25.0 m', '28.9 m', '43.3 m', '86.6 m'], 1],
      ['Evaluate sin 90°.', ['0', '1/2', '√3/2', '1'], 3],
      ['Find θ if cos θ = 0.5, where 0° ≤ θ ≤ 180°.', ['30°', '45°', '60°', '90°'], 2],
      ['In a right triangle, the opposite side is 6 cm and the hypotenuse is 10 cm. Find sin θ.', ['3/5', '4/5', '5/6', '3/4'], 0],
      ['Evaluate tan 60°.', ['1', '√3', '1/√3', '2'], 1],
      ['Find cos 90°.', ['0', '1/2', '1', 'Undefined'], 0],
      ['A ladder leans against a wall at 45° to the ground. If the ladder is 8 m long, find the horizontal distance to its foot, to 1 d.p.', ['4.0 m', '5.7 m', '6.9 m', '8.0 m'], 1],
      ['Simplify: 1 − sin²θ', ['cos²θ', 'sin²θ', 'tan²θ', '1'], 0],
      ['Find the bearing of a point that is due south.', ['000°', '090°', '180°', '270°'], 2],
      ['Find the mean of 12, 15, 18, 21, 24.', ['16', '18', '19', '20'], 1],
      ['Find the range of: 5, 8, 12, 3, 9.', ['6', '7', '9', '12'], 2],
      ['A bag contains 4 red and 6 blue balls. Find the probability of picking a red ball.', ['2/5', '3/5', '1/2', '2/3'], 0],
      ['Find the median of: 7, 3, 9, 5, 11.', ['5', '7', '9', '11'], 1],
      ['Two coins are tossed together. Find the probability of getting two heads.', ['1/4', '1/2', '1/3', '3/4'], 0],
      ['The mode of a distribution is the value that:', ['occurs least often', 'is in the middle', 'occurs most often', 'is the average'], 2],
      ['If all values in a data set are equal, the standard deviation is:', ['0', '1', 'Undefined', 'Equal to the mean'], 0],
      ['A box contains 3 white and 5 black balls. Two balls are drawn without replacement. Find the probability both are black.', ['5/14', '5/28', '15/56', '2/7'], 0],
      ['If vector a = (3, 4), find |a|.', ['3', '4', '5', '7'], 2],
      ['Given p = (2, 3) and q = (1, −1), find p + q.', ['(3, 2)', '(1, 4)', '(3, 4)', '(1, 2)'], 0],
      ['Find the determinant of the matrix [[2, 3], [1, 4]].', ['5', '8', '11', '14'], 0],
      ['If A = [[1, 2], [3, 4]] and B = [[0, 1], [1, 0]], find AB.', ['[[2, 1], [4, 3]]', '[[1, 2], [3, 4]]', '[[2, 1], [3, 4]]', '[[0, 2], [3, 0]]'], 0],
      ['Find the magnitude of vector b = (6, 8).', ['10', '14', '48', '100'], 0],
      ['Given v = (5, −12), find its magnitude.', ['7', '13', '17', '169'], 1],
      ['The inverse of matrix [[a, b], [c, d]] exists only if:', ['ad − bc = 0', 'ad − bc ≠ 0', 'a = d', 'a + d = 0'], 1],
      ['Given a = (2, −3) and b = (−1, 4), find a − b.', ['(3, −7)', '(1, 1)', '(−3, 7)', '(3, 7)'], 0],
    ],
    2,
  )
  // Junior WAEC (BECE) Mathematics Practice Exam — 50 questions · 45 minutes.
  await seedPracticeExam(foundationMath.id, trainer.id,
    { title: 'Junior WAEC (BECE) Mathematics Practice Exam', description: '50 BECE-style questions covering Number & Numeration, Everyday Arithmetic, Algebraic Processes, Geometry, Mensuration, and Statistics.', timeLimit: 45 },
    [
      ['Convert 25 to base 2.', ['11001', '11010', '11100', '10101'], 0],
      ['Simplify: 3/5 + 1/10', ['7/10', '4/5', '1/2', '3/10'], 0],
      ['Express 0.45 as a fraction in its lowest terms.', ['9/20', '4/5', '9/10', '1/2'], 0],
      ['Evaluate: 2³ × 2²', ['2⁵', '2⁶', '4⁵', '4⁶'], 0],
      ['Find the value of 5² − 3²', ['4', '8', '16', '25'], 2],
      ['Round 3.876 to 2 decimal places.', ['3.87', '3.88', '3.8', '3.9'], 1],
      ['Which of the following is a prime number?', ['21', '27', '29', '33'], 2],
      ['Find the LCM of 8 and 12.', ['16', '24', '32', '48'], 1],
      ['Simplify: 7 − (−3)', ['4', '10', '−4', '−10'], 1],
      ['Convert 3/8 to a decimal.', ['0.325', '0.375', '0.38', '0.425'], 1],
      ['Express 3/5 as a percentage.', ['35%', '53%', '60%', '62.5%'], 2],
      ['Find 15% of 200.', ['15', '20', '30', '40'], 2],
      ['A trader bought a bag of rice for ₦8000 and sold it for ₦9000. Find the percentage profit.', ['10.5%', '11.25%', '12.5%', '15%'], 2],
      ['Divide ₦450 in the ratio 2 : 3 : 4. Find the largest share.', ['₦100', '₦150', '₦200', '₦250'], 2],
      ['Find the simple interest on ₦5000 for 2 years at 6% per annum.', ['₦300', '₦500', '₦600', '₦1000'], 2],
      ['If 5 pencils cost ₦250, find the cost of 8 pencils.', ['₦350', '₦400', '₦450', '₦500'], 1],
      ['Convert 3/4 to a percentage.', ['34%', '43%', '75%', '80%'], 2],
      ['A car travels 240 km in 4 hours. Find its average speed.', ['40km/h', '50km/h', '60km/h', '80km/h'], 2],
      ['Simplify: 4x + 3x − 2x', ['5x', '6x', '7x', '9x'], 0],
      ['Solve: 2x + 5 = 15', ['x = 5', 'x = 10', 'x = 7.5', 'x = 20'], 0],
      ['Simplify: 3(x + 2)', ['3x + 2', '3x + 6', 'x + 6', '3x + 5'], 1],
      ['Solve: x − 4 = 10', ['x = 6', 'x = 14', 'x = −6', 'x = 40'], 1],
      ['If a = 3 and b = 5, find 2a + b.', ['8', '11', '13', '16'], 1],
      ['Solve simultaneously: x + y = 10, x − y = 2.', ['x = 6, y = 4', 'x = 5, y = 5', 'x = 4, y = 6', 'x = 8, y = 2'], 0],
      ['Simplify: 5y − 2y + y', ['2y', '3y', '4y', '6y'], 2],
      ['Solve: x + 3 < 9', ['x < 6', 'x > 6', 'x < 12', 'x > 3'], 0],
      ['Expand: 2(3x − 1)', ['6x − 1', '6x − 2', '5x − 1', '5x − 2'], 1],
      ['Find x if x and 50° are complementary angles.', ['30°', '40°', '50°', '130°'], 1],
      ['Find y if y and 110° are supplementary angles.', ['60°', '70°', '80°', '90°'], 1],
      ['How many sides does a pentagon have?', ['4', '5', '6', '7'], 1],
      ['Find the sum of the angles in a quadrilateral.', ['180°', '270°', '360°', '540°'], 2],
      ['An angle greater than 90° but less than 180° is called:', ['Acute', 'Right', 'Obtuse', 'Reflex'], 2],
      ['Two angles on a straight line add up to:', ['90°', '180°', '270°', '360°'], 1],
      ['Find the third angle of a triangle if two angles are 65° and 70°.', ['35°', '45°', '55°', '65°'], 1],
      ['A polygon with all sides and angles equal is called:', ['Irregular polygon', 'Regular polygon', 'Concave polygon', 'Convex polygon'], 1],
      ['Find the perimeter of a square with side 9 cm.', ['18cm', '27cm', '36cm', '81cm'], 2],
      ['Find the area of a rectangle 7 cm by 5 cm.', ['12cm²', '24cm²', '35cm²', '70cm²'], 2],
      ['Find the area of a square with side 6 cm.', ['12cm²', '24cm²', '36cm²', '48cm²'], 2],
      ['Find the circumference of a circle with radius 14 cm (take π = 22/7).', ['44cm', '66cm', '88cm', '154cm'], 2],
      ['Find the volume of a cube with side 3 cm.', ['9cm³', '18cm³', '27cm³', '36cm³'], 2],
      ['Find the perimeter of a rectangle 10 cm by 6 cm.', ['16cm', '32cm', '60cm', '64cm'], 1],
      ['Find the area of a triangle with base 8 cm and height 5 cm.', ['13cm²', '20cm²', '26cm²', '40cm²'], 1],
      ['A cuboid has length 5 cm, width 4 cm, height 3 cm. Find its volume.', ['12cm³', '20cm³', '60cm³', '45cm³'], 2],
      ['Find the mean of 6, 8, 10, 12, 14.', ['8', '9', '10', '12'], 2],
      ['Find the mode of: 3, 5, 5, 7, 5, 9.', ['3', '5', '7', '9'], 1],
      ['Find the median of: 2, 9, 4, 7, 5.', ['4', '5', '7', '9'], 1],
      ['A die is rolled once. Find the probability of getting an even number.', ['1/6', '1/3', '1/2', '2/3'], 2],
      ['Find the range of: 12, 4, 9, 20, 7.', ['8', '13', '16', '20'], 2],
      ['In a class of 30 students, 18 are boys. Find the probability that a student picked at random is a girl.', ['3/5', '2/5', '1/2', '3/10'], 1],
      ['Find the mean of: 15, 20, 25, 30, 35, 40.', ['25', '27.5', '28', '30'], 1],
    ],
    2,
  )


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

  // ── Complete lesson notes ──────────────────────────────────────────────────
  // Every seeded lesson ships with self-study notes students can read through:
  // concept → worked examples → pitfalls → practice. Applied both to fresh
  // seeds and to existing databases via the idempotent backfill further below.
  const LESSON_NOTES: Array<{ title: string; content: string }> = [
    { title: 'Introduction to Numbers', content: `# Introduction to Numbers

Numbers are the alphabet of mathematics. You will work with **natural numbers** (1, 2, 3, …), **whole numbers** (0, 1, 2, …), **integers** (… −2, −1, 0, 1, 2 …), fractions/decimals, and irrationals such as √2 and π.

## Place value

Every digit's value depends on position. In 4,805: 4→thousands (4000), 8→hundreds (800), 0→tens (0), 5→units (5).

## Comparing & ordering

Line up digits by place value and compare from the left. Order 7,203 · 7,230 · 6,999: thousands give 6k < 7k; then tens decide 203 vs 230. Answer: **6,999 < 7,203 < 7,230**.

## Rounding

Round 3,467 to the nearest hundred: tens digit 6 ≥ 5, so round up → **3,500**.

## Common mistakes

- Forgetting 0 IS a whole number.
- Rounding down when the next digit is exactly 5 — always round up at 5.

## Practice

1. Write 90,407 in words.
2. Round 58,496 to the nearest thousand.
3. Order: 12,089 · 12,098 · 11,990.

(Answers: ninety thousand, four hundred and seven; 58,000; 11,990 < 12,089 < 12,098.)` },
    { title: 'Addition & Subtraction', content: `# Addition & Subtraction

Adding combines groups; subtraction finds a difference or remainder, and undoes addition: if 8 + 5 = 13 then 13 − 5 = 8.

## Column method

Add 4,658 + 2,789 column by column from units, carrying any ten: 17 → carry 1; 14 → carry 1; 14 → carry 1; thousands 4+2+1. Result **7,447**.

Subtract 5,042 − 1,867 by borrowing left whenever a top digit is too small: 12−7=5, 13−6=7, 9−8=1, 4−1=3 → **3,175**.

## Number-line intuition

Positive moves go right, negatives left: −4 + 9 = 5; −3 − 4 = −7.

## Word problems

Adaeze has ₦4,650 and spends ₦1,275 → 4,650 − 1,275 = **₦3,375** remaining.

## Common mistakes

- Missing a carry/borrow mid-column.
- Reordering digits so the bigger digit sits on top regardless of direction — always keep top-minus-bottom per column.

## Practice

1. 6,305 + 2,987
2. 9,002 − 4,666
3. A 15,000 L tank has 8,450 L used — how much remains?

(Answers: 9,292; 4,336; 6,550 L.)` },
    { title: 'Multiplication & Division', content: `# Multiplication & Division

Multiplication is repeated addition (4 × 3 = 3+3+3+3); division shares into equal groups and undoes it. Knowing your **tables to 12** speeds up everything ahead.

## Long multiplication

236 × 34: first 236 × 4 = 944; then 236 × 30 = 7,080 (shift one place); add → **8,024**.

## Long division

1,512 ÷ 21: how many 21s in 151? Seven (147), remainder 4; bring down the 2 to get 42; 42 ÷ 21 = 2 exactly. Quotient **72**.

## Divisibility shortcuts

By 2 — last digit even. By 3/9 — digit sum divisible by 3/9. By 5 — ends in 0 or 5. By 11 — alternating digit difference divisible by 11.

## Word problems

Eggs cost ₦95 per crate; a trader buys 28 crates → 95 × 28 = **₦2,660**.

## Common mistakes

- Misaligning place-value rows before adding partial products.
- Dropping interior zeros in a quotient: 816 ÷ 8 = 102, not 12.

## Practice

1. 456 × 27
2. 2,079 ÷ 63
3. Share ₦3,150 equally among 18 students.

(Answers: 12,312; 33; ₦175 each.)` },
    { title: 'Understanding Fractions', content: `# Understanding Fractions

A fraction names equal parts of a whole: **numerator/denominator**. In 3⁄8 the whole is cut into 8 equal parts and we take 3.

## Types & conversions

- Proper (< 1): 3⁄8 · Improper (> 1): 9⁄4 · Mixed: 2¼
- Mixed ↔ improper: 2¼ = (2×4)+1 over 4 = 9⁄4; back by dividing: 9 ÷ 4 = 2 r1 → 2¼.

## Equivalent fractions

Multiply or divide top AND bottom by the same number: 2⁄3 = 6⁄9; simplify 12⁄18 → HCF 6 → 2⁄3.

## Comparing

Equalise denominators with the LCD: 3⁄4 vs 5⁄7 → 21⁄28 vs 20⁄28 → **3⁄4 wins**.

## The four operations

- Same denominator: add numerators only → 2⁄9 + 5⁄9 = 7⁄9.
- Different: convert first → 1⁄6 + 1⁄4 = 2⁄12 + 3⁄12 = 5⁄12.
- Multiply straight across: 2⁄3 × 3⁄5 = 6⁄15 = 2⁄5.
- Divide by flipping the second: 3⁄4 ÷ 2⁄5 = 3⁄4 × 5⁄2 = 15⁄8.

## Common mistakes

- Adding denominators too (2⁄9 + 5⁄9 is NOT 7⁄18).
- Cancelling across + or − signs — cancellation is valid for × and ÷ only.

## Practice

1. Simplify 36⁄60.   2. Work out 2⁄5 + 1⁄3.   3. How many 3⁄4-cup servings fill 6 cups?

(Answers: 3⁄5; 11⁄15; 8 servings.)` },
    { title: 'Decimal Operations', content: `# Decimal Operations

Decimals extend place value beyond units: tenths (0.1), hundredths (0.01), thousandths (0.001). So 4.258 = 4 + 2⁄10 + 5⁄100 + 8⁄1000.

## Adding & subtracting — align the POINT

Pad with zeros so every number has equal length after the point:

    6.750
   12.400
   +0.308
   ------
   19.458

## Multiplying

Ignore points, multiply whole numbers, then count total decimal places of BOTH factors: 0.32 × 0.05 → 32×5 = 160 → 4 places → **0.016**.

## Dividing

Shift both numbers' points equally until the divisor is whole: 4.684 ÷ 1.4 becomes 46.84 ÷ 14 = **3.346**.

## Conversions to know

1⁄4 = 0.25 · 1⁄5 = 0.2 · 3⁄8 = 0.375 · 45% = 0.45 · 0.06 = 6%.

## Estimating first

19.6 × 4.02 ≈ 20 × 4 = 80, so the exact answer 78.792 is believable — estimating catches place-value slips.

## Common mistakes

- Right-aligning digits instead of decimal points when adding.
- Moving the point in only one of the two numbers when dividing.

## Practice

1. 15.06 − 8.972   2. 2.4 × 0.35   3. 17.5 ÷ 0.25

(Answers: 6.088; 0.84; 70.)` },
    { title: 'Variables & Expressions', content: `# Variables & Expressions

A **variable** is a letter holding an unknown or changing value. An **expression** combines variables, numbers and operations — in 3x + 7, the terms are 3x and 7 (coefficient 3, constant 7). No equals sign yet!

## Translating words into symbols

- "five more than a number n" → n + 5
- "twice the cost c reduced by ₦300" → 2c − 300
- "three consecutive integers from k" → k, k+1, k+2

## Evaluating (substitute carefully)

2x² − 4y when x = 3, y = −2:
2(9) − 4(−2) = 18 + 8 = **26**. Substitution respects powers BEFORE coefficients, and minus-times-minus is plus.

## Simplifying

Collect like terms only: 7a + 3b − 2a + b = **5a + 4b**. Expand brackets first: 4(x + 3) − 2(x − 1) = 4x + 12 − 2x + 2 = **2x + 14**.

## Formulas are expressions

Simple interest I = PRT⁄100 with P = ₦20,000, R = 6%, T = 2½ years → I = 20,000×6×2.5 ÷ 100 = **₦3,000**.

## Common mistakes

- Combining unlike terms as if x + y = xy.
- Sign slips opening brackets after a minus: −(x − 4) = −x + 4.

## Practice

1. Evaluate 5m − 2n at m = 4, n = −3.
2. Simplify 6p − 2(q − 3p).
3. Write "half of t increased by nine" in symbols.

(Answers: 26; 12p − 2q; t⁄2 + 9.)` },
    { title: 'Solving Simple Equations', content: `# Solving Simple Equations

An equation says two expressions are EQUAL; solving finds the value that makes it true. Golden rule — a balanced scale: **whatever you do to one side, do to the other**.

## One-step undoing

- x + 7 = 15 → subtract 7 → x = 8
- m − 4 = 9 → add 4 → m = 13
- 5t = 60 → divide by 5 → t = 12
- p⁄3 = 7 → multiply by 3 → p = 21

## Two-step equations

Undo operations in reverse BIDMAS order. 3x − 5 = 16: add 5 first (3x = 21), then divide by 3 → **x = 7**.

With brackets, either expand or divide both sides first: 2(x + 4) = 26 → x + 4 = 13 → **x = 9**.

Variables on both sides — collect them onto one side: 5n + 2 = 3n + 14 → 2n = 12 → **n = 6**.

## Always check

Substitute into the ORIGINAL equation: 3(7) − 5 = 16 ✓.

## Word problems

Bola bought 4 identical books and had ₦900 left from ₦5,000:
5000 − 4b = 900 → 4b = 4100 → **₦1,025 per book**.

## Special outcomes

Simplifying to a false sentence (3 = 7) means **no solution**; simplifying to something always true means every value works.

## Common mistakes

- Operating on one side only.
- Wrong sign when moving terms across the equals sign.

## Practice

1. 6y − 9 = 39   2. 4(k + 1) = 3k + 10   3. Twice a number less five is eleven — find it.

(Answers: y = 8; k = 6; the number is 8.)` },
    { title: 'Getting Started with JS', content: `# Getting Started with JavaScript

JavaScript runs in every browser and makes pages interactive. You can start with zero installs: open DevTools (F12) → Console and type code straight away.

## Your first statements

    console.log("Hello, NumeryCode!")
    alert("Welcome!")

'console.log' prints for developers; 'alert' pops a message to users.

## Variables

Three ways to declare:

    let score = 10        // can be reassigned
    const school = "NC"   // cannot be reassigned
    var old = true        // legacy — avoid in new code

Prefer const by default; use let only when the value must change.

## Data types at a glance

- String: "hi" · Number: 42, 3.5 · Boolean: true/false
- null (deliberately empty) vs undefined (not set yet)
- Objects group data: { name: "Ada", age: 15 } · Arrays list items: [1, 2, 3]

Template strings interpolate values, but simple concatenation like "Score: " + score works everywhere too.

## Run-order matters

The browser executes top-to-bottom: a variable used before its line runs is undefined, not an error yet — but referencing a never-declared name throws ReferenceError.

## Practice

1. Print your name with console.log.
2. Store your age in a const and log "I am X".
3. Predict then verify: logging a variable you never declared.

(Practice builds muscle memory — actually run each one!)` },
    { title: 'Variables & Data Types', content: `# Variables & Data Types

A variable is a labelled box for a value; its **data type** describes what kind of value lives inside. JavaScript checks types only when it runs (weak typing), so YOU must stay alert.

## let vs const in practice

    let temperature = 31
    temperature = 33          // fine: let allows reassignment
    const DAYS_IN_WEEK = 7
    // DAYS_IN_WEEK = 8       // TypeError: Assignment to constant

## The core types

- **String** — text in quotes: "Lagos", 'a', back-tick templates.
- **Number** — integers AND decimals share one type: 7, 3.14, -20. Special values NaN and Infinity are still numbers.
- **Boolean** — true or false, from comparisons like age >= 18.
- **Undefined** — declared but never assigned: let x; → x is undefined.
- **Null** — intentionally empty, you set it yourself.
- **Object / Array** — collections: student = { name: "Ada", grade: 92 }; scores = [70, 85, 90].

## Checking types

    typeof 42        // "number"
    typeof "hi"      // "string"
    typeof true      // "boolean"
    typeof undefined // "undefined"
    typeof null      // "object"  (historical quirk!)

## Type coercion surprises

The + operator joins strings when either side is text:

    "5" + 3  // "53"  ← string!
    "5" - 3  // 2     ← coerces to number

Convert explicitly with Number("5") or String(42) to avoid bugs.

## Naming rules

Start with a letter, $ or _; no spaces or dashes; case matters (score ≠ Score); use camelCase for clarity.

## Common mistakes

- Using an undeclared name → ReferenceError.
- Mixing "5" + 2 expecting 7 — always know your types.

## Practice

1. Declare const country = "Nigeria"; log it and its typeof.
2. Predict "10" + 10, then Number("10") + 10.
3. Create an object for yourself with name, age, class keys.` },
    { title: 'Operators & Expressions', content: `# Operators & Expressions

An expression is any code that PRODUCES a value — 4 + 6, score > 50, "Hello, " + name. Operators build expressions.

## Arithmetic operators

+ − * / do the obvious; % returns the remainder: 17 % 5 = 2 — perfect for even/odd tests; ** raises power: 2 ** 10 = 1024.

Precedence follows BIDMAS: 2 + 3 * 4 = 14; add brackets to force order: (2 + 3) * 4 = 20.

## Shorthand assignment

    let n = 10
    n += 5   // 15   same as n = n + 5
    n -= 3   // 12
    n *= 2   // 24
    n /= 4   // 6
    n %= 4   // 2

## Increment & decrement

i++ adds 1 after using the value; ++i adds before. In loops either works; keep it simple.

## Comparison operators

- === equal value AND type → use this one!
- == loosely compares after coercion ("5" == 5 is true — beware)
- !== not-equal-strict · > · < · >= · <=

## Logical operators

- && AND — both sides must be truthy
- || OR — at least one side truthy
- ! NOT — flips boolean

Combining: age >= 13 && age <= 19 identifies teenagers.

## String operator

+ concatenates: "Numery" + "Code" = "NumeryCode". Repeat with .repeat(3).

## Common mistakes

- Confusing = (assignment) with === (comparison) inside conditions.
- Forgetting % gives remainder, NOT percentage — 50 % 20 = 10.

## Practice

1. Evaluate 15 % 4, then 2 ** 5.
2. Write an expression that is true when marks >= 40 AND attendance > 75.
3. Fix the trap: does "6" == 6 pass? Does "6" === 6?` },
    { title: 'If/Else Statements', content: `# If/Else Statements

Programs make decisions with conditionals: code that runs only when a condition is true.

## The full pattern

    const score = 72
    if (score >= 70) {
      console.log("A — Excellent")
    } else if (score >= 60) {
      console.log("B — Very good")
    } else if (score >= 50) {
      console.log("C — Good")
    } else {
      console.log("Try again")
    }

Conditions run top-down; the FIRST true branch wins, the rest are skipped. The final else catches everything remaining.

## Truthy & falsy

Inside an if, any value reduces to true/false. Falsy values are: false, 0, "" (empty string), null, undefined, NaN. Everything else — including "0", [], {} — is truthy.

    if (userInput) { ... }   // runs unless userInput is falsy

## Nesting vs guarding

Deep nesting hurts readability. Prefer early returns/guards:

    // nested (harder to read)
    if (isLoggedIn) {
      if (hasPaid) { start() }
    }
    // guard style (flatter)
    if (!isLoggedIn) return
    if (!hasPaid) return
    start()

## Combining conditions

    if (age >= 18 && hasID) { allowEntry() }
    if (day === "Sat" || day === "Sun") { isWeekend = true }

## Ternary shortcut

    const label = score >= 50 ? "Pass" : "Fail"

## Common mistakes

- Writing = instead of === in the condition (always truthy!).
- Forgetting brackets around multiple statements, or adding a semicolon right after if (...) which silently ends the branch.
- Overlapping ranges ordered wrongly — put specific checks first.

## Practice

1. Classify temperatures below 0, to 25, and above as Freezing/Warm/Hot.
2. Write a login guard that rejects empty username OR short password.
3. Convert an if/else into a ternary for even/odd using %.` },
    { title: 'Loops – for and while', content: `# Loops – for and while

Loops repeat work without repeating code. Choose based on whether you know the number of repetitions in advance.

## The classic for loop

Three parts: start; keep-going test; step.

    for (let i = 1; i <= 5; i++) {
      console.log("Lap", i)
    }

Prints Lap 1 through Lap 5 — i++ means increment AFTER each pass.

## Looping arrays

    const subjects = ["Maths", "Code", "Physics"]
    for (let i = 0; i < subjects.length; i++) {
      console.log(subjects[i])
    }

Indexes start at 0, so the last valid index is length − 1 — going past it gives undefined.

## while = repeat until

Use when you cannot predict iterations:

    let total = 0
    let n = 1
    while (total <= 100) {
      total += n
      n++
    }
    console.log(total, n)   // first total over 100 and the n used

## do...while runs at least once

    do { guess = nextGuess() } while (!correct)

## break & continue

- break exits the loop immediately.
- continue skips just this pass, then keeps looping.

    for (let i = 1; i <= 10; i++) {
      if (i % 2 === 0) continue   // skip evens
      if (i > 7) break            // stop after 7
      console.log(i)
    }

## Infinite loops — avoid!

Forgetting the step (or making the condition always true) freezes the tab:

    for (let i = 0; i < 3; ) { }   // i never grows → hangs!

Always ensure something inside moves toward the exit condition.

## Common mistakes

- Off-by-one: using <= on array indexes overruns the end.
- Declaring i outside the loop without let and leaking global state.
- Modifying the array while looping over it.

## Practice

1. Print the 4-times table from 1 × 4 to 12 × 4.
2. Sum all odd numbers under 50 with a loop.
3. Use while + break to stop when a running sum passes 200; log how many numbers were added.` },
    { title: 'Defining Functions', content: `# Defining Functions

A function is a named, reusable block of code — write once, call anywhere. It turns long scripts into tidy, testable steps.

## Declaring & calling

    function greet(name) {
      return "Hello, " + name + "!"
    }

    greet("Ada")     // "Hello, Ada!"
    greet("Chidi")   // reuses the same logic

return hands a value back to the caller and ENDS the function immediately; code after it never runs.

## Parameters vs arguments

Parameters are the placeholders in the definition (name); arguments are the real values passed when calling ("Ada"). Functions can take several:

    function average(a, b, c) {
      return (a + b + c) / 3
    }
    average(10, 20, 30)   // 20

## Default parameters

    function power(base, exp = 2) {
      return base ** exp
    }
    power(5)      // 25  — uses default
    power(5, 3)   // 125

## Why functions matter

- DRY — Don't Repeat Yourself.
- Each one does ONE job well (single responsibility).
- Easier to debug: isolate the broken piece.

## Function expressions

Functions are values too — they can be stored:

    const double = function (x) { return x * 2 }
    double(7)   // 14

## Scope inside functions

Variables declared with let/const inside stay INSIDE (local scope); the outside world cannot see them.

## Common mistakes

- Calling before defining in strict module order (hoisting only covers declarations).
- Forgetting return → result is undefined.
- Relying on outer variables instead of passing parameters — makes reuse fragile.

## Practice

1. Write isEven(n) returning true/false using %.
2. Write celsiusToFahrenheit(c) and convert 37°.
3. Write max3(a, b, c) without Math.max.` },
    { title: 'Arrow Functions & Scope', content: `# Arrow Functions & Scope

Arrow functions are a compact modern syntax for writing functions — perfect for short one-line helpers.

## From classic to arrow

    // classic
    const square = function (x) { return x * x }

    // arrow
    const square = (x) => x * x          // implicit return
    const square2 = x => x * x           // single param needs no brackets
    const zero = () => console.log("hi") // no params → empty brackets

A body without curly braces RETURNS automatically; with braces you must return yourself:

    const add = (a, b) => a + b              // returns
    const log = (a, b) => { console.log(a + b) }  // returns undefined!

## Where arrows shine — callbacks

    const scores = [45, 82, 67]
    scores.filter(s => s >= 50)        // [82, 67]
    scores.map(s => s * 2)             // [90, 164, 134]
    scores.reduce((sum, s) => sum + s, 0)   // 194

## Scope — who can see what

- Global: declared nowhere-nested → visible everywhere.
- Function scope: let/const inside a function exist only there.
- Block scope: even inside { } of if/for.
- Inner functions can READ outer variables (lexical scope), not vice versa.

    const rate = 0.05                 // outer
    const tax = price => price * rate // inner reads outer ✓

## this behaves differently

Classic functions get this from HOW they're called; arrows take it from the SURROUNDING code. That's why array callbacks prefer arrows, while object methods often stay classic.

## Common mistakes

- Multi-statement arrow forgetting { } AND return together.
- Using an outer variable name that shadows your parameter by accident.
- Expecting block-scoped let inside loops to persist after the loop ends.

## Practice

1. Rewrite triple(x) as an arrow with implicit return.
2. Use filter + map to keep passing scores then grade them.
3. Predict the output: nested functions reading an outer counter variable.` },
    { title: 'What Is a Sequence?', content: `# What Is a Sequence?

A **sequence** is an ordered list of numbers following a rule. Each number is a **term**: 3, 7, 11, 15 has first term 3, second term 7. The ellipsis … means "continues forever".

## Describing rules

- "add 4 each time" → 3, 7, 11, 15
- "multiply by 3 each time" → 2, 6, 18, 54
- "perfect squares" → 1, 4, 9, 16

Finding the rule is the heart of this topic: look first at DIFFERENCES between terms, then RATIOS.

## Notation

a₁ = first term, a₂ = second, n counts position. Tₙ means "the nth term". A **finite** sequence ends; an **infinite** one continues.

## Worked example

Write the next two terms of 5, 9, 13, …: differences are constant (+4) → next terms 17, 21.

## Common mistakes

- Assuming the rule from ONE difference pair (test at least three terms).
- Confusing position (n) with value (Tₙ): in 1, 4, 9 the 3rd term is 9, not 3.

## Practice

1. Next two terms of 64, 32, 16, …?
2. Which rule fits 100, 93, 86, …: subtract 7 or divide 2?
3. List the first five terms of "start at 2, alternate +3 then −1".

(Answers: 8, 4; subtract 7 → 79, 72; 2, 5, 4, 7, 6.)` },
    { title: 'Recognising APs and GPs', content: `# Recognising APs and GPs

Two families dominate exams.

## Arithmetic Progression (AP)

Each term comes from ADDING a fixed **common difference d**.
Example: 3, 7, 11, 15 → d = 4 because 7−3 = 11−7 = 4.

Test: subtract consecutive terms; every gap must be equal.

## Geometric Progression (GP)

Each term comes from MULTIPLYING by a fixed **common ratio r**.
Example: 2, 6, 18, 54 → r = 3 because 6÷2 = 18÷6 = 3.

Test: divide consecutive terms; every quotient must match.

## Quick contrast table

| pattern | type | reason |
|---|---|---|
| 5, 10, 15, 20 | AP | +5 every time |
| 5, 10, 20, 40 | GP | ×2 every time |
| 81, 27, 9, 3 | GP | ×1⁄3 every time |
| 30, 24, 18 | AP | −6 every time |

Neither family? Sequences like 1, 4, 9, 16 (squares) follow other rules.

## Common mistakes

- Calling 5, 10, 20 an AP (only some gaps match).
- Ignoring negative ratios: 12, −6, 3 IS a GP with r = −½.
- Sign errors with decreasing APs: keep d negative (e.g. d = −6, not 6).

## Practice

Classify each and state d or r:
1. 45, 41, 37, 33
2. 7, 21, 63, 189
3. 2, −4, 8, −16

(Answers: AP d=−4; GP r=3; GP r=−2.)` },
    { title: 'Finding the nth Term', content: `# Finding the nth Term (AP)

The nth term formula predicts ANY term without listing: **Tₙ = a + (n − 1)d**, where a = first term, d = common difference.

## Deriving it

3, 7, 11, 15 … starts at 3 and gains 4 per step: Tₙ = 3 + 4(n − 1) = 4n − 1.
Check: T₁₀ = 40 − 1 = **39** ✓ (matches a + 9d).

## Worked example

For 5, 9, 13, …: a = 5, d = 4 → Tₙ = 5 + 4(n−1) = 4n + 1. Which term equals 81?
Solve 4n + 1 = 81 → n = **20**.

## Rearranging for other unknowns

- Given Tₙ and n → substitute directly.
- "Is 100 a term of 7, 12, 17…?" Tₙ = 5n + 2 → 5n + 2 = 100 → n = 19.6 ✗ not a whole number → NO, 100 never appears.

## GPs use powers

Tₙ = a·rⁿ⁻¹. For 2, 6, 18: Tₙ = 2 × 3ⁿ⁻¹, so T₆ = 2×3⁵ = **486**.

## Common mistakes

- Using (n+1) or forgetting the −1 in (n − 1).
- Simplifying 3 + 4(n−1) as 7n − 1 instead of 4n − 1 (distribute FIRST).
- Forgetting that a non-integer n means "not in this sequence".

## Practice

1. Find Tₙ then T₃₀ for 9, 14, 19, …
2. Which term of 4, 11, 18, … is 88?
3. Is 250 a term of 3, 8, 13, …?

(Answers: Tₙ = 5n + 4, T₃₀ = 154; n = 13; no, n would be 49.6.)` },
    { title: 'Sum of an Arithmetic Series', content: `# Sum of an Arithmetic Series

A **series** adds a sequence's terms; Sₙ is its total after n terms.

## The two formulas

**Formula 1** — when you know first & last terms:
Sₙ = n⁄2 × (a + l)

**Formula 2** — when you know a and d:
Sₙ = n⁄2 [2a + (n − 1)d]

They agree because pairing outer terms (a + l) repeatedly gives the same total.

## Worked examples

Sum 4 + 7 + 10 + … to 15 terms: a = 4, d = 3 → S₁₅ = 15⁄2 [8 + 14(3)] = 7.5 × 50 = **375**.

First 20 natural numbers: S₂₀ = 20⁄2 (1 + 20) = 10 × 21 = **210**.

Chidi saves ₦500, adding ₦100 monthly: after 12 months S₁₂ = 6[1000 + 11(100)] = **₦12,600**.

## Finding n from a target sum

How many terms of 2, 5, 8 … give 950? n⁄2[4 + 3(n−1)] = 950 → 3n² + n − 1900 = 0 → (positive root) **n = 25**.

Gauss' trick underlies formula 1: pair first-with-last going inward.

## Common mistakes

- Mixing formulas (using l where d belongs).
- Sign slips expanding 2a + (n − 1)d.
- Quadratics having two roots — reject negative n.

## Practice

1. Sum the first 18 terms of 12, 9, 6, …
2. An AP has a = 7, l = 103, n = 12 — find Sₙ.
3. Seats in an auditorium rows: 18, 21, 24 … for 20 rows?

(Answers: −99; 660; 750 seats.)` },
    { title: 'Finding the Common Ratio', content: `# Finding the Common Ratio

In a GP, the **common ratio r** is any term divided by the one before it: r = T₂ ÷ T₁ = T₃ ÷ T₂ = …

## Worked examples

- 81, 27, 9, 3 → 27⁄81 = **1⁄3** (a shrinking GP)
- 2, −6, 18, −54 → −6⁄2 = **−3** (signs alternate)
- 3, 6, 12, …, 384 → r = 2; count terms: 3(2ⁿ⁻¹) = 384 → 2ⁿ⁻¹ = 128 = 2⁷ → **n = 8**

## Using r to build missing terms

With a = 5 and r = 2: terms are 5, 10, 20, 40 — multiply forward. To go BACKWARD divide by r.

## Powers of r

Tₙ = a·rⁿ⁻¹ means exponent counts STEPS not terms: from T₃ to T₇ is r⁴ (not r⁷).

Geometric mean of two extremes: b² = ac → GM of 4 and 16 = √64 = **8**.

## Common mistakes

- Reversing the division: 27⁄81 gives 1⁄3, but 81⁄27 gives 3 — always later-term-on-top.
- Dropping the minus sign in alternating GPs.
- Applying ×r when asked for an EARLIER term.

## Practice

1. Find r for 240, 60, 15, …
2. How many terms in 5, 15, 45, …, 3645?
3. The geometric mean of 3 and 27?

(Answers: 1⁄4; n = 6; 9.)` },
    { title: 'Sum to Infinity', content: `# Sum to Infinity

Add infinitely many GP terms and the total can SETTLE on a finite number — but only under one condition.

## The condition

| r | < 1 (i.e. −1 < r < 1) → convergent. Each step adds ever-smaller pieces, so S∞ exists:

    S∞ = a ⁄ (1 − r)

If |r| ≥ 1 the sum races off to infinity — no finite total.

## Worked examples

- a = 8, r = ½ → S∞ = 8 ⁄ (1 − ½) = **16**.
- a = 9, r = 1⁄3 → 9 ⁄ (2⁄3) = **13.5**.
- Recurring decimal 0.777… = 7⁄10 + 7⁄100 + … with a = 0.7, r = 0.1 → 0.7⁄0.9 = **7⁄9** ✓ classic use!

## Real-world intuition

A ball dropped from 4 m rebounds half as high each bounce: total distance up-and-down = 4 + 2×(4 + 2 + 1 + …)? The inner series has a = 4, r = ½ → S∞ = 8; total travel = 4 + 2(8)... careful setup matters — draw it!

## Why it works

Sₙ = a(1 − rⁿ)⁄(1 − r); as n grows, rⁿ → 0, leaving a⁄(1 − r).

## Common mistakes

- Using the formula when |r| > 1.
- Sign slips: with r = −½, denominator 1 − (−½) = 1.5.
- Forgetting recurring decimals ARE geometric series.

## Practice

1. S∞ for 20, 10, 5, …?
2. Does 4, 8, 16 … converge? Why?
3. Express 0.454545… as a fraction via S∞.

(Answers: 40; no, |r| = 2; 45⁄99 = 5⁄11.)` },
    { title: 'Sigma Notation', content: `# Sigma Notation

The Greek capital sigma Σ is maths shorthand for "add these up". Writing:

    5
    Σ (2n + 1)   means   (2·1+1) + (2·2+1) + … + (2·5+1)
    n = 1

The bottom (n = 1) says where counting starts; the top (5) where it stops.

## Evaluating step by step

For n = 1 to 5: terms are 3, 5, 7, 9, 11 → sum = **35**. Always write the first and LAST term to sanity-check the range.

## Combining with known formulas

Σn = n(n+1)/2 · Σn² = n(n+1)(2n+1)/6 · Σc = cn (a constant sums to c repeated).

Example: Σ(3n − 2) from 1 to 10 = 3·(55) − 20 = **145**.

## Changing limits is NOT cosmetic

Same expression but n = 3 to 7 gives DIFFERENT terms (7 through 15): 55. Read bounds carefully — a favourite exam trap.

## Common mistakes

- Plugging n into the BOUNDS instead of the rule.
- Starting at 0 vs 1 confusion: at n = 0, (2n+1) contributes 1.
- Forgetting Σ only ADDS; products need Π or explicit writing.

## Practice

1. Evaluate Σ(4n − 1), n = 1 to 6.
2. Evaluate Σ k² for k = 1 to 4.
3. Rewrite "sum of odd numbers below 12" in sigma notation two ways.

(Answers: 69; 30; e.g. Σ(2k−1) for k=1..6 or Σ(2k+1) for k=0..5.)` },
    { title: 'Word Problems on Series', content: `# Word Problems on Series

Exam questions dress sequences in stories. Translate story → sequence → formula → answer.

## A reliable four-step method

1. IDENTIFY: constant addition → AP; constant multiplication → GP.
2. EXTRACT: write down a, d (or r), what's asked.
3. SELECT the formula: Tₙ, Sₙ or S∞.
4. SOLVE and sense-check (money can't be negative; n must be whole).

## Modelled examples

**Savings**: ₦500 first month, +₦100 monthly → AP a=500 d=100. After 12 months: S₁₂ = 6[1000 + 11(100)] = **₦12,600**.

**Bacteria**: doubles every hour from 50 → GP a=50 r=2. Count after 8 hours: T₈ = 50·2⁷ = **6,400**.

**Chairs**: rows 18, 21, 24 … for 20 rows: S₂₀ = 10[36 + 19(3)] = **750 chairs**.

**Bouncing ball**: drops 4 m, rebounds 80%? Height of nth rebound = 4(0.8)ⁿ⁻¹; total vertical distance uses S∞ for both directions — sketch before computing!

## Turning "impossible" into marks

If 250 were claimed as a term of 3, 8, 13…, solving 5n − 2 = 250 gives non-integer n → impossible; stating that explicitly earns full credit.

## Common mistakes

- Using Sₙ when a single TERM (Tₙ) is asked.
- Off-by-one timing ("after the 12th month" = 12 payments).
- Rounding money mid-calculation instead of at the end.

## Practice

1. Salary starts ₦900,000 rising ₦25,000 yearly — total over 10 years?
2. A culture triples every 20 min from 200 cells — size after 2 h?
3. How many terms of 6, 11, 16 … are needed to exceed 500?

(Answers: ₦10,125,000; 145,800; 15 terms — the 14th gives 496.)` },
  ]

  // ── Apply notes: fill empty content AND create any missing lessons ────────
  // Idempotent by design:
  //   • lessons whose title matches a note get content backfilled when empty
  //     (covers fresh seeds AND legacy databases where content defaulted to '');
  //   • notes with no matching lesson anywhere are CREATED inside their declared
  //     course/module (module auto-created too), so every seeded course carries
  //     complete, readable notes on first deploy and on redeploys.
  const LESSON_PLACEMENT: Record<string, { course: string; module: string }> = {
    'Understanding Fractions':   { course: 'Foundation Mathematics',   module: 'Fractions & Decimals' },
    'Decimal Operations':        { course: 'Foundation Mathematics',   module: 'Fractions & Decimals' },
    'Variables & Expressions':   { course: 'Foundation Mathematics',   module: 'Introduction to Algebra' },
    'Solving Simple Equations':  { course: 'Foundation Mathematics',   module: 'Introduction to Algebra' },
    'Getting Started with JS':   { course: 'JavaScript for Beginners', module: 'JavaScript Basics' },
    'Variables & Data Types':    { course: 'JavaScript for Beginners', module: 'JavaScript Basics' },
    'Operators & Expressions':   { course: 'JavaScript for Beginners', module: 'JavaScript Basics' },
    'If/Else Statements':        { course: 'JavaScript for Beginners', module: 'Control Flow' },
    'Loops – for and while':     { course: 'JavaScript for Beginners', module: 'Control Flow' },
    'Defining Functions':        { course: 'JavaScript for Beginners', module: 'Functions' },
    'Arrow Functions & Scope':   { course: 'JavaScript for Beginners', module: 'Functions' },
  }

  const { rows: allLessons } = await query<{ id: string; title: string }>('SELECT id, title FROM lessons')
  let notesFilled = 0
  let notesCreated = 0
  for (const note of LESSON_NOTES) {
    const targets = allLessons.filter(l => l.title === note.title)
    if (targets.length > 0) {
      const result = await query(
        `UPDATE lessons SET content = $1
          WHERE id = ANY($2::uuid[]) AND (content IS NULL OR btrim(content) = '')`,
        [note.content, targets.map(t => t.id)],
      )
      notesFilled += result.rowCount ?? 0
      continue
    }
    const placement = LESSON_PLACEMENT[note.title]
    if (!placement) continue
    const { rows: modRows } = await query<{ id: string }>(
      `SELECT m.id FROM modules m JOIN courses c ON c.id = m.course_id
        WHERE c.title = $1 AND m.title = $2 LIMIT 1`,
      [placement.course, placement.module],
    )
    let moduleId = modRows[0]?.id
    if (!moduleId) {
      const { rows: createdModules } = await query<{ id: string }>(
        `INSERT INTO modules (course_id, title, position)
         SELECT c.id, $2,
                COALESCE((SELECT MAX(m.position) + 1 FROM modules m WHERE m.course_id = c.id), 0)
         FROM courses c WHERE c.title = $1
         RETURNING id`,
        [placement.course, placement.module],
      )
      moduleId = createdModules[0]!.id
    }
    await query(
      `INSERT INTO lessons (module_id, title, duration, position, content)
       VALUES ($1, $2, 25,
               COALESCE((SELECT MAX(l.position) + 1 FROM lessons l WHERE l.module_id = $1), 0),
               $3)`,
      [moduleId, note.title, note.content],
    )
    notesCreated++
  }
  console.log(`  Lesson notes: ${notesFilled} backfilled, ${notesCreated} lessons created.`)

  await ensureCurriculumCatalog()
  await ensureSS2MathematicsCourse()
  console.log('Seed complete.')
  console.log(`  Admin:   emmanuel@numerycode.com      / password123`)
  console.log(`  Admin:   nwaforugochukwu21@gmail.com  / password123`)
  console.log(`  Trainer: trainer@numerycode.com        / password123`)
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
