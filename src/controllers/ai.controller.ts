import type { Request, Response, NextFunction } from 'express'
import { fail, ok } from '../utils/response'
import { callAiProvider, describeAiProvider } from '../services/ai-provider.service'

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

/**
 * GET /api/ai/health — reports whether the AI provider is configured.
 * Never exposes secrets. Useful for diagnosing configuration failures.
 */
export async function aiHealth(_req: Request, res: Response) {
  // Phase 22B: report the ACTIVE provider (server-side AI_PROVIDER) and its
  // configuration state. No secrets, no provider URLs, no AI completion.
  const status = describeAiProvider()
  return ok(res, {
    configured: status.configured,
    model: status.model,
    provider: status.provider,
    message: status.configured
      ? 'AI provider is configured.'
      : 'AI provider is not configured. Please contact support.',
  })
}

export async function studyGuide(req: Request, res: Response, next: NextFunction) {
  try {
    const { message } = req.body as { message?: string }
    if (!message?.trim() || message.length > 800) return fail(res, 'Enter a question of up to 800 characters', 400)
    if (isRateLimited(req.ip || 'unknown')) return fail(res, 'Too many questions. Please try again in a few minutes.', 429)

    const answer = await callAiProvider(
      `You are NumeryCode Study Guide, a warm, knowledgeable AI assistant for Nigerian parents and students.
Answer ANY question the user asks — whether it is about Mathematics, Programming, Science, English,
school subjects, study tips, how NumeryCode works, choosing subjects, live classes, or general learning advice.
Use the broader learning context and your general knowledge to give a helpful, accurate answer.

Keep answers under 180 words, use clear steps when teaching, never request personal data, and recommend
a teacher or support when a topic needs hands-on guidance.`,
      message.trim(),
      400
    )

    return ok(res, { answer })
  } catch (err: any) {
    if (err.message?.includes('not configured')) return fail(res, err.message, 503)
    if (err.message?.includes('unavailable')) return fail(res, err.message, 503)
    if (err.message?.includes('credit limit')) return fail(res, err.message, 429)
    if (err.message?.includes('authentication failed')) return fail(res, err.message, 503)
    if (err.message?.includes('taking longer than expected')) return fail(res, 'The AI assistant is taking longer than expected. Please try again shortly.', 503)
    if (err.message?.includes('could not generate')) return fail(res, err.message, 502)
    next(err)
  }
}

// ─── AI Lesson Content Generation (trainer/admin) ────────────────────────────

export async function generateLessonContent(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, subject, level, style } = req.body as {
      topic?: string; subject?: string; level?: string; style?: string
    }
    if (!topic?.trim()) return fail(res, 'Topic is required', 400)

    if (isRateLimited(req.ip || 'unknown')) return fail(res, 'Too many requests. Please try again in a few minutes.', 429)

    const content = await callAiProvider(
      `You are a professional ${subject || 'Mathematics'} curriculum developer for ${level || 'beginner'} level students.
Create a well-structured lesson on the given topic. The lesson should include:
1. A clear introduction explaining why this topic matters
2. Key concepts broken down into simple steps
3. Practical examples with solutions
4. A summary of what was learned

Format the response with clear section headings using markdown (## for headings).
Use ${style || 'friendly and encouraging'} language suitable for ${level || 'beginner'} students.
Keep the lesson between 300-600 words.`,
      `Create a ${level || 'beginner'}-level ${subject || 'Mathematics'} lesson on: ${topic.trim()}`,
      800
    )

    return ok(res, { content })
  } catch (err: any) {
    if (err.message?.includes('not configured')) return fail(res, err.message, 503)
    if (err.message?.includes('unavailable')) return fail(res, err.message, 503)
    if (err.message?.includes('credit limit')) return fail(res, err.message, 429)
    if (err.message?.includes('authentication failed')) return fail(res, err.message, 503)
    if (err.message?.includes('taking longer than expected')) return fail(res, 'The AI assistant is taking longer than expected. Please try again shortly.', 503)
    if (err.message?.includes('could not generate')) return fail(res, err.message, 502)
    next(err)
  }
}

// ─── AI Quiz Generation (trainer/admin) ─────────────────────────────────────

