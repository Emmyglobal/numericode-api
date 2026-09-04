import type { MlLessonData } from './types'

// ─── Lesson 1.4 — What is machine learning? ───────────────────────────────────
export const lesson01_4: MlLessonData = {
  title: "What Is Machine Learning?",
  duration: 25,
  content: `## Learning Objectives
By the end of this lesson you should be able to:
- Define ML and give one example of a problem it solves.
- Name the three main types of learning and one use case each.
- Explain the difference between a feature and a label.

## Introduction
A traditional program gets rules and data and produces an answer. Machine learning flips that: you give examples (data with known answers) and a model, and it learns the rules itself. Predicting whether an email is spam is a classic ML task — we don't hand-code rules for every spam phrase; we show thousands of labeled emails and let the model learn the pattern.

## The Three Types of Learning
- Supervised: input X maps to a label y (spam email → 0/1). Learn from labeled examples.
- Unsupervised: only X, no y; the model finds structure (group customers by behavior).
- Reinforcement: an agent acts in an environment and learns from rewards (a game bot).
ML lives in the supervised world for now — every model we build has a label y to learn from.

## Features vs Labels
- Feature (X): an input column the model reads, e.g., email word counts.
- Label (y): the answer we want to predict, e.g., 0 (ham) or 1 (spam).
A model is a function f(X) → y. Training = finding the best f.

## Worked Example — A One-Rule Learner
A tree-stump rule for iris: if petal length < 2.5, predict setosa, else not-setosa:
\`from sklearn.datasets import load_iris\`
\`import numpy as np\`
\`X, y = load_iris(return_X_y=True)\`
\`petal_len = X[:, 2]\`
\`preds = (petal_len < 2.5).astype(int)\`  # 1 means setosa
\`truth = (y == 0).astype(int)\`
\`print(round((preds == truth).mean(), 3))\`  # ≈ 1.0
This is a degenerate model that learned one split — the seed of decision trees (Module B7).

## Practical Exercise
\`from sklearn.datasets import load_iris\`
\`X, y = load_iris(return_X_y=True)\`
\`petal_len = X[:, 2]\`
\`thr = 2.5\`
\`preds = (petal_len < thr).astype(int)\`
\`truth = (y == 0).astype(int)\`
\`print(round((preds == truth).mean(), 3))\`
Task 1: run. Task 2: raise thr to 5.0 and rerun.
Check: thr = 2.5 gives ≈ 1.0; thr = 5.0 drops because some versicolor flowers get mislabeled as setosa.

## Key Takeaways
- ML = learning f(X) → y from examples, instead of writing rules by hand.
- Supervised (labels) vs unsupervised (no labels) vs reinforcement (rewards).
- Feature = input, label = target; a model is just a parameterized f.
- Even a single if-then rule is a (simple) learned model.

## Quiz Answer Key (attempt the quiz first)
1. (b) A classic program hard-codes rules; ML learns them from data.
2. (c) Reinforcement learning uses rewards; the email task has labels (supervised).
3. False — spam detection has a label, so it is supervised.
4. decision.
5. (a) A model maps features to a prediction.
`,
  quiz: {
    title: "Quiz — What Is Machine Learning?",
    description: "Five questions on the definition of ML, learning types, and features vs labels.",
    timeLimit: 10,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        questionText: "A traditional program and a machine-learning model differ mainly in that:",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "the language they use", isCorrect: false },
          { id: "b", text: "the program learns rules from data; the classic program uses hand-written rules", isCorrect: true },
          { id: "c", text: "ML is always faster", isCorrect: false },
          { id: "d", text: "ML uses bigger files", isCorrect: false },
        ],
        correctAnswer: "b",
      },
      {
        questionText: "A chatbot that improves at a game by winning or losing is learning with:",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "supervised learning", isCorrect: false },
          { id: "b", text: "unsupervised learning", isCorrect: false },
          { id: "c", text: "reinforcement learning", isCorrect: true },
          { id: "d", text: "none of these", isCorrect: false },
        ],
        correctAnswer: "c",
      },
      {
        questionText: "Classifying emails as spam or not spam is an unsupervised task.",
        questionType: "true_false",
        correctAnswer: "false",
      },
      {
        questionText: "A single if-then rule (like the iris threshold) is the simplest form of a ______ tree.",
        questionType: "fill_blank",
        correctAnswer: "decision",
      },
      {
        questionText: "A model is best described as:",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "a function that maps features to a prediction", isCorrect: true },
          { id: "b", text: "a dataset", isCorrect: false },
          { id: "c", text: "a Python library", isCorrect: false },
          { id: "d", text: "a label", isCorrect: false },
        ],
        correctAnswer: "a",
      },
    ],
  },
    assignment: {
    title: "Assignment 1.4 — ML Concepts",
    description: "Answer each in 1-3 sentences: (1) Why is spam detection supervised rather than hand-written rules? (2) One real-world unsupervised task + one business value. (3) In the iris one-rule model, what is X and y. Good: supervised = labeled examples; unsupervised = grouping customers to target offers; X = petal length, y = species. Rubric: 6 + 8 + 6 = 20.",
    dueDate: "2026-07-11T23:59:59Z",
    totalMarks: 20,
    passingScore: 10,
    assignmentType: "subjective",
    questions: [
      { id: "q1", type: "subjective", title: "Why is spam detection supervised rather than a hand-written rule filter?", marks: 6 },
      { id: "q2", type: "subjective", title: "Give one real-world unsupervised task and one business value of solving it.", marks: 8 },
      { id: "q3", type: "subjective", title: "In the iris one-rule model, what is X and what is y?", marks: 6 },
    ],
  },
}
