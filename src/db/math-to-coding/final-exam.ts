// ─── Mathematics to Coding — Final Exam (53 items) ─────────────────────────
//
// 50 multiple-choice / short-answer questions (5 per Module 1-10) PLUS
// 3 practical coding problems (essay type - stored but not auto-graded,
// matching the submit endpoint's existing behaviour for NULL correct_answer).
//
// Every question text and correct answer is preserved exactly as specified in
// the course note (Module 11 / Final Exam section). Distractors are plausible
// wrong answers consistent with the course level.
//
// The final-exam quiz is seeded with scope = 'final_exam' so the 30-minute
// MAX_QUIZ_DURATION_MINUTES guard in quizzes.controller.ts is bypassed for it
// (see Step 2 - schema + controller changes). The 48-hour retake cooldown is
// enforced in submitQuizAttempt for scope = 'final_exam'.

export interface FinalExamQuestion {
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  options?: Array<{ id: string; text: string; isCorrect: boolean }>;
  correctAnswer: string | null;
  points: number;
}

export const FINAL_EXAM_TITLE = 'Final Exam - Mathematics to Coding';
export const FINAL_EXAM_DESCRIPTION =
  'Comprehensive closed-note exam covering Modules 1-10. 50 multiple-choice / short-answer questions + 3 practical coding problems. 120 minutes. Passing score: 60%. One retake allowed after a 48-hour cooldown.';
export const FINAL_EXAM_TIME_LIMIT_MINUTES = 120;
export const FINAL_EXAM_PASSING_SCORE = 60;
export const FINAL_EXAM_MAX_ATTEMPTS = 2;
export const FINAL_EXAM_POINTS_PER_QUESTION = 1;
export const FINAL_EXAM_ESSAY_POINTS = 10;

// ── Module 1 - Numbers (5 questions) ───────────────────────────────────────