export async function generateQuizQuestions(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, subject, level, questionCount = 5, questionTypes } = req.body as {
      topic?: string; subject?: string; level?: string; questionCount?: number; questionTypes?: string[]
    }
    if (!topic?.trim()) return fail(res, 'Topic is required', 400)
    if (isRateLimited(req.ip || 'unknown')) return fail(res, 'Too many requests. Please try again in a few minutes.', 429)

    const types = questionTypes?.length ? questionTypes : ['mcq', 'theory', 'subjective', 'file', 'related']

    const quizJson = await callAiProvider(
      `You are a professional ${subject || 'Mathematics'} curriculum developer for ${level || 'beginner'} level students.
Create a short quiz on the given topic. Respond with ONLY a valid JSON object (no markdown, no explanation).

The JSON object must have exactly this shape:
{
  "title": "string (short quiz title)",
  "description": "string (one-line instructions)",
  "questions": [
    {
      "title": "string",
      "type": "mcq" | "theory" | "subjective" | "file" | "related",
      "marks": 10,
      "options": ["option A", "option B", "option C", "option D"],  // only for mcq
      "correctOptionIndex": 0  // only for mcq
    }
  ]
}`,
      `Create a ${level || 'beginner'}-level ${subject || 'Mathematics'} quiz on: ${topic.trim()}`,
      1000,
      true
    )

    let parsed: any
    try {
      parsed = JSON.parse(quizJson)
    } catch {
      const jsonMatch = quizJson.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[1]) } catch { return fail(res, 'Failed to parse generated quiz. Please try again.', 500) }
      } else {
        return fail(res, 'Failed to parse generated quiz. Please try again.', 500)
      }
    }

    const title = (typeof parsed?.title === 'string' && parsed.title.trim())
      ? parsed.title.trim().slice(0, 120)
      : `${subject || 'Quiz'}: ${topic.trim().slice(0, 60)}`

    const description = (typeof parsed?.description === 'string' && parsed.description.trim())
      ? parsed.description.trim().slice(0, 300)
      : 'Answer the following questions.'

    const allowedTypes = ['mcq', 'theory', 'subjective', 'file', 'related']
    const questions = Array.isArray(parsed?.questions)
      ? (parsed.questions as any[])
          .filter((q: any) => q && typeof q.title === 'string' && q.title.trim())
          .map((q: any, index: number) => ({
            id: `q${index + 1}`,
            type: allowedTypes.includes(String(q.type)) ? String(q.type) : 'theory',
            title: q.title.trim(),
            marks: Number.isFinite(Number(q.marks)) && Number(q.marks) > 0 ? Number(q.marks) : 10,
            options: Array.isArray(q.options) ? (q.options as unknown[]).map(String) : undefined,
            correctOptionIndex: Number.isInteger(Number(q.correctOptionIndex)) ? Number(q.correctOptionIndex) : undefined,
          }))
      : []

    if (!questions.length) return fail(res, 'The AI could not generate questions. Please try again.', 500)

    return ok(res, { title, description, questions: questions as any[], aiGenerated: true })
  } catch (err: any) {
    if (err.message?.includes('not configured')) return fail(res, err.message, 503)
    if (err.message?.includes('unavailable')) return fail(res, err.message, 503)
    if (err.message?.includes('credit limit')) return fail(res, err.message, 429)
    if (err.message?.includes('authentication failed')) return fail(res, err.message, 503)
    if (err.message?.includes('taking longer than expected')) return fail(res, 'The AI assistant is taking longer than expected. Please try again shortly.', 503)
    if (err.message?.includes('could not generate')) return fail(res, err.message, 502)
    next(err)
  }
}

// ─── AI Assignment Generation (trainer/admin) ───────────────────────────────

