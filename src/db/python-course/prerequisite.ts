import type { ModuleData, LessonData } from './types'
const lessons: LessonData[] = []
lessons.push({
  title: 'Pre-requisite Quiz — Programming & Logic Basics',
  duration: 30,
  content: `# Pre-requisite Quiz — Programming & Logic Basics

This quiz is **compulsory**. Score 70% or higher to unlock the Python course.

## Topics Covered
- Basic computer literacy (files, folders, terminal)
- Logical thinking and ordering steps (algorithms)
- Arithmetic and order of operations
- Problem-solving mindset

## Instructions
- 30 minutes, 12 questions.
- Need 70% to pass.`,
  quiz: {
    title: 'Pre-requisite Quiz — Programming & Logic Basics',
    description: 'Compulsory foundations quiz for the Python course.',
    timeLimit: 1800, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'What is a file extension called for a Python program?', questionType: 'multiple_choice', options: [{ id: 'a', text: '.py', isCorrect: true }, { id: 'b', text: '.txt', isCorrect: false }, { id: 'c', text: '.exe', isCorrect: false }, { id: 'd', text: '.doc', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq2', questionText: 'Order of operations: 2 + 3 x 4 equals:', questionType: 'fill_blank', correctAnswer: '14' },
      { id: 'pq3', questionText: 'True or false: a compiler translates code into machine language.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq4', questionText: 'The steps to solve a problem in order are called an:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Algorithm', isCorrect: true }, { id: 'b', text: 'Photo', isCorrect: false }, { id: 'c', text: 'Sentence', isCorrect: false }, { id: 'd', text: 'Color', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq5', questionText: 'A loop that repeats a block a fixed number of times:', questionType: 'fill_blank', correctAnswer: 'for loop' },
      { id: 'pq6', questionText: 'Median of 2, 4, 6, 8, 10 is:', questionType: 'fill_blank', correctAnswer: '6' },
      { id: 'pq7', questionText: 'True or false: the remainder of 7 divided by 2 is 1.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq8', questionText: 'What does a variable do in programming?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Stores a value', isCorrect: true }, { id: 'b', text: 'Deletes a file', isCorrect: false }, { id: 'c', text: 'Draws a picture', isCorrect: false }, { id: 'd', text: 'Connects to WiFi', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq9', questionText: 'x^2 when x=5:', questionType: 'fill_blank', correctAnswer: '25' },
      { id: 'pq10', questionText: 'True or false: indentation is important in many programming languages.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq11', questionText: 'A value that can be true or false is a:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Boolean', isCorrect: true }, { id: 'b', text: 'Integer', isCorrect: false }, { id: 'c', text: 'String', isCorrect: false }, { id: 'd', text: 'Decimal', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq12', questionText: '10 % 3 equals:', questionType: 'fill_blank', correctAnswer: '1' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — Logic Check',
    description: 'Complete these logic checks.',
    dueDate: '2026-09-14T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'a1', type: 'subjective', title: 'Write the steps (algorithm) to make a cup of tea, in order.', marks: 5 }, { id: 'a2', type: 'subjective', title: 'Compute 7 + 3 x 2 - 4 ÷ 2. Show your working.', marks: 5 }, { id: 'a3', type: 'subjective', title: 'What is the remainder (modulo) of 17 ÷ 5?', marks: 5 }, { id: 'a4', type: 'subjective', title: 'Find the mean of 3, 5, 8, 12, 12.', marks: 5 }],
  },
})
export const prerequisiteModule: ModuleData = { title: 'Pre-requisite — Logic & Math Foundations', lessons }
