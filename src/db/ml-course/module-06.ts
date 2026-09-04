import type { MlModuleData, MlLessonData } from './types'

const lessons: MlLessonData[] = []

lessons.push({
  title: 'E1 — Perceptrons & Building Blocks',
  duration: 10,
  content: `# E1 — Perceptrons & Building Blocks

A perceptron is a single neuron: weighted sum + activation. Stacked and trained, they become neural networks.

## Learning Objectives
- Explain a perceptron computation.
- Describe layers, weights, biases, and activations.
- Train MLPClassifier on a small problem.

## Introduction
A perceptron computes y = activation(w . x + b). A multilayer perceptron (MLP) stacks such units. Training adjusts weights via backpropagation to minimize a loss.

## Training an MLP
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = MLPClassifier(hidden_layer_sizes=(10, 5), max_iter=500, random_state=42).fit(X_train, y_train)
print(model.score(X_test, y_test))

## Worked Example — XOR
A single perceptron cannot learn XOR (not linearly separable). An MLP with one hidden layer can — this motivated deep learning.

## Practical Exercise
Run this:
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = MLPClassifier(hidden_layer_sizes=(8,), max_iter=500, random_state=42).fit(X_train, y_train)
print(round(model.score(X_test, y_test), 3))
print(len(model.coefs_))
Tasks: (1) what prints; (2) change hidden_layer_sizes to (16, 8). Check: accuracy ~0.97 and 2 weight matrices (input->hidden, hidden->output); deeper net has 3 matrices.

## Key Takeaways
- Perceptron = weighted sum + activation.
- MLP stacks perceptrons in layers.
- Backpropagation adjusts all weights via gradient descent.
- One hidden layer can learn XOR; depth helps complex patterns.

## Quiz Answer Key
1. (b) A perceptron computes activation(w . x + b).
2. (a) MLP stacks perceptrons in layers.
3. False — a single perceptron cannot learn XOR.
4. (c) Backpropagation adjusts weights via gradient descent.
5. (b) hidden_layer_sizes defines the network architecture.
`,
  quiz: {
    title: 'Quiz E1 — Perceptrons',
    description: '5 auto-gradable questions on perceptrons and MLPs.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'A perceptron computes:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'w * x only', isCorrect: false }, { id: 'b', text: 'activation(w . x + b)', isCorrect: true }, { id: 'c', text: 'x / w', isCorrect: false }, { id: 'd', text: 'b - w', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'MLP stands for:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Multilayer Perceptron', isCorrect: true }, { id: 'b', text: 'Multiple Linear Projection', isCorrect: false }, { id: 'c', text: 'Minimum Loss Procedure', isCorrect: false }, { id: 'd', text: 'Manual Labeling Process', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: A single perceptron can learn XOR.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: ______ adjusts weights via gradient descent.', questionType: 'fill_blank', correctAnswer: 'Backpropagation' },
      { id: 'q5', questionText: 'hidden_layer_sizes=(10, 5) means:', questionType: 'multiple_choice', options: [{ id: 'a', text: '10 outputs', isCorrect: false }, { id: 'b', text: 'Two hidden layers with 10 and 5 units', isCorrect: true }, { id: 'c', text: '10 features', isCorrect: false }, { id: 'd', text: '5 epochs', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment E1 — Train an MLP',
    description: 'Train MLPClassifier on iris with two architectures; compare accuracy and number of coefficient matrices. Good: comparison; rubric: 8 train, 6 compare, 6 explanation = 20.',
    dueDate: '2026-08-05T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train MLP with hidden_layer_sizes (8,) and (16,8); compare accuracy and the length of model.coefs_.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why could a single perceptron never solve XOR?', marks: 8 }],
  },
})

lessons.push({
  title: 'E2 — Activation Functions',
  duration: 8,
  content: `# E2 — Activation Functions

Activations introduce nonlinearity. Without them, stacking layers is pointless. ReLU is the default; sigmoid and tanh are classics.

## Learning Objectives
- Explain why activations must be nonlinear.
- Compare ReLU, sigmoid, and tanh.
- Choose an activation for a given layer.

## Introduction
A network of linear layers is just one linear map. Nonlinear activations (ReLU, sigmoid, tanh) let networks approximate any function. ReLU(z) = max(0, z) is fast and avoids vanishing gradients.

## Common Activations
- ReLU: max(0, z) — default for hidden layers.
- Sigmoid: 1 / (1 + exp(-z)) — maps to (0,1), used for binary output.
- Tanh: maps to (-1, 1).
- Softmax: turns logits into probabilities for multiclass output.

## Practical Exercise
Run this:
import numpy as np
def relu(z): return np.maximum(0, z)
def sigmoid(z): return 1 / (1 + np.exp(-z))
z = np.array([-2, -1, 0, 1, 2])
print("relu:", relu(z))
print("sigmoid:", np.round(sigmoid(z), 2))
Tasks: (1) what prints; (2) why is ReLU preferred in hidden layers. Check: relu = [0,0,0,1,2]; sigmoid = [0.12,0.27,0.5,0.73,0.88]; ReLU avoids vanishing gradients.

## Key Takeaways
- Nonlinear activations enable deep networks.
- ReLU is the hidden-layer default.
- Sigmoid/softmax for output probabilities.
- Vanishing gradients plague sigmoid/tanh in deep nets.

## Quiz Answer Key
1. (b) ReLU(z) = max(0, z).
2. (a) Activations introduce nonlinearity.
3. False — a stack of linear layers is just one linear map.
4. (c) Softmax turns logits into probabilities.
5. (b) ReLU avoids the vanishing gradient problem.
`,
  quiz: {
    title: 'Quiz E2 — Activation Functions',
    description: '5 auto-gradable questions on activations.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'ReLU is defined as:', questionType: 'multiple_choice', options: [{ id: 'a', text: '1/(1+exp(-z))', isCorrect: false }, { id: 'b', text: 'max(0, z)', isCorrect: true }, { id: 'c', text: 'z^2', isCorrect: false }, { id: 'd', text: 'log(z)', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Activations are needed to:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Introduce nonlinearity', isCorrect: true }, { id: 'b', text: 'Reduce parameters', isCorrect: false }, { id: 'c', text: 'Speed up data loading', isCorrect: false }, { id: 'd', text: 'Delete features', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Stacking linear layers is as powerful as one linear layer.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Fill in the blank: ______ turns logits into multiclass probabilities.', questionType: 'fill_blank', correctAnswer: 'Softmax' },
      { id: 'q5', questionText: 'ReLU helps avoid:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Overfitting only', isCorrect: false }, { id: 'b', text: 'Vanishing gradients', isCorrect: true }, { id: 'c', text: 'Data leakage', isCorrect: false }, { id: 'd', text: 'Scaling', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment E2 — Activation Comparison',
    description: 'Implement ReLU, sigmoid, tanh in numpy; plot or print their outputs on z in [-3,3]. Good: correct implementations + comparison; rubric: 8 implementations, 6 comparison, 6 explanation = 20.',
    dueDate: '2026-08-06T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Implement and print all three activations on z in [-3,3]; describe their shapes.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is ReLU preferred over sigmoid in hidden layers?', marks: 8 }],
  },
})

