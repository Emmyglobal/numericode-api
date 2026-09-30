import type { ChallengeLessonWork } from './types'

// Day 7 graded work. Verified: log7(49) = 2; x+y=11, 2x-y=1 -> (4,7);
// x^2-7x+12 -> 3,4; 6x+2 = 3x+20 -> 6; (x+5)(x-2) expands to x^2+3x-10.
export const WORK_DAY7: Record<string, ChallengeLessonWork> = {
  'Day 7 — Final Revision Lesson': {
    quiz: {
      title: 'Day 7 — Check: Final Revision',
      description: 'Three questions, one from each of the last three topics, before the final assessment.',
      timeLimit: 5,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'Find log base 7 of 49.',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: '2', isCorrect: true },
            { id: 'b', text: '7', isCorrect: false },
            { id: 'c', text: '14', isCorrect: false },
            { id: 'd', text: '49', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: '7 x 7 = 49, so 7^2 = 49 and log base 7 of 49 = 2.',
        },
        {
          questionText: 'Solve x + y = 11 and 2x - y = 1. What is the value of x?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 3', isCorrect: false },
            { id: 'b', text: 'x = 4', isCorrect: true },
            { id: 'c', text: 'x = 5', isCorrect: false },
            { id: 'd', text: 'x = 6', isCorrect: false },
          ],
          correctAnswer: 'b',
          points: 1,
          explanation: 'Adding the two equations gives 3x = 12, so x = 4. Then x + y = 11 gives y = 7.',
        },
        {
          questionText: 'Factorise and solve x^2 - 7x + 12 = 0. What are the roots?',
          questionType: 'multiple_choice',
          options: [
            { id: 'a', text: 'x = 3 and x = 4', isCorrect: true },
            { id: 'b', text: 'x = -3 and x = -4', isCorrect: false },
            { id: 'c', text: 'x = 2 and x = 6', isCorrect: false },
            { id: 'd', text: 'x = 1 and x = 12', isCorrect: false },
          ],
          correctAnswer: 'a',
          points: 1,
          explanation: 'Two numbers multiplying to 12 and adding to -7 are -3 and -4, so (x - 3)(x - 4) = 0 giving x = 3 and x = 4.',
        },
      ],
    },
    assignment: {
      title: 'Day 7 Assignment — Final Revision',
      description: 'Your last chance to practise before the assessment. Attempt every part without notes first.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 20,
      passingScore: 10,
      assignmentType: 'mixed',
      questions: [
        { id: 'a1', type: 'theory', title: 'Solve 6x + 2 = 3x + 20, and simplify 8p - 3p + 2.', marks: 5 },
        { id: 'a2', type: 'theory', title: 'Simplify 2^5 / 2^2, and find log base 2 of 64 minus log base 2 of 8.', marks: 5 },
        { id: 'a3', type: 'theory', title: 'Solve the pair 4x - y = 7 and x + y = 8, giving your answer as (x, y).', marks: 5 },
        { id: 'a4', type: 'subjective', title: 'Factorise x^2 + 3x - 10, expand it to check your answer, and state the roots of the equation x^2 + 3x - 10 = 0.', marks: 5 },
      ],
    },
  },
  // The final assessment lesson keeps its own 15-question quiz; assignment only.
  'Day 7 — Final Assessment': {
    assignment: {
      title: 'Day 7 Assignment — Challenge Wrap-Up',
      description: 'After the assessment, write down the two topics you found hardest and one thing you will practise next.',
      dueDate: '2030-12-31T23:59:59Z',
      totalMarks: 10,
      passingScore: 5,
      assignmentType: 'subjective',
      questions: [
        { id: 'a1', type: 'subjective', title: 'Which of the five topics — algebra, indices, logarithms, simultaneous equations or quadratics — did you find hardest, and why?', marks: 4 },
        { id: 'a2', type: 'subjective', title: 'Write down one thing you will practise next, and how you will practise it.', marks: 3 },
        { id: 'a3', type: 'subjective', title: 'In two sentences, describe one thing you can now do that you could not do seven days ago.', marks: 3 },
      ],
    },
  },
}
