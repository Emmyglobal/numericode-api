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

interface ContactMailInput {
  name: string
  email: string
  subject: string
  message: string
}

/** Sends a contact form submission to the platform's contact inbox. */
export async function sendContactEmail(input: ContactMailInput) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email is not configured on the server. Set SMTP_USER and SMTP_PASS.')
  }

  await transporter.sendMail({
    from: `"NumeriCode Contact Form" <${process.env.SMTP_USER}>`,
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

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
