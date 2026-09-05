import type { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { google } from 'googleapis'
import { getClient, query } from '../db/pool'
import { signToken } from '../utils/jwt'
import { ok, fail, unauthorized } from '../utils/response'
import { notifyRole } from '../utils/notify'
import { sendPasswordResetEmail, sendAdminApprovalEmail } from '../utils/mailer'
import type { UserRow, AuthUser } from '../types'

function toAuthUser(row: UserRow): AuthUser {
  return {
    id: row.id, name: row.name, email: row.email,
    role: row.role, createdAt: row.created_at.toISOString(),
  }
}

/** Comprehensive email validation — rejects consecutive dots, leading/trailing dots, and missing TLD */
const EMAIL_REGEX = /^(?!.*\.\.)(?!\.)[^\s@]+(?<!\.)@(?!\.)[^\s@]+(?<!\.)\.[a-zA-Z]{2,}$/

// Disposable email domains (partial list - expand as needed)
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
  'throwaway.email', 'fakeinbox.com', 'temp-mail.org', 'dispostable.com'
]

// Policy version identifiers. Bump a version here when the corresponding legal
// document changes so the audit trail can show which version each user accepted,
// and so a future re-acceptance flow can target users whose accepted version is
// behind the current one.
const POLICY_VERSIONS = {
  terms: '1.0',
  privacy: '1.0',
  acceptable_use: '1.0',
} as const

function validatePolicyAcceptance(body: Record<string, unknown>): string | null {
  const terms = body.termsAccepted
  const privacy = body.privacyPolicyAcknowledged
  const acceptableUse = body.acceptableUseAccepted
  if (terms !== true) return 'You must accept the Terms of Service before creating an account.'
  if (privacy !== true) return 'You must acknowledge the Privacy Policy before creating an account.'
  if (acceptableUse !== true) return 'You must agree to follow the Acceptable Use Policy before creating an account.'
  return null
}

