// ─── Machine Learning — seed data types ────────────────────────────────────
// Content-only data shapes used by the idempotent Machine Learning seeder
// (see ./index.ts). They mirror the existing courses/modules/lessons/
// quizzes/quiz_questions/assignments schema — no new tables, no new API
// surface. Question types are restricted to the auto-gradable subset the
// submit endpoint supports.

export interface MlQuizQuestionData {
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank'
  /** For multiple choice: [{id, text, isCorrect}] */
  options?: Array<{ id: string; text: string; isCorrect: boolean }>
  /** Option id for MC, 'true'/'false' for TF, exact text for fill_blank. */
  correctAnswer: string
  points?: number
}

export interface MlQuizData {
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: MlQuizQuestionData[]
}

export interface MlAssignmentQuestionData {
  id: string
  type: 'theory' | 'subjective' | 'file'
  title: string
  marks: number
}

export interface MlAssignmentData {
  title: string
  /** Flowing text (the student UI renders it as a plain paragraph). */
  description: string
  /** ISO date, e.g. '2026-07-08T23:59:59Z' (assignments.due_date is NOT NULL). */
  dueDate: string
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed'
  questions: MlAssignmentQuestionData[]
}

export interface MlLessonData {
  title: string
  /** Minutes. */
  duration: number
  /** Markdown body (renderer supports headings, lists, HR, bold/italic/inline code). */
  content: string
  quiz: MlQuizData
  assignment: MlAssignmentData
}

export interface MlModuleData {
  title: string
  lessons: MlLessonData[]
}