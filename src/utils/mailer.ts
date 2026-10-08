import { Resend } from 'resend'

// ─── Resend email provider (replaces SendGrid) ──────────────────────────────
// Sending: Resend Node SDK (`resend` package, RESEND_API_KEY).
// Receiving (delivery status): Resend webhooks (Svix-signed) →
//   POST /api/webhooks/resend — see controllers/email-webhook.controller.ts.
//   Events persisted to `email_events` (migrate.ts) for reporting/retention.
//
// Setup:
//   1. Create key: https://resend.com/api-keys → RESEND_API_KEY=re_…
//   2. Verify domain: https://resend.com/domains (add SPF/DKIM DNS records).
//      EMAIL_FROM must be on that verified domain.
//   3. Create webhook: https://resend.com/webhooks → URL
//      https://<your-api-domain>/api/webhooks/resend, events:
//      email.sent, email.delivered, email.delivery_delayed, email.bounced,
//      email.complained (+ email.opened / email.clicked optional).
//      Copy the Signing Secret → RESEND_WEBHOOK_SECRET.
//   4. Test mode: without RESEND_API_KEY, sends are skipped with a warning
//      (same fire-and-forget behaviour the SendGrid version had — API never
//      fails because email failed). Tests mock `../utils/mailer` so no real
//      email is ever sent from the suite.
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

function warnNoKey(fn: string) {
  console.warn(`[mailer] RESEND_API_KEY is not set — skipping ${fn} (email not sent)`)
}

// Sender configuration -----------------------------------------------------
// CRITICAL - To avoid spam, EMAIL_FROM must be on a domain verified in your
// Resend account (https://resend.com/domains — adds SPF/DKIM DNS records).
// Using unverified domains causes SPF/DKIM failures, and receiving mail
// servers reject or spam the email.
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@numerycode.com'
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'NumeryCode'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'nwaforugochukwu21@gmail.com'
const CURRENT_YEAR = new Date().getFullYear()

interface ContactMailInput {
  name: string
  email: string
  subject: string
  message: string
}

interface WelcomeMailInput {
  name: string
  email: string
  role: string
}

