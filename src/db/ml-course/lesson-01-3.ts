import type { MlLessonData } from './types'

// ─── Lesson 1.3 — Pandas, EDA, cleaning & scaling ──────────────────────────────
export const lesson01_3: MlLessonData = {
  title: "Pandas Basics, EDA, Data Cleaning & Feature Scaling",
  duration: 30,
  content: `## Learning Objectives
By the end of this lesson you should be able to:
- Load a small dataset into a pandas DataFrame and inspect it.
- Handle missing values and encode a categorical column.
- Apply StandardScaler to the numeric features only.

## Introduction
NumPy handles the math; pandas handles the messy reality of data: tables with mixed types, missing cells, text columns. Real ML is mostly cleaning a table and then handing the numeric part to NumPy. This lesson is that bridge.

## DataFrames & Inspection
\`import pandas as pd\`
\`from sklearn.datasets import load_iris\`
\`X, y = load_iris(return_X_y=True)\`
\`df = pd.DataFrame(X, columns=['sepal_L','sepal_W','petal_L','petal_W'])\`
\`df.head()\`, \`df.shape\`, \`df.dtypes\`, \`df.describe()\`
\`df['petal_L'].mean()\`  # a Series is a named column.

## Missing Values & Encoding
Missing data shows as NaN. \`df.isna().sum()\` counts per column.
Fill or drop: \`df['price'].fillna(df['price'].median())\` or \`df.dropna(subset=['price'])\`.
Text → numbers: \`df['kind'] = df['kind'].map({'cat':0, 'dog':1})\` (ordinal); or one-hot for nominal:
\`pd.get_dummies(df, columns=['kind'], drop_first=True)\`.

## Scaling (features only)
\`from sklearn.preprocessing import StandardScaler\`
\`scaler = StandardScaler()\`
\`num_cols = ['sepal_L','sepal_W','petal_L','petal_W']\`
\`df[num_cols] = scaler.fit_transform(df[num_cols])\`
After this each feature column has mean ≈ 0 and std ≈ 1.

## Worked Example — Clean & Scale Iris
\`import pandas as pd, numpy as np\`
\`from sklearn.datasets import load_iris\`
\`from sklearn.preprocessing import StandardScaler\`
\`X, y = load_iris(return_X_y=True)\`
\`df = pd.DataFrame(X, columns=['sepal_L','sepal_W','petal_L','petal_W'])\`
\`df.loc[0, 'petal_L'] = np.nan\`  # pretend a value is missing
\`print(df['petal_L'].isna().sum())\`  # 1
\`df['petal_L'] = df['petal_L'].fillna(df['petal_L'].mean())\`
\`df[num_cols] = StandardScaler().fit_transform(df[num_cols])\`
\`print(round(df['petal_L'].mean(), 6))\`  # ≈ 0.0

## Practical Exercise
\`import pandas as pd\`
\`from sklearn.datasets import load_iris\`
\`X, y = load_iris(return_X_y=True)\`
\`df = pd.DataFrame(X, columns=['a','b','c','d'])\`
\`print(df['a'].mean())\`   # ?
\`df['species'] = y\`
\`print(df['species'].nunique())\`   # ?
\`print(len(df))\`           # ?
Check: a.mean() ≈ 5.84, nunique = 3, len = 150.

## Key Takeaways
- pandas stores mixed-type tables; NumPy stores the numeric arrays they feed.
- Missing values are NaN — fill (mean/median) or drop, never leave for the model.
- Encode categories: map for ordinal, get_dummies for nominal.
- Scale numeric features only — never the label column.

## Quiz Answer Key (attempt the quiz first)
1. (b) pandas is built for tabular data with mixed types.
2. (c) NaN marks a missing value.
3. False — scaling the label breaks the target the model must reproduce.
4. (b) fit_transform fits and applies in one call.
5. (c) 5.84.
`,
  quiz: {
    title: "Quiz — Pandas, EDA, Cleaning & Scaling",
    description: "Five questions on DataFrames, missing values, encoding, and scaling.",
    timeLimit: 10,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        questionText: "Which library is built for loading mixed-type tabular data into DataFrames?",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "NumPy", isCorrect: false },
          { id: "b", text: "matplotlib", isCorrect: false },
          { id: "c", text: "pandas", isCorrect: true },
          { id: "d", text: "requests", isCorrect: false },
        ],
        correctAnswer: "c",
      },
      {
        questionText: "In pandas, a missing value displays as:",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "0", isCorrect: false },
          { id: "b", text: "None", isCorrect: false },
          { id: "c", text: "NaN", isCorrect: true },
          { id: "d", text: "-1", isCorrect: false },
        ],
        correctAnswer: "c",
      },
      {
        questionText: "StandardScaler should be applied to the label column (y) as well as the features.",
        questionType: "true_false",
        correctAnswer: "false",
      },
      {
        questionText: "The pandas call that fills missing values with the column mean is df['x'].______(...).",
        questionType: "fill_blank",
        correctAnswer: "fillna",
      },
      {
        questionText: "In the Practical Exercise, print(df['a'].mean()) prints approximately:",
        questionType: "multiple_choice",
        options: [
          { id: "a", text: "0.0", isCorrect: false },
          { id: "b", text: "1.0", isCorrect: false },
          { id: "c", text: "5.84", isCorrect: true },
          { id: "d", text: "150", isCorrect: false },
        ],
        correctAnswer: "c",
      },
    ],
  },
    assignment: {
    title: "Assignment 1.3 — Clean, Encode & Scale",
    description: "You have a customer DataFrame df with columns ['age','income','gender'] (gender 'M'/'F', income has missing values) and a target Series y (0/1). Write pandas+sklearn to (1) fill missing incomes with the median, (2) one-hot encode gender, (3) scale age and income with StandardScaler, keeping y separate. Good: median fillna, get_dummies on gender, StandardScaler on ['age','income'] only, y untouched. Rubric: 4 + 6 + 6 + 4 = 20.",
    dueDate: "2026-07-10T23:59:59Z",
    totalMarks: 20,
    passingScore: 10,
    assignmentType: "mixed",
    questions: [
      { id: "q1", type: "theory", title: "Show the exact pandas/scikit-learn calls for steps 1-3 above.", marks: 10 },
      { id: "q2", type: "subjective", title: "Why must StandardScaler be fit on the training features only, never on rows that belong to the test set — one sentence?", marks: 10 },
    ],
  },
}
