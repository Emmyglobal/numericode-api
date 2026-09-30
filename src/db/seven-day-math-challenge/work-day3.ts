import type { ChallengeLessonWork } from './types'

// Day 3 graded work. Verified: index of 3^4 is 4; 3^4 = 81 so log base 3 of 81
// = 4; log 100 = 2; log 8 + log 2 = 4 log 2; log 32 - log 8 = 2; 3^-3 = 1/27 so
// log base 3 of 1/27 = -3; log base 2 of x = 5 -> x = 32.
export const WORK_DAY3: Record<string, ChallengeLessonWork> = {
  'Day 3 — What Logarithms Mean': {
    quiz: {
      title: 'Day 3 — Check: What Logarithms Mean',
      description: 'Three quick questions on reading and converting logarithms.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Find log base 3 of 81.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '3', isCorrect: false },
            { id: 'b', text: '4', isCorrect: true },
            { id: 'c', text: '6', isCorrect: false },
            { id: 'd', text: '27', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: '3 x 3 = 9 and 3 x 3 x 3 x 3 = 81, so 3^4 = 81 and log base 3 of 81 = 4.',
        },
        {
          questionText: 'What is log 100 when no base is written? (School mathematics uses base 10.)',
          questionType: 'fill_blank',
          correctAnswer: '2',
          points: 1,
          explanation: 'log 100 means log base 10 of 100. Since 10 x 10 = 100, we have 10^2 = 100, so the answer is 2.',
        },
        {
          questionText: 'Which statement is equivalent to 2^5 = 32?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'log base 32 of 2 = 5', isCorrect: false },
            { id: 'b', text: 'log base 2 of 32 = 5', isCorrect: true },
            { id: 'c', text: 'log base 5 of 32 = 2', isCorrect: false },
            { id: 'd', text: 'log base 2 of 5 = 32', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'The index form is base^index = answer, so 2^5 = 32. The matching logarithmic form puts the base first: log base 2 of 32 = 5.',
        },
      ],
    },
    assignment: {
      title: 'Day 3 Assignment — What Logarithms Mean',
      description: 'Convert between index form and logarithmic form, and always state the base you are using.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Write each in index form: (i) log base 2 of 16, (ii) log base 10 of 1000, (iii) log base 5 of 125.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Write each in logarithmic form: (i) 4^3 = 64, (ii) 10^5 = 100000, (iii) 2^10 = 1024.', marks: 5 },
        { id: 'a3', type: 'subjective', title: 'In your own words, explain the difference between the index form 2^3 = 8 and the logarithmic form log base 2 of 8 = 3.', marks: 4 },
      ],
    },
  },
  'Day 3 — Basic Laws of Logarithms': {
    quiz: {
      title: 'Day 3 — Check: Basic Laws of Logarithms',
      description: 'Three quick questions on the three laws of logarithms.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Evaluate log base 2 of (32 / 8).',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '2', isCorrect: true },
            { id: 'b', text: '4', isCorrect: false },
            { id: 'c', text: '40', isCorrect: false },
            { id: 'd', text: '3', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Use the quotient law: log 32 - log 8 = 5 - 3 = 2.',
        },
        {
          questionText: 'Evaluate log base 3 of 27^2.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '6', isCorrect: true },
            { id: 'b', text: '9', isCorrect: false },
            { id: 'c', text: '3', isCorrect: false },
            { id: 'd', text: '81', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Use the power law: log of 27^2 = 2 x log 27 = 2 x 3 = 6.',
        },
        {
          questionText: 'Condense into a single logarithm: log base 2 of 2 + log base 2 of 4',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'log base 2 of 6', isCorrect: false },
            { id: 'b', text: 'log base 2 of 8', isCorrect: true },
            { id: 'c', text: 'log base 2 of 4', isCorrect: false },
            { id: 'd', text: 'log base 2 of 2', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'A sum becomes a product: log 2 + log 4 = log (2 x 4) = log 8.',
        },
      ],
    },
    assignment: {
      title: 'Day 3 Assignment — Basic Laws of Logarithms',
      description: 'Name the law you use for each part. All logarithms in one calculation must share the same base.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Evaluate, stating the law used: (i) log base 2 of 16 + log base 2 of 8, (ii) log base 3 of 81 - log base 3 of 3, (iii) log base 5 of 25^3.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Expand into sums of logarithms: (i) log base 2 of 32, (ii) log base 10 of 1000, (iii) log base 3 of 81.', marks: 5 },
        { id: 'a3', type: 'theory', title: 'Why must the two logarithms in log M + log N have the same base? Give one sentence.', marks: 4 },
      ],
    },
  },
  'Day 3 — Simple Logarithmic Calculations': {
    quiz: {
      title: 'Day 3 — Check: Simple Logarithmic Calculations',
      description: 'Three quick questions on solving logarithmic equations.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Solve for x: log base 2 of x = 5',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 16', isCorrect: false },
            { id: 'b', text: 'x = 32', isCorrect: true },
            { id: 'c', text: 'x = 25', isCorrect: false },
            { id: 'd', text: 'x = 64', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'Convert to index form: 2^5 = x. Since 2 x 2 x 2 x 2 x 2 = 32, x = 32.',
        },
        {
          questionText: 'Solve for x: log 100 of x = 2. (Enter a number only)',
          questionType: 'fill_blank',
          correctAnswer: '100',
          points: 1,
          explanation: 'log 100 means log base 10. In index form, 10^2 = x, so x = 100.',
        },
        {
          questionText: 'Find x if log base 2 of 64 = x.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 4', isCorrect: false },
            { id: 'b', text: 'x = 6', isCorrect: true },
            { id: 'c', text: 'x = 8', isCorrect: false },
            { id: 'd', text: 'x = 2', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: '2, 4, 8, 16, 32, 64 is 2^6, so log base 2 of 64 = 6.',
        },
      ],
    },
    assignment: {
      title: 'Day 3 Assignment — Simple Logarithmic Calculations',
      description: 'Convert each equation to index form before solving, and check your answer by putting it back.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Solve for x: (i) log base 5 of x = 2, (ii) log base 2 of x = 6, (iii) log base 3 of x = 4.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Find the missing value: (i) log base 2 of 32, (ii) log 1000, (iii) log base 7 of 343.', marks: 5 },
        { id: 'a3', type: 'subjective', title: 'Sound level is measured by L = 10 log base 10 of (I / I0). If a sound is 1000 times as intense as the reference, find L.', marks: 4 },
      ],
    },
  },
  'Day 3 — Practice and Quiz': {
    assignment: {
      title: 'Day 3 Assignment — Logarithms Practice',
      description: 'Correct any Day 3 quiz mistakes first, then answer these in full.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'mixed',
      questions: [
        { id: 'a1', type: 'theory', title: 'Write log base 3 of 81 in index form and give the value.', marks: 3 },
        { id: 'a2', type: 'theory', title: 'Find log base 5 of 125, then evaluate log base 2 of (32 / 8).', marks: 5 },
        { id: 'a3', type: 'subjective', title: 'Solve log 1000 of x = 3, and expand log base 2 of 16 into a sum of logarithms. Show both answers.', marks: 7 },
      ],
    },
  },
}