interface MailBaseInput {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
  unsubscribeLink?: string
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function plainTextFooter(): string {
  return (
    '\n\n---\n' +
    'NumeryCode - https://www.numerycode.com\n' +
    'This is an automated message from the NumeryCode learning platform. Please do not reply directly to this email.'
  )
}

function htmlFooter(): string {
  return `
    <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      <tr>
        <td style="text-align:center; font-size:12px; color:#9ca3af; line-height:1.5;">
          <p style="margin:0;">NumeryCode &mdash; <a href="https://www.numerycode.com" style="color:#2563EB; text-decoration:none;">www.numerycode.com</a></p>
          <p style="margin:4px 0 0;">This is an automated message from the NumeryCode learning platform.</p>
          <p style="margin:4px 0 0;">&copy; ${CURRENT_YEAR} NumeryCode. All rights reserved.</p>
        </td>
      </tr>
    </table>`
}

function buildHtml(heroTitle: string, bodyHtml: string): string {
  return `
    <div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width:560px; margin:0 auto;">
      <div style="background:linear-gradient(135deg, #1E3A5F, #2563EB); padding:32px; border-radius:12px 12px 0 0; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:700;">${escapeHtml(heroTitle)}</h1>
      </div>
      <div style="background:#ffffff; padding:32px; border-radius:0 0 12px 12px; border:1px solid #e5e7eb; border-top:none;">
        ${bodyHtml}
        ${htmlFooter()}
      </div>
    </div>`
}

function ctaButton(href: string, label: string): string {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:24px auto;">
      <tr>
        <td style="background:#2563EB; border-radius:8px; text-align:center; padding:0;">
          <a href="${href}"
             style="display:inline-block; color:#ffffff; padding:12px 36px; border-radius:8px; text-decoration:none; font-size:16px; font-weight:600; letter-spacing:0.3px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`
}

async function sendMail(input: MailBaseInput): Promise<string | null> {
  const resend = getResend()
  if (!resend) {
    warnNoKey(`sendMail to ${input.to} (${input.subject})`)
    return null
  }
  const { data, error } = await resend.emails.send({
    from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text + plainTextFooter(),
    ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    ...(input.unsubscribeLink
      ? {
          headers: {
            'List-Unsubscribe': `<${input.unsubscribeLink}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }
      : {}),
    // Tag every outbound message so delivery/bounce webhooks can be joined
    // back to the send in the `email_events` table.
    tags: [{ name: 'app', value: 'numerycode' }],
  })
  if (error) {
    // Throw so callers log per-template (preserves old SendGrid log shape,
    // minus the provider name). Resend error: { name, message }.
    throw new Error(`Resend send failed: ${error.name}: ${error.message}`)
  }
  return data?.id ?? null
}

export async function sendEmail(input: { to: string; subject: string; html: string; text?: string }) {
  try {
    await sendMail({
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text || input.html.replace(/<[^>]+>/g, ' ').trim().slice(0, 500),
    })
  } catch (err) {
    console.error('Resend sendEmail failed:', err)
  }
}

/**
 * Notifies a student by email that a trainer has sent them a message.
 * Triggers from messaging.controller sendMessage when a trainer writes to a
 * student. Fire-and-forget: any Resend failure is logged, never fails the
 * API request or the message insert.
 */
export async function sendTrainerMessageEmail(input: {
  to: string
  studentName: string
  trainerName: string
  messageSubject?: string | null
  body: string
}) {
  const { to, studentName, trainerName, messageSubject, body } = input
  const inboxLink = `${CLIENT_URL}/dashboard/messages`

  try {
    await sendMail({
      to,
      subject: messageSubject
        ? `New message from ${trainerName}: ${messageSubject}`
        : `New message from ${trainerName}`,
      html: buildHtml('New Message From Your Trainer', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(studentName)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          <strong>${escapeHtml(trainerName)}</strong> has sent you a message in NumeryCode.
        </p>
        ${messageSubject ? `<p style="font-size:16px; color:#374151; line-height:1.6;"><strong>Subject:</strong> ${escapeHtml(messageSubject)}</p>` : ''}
        <div style="background:#f5f7f9; border:1px solid #e5e7eb; border-left:4px solid #2563EB; border-radius:8px; padding:16px; margin:16px 0;">
          <p style="margin:0; font-size:15px; color:#374151; line-height:1.6; white-space:pre-wrap;">${escapeHtml(body)}</p>
        </div>
        ${ctaButton(inboxLink, 'Open Messages')}
        <p style="font-size:14px; color:#6b7280;">
          Or copy and paste this link into your browser:<br />
          <a href="${inboxLink}" style="color:#2563EB; word-break:break-all; font-size:13px;">${inboxLink}</a>
        </p>`),
      text:
        `Hi ${studentName},\n\n` +
        `${trainerName} has sent you a message on NumeryCode.` +
        (messageSubject ? `\n\nSubject: ${messageSubject}` : '') +
        `\n\n${body}\n\n` +
        `Open your messages: ${inboxLink}`,
    })
  } catch (err) {
    console.error('Resend sendTrainerMessageEmail failed:', err)
  }
}

export async function sendContactEmail(input: ContactMailInput) {
  try {
    await sendMail({
      to: CONTACT_EMAIL_TO,
      replyTo: input.email,
      subject: `[NumeryCode Contact] ${input.subject}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
      html: buildHtml('New Contact Form Submission', `
        <table cellpadding="0" cellspacing="0" style="width:100%; font-size:15px; color:#374151; line-height:1.6;">
          <tr><td style="padding:4px 0;"><strong>Name:</strong> ${escapeHtml(input.name)}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Email:</strong> ${escapeHtml(input.email)}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Subject:</strong> ${escapeHtml(input.subject)}</td></tr>
          <tr><td style="padding:8px 0 4px;"><strong>Message:</strong></td></tr>
          <tr><td style="background:#F7F8FA; padding:12px; border-radius:6px; white-space:pre-wrap; font-size:14px;">${escapeHtml(input.message)}</td></tr>
        </table>`),
    })
  } catch (err) {
    console.error('Resend sendContactEmail failed:', err)
  }
}

export async function sendWelcomeEmail(input: WelcomeMailInput) {
  const dashboardLink = input.role === 'trainer'
    ? `${CLIENT_URL}/trainer`
    : `${CLIENT_URL}/dashboard`

  try {
    await sendMail({
      to: input.email,
      subject: `Welcome to NumeryCode, ${input.name}!`,
      html: buildHtml('Welcome to NumeryCode!', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(input.name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Your <strong>${escapeHtml(input.role)}</strong> account has been created successfully.
          You're now part of the NumeryCode learning community!
        </p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Start exploring courses, attending live classes, and tracking your progress.
        </p>
        ${ctaButton(dashboardLink, 'Go to Dashboard')}
        <p style="font-size:14px; color:#6b7280;">If you have any questions, just reply to this email.</p>`),
      text:
        `Hi ${input.name},\n\n` +
        `Your ${input.role} account has been created successfully. ` +
        `You're now part of the NumeryCode learning community!\n\n` +
        `Go to your dashboard: ${dashboardLink}`,
    })
  } catch (err) {
    console.error('Resend sendWelcomeEmail failed:', err)
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`

  try {
    await sendMail({
      to: email,
      subject: 'Reset your NumeryCode password',
      html: buildHtml('Password Reset', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          We received a request to reset your NumeryCode password.
          Click the button below to set a new password:
        </p>
        ${ctaButton(resetLink, 'Reset Password')}
        <p style="font-size:14px; color:#6b7280;">
          This link will expire in <strong>1 hour</strong>.
          If you didn't request a password reset, you can safely ignore this email.
        </p>`),
      text:
        `Hi ${name},\n\n` +
        `We received a request to reset your NumeryCode password.\n\n` +
        `Reset your password: ${resetLink}\n\n` +
        `This link will expire in 1 hour. If you didn't request this, ignore this email.`,
    })
  } catch (err) {
    console.error('Resend sendPasswordResetEmail failed:', err)
  }
}

