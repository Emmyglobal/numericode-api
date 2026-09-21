// ─── React Course — shared lesson/module content types ─────────────────────────
// Mirrors js-course/types.ts so the seed-based courses share one shape.
// Extended with `slides` for the slide-based lesson viewer.

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
  explanation?: string
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
  rubric?: Record<string, number>
  modelAnswer?: string
}

export interface AssignmentData {
  title: string
  description: string
  dueDate: string // ISO-8601 UTC
  totalMarks: number
  passingScore: number
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed'
  questions: AssignmentQuestion[]
}

export type SlideType = 'title' | 'objectives' | 'content' | 'example' | 'code'
  | 'callout' | 'try-it' | 'mistakes' | 'knowledge-check' | 'summary' | 'assignment'

export interface SlideCallout {
  type: 'tip' | 'warning' | 'note'
  title?: string
  content: string
}

export interface SlideExample {
  title?: string
  content: string
  code?: string
  language?: string
}

export interface SlideTryIt {
  task: string
  steps: string[]
  starter?: string
  expected?: string
}

export interface SlideCheck {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface LessonSlide {
  id: string
  type: SlideType
  title?: string
  content?: string   // markdown text for content / example slides
  items?: string[]   // bullet lists (objectives, mistakes, summary)
  code?: string      // code snippet for code slides
  language?: string  // e.g. 'jsx', 'javascript', 'html', 'css'
  callout?: SlideCallout
  example?: SlideExample
  tryIt?: SlideTryIt
  question?: SlideCheck
}

export interface LessonData {
  title: string
  content: string   // markdown summary (used as fallback / notes)
  duration: number  // minutes
  slides: LessonSlide[]
  quiz: QuizData
  assignment?: AssignmentData
}

export interface ModuleData {
  title: string
  lessons: LessonData[]
}
