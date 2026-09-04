import type { MlModuleData, MlLessonData } from './types'

const lessons: MlLessonData[] = []

lessons.push({
  title: 'B6 — k-Nearest Neighbors',
  duration: 10,
  content: `# B6 — k-Nearest Neighbors

k-NN classifies a point by majority vote of its k nearest neighbors. Simple, intuitive, requires no training phase.

## Learning Objectives
- Explain how k-NN makes predictions.
- Train KNeighborsClassifier and vary k.
- Explain why scaling matters for distance-based methods.

## Introduction
k-NN stores all training data. To classify a new point, it finds the k closest training examples by Euclidean distance and returns the majority class. It is a lazy learner — no model is trained.

## Training
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train)
print(model.score(X_test, y_test))

## Choosing k
Small k: low bias, high variance (noise-sensitive). Large k: high bias, low variance (smoother boundaries). Use cross-validation to pick k.

## Practical Exercise
Run this:
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
for k in [1, 3, 7, 15]:
    score = KNeighborsClassifier(n_neighbors=k).fit(X_train, y_train).score(X_test, y_test)
    print(k, round(score, 3))
Tasks: (1) which k scores highest; (2) why does very large k underfit. Check: mid-range k wins; large k over-smooths.

## Key Takeaways
- k-NN is instance-based with no training phase.
- Distance methods require scaled features.
- k controls the bias-variance tradeoff.
- Prediction is slow for large datasets.

## Quiz Answer Key
1. (b) k-NN classifies by majority vote of nearest neighbors.
2. (a) Scaling matters because k-NN uses distances.
3. False — k-NN has no training phase.
4. (c) A very large k increases bias and underfits.
5. (b) Cross-validation is the standard way to choose k.
`,
  quiz: {
    title: 'Quiz B6 — k-Nearest Neighbors',
    description: '5 auto-gradable questions on k-NN.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'k-NN classifies by:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Fitting a line', isCorrect: false }, { id: 'b', text: 'Majority vote of nearest neighbors', isCorrect: true }, { id: 'c', text: 'Gradient descent', isCorrect: false }, { id: 'd', text: 'Random guessing', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Why scale features for k-NN?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Distances are scale-sensitive', isCorrect: true }, { id: 'b', text: 'It speeds up training', isCorrect: false }, { id: 'c', text: 'k-NN requires it', isCorrect: false }, { id: 'd', text: 'No reason', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: k-NN has an expensive training phase.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: A very large k ______ the boundary.', questionType: 'fill_blank', correctAnswer: 'smooths' },
      { id: 'q5', questionText: 'Best way to choose k:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Always k=1', isCorrect: false }, { id: 'b', text: 'Cross-validation', isCorrect: true }, { id: 'c', text: 'k = features', isCorrect: false }, { id: 'd', text: 'Random', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B6 — k-NN Tuning',
    description: 'Train k-NN on iris for k=1,3,5,7,9; report accuracies and recommend k. Good: sweep + recommendation; rubric: 8 sweep, 6 recommendation, 6 explanation = 20.',
    dueDate: '2026-07-20T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Run the k-sweep on iris, report accuracies, recommend k.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why does k-NN struggle with many irrelevant features?', marks: 8 }],
  },
})

