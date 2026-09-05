// ─── JSS2 Mathematics First Term — seed data types ─────────────────────────
// Content-only data shapes used by the idempotent JSS2 First Term seeder.
// Mirrors the richer per-lesson quiz + assignment schema used by ml-course,
// python-course, and js-course. Math content is written as plain text /
// inline-code (the Markdown renderer has no LaTeX/MathJax support).

export interface Jss2QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Jss2QuizQuestion {
  id?: string
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: Jss2QuizOption[]
  correctAnswer: string
  explanation?: string
  points?: number
}

export interface Jss2QuizData {
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: Jss2QuizQuestion[]
}

export interface Jss2AssignmentQuestion {
  id: string
  type: 'theory' | 'subjective' | 'file'
  title: string
  marks: number
}

export interface Jss2AssignmentData {
  title: string
  description: string
  dueDate: string
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed'
  questions: Jss2AssignmentQuestion[]
}

export interface Jss2LessonData {
  title: string
  content: string
  duration: number
  quiz: Jss2QuizData
  assignment: Jss2AssignmentData
}

export interface Jss2ModuleData {
  title: string
  lessons: Jss2LessonData[]
}
