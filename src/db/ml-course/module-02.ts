import type { MlModuleData, MlLessonData } from './types'

const lessons: MlLessonData[] = []

lessons.push({
  title: 'B1 — Linear Regression',
  duration: 12,
  content: `# B1 — Linear Regression

Linear regression fits a straight line to predict a continuous target from one or more features.

## Learning Objectives
- Explain what a regression line minimizes (squared error).
- Train a LinearRegression on a small dataset with scikit-learn.
- Interpret the slope, intercept, and R-squared.

## Introduction
Linear regression models the relationship y = wx + b by finding weights that minimize the sum of squared residuals. It is the simplest supervised learner and the foundation for many others.

## Training
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

model = LinearRegression()
model.fit(X, y)
print(model.coef_)      # slope
print(model.intercept_) # intercept
print(model.score(X, y)) # R-squared

## Worked Example — Study Hours vs Score
Hours studied -> exam score. The line of best fit predicts score for unseen hours. R-squared near 1 means the line explains most of the variance.

## Practical Exercise
Run this:
from sklearn.linear_model import LinearRegression
import numpy as np
X = np.array([[1],[2],[3],[4],[5]])
y = np.array([50, 60, 70, 80, 90])
model = LinearRegression().fit(X, y)
print(round(model.coef_[0], 1))
print(round(model.predict([[6]])[0], 1))
Tasks: (1) what prints; (2) change y to [50,55,75,85,90] and recompute. Check: slope ~10.0, prediction for 6 hours ~100.0; the noisier y lowers R-squared.

## Key Takeaways
- LinearRegression minimizes squared error.
- .coef_ are the feature weights; .intercept_ is the bias.
- R-squared (model.score) measures explained variance.
- Assumes a linear relationship and roughly normal residuals.

## Quiz Answer Key
1. (b) Linear regression minimizes the sum of squared residuals.
2. (a) model.coef_ holds the learned feature weights.
3. False — R-squared measures explained variance, not classification accuracy.
4. (c) model.predict(X_new) returns predictions for new data.
5. (b) A residual is the difference between actual and predicted y.
`,
  quiz: {
    title: 'Quiz B1 — Linear Regression',
    description: '5 auto-gradable questions on linear regression.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Linear regression minimizes:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Absolute error', isCorrect: false }, { id: 'b', text: 'Sum of squared residuals', isCorrect: true }, { id: 'c', text: 'Cross-entropy', isCorrect: false }, { id: 'd', text: 'Margin', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'model.coef_ contains:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The learned feature weights', isCorrect: true }, { id: 'b', text: 'The intercept', isCorrect: false }, { id: 'c', text: 'The R-squared', isCorrect: false }, { id: 'd', text: 'The residuals', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: R-squared of 1.0 means perfect classification.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: model.______ returns predictions for new data.', questionType: 'fill_blank', correctAnswer: 'predict' },
      { id: 'q5', questionText: 'A residual is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The slope', isCorrect: false }, { id: 'b', text: 'Actual minus predicted y', isCorrect: true }, { id: 'c', text: 'The intercept', isCorrect: false }, { id: 'd', text: 'Always zero', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B1 — Regression Practice',
    description: 'Train a linear regression on a small dataset, report coef_, intercept_, R-squared, and a prediction for a new point. Good: correct training, correct interpretation; rubric: 6 train, 6 interpret, 4 predict, 4 explanation = 20.',
    dueDate: '2026-07-13T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train LinearRegression on X=[[1],[2],[3]], y=[3,5,7]; report coef_, intercept_, score, and predict for [[4]].', marks: 12 }, { id: 'q2', type: 'subjective', title: 'What does the slope mean in this context?', marks: 8 }],
  },
})

