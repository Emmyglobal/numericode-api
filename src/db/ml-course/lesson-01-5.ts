import type { MlLessonData } from './types'

// ─── Lesson 1.5 — The machine learning workflow ──────────────────────────────
export const lesson01_5: MlLessonData = {
  title: "The Machine Learning Workflow",
  duration: 25,
  content: `## Learning Objectives
By the end of this lesson you should be able to:
- List the steps from a problem statement to a deployed prediction.
- Build a holdout train/test split without a high-level library.
- Run a complete tiny pipeline end-to-end on iris.

## Introduction
Real ML is a pipeline: frame → gather and clean data → split → choose a model → train → evaluate → iterate → (maybe) deploy. This lesson walks every step on the tiny iris dataset so you see the whole arc before the individual models (linear/logistic regression, trees, SVMs) fill in later modules.

## The Six Steps
1. Frame: predict iris species from four measurements → supervised classification.
2. Data: \`load_iris\` gives X (features) and y (labels).
3. Split: hold back some rows to test on — here we slice manually with NumPy (sklearn's helper arrives in Module B3).
4. Train: "fit" means learning parameters from the training rows.
5. Evaluate: predict on held-out rows and compare to true labels.
6. Iterate / deploy: if accuracy is poor, clean data or pick another model; a deployed model is code that applies the trained function to new rows.

## Worked Example — Manual Split + a Baseline Model
\`import numpy as np\`
\`from sklearn.datasets import load_iris\`
\`from sklearn.dummy import DummyClassifier\`
\`X, y = load_iris(return_X_y=True)\`
\`rng = np.random.RandomState(0)\`
\`idx = rng.permutation(len(X))\`
\`split = int(0.8 * len(X))\`
\`train_i, test_i = idx[:split], idx[split:]\`
\`Xtr, Xte, ytr, yte = X[train_i], X[test_i], y[train_i], y[test_i]\`
\`clf = DummyClassifier(strategy='most_frequent').fit(Xtr, ytr)\`
\`print(round(clf.score(Xte, yte), 3))\`  # ≈ 0.34, the majority-class baseline
A real model will do far better — that's the point of the models in Module B.

## Practical Exercise
\`import numpy as np\`
\`from sklearn.datasets import load_iris\`
\`from sklearn.dummy import DummyClassifier\`
\`X, y = load_iris(return_X_y=True)\`
\`rng = np.random.RandomState(42)\`
\`idx = rng.permutation(len(X))\`
\`split = int(0.8 * len(X))\`
\`train_i, test_i = idx[:split], idx[split:]; Xtr, Xte, ytr, yte = X[train_i], X[test_i], y[train_i], y[test_i]\`
\`clf = DummyClassifier(strategy='most_frequent').fit(Xtr, ytr)\`
\`print(round(clf.score(Xte, yte), 3))\`
Task 1: run. Task 2: change strategy to 'stratified'. Task 3: change RandomState(42) to RandomState(0).
Check: most_frequent ≈ 0.34; stratified ≈ 0.40.

## Key Takeaways
- The workflow is frame → data → split → train → evaluate → iterate / deploy.
- A manual 80/20 split with a permutation is enough to start.
- A majority-class baseline (DummyClassifier) shows how good "no learning" is.

## Quiz Answer Key (attempt the quiz first)
1. (b) We hold data out to test on unseen rows and avoid cheating.
2. (b) 'most_frequent' always predicts the majority class.
3. False — a good model should beat the majority-class baseline.
4. (b) 0.8.
5. (b) accuracy counts correct predictions.
`,
  quiz: {
    title: "Quiz — The Machine Learning Workflow",
    description: "Five questions on the ML pipeline, train/test splits, and baseline models.",
    timeLimit: 10,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        questionText: "Why hold out a test split?",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "it trains faster", isCorrect: false },
          { id: "b", text: "to test on unseen data and avoid cheating", isCorrect: true },
          { id: "c", text: "scikit-learn requires it", isCorrect: false },
                  { id: "d", text: "it shrinks the dataset", isCorrect: false },
        ],
        correctAnswer: "b",
      },
      {
        questionText: "DummyClassifier with strategy='most_frequent' predicts:",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "the feature mean", isCorrect: false },
          { id: "b", text: "the majority class", isCorrect: true },
          { id: "c", text: "a random class", isCorrect: false },
          { id: "d", text: "the feature median", isCorrect: false },
        ],
        correctAnswer: "b",
      },
      {
        questionText: "A good model should score lower accuracy than the majority-class baseline.",
        questionType: "true_false",
        correctAnswer: "false",
      },
      {
        questionText: "The Iris manual split above holds out 20 percent for testing, so ______ of the data trains.",
        questionType: "fill_blank",
        correctAnswer: "0.8",
      },
      {
        questionText: "Accuracy on the test split counts:",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "wrong predictions", isCorrect: false },
          { id: "b", text: "correct predictions", isCorrect: true },
          { id: "c", text: "training samples", isCorrect: false },
          { id: "d", text: "number of features", isCorrect: false },
        ],
        correctAnswer: "b",
      },
    ],
  },
    assignment: {
    title: "Assignment 1.5 — The ML Workflow",
    description: "You are predicting pet type from a dataset 'pets' with columns type (dog/cat) and weight_kg, predicting type from weight. For each of the six workflow steps write ONE sentence: what you would do and WHY. Good: each step named with its purpose (e.g. split to measure generalization). Rubric: 1 step missing = -2; each well-stated step = 3; total 20.",
    dueDate: "2026-07-12T23:59:59Z",
    totalMarks: 20,
    passingScore: 10,
    assignmentType: "subjective",
    questions: [
      { id: "q1", type: "subjective", title: "Describe all six workflow steps and the purpose of each.", marks: 12 },
      { id: "q2", type: "subjective", title: "Which of the six steps, if skipped, makes test accuracy look artificially perfect — and why?", marks: 8 },
    ],
  },
}