lessons.push({
  title: 'B7 — Decision Trees',
  duration: 10,
  content: `# B7 — Decision Trees

Decision trees split data on feature thresholds, producing interpretable if-then rules. They overfit easily but are building blocks of forests.

## Learning Objectives
- Explain how a tree chooses splits (Gini/entropy).
- Train DecisionTreeClassifier and control depth.
- Use max_depth and min_samples_leaf to limit overfitting.

## Introduction
A decision tree asks a sequence of yes/no feature questions. Each split maximizes class purity (minimizes Gini impurity or entropy). Deep trees memorize; shallow trees generalize.

## Training
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = DecisionTreeClassifier(max_depth=3, random_state=42).fit(X_train, y_train)
print(model.score(X_test, y_test))
print(model.get_depth())

## Overfitting Control
max_depth limits tree depth; min_samples_leaf requires minimum samples per leaf. Without limits, a tree reaches 100% train accuracy but overfits.

## Practical Exercise
Run this:
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
for d in [1, 3, None]:
    m = DecisionTreeClassifier(max_depth=d, random_state=42).fit(X_train, y_train)
    print(d, round(m.score(X_test, y_test), 3), m.get_depth())
Tasks: (1) what prints; (2) which depth generalizes best. Check: depth 1 underfits, 3 balances, None overfits.

## Key Takeaways
- Trees split on the feature/threshold reducing impurity most.
- Deep trees overfit; constrain with max_depth.
- Trees are interpretable but unstable.
- model.feature_importances_ ranks features.

## Quiz Answer Key
1. (b) Trees split to reduce impurity (Gini/entropy).
2. (a) max_depth limits overfitting.
3. False — unconstrained trees overfit.
4. (c) model.feature_importances_ gives importances.
5. (b) Trees are among the most interpretable models.
`,
  quiz: {
    title: 'Quiz B7 — Decision Trees',
    description: '5 auto-gradable questions on decision trees.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Decision trees split data to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Maximize depth', isCorrect: false }, { id: 'b', text: 'Reduce impurity', isCorrect: true }, { id: 'c', text: 'Add noise', isCorrect: false }, { id: 'd', text: 'Randomize', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'max_depth is used to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Limit overfitting', isCorrect: true }, { id: 'b', text: 'Speed up prediction', isCorrect: false }, { id: 'c', text: 'Add features', isCorrect: false }, { id: 'd', text: 'Scale data', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: An unconstrained tree generalizes well.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: model.______ gives feature importances.', questionType: 'fill_blank', correctAnswer: 'feature_importances_' },
      { id: 'q5', questionText: 'Decision trees are valued for being:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Most accurate', isCorrect: false }, { id: 'b', text: 'Interpretable', isCorrect: true }, { id: 'c', text: 'Black boxes', isCorrect: false }, { id: 'd', text: 'Linear', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B7 — Tree Tuning',
    description: 'Train DecisionTreeClassifier with max_depth in [1,2,3,5,None]; report train and test accuracy and recommend depth. Good: sweep + recommendation; rubric: 8 sweep, 6 recommendation, 6 explanation = 20.',
    dueDate: '2026-07-21T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Run the depth sweep on iris, report train and test accuracy for each, recommend a depth.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why does train accuracy reach 100% with max_depth=None?', marks: 8 }],
  },
})

lessons.push({
  title: 'B8 — Random Forests & Ensemble Methods',
  duration: 10,
  content: `# B8 — Random Forests & Ensemble Methods

Random forests average many decorrelated trees (bagging) to reduce variance. Gradient boosting builds trees sequentially to correct errors.

## Learning Objectives
- Explain bagging and how random forests reduce overfitting.
- Train RandomForestClassifier and read feature importances.
- Compare bagging (RF) vs boosting (XGBoost/LightGBM) at a high level.

## Introduction
A single tree overfits. A random forest trains many trees on bootstrapped samples and random feature subsets, then averages their predictions — bagging reduces variance. Boosting builds trees sequentially, each fixing the errors of the last.

## Random Forest
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_train, y_train)
print(model.score(X_test, y_test))
print(model.feature_importances_.round(2))

## Boosting Overview
XGBoost and LightGBM build trees sequentially, each correcting the residuals of the previous ones. They often win competitions but need more careful tuning.

## Practical Exercise
Run this:
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
dt = DecisionTreeClassifier(random_state=42).fit(X_train, y_train)
rf = RandomForestClassifier(n_estimators=50, random_state=42).fit(X_train, y_train)
print("tree:", round(dt.score(X_test, y_test), 3), "forest:", round(rf.score(X_test, y_test), 3))
Tasks: (1) which scores higher; (2) increase n_estimators to 200 and compare. Check: forest usually matches or beats the single tree; more trees stabilize the score.

## Key Takeaways
- Random forests = bagging: many trees on bootstrap samples.
- Averaging reduces variance without increasing bias much.
- Boosting builds sequential corrective trees.
- Both expose feature importances.

## Quiz Answer Key
1. (b) Random forests average many trees trained on bootstrap samples.
2. (a) Bagging mainly reduces variance.
3. False — boosting builds trees sequentially, not independently.
4. (c) n_estimators controls the number of trees.
5. (b) Both RF and boosting provide feature importances.
`,
  quiz: {
    title: 'Quiz B8 — Random Forests',
    description: '5 auto-gradable questions on ensemble methods.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Random forests average many trees trained on:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The same data', isCorrect: false }, { id: 'b', text: 'Bootstrap samples', isCorrect: true }, { id: 'c', text: 'Labels only', isCorrect: false }, { id: 'd', text: 'Test data', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Bagging mainly reduces:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Variance', isCorrect: true }, { id: 'b', text: 'Bias', isCorrect: false }, { id: 'c', text: 'Data size', isCorrect: false }, { id: 'd', text: 'Features', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Boosting trains trees independently.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: n_estimators sets the number of ______.', questionType: 'fill_blank', correctAnswer: 'trees' },
      { id: 'q5', questionText: 'Feature importances come from:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The test set', isCorrect: false }, { id: 'b', text: 'Both random forests and boosting', isCorrect: true }, { id: 'c', text: 'Linear models only', isCorrect: false }, { id: 'd', text: 'The data loader', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B8 — Forest vs Tree',
    description: 'Compare a single DecisionTree to a RandomForest on iris; report both accuracies and the top-2 features. Good: comparison + importances; rubric: 8 comparison, 6 importances, 6 explanation = 20.',
    dueDate: '2026-07-22T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train both models on iris, compare test accuracy, and report the two most important features from the forest.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When might you still prefer a single tree?', marks: 8 }],
  },
})

