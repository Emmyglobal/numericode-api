import type { M2cModuleData } from './types'

// Module 9 — Algorithmic Complexity & Big-O
// Module objectives: analyze and compare the efficiency of algorithms formally.

export const module09: M2cModuleData = {
  title: 'Module 9 — Algorithmic Complexity & Big-O',
  lessons: [
    {
      title: 'Why Efficiency Matters: Time vs Space',
      duration: 30,
      content: `## Learning Objectives\n- Distinguish time complexity from space complexity.\n- Explain why scalability matters.\n\n## Time vs Space Complexity\n- **Time complexity:** how an algorithm's runtime grows with input size n.
- **Space complexity:** how an algorithm's memory usage grows with input size n.\n\n## Why Efficiency Matters\nAn algorithm that \"works\" on small input may be unusably slow on large input. Efficiency is about how the algorithm **scales**.\n\n## Key Takeaways\n- Time complexity measures runtime growth relative to input size.
- Space complexity measures memory growth relative to input size.
- A correct algorithm is not automatically an efficient one.`,
      quiz: {
        title: 'Quiz 9.1 — Why Efficiency Matters',
        description: 'Three questions on time and space complexity.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Time complexity measures how an algorithm\'s runtime grows with input size.', questionType: 'true_false', correctAnswer: 'true' },
          { questionText: 'Space complexity measures how memory grows with input size.', questionType: 'true_false', correctAnswer: 'true' },
          { questionText: 'A correct algorithm is automatically efficient.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
    {
      title: 'Big-O, Big-Theta, Big-Omega Notation',
      duration: 35,
      content: `## Learning Objectives\n- Define Big-O, Big-Omega, and Big-Theta.\n- Understand worst-case, best-case, and tight bounds.\n\n## Asymptotic Notation\n- **Big-O (O):** upper bound / worst-case growth. Most commonly cited.\n- **Big-Omega (Ω):** lower bound / best-case growth.\n- **Big-Theta (Θ):** tight bound (both upper and lower).\n\n## Key Takeaways\n- Big-O ignores constant factors and lower-order terms.
- Big-Theta describes a tight bound.
- Big-O is the most commonly used notation in practice.`,
      quiz: {
        title: 'Quiz 9.2 — Big-O, Big-Theta, Big-Omega',
        description: 'Three questions on asymptotic notation.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Big-O describes the upper bound / worst-case growth rate.', questionType: 'true_false', correctAnswer: 'true' },
          { questionText: 'Which describes a tight bound?', questionType: 'fill_blank', correctAnswer: 'Big-Theta' },
          { questionText: 'Big-O ignores constant factors and lower-order terms.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Analyzing Loops, Nested Loops & Recursive Calls',
      duration: 40,
      content: `## Learning Objectives\n- Determine complexity of loops and nested loops.\n- Analyze simple recursive algorithms.\n\n## Loop Analysis\n- Single loop over n elements: O(n).\n- Nested loop over n elements: O(n^2).\n\n## Binary Search Complexity\nBinary search halves the search space each step: O(log n).\n\n## Key Takeaways\n- Single loop over n elements = O(n).
- Two nested loops each running n times = O(n^2).
- Binary search is O(log n).`,
      quiz: {
        title: 'Quiz 9.3 — Analyzing Loops',
        description: 'Three questions on loop complexity.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Time complexity of a single loop running n times?', questionType: 'fill_blank', correctAnswer: 'O(n)' },
          { questionText: 'Time complexity of two nested loops each running n times?', questionType: 'fill_blank', correctAnswer: 'O(n^2)' },
          { questionText: 'Binary search complexity?', questionType: 'fill_blank', correctAnswer: 'O(log n)' },
        ],
      },
    },
    {
      title: 'Common Complexity Classes with Real Examples',
      duration: 35,
      content: `## Learning Objectives\n- Rank common complexity classes.\n- Match algorithms to their complexity.\n\n## Complexity Classes (slowest to fastest growth)\n- O(2^n) — exponential (naive Fibonacci)\n- O(n^2) — quadratic (bubble sort)\n- O(n log n) — linearithmic (merge sort)\n- O(n) — linear (linear search)\n- O(log n) — logarithmic (binary search)\n- O(1) — constant (array access)\n\n## Key Takeaways\nFastest to slowest: O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n).`,
      quiz: {
        title: 'Quiz 9.4 — Common Complexity Classes',
        description: 'Three questions on complexity classes.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Rank from fastest to slowest: O(n^2), O(1), O(n log n)', questionType: 'fill_blank', correctAnswer: 'O(1), O(n log n), O(n^2)' },
          { questionText: 'Merge sort complexity class?', questionType: 'fill_blank', correctAnswer: 'O(n log n)' },
          { questionText: 'Naive recursive Fibonacci complexity?', questionType: 'fill_blank', correctAnswer: 'O(2^n)' },
        ],
      },
    },
    {
      title: 'Choosing the Right Algorithm/Data Structure',
      duration: 40,
      content: `## Learning Objectives\n- Match data structures to access patterns.\n- Trade off time vs space.\n\n## Choosing Data Structures\n- Use a **hash map** for O(1) lookups by key.\n- Use an **array** for indexed access.\n- Use a **tree** for hierarchical data and sorted traversal.\n- Use a **graph** for networked relationships.\n\n## Premature Optimization
Optimizing before confirming a bottleneck is wasted effort. Profile first, then optimize the hot path.\n\n## Key Takeaways
- Hash maps are typically O(1) for lookups.
- The best data structure depends on context, not just theory.
- Premature optimization wastes effort before confirming bottlenecks.`,
      quiz: {
        title: 'Quiz 9.5 — Choosing Algorithms & Data Structures',
        description: 'Three questions on data structure selection.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Why use a hash map over an unsorted array for frequent lookups?', questionType: 'fill_blank', correctAnswer: 'Hash map lookups are O(1) vs O(n)' },
          { questionText: 'Optimizing before confirming a bottleneck is premature.', questionType: 'true_false', correctAnswer: 'true' },
          { questionText: 'The best data structure is always the one with lowest theoretical complexity.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 9 Assignment — Complexity Audit',
    description: 'Given intentionally slow code (e.g., nested loops with redundant work), determine its Big-O, refactor to a more efficient version, and state the new complexity.',
    dueDate: '2026-12-20T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm9a1', type: 'theory', title: 'Single loop over n elements complexity?', marks: 5 },
      { id: 'm9a2', type: 'theory', title: 'Binary search complexity?', marks: 5 },
      { id: 'm9a3', type: 'theory', title: 'Rank O(n), O(log n), O(n^2), O(1) fastest to slowest.', marks: 5 },
      { id: 'm9a4', type: 'file', title: 'Submit your complexity audit with before/after analysis.', marks: 5 },
    ],
  },
}