export async function generateAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, subject, level, questionCount = 5, marksPerQuestion = 10 } = req.body as {
      topic?: string; subject?: string; level?: string; questionCount?: number; marksPerQuestion?: number
    }
    if (!topic?.trim()) return fail(res, 'Topic is required', 400)
    if (isRateLimited(req.ip || 'unknown')) return fail(res, 'Too many requests. Please try again in a few minutes.', 429)

    const assignmentJson = await callAiProvider(
      `You are a professional ${subject || 'Mathematics'} curriculum developer for ${level || 'beginner'} level students.
Create an assignment on the given topic. Respond with ONLY a valid JSON object (no markdown, no explanation).

The JSON object must have exactly this shape:
{
  "title": "string (assignment title)",
  "instructions": "string (one-line instructions)",
  "questions": [
    {
      "title": "string",
      "type": "theory" | "file",
      "marks": 10
    }
  ]
}`,
      `Create a ${level || 'beginner'}-level ${subject || 'Mathematics'} assignment on: ${topic.trim()}`,
      1000,
      true
    )

    let parsed: any
    try {
      parsed = JSON.parse(assignmentJson)
    } catch {
      const jsonMatch = assignmentJson.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[1]) } catch { return fail(res, 'Failed to parse generated assignment. Please try again.', 500) }
      } else {
        return fail(res, 'Failed to parse generated assignment. Please try again.', 500)
      }
    }

    const title = (typeof parsed?.title === 'string' && parsed.title.trim())
      ? parsed.title.trim().slice(0, 120)
      : `${subject || 'Assignment'}: ${topic.trim().slice(0, 60)}`

    const instructions = (typeof parsed?.instructions === 'string' && parsed.instructions.trim())
      ? parsed.instructions.trim().slice(0, 300)
      : 'Complete the following assignment.'

    const questions = Array.isArray(parsed?.questions)
      ? (parsed.questions as any[])
          .filter((q: any) => q && typeof q.title === 'string' && q.title.trim())
          .map((q: any, index: number) => ({
            id: `q${index + 1}`,
            type: ['theory', 'file'].includes(String(q.type)) ? String(q.type) : 'theory',
            title: q.title.trim(),
            marks: Number.isFinite(Number(q.marks)) && Number(q.marks) > 0 ? Number(q.marks) : marksPerQuestion,
          }))
      : []

    if (!questions.length) return fail(res, 'The AI could not generate questions. Please try again.', 500)

    return ok(res, { title, instructions, questions: questions as any[], aiGenerated: true })
  } catch (err: any) {
    if (err.message?.includes('not configured')) return fail(res, err.message, 503)
    if (err.message?.includes('unavailable')) return fail(res, err.message, 503)
    if (err.message?.includes('credit limit')) return fail(res, err.message, 429)
    if (err.message?.includes('authentication failed')) return fail(res, err.message, 503)
    if (err.message?.includes('taking longer than expected')) return fail(res, 'The AI assistant is taking longer than expected. Please try again shortly.', 503)
    if (err.message?.includes('could not generate')) return fail(res, err.message, 502)
    next(err)
  }
}

// ─── AI Course Note Generation (trainer/admin) ────────────────────────────

export async function generateNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, subject, level, style } = req.body as {
      topic?: string; subject?: string; level?: string; style?: string
    }
    if (!topic?.trim()) return fail(res, 'Topic is required', 400)
    if (isRateLimited(req.ip || 'unknown')) return fail(res, 'Too many requests. Please try again in a few minutes.', 429)

    const noteJson = await callAiProvider(
      `You are a concise course-note writer for ${subject || 'Mathematics'} at ${level || 'beginner'} level.
Write clear, well-organised study notes for students on the given topic. The notes should:
1. Have a short, meaningful title (aim for under 10 words, no trailing punctuation).
2. Use markdown structure: a brief overview, bullet points of the key concepts, small worked examples,
   a "Key Points" summary, and an optional "Practice questions" list with hints.
3. Keep it between 250-450 words and suitable for ${level || 'beginner'} students.
Use a ${style || 'friendly and encouraging'} tone.

IMPORTANT: Respond with ONLY a valid JSON object. No markdown, no explanation.
The JSON object must have exactly this shape:
{
  "title": "string",
  "content": "string - full markdown notes"
}`,
      `Create study notes about: ${topic.trim()}`,
      1400,
      true
    )

    let parsed: any
    try {
      parsed = JSON.parse(noteJson)
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = noteJson.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[1]) } catch { return fail(res, 'Failed to parse generated notes. Please try again.', 500) }
      } else {
        return fail(res, 'Failed to parse generated notes. Please try again.', 500)
      }
    }

    const title = (typeof parsed?.title === 'string' && parsed.title.trim())
      ? parsed.title.trim().slice(0, 255)
      : `Study Notes: ${topic.trim().slice(0, 200)}`

    const content = (typeof parsed?.content === 'string' && parsed.content.trim())
      ? parsed.content.trim()
      : noteJson

    return ok(res, { title, content })
  } catch (err: any) {
    if (err.message?.includes('not configured')) return fail(res, err.message, 503)
    if (err.message?.includes('unavailable')) return fail(res, err.message, 503)
    if (err.message?.includes('credit limit')) return fail(res, err.message, 429)
    if (err.message?.includes('authentication failed')) return fail(res, err.message, 503)
    if (err.message?.includes('taking longer than expected')) return fail(res, 'The AI assistant is taking longer than expected. Please try again shortly.', 503)
    if (err.message?.includes('could not generate')) return fail(res, err.message, 502)
    next(err)
  }
}