lessons.push({
  title: 'B9 — Gradient Boosting Overview',
  duration: 10,
  content: `# B9 — Gradient Boosting Overview

Gradient boosting builds trees sequentially, each correcting the errors of the combined ensemble so far. Libraries: XGBoost, LightGBM, CatBoost.

## Learning Objectives
- Explain how boosting corrects residuals sequentially.
- Train a GradientBoostingClassifier from scikit-learn.
- Compare boosting to random forests on bias/variance.

## Introduction
While a random forest builds trees in parallel, boosting builds them one at a time. Each new tree predicts the negative gradient (residuals) of the loss, gradually improving the ensemble. The result often has lower bias than a forest.

## Training
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42).fit(X_train, y_train)
print(model.score(X_test, y_test))

## Key Hyperparameters
- n_estimators: number of boosting rounds.
- learning_rate: shrink each tree's contribution (lower = more robust, needs more trees).
- max_depth: shallow trees (3-6) are typical.

## Practical Exercise
Run this:
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
for lr in [0.01, 0.1, 1.0]:
    m = GradientBoostingClassifier(n_estimators=50, learning_rate=lr, random_state=42).fit(X_train, y_train)
    print(lr, round(m.score(X_test, y_test), 3))
Tasks: (1) which learning_rate works best; (2) why does lr=1.0 often underperform. Check: 0.1 usually wins; 1.0 over-corrects each round.

## Key Takeaways
- Boosting builds sequential corrective trees.
- learning_rate trades off step size vs number of trees.
- XGBoost/LightGBM/CatBoost are optimized implementations.
- Lower bias than forests, but watch for overfitting with too many rounds.

## Quiz Answer Key
1. (b) Boosting builds trees sequentially to correct residuals.
2. (a) learning_rate scales each tree contribution.
3. False — boosting trees are typically shallow (max_depth 3-6).
4. (c) Too many rounds can overfit.
5. (b) Lower learning_rate usually needs more trees.
`,
  quiz: {
    title: 'Quiz B9 — Gradient Boosting',
    description: '5 auto-gradable questions on boosting.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Boosting builds trees:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'In parallel', isCorrect: false }, { id: 'b', text: 'Sequentially to correct residuals', isCorrect: true }, { id: 'c', text: 'Only one', isCorrect: false }, { id: 'd', text: 'Randomly', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'learning_rate controls:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Each tree contribution size', isCorrect: true }, { id: 'b', text: 'The number of features', isCorrect: false }, { id: 'c', text: 'The loss function', isCorrect: false }, { id: 'd', text: 'Random state', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Boosting trees are usually deep (depth 20+).', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Too many n_estimators leads to ______.', questionType: 'fill_blank', correctAnswer: 'overfitting' },
      { id: 'q5', questionText: 'A lower learning_rate typically requires:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Fewer trees', isCorrect: false }, { id: 'b', text: 'More trees', isCorrect: true }, { id: 'c', text: 'Deeper trees', isCorrect: false }, { id: 'd', text: 'No change', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B9 — Boosting Sweep',
    description: 'Sweep n_estimators and learning_rate on iris; report best combo. Good: sweep, best combo; rubric: 8 sweep, 6 best, 6 explanation = 20.',
    dueDate: '2026-07-23T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train GradientBoosting over n_estimators in [25,50,100] and learning_rate in [0.05,0.1,0.2]; report the best test accuracy and its settings.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why combine a low learning_rate with many estimators?', marks: 8 }],
  },
})

