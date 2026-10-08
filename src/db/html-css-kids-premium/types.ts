// ─── HTML & CSS Adventure for Kids (Premium) — API seed data types ─────────────
// Content shapes for the premium kids course (see content/courses/
// html-css-kids-premium.json). Every field maps 1:1 onto the existing courses →
// modules → lessons → quizzes → quiz_questions → assignments → resources tables
// (there are NO new tables and no JSONB slide fields for this course). Question
// types below are the source types; the seeder maps 'short_answer' → 'essay'
// (the only open-ended type the quiz submission pipeline accepts).
// A lesson's 'slides' are NOT stored as rows: each lesson carries a
// 'Colourful slide show (PowerPoint style)' resource (type 'link') pointing at
// the pre-built HTML deck under content/courses/html-css-kids-slides/.

export type KidsQuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank'

export interface KidsQuizQuestionData {
  id: string
  questionType: KidsQuestionType
  question: string
  options?: Array<{ id: string; text: string; isCorrect: boolean }>
  correctAnswer: string | boolean | null
  explanation: string
}

export interface KidsQuizData {
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: KidsQuizQuestionData[]
}

export interface KidsAssignmentQuestionData {
  id: string
  type: 'theory' | 'subjective' | 'file' | 'code'
  question: string
  marks: number
}

export interface KidsAssignmentData {
  title: string
  description: string
  dueDate: string
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed'
  questions: KidsAssignmentQuestionData[]
}

export interface KidsLessonData {
  id: string
  week: number
  title: string
  learningObjectives: string[]
  content: string
  quiz: KidsQuizData
  assignment: KidsAssignmentData
  resources: Array<{
    id: string
    title: string
    type: 'pdf' | 'video' | 'link' | 'file'
    url: string
    description?: string
  }>
  estimatedDurationMinutes: number
}

export interface KidsModuleData {
  id: string
  title: string
  position: number
  lessons: KidsLessonData[]
}
