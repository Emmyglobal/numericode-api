import type { MlModuleData, MlLessonData } from './types'

const lessons: MlLessonData[] = []

lessons.push({
  title: 'C1 — k-Means Clustering',
  duration: 10,
  content: `# C1 — k-Means Clustering

k-Means partitions data into k clusters by iteratively assigning points to the nearest centroid and moving centroids to the cluster mean.

## Learning Objectives
- Explain the k-Means algorithm steps.
- Train KMeans and interpret labels and centroids.
- Choose k with the elbow method.

## Introduction
k-Means is the most common unsupervised algorithm. It needs no labels — just pick k, and it finds k groups of similar points. It minimizes within-cluster sum of squares.

## Training
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
import numpy as np

X, _ = make_blobs(n_samples=200, centers=3, random_state=42)
model = KMeans(n_clusters=3, random_state=42, n_init="auto").fit(X)
print(model.labels_[:10])
print(model.cluster_centers_.round(1))

## Choosing k
The elbow method: plot inertia (within-cluster sum of squares) vs k; the "elbow" is a good k. No label exists to validate against — that is the nature of unsupervised learning.

## Practical Exercise
Run this:
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=150, centers=3, random_state=42)
for k in [2, 3, 4, 5]:
    km = KMeans(n_clusters=k, random_state=42, n_init="auto").fit(X)
    print(k, round(km.inertia_, 1))
Tasks: (1) where is the elbow; (2) print labels for k=3. Check: elbow near k=3; labels are 0/1/2.

## Key Takeaways
- k-Means needs k up front and scaled features.
- n_init="auto" runs multiple starts and keeps the best.
- Inertia decreases with k; the elbow picks a parsimonious k.
- Works best on globular, similarly-sized clusters.

## Quiz Answer Key
1. (b) k-Means assigns each point to the nearest centroid.
2. (a) The elbow method plots inertia vs k.
3. False — k-Means needs scaled features.
4. (c) n_init runs multiple initializations.
5. (b) Inertia always decreases as k increases.
`,
  quiz: {
    title: 'Quiz C1 — k-Means',
    description: '5 auto-gradable questions on k-Means clustering.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'k-Means assigns each point to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The farthest centroid', isCorrect: false }, { id: 'b', text: 'The nearest centroid', isCorrect: true }, { id: 'c', text: 'A random cluster', isCorrect: false }, { id: 'd', text: 'The largest cluster', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'The elbow method helps choose:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'k (number of clusters)', isCorrect: true }, { id: 'b', text: 'The random state', isCorrect: false }, { id: 'c', text: 'The learning rate', isCorrect: false }, { id: 'd', text: 'Feature names', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: k-Means works well with unscaled features.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: n_init runs multiple ______ and keeps the best.', questionType: 'fill_blank', correctAnswer: 'initializations' },
      { id: 'q5', questionText: 'As k increases, inertia:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Increases', isCorrect: false }, { id: 'b', text: 'Decreases', isCorrect: true }, { id: 'c', text: 'Stays constant', isCorrect: false }, { id: 'd', text: 'Oscillates', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment C1 — Cluster the Data',
    description: 'Run k-Means on make_blobs for k=2..6, plot inertia, pick k, report labels. Good: elbow plot + choice; rubric: 8 sweep, 4 choice, 4 labels, 4 explanation = 20.',
    dueDate: '2026-07-27T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Run the k-sweep on make_blobs(centers=3), report inertia for each k, pick the elbow, and show labels for that k.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why might the elbow be ambiguous on real data?', marks: 8 }],
  },
})

