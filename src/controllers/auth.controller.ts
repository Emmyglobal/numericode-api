import type { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { getClient, query } from '../db/pool'
import { signToken } from '../utils/jwt'
import { ok, fail, unauthorized } from '../utils/response'
import { notifyRole } from '../utils/notify'
import type { UserRow, AuthUser } from '../types'

function toAuthUser(row: UserRow): AuthUser {
  return {
    id: row.id, name: row.name, email: row.email,
    role: row.role, createdAt: row.created_at.toISOString(),
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) return fail(res, 'Email and password required', 400)

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
      )
      // Trainer is pending — do not issue a login token yet.
      return ok(res, { pendingApproval: true, message: 'Your trainer account has been created and is awaiting admin approval.' }, 201)
    }

    const token = signToken(user.id, user.role)
    return ok(res, { user: toAuthUser(user), token }, 201)
  } catch (err) { next(err) }
}

export async function forgotPassword(_req: Request, res: Response, next: NextFunction) {
  try {
    // Always return success regardless of whether the email exists (security best practice)
    return ok(res, null, 200)
  } catch (err) { next(err) }
}
