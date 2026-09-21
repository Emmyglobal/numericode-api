import type { M2cModuleData } from './types'

// Module 7 — Vectors, Matrices & Linear Algebra for Coders
// Module objectives: use vectors and matrices to represent and manipulate structured numeric data.

export const module07: M2cModuleData = {
  title: 'Module 7 — Vectors, Matrices & Linear Algebra for Coders',
  lessons: [
    {
      title: 'What Is a Vector? Vectors in 2D/3D & in Code',
      duration: 30,
      content: `## Learning Objectives\n- Represent vectors as arrays in code.\n- Identify vector properties (magnitude, direction).\n\n## Vectors\nA vector is an ordered list of numbers representing magnitude and direction.\nIn code, a 2D vector is \`[x, y]\`.\n\n## Key Takeaways\n- 2D vectors are arrays of two numbers.\n- A vector has both magnitude and direction.\n- RGB colors can be represented as 3-element vectors.`,
      quiz: {
        title: 'Quiz 7.1 — What Is a Vector?',
        description: 'Three questions on vector representation.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'How is a 2D vector typically represented in code?', questionType: 'fill_blank', correctAnswer: 'An array of two numbers (e.g., [x, y])' },
          { questionText: 'What two properties does a geometric vector have?', questionType: 'fill_blank', correctAnswer: 'Magnitude and direction' },
          { questionText: 'An RGB color can be represented as a 3-element vector.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Vector Operations: Addition, Scalar Multiplication, Dot Product',
      duration: 35,
      content: `## Learning Objectives\n- Add vectors element-wise.\n- Multiply a vector by a scalar.\n- Compute the dot product.\n\n## Vector Addition\nAdd corresponding elements: [1,2] + [3,4] = [4,6].\n\n## Scalar Multiplication\nMultiply each element by a scalar: 2 * [1,2] = [2,4].\n\n## Dot Product\nMultiply corresponding elements and sum: [1,2] · [3,4] = 1*3 + 2*4 = 11.\n\n## Key Takeaways\n- Vector addition is element-wise.\n- Dot product = sum of element-wise products.`,
      quiz: {
        title: 'Quiz 7.2 — Vector Operations',
        description: 'Three questions on vector operations.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: '[1,2] + [3,4] = ?', questionType: 'fill_blank', correctAnswer: '[4,6]' },
          { questionText: '2 * [1,2] = ?', questionType: 'fill_blank', correctAnswer: '[2,4]' },
          { questionText: 'Dot product of [1,2] and [3,4] = ?', questionType: 'fill_blank', correctAnswer: '11' },
        ],
      },
    },
    {
      title: 'Introduction to Matrices & Matrix Operations',
      duration: 40,
      content: `## Learning Objectives\n- Understand matrix dimensions.\n- Identify when matrices can be multiplied.\n- Recognize the identity matrix.\n\n## Matrix Dimensions\nA matrix with r rows and c columns has dimensions r x c.\n\n## Matrix Multiplication\nYou can multiply matrix A (m x n) by matrix B (n x p) if the inner dimensions match (n). Result is m x p.\n\n## Identity Matrix\nThe identity matrix I has 1s on the diagonal and 0s elsewhere. A * I = A.\n\n## Key Takeaways\n- Two matrices can be multiplied if the inner dimensions match.\n- Identity matrix leaves any matrix unchanged when multiplied.`,
      quiz: {
        title: 'Quiz 7.3 — Introduction to Matrices',
        description: 'Three questions on matrix dimensions and operations.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Dimensions of a matrix with 2 rows and 3 columns?', questionType: 'fill_blank', correctAnswer: '2x3' },
          { questionText: 'Can you multiply a 2x3 matrix by a 3x2 matrix?', questionType: 'fill_blank', correctAnswer: 'Yes' },
          { questionText: 'Identity matrix leaves any matrix unchanged when multiplied.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Applications: Transforms, Graphics, Images as Matrices',
      duration: 35,
      content: `## Learning Objectives\n- Represent images as matrices.\n- Apply 2D transformations using matrix operations.\n\n## Images as Matrices\nA grayscale image can be represented as a matrix of pixel intensity values (0 = black, 255 = white).\n\n## 2D Transformations\nScaling, rotating, and translating 2D points are done via matrix multiplication.\n\n## Key Takeaways\n- Grayscale images are represented as intensity matrices.\n- Rotation of a 2D point uses rotation matrix multiplication.
- Scaling an image up or down can be represented as a matrix operation.`,
      quiz: {
        title: 'Quiz 7.4 — Applications of Matrices',
        description: 'Three questions on matrix applications.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'How can a grayscale image be represented?', questionType: 'fill_blank', correctAnswer: 'As a matrix of pixel intensity values' },
          { questionText: 'What operation rotates a 2D point?', questionType: 'fill_blank', correctAnswer: 'Matrix multiplication' },
          { questionText: 'Scaling an image can be represented as a matrix operation.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'A Peek at Linear Algebra in Machine Learning',
      duration: 40,
      content: `## Learning Objectives\n- Understand feature vectors.\n- See how matrix multiplication powers neural networks.\n\n## Feature Vectors\nIn ML, a feature vector is a numeric representation of an object's attributes.\n\n## Neural Network Layers\nA neural network layer computes: outputs = activation(inputs * weights + bias). The core multiplication is matrix multiplication.\n\n## Key Takeaways\n- Feature vectors represent data points numerically.
- Matrix multiplication is the core operation of neural network layers.
- You don't need calculus-based ML training to understand these concepts.`,
      quiz: {
        title: 'Quiz 7.5 — Linear Algebra in ML',
        description: 'Three questions on vectors and matrices in ML.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'In ML, what is a feature vector?', questionType: 'fill_blank', correctAnswer: 'A numeric representation of an object attributes' },
          { questionText: 'Core operation underlying a neural network layer?', questionType: 'fill_blank', correctAnswer: 'Matrix multiplication' },
          { questionText: 'You need to master calculus-based ML training to understand these concepts.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 7 Assignment — 2D Transform Tool',
    description: 'Build a tool that applies translation, scale, and rotation to a set of 2D points using vector/matrix operations, then prints transformed coordinates.',
    dueDate: '2026-12-06T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm7a1', type: 'theory', title: 'Compute dot product of [2,3] and [4,1].', marks: 5 },
      { id: 'm7a2', type: 'theory', title: 'Add matrices [[1,2],[3,4]] and [[5,6],[7,8]].', marks: 5 },
      { id: 'm7a3', type: 'theory', title: 'Condition to multiply two matrices?', marks: 5 },
      { id: 'm7a4', type: 'file', title: 'Submit your 2D transform tool.', marks: 5 },
    ],
  },
}
