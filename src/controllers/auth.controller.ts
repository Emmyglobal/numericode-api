import type { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { getClient, query } from '../db/pool'
import { signToken } from '../utils/jwt'
import { ok, fail, unauthorized } from '../utils/response'
import { notifyRole } from '../utils/notify'
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/mailer'
import type { UserRow, AuthUser } from '../types'

function toAuthUser(row: UserRow): AuthUser {
  return {
    id: row.id, name: row.name, email: row.email,
    role: row.role, createdAt: row.created_at.toISOString(),
  }
}

/** Simple email format validation */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) return fail(res, 'Email and password required', 400)
    if (!EMAIL_REGEX.test(email)) return fail(res, 'Enter a valid email address', 400)

    const { rows } = await query<UserRow>('SELECT * FROM users WHERE email = $1', [email])
    const user = rows[0]
    if (!user) return unauthorized(res)

    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) return unauthorized(res)

    if (user.status === 'suspended') return unauthorized(res, 'This account has been suspended')
    if (user.status === 'pending') {
      return unauthorized(res, 'Your trainer account is awaiting admin approval. You will be able to log in once approved.')
    }

    await query('UPDATE users SET last_active = NOW() WHERE id = $1', [user.id])

    const token = signToken(user.id, user.role)
    return ok(res, { user: toAuthUser(user), token })
  } catch (err) { next(err) }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role, guardianName, guardianPhone, preferredTeacherId, subjects } = req.body as {
      name?: string; email?: string; password?: string; role?: string; guardianName?: string; guardianPhone?: string
      preferredTeacherId?: string; subjects?: string[]
    }
    if (!name || !email || !password) return fail(res, 'Name, email, and password are required', 400)

    // ── Email validation (compulsory) ──────────────────────────
    if (!EMAIL_REGEX.test(email)) {
      return fail(res, 'Enter a valid email address', 400)
    }

    if (password.length < 8) return fail(res, 'Password must be at least 8 characters', 400)

    // Security: public registration may only create 'student' or 'trainer' accounts.
    // 'admin' is deliberately excluded — even if a request is crafted directly against
    // the API (bypassing the frontend UI entirely), this is the enforcement point that
    // prevents self-service privilege escalation. Admin accounts must be created by an
    // existing admin via PATCH /admin/users/:id, or by the seed script.
    const allowedSelfServiceRoles = ['student', 'trainer']
    const finalRole = allowedSelfServiceRoles.includes(role ?? '') ? role : 'student'
    const hasGuardianDetails = Boolean(guardianName || guardianPhone || preferredTeacherId || subjects?.length)

    if (finalRole === 'student' && hasGuardianDetails) {
      if (!guardianName?.trim() || !guardianPhone?.trim() || !preferredTeacherId?.trim()) {
        return fail(res, 'Parent or guardian details are required for student enrolment', 400)
      }
      if (!Array.isArray(subjects) || subjects.length === 0 || subjects.some(subject => !['mathematics', 'programming'].includes(subject))) {
        return fail(res, 'Select at least one valid subject', 400)
      }
    }

    // Trainers require admin approval before they can log in. Students are active immediately.
    const initialStatus = finalRole === 'trainer' ? 'pending' : 'active'

    const { rows: existing } = await query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.length > 0) return fail(res, 'An account with this email already exists', 409)

    const passwordHash = await bcrypt.hash(password, 10)
    const client = await getClient()
    let user: UserRow
    try {
      await client.query('BEGIN')
      const { rows } = await client.query<UserRow>(
        `INSERT INTO users (name, email, password_hash, role, status)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, passwordHash, finalRole, initialStatus]
      )
      user = rows[0]

      if (finalRole === 'student' && hasGuardianDetails) {
        const useAutomaticMatching = preferredTeacherId === 'auto'
        const { rows: teachers } = useAutomaticMatching
          ? await client.query<{ name: string; subjects: string[] }>(
              `SELECT 'Automatic matching' AS name, $1::text[] AS subjects`,
              [subjects]
            )
          : await client.query<{ name: string; subjects: string[] }>(
              `SELECT u.name, ARRAY_AGG(DISTINCT c.subject ORDER BY c.subject) AS subjects FROM users u
               INNER JOIN courses c ON c.instructor_id = u.id
               WHERE u.id = $1 AND u.status = 'active' AND c.status = 'published'
               GROUP BY u.name`,
              [preferredTeacherId]
            )
        if (!teachers[0] || subjects!.some(subject => !teachers[0].subjects.includes(subject))) {
          await client.query('ROLLBACK')
          return fail(res, 'The selected teacher does not teach every chosen subject', 400)
        }

        await client.query(
          `INSERT INTO guardian_enrollments (student_id, guardian_name, guardian_phone, preferred_teacher, subjects)
           VALUES ($1, $2, $3, $4, $5)`,
          [user.id, guardianName!.trim(), guardianPhone!.trim(), teachers[0].name, subjects]
        )
        const enrollmentQuery = useAutomaticMatching
          ? `INSERT INTO enrollments (user_id, course_id)
             SELECT $1, id FROM (
               SELECT DISTINCT ON (subject) id FROM courses
               WHERE status = 'published' AND subject = ANY($2::text[])
               ORDER BY subject, created_at ASC
             ) AS matched_courses
             ON CONFLICT (user_id, course_id) DO NOTHING`
          : `INSERT INTO enrollments (user_id, course_id)
             SELECT $1, id FROM (
               SELECT DISTINCT ON (subject) id FROM courses
               WHERE status = 'published' AND instructor_id = $2 AND subject = ANY($3::text[])
               ORDER BY subject, created_at ASC
             ) AS matched_courses
             ON CONFLICT (user_id, course_id) DO NOTHING`
        await client.query(enrollmentQuery, useAutomaticMatching ? [user.id, subjects] : [user.id, preferredTeacherId, subjects])
      }
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }

    if (finalRole === 'trainer') {
      // Notify every admin so approval isn't missed. Do not block the response on this.
      await notifyRole(
        'admin',
        'New trainer awaiting approval',
        `${user.name} (${user.email}) registered as a trainer and needs approval before they can log in.`,
        'trainer_approval',
        '/admin/users'
      ).catch(() => {})
      // Trainer is pending — do not issue a login token yet.
      return ok(res, { pendingApproval: true, message: 'Your trainer account has been created and is awaiting admin approval.' }, 201)
    }

    // ── Send welcome email (do not block response) ─────────────
    sendWelcomeEmail({ name: user.name, email: user.email, role: user.role }).catch(() => {})

    const token = signToken(user.id, user.role)
    return ok(res, { user: toAuthUser(user), token }, 201)
  } catch (err) { next(err) }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body as { email?: string }
    if (!email) return fail(res, 'Email is required', 400)

    // Always return the same response whether the email exists or not (security best practice)
    const { rows } = await query<UserRow>('SELECT id, name, email FROM users WHERE email = $1', [email])

    if (rows.length > 0) {
      const user = rows[0]

      // Generate a secure random token
      const resetToken = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // Invalidate any previous reset tokens for this user
      await query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, tokenHash, expiresAt]
      )

      // Send email (non-blocking)
      sendPasswordResetEmail(user.email, user.name, resetToken).catch(() => {})
    }

    return ok(res, { message: 'If an account with that email exists, a password reset link has been sent.' }, 200)
  } catch (err) { next(err) }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body as { token?: string; password?: string }

    if (!token || !password) {
      return fail(res, 'Token and new password are required', 400)
    }

    if (password.length < 8) {
      return fail(res, 'Password must be at least 8 characters', 400)
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const { rows } = await query<{ user_id: string; expires_at: Date; used: boolean }>(
      `SELECT user_id, expires_at, used FROM password_reset_tokens
       WHERE token = $1 AND used = FALSE AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [tokenHash]
    )

    if (rows.length === 0) {
      return fail(res, 'Invalid or expired reset token', 400)
    }

    const resetRecord = rows[0]

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10)

    // Update password and mark token as used in a transaction
    const client = await getClient()
    try {
      await client.query('BEGIN')

      await client.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [passwordHash, resetRecord.user_id]
      )

      await client.query(
        'UPDATE password_reset_tokens SET used = TRUE WHERE token = $1',
        [tokenHash]
      )

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }

    return ok(res, { message: 'Password has been reset successfully. You can now log in with your new password.' }, 200)
  } catch (err) { next(err) }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string }

    if (!currentPassword || !newPassword) {
      return fail(res, 'Current password and new password are required', 400)
    }

    if (newPassword.length < 8) {
      return fail(res, 'New password must be at least 8 characters', 400)
    }

    if (!req.user?.userId) {
      return unauthorized(res)
    }

    // Verify current password
    const { rows } = await query<UserRow>(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.userId]
    )

    if (rows.length === 0) {
      return unauthorized(res)
    }

    const validPassword = await bcrypt.compare(currentPassword, rows[0].password_hash)
    if (!validPassword) {
      return fail(res, 'Current password is incorrect', 400)
    }

    // Hash and update
    const passwordHash = await bcrypt.hash(newPassword, 10)
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, req.user.userId])

    return ok(res, { message: 'Password changed successfully' }, 200)
  } catch (err) { next(err) }
}