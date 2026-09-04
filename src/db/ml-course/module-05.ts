import type { MlModuleData, MlLessonData } from './types'

const lessons: MlLessonData[] = []

lessons.push({
  title: 'D1 — Classification Metrics',
  duration: 10,
  content: `# D1 — Classification Metrics

Accuracy alone is misleading. Precision, recall, F1, and ROC-AUC reveal different failure modes.

## Learning Objectives
- Define precision, recall, and F1.
- Compute metrics with classification_report.
- Explain when to prioritize precision vs recall.

## Introduction
Accuracy = correct / total. But on imbalanced data, predicting the majority class gives high accuracy while failing the minority. Precision = of predicted positives, how many are correct. Recall = of actual positives, how many did we find. F1 balances both.

## Metrics
from sklearn.metrics import classification_report
print(classification_report(y_test, y_pred))
# per-class precision, recall, f1, support + averages

## When to Prioritize
- Precision: avoid false alarms (spam filter).
- Recall: avoid missing positives (disease screening).
- F1: balanced view.

## Practical Exercise
Run this:
from sklearn.metrics import precision_score, recall_score, f1_score
y_true = [0,0,0,0,0,1,1,1,1,1]
y_pred = [0,0,0,0,1,1,1,1,1,1]
print("precision:", round(precision_score(y_true, y_pred), 2))
print("recall:", round(recall_score(y_true, y_pred), 2))
Tasks: (1) precision vs recall; (2) make a perfect predictor and recompute. Check: precision 0.83 (1 false positive), recall 1.0; perfect gives 1.0/1.0.

## Key Takeaways
- Precision = TP / (TP + FP); recall = TP / (TP + FN).
- F1 = harmonic mean of precision and recall.
- Use classification_report for a full picture.
- ROC-AUC measures ranking quality across thresholds.

## Quiz Answer Key
1. (b) Precision = TP / (TP + FP).
2. (a) Recall = TP / (TP + FN).
3. False — accuracy is misleading on imbalanced data.
4. (c) F1 balances precision and recall.
5. (b) Disease screening prioritizes recall.
`,
  quiz: {
    title: 'Quiz D1 — Classification Metrics',
    description: '5 auto-gradable questions on precision, recall, F1.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Precision is defined as:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'TP / (TP + FN)', isCorrect: false }, { id: 'b', text: 'TP / (TP + FP)', isCorrect: true }, { id: 'c', text: 'TP / (TP + TN)', isCorrect: false }, { id: 'd', text: 'TP / total', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Recall is defined as:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'TP / (TP + FN)', isCorrect: true }, { id: 'b', text: 'TP / (TP + FP)', isCorrect: false }, { id: 'c', text: 'TN / (TN + FP)', isCorrect: false }, { id: 'd', text: 'TP / total', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Accuracy is reliable on imbalanced data.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: F1 is the ______ mean of precision and recall.', questionType: 'fill_blank', correctAnswer: 'harmonic' },
      { id: 'q5', questionText: 'Disease screening prioritizes:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Precision', isCorrect: false }, { id: 'b', text: 'Recall', isCorrect: true }, { id: 'c', text: 'Specificity', isCorrect: false }, { id: 'd', text: 'Speed', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment D1 — Metric Report',
    description: 'Train a classifier on iris, print classification_report, and explain one class where precision != recall. Good: correct report + explanation; rubric: 8 report, 6 explanation, 6 interpretation = 20.',
    dueDate: '2026-07-31T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train a classifier on iris, print classification_report, and explain one class where precision differs from recall.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When would you optimize F1 over accuracy?', marks: 8 }],
  },
})

