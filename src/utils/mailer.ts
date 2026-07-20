import nodemailer from 'nodemailer'

// SMTP is configured via environment variables — see .env.example.
// For Gmail: use an "App Password" (not your normal password), generated at
// https://myaccount.google.com/apppasswords — requires 2FA enabled on the account.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'nwaforugochukwu21@gmail.com'
const FROM_NAME         = 'NumeriCode'
const FROM_ADDRESS      = process.env.SMTP_USER || 'nwaforugochukwu21@gmail.com'
const CLIENT_URL        = process.env.CLIENT_URL || 'http://localhost:5173'

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

/** Sends a contact form submission to the platform's contact inbox. */
export async function sendContactEmail(input: ContactMailInput) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email is not configured on the server. Set SMTP_USER and SMTP_PASS.')
  }

  await transporter.sendMail({
    from: `"${FROM_NAME} Contact Form" <${FROM_ADDRESS}>`,
    to: CONTACT_EMAIL_TO,
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
}

/** Sends a welcome email after successful account creation. */
export async function sendWelcomeEmail(input: WelcomeMailInput) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return // silently skip if email not configured

  const dashboardLink = input.role === 'trainer'
    ? `${CLIENT_URL}/trainer`
    : `${CLIENT_URL}/dashboard`

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_ADDRESS}>`,
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
}

/** Sends a password reset email with a reset link. */
export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return // silently skip if email not configured

  const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_ADDRESS}>`,
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
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"')
}
