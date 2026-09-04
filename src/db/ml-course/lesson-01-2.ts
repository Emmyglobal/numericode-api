import type { MlLessonData } from './types'

// ─── Lesson 1.2 — NumPy arrays, vectors & matrices ─────────────────────────────
export const lesson01_2: MlLessonData = {
  title: "NumPy Arrays, Vectors & Matrices",
  duration: 25,
  content: `## Learning Objectives
By the end of this lesson you should be able to:
- Create a NumPy array (vector or matrix) from a Python list.
- Index and slice rows/columns of a 2-D array.
- Perform vectorized arithmetic and a matrix product.

## Introduction
A Python list walks one number at a time; ML needs a 2-D grid (rows = samples, columns = features). NumPy is the library that stores that grid as an array and runs math on the whole grid at once — no Python loop. That one shift (scalars → vectors/matrices processed in C) is what makes ML code fast and short.

## Arrays from Lists
\`import numpy as np\`
\`prices = [120, 45, 300, 80, 199]\`
\`x = np.array(prices)\`  # vector, shape (5,)
\`matrix = np.array([[1, 2], [3, 4]])\`  # matrix, shape (2, 2)
Check size: \`x.shape\`, \`matrix.shape\`. Makers: \`np.zeros((2, 3))\`, \`np.ones((2,)))\`, \`np.arange(0, 10, 2)\`.

## Indexing & Slicing
\`matrix[0]\`     # row 0
\`matrix[0, 1]\`  # element at (0,1) → 2
\`matrix[:, 0]\`  # whole first column
\`x[1:4]\`        # positions 1, 2, 3

## Vectorized Arithmetic & Broadcasting
No loop:
\`a = np.array([1, 2, 3])\`
\`b = np.array([4, 5, 6])\`
\`a + b\`  # [5, 7, 9] element-wise
\`a * 2\`  # broadcasts → [2, 4, 6]. A column plus a row broadcasts too — the rule behind every neural net.

## Matrix Product
\`c = np.array([[1, 2]])\`  # (1, 2)
\`d = np.array([[3], [4]])\`  # (2, 1)
\`c @ d\`  # → [[11]] : (1×2)·(2×1) = (1×1). \`c.dot(d)\` is the same.

## Worked Example — Iris Feature Matrix
\`from sklearn.datasets import load_iris\`
\`import numpy as np\`
\`X, y = load_iris(return_X_y=True)\`
\`X.shape\`  # (150, 4)
\`petal_len = X[:, 2]\`  # all rows, petal length
\`X[:, 2] = (petal_len - petal_len.mean()) / petal_len.std()\`  # standardize column 2 in place
\`print(round(X[:, 2].mean(), 3))\`  # ≈ 0.0

## Practical Exercise
\`import numpy as np\`
\`X = np.array([[1, 2, 3], [4, 5, 6]])\`
\`print(X.sum(axis=1))\`  # ?
Then set \`X = np.array([[2, 2, 2], [2, 2, 2]])\` and \`print(X.sum(axis=0))\`  # ?
Check: first → [6 15]; second → [4 4 4].

## Key Takeaways
- \`np.array(list)\` makes a vector/matrix; \`.shape\` reports the size.
- \`X[:, 0]\` grabs a column; \`X[1:4]\` grabs a range.
- Vectorized ops + broadcasting remove Python loops.
- \`@\`/dot\` is matrix multiplication — the heart of linear models and neural nets.

## Quiz Answer Key (attempt the quiz first)
1. (b) NumPy provides the n-dimensional arrays every ML library builds on.
2. (b) Columns = features, rows = samples — scikit-learn's convention.
3. False — the scalar broadcasts to every element.
4. (b) \`X[:, 0]\`.
5. (c) \`@\` / \`dot\`.
`,
  quiz: {
    title: "Quiz — NumPy Arrays, Vectors & Matrices",
    description: "Five questions on creating arrays, indexing/slicing, broadcasting, and matrix products.",
    timeLimit: 10,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        questionText: "Which library provides the n-dimensional array that scikit-learn estimators accept as input?",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "pandas", isCorrect: false },
          { id: "b", text: "NumPy", isCorrect: true },
          { id: "c", text: "matplotlib", isCorrect: false },
          { id: "d", text: "requests", isCorrect: false },
        ],
        correctAnswer: "b",
      },
      {
        questionText: "When load_iris(return_X_y=True) gives X of shape (150, 4), that means:",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "150 features, 4 samples", isCorrect: false },
          { id: "b", text: "150 samples, 4 features", isCorrect: true },
          { id: "c", text: "150 classes, 4 measurements", isCorrect: false },
          { id: "d", text: "150 columns, 4 rows", isCorrect: false },
        ],
        correctAnswer: "b",
      },
      {
        questionText: "A scalar like 2 multiplied by a NumPy array requires the array and scalar to already be the same shape.",
        questionType: "true_false",
        correctAnswer: "false",
      },
      {
        questionText: "The NumPy expression to select the entire first column of array X is X[?].",
        questionType: "fill_blank",
        correctAnswer: "[:, 0]",
      },
      {
        questionText: "Which operator performs matrix multiplication?",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "*", isCorrect: false },
          { id: "b", text: "+", isCorrect: false },
          { id: "c", text: "@", isCorrect: true },
          { id: "d", text: "&", isCorrect: false },
        ],
        correctAnswer: "c",
      },
    ],
  },
  assignment: {
    title: "Assignment 1.2 — NumPy Practice",
    description: "You have two arrays: a = [3, 6, 9] and b = [1, 2, 3]. Write the NumPy expression for each and compute the result: (1) element-wise sum a + b; (2) scalar product 2 * a; (3) dot product a . b (a single number); (4) reshape a into a 3x1 column vector and confirm its shape is (3, 1). Deliverable: four expressions and numeric results. Good answer: a + b = [4 8 12], 2 * a = [6 12 18], a.dot(b) = 42, column vector shape (3, 1). Rubric: 4 + 4 + 8 + 4 = 20.",
    dueDate: "2026-07-09T23:59:59Z",
    totalMarks: 20,
    passingScore: 10,
    assignmentType: "theory",
    questions: [
      { id: "q1", type: "subjective", title: "Write the four NumPy expressions above and show each numeric result.", marks: 14 },
      { id: "q2", type: "theory", title: "After you reshape a into a column and add it to b, broadcasting applies. What shape does the result have and why — one or two sentences?", marks: 6 },
    ],
  },
}
