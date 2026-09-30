import type { ChallengeLessonWork } from './types'

// Day 5 graded work. Verified: highest power of 3x+9=0 is 1 (linear); in
// x^2-7x+10, a=1 b=-7 c=10; (x-2)(x+3) expands to x^2+x-6; x^2-5x+6 -> 2,3;
// 2x^2-9x+4 -> 0.5,4; a quadratic has at most two roots.
export const WORK_DAY5: Record<string, ChallengeLessonWork> = {
  'Day 5 — Understanding Quadratic Equations': {
    quiz: {
      title: 'Day 5 — Check: Understanding Quadratic Equations',
      description: 'Three quick questions on recognising and reading a quadratic.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Which of these is a quadratic equation?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '3x + 9 = 0', isCorrect: false },
            { id: 'b', text: 'x^2 + 4x + 1 = 0', isCorrect: true },
            { id: 'c', text: 'x^3 - 8 = 0', isCorrect: false },
            { id: 'd', text: '2y + 5 = 7', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'A quadratic equation has the unknown squared. Only x^2 + 4x + 1 = 0 has the unknown to power 2.',
        },
        {
          questionText: 'In the standard form x^2 - 7x + 10 = 0, what is b?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '1', isCorrect: false },
            { id: 'b', text: '-7', isCorrect: true },
            { id: 'c', text: '10', isCorrect: false },
            { id: 'd', text: '2', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'In ax^2 + bx + c = 0 we read off a = 1, b = -7 and c = 10. The sign belongs to the coefficient.',
        },
        {
          questionText: 'How many roots can a quadratic equation have at most? (Enter a number only)',
          questionType: 'fill_blank',
          correctAnswer: '2',
          points: 1,
          explanation: 'A quadratic equation has at most two roots. It may have two, one repeated root, or none.',
        },
      ],
    },
    assignment: {
      title: 'Day 5 Assignment — Understanding Quadratic Equations',
      description: 'State which equations are quadratic and which are not, and give your reason each time.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'State whether each is quadratic or linear, giving the highest power of the unknown: (i) 4x + 9 = 0, (ii) x^2 - 6x + 4 = 0, (iii) x^3 - 1 = 0, (iv) 2x^2 = 18.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Write each equation in the standard form ax^2 + bx + c = 0 and state a, b and c: (i) 2x^2 - 5x - 3 = 0, (ii) x^2 + 6 = 4x.', marks: 5 },
        { id: 'a3', type: 'theory', title: 'Explain how you would check whether x = 2 is a root of x^2 - 5x + 6 = 0.', marks: 4 },
      ],
    },
  },
  'Day 5 — Factorisation': {
    quiz: {
      title: 'Day 5 — Check: Factorisation',
      description: 'Three quick questions on factoring and solving by factorization.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Factorise x^2 - 5x + 6.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '(x - 2)(x - 3)', isCorrect: true },
            { id: 'b', text: '(x + 2)(x + 3)', isCorrect: false },
            { id: 'c', text: '(x - 1)(x - 6)', isCorrect: false },
            { id: 'd', text: '(x - 2)(x + 3)', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'We need two numbers multiplying to 6 and adding to -5: that is -2 and -3, so (x - 2)(x - 3).',
        },
        {
          questionText: 'Solve x^2 - 5x + 6 = 0. What are the roots?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 2 and x = 3', isCorrect: true },
            { id: 'b', text: 'x = -2 and x = -3', isCorrect: false },
            { id: 'c', text: 'x = 1 and x = 6', isCorrect: false },
            { id: 'd', text: 'x = 2 and x = -3', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: '(x - 2)(x - 3) = 0, so x - 2 = 0 giving x = 2, or x - 3 = 0 giving x = 3.',
        },
        {
          questionText: 'Solve 2x^2 - 9x + 4 = 0. What is the larger root? (Enter a number only)',
          questionType: 'fill_blank',
          correctAnswer: '4',
          points: 1,
          explanation: 'Factorise: (2x - 1)(x - 4) = 0, so x = 1/2 or x = 4. The larger root is 4.',
        },
      ],
    },
    assignment: {
      title: 'Day 5 Assignment — Factorisation',
      description: 'For each factorisation, first state the two numbers you chose and how they multiply and add.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Factorise each: (i) x^2 + 9x + 20, (ii) x^2 - 5x + 6, (iii) x^2 - 9x + 20.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Solve by factorisation: (i) x^2 + 5x + 6 = 0, (ii) x^2 - 5x + 6 = 0.', marks: 5 },
        { id: 'a3', type: 'subjective', title: 'A quadratic cannot be factorised neatly when no pair of numbers multiplies to c and adds to b. Describe one case where this happens, and say which method you would use instead.', marks: 4 },
      ],
    },
  },
  'Day 5 — Solving Quadratic Equations': {
    quiz: {
      title: 'Day 5 — Check: Solving Quadratic Equations',
      description: 'Three quick questions on the quadratic formula and its answers.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'In the formula x = (-b +/- sqrt(b^2 - 4ac)) / 2a, what goes in the denominator?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '2b', isCorrect: false },
            { id: 'b', text: '2a', isCorrect: true },
            { id: 'c', text: 'a', isCorrect: false },
            { id: 'd', text: '2c', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'The denominator is 2a, where a is the coefficient of x^2.',
        },
        {
          questionText: 'Solve 2x^2 + 7x + 3 = 0. What is the larger root?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = -1/2', isCorrect: true },
            { id: 'b', text: 'x = -3', isCorrect: false },
            { id: 'c', text: 'x = 3', isCorrect: false },
            { id: 'd', text: 'x = 1/2', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'b^2 - 4ac = 49 - 24 = 25, sqrt = 5. So x = (-7 + 5)/4 = -1/2 or x = (-7 - 5)/4 = -3. The larger is -1/2.',
        },
        {
          questionText: 'Solve x^2 - 6x + 9 = 0. What are the roots?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 3 and x = 3 (a repeated root)', isCorrect: true },
            { id: 'b', text: 'x = 3 and x = -3', isCorrect: false },
            { id: 'c', text: 'x = 6 and x = 9', isCorrect: false },
            { id: 'd', text: 'x = 1 and x = 9', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'x^2 - 6x + 9 = (x - 3)^2, so x - 3 = 0 and x = 3 appears twice. This is a repeated root.',
        },
      ],
    },
    assignment: {
      title: 'Day 5 Assignment — Solving Quadratic Equations',
      description: 'For each part, state a, b and c first, then b^2 - 4ac, then both roots from the +/-.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Solve using the quadratic formula, showing every step: (i) 2x^2 + 7x + 3 = 0, (ii) x^2 - 4x - 5 = 0.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Solve each, choosing the quickest method: (i) 2x^2 - 7x + 3 = 0, (ii) x^2 - 6x + 9 = 0.', marks: 5 },
        { id: 'a3', type: 'subjective', title: 'The product of two consecutive numbers is 156. Find the two numbers, showing the quadratic you formed and how you solved it.', marks: 4 },
      ],
    },
  },
  'Day 5 — Practice and Quiz': {
    assignment: {
      title: 'Day 5 Assignment — Quadratic Equations Practice',
      description: 'Review your Day 5 quiz corrections, then answer these in full.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'mixed',
      questions: [
        { id: 'a1', type: 'theory', title: 'State the values of a, b and c in 2x^2 - 9x + 4 = 0.', marks: 3 },
        { id: 'a2', type: 'theory', title: 'Factorise and solve x^2 - 5x + 6 = 0, showing the two numbers you used.', marks: 5 },
        { id: 'a3', type: 'subjective', title: 'Solve 2x^2 + 7x + 3 = 0 using the quadratic formula, then confirm your answer by factorising instead.', marks: 7 },
      ],
    },
  },
}