export const FINAL_EXAM_Q_MODULE_1: FinalExamQuestion[] = [
  {
    questionText: 'Convert binary `10110` to decimal.',
    questionType: 'fill_blank',
    correctAnswer: '22',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'What decimal value does hex `2A` represent?',
    questionType: 'fill_blank',
    correctAnswer: '42',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Why can floating-point arithmetic produce small rounding errors?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'Floats use base-10 internally', isCorrect: false },
      {
        id: 'b',
        text: 'Floating-point representation cannot store all decimal fractions exactly',
        isCorrect: true,
      },
      { id: 'c', text: 'Processors round all operations to integers', isCorrect: false },
      { id: 'd', text: 'Languages deliberately add noise to floats', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'Evaluate: `17 % 5`.',
    questionType: 'fill_blank',
    correctAnswer: '2',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      "What does 2's complement help represent in binary?",
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'Fractional numbers', isCorrect: false },
      { id: 'b', text: 'Negative numbers', isCorrect: true },
      { id: 'c', text: 'Hexadecimal digits', isCorrect: false },
      { id: 'd', text: 'Text characters', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
];

// ── Module 2 - Logic (5 questions) ─────────────────────────────────────────

export const FINAL_EXAM_Q_MODULE_2: FinalExamQuestion[] = [
  {
    questionText: 'Simplify `!(p || q)` using De Morgan\'s Law.',
    questionType: 'fill_blank',
    correctAnswer: '!p && !q',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'Complete the truth table for `p XOR q`: the result is true when…',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'Both p and q are true', isCorrect: false },
      { id: 'b', text: 'Both p and q are false', isCorrect: false },
      {
        id: 'c',
        text: 'Exactly one of p or q is true',
        isCorrect: true,
      },
      { id: 'd', text: 'p and q have the same truth value', isCorrect: false },
    ],
    correctAnswer: 'c',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'What does short-circuit evaluation optimize?',
    questionType: 'multiple_choice',
    options: [
      {
        id: 'a',
        text: 'It avoids evaluating unnecessary operands in && and ||',
        isCorrect: true,
      },
      { id: 'b', text: 'It makes all boolean expressions run in parallel', isCorrect: false },
      { id: 'c', text: 'It converts boolean expressions to integers', isCorrect: false },
      { id: 'd', text: 'It caches the result of every boolean expression', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Convert "You may drive if you have a license AND are not suspended" into a boolean expression (use hasLicense and isSuspended).',
    questionType: 'fill_blank',
    correctAnswer: 'hasLicense && !isSuspended',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'When does `A && B || C` evaluate to true, given standard operator precedence (&& before ||)?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'When A is true, regardless of B and C', isCorrect: false },
      {
        id: 'b',
        text: 'When (A is true AND B is true) OR C is true',
        isCorrect: true,
      },
      { id: 'c', text: 'When A, B, and C are all true', isCorrect: false },
      { id: 'd', text: 'When C is false and A is true', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
];

// ── Module 3 - Sets, Functions & Relations (5 questions) ───────────────────

export const FINAL_EXAM_Q_MODULE_3: FinalExamQuestion[] = [
  {
    questionText: 'Given A={2,4,6}, B={4,6,8}, find A ∩ B.',
    questionType: 'fill_blank',
    correctAnswer: '{4,6}',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Is the relation "is taller than" reflexive? Justify briefly.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
  {
    questionText:
      'What is the range of f(x) = x² for x ∈ {-2,-1,0,1,2}?',
    questionType: 'fill_blank',
    correctAnswer: '{0,1,4}',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Explain the difference between a Set and a Map in code.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
  {
    questionText:
      'Compute f(g(2)) given f(x)=x+1 and g(x)=x².',
    questionType: 'fill_blank',
    correctAnswer: '5',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
];

// ── Module 4 - Sequences & Iteration (5 questions) ────────────────────────

export const FINAL_EXAM_Q_MODULE_4: FinalExamQuestion[] = [
  {
    questionText:
      'Find the 10th term of the arithmetic sequence starting at 4 with common difference 3.',
    questionType: 'fill_blank',
    correctAnswer: '31',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'Evaluate Σ (i=1 to 4) i².',
    questionType: 'fill_blank',
    correctAnswer: '30',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Write a loop-based algorithm (pseudocode) to sum the first n even numbers.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
  {
    questionText: 'What causes an off-by-one error in a `for` loop?',
    questionType: 'multiple_choice',
    options: [
      {
        id: 'a',
        text: 'Using incorrect loop bounds (e.g. <= instead of <)',
        isCorrect: true,
      },
      { id: 'b', text: 'Using a while loop instead of a for loop', isCorrect: false },
      { id: 'c', text: 'Declaring the loop variable inside the loop', isCorrect: false },
      { id: 'd', text: 'Using a negative step value', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Compare the closed-form and iterative approach to computing the sum 1 to n.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
];

// ── Module 5 - Algorithms & Pseudocode (5 questions) ──────────────────────

export const FINAL_EXAM_Q_MODULE_5: FinalExamQuestion[] = [
  {
    questionText:
      'Trace binary search for target=7 in [1,3,5,7,9,11]. At which index is 7 found?',
    questionType: 'fill_blank',
    correctAnswer: '3',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'What is the worst-case number of comparisons for linear search on n items?',
    questionType: 'fill_blank',
    correctAnswer: 'n',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'Describe, in pseudocode, one pass of bubble sort.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
  {
    questionText: 'Why must data be sorted before binary search?',
    questionType: 'multiple_choice',
    options: [
      {
        id: 'a',
        text: 'Binary search relies on halving the search space based on comparisons',
        isCorrect: true,
      },
      { id: 'b', text: 'Sorted data uses less memory', isCorrect: false },
      { id: 'c', text: 'The algorithm modifies the array in place', isCorrect: false },
      { id: 'd', text: 'Sorting is required for the return value', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Translate "find the largest number in a list" into pseudocode.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
];

// ── Module 6 - Counting & Probability (5 questions) ───────────────────────

export const FINAL_EXAM_Q_MODULE_6: FinalExamQuestion[] = [
  {
    questionText:
      'How many 3-digit codes can be formed from digits 0-9 if repetition is allowed?',
    questionType: 'fill_blank',
    correctAnswer: '1000',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'How many ways can you choose 2 items from a set of 5 (combination)?',
    questionType: 'fill_blank',
    correctAnswer: '10',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'What is the probability of drawing an ace from a standard 52-card deck?',
    questionType: 'fill_blank',
    correctAnswer: '1/13',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'What does a Monte Carlo simulation estimate?',
    questionType: 'multiple_choice',
    options: [
      {
        id: 'a',
        text: 'Probabilistic outcomes by repeated random sampling',
        isCorrect: true,
      },
      { id: 'b', text: 'The exact value of a deterministic function', isCorrect: false },
      { id: 'c', text: 'The fastest sorting algorithm for a dataset', isCorrect: false },
      { id: 'd', text: 'The memory usage of a recursive function', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Compute the expected value of a game paying $20 with probability 0.25 and $0 otherwise.',
    questionType: 'fill_blank',
    correctAnswer: '5',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
];

// ── Module 7 - Vectors & Matrices (5 questions) ───────────────────────────

export const FINAL_EXAM_Q_MODULE_7: FinalExamQuestion[] = [
  {
    questionText: 'Compute the dot product of [2,3] and [4,1].',
    questionType: 'fill_blank',
    correctAnswer: '11',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Add matrices [[1,2],[3,4]] and [[5,6],[7,8]]. Give the top-left entry.',
    questionType: 'fill_blank',
    correctAnswer: '6',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'What condition must hold to multiply an m x n matrix by an n x p matrix?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'm must equal p', isCorrect: false },
      {
        id: 'b',
        text: 'The inner dimensions must match (n = n)',
        isCorrect: true,
      },
      { id: 'c', text: 'Both matrices must be square', isCorrect: false },
      { id: 'd', text: 'The outer dimensions must be equal', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'How can a grayscale image be represented mathematically?',
    questionType: 'multiple_choice',
    options: [
      {
        id: 'a',
        text: 'As a matrix of pixel intensity values',
        isCorrect: true,
      },
      { id: 'b', text: 'As a single scalar value', isCorrect: false },
      { id: 'c', text: 'As a graph with pixels as edges', isCorrect: false },
      { id: 'd', text: 'As a boolean vector of length 256', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'What role does matrix multiplication play in a neural network layer?',
    questionType: 'multiple_choice',
    options: [
      {
        id: 'a',
        text: 'It computes the weighted sum of inputs (linear transformation)',
        isCorrect: true,
      },
      { id: 'b', text: 'It replaces the activation function', isCorrect: false },
      { id: 'c', text: 'It normalizes the output to [0,1]', isCorrect: false },
      { id: 'd', text: 'It randomly initialises the weights', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
];

// ── Module 8 - Recursion & Induction (5 questions) ────────────────────────

export const FINAL_EXAM_Q_MODULE_8: FinalExamQuestion[] = [
  {
    questionText:
      'Write the base case and recursive case for a recursive `sum(array)` function.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
  {
    questionText: 'Trace `factorial(4)` step by step. What is the result?',
    questionType: 'fill_blank',
    correctAnswer: '24',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'What is the inductive hypothesis in a proof by induction?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'The statement is true for all n', isCorrect: false },
      {
        id: 'b',
        text: 'Assume the statement holds for some value k',
        isCorrect: true,
      },
      { id: 'c', text: 'The base case has been proven', isCorrect: false },
      { id: 'd', text: 'The statement is false for k+1', isCorrect: false },
    ],
    correctAnswer: 'b',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'Why is naive recursive Fibonacci inefficient?',
    questionType: 'multiple_choice',
    options: [
      {
        id: 'a',
        text: 'It recomputes the same subproblems many times (overlapping subproblems)',
        isCorrect: true,
      },
      { id: 'b', text: 'Fibonacci numbers grow too fast for integers', isCorrect: false },
      { id: 'c', text: 'The base cases are incorrectly defined', isCorrect: false },
      { id: 'd', text: 'Recursion cannot compute Fibonacci numbers', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Convert a simple recursive function into an iterative one.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
];

// ── Module 9 - Complexity & Big-O (5 questions) ───────────────────────────

export const FINAL_EXAM_Q_MODULE_9: FinalExamQuestion[] = [
  {
    questionText: 'What is the time complexity of a single loop over n elements?',
    questionType: 'fill_blank',
    correctAnswer: 'O(n)',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'What is the time complexity of binary search?',
    questionType: 'fill_blank',
    correctAnswer: 'O(log n)',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Rank O(n), O(log n), O(n^2), O(1) from fastest to slowest growth.',
    questionType: 'fill_blank',
    correctAnswer: 'O(1), O(log n), O(n), O(n^2)',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'Why does Big-O ignore constant factors?',
    questionType: 'multiple_choice',
    options: [
      {
        id: 'a',
        text: 'It focuses on growth rate as n -> infinity, not absolute runtime',
        isCorrect: true,
      },
      { id: 'b', text: 'Constant factors are always zero', isCorrect: false },
      { id: 'c', text: 'Hardware makes constant factors irrelevant', isCorrect: false },
      { id: 'd', text: 'Big-O only applies to recursive algorithms', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Identify the Big-O of a given nested-loop code snippet where both loops run n times.',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'O(n)', isCorrect: false },
      { id: 'b', text: 'O(log n)', isCorrect: false },
      { id: 'c', text: 'O(n^2)', isCorrect: true },
      { id: 'd', text: 'O(1)', isCorrect: false },
    ],
    correctAnswer: 'c',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
];

// ── Module 10 - Graphs & Trees (5 questions) ──────────────────────────────

export const FINAL_EXAM_Q_MODULE_10: FinalExamQuestion[] = [
  {
    questionText:
      'What is the difference between BFS and DFS in terms of data structure used?',
    questionType: 'multiple_choice',
    options: [
      {
        id: 'a',
        text: 'BFS uses a queue; DFS uses a stack (or recursion)',
        isCorrect: true,
      },
      { id: 'b', text: 'BFS uses a stack; DFS uses a queue', isCorrect: false },
      { id: 'c', text: 'Both use a priority queue', isCorrect: false },
      { id: 'd', text: 'Neither uses any data structure', isCorrect: false },
    ],
    correctAnswer: 'a',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Convert a small adjacency list to an adjacency matrix. If there is an edge from node i to node j, what value goes in matrix[i][j]?',
    questionType: 'fill_blank',
    correctAnswer: '1',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      'Which traversal is guaranteed to find the shortest path in an unweighted graph?',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'DFS (Depth-First Search)', isCorrect: false },
      { id: 'b', text: 'BFS (Breadth-First Search)', isCorrect: true },
      { id: 'c', text: 'Pre-order tree traversal', isCorrect: false },
      { id: 'd', text: "Dijkstra's algorithm (always)", isCorrect: false },
    ],
    correctAnswer: 'b',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText: 'What is a leaf node in a tree?',
    questionType: 'fill_blank',
    correctAnswer: 'a node with no children',
    points: FINAL_EXAM_POINTS_PER_QUESTION,
  },
  {
    questionText:
      "Explain, conceptually, how Dijkstra's algorithm selects the next node to visit.",
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
];

// ── Practical Coding Problems (3) ───────────────────────────────────────────

export const FINAL_EXAM_PRACTICAL_PROBLEMS: FinalExamQuestion[] = [
  {
    questionText:
      'Practical Problem 1 - Prime Checker: Implement a function that returns whether a given number is prime, and state its time complexity.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
  {
    questionText:
      'Practical Problem 2 - BFS Shortest Hop-Count: Implement BFS on a graph represented as an adjacency list, returning the shortest hop-count between two given nodes.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
  {
    questionText:
      'Practical Problem 3 - Memoized Fibonacci: Implement a recursive function to compute the nth Fibonacci number with memoization, and explain how memoization changes its Big-O complexity compared to the naive version.',
    questionType: 'essay',
    correctAnswer: null,
    points: FINAL_EXAM_ESSAY_POINTS,
  },
];

// ── Combined: 53 items (50 Q&A + 3 practical) ─────────────────────────────

export const FINAL_EXAM_ALL_QUESTIONS: FinalExamQuestion[] = [
  ...FINAL_EXAM_Q_MODULE_1,
  ...FINAL_EXAM_Q_MODULE_2,
  ...FINAL_EXAM_Q_MODULE_3,
  ...FINAL_EXAM_Q_MODULE_4,
  ...FINAL_EXAM_Q_MODULE_5,
  ...FINAL_EXAM_Q_MODULE_6,
  ...FINAL_EXAM_Q_MODULE_7,
  ...FINAL_EXAM_Q_MODULE_8,
  ...FINAL_EXAM_Q_MODULE_9,
  ...FINAL_EXAM_Q_MODULE_10,
  ...FINAL_EXAM_PRACTICAL_PROBLEMS,
];

// Runtime sanity check (dev/build only).
if (typeof (globalThis as Record<string, unknown>).window === 'undefined') {
  const mcCount =
    FINAL_EXAM_Q_MODULE_1.length +
    FINAL_EXAM_Q_MODULE_2.length +
    FINAL_EXAM_Q_MODULE_3.length +
    FINAL_EXAM_Q_MODULE_4.length +
    FINAL_EXAM_Q_MODULE_5.length +
    FINAL_EXAM_Q_MODULE_6.length +
    FINAL_EXAM_Q_MODULE_7.length +
    FINAL_EXAM_Q_MODULE_8.length +
    FINAL_EXAM_Q_MODULE_9.length +
    FINAL_EXAM_Q_MODULE_10.length;
  const essayCount = FINAL_EXAM_PRACTICAL_PROBLEMS.length;
  if (mcCount !== 50 || essayCount !== 3) {
    throw new Error(
      `Final exam question bank mismatch: expected 50 MCQ/TF/fb + 3 essay, got ${mcCount} + ${essayCount}`,
    );
  }
  if (FINAL_EXAM_ALL_QUESTIONS.length !== 53) {
    throw new Error(
      `Final exam total mismatch: expected 53 questions, got ${FINAL_EXAM_ALL_QUESTIONS.length}`,
    );
  }
}