lessons.push({
  title: 'C2 — Hierarchical Clustering',
  duration: 8,
  content: `# C2 — Hierarchical Clustering

Hierarchical clustering builds a tree of clusters (a dendrogram) without choosing k up front. Agglomerative is bottom-up.

## Learning Objectives
- Explain agglomerative (bottom-up) clustering.
- Read a dendrogram to choose the number of clusters.
- Compare hierarchical clustering to k-Means.

## Introduction
Agglomerative clustering starts with each point as its own cluster and repeatedly merges the two closest. The result is a dendrogram — cut it at a height to get k clusters.

## Training
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=100, centers=3, random_state=42)
model = AgglomerativeClustering(n_clusters=3).fit(X)
print(model.labels_[:10])

## Dendrogram
scipy.cluster.hierarchy.dendrogram(Z) visualizes the merge tree. Cut where the vertical gap is largest.

## Practical Exercise
Run this:
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=80, centers=3, random_state=42)
for k in [2, 3, 4]:
    labels = AgglomerativeClustering(n_clusters=k).fit(X).labels_
    print(k, len(set(labels)))
Tasks: (1) what prints; (2) how would you choose k from a dendrogram. Check: each k produces k clusters; cut at the largest vertical gap.

## Key Takeaways
- No need to choose k before seeing the dendrogram.
- Agglomerative is bottom-up; divisive (top-down) is rare.
- More expensive than k-Means for large data.
- Dendrograms are great for small datasets and exploration.

## Quiz Answer Key
1. (b) Agglomerative clustering is bottom-up.
2. (a) A dendrogram visualizes the merge tree.
3. False — hierarchical clustering is slower than k-Means on large data.
4. (c) Cut the dendrogram at the largest vertical gap.
5. (b) It does not require k up front.
`,
  quiz: {
    title: 'Quiz C2 — Hierarchical Clustering',
    description: '5 auto-gradable questions on hierarchical clustering.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Agglomerative clustering is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Top-down', isCorrect: false }, { id: 'b', text: 'Bottom-up', isCorrect: true }, { id: 'c', text: 'Random', isCorrect: false }, { id: 'd', text: 'Linear', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'A dendrogram shows:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The merge tree of clusters', isCorrect: true }, { id: 'b', text: 'Feature importances', isCorrect: false }, { id: 'c', text: 'Decision boundaries', isCorrect: false }, { id: 'd', text: 'Residuals', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Hierarchical clustering is faster than k-Means on large data.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Cut the dendrogram at the largest vertical ______.', questionType: 'fill_blank', correctAnswer: 'gap' },
      { id: 'q5', questionText: 'Hierarchical clustering does not require:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Features', isCorrect: false }, { id: 'b', text: 'k up front', isCorrect: true }, { id: 'c', text: 'A computer', isCorrect: false }, { id: 'd', text: 'Distances', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment C2 — Dendrogram Exploration',
    description: 'Run AgglomerativeClustering on make_blobs for k=2..5; describe how you would pick k from a dendrogram. Good: runs + reasoning; rubric: 8 runs, 6 dendrogram reasoning, 6 comparison to k-Means = 20.',
    dueDate: '2026-07-28T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Run AgglomerativeClustering for k=2..5 on make_blobs(centers=3) and describe the dendrogram-based choice of k.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When would you pick hierarchical over k-Means?', marks: 8 }],
  },
})

lessons.push({
  title: 'C3 — Dimensionality Reduction with PCA',
  duration: 10,
  content: `# C3 — Dimensionality Reduction with PCA

PCA projects high-dimensional data onto fewer axes that capture the most variance. It speeds training and enables visualization.

## Learning Objectives
- Explain what principal components are.
- Apply PCA and read explained_variance_ratio_.
- Decide how many components to keep.

## Introduction
PCA finds orthogonal directions (principal components) of maximum variance. Projecting onto the top-k components gives a lower-dimensional representation that preserves as much structure as possible.

## Training
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris
X, y = load_iris(return_X_y=True)
X_pca = PCA(n_components=2).fit_transform(X)
print(X_pca.shape)  # (150, 2)
print(PCA(n_components=2).fit(X).explained_variance_ratio_.round(2))

## Choosing Components
Plot cumulative explained_variance_ratio_; keep enough components to reach ~95% variance.

## Practical Exercise
Run this:
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris
X, y = load_iris(return_X_y=True)
pca = PCA().fit(X)
print(pca.explained_variance_ratio_.round(3))
print(pca.explained_variance_ratio_.cumsum().round(3))
Tasks: (1) how many components reach ~95% variance; (2) what is the shape after PCA(n_components=2). Check: 2 components reach ~0.98; shape (150,2).

## Key Takeaways
- PCA finds orthogonal directions of maximum variance.
- explained_variance_ratio_ tells how much each component captures.
- Always scale before PCA.
- Useful for visualization (2D/3D) and speeding downstream models.

## Quiz Answer Key
1. (b) PCA finds directions of maximum variance.
2. (a) explained_variance_ratio_ tells the variance per component.
3. False — always scale before PCA.
4. (c) Cumulative variance ratio guides component choice.
5. (b) PCA(n_components=2) is common for visualization.
`,
  quiz: {
    title: 'Quiz C3 — PCA',
    description: '5 auto-gradable questions on PCA.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'PCA finds directions of:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Minimum variance', isCorrect: false }, { id: 'b', text: 'Maximum variance', isCorrect: true }, { id: 'c', text: 'Random variance', isCorrect: false }, { id: 'd', text: 'Zero variance', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'explained_variance_ratio_ tells:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Variance captured per component', isCorrect: true }, { id: 'b', text: 'The number of samples', isCorrect: false }, { id: 'c', text: 'Labels', isCorrect: false }, { id: 'd', text: 'Distances', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Scaling is optional before PCA.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Cumulative ______ ratio guides component choice.', questionType: 'fill_blank', correctAnswer: 'variance' },
      { id: 'q5', questionText: 'PCA(n_components=2) is most often used for:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Classification', isCorrect: false }, { id: 'b', text: 'Visualization', isCorrect: true }, { id: 'c', text: 'Regression', isCorrect: false }, { id: 'd', text: 'Clustering only', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment C3 — PCA on Iris',
    description: 'Run PCA on iris, report explained variance per component, and state how many reach 95%. Good: correct PCA + interpretation; rubric: 8 PCA, 6 variance, 6 explanation = 20.',
    dueDate: '2026-07-29T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Run PCA on iris, print explained_variance_ratio_ and cumulative sum, and state how many components reach ~95%.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why scale before PCA?', marks: 8 }],
  },
})