export async function sendAdminApprovalEmail(input: { adminEmail: string; userName: string; userEmail: string; role: string }) {
  try {
    await sendMail({
      to: input.adminEmail,
      subject: 'New user awaiting approval - NumeryCode',
      html: buildHtml('New User Awaiting Approval', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          A new <strong>${escapeHtml(input.role)}</strong> account is pending approval.
        </p>
        <table cellpadding="0" cellspacing="0" style="width:100%; font-size:15px; color:#374151; line-height:1.6;">
          <tr><td style="padding:4px 0;"><strong>Name:</strong> ${escapeHtml(input.userName)}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Email:</strong> ${escapeHtml(input.userEmail)}</td></tr>
        </table>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Please review and approve the account from the admin panel.
        </p>`),
      text:
        `New ${input.role} account is pending approval.\n\n` +
        `Name:  ${input.userName}\n` +
        `Email: ${input.userEmail}\n\n` +
        `Please review and approve the account from the admin panel.`,
    })
  } catch (err) {
    console.error('Resend sendAdminApprovalEmail failed:', err)
  }
}

export async function sendActivationEmail(email: string, name: string, role: string, token: string) {
  const activationLink = `${CLIENT_URL}/activate?token=${token}`
  const dashboardLink = role === 'trainer'
    ? `${CLIENT_URL}/trainer`
    : `${CLIENT_URL}/dashboard`

  try {
    await sendMail({
      to: email,
      subject: 'Activate your NumeryCode account',
      html: buildHtml('Activate Your Account', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Your <strong>${escapeHtml(role)}</strong> account has been approved.
          Click the button below to activate it and access your dashboard:
        </p>
        ${ctaButton(activationLink, 'Activate Account')}
        <p style="font-size:14px; color:#6b7280;">
          This link will expire in <strong>7 days</strong>.
        </p>
        <p style="font-size:14px; color:#6b7280;">
          If the button doesn't work, copy and paste this URL into your browser:<br />
          <a href="${activationLink}" style="color:#2563EB; word-break:break-all; font-size:13px;">${activationLink}</a>
        </p>
        <p style="font-size:14px; color:#6b7280; margin-top:16px;">
          Once activated, go to your <a href="${dashboardLink}" style="color:#2563EB;">dashboard</a> to start learning.
        </p>`),
      text:
        `Hi ${name},\n\n` +
        `Your ${role} account has been approved!\n\n` +
        `Activate your account: ${activationLink}\n\n` +
        `This link will expire in 7 days.\n\n` +
        `Once activated, visit your dashboard: ${dashboardLink}`,
    })
  } catch (err) {
    console.error('Resend sendActivationEmail failed:', err)
  }
}

