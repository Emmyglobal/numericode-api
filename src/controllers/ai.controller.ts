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

    const assignmentJson = await callOpenAI(
      `You are an assignment creator for ${subject || 'Mathematics'} at ${level || 'beginner'} level.
Given a topic, design a well-structured assignment for students.

IMPORTANT: Respond with ONLY a valid JSON object. No markdown, no explanation.
The JSON object must have exactly this shape:
{
  "title": "string - a short, meaningful assignment title (under 10 words)",
  "description": "string - 2-3 sentences describing the assignment, expectations and submission instructions",
  "questions": [
    {
      "type": "mcq" | "theory" | "subjective" | "file" | "related",
      "title": "string - full question text",
      "marks": number,
      "options": ["string", "string"] - REQUIRED only for type \"mcq\" (3-5 options; omit otherwise),
      "correctOptionIndex": number - index of the correct option for \"mcq\" (omit for other types)
    }
  ]
}

Build 4-5 questions that ideally mix types:
- \"mcq\": multiple choice with clearly distinct options
- \"theory\": a short written explanation / define-and-explain style question
- \"subjective\": a longer written answer / problem-solving task
- \"file\": a task requiring the student to upload a file (e.g. a worksheet, drawing, or code file) - give clear file-upload instructions in the title
- \"related\": a task that references a related resource/material the trainer will attach (e.g. \"Using the attached diagram/reference, ...\")

Keep every question age- and level-appropriate. Use JSON escaping for quotes.`,
      `Create an assignment about: ${topic.trim()}`,
      1400,
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

    const title = (typeof parsed?.title === 'string' && parsed.title.trim()) ? parsed.title.trim().slice(0, 255) : `Assignment: ${topic.trim().slice(0, 200)}`
    const description = (typeof parsed?.description === 'string' && parsed.description.trim()) ? parsed.description.trim() : `An assignment about ${topic.trim()} for ${level || 'beginner'} students.`

    const allowedTypes: string[] = ['mcq', 'theory', 'subjective', 'file', 'related']
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

    const noteJson = await callOpenAI(
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
    next(err)
  }
}