lessons.push({
  title: 'B2 — Logistic Regression',
  duration: 10,
  content: `# B2 — Logistic Regression

Logistic regression predicts class probabilities using a sigmoid; it is the go-to binary classifier.

## Learning Objectives
- Explain why a sigmoid maps scores to probabilities.
- Train LogisticRegression and read .predict vs .predict_proba.
- Interpret the decision boundary.

## Introduction
Despite its name, logistic regression is a classifier. It passes a linear score through a sigmoid to get a probability in (0, 1); the default threshold 0.5 decides the class.

## Training
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
import numpy as np

X, y = load_iris(return_X_y=True)
mask = y < 2                       # binary: setosa vs versicolor
X, y = X[mask, :2], y[mask]

model = LogisticRegression().fit(X, y)
print(model.predict(X[:3]))
print(model.predict_proba(X[:3]).round(2))

## Worked Example — Spam or Not
Two features (word counts) -> spam probability. The decision boundary is a line in feature space; points on one side are predicted spam.

## Practical Exercise
Run this:
from sklearn.linear_model import LogisticRegression
import numpy as np
X = np.array([[0],[1],[2],[3]])
y = np.array([0, 0, 1, 1])
model = LogisticRegression().fit(X, y)
print(model.predict([[1.5]])[0])
print(round(model.predict_proba([[1.5]])[0, 1], 2))
Tasks: (1) what prints; (2) move the threshold by checking proba directly. Check: class 1; probability ~0.62 (above 0.5).

## Key Takeaways
- LogisticRegression outputs probabilities via the sigmoid.
- .predict gives the class; .predict_proba gives probabilities.
- The decision boundary is linear in feature space.
- Regularization (C parameter) controls overfitting.

## Quiz Answer Key
1. (b) Logistic regression is a binary classifier.
2. (a) .predict_proba returns class probabilities.
3. False — the decision boundary is linear in the features.
4. (c) The sigmoid maps any score to (0, 1).
5. (b) Lower C means stronger regularization.
`,
  quiz: {
    title: 'Quiz B2 — Logistic Regression',
    description: '5 auto-gradable questions on logistic regression.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Logistic regression is primarily a:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Regression model', isCorrect: false }, { id: 'b', text: 'Binary classifier', isCorrect: true }, { id: 'c', text: 'Clustering algorithm', isCorrect: false }, { id: 'd', text: 'Dimensionality reducer', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '.predict_proba returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Class probabilities', isCorrect: true }, { id: 'b', text: 'The class label', isCorrect: false }, { id: 'c', text: 'The slope', isCorrect: false }, { id: 'd', text: 'Residuals', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: The decision boundary of logistic regression is always nonlinear.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: The ______ function maps scores to (0, 1).', questionType: 'fill_blank', correctAnswer: 'sigmoid' },
      { id: 'q5', questionText: 'A smaller C in LogisticRegression means:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Weaker regularization', isCorrect: false }, { id: 'b', text: 'Stronger regularization', isCorrect: true }, { id: 'c', text: 'More features', isCorrect: false }, { id: 'd', text: 'Higher accuracy', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B2 — Classification Practice',
    description: 'Train LogisticRegression on a binary iris subset; report predictions, probabilities, and the decision for a new point. Good: correct training, correct outputs; rubric: 6 train, 6 outputs, 4 threshold, 4 explanation = 20.',
    dueDate: '2026-07-14T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train on the binary iris subset (first two features, classes 0/1); show predict and predict_proba for two new points.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'How would you lower false positives by adjusting the threshold?', marks: 8 }],
  },
})

lessons.push({
  title: 'B3 — Train/Test Split & Cross-Validation',
  duration: 10,
  content: `# B3 — Train/Test Split & Cross-Validation

Evaluating on training data is cheating. Hold out a test set, or use cross-validation, to estimate real-world performance.

## Learning Objectives
- Split data with train_test_split.
- Explain why test accuracy < training accuracy usually.
- Run k-fold cross-validation with cross_val_score.

## Introduction
A model that memorizes the training set scores 100% there but fails on new data. train_test_split holds out a test set; cross_val_score rotates the holdout k times for a stable estimate.

## Train/Test Split
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

## Cross-Validation
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)
print(scores.mean(), scores.std())

## Worked Example — Reliable Accuracy
5-fold CV on iris with a decision tree gives a mean and spread; the spread tells you how stable the estimate is.

## Practical Exercise
Run this:
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
X, y = load_iris(return_X_y=True)
scores = cross_val_score(DecisionTreeClassifier(), X, y, cv=5)
print(round(scores.mean(), 3))
print(len(scores))
Tasks: (1) what prints; (2) change cv=10 and compare. Check: mean ~0.95 and 5 scores; cv=10 gives 10 scores with similar mean.

## Key Takeaways
- train_test_split holds out data the model never sees during training.
- cross_val_score rotates the holdout for a stable estimate.
- High train accuracy + low test accuracy signals overfitting.
- Always set random_state for reproducibility.

## Quiz Answer Key
1. (b) train_test_split holds out data the model never trains on.
2. (a) cross_val_score rotates the holdout k times.
3. False — test accuracy is usually lower than train accuracy.
4. (c) High train + low test accuracy signals overfitting.
5. (b) random_state makes splits reproducible.
`,
  quiz: {
    title: 'Quiz B3 — Train/Test Split & CV',
    description: '5 auto-gradable questions on splitting and cross-validation.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'train_test_split is used to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Speed up training', isCorrect: false }, { id: 'b', text: 'Hold out unseen data for evaluation', isCorrect: true }, { id: 'c', text: 'Clean missing values', isCorrect: false }, { id: 'd', text: 'Scale features', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'cross_val_score with cv=5:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Trains 5 models on rotating holdouts', isCorrect: true }, { id: 'b', text: 'Splits into 5 test sets at once', isCorrect: false }, { id: 'c', text: 'Runs 5 seconds', isCorrect: false }, { id: 'd', text: 'Deletes 5 features', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Test accuracy is usually higher than training accuracy.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: High train accuracy with low test accuracy signals ______.', questionType: 'fill_blank', correctAnswer: 'overfitting' },
      { id: 'q5', questionText: 'random_state ensures:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Higher accuracy', isCorrect: false }, { id: 'b', text: 'Reproducible splits', isCorrect: true }, { id: 'c', text: 'Faster training', isCorrect: false }, { id: 'd', text: 'More features', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B3 — Evaluation Setup',
    description: 'Split iris into train/test, train a classifier, report both accuracies, then run 5-fold CV and compare. Good: correct split, both metrics, comparison; rubric: 6 split, 6 metrics, 4 CV, 4 comparison = 20.',
    dueDate: '2026-07-15T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Split iris (test_size=0.3), train a DecisionTree, report train and test accuracy, then run cross_val_score(cv=5) and compare.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why prefer cross-validation over a single split?', marks: 8 }],
  },
})

