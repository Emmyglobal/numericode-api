import type { Request, Response, NextFunction } from 'express'
import { fail, ok } from '../utils/response'

const requests = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const record = requests.get(ip)
  if (!record || record.resetAt < now) {
    requests.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return false
  }
  record.count += 1
  return record.count > 20
}

export async function studyGuide(req: Request, res: Response, next: NextFunction) {
  try {
    const { message } = req.body as { message?: string }
    if (!message?.trim() || message.length > 800) return fail(res, 'Enter a question of up to 800 characters', 400)
    if (isRateLimited(req.ip || 'unknown')) return fail(res, 'Too many questions. Please try again in a few minutes.', 429)
    if (!process.env.OPENAI_API_KEY) return fail(res, 'Study assistance is not configured yet. Please contact support.', 503)

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          { role: 'system', content: 'You are NumeriCode Study Guide, a warm, accurate educational assistant for Nigerian parents and students. Help with Mathematics and introductory Programming. Keep answers under 160 words, use clear steps, never request personal data, and recommend a teacher or support when appropriate.' },
          { role: 'user', content: message.trim() },
        ],
        max_output_tokens: 300,
      }),
    })
    if (!response.ok) return fail(res, 'The study assistant is temporarily unavailable. Please try again shortly.', 503)
    const result = await response.json() as { output_text?: string }
    if (!result.output_text) return fail(res, 'The study assistant could not answer that question. Please try again.', 503)
    return ok(res, { answer: result.output_text })
  } catch (err) { next(err) }
}
