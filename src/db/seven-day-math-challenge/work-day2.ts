import type { ChallengeLessonWork } from './types'

// Day 2 graded work. Verified: index of 5^3 is 3; 7x7x7x7 = 7^4; 10^2 = 100;
// 2^4 x 2^3 = 2^7; 3^6/3^2 = 3^4; (x^2)^4 = x^8; (2^4 x 2^3)/2^2 = 2^5;
// 5^x = 25 -> x=2; 3^2 x 3^2 / 3 = 3^3; 4^3 = 64 so the number is 4; 64^(1/2)=8.
export const WORK_DAY2: Record<string, ChallengeLessonWork> = {
  'Day 2 — Meaning of Indices': {
    quiz: {
      title: 'Day 2 — Check: Meaning of Indices',
      description: 'Three quick questions on reading index notation.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'In 5^3, what is the index (power)?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '5', isCorrect: false },
            { id: 'b', text: '3', isCorrect: true },
            { id: 'c', text: '8', isCorrect: false },
            { id: 'd', text: '15', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'The base is 5 and the index is 3, because 5^3 means 5 x 5 x 5.',
        },
        {
          questionText: 'Write 7 x 7 x 7 x 7 in index form. (For example: 9^3)',
          questionType: 'fill_blank',
          correctAnswer: '7^4',
          points: 1,
          explanation: 'There are four sevens being multiplied, so the index is 4: 7^4.',
        },
        {
          questionText: 'What is the value of 10^2?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '20', isCorrect: false },
            { id: 'b', text: '100', isCorrect: true },
            { id: 'c', text: '4', isCorrect: false },
            { id: 'd', text: '12', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: '10^2 means 10 x 10, which is 100.',
        },
      ],
    },
    assignment: {
      title: 'Day 2 Assignment — Meaning of Indices',
      description: 'Write each expression in index form, then write the index form back out in full to check yourself.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Write in index form: (i) 6 x 6 x 6, (ii) 3 x 3 x 3 x 3 x 3, (iii) 2 x 2 x 2.', marks: 5 },
        { id: 'a2', type: 'theory', title: 'Write 9^4 out in full as repeated multiplication.', marks: 4 },
        { id: 'a3', type: 'subjective', title: 'A number cubed is 64. What is the number, and how can you be sure of your answer?', marks: 6 },
      ],
    },
  },
  'Day 2 — Laws of Indices': {
    quiz: {
      title: 'Day 2 — Check: Laws of Indices',
      description: 'Three quick questions on the three laws of indices.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Simplify 2^4 x 2^3.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '2^7', isCorrect: true },
            { id: 'b', text: '2^12', isCorrect: false },
            { id: 'c', text: '4^7', isCorrect: false },
            { id: 'd', text: '128', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Same base, so add the indices: 2^(4+3) = 2^7. 2^7 is also 128, but 2^7 is the simplest index form.',
        },
        {
          questionText: 'Simplify 3^6 / 3^2.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '3^4', isCorrect: true },
            { id: 'b', text: '3^8', isCorrect: false },
            { id: 'c', text: '3^3', isCorrect: false },
            { id: 'd', text: '3^12', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Dividing powers with the same base subtracts the indices: 3^(6-2) = 3^4.',
        },
        {
          questionText: 'Simplify (x^2)^4.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x^8', isCorrect: true },
            { id: 'b', text: 'x^6', isCorrect: false },
            { id: 'c', text: '2x^4', isCorrect: false },
            { id: 'd', text: 'x^4', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'A power raised to a power multiplies the indices: 2 x 4 = 8, so the answer is x^8.',
        },
      ],
    },
    assignment: {
      title: 'Day 2 Assignment — Laws of Indices',
      description: 'State which law you used for each simplification.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Simplify, stating the law used: (i) 4^2 x 4^3, (ii) 5^6 / 5^2, (iii) (2^2)^3, (iv) 10^5 x 10 x 10.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Evaluate each: (i) 2^0, (ii) 7^1, (iii) 3^-2, (iv) 25^(1/2).', marks: 5 },
        { id: 'a3', type: 'subjective', title: 'A square has an area of 64 cm^2. Find the length of its side, and say which law of indices you used.', marks: 4 },
      ],
    },
  },
  'Day 2 — Applying the Laws of Indices': {
    quiz: {
      title: 'Day 2 — Check: Applying the Laws of Indices',
      description: 'Three quick questions on using the laws in full expressions.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Simplify (2^4 x 2^3) / 2^2.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '2^5', isCorrect: true },
            { id: 'b', text: '2^9', isCorrect: false },
            { id: 'c', text: '2^3', isCorrect: false },
            { id: 'd', text: '2^1', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Multiply first: 2^4 x 2^3 = 2^7. Then divide: 2^7 / 2^2 = 2^(7-2) = 2^5.',
        },
        {
          questionText: 'Solve for x: 5^x = 25',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 1', isCorrect: false },
            { id: 'b', text: 'x = 2', isCorrect: true },
            { id: 'c', text: 'x = 5', isCorrect: false },
            { id: 'd', text: 'x = 25', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'Write 25 in index form: 25 = 5^2. So 5^x = 5^2 and x = 2.',
        },
        {
          questionText: 'Simplify 3^2 x 3^2 / 3.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '3^3', isCorrect: true },
            { id: 'b', text: '27', isCorrect: false },
            { id: 'c', text: '3^2', isCorrect: false },
            { id: 'd', text: '3^4', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: '3 is really 3^1, so the expression is 3^(2+2-1) = 3^3, which is 27. Both are the same value, but 3^3 is the simplified form.',
        },
      ],
    },
    assignment: {
      title: 'Day 2 Assignment — Applying the Laws of Indices',
      description: 'Leave every expression as a power where possible, and convert back to index form before solving.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'theory',
      questions: [
        { id: 'a1', type: 'theory', title: 'Simplify fully: (i) (2^4 x 2^3) / 2^2, (ii) 3^2 x 3^2 / 3, (iii) 5^2 x 5 x 5^3.', marks: 6 },
        { id: 'a2', type: 'theory', title: 'Solve for x: (i) 5^x = 25, (ii) 2^(x+1) = 16, (iii) 3^x = 27.', marks: 5 },
        { id: 'a3', type: 'theory', title: 'Explain why 5^0 equals 1, using the fact that 5^3 divided by 5^3 must equal 5^0.', marks: 4 },
      ],
    },
  },
  'Day 2 — Practice and Quiz': {
    assignment: {
      title: 'Day 2 Assignment — Indices Practice',
      description: 'Complete the Day 2 practice questions, then answer these in full.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 15,
      passingScore: 7,
      assignmentType: 'mixed',
      questions: [
        { id: 'a1', type: 'theory', title: 'Write 6 x 6 x 6 in index form, and name the base and the index.', marks: 3 },
        { id: 'a2', type: 'theory', title: 'Simplify 2^4 x 2^3, and then 9^6 / 9^2.', marks: 5 },
        { id: 'a3', type: 'subjective', title: 'Simplify (3^2)^3, and find the value of 4^-2. Show both steps.', marks: 7 },
      ],
    },
  },
}
