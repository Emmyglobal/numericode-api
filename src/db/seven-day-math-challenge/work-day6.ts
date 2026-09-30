import type { ChallengeLessonWork } from './types'

// Day 6 graded work. Verified: 4x+2 = 3x+9 -> x=7; 5a-3 = 2a+9 -> a=4;
// (2x+1)(x-3) = 2x^2-5x-3; (3a-2)(a+4) = 3a^2+10a-8; 3^2 x 3^3 = 3^5;
// 5^0 = 1; 16^(1/4) = 2; log2(32)-log2(8) = 2; log3(1/27) = -3;
// x+y=9, x-y=1 -> (5,4); 5x+2y=21, 2x-y=1 -> (23/9, 37/9);
// x^2-8x+15 -> 3,5; 3x^2-5x-2 -> -1/3, 2.
export const WORK_DAY6: Record<string, ChallengeLessonWork> = {
  'Day 6 — Mixed Revision: Algebra and Indices': {
    quiz: {
      title: 'Day 6 — Check: Algebra and Indices',
      description: 'Three mixed questions on algebra and indices.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Solve 4x + 2 = 3x + 9. What is x?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 7', isCorrect: true },
            { id: 'b', text: 'x = 11', isCorrect: false },
            { id: 'c', text: 'x = 3', isCorrect: false },
            { id: 'd', text: 'x = 2', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Move the letters to one side and the numbers to the other: 4x - 3x = 9 - 2, so x = 7. Check: 4(7) + 2 = 30 and 3(7) + 9 = 30.',
        },
        {
          questionText: 'Expand (2x + 1)(x - 3).',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '2x^2 - 7x - 3', isCorrect: false },
            { id: 'b', text: '2x^2 - 5x - 3', isCorrect: true },
            { id: 'c', text: '2x^2 - 5x + 3', isCorrect: false },
            { id: 'd', text: '2x^2 + 5x - 3', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'Multiply every term by every term: 2x^2 - 6x + x - 3. Collecting gives 2x^2 - 5x - 3.',
        },
        {
          questionText: 'Simplify 3^2 x 3^3.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '3^6', isCorrect: false },
            { id: 'b', text: '3^5', isCorrect: true },
            { id: 'c', text: '9^5', isCorrect: false },
            { id: 'd', text: '3^1', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'Same base, so add the indices: 2 + 3 = 5, giving 3^5.',
        },
      ],
    },
    assignment: {
      title: 'Day 6 Assignment — Algebra and Indices',
      description: 'Write the method you used beside each answer, then check it.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'mixed',
      questions: [
        { id: 'a1', type: 'theory', title: 'Solve and check: (i) 4x + 2 = 3x + 9, (ii) 5a - 3 = 2a + 9.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Expand fully: (i) (2x + 1)(x - 3), (ii) (3a - 2)(a + 4).', marks: 5 },
        { id: 'a3', type: 'theory', title: 'Evaluate, leaving powers in index form: (i) 3^2 x 3^3, (ii) 5^0, (iii) 16^(1/4).', marks: 4 },
      ],
    },
  },
  'Day 6 — Mixed Revision: Logarithms and Equations': {
    quiz: {
      title: 'Day 6 — Check: Logarithms and Equations',
      description: 'Three mixed questions on logarithms, simultaneous equations and quadratics.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Evaluate log base 2 of 32 minus log base 2 of 8.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '2', isCorrect: true },
            { id: 'b', text: '8', isCorrect: false },
            { id: 'c', text: '160', isCorrect: false },
            { id: 'd', text: '3', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'log 32 = 5 and log 8 = 3, so 5 - 3 = 2.',
        },
        {
          questionText: 'Solve x + y = 9 and x - y = 1. What is the value of x?',
          questionType: 'fill_blank',
          correctAnswer: '5',
          points: 1,
          explanation: 'Adding the equations gives 2x = 10, so x = 5. Then x + y = 9 gives y = 4.',
        },
        {
          questionText: 'Factorise x^2 - 9x + 20.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '(x - 4)(x - 5)', isCorrect: true },
            { id: 'b', text: '(x + 4)(x + 5)', isCorrect: false },
            { id: 'c', text: '(x - 2)(x - 10)', isCorrect: false },
            { id: 'd', text: '(x - 1)(x - 20)', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Two numbers multiplying to 20 and adding to -9 are -4 and -5, so (x - 4)(x - 5).',
        },
      ],
    },
    assignment: {
      title: 'Day 6 Assignment — Logarithms and Equations',
      description: 'Convert to index form before solving any logarithm, and check every pair of equations.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'mixed',
      questions: [
        { id: 'a1', type: 'theory', title: 'Evaluate: (i) log base 2 of 32 minus log base 2 of 8, (ii) log base 3 of 1/27.', marks: 4 },
        { id: 'a2', type: 'theory', title: 'Solve: (i) x + y = 9 with x - y = 1, (ii) 5x + 2y = 21 with 2x - y = 1.', marks: 7 },
        { id: 'a3', type: 'theory', title: 'Factorise and solve: (i) x^2 - 8x + 15 = 0, (ii) 3x^2 - 5x - 2 = 0.', marks: 4 },
      ],
    },
  },
  'Day 6 — Mixed Practice and Quiz': {
    assignment: {
      title: 'Day 6 Assignment — Mixed Mathematics Practice',
      description: 'Write the method you used for each part. This is your main revision for the final assessment.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 20,
      passingScore: 10,
      assignmentType: 'mixed',
      questions: [
        { id: 'a1', type: 'theory', title: 'Solve 5a - 3 = 2a + 9, and expand (2x + 1)(x - 3).', marks: 5 },
        { id: 'a2', type: 'theory', title: 'Simplify 3^2 x 3^3, evaluate 5^0, and find 16^(1/4).', marks: 5 },
        { id: 'a3', type: 'theory', title: 'Evaluate log base 2 of 32 minus log base 2 of 8, and find log base 3 of 1/27.', marks: 5 },
        { id: 'a4', type: 'subjective', title: 'Solve 2x + y = 8 with x - y = 1, then factorise and solve x^2 - 8x + 15 = 0.', marks: 5 },
      ],
    },
  },
}