lessons.push({
  title: 'C4 — Anomaly Detection Basics',
  duration: 8,
  content: `# C4 — Anomaly Detection Basics

Anomaly detection flags points that differ markedly from the norm. IsolationForest and One-Class SVM are common choices.

## Learning Objectives
- Explain what makes a point anomalous.
- Train IsolationForest and interpret predictions.
- Distinguish anomaly detection from classification.

## Introduction
Anomaly detection is unsupervised: it learns "normal" and flags deviations. IsolationForest isolates points by random splits — anomalies need fewer splits. Returns -1 for anomalies, 1 for normal.

## Training
from sklearn.ensemble import IsolationForest
from sklearn.datasets import make_blobs
import numpy as np

X, _ = make_blobs(n_samples=200, centers=1, random_state=42)
model = IsolationForest(random_state=42).fit(X)
preds = model.predict(X)
print((preds == -1).sum(), "anomalies")

## Practical Exercise
Run this:
from sklearn.ensemble import IsolationForest
from sklearn.datasets import make_blobs
import numpy as np
X, _ = make_blobs(n_samples=200, centers=1, random_state=42)
model = IsIsolationForest(random_state=42).fit(X)
print(model.predict(X[:5]))
Tasks: (1) what do -1 and 1 mean; (2) add an outlier point [10,10] and predict. Check: -1 = anomaly, 1 = normal; the outlier is flagged -1.

## Key Takeaways
- Anomaly detection is unsupervised.
- IsolationForest: -1 = anomaly, 1 = normal.
- contamination parameter sets expected anomaly fraction.
- Useful for fraud, fault detection, and data cleaning.

## Quiz Answer Key
1. (b) IsolationForest flags anomalies as -1.
2. (a) Anomaly detection is unsupervised.
3. False — it does not need labeled anomalies.
4. (c) contamination sets the expected anomaly fraction.
5. (b) Fraud detection is a classic use case.
`,
  quiz: {
    title: 'Quiz C4 — Anomaly Detection',
    description: '5 auto-gradable questions on anomaly detection.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'IsolationForest labels anomalies as:', questionType: 'multiple_choice', options: [{ id: 'a', text: '0', isCorrect: false }, { id: 'b', text: '-1', isCorrect: true }, { id: 'c', text: '1', isCorrect: false }, { id: 'd', text: '2', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Anomaly detection is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Unsupervised', isCorrect: true }, { id: 'b', text: 'Supervised', isCorrect: false }, { id: 'c', text: 'Reinforcement', isCorrect: false }, { id: 'd', text: 'Manual', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: You need labeled anomalies to train IsolationForest.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: contamination sets the expected ______ fraction.', questionType: 'fill_blank', correctAnswer: 'anomaly' },
      { id: 'q5', questionText: 'A classic use case is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Image classification', isCorrect: false }, { id: 'b', text: 'Fraud detection', isCorrect: true }, { id: 'c', text: 'Linear regression', isCorrect: false }, { id: 'd', text: 'Sorting', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment C4 — Find the Outliers',
    description: 'Run IsolationForest on make_blobs, count anomalies, add an outlier, confirm it is flagged. Good: correct detection + outlier test; rubric: 8 detection, 6 outlier test, 6 explanation = 20.',
    dueDate: '2026-07-30T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Run IsolationForest on make_blobs(200, centers=1), count anomalies, add [10,10], and confirm it is flagged.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When would you tune contamination up vs down?', marks: 8 }],
  },
})

export const module04: MlModuleData = { title: 'Module 4 — Unsupervised Learning', lessons }
