import dotenv from 'dotenv';
dotenv.config();

import pool, { query } from './pool';

async function migrate() {
  console.log('Running migrations...');

try {
    await query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      -- Users
      CREATE TABLE IF NOT EXISTS users (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name         VARCHAR(255) NOT NULL,
        email        VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role         VARCHAR(20)  NOT NULL DEFAULT 'student' CHECK (role IN ('student','trainer','admin')),
        status       VARCHAR(20)  NOT NULL DEFAULT 'active'  CHECK (status IN ('active','suspended','pending')),
        created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        last_active  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT NOT NULL DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

      -- Courses
      CREATE TABLE IF NOT EXISTS courses (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title         VARCHAR(255) NOT NULL,
        description   TEXT NOT NULL,
        subject       VARCHAR(20)  NOT NULL CHECK (subject IN ('mathematics','programming')),
        level         VARCHAR(20)  NOT NULL CHECK (level IN ('beginner','intermediate','advanced')),
        instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status        VARCHAR(20)  NOT NULL DEFAULT 'draft' CHECK (status IN ('published','draft','archived')),
        lesson_count  INTEGER NOT NULL DEFAULT 0,
        outcomes      TEXT[]  NOT NULL DEFAULT '{}',
        thumbnail_url VARCHAR(512),
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS access_level VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (access_level IN ('free','premium'));
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'NGN';
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS premium_enabled BOOLEAN NOT NULL DEFAULT TRUE;

      -- Modules
      CREATE TABLE IF NOT EXISTS modules (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title     VARCHAR(255) NOT NULL,
        position  INTEGER NOT NULL DEFAULT 0,
        UNIQUE(course_id, position)
      );

      -- Lessons
      CREATE TABLE IF NOT EXISTS lessons (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
        title     VARCHAR(255) NOT NULL,
        duration  INTEGER NOT NULL DEFAULT 0,
        position  INTEGER NOT NULL DEFAULT 0,
        UNIQUE(module_id, position)
      );

      -- Resources
      CREATE TABLE IF NOT EXISTS resources (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        title     VARCHAR(255) NOT NULL,
        type      VARCHAR(10)  NOT NULL CHECK (type IN ('pdf','video','link')),
        url       VARCHAR(512) NOT NULL
      );

      -- Live classes
      CREATE TABLE IF NOT EXISTS live_classes (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title     VARCHAR(255) NOT NULL,
        date      TIMESTAMPTZ NOT NULL,
        duration  INTEGER NOT NULL DEFAULT 60,
        meet_url  VARCHAR(512) NOT NULL,
        status    VARCHAR(20)  NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','completed')),
        attendees INTEGER NOT NULL DEFAULT 0
      );

      -- Enrollments
      CREATE TABLE IF NOT EXISTS enrollments (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        progress    INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
        enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, course_id)
      );

      CREATE TABLE IF NOT EXISTS course_requests (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        status      VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        reviewed_at TIMESTAMPTZ,
        reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
        UNIQUE(user_id, course_id)
      );

      -- Guardian details
      CREATE TABLE IF NOT EXISTS guardian_enrollments (
        id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id        UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        guardian_name     VARCHAR(255) NOT NULL,
        guardian_phone    VARCHAR(32) NOT NULL,
        preferred_teacher VARCHAR(255) NOT NULL,
        subjects          TEXT[] NOT NULL DEFAULT '{}',
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Lesson completions
      CREATE TABLE IF NOT EXISTS lesson_completions (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, lesson_id)
      );

      -- Assignments
      CREATE TABLE IF NOT EXISTS assignments (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title      VARCHAR(255) NOT NULL,
        due_date   TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE assignments ADD COLUMN IF NOT EXISTS total_marks NUMERIC(8,2) NOT NULL DEFAULT 100 CHECK (total_marks > 0);
      ALTER TABLE assignments ADD COLUMN IF NOT EXISTS passing_score NUMERIC(8,2) NOT NULL DEFAULT 50 CHECK (passing_score >= 0);

      -- Submissions
      CREATE TABLE IF NOT EXISTS submissions (
        id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assignment_id  UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
        user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status         VARCHAR(20) NOT NULL DEFAULT 'pending',
        submitted_at   TIMESTAMPTZ,
        UNIQUE(assignment_id, user_id)
      );
      ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_status_check;
      ALTER TABLE submissions ADD CONSTRAINT submissions_status_check CHECK (status IN ('pending','submitted','under_review','graded','passed','failed','overdue'));
      ALTER TABLE submissions ADD COLUMN IF NOT EXISTS content TEXT;
      ALTER TABLE submissions ADD COLUMN IF NOT EXISTS score NUMERIC(8,2);
      ALTER TABLE submissions ADD COLUMN IF NOT EXISTS feedback TEXT;
      ALTER TABLE submissions ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ;
      ALTER TABLE submissions ADD COLUMN IF NOT EXISTS returned_for_correction BOOLEAN NOT NULL DEFAULT FALSE;

      -- Provider-neutral subscriptions. A payment provider only needs to populate its name and reference.
      CREATE TABLE IF NOT EXISTS subscriptions (
        id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_code          VARCHAR(50) NOT NULL DEFAULT 'premium',
        status             VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','cancelled','expired')),
        provider           VARCHAR(50),
        provider_reference VARCHAR(255) UNIQUE,
        starts_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ends_at            TIMESTAMPTZ NOT NULL,
        created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- JSON scene documents keep lesson boards portable and ready for real-time collaboration.
      CREATE TABLE IF NOT EXISTS lesson_boards (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lesson_id   UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        board_data  JSONB NOT NULL DEFAULT '{"version":1,"elements":[]}'::jsonb,
        is_shared   BOOLEAN NOT NULL DEFAULT FALSE,
        is_locked   BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(lesson_id, owner_id)
      );

      CREATE TABLE IF NOT EXISTS course_completion_settings (
        course_id                    UUID PRIMARY KEY REFERENCES courses(id) ON DELETE CASCADE,
        minimum_lesson_completion    INTEGER NOT NULL DEFAULT 100 CHECK (minimum_lesson_completion BETWEEN 0 AND 100),
        minimum_assignment_percentage NUMERIC(5,2) NOT NULL DEFAULT 50 CHECK (minimum_assignment_percentage BETWEEN 0 AND 100),
        minimum_attendance_percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (minimum_attendance_percentage BETWEEN 0 AND 100)
      );

      CREATE TABLE IF NOT EXISTS live_class_attendance (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
        user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        attended_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(live_class_id, user_id)
      );

      -- Announcements
      CREATE TABLE IF NOT EXISTS announcements (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title      VARCHAR(255) NOT NULL,
        body       TEXT NOT NULL,
        audience   VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (audience IN ('all','students','trainers')),
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Announcement reads
      CREATE TABLE IF NOT EXISTS announcement_reads (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
        user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        read_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(announcement_id, user_id)
      );

      -- Notifications
      CREATE TABLE IF NOT EXISTS notifications (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title      VARCHAR(255) NOT NULL,
        body       TEXT NOT NULL,
        type       VARCHAR(30) NOT NULL DEFAULT 'general' CHECK (type IN ('general','trainer_approval','trainer_status','announcement','course')),
        link       VARCHAR(512),
        is_read    BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Indexes for common query patterns
      CREATE INDEX IF NOT EXISTS idx_enrollments_user_id   ON enrollments(user_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
      CREATE INDEX IF NOT EXISTS idx_course_requests_status ON course_requests(status);
      CREATE INDEX IF NOT EXISTS idx_guardian_enrollments_student_id ON guardian_enrollments(student_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_user_id   ON submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_live_classes_course_id ON live_classes(course_id);
      CREATE INDEX IF NOT EXISTS idx_lessons_module_id     ON lessons(module_id);
      CREATE INDEX IF NOT EXISTS idx_modules_course_id     ON modules(course_id);
      CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status, ends_at);
      CREATE INDEX IF NOT EXISTS idx_lesson_boards_lesson_id ON lesson_boards(lesson_id);

      -- Certificates
      CREATE TABLE IF NOT EXISTS certificates (
        id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id          UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        course_title       VARCHAR(255) NOT NULL,
        student_name       VARCHAR(255) NOT NULL,
        final_percentage   NUMERIC(5,2) NOT NULL,
        letter_grade       VARCHAR(2) NOT NULL,
        certificate_code   VARCHAR(64) UNIQUE NOT NULL,
        issued_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
      CREATE INDEX IF NOT EXISTS idx_certificates_certificate_code ON certificates(certificate_code);
    `);

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrate().catch(() => {
  process.exit(1);
});