lessons.push({
  title: 'D2 — Regression Metrics',
  duration: 8,
  content: `# D2 — Regression Metrics

MSE, RMSE, and R-squared quantify regression error on the original scale or relative to a baseline.

## Learning Objectives
- Compute MSE, RMSE, and R-squared.
- Interpret each metric in context.
- Explain why R-squared can be misleading.

## Introduction
MSE = mean squared error (punishes large errors). RMSE = sqrt(MSE), in the same units as the target. R-squared = fraction of variance explained; 1 is perfect, 0 means "no better than predicting the mean."

## Metrics
from sklearn.metrics import mean_squared_error, r2_score
mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y_test, y_pred)

## Practical Exercise
Run this:
from sklearn.metrics import mean_squared_error, r2_score
y_true = [3, 5, 7]
y_pred = [3, 4, 8]
print("MSE:", round(mean_squared_error(y_true, y_pred), 2))
print("R2:", round(r2_score(y_true, y_pred), 2))
Tasks: (1) compute by hand; (2) perfect predictions give R2 = 1. Check: MSE = (0+1+1)/3 = 0.67; R2 ~ 0.75; perfect gives R2 = 1.0.

## Key Takeaways
- MSE punishes large errors; RMSE is in target units.
- R-squared is relative to the mean baseline.
- R-squared can be negative (worse than predicting the mean).
- Always report at least two metrics.

## Quiz Answer Key
1. (b) MSE = mean squared error.
2. (a) RMSE is in the same units as the target.
3. False — R-squared can be negative.
4. (c) R-squared of 1 means perfect prediction.
5. (b) MSE penalizes large errors more than MAE.
`,
  quiz: {
    title: 'Quiz D2 — Regression Metrics',
    description: '5 auto-gradable questions on MSE, RMSE, R-squared.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'MSE stands for:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Model Selection Error', isCorrect: false }, { id: 'b', text: 'Mean Squared Error', isCorrect: true }, { id: 'c', text: 'Maximum Squared Error', isCorrect: false }, { id: 'd', text: 'Minimum Standard Error', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'RMSE is in:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The same units as the target', isCorrect: true }, { id: 'b', text: 'Squared units', isCorrect: false }, { id: 'c', text: 'Percent', isCorrect: false }, { id: 'd', text: 'Log units', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: R-squared is always between 0 and 1.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: R-squared of 1 means ______ prediction.', questionType: 'fill_blank', correctAnswer: 'perfect' },
      { id: 'q5', questionText: 'MSE vs MAE, which penalizes large errors more:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'MAE', isCorrect: false }, { id: 'b', text: 'MSE', isCorrect: true }, { id: 'c', text: 'Both equally', isCorrect: false }, { id: 'd', text: 'Neither', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment D2 — Regression Report',
    description: 'Train a regressor on a small dataset; report MSE, RMSE, R2 and interpret. Good: correct metrics + interpretation; rubric: 8 metrics, 6 interpretation, 6 comparison = 20.',
    dueDate: '2026-08-01T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train a regressor, report MSE/RMSE/R2, and explain what R2 means for this dataset.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When would you report RMSE instead of MSE?', marks: 8 }],
  },
})

lessons.push({
  title: 'D3 — Confusion Matrices & Error Analysis',
  duration: 8,
  content: `# D3 — Confusion Matrices & Error Analysis

A confusion matrix shows exactly where a classifier succeeds and fails — the basis for precision, recall, and targeted improvement.

## Learning Objectives
- Read a confusion matrix (TP, FP, TN, FN).
- Derive precision and recall from the matrix.
- Use error analysis to guide next steps.

## Introduction
Rows = actual, columns = predicted. The diagonal is correct. Off-diagonal cells reveal confusion between specific classes — the most actionable diagnostic a classifier provides.

## Reading the Matrix
from sklearn.metrics import confusion_matrix
# cm[i][j] = actual i, predicted j
# TP on diagonal; FP in column (predicted but wrong); FN in row (missed).

## Worked Example
For binary: TN=cm[0][0], FP=cm[0][1], FN=cm[1][0], TP=cm[1][1].
precision = TP / (TP + FP); recall = TP / (TP + FN).

## Practical Exercise
Given cm = [[45,5],[3,47]], compute precision and recall for class 1. Check: precision = 47/52 ~ 0.90; recall = 47/50 = 0.94.

## Key Takeaways
- Confusion matrix: rows = actual, columns = predicted.
- Diagonal = correct; off-diagonal = confusion.
- Error analysis points at which classes to improve.
- Heatmap visualizations (seaborn) make patterns obvious.

## Quiz Answer Key
1. (b) Rows = actual, columns = predicted.
2. (a) The diagonal holds correct predictions.
3. False — the matrix reveals per-class errors, not just accuracy.
4. (c) Off-diagonal cells show confusion between classes.
5. (b) Error analysis guides targeted improvements.
`,
  quiz: {
    title: 'Quiz D3 — Confusion Matrices',
    description: '5 auto-gradable questions on confusion matrices.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'In a confusion matrix:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Rows = predicted', isCorrect: false }, { id: 'b', text: 'Rows = actual, columns = predicted', isCorrect: true }, { id: 'c', text: 'Columns = actual', isCorrect: false }, { id: 'd', text: 'Rows = scores', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Correct predictions sit on:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The diagonal', isCorrect: true }, { id: 'b', text: 'The first row', isCorrect: false }, { id: 'c', text: 'The last column', isCorrect: false }, { id: 'd', text: 'The margins', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: A confusion matrix only shows overall accuracy.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Off-diagonal cells show ______ between classes.', questionType: 'fill_blank', correctAnswer: 'confusion' },
      { id: 'q5', questionText: 'Error analysis is used to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Delete the model', isCorrect: false }, { id: 'b', text: 'Guide targeted improvements', isCorrect: true }, { id: 'c', text: 'Increase batch size', isCorrect: false }, { id: 'd', text: 'Change the language', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment D3 — Error Analysis',
    description: 'Train a classifier, print a confusion matrix, identify the most confused class pair, and suggest a fix. Good: matrix + insight; rubric: 8 matrix, 6 insight, 6 fix = 20.',
    dueDate: '2026-08-02T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train a classifier, show the confusion matrix, identify the most confused pair, and suggest one fix.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is a matrix more useful than accuracy for imbalanced data?', marks: 8 }],
  },
})

