// ─── JSS1 Mathematics — shared seed data types ─────────────────────────────
// Content-only data shapes used by the idempotent JSS1 First Term seeder.
// Mirrors the existing SS1 / JSS2 courses pattern (src/db/ss1-first-term/types.ts)
// — no new tables, no new API surface.

export interface Jss1Resource {
  title: string
  type: 'pdf' | 'video' | 'link'
  url: string
  description: string
}

export interface Jss1QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Jss1QuizQuestion {
  id?: string
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: Jss1QuizOption[]
  correctAnswer: string
  explanation?: string
  points?: number
}

export interface Jss1QuizData {
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: Jss1QuizQuestion[]
}

export interface Jss1AssignmentQuestion {
  id: string
  type: 'theory' | 'subjective' | 'file'
  title: string
  marks: number
}

export interface Jss1AssignmentData {
  title: string
  description: string
  dueDate: string
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed'
  questions: Jss1AssignmentQuestion[]
}

export interface Jss1LessonData {
  title: string
  content: string
  duration: number
  quiz: Jss1QuizData
  assignment: Jss1AssignmentData
  resources?: Jss1Resource[]
}

export interface Jss1ModuleData {
  title: string
  lessons: Jss1LessonData[]
}

/** Fixed far-future deadline: an open self-paced course must never look overdue. */
export const JSS1_DUE_DATE = '2030-12-31T23:59:59Z'