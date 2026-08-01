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

async function callOpenAI(systemPrompt: string, userMessage: string, maxTokens = 500): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('AI is not configured. Please contact support.')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    console.error('OpenAI API error:', response.status, errorBody)
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
      `You are NumeriCode Study Guide, a warm, accurate educational assistant for Nigerian parents and students.
Help with Mathematics and introductory Programming. Keep answers under 160 words, use clear steps,
never request personal data, and recommend a teacher or support when appropriate.`,
      message.trim(),
      300
    )

    return ok(res, { answer })
  } catch (err: any) {
    if (err.message?.includes('not configured')) return fail(res, err.message, 503)
    if (err.message?.includes('unavailable')) return fail(res, err.message, 503)
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

    const questionsJson = await callOpenAI(
      `You are a quiz generator for ${subject || 'Mathematics'} at ${level || 'beginner'} level.
Generate exactly ${Math.min(questionCount || 5, 10)} questions about the given topic.
Use these question types: ${types}.

For multiple_choice questions, provide 4 options with one marked as correct (isCorrect: true).
For true_false questions, set correctAnswer to "true" or "false".
For fill_blank questions, provide the correct answer text.
For essay questions, provide a rubric/answer key as correctAnswer.

IMPORTANT: Respond with ONLY a valid JSON array. No markdown, no explanation.
Each object in the array must have this exact structure:
{
  "questionText": "string",
  "questionType": "multiple_choice|true_false|fill_blank|essay",
  "options": [{"id": "a", "text": "option text", "isCorrect": false}],
  "correctAnswer": "string or null",
  "points": 1,
  "position": 0
}`,
      `Generate ${Math.min(questionCount || 5, 10)} ${types} quiz questions about: ${topic.trim()}`,
      2000
    )

    let questions
    try {
      questions = JSON.parse(questionsJson)
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = questionsJson.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[1])
      } else {
        return fail(res, 'Failed to parse generated questions. Please try again.', 500)
      }
    }

    if (!Array.isArray(questions)) {
      return fail(res, 'Invalid questions format generated. Please try again.', 500)
    }

    // Normalize questions
    questions = questions.slice(0, Math.min(questionCount || 5, 10)).map((q: any, i: number) => ({
      questionText: q.questionText || 'Sample question',
      questionType: ['multiple_choice', 'true_false', 'fill_blank', 'essay'].includes(q.questionType) ? q.questionType : 'multiple_choice',
      options: q.options || null,
      correctAnswer: q.correctAnswer || null,
      points: Number(q.points) || 1,
      position: i,
    }))

    return ok(res, { questions })
  } catch (err: any) {
    if (err.message?.includes('not configured')) return fail(res, err.message, 503)
    if (err.message?.includes('unavailable')) return fail(res, err.message, 503)
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
    next(err)
  }
}