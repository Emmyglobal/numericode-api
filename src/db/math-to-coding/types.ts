// ─── Mathematics to Coding — seed data types ────────────────────────────────
// Content-only data shapes used by the idempotent Mathematics to Coding
// seeder (see ./index.ts). They mirror the existing courses/modules/lessons/
// quizzes/quiz_questions/assignments schema — no new tables, no new API
// surface. Question types are restricted to the subset the submit endpoint
// supports ('essay' is stored but not auto-graded, matching final-exam needs).

export interface M2cQuizQuestionData {
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay'
  /** For multiple choice: [{id, text, isCorrect}] */
  options?: Array<{ id: string; text: string; isCorrect: boolean }>
  /** Option id for MC, 'true'/'false' for TF, exact text for fill_blank, NULL for essay. */
  correctAnswer: string | null
  points?: number
}

export interface M2cQuizData {
  title: string
  description: string
  /** Minutes. */
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: M2cQuizQuestionData[]
}

export interface M2cAssignmentQuestionData {
  id: string
  type: 'theory' | 'subjective' | 'file',
  title: string
  marks: number
}

export interface M2cAssignmentData {
  title: string
  /** Flowing text (the student UI renders it as a plain paragraph). */
  description: string
  /** ISO date, e.g. '2026-10-18T23:59:59Z' (assignments.due_date is NOT NULL). */
  dueDate: string
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed',
  questions: M2cAssignmentQuestionData[]
}

export interface M2cLessonData {
  title: string
  /** Minutes. */
  duration: number
  /** Markdown body (renderer supports headings, lists, HR, bold/italic/inline code). */
  content: string
  quiz: M2cQuizData
}

export interface M2cModuleData {
  title: string
  lessons: M2cLessonData[]
  /** One graded assignment per graded module (Modules 1-10) + the capstone (Module 11). */
  assignment?: M2cAssignmentData
}