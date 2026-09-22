// ─── HTML & CSS Fundamentals — seed data types ───────────────────────────────
// Content-only data shapes used by the idempotent HTML & CSS Fundamentals
// seeder (see ./index.ts). Mirrors the existing courses/modules/lessons/
// quizzes/quiz_questions/assignments schema — no new tables, no new API
// surface. Question types are restricted to the subset the submit endpoint
// supports ('essay' is stored but not auto-graded, matching final-exam needs).
//
// Unlike math-to-coding, lessons here contain HTML/CSS code samples as
// fenced code blocks inside Markdown content. The Markdown renderer
// (see numerycode/src/components/ui/Markdown.tsx) must render these as
// <pre><code> blocks with syntax highlighting.

export interface HcfQuizQuestionData {
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay'
  /** For multiple choice: [{id, text, isCorrect}] */
  options?: Array<{ id: string; text: string; isCorrect: boolean }>
  /** Option id for MC, 'true'/'false' for TF, exact text for fill_blank, NULL for essay. */
  correctAnswer: string | null
  points?: number
}

export interface HcfQuizData {
  title: string
  description: string
  /** Minutes. */
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: HcfQuizQuestionData[]
}

export interface HcfAssignmentQuestionData {
  id: string
  type: 'theory' | 'subjective' | 'file',
  title: string
  marks: number
}

export interface HcfAssignmentData {
  title: string
  /** Flowing text (the student UI renders it as a plain paragraph). */
  description: string
  /** ISO date, e.g. '2026-10-18T23:59:59Z' (assignments.due_date is NOT NULL). */
  dueDate: string
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed',
  questions: HcfAssignmentQuestionData[]
}

export interface HcfLessonData {
  title: string
  /** Minutes. */
  duration: number
  /** Markdown body (renderer supports headings, lists, HR, bold/italic/inline code, fenced code blocks). */
  content: string
  quiz: HcfQuizData
}

export interface HcfModuleData {
  title: string
  lessons: HcfLessonData[]
  /** One graded assignment per graded module (Modules 1-10) + the capstone (Module 11). */
  assignment?: HcfAssignmentData
}