lessons.push({
  title: 'B10 — Support Vector Machines',
  duration: 10,
  content: `# B10 — Support Vector Machines

SVMs find the hyperplane that maximizes the margin between classes. Kernels let them learn nonlinear boundaries.

## Learning Objectives
- Explain the margin and support vectors.
- Train SVC with linear and RBF kernels.
- Explain when kernels help.

## Introduction
An SVM picks the decision boundary that maximizes the distance (margin) to the nearest points of each class — the support vectors. Kernels implicitly map data into higher dimensions where a linear separator exists.

## Training
from sklearn.svm import SVC
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X = X[:, :2]  # two features for easy visualization
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
linear = SVC(kernel="linear").fit(X_train, y_train)
rbf = SVC(kernel="rbf").fit(X_train, y_train)
print("linear:", round(linear.score(X_test, y_test), 3), "rbf:", round(rbf.score(X_test, y_test), 3))

## Kernels
- linear: a straight hyperplane.
- rbf: smooth nonlinear boundary (default, good default).
- poly: polynomial boundary.
- Always scale features before SVM — it is distance-based.

## Practical Exercise
Run this:
from sklearn.svm import SVC
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
X, y = load_iris(return_X_y=True)
X = X[:, :2]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
Xs_train = scaler.transform(X_train)
Xs_test = scaler.transform(X_test)
print(round(SVC(kernel="rbf").fit(Xs_train, y_train).score(Xs_test, y_test), 3))
Tasks: (1) compare scaled vs unscaled; (2) try kernel="linear". Check: scaled usually improves; linear may match on linearly separable subsets.

## Key Takeaways
- SVM maximizes the margin; only support vectors matter.
- Kernels enable nonlinear boundaries.
- Always scale features.
- C controls regularization (high C = narrow margin, risk of overfit).

## Quiz Answer Key
1. (b) SVM maximizes the margin between classes.
2. (a) Support vectors are the points nearest the boundary.
3. False — SVMs always need scaled features.
4. (c) The RBF kernel enables smooth nonlinear boundaries.
5. (b) High C means less regularization and a narrower margin.
`,
  quiz: {
    title: 'Quiz B10 — SVM',
    description: '5 auto-gradable questions on support vector machines.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'An SVM chooses the boundary that:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Minimizes training time', isCorrect: false }, { id: 'b', text: 'Maximizes the margin', isCorrect: true }, { id: 'c', text: 'Ignores outliers', isCorrect: false }, { id: 'd', text: 'Uses all points equally', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Support vectors are:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The points nearest the boundary', isCorrect: true }, { id: 'b', text: 'All training points', isCorrect: false }, { id: 'c', text: 'The test set', isCorrect: false }, { id: 'd', text: 'Random points', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: SVM works well with unscaled features.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: The ______ kernel enables nonlinear boundaries.', questionType: 'fill_blank', correctAnswer: 'rbf' },
      { id: 'q5', questionText: 'A high C value means:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'More regularization', isCorrect: false }, { id: 'b', text: 'Less regularization, narrower margin', isCorrect: true }, { id: 'c', text: 'Wider margin', isCorrect: false }, { id: 'd', text: 'Fewer support vectors always', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment B10 — SVM Comparison',
    description: 'Train linear and RBF SVMs on scaled iris (2 features); compare accuracy and describe the boundary difference. Good: scaled comparison; rubric: 8 train+scale, 6 compare, 6 explanation = 20.',
    dueDate: '2026-07-24T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train scaled linear and RBF SVMs on iris (2 features); report both accuracies and describe how the boundaries differ.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When would you pick a linear kernel over RBF?', marks: 8 }],
  },
})

export const module03: MlModuleData = { title: 'Module 3 — More Supervised Learning', lessons }
