// ─── React Course — content builders ─────────────────────────────────────────
// Every module file declares lessons as plain data and lets these builders expand
// them into (a) the structured `slides` the LessonViewer renders and (b) the
// markdown `content` the existing renderer / admin editor still understands.
// Keeping the expansion here keeps the 15 module files short and consistent.
import type {
  AssignmentData, AssignmentQuestion, LessonData, LessonSlide, ModuleData, QuizData, QuizQuestion,
} from './types'

const OPTION_IDS = ['a', 'b', 'c', 'd', 'e', 'f']

/** Multiple choice. `correct` is the zero-based index of the right option. */
export function mcq(questionText: string, options: string[], correct: number, explanation: string, points = 2): QuizQuestion {
  return {
    id: '', questionText, questionType: 'multiple_choice',
    options: options.map((text, i) => ({ id: OPTION_IDS[i], text, isCorrect: i === correct })),
    correctAnswer: OPTION_IDS[correct], explanation, points,
  }
}

/** True / false. */
export function tf(questionText: string, answer: boolean, explanation: string, points = 1): QuizQuestion {
  return { id: '', questionText, questionType: 'true_false', correctAnswer: answer ? 'true' : 'false', explanation, points }
}

/** Fill in the blank — the expected answer is one short string. */
export function fill(questionText: string, answer: string, explanation: string, points = 1): QuizQuestion {
  return { id: '', questionText, questionType: 'fill_blank', correctAnswer: answer, explanation, points }
}

export interface AssignmentSpec {
  goal: string
  requirements: string[]
  starter: string
  expected: string
  submission: string
  criteria: Array<[string, number]>
  difficulty: 'Beginner' | 'Intermediate' | 'Challenging'
  time: string
  type?: 'theory' | 'subjective' | 'file' | 'mixed'
}

export interface LessonSpec {
  intro: string
  objectives: string[]
  /** Teaching slides: [title, markdown]. */
  teach?: Array<[string, string]>
  /** Extra worked examples rendered as example cards. */
  examples?: Array<{ title: string; content: string; code?: string; language?: string }>
  /** The main code walkthrough for the lesson. */
  code?: { language: string; title: string; code: string; explain: string }
  callouts?: Array<{ type: 'tip' | 'warning' | 'note'; title?: string; content: string }>
  tryIt: { task: string; steps: string[]; starter?: string; expected?: string }
  mistakes?: Array<[string, string]>
  check?: [string, string[], number, string]
  summary: string[]
  quiz: QuizQuestion[]
  assignment?: AssignmentSpec
  duration: number
}

/** Slug used for stable slide ids — deterministic across re-seeds. */
function slug(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 44)
}


/** Builds the quiz payload for one lesson using the house conventions. */
function buildQuiz(title: string, questions: QuizQuestion[]): QuizData {
  const short = title.replace(/^R\d+\.\d+\s*[—-]\s*/, '')
  return {
    title: `Quiz — ${title}`,
    description: `Check your understanding of ${short}. You need 70% to pass and may try up to 3 times.`,
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: questions.map((q, i) => ({ ...q, id: `q${i + 1}` })),
  }
}

/** Builds the professionally formatted assignment record (markdown + rubric). */
export function buildAssignment(spec: AssignmentSpec, lessonTitle: string): AssignmentData {
  const totalMarks = spec.criteria.reduce((sum, [, marks]) => sum + marks, 0)
  const description = [
    `## Learning Goal`,
    spec.goal,
    ``,
    `## Requirements`,
    ...spec.requirements.map(r => `- ${r}`),
    ``,
    `## Starter Information`,
    spec.starter,
    ``,
    `## Expected Result`,
    spec.expected,
    ``,
    `## Submission Instructions`,
    spec.submission,
    ``,
    `## Grading Criteria`,
    ...spec.criteria.map(([label, marks]) => `- ${label} — ${marks} marks`),
    ``,
    `**Difficulty:** ${spec.difficulty}  `,
    `**Estimated time:** ${spec.time}  `,
    `**Total marks:** ${totalMarks}`,
    ``,
    `Part of ${lessonTitle}. You may submit more than once — your trainer gives feedback on your latest submission.`,
  ].join('\n')

  return {
    title: `Assignment — ${lessonTitle}`,
    description,
    dueDate: '2027-01-31T23:59:59Z',
    totalMarks,
    passingScore: Math.ceil(totalMarks * 0.5),
    assignmentType: spec.type ?? 'mixed',
    questions: [
      {
        id: 'q1',
        type: spec.type === 'file' ? 'file' : 'subjective',
        title: spec.goal,
        marks: totalMarks,
        rubric: Object.fromEntries(spec.criteria),
        modelAnswer: spec.expected,
      } satisfies AssignmentQuestion,
    ],
  }
}