export async function sendAccountSuspendedEmail(email: string, name: string, reason?: string) {
  try {
    await sendMail({
      to: email,
      subject: 'Your NumeryCode account has been suspended',
      html: buildHtml('Account Suspended', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Your NumeryCode account has been <strong>suspended</strong> by an administrator.
        </p>
        ${reason ? `<p style="font-size:16px; color:#374151; line-height:1.6;"><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ''}
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          You will not be able to access your account or any courses until this suspension is lifted.
        </p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          If you believe this is a mistake or have questions, please contact our support team at <a href="mailto:${CONTACT_EMAIL_TO}" style="color:#2563EB;">${CONTACT_EMAIL_TO}</a>.
        </p>`),
      text:
        `Hi ${name},\n\n` +
        `Your NumeryCode account has been suspended by an administrator.\n\n` +
        (reason ? `Reason: ${reason}\n\n` : '') +
        `You will not be able to access your account or any courses until this suspension is lifted.\n\n` +
        `If you believe this is a mistake, please contact support: ${CONTACT_EMAIL_TO}`,
    })
  } catch (err) {
    console.error('Resend sendAccountSuspendedEmail failed:', err)
  }
}

export async function sendAccountDeletedEmail(email: string, name: string, reason?: string) {
  try {
    await sendMail({
      to: email,
      subject: 'Your NumeryCode account has been deleted',
      html: buildHtml('Account Deleted', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Your NumeryCode account has been <strong>permanently deleted</strong> by an administrator.
        </p>
        ${reason ? `<p style="font-size:16px; color:#374151; line-height:1.6;"><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ''}
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          All associated data including courses, enrollments, and progress have been removed from our system.
          This action cannot be undone.
        </p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          If you have any questions or concerns, please contact our support team at <a href="mailto:${CONTACT_EMAIL_TO}" style="color:#2563EB;">${CONTACT_EMAIL_TO}</a>.
        </p>`),
      text:
        `Hi ${name},\n\n` +
        `Your NumeryCode account has been permanently deleted by an administrator.\n\n` +
        (reason ? `Reason: ${reason}\n\n` : '') +
        `All associated data including courses, enrollments, and progress have been removed.\n\n` +
        `If you have questions, please contact support: ${CONTACT_EMAIL_TO}`,
    })
  } catch (err) {
    console.error('Resend sendAccountDeletedEmail failed:', err)
  }
}

/**
 * Registration verification email — sent immediately when a user registers
 * (and on re-send). Clicking the link proves the registrant owns the mailbox
 * (sets account_activated / email_verified_at). Login additionally requires
 * admin approval, so the copy sets that expectation explicitly.
 */
export async function sendEmailVerificationEmail(email: string, name: string, token: string) {
  const verifyLink = `${CLIENT_URL}/verify-email?token=${token}`

  try {
    await sendMail({
      to: email,
      subject: 'Verify your NumeryCode email address',
      html: buildHtml('Verify Your Email', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Welcome to NumeryCode! Please confirm this email address belongs to you by clicking the button below:
        </p>
        ${ctaButton(verifyLink, 'Verify Email Address')}
        <p style="font-size:14px; color:#6b7280;">
          This link will expire in <strong>24 hours</strong>.
          If you didn't create a NumeryCode account, you can safely ignore this email.
        </p>
        <p style="font-size:14px; color:#6b7280;">
          Verifying your email is the first step. An administrator will also review your
          registration — you'll be able to log in once your account is approved and your
          email address is verified.
        </p>`),
      text:
        `Hi ${name},\n\n` +
        `Welcome to NumeryCode! Please confirm this email address belongs to you:\n\n` +
        `Verify your email: ${verifyLink}\n\n` +
        `This link will expire in 24 hours. An administrator will also review your ` +
        `registration — you can log in once your account is approved and your email address is verified.`,
    })
  } catch (err) {
    console.error('Resend sendEmailVerificationEmail failed:', err)
  }
}

/**
 * Sent when an admin approves an account whose email address is ALREADY
 * verified — the approval was the last remaining step, so no link is needed.
 */
export async function sendAccountApprovedEmail(email: string, name: string, role: string) {
  const loginLink = `${CLIENT_URL}/login`

  try {
    await sendMail({
      to: email,
      subject: 'Your NumeryCode account has been approved',
      html: buildHtml('Account Approved', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Your <strong>${escapeHtml(role)}</strong> account has been approved and your email address is verified.
          You can now log in:
        </p>
        ${ctaButton(loginLink, 'Log In')}`),
      text:
        `Hi ${name},\n\n` +
        `Your ${role} account has been approved and your email address is verified.\n\n` +
        `Log in: ${loginLink}`,
    })
  } catch (err) {
    console.error('Resend sendAccountApprovedEmail failed:', err)
  }
}

/**
 * Security notice sent after a password reset completes — also confirms that
 * completing the reset verified the email address (recovery-flow verification).
 */
export async function sendPasswordChangedEmail(email: string, name: string) {
  const loginLink = `${CLIENT_URL}/login`

  try {
    await sendMail({
      to: email,
      subject: 'Your NumeryCode password was changed',
      html: buildHtml('Password Changed', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Your NumeryCode password was reset successfully, and this email address is now verified.
        </p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          If you did not make this change, reset your password again immediately and contact our
          support team at <a href="mailto:${CONTACT_EMAIL_TO}" style="color:#2563EB;">${CONTACT_EMAIL_TO}</a>.
        </p>
        ${ctaButton(loginLink, 'Log In')}`),
      text:
        `Hi ${name},\n\n` +
        `Your NumeryCode password was reset successfully, and this email address is now verified.\n\n` +
        `If you did not make this change, reset your password again immediately and contact support: ${CONTACT_EMAIL_TO}\n\n` +
        `Log in: ${loginLink}`,
    })
  } catch (err) {
    console.error('Resend sendPasswordChangedEmail failed:', err)
  }
}
