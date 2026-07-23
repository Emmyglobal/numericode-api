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
      ALTER TABLE users ADD COLUMN IF NOT EXISTS account_activated BOOLEAN NOT NULL DEFAULT FALSE;

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

      -- Course notes (for trainers/admins to add notes/content to courses)
      CREATE TABLE IF NOT EXISTS course_notes (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        lesson_id  UUID REFERENCES lessons(id) ON DELETE CASCADE,
        title      VARCHAR(255) NOT NULL,
        content    TEXT NOT NULL DEFAULT '',
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_course_notes_course_id ON course_notes(course_id);
      CREATE INDEX IF NOT EXISTS idx_course_notes_lesson_id ON course_notes(lesson_id);

      -- Account activation tokens (sent when admin approves a user)
      CREATE TABLE IF NOT EXISTS activation_tokens (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token      VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used       BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_activation_tokens_token ON activation_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_activation_tokens_user_id ON activation_tokens(user_id);

      -- Password reset tokens
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token      VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used       BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

      -- ─── Phase 1: Essential Features ─────────────────────────────────────

      -- 1. Quiz & Assessment System
      CREATE TABLE IF NOT EXISTS quizzes (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        module_id   UUID REFERENCES modules(id) ON DELETE SET NULL,
        lesson_id   UUID REFERENCES lessons(id) ON DELETE SET NULL,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        time_limit  INTEGER, -- minutes, NULL means no time limit
        passing_score NUMERIC(5,2) NOT NULL DEFAULT 70,
        max_attempts INTEGER DEFAULT 1,
        shuffle_questions BOOLEAN NOT NULL DEFAULT FALSE,
        show_results BOOLEAN NOT NULL DEFAULT TRUE,
        created_by  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON quizzes(course_id);
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL;
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE SET NULL;

      -- Quiz Questions
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quiz_id       UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'essay', 'fill_blank')),
        options       JSONB, -- For multiple choice: [{id, text, isCorrect}]
        correct_answer TEXT, -- For fill_blank or true_false
        points        NUMERIC(5,2) NOT NULL DEFAULT 1,
        position      INTEGER NOT NULL DEFAULT 0,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

      -- Quiz Attempts
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quiz_id       UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at  TIMESTAMPTZ,
        score         NUMERIC(5,2),
        passed        BOOLEAN,
        answers       JSONB, -- Store user answers
        UNIQUE(quiz_id, user_id, started_at)
      );
      CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_user ON quiz_attempts(quiz_id, user_id);

      -- 2. Discussion Forums
      CREATE TABLE IF NOT EXISTS forum_categories (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
        name        VARCHAR(255) NOT NULL,
        description TEXT,
        position    INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_forum_categories_course_id ON forum_categories(course_id);

      CREATE TABLE IF NOT EXISTS forum_threads (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id   UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
        user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title         VARCHAR(255) NOT NULL,
        body          TEXT NOT NULL,
        is_pinned     BOOLEAN NOT NULL DEFAULT FALSE,
        is_locked     BOOLEAN NOT NULL DEFAULT FALSE,
        view_count    INTEGER NOT NULL DEFAULT 0,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_forum_threads_category_id ON forum_threads(category_id);

      CREATE TABLE IF NOT EXISTS forum_posts (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        thread_id     UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
        user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body          TEXT NOT NULL,
        is_solution   BOOLEAN NOT NULL DEFAULT FALSE,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_forum_posts_thread_id ON forum_posts(thread_id);

      -- 3. Enhanced Grading Rubrics
      CREATE TABLE IF NOT EXISTS grading_rubrics (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
        criteria_name VARCHAR(255) NOT NULL,
        description   TEXT,
        max_score     NUMERIC(5,2) NOT NULL,
        position      INTEGER NOT NULL DEFAULT 0,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_grading_rubrics_assignment_id ON grading_rubrics(assignment_id);

      CREATE TABLE IF NOT EXISTS rubric_scores (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rubric_id       UUID NOT NULL REFERENCES grading_rubrics(id) ON DELETE CASCADE,
        submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        score           NUMERIC(5,2) NOT NULL,
        feedback        TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(rubric_id, submission_id)
      );

      -- 4. Enhanced Notifications
      CREATE TABLE IF NOT EXISTS notification_preferences (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        email_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
        push_enabled    BOOLEAN NOT NULL DEFAULT FALSE,
        digest_frequency VARCHAR(20) NOT NULL DEFAULT 'instant' CHECK (digest_frequency IN ('instant', 'daily', 'weekly', 'never')),
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id)
      );
      CREATE INDEX IF NOT EXISTS idx_notification_prefs_user_id ON notification_preferences(user_id);

      -- Grade Categories for weighted grading
      CREATE TABLE IF NOT EXISTS grade_categories (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        name          VARCHAR(255) NOT NULL,
        weight        NUMERIC(5,2) NOT NULL, -- percentage
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(course_id, name)
      );
      CREATE INDEX IF NOT EXISTS idx_grade_categories_course_id ON grade_categories(course_id);

      -- ─── Phase 2: Medium Priority Features ─────────────────────────────────

      -- 5. Learning Analytics
      CREATE TABLE IF NOT EXISTS learning_analytics (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        lesson_id       UUID REFERENCES lessons(id) ON DELETE SET NULL,
        time_spent      INTEGER NOT NULL DEFAULT 0, -- seconds
        interactions    INTEGER NOT NULL DEFAULT 0,
        last_accessed   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, course_id, lesson_id)
      );
      CREATE INDEX IF NOT EXISTS idx_learning_analytics_user_course ON learning_analytics(user_id, course_id);

      -- 6. Content Management - Drip Content
      CREATE TABLE IF NOT EXISTS drip_content_schedule (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        module_id     UUID REFERENCES modules(id) ON DELETE CASCADE,
        lesson_id     UUID REFERENCES lessons(id) ON DELETE CASCADE,
        release_date  TIMESTAMPTZ NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(course_id, module_id, lesson_id)
      );

      -- Course Prerequisites
      CREATE TABLE IF NOT EXISTS course_prerequisites (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        prerequisite_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(course_id, prerequisite_id)
      );

      -- Content Versioning
      CREATE TABLE IF NOT EXISTS content_versions (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        module_id     UUID REFERENCES modules(id) ON DELETE CASCADE,
        lesson_id     UUID REFERENCES lessons(id) ON DELETE CASCADE,
        version       INTEGER NOT NULL DEFAULT 1,
        content       JSONB NOT NULL,
        change_notes  TEXT,
        created_by    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_content_versions_course_id ON content_versions(course_id);

      -- 7. Communication Tools - Direct Messages
      CREATE TABLE IF NOT EXISTS messages (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject       VARCHAR(255),
        body          TEXT NOT NULL,
        is_read       BOOLEAN NOT NULL DEFAULT FALSE,
        read_at       TIMESTAMPTZ,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
      CREATE INDEX IF NOT EXISTS idx_messages_receiver_read ON messages(receiver_id, is_read);

      -- Group Messages
      CREATE TABLE IF NOT EXISTS group_conversations (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id     UUID REFERENCES courses(id) ON DELETE CASCADE,
        title         VARCHAR(255) NOT NULL,
        created_by    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_group_conversations_course_id ON group_conversations(course_id);

      CREATE TABLE IF NOT EXISTS group_conversation_members (
        id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id   UUID NOT NULL REFERENCES group_conversations(id) ON DELETE CASCADE,
        user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        joined_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(conversation_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS group_messages (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES group_conversations(id) ON DELETE CASCADE,
        sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body            TEXT NOT NULL,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_group_messages_conversation_id ON group_messages(conversation_id);

      -- 8. Certificate & Badge System
      CREATE TABLE IF NOT EXISTS badges (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name          VARCHAR(255) NOT NULL,
        description   TEXT NOT NULL,
        icon_url      VARCHAR(512),
        criteria      JSONB NOT NULL, -- { type: 'course_completion', value: 100 }
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_badges (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_id      UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
        course_id     UUID REFERENCES courses(id) ON DELETE CASCADE,
        earned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, badge_id, course_id)
      );
      CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

      -- Certificate Templates
      CREATE TABLE IF NOT EXISTS certificate_templates (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name          VARCHAR(255) NOT NULL,
        html_template TEXT NOT NULL,
        css_styles    TEXT,
        is_default    BOOLEAN NOT NULL DEFAULT FALSE,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Late Submission Penalties
      CREATE TABLE IF NOT EXISTS late_submission_penalties (
        id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assignment_id     UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
        penalty_per_hour  NUMERIC(5,2) NOT NULL DEFAULT 1, -- percentage deduction per hour
        max_penalty       NUMERIC(5,2) NOT NULL DEFAULT 100, -- maximum percentage deduction
        grace_period      INTEGER NOT NULL DEFAULT 0, -- minutes
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(assignment_id)
      );
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