/** Assembles the markdown version of a lesson (fallback for non-slide renderers). */
function buildMarkdown(title: string, spec: LessonSpec): string {
  const parts: string[] = [`# ${title}`, '', spec.intro, '', '## Learning Objectives', ...spec.objectives.map(o => `- ${o}`)]
  for (const [heading, body] of spec.teach ?? []) parts.push('', `## ${heading}`, body)
  for (const ex of spec.examples ?? []) {
    parts.push('', `## Example — ${ex.title}`, ex.content)
    if (ex.code) parts.push('', '```' + (ex.language ?? 'jsx'), ex.code, '```')
  }
  if (spec.code) {
    parts.push('', `## ${spec.code.title}`, '```' + spec.code.language, spec.code.code, '```', '', spec.code.explain)
  }
  for (const c of spec.callouts ?? []) parts.push('', `> **${c.title ?? c.type}:** ${c.content}`)
  parts.push('', '## Try It Yourself', spec.tryIt.task, ...spec.tryIt.steps.map(s => `- ${s}`))
  if (spec.tryIt.starter) parts.push('', '```jsx', spec.tryIt.starter, '```')
  if (spec.tryIt.expected) parts.push('', `**Expected result:** ${spec.tryIt.expected}`)
  if (spec.mistakes?.length) parts.push('', '## Common Mistakes', ...spec.mistakes.map(([m, why]) => `- **${m}** — ${why}`))
  if (spec.check) parts.push('', '## Quick Check', spec.check[0], '', ...spec.check[1].map((o, i) => `${i + 1}. ${o}`))
  if (spec.assignment) {
    parts.push('', '## Assignment', `**${spec.assignment.goal}**`, '', ...spec.assignment.requirements.map(r => `- ${r}`))
  }
  parts.push('', '## Lesson Summary', ...spec.summary.map(s => `- ${s}`))
  return parts.join('\n')
}

/**
 * Declares one lesson. Teaching slides are authored explicitly; the structural
 * slides (objectives, try-it, mistakes, quick check, summary) are generated so
 * every lesson is complete without repeating boilerplate in the module files.
 */
export function lesson(title: string, spec: LessonSpec): LessonData {
  const key = slug(title)
  let n = 0
  const next = () => `${key}-s${String(++n).padStart(2, '0')}`
  const slides: LessonSlide[] = []

  slides.push({ id: next(), type: 'title', title, content: spec.intro })
  slides.push({ id: next(), type: 'objectives', title: 'What You Will Learn', items: spec.objectives })
  for (const [heading, body] of spec.teach ?? []) {
    slides.push({ id: next(), type: 'content', title: heading, content: body })
  }
  for (const ex of spec.examples ?? []) {
    slides.push({ id: next(), type: 'example', title: ex.title, example: ex })
  }
  if (spec.code) {
    slides.push({
      id: next(), type: 'code', title: spec.code.title,
      code: spec.code.code, language: spec.code.language, content: spec.code.explain,
    })
  }
  for (const c of spec.callouts ?? []) {
    slides.push({ id: next(), type: 'callout', callout: c })
  }
  slides.push({ id: next(), type: 'try-it', title: 'Try It Yourself', tryIt: spec.tryIt })
  if (spec.mistakes?.length) {
    slides.push({
      id: next(), type: 'mistakes', title: 'Common Mistakes to Avoid',
      items: spec.mistakes.map(([mistake, why]) => `**${mistake}** — ${why}`),
    })
  }
  if (spec.check) {
    slides.push({
      id: next(), type: 'knowledge-check', title: 'Quick Check',
      question: { question: spec.check[0], options: spec.check[1], correctIndex: spec.check[2], explanation: spec.check[3] },
    })
  }
  if (spec.assignment) {
    slides.push({
      id: next(), type: 'assignment', title: spec.assignment.goal,
      items: spec.assignment.requirements,
      content: `**Difficulty:** ${spec.assignment.difficulty} · **Estimated time:** ${spec.assignment.time}`,
    })
  }
  slides.push({ id: next(), type: 'summary', title: 'Lesson Summary', items: spec.summary })

  return {
    title,
    content: buildMarkdown(title, spec),
    duration: spec.duration,
    slides,
    quiz: buildQuiz(title, spec.quiz),
    assignment: spec.assignment ? buildAssignment(spec.assignment, title) : undefined,
  }
}

/** Declares one module from its lessons. */
export function moduleOf(title: string, lessons: LessonData[]): ModuleData {
  return { title, lessons }
}