lessons.push({
  title: 'E3 — Training a Simple Neural Net',
  duration: 10,
  content: `# E3 — Training a Simple Neural Net

Training = forward pass, loss, backward pass, weight update. High-level libraries (Keras) make this a few lines.

## Learning Objectives
- Describe the training loop (forward, loss, backward, update).
- Train a small MLP with scikit-learn's MLPClassifier.
- Recognize overfitting in the training curve.

## Introduction
Each epoch: predict (forward), compute loss, compute gradients (backward), update weights (optimizer). With Keras or scikit-learn, this loop is hidden but the concepts remain.

## Training
from sklearn.neural_network import MLPClassifier
model = MLPClassifier(hidden_layer_sizes=(20,), max_iter=200, random_state=42).fit(X_train, y_train)
# training_loss_curve_ shows loss per iteration

## Overfitting in Deep Learning
Monitor train vs validation loss. When val loss rises while train loss falls, you are overfitting — use dropout or early stopping.

## Practical Exercise
Run this:
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = MLPClassifier(hidden_layer_sizes=(20,), max_iter=300, random_state=42).fit(X_train, y_train)
print("train:", round(model.score(X_train, y_train), 3))
print("test:", round(model.score(X_test, y_test), 3))
print("iterations:", model.n_iter_)
Tasks: (1) what prints; (2) reduce max_iter to 10 and observe. Check: train ~1.0, test ~0.97, some iteration count; too few iterations underfit.

## Key Takeaways
- Training loop: forward -> loss -> backward -> update.
- Monitor train vs validation loss for overfitting.
- Dropout and early stopping reduce overfitting.
- More epochs help only up to a point.

## Quiz Answer Key
1. (b) Forward -> loss -> backward -> update.
2. (a) Monitor train vs validation loss.
3. False — more epochs can hurt (overfitting).
4. (c) Early stopping halts when validation loss stops improving.
5. (b) Dropout randomly disables units during training.
`,
  quiz: {
    title: 'Quiz E3 — Training a NN',
    description: '5 auto-gradable questions on neural net training.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The training loop order is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Update -> forward -> loss', isCorrect: false }, { id: 'b', text: 'Forward -> loss -> backward -> update', isCorrect: true }, { id: 'c', text: 'Loss -> forward -> update', isCorrect: false }, { id: 'd', text: 'Backward only', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Overfitting is detected by:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Rising validation loss while train loss falls', isCorrect: true }, { id: 'b', text: 'Low train loss alone', isCorrect: false }, { id: 'c', text: 'High accuracy', isCorrect: false }, { id: 'd', text: 'Fast training', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: More epochs always improve the model.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: ______ stops training when validation loss stops improving.', questionType: 'fill_blank', correctAnswer: 'Early stopping' },
      { id: 'q5', questionText: 'Dropout:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Adds more layers', isCorrect: false }, { id: 'b', text: 'Randomly disables units during training', isCorrect: true }, { id: 'c', text: 'Speeds inference', isCorrect: false }, { id: 'd', text: 'Scales data', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment E3 — Train and Diagnose',
    description: 'Train MLP on iris; report train/test accuracy and iterations; diagnose over/underfitting. Good: correct metrics + diagnosis; rubric: 8 train, 6 diagnosis, 6 explanation = 20.',
    dueDate: '2026-08-07T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Train MLP, report train/test accuracy and n_iter_, and diagnose over- or underfitting.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Name two ways to reduce overfitting in a neural net.', marks: 8 }],
  },
})