lessons.push({
  title: 'D4 — Hyperparameter Tuning',
  duration: 10,
  content: `# D4 — Hyperparameter Tuning

Hyperparameters control model behavior (max_depth, C, learning rate). Grid search and random search find good combinations systematically.

## Learning Objectives
- Distinguish parameters from hyperparameters.
- Run GridSearchCV and RandomizedSearchCV.
- Use cross-validated scores to pick the best setup.

## Introduction
Parameters are learned (weights); hyperparameters are set before training. GridSearchCV tries every combination in a grid; RandomizedSearchCV samples — usually faster and nearly as good.

## Grid Search
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC

param_grid = {"C": [0.1, 1, 10], "kernel": ["linear", "rbf"]}
search = GridSearchCV(SVC(), param_grid, cv=5).fit(X_train, y_train)
print(search.best_params_, round(search.best_score_, 3))

## Random Search
from sklearn.model_selection import RandomizedSearchCV
distributions = {"C": [0.01, 0.1, 1, 10, 100], "kernel": ["linear", "rbf"]}
search = RandomizedSearchCV(SVC(), distributions, n_iter=6, cv=5, random_state=42).fit(X_train, y_train)

## Practical Exercise
Run this:
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
search = GridSearchCV(SVC(), {"C": [0.1, 1, 10]}, cv=5).fit(X_train, y_train)
print(search.best_params_)
print(round(search.score(X_test, y_test), 3))
Tasks: (1) what prints; (2) add kernel to the grid. Check: best C and CV score; adding kernel expands the search.

## Key Takeaways
- GridSearchCV: exhaustive; RandomizedSearchCV: sampled.
- Always cross-validate (cv parameter).
- best_params_ gives the winning combo; best_score_ is CV score.
- Never tune on the test set.

## Quiz Answer Key
1. (b) GridSearchCV tries every combination in the grid.
2. (a) best_params_ returns the best hyperparameter combo.
3. False — never tune hyperparameters on the test set.
4. (c) cv in GridSearchCV controls cross-validation folds.
5. (b) RandomizedSearchCV is usually faster than exhaustive grid search.
`,
  quiz: {
    title: 'Quiz D4 — Hyperparameter Tuning',
    description: '5 auto-gradable questions on grid/random search.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'GridSearchCV:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Samples random combos', isCorrect: false }, { id: 'b', text: 'Tries every combination', isCorrect: true }, { id: 'c', text: 'Only tunes the learning rate', isCorrect: false }, { id: 'd', text: 'Needs no CV', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'best_params_ gives:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The best hyperparameter combo', isCorrect: true }, { id: 'b', text: 'The test score', isCorrect: false }, { id: 'c', text: 'The data shape', isCorrect: false }, { id: 'd', text: 'Training time', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: It is fine to tune on the test set.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: cv controls the number of ______ folds.', questionType: 'fill_blank', correctAnswer: 'cross-validation' },
      { id: 'q5', questionText: 'RandomizedSearchCV is preferred when:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The grid is small', isCorrect: false }, { id: 'b', text: 'The search space is large', isCorrect: true }, { id: 'c', text: 'You need exact results', isCorrect: false }, { id: 'd', text: 'There is no CV', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment D4 — Tune a Model',
    description: 'Run GridSearchCV on SVC over C and kernel; report best params and test accuracy. Good: correct search + report; rubric: 8 search, 6 report, 6 interpretation = 20.',
    dueDate: '2026-08-03T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Run GridSearchCV on SVC(C, kernel) with cv=5; report best_params_ and test accuracy.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why use cross_val_score instead of a single split for tuning?', marks: 8 }],
  },
})