function validateEmail(email: string): { valid: boolean; reason?: string } {
  // Basic format check
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, reason: 'Invalid email format' }
  }

  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) {
    return { valid: false, reason: 'Invalid email domain' }
  }

  // Check for disposable email
  if (DISPOSABLE_EMAIL_DOMAINS.some(d => domain.includes(d))) {
    return { valid: false, reason: 'Disposable email addresses are not allowed' }
  }

  // Check for common typos in popular domains
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
  const typoDomains: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'hotmal.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outloo.com': 'outlook.com',
  }

  if (typoDomains[domain]) {
    return { valid: false, reason: `Did you mean ${typoDomains[domain]}?` }
  }

  return { valid: true }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) return fail(res, 'Email and password required', 400)
    const normalizedEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(normalizedEmail)) return fail(res, 'Enter a valid email address', 400)

    const { rows } = await query<UserRow>('SELECT * FROM users WHERE email = $1', [normalizedEmail])
    const user = rows[0]
    if (!user) return unauthorized(res)

    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) return unauthorized(res)

    if (user.status === 'suspended') return unauthorized(res, 'This account has been suspended')
    if (user.status === 'pending') {
      return unauthorized(res, 'Your account is awaiting admin approval. You will receive an email once your account is approved.')
    }
    if (user.status === 'active' && !user.account_activated) {
      return unauthorized(res, 'Your account has been approved but not yet activated. Please check your email for the activation link.')
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
    const normalizedEmail = email.trim().toLowerCase()

    // ── Email validation (compulsory) ──────────────────────────
    const emailValidation = validateEmail(normalizedEmail)
    if (!emailValidation.valid) {
      return fail(res, emailValidation.reason || 'Invalid email address', 400)
    }

    if (password.length < 8) return fail(res, 'Password must be at least 8 characters', 400)

    // Policy acceptance is REQUIRED for any self-service registration. This is
    // enforced on the backend, not just the UI — the account is not created
    // unless all three required policies have been explicitly accepted.
    const acceptanceError = validatePolicyAcceptance(req.body as Record<string, unknown>)
    if (acceptanceError) return fail(res, acceptanceError, 400)

    // Security: public registration may only create 'student' or 'trainer' accounts.
    // 'admin' is deliberately excluded — even if a request is crafted directly against
    // the API (bypassing the frontend UI entirely), this is the enforcement point that
    // prevents self-service privilege escalation. Admin accounts must be created by an
    // existing admin via PATCH /admin/users/:id, or by the seed scripts.
    const allowedSelfServiceRoles = ['student', 'trainer']
    const finalRole: string = allowedSelfServiceRoles.includes(role ?? '') ? role! : 'student'
    const hasGuardianDetails = Boolean(guardianName || guardianPhone || preferredTeacherId || subjects?.length)

    if (finalRole === 'student' && hasGuardianDetails) {
      if (!guardianName?.trim() || !guardianPhone?.trim() || !preferredTeacherId?.trim()) {
        return fail(res, 'Parent or guardian details are required for student enrolment', 400)
      }
      if (!Array.isArray(subjects) || subjects.length === 0 || subjects.some(subject => !['mathematics', 'programming'].includes(subject))) {
        return fail(res, 'Select at least one valid subject', 400)
      }
    }

    // All new users require admin approval before they can access the dashboard
    // This ensures proper verification and prevents spam accounts
    const initialStatus = 'pending'

    const { rows: existing } = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail])
    if (existing.length > 0) return fail(res, 'An account with this email already exists', 409)

    const passwordHash = await bcrypt.hash(password, 10)
    const client = await getClient()
    let user: UserRow
    try {
      await client.query('BEGIN')
      const { rows } = await client.query<UserRow>(
        `INSERT INTO users (name, email, password_hash, role, status)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, normalizedEmail, passwordHash, finalRole, initialStatus]
      )
      user = rows[0]

      // Record explicit, auditable acceptance of each required policy (with the
      // accepted version + timestamp), in the SAME transaction as the user so a
      // failed acceptance insert never leaves an account without consent trail.
      await client.query(
        `INSERT INTO user_policy_acceptances (user_id, policy_type, policy_version) VALUES
           ($1, 'terms', $2),
           ($1, 'privacy', $3),
           ($1, 'acceptable_use', $4)
         ON CONFLICT (user_id, policy_type) DO NOTHING`,
        [user.id, POLICY_VERSIONS.terms, POLICY_VERSIONS.privacy, POLICY_VERSIONS.acceptable_use]
      )

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

    // Notify admins about new user registration
    await notifyRole(
      'admin',
      finalRole === 'trainer' ? 'New trainer awaiting approval' : 'New user awaiting approval',
      finalRole === 'trainer'
        ? `${user.name} (${user.email}) registered as a trainer and is awaiting admin approval.`
        : `${user.name} (${user.email}) registered as a ${finalRole} and needs approval before they can access the platform.`,
      finalRole === 'trainer' ? 'trainer_approval' : 'announcement',
      '/admin/users'
    ).catch(() => {})

    await sendAdminApprovalEmail({
      adminEmail: 'nwaforugochukwu21@gmail.com',
      userName: user.name,
      userEmail: user.email ?? '',
      role: finalRole,
    }).catch(() => {})

    // User is pending — do not issue a login token yet
    return ok(res, { 
      pendingApproval: true, 
      message: 'Your account has been created and is awaiting admin approval. You will receive an email once approved.' 
    }, 201)

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

export async function activateAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body as { token?: string }
    if (!token) return fail(res, 'Activation token is required', 400)

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const { rows: tokenRows } = await query<{ user_id: string; expires_at: Date; used: boolean }>(
      `SELECT user_id, expires_at, used FROM activation_tokens
       WHERE token = $1 AND used = FALSE AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [tokenHash]
    )

    if (tokenRows.length === 0) {
      return fail(res, 'Invalid or expired activation token', 400)
    }

    const activationRecord = tokenRows[0]

    const client = await getClient()
    try {
      await client.query('BEGIN')

      // Set account_activated = true
      await client.query(
        'UPDATE users SET account_activated = TRUE WHERE id = $1',
        [activationRecord.user_id]
      )

      // Mark token as used
      await client.query(
        'UPDATE activation_tokens SET used = TRUE WHERE token = $1',
        [tokenHash]
      )

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }

    return ok(res, { message: 'Account activated successfully. You can now log in.' }, 200)
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

// ─── Google OAuth ──────────────────────────────────────────────────────────────

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

function getOAuth2Client() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error('Google OAuth environment variables are not configured')
  }
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
}

