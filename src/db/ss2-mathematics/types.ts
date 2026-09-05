// ─── SS2 Mathematics — First Term: seed data types ───────────────────────────
// Content-only data shapes used by the idempotent SS2 Mathematics seeder
// (see ./index.ts). They mirror the existing courses/modules/lessons schema —
// no new tables, no new API surface.

export interface Ss2LessonData {
  title: string
  duration: number
  content: string
  // Optional per-lesson quiz (inserted into the quizzes/quiz_questions tables).
  quiz?: Ss2QuizData
  // Optional per-lesson assignment (inserted into the assignments table).
  assignment?: Ss2AssignmentData
}

export interface Ss2ModuleData {
  title: string
  lessons: Ss2LessonData[]
}

// ── Per-lesson quiz shape (matches ml-course — auto-gradable types only) ─────
export interface Ss2QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Ss2QuizQuestion {
  id: string
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: Ss2QuizOption[]
  correctAnswer: string
  points?: number
}

export interface Ss2QuizData {
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: Ss2QuizQuestion[]
}

// ── Per-lesson assignment shape ───────────────────────────────────────────────
export interface Ss2AssignmentQuestion {
  id: string
  type: 'theory' | 'subjective' | 'file'
  title: string
  marks: number
}

export interface Ss2AssignmentData {
  title: string
  description: string
  dueDate: string
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed'
  questions: Ss2AssignmentQuestion[]
}

// ── Extras bundle: practical exercise + quiz + assignment per lesson ─────────
// Keyed by exact lesson title in ./lesson-extras-*.ts; merged by the seeder.
export interface Ss2LessonExtras {
  // Markdown appended to the lesson body (a hands-on "Practical Exercise").
  exercise: string
  quiz: Ss2QuizData
  assignment: Ss2AssignmentData
}