lessons.push({
  title: 'B4 — Bias-Variance Tradeoff',
  duration: 10,
  content: `# B4 — Bias-Variance Tradeoff

Underfitting is high bias; overfitting is high variance. The tradeoff is the central tension in model selection.

## Learning Objectives
- Distinguish underfitting (high bias) from overfitting (high variance).
- Diagnose each from train/test accuracy curves.
- Choose model complexity to balance the two.

## Introduction
A model too simple misses real patterns (high bias, underfit). A model too complex memorizes noise (high variance, overfit). The sweet spot minimizes total generalization error.

## Diagnosis
- High bias: train accuracy low, test accuracy similarly low.
- High variance: train accuracy high, test accuracy much lower.

## Remedies
- High bias: more features, a more complex model, longer training.
- High variance: more data, regularization, a simpler model, early stopping.

## Worked Example — Polynomial Degree
Degree-1 polynomial underfits a curve; degree-15 overfits. Degree-3 or 4 balances bias and variance and generalizes best.

## Practical Exercise
Sketch (mentally) train vs test accuracy as model complexity increases.
Tasks: (1) where is bias highest; (2) where is variance highest. Check: bias high at low complexity; variance high at high complexity.

## Key Takeaways
- Bias = error from overly simple assumptions; variance = error from sensitivity to noise.
- Total error = bias^2 + variance + irreducible noise.
- The goal is the complexity that minimizes generalization error.
- Regularization and more data are the two main levers.

## Quiz Answer Key
1. (b) High bias means the model is too simple and underfits.
2. (a) High variance shows as a big gap between train and test accuracy.
3. False — irreducible noise cannot be eliminated by any model.
4. (c) Regularization reduces variance at the cost of a little bias.
5. (b) More training data mainly reduces variance.
`,
  quiz: {
    title: 'Quiz B4 — Bias-Variance Tradeoff',
    description: '5 auto-gradable questions on bias, variance, and the tradeoff.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'High bias typically means the model is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Too complex', isCorrect: false }, { id: 'b', text: 'Too simple and underfitting', isCorrect: true }, { id: 'c', text: 'Perfectly tuned', isCorrect: false }, { id: 'd', text: 'Overfitting', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'High variance shows up as:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A large gap between train and test accuracy', isCorrect: true }, { id: 'b', text: 'Low train accuracy', isCorrect: false }, { id: 'c', text: 'Zero error', isCorrect: false }, { id: 'd', text: 'Identical train and test accuracy', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Irreducible noise can be removed by a better model.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Regularization trades a little more ______ for much less variance.', questionType: 'fill_blank', correctAnswer: 'bias' },
      { id: 'q5', questionText: 'More training data primarily reduces:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Bias', isCorrect: false }, { id: 'b', text: 'Variance', isCorrect: true }, { id: 'c', text: 'Irreducible noise', isCorrect: false }, { id: 'd', text: 'Training time only', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B4 — Diagnose the Model',
    description: 'Given train/test accuracies for three models, diagnose each as high bias, high variance, or balanced, and recommend a fix. Good: correct diagnosis, sensible fix; rubric: 8 diagnosis, 6 fix, 6 explanation = 20.',
    dueDate: '2026-07-16T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Model A: train 60%, test 58%. Model B: train 99%, test 72%. Model C: train 88%, test 86%. Diagnose each and recommend one change per model.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why does the bias-variance tradeoff matter in production?', marks: 8 }],
  },
})

