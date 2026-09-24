import crypto from 'crypto'
import { query } from '../db/pool'

// ─── Email verification tokens ────────────────────────────────────────────────
// Verification links reuse the activation_tokens table (hashed at rest,
// single-use, expiring) because both flows answer the same question: "can this
// person read the mailbox they registered with?" Clicking either link sets
// users.account_activated (the login gate) and users.email_verified_at (audit).

/** A verification link emailed at registration is valid for 24 hours. */
export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000
/** Approval links (sent when an admin approves) stay valid for 7 days, as before. */
export const APPROVAL_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** SHA-256 hex of the raw token — only the hash is ever stored. */
export function hashVerificationToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

/**
 * Issues a fresh single-use verification token for a user and returns the RAW
 * token (the only moment it exists in plaintext — it is emailed immediately).
 * Previous tokens are deliberately NOT invalidated: a user may open the
 * registration email after the approval email arrived, so every unexpired,
 * unused link keeps working (each is single-use regardless).
 */
export async function issueVerificationToken(
  userId: string,
  ttlMs: number = VERIFICATION_TOKEN_TTL_MS
): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString('hex')
  await query(
    'INSERT INTO activation_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, hashVerificationToken(rawToken), new Date(Date.now() + ttlMs)]
  )
  return rawToken
}
