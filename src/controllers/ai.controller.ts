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

async function callOpenAI(systemPrompt: string, userMessage: string, maxTokens = 500, jsonMode = false): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('AI is not configured. Please contact support.')
  }

  const body: Record<string, unknown> = {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  }

  // Ask the model for a strict JSON object when the app needs to parse the result.
  if (jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    console.error('OpenAI API error:', response.status, errorBody)
    if (response.status === 401 || response.status === 403) {
      throw new Error('AI authentication failed. Please contact support.')
    }
    if (response.status === 429) {
      throw new Error('The AI service has reached its current request or credit limit. Please try again later.')
    }
    throw new Error('The AI assistant is temporarily unavailable. Please try again shortly.')
  }

  const result = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const text = result?.choices?.[0]?.message?.content
  if (!text) throw new Error('The AI assistant could not generate a response. Please try again.')

  return text.trim()
}

// ─── Study Guide (students) ─────────────────────────────────────────────────

export async function studyGuide(req: Request, res: Response, next: NextFunction) {
  try {
    const { message } = req.body as { message?: string }
    if (!message?.trim() || message.length > 800) return fail(res, 'Enter a question of up to 800 characters', 400)
    if (isRateLimited(req.ip || 'unknown')) return fail(res, 'Too many questions. Please try again in a few minutes.', 429)

    const answer = await callOpenAI(
      `You are NumeriCode Study Guide, a warm, knowledgeable AI assistant for Nigerian parents and students.
Answer ANY question the user asks — whether it is about Mathematics, Programming, Science, English,
school subjects, study tips, how NumeriCode works, choosing subjects, live classes, or general learning advice.
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

    const content = await callOpenAI(
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

    const types = questionTypes?.length ? questionTypes.join(', ') : 'multiple_choice, true_false'
    const count = Math.min(questionCount || 5, 10)

    const questionsJson = await callOpenAI(
      `You are a quiz generator for ${subject || 'Mathematics'} at ${level || 'beginner'} level.
Generate exactly ${count} questions about the given topic.
Use these question types: ${types}.

For multiple_choice questions, provide 4 options with one marked as correct (isCorrect: true).
For true_false questions, set correctAnswer to "true" or "false".
For fill_blank questions, provide the correct answer text.
For essay questions, provide a rubric/answer key as correctAnswer.

IMPORTANT: Respond with ONLY a valid JSON object. No markdown, no explanation.
The JSON object must have this exact shape:
{
  "questions": [
    {
      "questionText": "string",
      "questionType": "multiple_choice|true_false|fill_blank|essay",
      "options": [{"id": "a", "text": "option text", "isCorrect": false}],
      "correctAnswer": "string or null",
      "points": 1,
      "position": 0
    }
  ]
}`,
      `Generate ${count} ${types} quiz questions about: ${topic.trim()}`,
      2000,
      true
    )

    let parsed: any
    try {
      parsed = JSON.parse(questionsJson)
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = questionsJson.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[1]) } catch { return fail(res, 'Failed to parse generated questions. Please try again.', 500) }
      } else {
        return fail(res, 'Failed to parse generated questions. Please try again.', 500)
      }
    }

    // Accept either { questions: [...] } or a bare array for robustness
    let rawQuestions = Array.isArray(parsed) ? parsed : parsed?.questions
    if (!Array.isArray(rawQuestions)) {
      return fail(res, 'Invalid questions format generated. Please try again.', 500)
    }

    // Normalize questions
    const questions = rawQuestions.slice(0, count).map((q: any, i: number) => {
      const type = ['multiple_choice', 'true_false', 'fill_blank', 'essay'].includes(q?.questionType)
        ? q.questionType
        : 'multiple_choice'

      let options = null
      if (type === 'multiple_choice' && Array.isArray(q?.options) && q.options.length > 0) {
        options = q.options.map((o: any, idx: number) => ({
          id: o?.id || `opt_${idx}`,
          text: o?.text || `Option ${idx + 1}`,
          isCorrect: Boolean(o?.isCorrect),
        }))
      }

      return {
        questionText: q?.questionText || 'Sample question',
        questionType: type,
        options,
        correctAnswer: q?.correctAnswer || null,
        points: Number(q?.points) || 1,
        position: i,
      }
    })

    return ok(res, { questions })
  } catch (err: any) {
    if (err.message?.includes('not configured')) return fail(res, err.message, 503)
    if (err.message?.includes('unavailable')) return fail(res, err.message, 503)
    if (err.message?.includes('credit limit')) return fail(res, err.message, 429)
    if (err.message?.includes('authentication failed')) return fail(res, err.message, 503)
    next(err)
  }
}

// ─── AI Assignment Generation (trainer/admin) ───────────────────────────────

export async function generateAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, subject, level } = req.body as {
      topic?: string; subject?: string; level?: string
    }
    if (!topic?.trim()) return fail(res, 'Topic is required', 400)
    if (isRateLimited(req.ip || 'unknown')) return fail(res, 'Too many requests. Please try again in a few minutes.', 429)

    const result = await callOpenAI(
      `You are an assignment creator for ${subject || 'Mathematics'} at ${level || 'beginner'} level.
Generate a comprehensive assignment for the given topic. Include:
1. A brief description of the assignment
2. 3-5 questions or tasks for students to complete
3. Clear instructions for submission

Format the response as plain text with clear sections.
Keep it between 200-400 words.`,
      `Create an assignment about: ${topic.trim()}`,
      600
    )

    return ok(res, { description: result })
  } catch (err: any) {
    if (err.message?.includes('not configured')) return fail(res, err.message, 503)
    if (err.message?.includes('unavailable')) return fail(res, err.message, 503)
    if (err.message?.includes('credit limit')) return fail(res, err.message, 429)
    if (err.message?.includes('authentication failed')) return fail(res, err.message, 503)
    next(err)
  }
}