lessons.push({
  title: 'B5 — Regularization (L1/L2)',
  duration: 10,
  content: `# B5 — Regularization (L1/L2)

Regularization penalizes large weights to reduce overfitting. L2 (Ridge) shrinks; L1 (Lasso) can zero out features.

## Learning Objectives
- Explain how a penalty term reduces overfitting.
- Train Ridge (L2) and Lasso (L1) and compare coefficients.
- Tune the regularization strength alpha.

## Introduction
Plain regression minimizes squared error. Regularization adds a penalty on the size of the weights: L2 adds alpha * sum(w^2); L1 adds alpha * sum(|w|). L1 can drive coefficients exactly to zero — automatic feature selection.

## Ridge and Lasso
from sklearn.linear_model import Ridge, Lasso
ridge = Ridge(alpha=1.0).fit(X_train, y_train)
lasso = Lasso(alpha=0.1).fit(X_train, y_train)
print(ridge.coef_)
print(lasso.coef_)   # some may be exactly 0

## Worked Example — Feature Selection
With Lasso, coefficients that drop to zero are effectively removed. This is useful when many features are irrelevant.

## Practical Exercise
Run this:
from sklearn.linear_model import Ridge, Lasso
import numpy as np
X = np.array([[1,2],[2,3],[3,4],[4,5]])
y = np.array([1,2,3,4])
print(Ridge(alpha=1.0).fit(X, y).coef_.round(2))
print(Lasso(alpha=0.1).fit(X, y).coef_.round(2))
Tasks: (1) compare the two coefficient vectors; (2) increase Lasso alpha and observe. Check: Ridge spreads weight; Lasso may zero one coefficient; higher alpha zeros more.

## Key Takeaways
- L2 (Ridge) shrinks coefficients smoothly.
- L1 (Lasso) can zero coefficients — feature selection.
- alpha controls strength: higher alpha = more regularization.
- Always scale features before regularizing.

## Quiz Answer Key
1. (b) Regularization penalizes large weights to reduce overfitting.
2. (a) L1 (Lasso) can drive coefficients exactly to zero.
3. False — L2 shrinks but rarely zeros coefficients.
4. (c) Higher alpha means stronger regularization.
5. (b) Scale features before regularizing so the penalty is fair.
`,
  quiz: {
    title: 'Quiz B5 — Regularization',
    description: '5 auto-gradable questions on L1/L2 regularization.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Regularization primarily reduces:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Bias', isCorrect: false }, { id: 'b', text: 'Overfitting (variance)', isCorrect: true }, { id: 'c', text: 'Training time', isCorrect: false }, { id: 'd', text: 'Data size', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'L1 (Lasso) can:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Zero out coefficients for feature selection', isCorrect: true }, { id: 'b', text: 'Only increase coefficients', isCorrect: false }, { id: 'c', text: 'Delete rows', isCorrect: false }, { id: 'd', text: 'Scale features', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: L2 (Ridge) typically zeros coefficients.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: A higher alpha means ______ regularization.', questionType: 'fill_blank', correctAnswer: 'stronger' },
      { id: 'q5', questionText: 'Before regularizing, you should:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Add more features', isCorrect: false }, { id: 'b', text: 'Scale features', isCorrect: true }, { id: 'c', text: 'Remove the test set', isCorrect: false }, { id: 'd', text: 'Use a larger alpha only', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B5 — Regularize a Model',
    description: 'Train Ridge and Lasso on a small dataset with alpha=0.1,1,10; compare coefficients and explain the effect. Good: correct training, comparison; rubric: 6 train, 6 compare, 4 explanation, 4 alpha sweep = 20.',
    dueDate: '2026-07-17T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train Ridge and Lasso at three alphas on X=[[1,2],[2,3],[3,4]], y=[5,7,9]; print coefficients and describe the trend.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When would you choose Lasso over Ridge?', marks: 8 }],
  },
})

export const module02: MlModuleData = { title: 'Module 2 — Core Supervised Learning', lessons }
