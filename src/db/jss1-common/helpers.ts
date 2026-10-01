// ─── Small builders for JSS1 seed content (shared by all three terms) ─────
// The seed modules only need to carry the *content*. Repeating the full option
// object and the correctAnswer for every question doubles the file size and
// invites mistakes, so these helpers build a well-formed question from the parts
// a teacher actually writes. `mc()` takes the correct answer FIRST, which makes
// the answer key impossible to misalign with the options.

import type { Jss1AssignmentData, Jss1AssignmentQuestion, Jss1QuizQuestion } from './types'

const OPTION_IDS = ['a', 'b', 'c', 'd', 'e', 'f']

/**
 * A multiple-choice question. `choices[0]` is the correct answer; the rest are
 * distractors. The correct option is always id "a" and correctAnswer is "a".
 */
export function mc(text: string, choices: string[], explanation: string): Jss1QuizQuestion {
  if (choices.length < 2) throw new Error(`mc() needs a correct answer and at least one distractor: ${text}`)
  return {
    questionText: text,
    questionType: 'multiple_choice',
    options: choices.map((choice, index) => ({
      id: OPTION_IDS[index],
      text: choice,
      isCorrect: index === 0,
    })),
    correctAnswer: 'a',
    explanation,
    points: 1,
  }
}

/** A fill-in-the-blank or short-answer question. */
export function fb(text: string, answer: string, explanation: string): Jss1QuizQuestion {
  return { questionText: text, questionType: 'fill_blank', correctAnswer: answer, explanation, points: 1 }
}

/** A true/false question. */
export function tf(statement: string, isTrue: boolean, explanation: string): Jss1QuizQuestion {
  return {
    questionText: statement,
    questionType: 'true_false',
    correctAnswer: isTrue ? 'true' : 'false',
    explanation,
    points: 1,
  }
}

/** Build a quiz without repeating the settings for every lesson. */
export function quiz(
  title: string,
  description: string,
  questions: Jss1QuizQuestion[],
  timeLimit = 12,
): { title: string; description: string; timeLimit: number; passingScore: number; maxAttempts: number; questions: Jss1QuizQuestion[] } {
  return { title, description, timeLimit, passingScore: 60, maxAttempts: 3, questions }
}

/** Build an assignment, summing the question marks into totalMarks automatically. */
export function assignment(
  title: string,
  description: string,
  questions: Jss1AssignmentQuestion[],
  passingScore = 50,
  assignmentType: 'theory' | 'subjective' | 'file' | 'mixed' = 'theory',
): Jss1AssignmentData {
  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0)
  return {
    title,
    description,
    dueDate: '2030-12-31T23:59:59Z',
    totalMarks,
    passingScore: Math.round(totalMarks * (passingScore / 100)),
    assignmentType,
    questions,
  }
}