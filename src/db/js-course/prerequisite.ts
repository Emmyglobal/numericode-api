import type { ModuleData, LessonData } from './types'
const lessons: LessonData[] = []
lessons.push({
  title: 'Pre-requisite Quiz — Programming Foundations',
  duration: 30,
  content: `# Pre-requisite Quiz — Programming Foundations

This quiz is **compulsory**. Score 70% or higher to unlock the JavaScript course.

## Topics Covered
- Logic and algorithms
- Arithmetic and order of operations
- Problem-solving
- Basic web concepts

## Instructions
- 30 minutes, 12 questions.
- Need 70% to pass.`,
  quiz: {
    title: 'Pre-requisite Quiz — Programming Foundations',
    description: 'Compulsory foundations quiz for the JavaScript course.',
    timeLimit: 1800, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'JavaScript code typically runs in the:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Browser', isCorrect: true }, { id: 'b', text: 'Compass', isCorrect: false }, { id: 'c', text: 'Ruler', isCorrect: false }, { id: 'd', text: 'Camera', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq2', questionText: '2 + 3 * 4 evaluates to:', questionType: 'fill_blank', correctAnswer: '14' },
      { id: 'pq3', questionText: 'True or false: an algorithm must have ordered steps.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq4', questionText: 'A named slot that holds a value is a:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Variable', isCorrect: true }, { id: 'b', text: 'Window', isCorrect: false }, { id: 'c', text: 'Function only', isCorrect: false }, { id: 'd', text: 'File', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq5', questionText: 'Remainder of 17 ÷ 5:', questionType: 'fill_blank', correctAnswer: '2' },
      { id: 'pq6', questionText: 'A sequence of ordered actions is:', questionType: 'fill_blank', correctAnswer: 'algorithm' },
      { id: 'pq7', questionText: 'True or false: an if-statement chooses between paths.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq8', questionText: 'What does a loop do?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Repeats a block', isCorrect: true }, { id: 'b', text: 'Deletes files', isCorrect: false }, { id: 'c', text: 'Opens the network cleaner', isCorrect: false }, { id: 'd', text: 'Sends email', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq9', questionText: 'Median of 2, 4, 5, 6, 8:', questionType: 'fill_blank', correctAnswer: '5' },
      { id: 'pq10', questionText: 'True or false: a boolean holds true or false.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq11', questionText: 'A value like "hello" is a:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'String', isCorrect: true }, { id: 'b', text: 'Number', isCorrect: false }, { id: 'c', text: 'Boolean', isCorrect: false }, { id: 'd', text: 'Null', isCorrect: false }], correctAnswer: 'a' },
      { id: 'pq12', questionText: '7 > 3 evaluates to:', questionType: 'fill_blank', correctAnswer: 'true' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — Foundations Check',
    description: 'Complete these checks.',
    dueDate: '2026-09-14T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'a1', type: 'subjective', title: 'Write ordered steps to prepare a sandwich.', marks: 5 }, { id: 'a2', type: 'subjective', title: 'Evaluate 10 - 2 x 3 + 8 ÷ 2.', marks: 5 }, { id: 'a3', type: 'subjective', title: 'If you repeat a loop 3 times counting 0,1,2, what pattern prints?', marks: 5 }, { id: 'a4', type: 'subjective', title: 'What is the difference between a string and a number?', marks: 5 }],
  },
})
export const prerequisiteModule: ModuleData = { title: 'Pre-requisite — Foundations', lessons }
