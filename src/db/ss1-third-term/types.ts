// ─── SS1 Mathematics Third Term — seed data types ───────────────────────────
// Content-only data shapes used by the idempotent SS1 Third Term seeder.
// Mirrors the existing JSS2 courses pattern — no new tables, no new API surface.

export interface Ss1Resource {
  title: string
  type: 'pdf' | 'video' | 'link'
  url: string
  description: string
}

export interface Ss1QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Ss1QuizQuestion {
  id?: string
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: Ss1QuizOption[]
  correctAnswer: string
  explanation?: string
  points?: number
}

export interface Ss1QuizData {
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: Ss1QuizQuestion[]
}

export interface Ss1AssignmentQuestion {
  id: string
  type: 'theory' | 'subjective' | 'file'
  title: string
  marks: number
}

export interface Ss1AssignmentData {
  title: string
  description: string
  dueDate: string
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed'
  questions: Ss1AssignmentQuestion[]
}

export interface Ss1LessonData {
  title: string
  content: string
  duration: number
  quiz: Ss1QuizData
  assignment: Ss1AssignmentData
  resources?: Ss1Resource[]
}

export interface Ss1ModuleData {
  title: string
  lessons: Ss1LessonData[]
}