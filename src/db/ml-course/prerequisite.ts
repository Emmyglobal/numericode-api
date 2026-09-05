import type { MlModuleData, MlLessonData } from './types'
const lessons: MlLessonData[] = []
lessons.push({
  title: 'Pre-requisite Quiz — Python & Math Foundations',
  duration: 30,
  content: `# Pre-requisite Quiz — Python & Math Foundations

This quiz is **compulsory**. You must score 70% or higher to unlock the rest of the Machine Learning course.

## Topics Covered
- Basic Python (variables, lists, functions)
- Core statistics (mean, median, mode, variance)
- Basic algebra and coordinate geometry
- Data concepts (rows, columns, features, target)

## Instructions
- 30 minutes, 12 questions.
- Need 70% to pass.
- Master these basics before diving into models.`,
  quiz: {
    title: 'Pre-requisite Quiz — Python & Math Foundations',
    description: 'Compulsory foundations quiz. Score 70% to unlock the course.',
    timeLimit: 1800, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'pq1', questionText: 'What does `prices = [1, 2, 3]` create in Python?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A number', isCorrect: false }, { id: 'b', text: 'A list', isCorrect: true }, { id: 'c', text: 'A dictionary', isCorrect: false }, { id: 'd', text: 'A function', isCorrect: false }], correctAnswer: 'b' },
      { id: 'pq2', questionText: 'The mean of 2, 4, 6, 8 is:', questionType: 'fill_blank', correctAnswer: '5' },
            { id: 'pq3', questionText: 'Which keyword defines a Python function?', questionType: 'fill_blank', correctAnswer: 'def' },
      { id: 'pq4', questionText: 'In a dataset, the column we predict is called the:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Feature', isCorrect: false }, { id: 'b', text: 'Target', isCorrect: true }, { id: 'c', text: 'Index', isCorrect: false }, { id: 'd', text: 'Label row', isCorrect: false }], correctAnswer: 'b' },
      { id: 'pq5', questionText: 'True or false: the slope of a line y = 3x + 2 is 3.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq6', questionText: 'The median of 2, 4, 6, 8, 10 is:', questionType: 'fill_blank', correctAnswer: '6' },
      { id: 'pq7', questionText: 'pandas is used primarily for:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Web servers', isCorrect: false }, { id: 'b', text: 'Tabular data analysis', isCorrect: true }, { id: 'c', text: 'Animation', isCorrect: false }, { id: 'd', text: 'Compiling', isCorrect: false }], correctAnswer: 'b' },
      { id: 'pq8', questionText: 'True or false: a scatter plot shows the relationship between two variables.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'pq9', questionText: '2 to the power 3 (2^3) equals:', questionType: 'fill_blank', correctAnswer: '8' },
      { id: 'pq10', questionText: 'The distance formula between (0,0) and (3,4) is:', questionType: 'fill_blank', correctAnswer: '5' },
      { id: 'pq11', questionText: 'True or false: correlation implies causation.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'pq12', questionText: 'Which holds 100 values in one name in Python?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'list', isCorrect: true }, { id: 'b', text: 'float', isCorrect: false }, { id: 'c', text: 'bool', isCorrect: false }, { id: 'd', text: 'NoneType', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Pre-requisite Assignment — Foundations Check',
    description: 'Complete these foundation checks before the course.',
    dueDate: '2026-09-14T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'a1', type: 'theory', title: 'Fix the Python bug: print("total: " + 5). What is the correct line?', marks: 5 }, { id: 'a2', type: 'subjective', title: 'Compute the mean, median and mode of: 3, 5, 5, 7, 9.', marks: 5 }, { id: 'a3', type: 'subjective', title: 'For y = 2x - 1, find y when x = 4, and the slope.', marks: 5 }, { id: 'a4', type: 'subjective', title: 'In one sentence, what is a "feature" in a dataset?', marks: 5 }],
  },
})
export const prerequisiteModule: MlModuleData = { title: 'Pre-requisite — Foundations', lessons }