lessons.push({
  title: 'E4 — Data Ethics, Bias & Fairness',
  duration: 8,
  content: `# E4 — Data Ethics, Bias & Fairness

Models learn patterns in data — including harmful biases. Ethical ML requires examining data, outcomes, and impact.

## Learning Objectives
- Identify sources of bias in datasets and models.
- Explain why accuracy alone is insufficient for fairness.
- Apply basic fairness checks.

## Introduction
If training data reflects historical bias, the model perpetuates it. Fairness means examining who is harmed and how — not just optimizing accuracy. Representative data and outcome audits are essential.

## Sources of Bias
- Historical bias: past inequities in the data.
- Sampling bias: unrepresentative data collection.
- Measurement bias: flawed labels or features.
- Aggregation bias: one model for dissimilar groups.

## Fairness Checks
- Disaggregated metrics: compute accuracy/precision/recall per group.
- Confusion matrices per subgroup reveal unequal error rates.
- If a model performs worst on a protected group, it is not fair.

## Practical Exercise
Given per-group accuracies: Group A 95%, Group B 78%. Is this model fair? What would you do? Check: No — the gap is large; investigate data representation and consider group-specific thresholds or resampling.

## Key Takeaways
- Bias enters through data, labels, and framing.
- Always disaggregate metrics by subgroup.
- Fairness is context-dependent; involve domain experts.
- Document data provenance and model limitations.

## Quiz Answer Key
1. (b) Bias can come from historical inequities in the data.
2. (a) Disaggregate metrics by subgroup.
3. False — high overall accuracy can hide poor performance on minorities.
4. (c) Representative data and outcome audits.
5. (b) Fairness requires examining who is harmed.
`,
  quiz: {
    title: 'Quiz E4 — Ethics & Bias',
    description: '5 auto-gradable questions on ML ethics.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Bias in ML can come from:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'The programming language', isCorrect: false }, { id: 'b', text: 'Historical inequities in the data', isCorrect: true }, { id: 'c', text: 'Using Python', isCorrect: false }, { id: 'd', text: 'Open-source code', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'To check fairness, you should:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Disaggregate metrics by subgroup', isCorrect: true }, { id: 'b', text: 'Only look at overall accuracy', isCorrect: false }, { id: 'c', text: 'Delete sensitive columns only', isCorrect: false }, { id: 'd', text: 'Ignore the test set', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: High overall accuracy guarantees fairness.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: ______ bias comes from unrepresentative data collection.', questionType: 'fill_blank', correctAnswer: 'Sampling' },
      { id: 'q5', questionText: 'Fairness requires:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Maximizing accuracy only', isCorrect: false }, { id: 'b', text: 'Examining who is harmed by the model', isCorrect: true }, { id: 'c', text: 'Using more layers', isCorrect: false }, { id: 'd', text: 'Faster inference', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment E4 — Ethics Case Study',
    description: 'Read a short ML ethics scenario; identify bias sources, fairness checks, and mitigations. Good: identification + mitigations; rubric: 8 identification, 6 checks, 6 mitigations = 20.',
    dueDate: '2026-08-08T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Analyze the scenario: list bias sources, propose fairness checks, and suggest two mitigations.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is removing a sensitive attribute (e.g., race) not enough to ensure fairness?', marks: 8 }],
  },
})

