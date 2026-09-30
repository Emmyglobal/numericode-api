// ─── 7-Day Mathematics Challenge — seed data types ───────────────────────────
// Content-only shapes for the free-entry course, mirroring the existing
// SS2 Mathematics / HTML & CSS seeders (see ../ss2-mathematics/types.ts).
// No new tables, no new API surface: these map 1:1 onto the existing
// courses / modules / lessons / quizzes / quiz_questions tables.

export interface ChallengeQuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface ChallengeQuizQuestion {
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: ChallengeQuizOption[]
  /** Option id for multiple_choice, or the literal value for true_false/fill_blank. */
  correctAnswer: string
  points?: number
  /** Optional per-question feedback, stored in quiz_questions.explanation. */
  explanation?: string
}

export interface ChallengeQuizData {
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: ChallengeQuizQuestion[]
}

export interface ChallengeLessonData {
  title: string
  duration: number
  /** Markdown body. Plain Unicode maths (x^2, y ∝ x, ÷) — the lesson renderer
   *  has no LaTeX support, so the existing course style is used. */
  content: string
  quiz?: ChallengeQuizData
}

export interface ChallengeModuleData {
  title: string
  lessons: ChallengeLessonData[]
}