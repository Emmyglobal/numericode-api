import type { Request, Response, NextFunction } from 'express'
import { fail, ok } from '../utils/response'
import { sendContactEmail } from '../utils/mailer'

export async function submitContactForm(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, subject, message } = req.body as {
      name?: string; email?: string; subject?: string; message?: string
    }
    if (!name || !email || !subject || !message) {
      return fail(res, 'Name, email, subject, and message are all required', 400)
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return fail(res, 'Enter a valid email address', 400)
    if (message.length < 10) return fail(res, 'Message must be at least 10 characters', 400)

    await sendContactEmail({ name, email, subject, message })
    return ok(res, { sent: true }, 200)
  } catch (err) {
    next(err)
  }
}