lessons.push({
  title: 'E5 — Capstone Project',
  duration: 15,
  content: `# E5 — Capstone Project

Combine everything: frame a problem, prepare data, train and evaluate a model, and communicate findings.

## Learning Objectives
- Frame an ML problem end-to-end.
- Apply the full workflow: data -> clean -> model -> evaluate -> report.
- Communicate results and limitations clearly.

## Introduction
The capstone is your chance to integrate the whole course. Pick a small, real dataset, frame a question, and walk through the full pipeline — finishing with a short report.

## Workflow
1. Frame the problem (what are you predicting and why).
2. Explore and clean the data.
3. Engineer features and split train/test.
4. Train at least two models.
5. Evaluate with appropriate metrics and a confusion matrix.
6. Tune hyperparameters.
7. Write a report: data, method, results, limitation.

## Report Structure
1. Problem: what you are predicting and why.
2. Data: source, size, cleaning steps.
3. Method: models tried and why.
4. Results: key numbers + one chart.
5. Limitation: what the data cannot tell you.

## Practical Exercise
Choose a small public dataset and run the full workflow.
Tasks: (1) define your problem framing; (2) which two models will you compare. Check: framing should name X, y, and success metric; pick models from different families.

## Key Takeaways
- End-to-end thinking ties the course together.
- Documentation and reproducibility matter as much as accuracy.
- Every model has limitations — state them honestly.
- The capstone is a portfolio piece.

## Quiz Answer Key
1. (b) The capstone integrates the full ML workflow.
2. (a) A good report states limitations honestly.
3. False — accuracy alone is rarely the right success metric.
4. (c) Compare models from different families.
5. (b) Reproducibility requires documenting data and steps.
`,
  quiz: {
    title: 'Quiz E5 — Capstone',
    description: '5 auto-gradable questions on the capstone workflow.',
    timeLimit: 300, passingScore: 70, maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The capstone primarily:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Tests memorization', isCorrect: false }, { id: 'b', text: 'Integrates the full ML workflow', isCorrect: true }, { id: 'c', text: 'Repeats Module 1', isCorrect: false }, { id: 'd', text: 'Only covers neural nets', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'A good report:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'States limitations honestly', isCorrect: true }, { id: 'b', text: 'Claims perfection', isCorrect: false }, { id: 'c', text: 'Omits the data source', isCorrect: false }, { id: 'd', text: 'Only shows accuracy', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Accuracy alone is a sufficient success metric.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Compare models from different ______.', questionType: 'fill_blank', correctAnswer: 'families' },
      { id: 'q5', questionText: 'Reproducibility requires:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Hiding the code', isCorrect: false }, { id: 'b', text: 'Documenting data and steps', isCorrect: true }, { id: 'c', text: 'Using only accuracy', isCorrect: false }, { id: 'd', text: 'Never sharing data', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment E5 — Capstone Report',
    description: 'Complete the capstone end-to-end and submit a report (problem, data, method, results, limitation). Good: complete pipeline + honest report; rubric: 6 pipeline, 6 results, 4 report, 4 limitation = 20.',
    dueDate: '2026-08-09T23:59:59Z', totalMarks: 20, passingScore: 10, assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Submit your capstone report covering all five sections.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'What was the hardest part of the workflow — and what would you do differently?', marks: 8 }],
  },
})

export const module06: MlModuleData = { title: 'Module 6 — Neural Networks & Real-World ML', lessons }
