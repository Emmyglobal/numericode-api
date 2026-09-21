import type { M2cModuleData } from './types'

// Module 4 — Sequences, Iteration & Series
// Module objectives: recognize numeric patterns and translate them into loops.

export const module04: M2cModuleData = {
  title: 'Module 4 — Sequences, Iteration & Series',
  lessons: [
    {
      title: 'Sequences & Patterns (Arithmetic, Geometric)',
      duration: 30,
      content: `## Learning Objectives\n- Identify arithmetic and geometric sequences.\n- Find the nth term formula.\n\n## Sequences\n- **Arithmetic:** constant difference between terms. nth term = a + (n-1)d.\n- **Geometric:** constant ratio between terms.\n\n## Key Takeaways\n- 2,5,8,11 has common difference 3 -> next is 14.\n- 3,6,12,24 has common ratio 2.\n- nth term of arithmetic = a + (n-1)d.`,
      quiz: {
        title: 'Quiz 4.1 — Sequences & Patterns',
        description: 'Three questions on arithmetic and geometric sequences.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Next term in 2,5,8,11?', questionType: 'fill_blank', correctAnswer: '14' },
          { questionText: 'Common ratio in 3,6,12,24?', questionType: 'fill_blank', correctAnswer: '2' },
          { questionText: 'nth term formula for arithmetic sequence with first term a and common difference d', questionType: 'fill_blank', correctAnswer: 'a + (n-1)d' },
        ],
      },
    },
    {
      title: 'Summation Notation (Σ) & Series',
      duration: 35,
      content: `## Learning Objectives\n- Read Σ notation.\n- Compute sums of sequences.\n\n## Summation Notation\nΣ (sigma) means "sum." Example: Σ(i=1 to 5) i = 1+2+3+4+5 = 15.\n\n## Formula for First n Natural Numbers\n1 + 2 + ... + n = n(n+1)/2.\nExample: 1+2+...+10 = 10*11/2 = 55.\n\n## Key Takeaways\n- A series is the sum of terms of a sequence.\n- Sum of first n natural numbers = n(n+1)/2.`,
      quiz: {
        title: 'Quiz 4.2 — Summation & Series',
        description: 'Three questions on summation notation.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Σ(i=1 to 5) i = ?', questionType: 'fill_blank', correctAnswer: '15' },
          { questionText: 'Sum of first 10 natural numbers?', questionType: 'fill_blank', correctAnswer: '55' },
          { questionText: 'A series is the sum of the terms of a sequence.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Loops as Iteration: For, While, Do-While',
      duration: 40,
      content: `## Learning Objectives\n- Use for loops for known iteration counts.\n- Use while/do-while for condition-based repetition.\n\n## Loop Types\n- **for:** known iteration count.\n- **while:** repeats while a condition is true.\n- **do-while:** guarantees at least one execution.\n\n## Key Takeaways\n- A do-while loop always executes the body at least once.\n- A for loop is best when you know the iteration count.\n- Infinite loops happen when a while condition never becomes false.`,
      quiz: {
        title: 'Quiz 4.3 — Loops as Iteration',
        description: 'Three questions on for/while/do-while loops.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Which loop type guarantees the body runs at least once?', questionType: 'fill_blank', correctAnswer: 'do-while' },
          { questionText: 'Which loop is best for a known number of iterations?', questionType: 'fill_blank', correctAnswer: 'for loop' },
          { questionText: 'A while loop with a false condition never executes the body.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Nested Loops & Iteration Complexity Intuition',
      duration: 35,
      content: `## Learning Objectives\n- Count iterations in nested loops.\n- Recognize the pattern of O(n^2) growth.\n\n## Nested Loops\nTwo nested loops each running n times execute the inner body n*n = n^2 times.\n\n## Key Takeaways\n- Outer runs 5 times, inner runs 3 times each -> 15 total inner executions.\n- Nested loops often lead to O(n^2) algorithms.`,
      quiz: {
        title: 'Quiz 4.4 — Nested Loops',
        description: 'Three questions on nested loop iteration counts.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Outer loop 5 times, inner loop 3 times each iteration. Total inner executions?', questionType: 'fill_blank', correctAnswer: '15' },
          { questionText: 'Nested loops that each run n times execute roughly n*n = n^2 times.', questionType: 'fill_blank', correctAnswer: 'n^2' },
          { questionText: 'Nested loops always run slower than a single loop over the same total work.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
    {
      title: 'From Formula to Function: Closed-Form vs Iterative Solutions',
      duration: 40,
      content: `## Learning Objectives\n- Distinguish closed-form from iterative solutions.\n- Choose based on performance and clarity trade-offs.\n\n## Closed-Form vs Iterative\n- **Closed-form:** computes result directly (e.g., n(n+1)/2).\n- **Iterative:** accumulates the result through a loop.\n\n## Key Takeaways\n- A closed-form formula avoids looping entirely.\n- For very large n, a closed-form is faster.\n- Not every iterative solution has an equivalent closed-form formula.`,
      quiz: {
        title: 'Quiz 4.5 — Closed-Form vs Iterative',
        description: 'Three questions on solution approaches.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Which approach avoids looping entirely?', questionType: 'fill_blank', correctAnswer: 'Closed-form formula' },
          { questionText: 'For very large n, a closed-form formula or a loop summing 1 to n is faster?', questionType: 'fill_blank', correctAnswer: 'Closed-form formula' },
          { questionText: 'Every iterative solution has an equivalent closed-form formula.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 4 Assignment — Sequence & Series Tool',
    description: 'Build a tool that generates the first n terms of sequences, computes sums iteratively and via closed-form, and compares results to confirm they match.',
    dueDate: '2026-11-15T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm4a1', type: 'theory', title: 'Find the 10th term of 4,7,10,13,...', marks: 5 },
      { id: 'm4a2', type: 'subjective', title: 'Evaluate Σ(i=1 to 4) i^2', marks: 5 },
      { id: 'm4a3', type: 'theory', title: 'What causes an off-by-one error in a for loop?', marks: 5 },
      { id: 'm4a4', type: 'file', title: 'Submit your sequence/series tool.', marks: 5 },
    ],
  },
}
