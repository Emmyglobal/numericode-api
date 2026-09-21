import type { M2cModuleData } from './types'

// Module 6 — Counting, Combinatorics & Probability Basics
// Module objectives: count possibilities precisely and reason about randomness in code.

export const module06: M2cModuleData = {
  title: 'Module 6 — Counting, Combinatorics & Probability Basics',
  lessons: [
    {
      title: 'Counting Principles: Sum & Product Rules',
      duration: 30,
      content: `## Learning Objectives\n- Apply the sum rule for mutually exclusive choices.\n- Apply the product rule for sequential independent choices.\n\n## The Sum Rule\nIf you can do task A in m ways or task B in n ways (but not both), you can do the choice in m+n ways.\n\n## The Product Rule\nIf you do task A in m ways and then task B in n ways, you can do both in m*n ways.\n\n## Key Takeaways\n- 3 shirts and 4 pants -> 12 outfits (product rule).\n- Use sum rule when choices are mutually exclusive alternatives.`,
      quiz: {
        title: 'Quiz 6.1 — Counting Principles',
        description: 'Three questions on sum and product rules.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: '3 shirts and 4 pants. How many outfits?', questionType: 'fill_blank', correctAnswer: '12' },
          { questionText: 'When do you use the sum rule instead of the product rule?', questionType: 'fill_blank', correctAnswer: 'When choices are mutually exclusive alternatives' },
          { questionText: 'The product rule requires choices to be independent.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Permutations & Combinations',
      duration: 40,
      content: `## Learning Objectives\n- Distinguish permutations (order matters) from combinations (order doesn't matter).\n- Calculate nPr and nCr.\n\n## Permutations\n**nPr** = number of ways to arrange r items from n = n! / (n-r)!\n\n## Combinations\n**nCr** = number of ways to choose r items from n = n! / (r!(n-r)!)\n\n## Factorial\nn! = n × (n-1) × ... × 2 × 1. Example: 4! = 24.\n\n## Key Takeaways\n- Order matters in permutations; not in combinations.\n- Arranging 3 people in a line = 3! = 6 ways.`,
      quiz: {
        title: 'Quiz 6.2 — Permutations & Combinations',
        description: 'Three questions on permutations and combinations.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'How many ways can you arrange 3 people in a line?', questionType: 'fill_blank', correctAnswer: '6' },
          { questionText: 'Does order matter in a combination?', questionType: 'fill_blank', correctAnswer: 'No' },
          { questionText: '4 factorial (4!) = ?', questionType: 'fill_blank', correctAnswer: '24' },
        ],
      },
    },
    {
      title: 'Introduction to Probability & Random Events',
      duration: 35,
      content: `## Learning Objectives\n- Calculate basic probabilities.\n- Distinguish independent and dependent events.\n\n## Basic Probability\nP(event) = favorable outcomes / total outcomes.\n\n## Independent Events\nTwo events are independent if the occurrence of one does not affect the other. Flipping two coins are independent.\n\n## Complementary Events\nP(not A) = 1 - P(A).\n\n## Key Takeaways\n- P(rolling a 4 on a die) = 1/6.\n- P(not event) = 1 - P(event) = 1 - 0.3 = 0.7.\n- Two coin flips are independent events.`,
      quiz: {
        title: 'Quiz 6.3 — Probability & Random Events',
        description: 'Three questions on basic probability.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Probability of rolling a 4 on a fair die?', questionType: 'fill_blank', correctAnswer: '1/6' },
          { questionText: 'P(event) = 0.3. P(not event) = ?', questionType: 'fill_blank', correctAnswer: '0.7' },
          { questionText: 'Two coin flips are independent events.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Probability in Code: Randomness, Simulations, Hashing',
      duration: 40,
      content: `## Learning Objectives\n- Generate random numbers in code.\n- Run Monte Carlo-style simulations.\n\n## Random Numbers\n` + '`' + `Math.random()` + '`' + ` (JS) returns a float in [0, 1). ` + '`' + `random.random()` + '`' + ` (Python) does the same.\n\n## Simulations\nMonte Carlo methods estimate probabilities by running many random trials.\n\n## Hashing\nHash functions map data to fixed-size values, aiming to spread data evenly across slots (minimizing collisions).\n\n## Key Takeaways\n- Computer randomness is pseudo-random (deterministic algorithm).
- Monte Carlo simulations estimate outcomes by random sampling.`,
      quiz: {
        title: 'Quiz 6.4 — Probability in Code',
        description: 'Three questions on randomness and simulations.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'random() typically returns a float between what values?', questionType: 'fill_blank', correctAnswer: '0 and 1' },
          { questionText: 'A simulation estimates probabilities by repeating random trials.', questionType: 'fill_blank', correctAnswer: 'true' },
          { questionText: 'Computer-generated randomness is truly random.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
    {
      title: 'Expected Value & Simple Applications',
      duration: 35,
      content: `## Learning Objectives\n- Compute expected value of a random variable.\n- Apply expected value to decision-making.\n\n## Expected Value\nE[X] = sum of (value × probability) for all outcomes.\n\n## Example\nA coin flip pays $10 for heads, $0 for tails: E = 0.5×10 + 0.5×0 = $5.\n\n## Key Takeaways\n- Expected value is the probability-weighted average of outcomes.
- A coin flip game paying $10 on heads has expected value $5.
- Expected value summarizes long-run average outcome.`,
      quiz: {
        title: 'Quiz 6.5 — Expected Value',
        description: 'Three questions on expected value.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Expected value of coin flip paying $10 heads, $0 tails?', questionType: 'fill_blank', correctAnswer: '$5' },
          { questionText: 'Expected value summarizes the long-run average outcome.', questionType: 'fill_blank', correctAnswer: 'true' },
          { questionText: 'Expected value guarantees the outcome of any single trial.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 6 Assignment — Monte Carlo Estimator',
    description: 'Write a simulation using random sampling to estimate either the value of pi (random points in square/circle) or the odds of winning a dice game, over at least 10,000 trials.',
    dueDate: '2026-11-29T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm6a1', type: 'theory', title: 'How many 3-digit codes from digits 0-9 with repetition allowed?', marks: 5 },
      { id: 'm6a2', type: 'theory', title: 'Ways to choose 2 items from 5?', marks: 5 },
      { id: 'm6a3', type: 'subjective', title: 'Probability of drawing an ace from a 52-card deck?', marks: 5 },
      { id: 'm6a4', type: 'file', title: 'Submit your Monte Carlo simulation.', marks: 5 },
    ],
  },
}
