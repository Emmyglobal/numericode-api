import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

// IMPORTANT: EMAIL_FROM must be a verified sender in your SendGrid account.
// Using Gmail (e.g. @gmail.com) causes SPF/DKIM failures → emails go to spam.
// Solution: verify a domain you own in SendGrid (e.g. numericode.com) or
// verify a single sender email. Then use that verified address here.
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@numericode.com'
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'NumeriCode'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

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

function escapeHtml(s: string) {
  return s.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"')
}

/** Generic email sender for notifications and digests */
export async function sendEmail(input: { to: string; subject: string; html: string }) {
  try {
    await sgMail.send({
      from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
      to: input.to,
      subject: input.subject,
      html: input.html,
    })
  } catch (err) {
    console.error('SendGrid sendEmail failed:', err)
  }
}

/** Sends a contact form submission to the platform's contact inbox. */
export async function sendContactEmail(input: ContactMailInput) {
  try {
    await sgMail.send({
      from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
      to: process.env.CONTACT_EMAIL_TO || 'nwaforugochukwu21@gmail.com',
      replyTo: input.email,
      subject: `[NumeriCode Contact] ${input.subject}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#1E3A5F;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap; background:#F7F8FA; padding:12px; border-radius:8px;">${escapeHtml(input.message)}</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('SendGrid sendContactEmail failed:', err)
  }
}

/** Sends a welcome email after successful account creation. */
export async function sendWelcomeEmail(input: WelcomeMailInput) {
  const dashboardLink = input.role === 'trainer'
    ? `${CLIENT_URL}/trainer`
    : `${CLIENT_URL}/dashboard`

  try {
    await sgMail.send({
      from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
      to: input.email,
      subject: `Welcome to NumeriCode, ${input.name}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1E3A5F, #2563EB); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to NumeriCode! 🎉</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hi <strong>${escapeHtml(input.name)}</strong>,</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Your ${escapeHtml(input.role)} account has been created successfully. You're now part of the NumeriCode learning community!
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Start exploring courses, attending live classes, and tracking your progress.
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${dashboardLink}"
                 style="background: #2563EB; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">If you have any questions, just reply to this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; ${new Date().getFullYear()} NumeriCode. All rights reserved.</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('SendGrid sendWelcomeEmail failed:', err)
  }
}

/** Sends a password reset email with a reset link. */
export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`

  try {
    await sgMail.send({
      from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
      to: email,
      subject: 'Reset your NumeriCode password',
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1E3A5F, #2563EB); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hi <strong>${escapeHtml(name)}</strong>,</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              We received a request to reset your NumeriCode password. Click the button below to set a new password:
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetLink}"
                 style="background: #2563EB; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; ${new Date().getFullYear()} NumeriCode. All rights reserved.</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('SendGrid sendPasswordResetEmail failed:', err)
  }
}

/** Sends an admin alert email when a new user registers and needs approval. */
export async function sendAdminApprovalEmail(input: { adminEmail: string; userName: string; userEmail: string; role: string }) {
  try {
    await sgMail.send({
      from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
      to: input.adminEmail,
      subject: 'New user awaiting approval',
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1E3A5F, #2563EB); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New User Awaiting Approval</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              A new <strong>${escapeHtml(input.role)}</strong> account is pending approval.
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              <strong>Name:</strong> ${escapeHtml(input.userName)}<br />
              <strong>Email:</strong> ${escapeHtml(input.userEmail)}
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Please review and approve the account from the admin panel.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; ${new Date().getFullYear()} NumeriCode. All rights reserved.</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('SendGrid sendAdminApprovalEmail failed:', err)
  }
}

/** Sends an account activation email with a link containing the activation token. */
export async function sendActivationEmail(email: string, name: string, role: string, token: string) {
  const activationLink = `${CLIENT_URL}/activate?token=${token}`
  const dashboardLink = role === 'trainer'
    ? `${CLIENT_URL}/trainer`
    : `${CLIENT_URL}/dashboard`

  try {
    await sgMail.send({
      from: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
      to: email,
      subject: 'Activate your NumeriCode account',
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1E3A5F, #2563EB); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Activate Your Account</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hi <strong>${escapeHtml(name ?? '')}</strong>,</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Your ${escapeHtml(role)} account has been approved. Click the button below to activate it and access your dashboard:
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${activationLink}"
                 style="background: #2563EB; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
                Activate Account
              </a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              This link will expire in 7 days. If the button doesn't work, copy and paste this link into your browser:
              <br />
              <a href="${activationLink}" style="color:#2563EB; word-break:break-all;">${activationLink}</a>
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
              Once activated, you can go directly to your <a href="${dashboardLink}" style="color:#2563EB;">dashboard</a>.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; ${new Date().getFullYear()} NumeriCode. All rights reserved.</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('SendGrid sendActivationEmail failed:', err)
  }
}