/**
 * Returns the Google OAuth consent URL.
 * The frontend redirects the browser to this URL to start the OAuth flow.
 */
export async function getGoogleAuthUrl(_req: Request, res: Response, next: NextFunction) {
  try {
    const oauth2Client = getOAuth2Client()
    const url = oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: ['profile', 'email'],
    })
    return ok(res, { url })
  } catch (err) { next(err) }
}

/**
 * Google OAuth callback handler.
 * Exchanges the authorization code for tokens, retrieves user info,
 * creates or links the user, and redirects to the frontend with a JWT.
 */
export async function googleCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.query as { code?: string }
    if (!code) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=google_no_code`)
    }

    const oauth2Client = getOAuth2Client()

    // Exchange the authorization code for access tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Retrieve the user's profile from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: profile } = await oauth2.userinfo.get()

    const googleId = profile.id
    const email = profile.email

    if (!email) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=google_no_email`)
    }

    const name = profile.name || email.split('@')[0]
    const avatarUrl = profile.picture || null

    // ── Find or create the user ──────────────────────────────────────────
    let user: UserRow

    // 1. Try to find by Google ID
    const { rows: byGoogleId } = await query<UserRow>(
      'SELECT * FROM users WHERE google_id = $1',
      [googleId]
    )
    if (byGoogleId.length > 0) {
      user = byGoogleId[0]
    } else {
      // 2. Try to find by email (link Google ID to existing account)
      const { rows: byEmail } = await query<UserRow>('SELECT * FROM users WHERE email = $1', [email])
      if (byEmail.length > 0) {
        user = byEmail[0]
        await query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id])
      } else {
        // 3. Create a new user — auto-approved since Google is a trusted IdP
        const placeholderHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10)
        const { rows: newRows } = await query<UserRow>(
          `INSERT INTO users (name, email, password_hash, role, status, account_activated, avatar_url, google_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [name, email, placeholderHash, 'student', 'active', true, avatarUrl, googleId]
        )
        user = newRows[0]

        // Notify admins about the new Google sign-up
        await notifyRole(
          'admin',
          'New Google sign-up',
          `${user.name} (${user.email}) signed up via Google and was auto-approved.`,
          'announcement',
          '/admin/users'
        ).catch(() => {})
      }
    }

    // Update last active timestamp
    await query('UPDATE users SET last_active = NOW() WHERE id = $1', [user.id])

    // Generate JWT and redirect to the frontend callback route
    const token = signToken(user.id, user.role)
    const redirectUrl = new URL(`${process.env.CLIENT_URL}/auth/google/callback`)
    redirectUrl.searchParams.set('token', token)
    return res.redirect(redirectUrl.toString())
  } catch (err) {
    console.error('Google OAuth callback error:', err)
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`)
  }
}

/**
 * Returns the currently authenticated user.
 * Used by the frontend callback page to fetch the full user profile
 * after storing the JWT received from the Google OAuth redirect.
 */
export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) return unauthorized(res)
    const { rows } = await query<UserRow>('SELECT * FROM users WHERE id = $1', [req.user.userId])
    if (rows.length === 0) return unauthorized(res)
    return ok(res, { user: toAuthUser(rows[0]) })
  } catch (err) { next(err) }
}
