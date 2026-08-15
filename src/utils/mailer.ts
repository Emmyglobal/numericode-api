import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

// Sender configuration -----------------------------------------------------
// CRITICAL - To avoid spam, EMAIL_FROM must be a sender verified in your
// SendGrid account. Using unauthenticated Gmail addresses causes SPF/DKIM
// failures, and receiving mail servers reject or spam the email.
// Best: authenticate your custom domain (e.g. numericode.com) in SendGrid
// (Settings > Sender Authentication > Domain Authentication - adds DKIM/SPF
// DNS records). Then EMAIL_FROM can be any address on that domain.
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@numericode.com'
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'NumeriCode'
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
    'NumeriCode - https://www.numerycode.com\n' +
    'This is an automated message from the NumeriCode learning platform. Please do not reply directly to this email.'
  )
}

function htmlFooter(): string {
  return `
    <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      <tr>
        <td style="text-align:center; font-size:12px; color:#9ca3af; line-height:1.5;">
          <p style="margin:0;">NumeriCode &mdash; <a href="https://www.numerycode.com" style="color:#2563EB; text-decoration:none;">www.numerycode.com</a></p>
          <p style="margin:4px 0 0;">This is an automated message from the NumeriCode learning platform.</p>
          <p style="margin:4px 0 0;">&copy; ${CURRENT_YEAR} NumeriCode. All rights reserved.</p>
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

async function sendMail(input: MailBaseInput) {
  const msg: sgMail.MailDataRequired = {
    from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text + plainTextFooter(),
  }
  if (input.unsubscribeLink) {
    msg.headers = {
      'List-Unsubscribe': `<${input.unsubscribeLink}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    }
  }
  await sgMail.send(msg)
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
    console.error('SendGrid sendEmail failed:', err)
  }
}

export async function sendContactEmail(input: ContactMailInput) {
  try {
    await sgMail.send({
      from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
      to: CONTACT_EMAIL_TO,
      replyTo: input.email,
      subject: `[NumeriCode Contact] ${input.subject}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.message}${plainTextFooter()}`,
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
    console.error('SendGrid sendContactEmail failed:', err)
  }
}

export async function sendWelcomeEmail(input: WelcomeMailInput) {
  const dashboardLink = input.role === 'trainer'
    ? `${CLIENT_URL}/trainer`
    : `${CLIENT_URL}/dashboard`

  try {
    await sendMail({
      to: input.email,
      subject: `Welcome to NumeriCode, ${input.name}!`,
      html: buildHtml('Welcome to NumeriCode!', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(input.name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Your <strong>${escapeHtml(input.role)}</strong> account has been created successfully.
          You're now part of the NumeriCode learning community!
        </p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Start exploring courses, attending live classes, and tracking your progress.
        </p>
        ${ctaButton(dashboardLink, 'Go to Dashboard')}
        <p style="font-size:14px; color:#6b7280;">If you have any questions, just reply to this email.</p>`),
      text:
        `Hi ${input.name},\n\n` +
        `Your ${input.role} account has been created successfully. ` +
        `You're now part of the NumeriCode learning community!\n\n` +
        `Go to your dashboard: ${dashboardLink}`,
    })
  } catch (err) {
    console.error('SendGrid sendWelcomeEmail failed:', err)
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`

  try {
    await sendMail({
      to: email,
      subject: 'Reset your NumeriCode password',
      html: buildHtml('Password Reset', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          We received a request to reset your NumeriCode password.
          Click the button below to set a new password:
        </p>
        ${ctaButton(resetLink, 'Reset Password')}
        <p style="font-size:14px; color:#6b7280;">
          This link will expire in <strong>1 hour</strong>.
          If you didn't request a password reset, you can safely ignore this email.
        </p>`),
      text:
        `Hi ${name},\n\n` +
        `We received a request to reset your NumeriCode password.\n\n` +
        `Reset your password: ${resetLink}\n\n` +
        `This link will expire in 1 hour. If you didn't request this, ignore this email.`,
    })
  } catch (err) {
    console.error('SendGrid sendPasswordResetEmail failed:', err)
  }
}

export async function sendAdminApprovalEmail(input: { adminEmail: string; userName: string; userEmail: string; role: string }) {
  try {
    await sendMail({
      to: input.adminEmail,
      subject: 'New user awaiting approval - NumeriCode',
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
    console.error('SendGrid sendAdminApprovalEmail failed:', err)
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
      subject: 'Activate your NumeriCode account',
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
    console.error('SendGrid sendActivationEmail failed:', err)
  }
}

export async function sendAccountSuspendedEmail(email: string, name: string, reason?: string) {
  try {
    await sendMail({
      to: email,
      subject: 'Your NumeriCode account has been suspended',
      html: buildHtml('Account Suspended', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Your NumeriCode account has been <strong>suspended</strong> by an administrator.
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
        `Your NumeriCode account has been suspended by an administrator.\n\n` +
        (reason ? `Reason: ${reason}\n\n` : '') +
        `You will not be able to access your account or any courses until this suspension is lifted.\n\n` +
        `If you believe this is a mistake, please contact support: ${CONTACT_EMAIL_TO}`,
    })
  } catch (err) {
    console.error('SendGrid sendAccountSuspendedEmail failed:', err)
  }
}

export async function sendAccountDeletedEmail(email: string, name: string, reason?: string) {
  try {
    await sendMail({
      to: email,
      subject: 'Your NumeriCode account has been deleted',
      html: buildHtml('Account Deleted', `
        <p style="font-size:16px; color:#374151; line-height:1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Your NumeriCode account has been <strong>permanently deleted</strong> by an administrator.
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
        `Your NumeriCode account has been permanently deleted by an administrator.\n\n` +
        (reason ? `Reason: ${reason}\n\n` : '') +
        `All associated data including courses, enrollments, and progress have been removed.\n\n` +
        `If you have questions, please contact support: ${CONTACT_EMAIL_TO}`,
    })
  } catch (err) {
    console.error('SendGrid sendAccountDeletedEmail failed:', err)
  }
}