lessons.push({
  title: 'D5 — Feature Engineering & Handling Imbalanced Data',
  duration: 10,
  content: `# D5 — Feature Engineering & Handling Imbalanced Data

Better features often beat a better model. And imbalanced classes need resampling or class weights.

## Learning Objectives
- Engineer features (bins, interactions, polynomial).
- Use class_weight and resampling for imbalanced data.
- Select features with SelectKBest or importance ranking.

## Introduction
Domain knowledge becomes features: ratios, bins, interactions, log transforms. Meanwhile, a 99:1 class split makes accuracy meaningless — use class_weight="balanced" or SMOTE resampling.

## Feature Engineering
import pandas as pd
df["ratio"] = df["a"] / (df["b"] + 1e-6)
df["age_bin"] = pd.cut(df["age"], bins=[0, 18, 35, 60, 100])
from sklearn.preprocessing import PolynomialFeatures
X_poly = PolynomialFeatures(degree=2, include_bias=False).fit_transform(X)

## Imbalanced Data
model = RandomForestClassifier(class_weight="balanced").fit(X_train, y_train)
# or SMOTE oversampling (imbalanced-learn library)

## Feature Selection
from sklearn.feature_selection import SelectKBest, f_classif
X_new = SelectKBest(f_classif, k=5).fit_transform(X, y)

## Practical Exercise
Run this:
import pandas as pd
df = pd.DataFrame({"a": [1,2,3], "b": [2,4,6]})
df["ratio"] = df["a"] / df["b"]
print(df)
Tasks: (1) what prints; (2) add an age_bin column. Check: ratio column [0.5, 0.5, 0.5]; cut bins ages into categories.

## Key Takeaways
- Domain-driven features often matter more than model choice.
- class_weight="balanced" penalizes misclassifying the minority.
- SMOTE synthetically oversamples the minority class.
- SelectKBest keeps the top-k scoring features.

## Quiz Answer Key
1. (b) Feature engineering creates new inputs from domain knowledge.
2. (a) class_weight="balanced" handles imbalance.
3. False — accuracy is misleading on imbalanced data.
4. (c) SelectKBest keeps the top-k features by score.
5. (b) SMOTE oversamples the minority class.
`,
  quiz: {
    title: 'Quiz D5 — Feature Engineering & Imbalance',
    description: '5 auto-gradable questions on features and imbalance.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Feature engineering is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Buying more data', isCorrect: false }, { id: 'b', text: 'Creating new inputs from domain knowledge', isCorrect: true }, { id: 'c', text: 'Deleting all features', isCorrect: false }, { id: 'd', text: 'Training longer', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'class_weight="balanced" helps with:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Imbalanced classes', isCorrect: true }, { id: 'b', text: 'Missing values', isCorrect: false }, { id: 'c', text: 'Scaling', isCorrect: false }, { id: 'd', text: 'Visualization', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Accuracy is reliable on 99:1 imbalanced data.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: SelectKBest keeps the top-______ features.', questionType: 'fill_blank', correctAnswer: 'k' },
      { id: 'q5', questionText: 'SMOTE is used to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Scale features', isCorrect: false }, { id: 'b', text: 'Oversample the minority class', isCorrect: true }, { id: 'c', text: 'Delete outliers', isCorrect: false }, { id: 'd', text: 'Speed training', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment D5 — Engineer & Balance',
    description: 'Create 2 new features from a raw dataset; train a classifier on imbalanced data with and without class_weight and compare F1. Good: features + comparison; rubric: 8 features, 6 comparison, 6 explanation = 20.',
    dueDate: '2026-08-04T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Create two new features, then compare F1 with and without class_weight="balanced" on an imbalanced dataset.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why might a hand-crafted feature beat a deeper model?', marks: 8 }],
  },
})

export const module05: MlModuleData = { title: 'Module 5 — Model Evaluation & Practice', lessons }
