// ─── Python Course — shared lesson/module content types ─────────────────────
// Mirrors ml-course/types.ts so the three seed-based courses share one shape.
export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: QuizOption[]
  correctAnswer: string
  explanation?: string // not shown to students; kept for authoring clarity
  points?: number
}

export interface QuizData {
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: QuizQuestion[]
}

export interface AssignmentQuestion {
  id: string
  type: 'theory' | 'subjective' | 'file'
  title: string
  marks: number
}

export interface AssignmentData {
  title: string
  description: string
  dueDate: string // ISO-8601 UTC, e.g. "2026-07-11T23:59:59Z"
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed'
  questions: AssignmentQuestion[]
}

export interface LessonData {
  title: string
  content: string
  duration: number
  quiz: QuizData
  assignment: AssignmentData
}

export interface ModuleData {
  title: string
  lessons: LessonData[]
}
