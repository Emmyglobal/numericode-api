import type { Ss1ModuleData } from './types'

export const module06: Ss1ModuleData = {
  title: 'Module 6 — Week 10: Logic',
  lessons: [
    {
      title: 'Week 10 — Propositions, Truth Tables & Logic',
      duration: 45,
      content: `# Week 10 — Propositions, Truth Tables & Logic

## Learning Objectives
By the end of this lesson you should be able to:
- Define a proposition and distinguish between simple and compound statements.
- Write the negation (negation) of a simple and compound statement.
- Use conjunction (and), disjunction (or), implication (if-then), and bi-conditional (if and only if).
- Construct truth tables for compound statements.
- State the converse, inverse, and contrapositive of a conditional statement.
- Apply the laws of algebra of propositions (commutative, associative, distributive, De Morgan's).

## Introduction
**Logic** is the study of the way people reason. In mathematics, a **proposition** is a statement that is either true (T) or false (F), but never both. Logic helps us build valid arguments and proofs — a cornerstone of higher mathematics.

## Simple and Compound Propositions
- **Simple proposition:** a statement with no connectives. e.g. "2 + 2 = 4" (True).
- **Compound proposition:** formed by joining simple propositions with connectives (and, or, if-then, if and only if).

### Negation
The negation of statement P (written not P or P') is true when P is false and false when P is true.

### Conjunction (and, written P Λ Q)
P and Q is true only when both P and Q are true.

### Disjunction (or, written P V Q)
P or Q is false only when both P and Q are false.

### Conditional (Implication, written P → Q)
"If P then Q" is false only when P is true and Q is false.

### Bi-conditional (Bi-implication, written P ↔ Q)
"If and only if" is true when both P and Q have the same truth value.

## Truth Tables

### Negation
| P | ¬P |
|---|----|
| T | F  |
| F | T  |

### Conjunction (P Λ Q)
| P | Q | P Λ Q |
|---|---|--------|
| T | T | T      |
| T | F | F      |
| F | T | F      |
| F | F | F      |

### Disjunction (P V Q)
| P | Q | P V Q |
|---|---|--------|
| T | T | T      |
| T | F | T      |
| F | T | T      |
| F | F | F      |

### Conditional (P → Q)
| P | Q | P → Q |
|---|---|--------|
| T | T | T      |
| T | F | F      |
| F | T | T      |
| F | F | T      |

### Bi-conditional (P ↔ Q)
| P | Q | P ↔ Q |
|---|---|--------|
| T | T | T      |
| T | F | F      |
| F | T | F      |
| F | F | T      |

## Worked Example 1
Construct a truth table for: P Λ (Q V R)

**Solution**
| P | Q | R | Q V R | P Λ (Q V R) |
|---|---|---|--------|-------------|
| T | T | T | T      | T           |
| T | T | F | T      | T           |
| T | F | T | T      | T           |
| T | F | F | F      | F           |
| F | T | T | T      | F           |
| F | T | F | T      | F           |
| F | F | T | T      | F           |
| F | F | F | F      | F           |

## Conditional Statements
A conditional statement is "If P, then Q" where P is the **antecedent** and Q is the **consequent**.

- **Converse:** If Q, then P.
- **Inverse:** If not P, then not Q.
- **Contrapositive:** If not Q, then not P.

### Worked Example 2
For "If a triangle has 3 sides, then it is a triangle":
State the converse, inverse, and contrapositive.

**Solution**
- Converse: "If it is a triangle, then it has 3 sides." (True)
- Inverse: "If a triangle does not have 3 sides, then it is not a triangle." (True, vacuously)
- Contrapositive: "If it is not a triangle, then it does not have 3 sides." (True)

Note: The original statement and its contrapositive are always logically equivalent.

## Laws of Algebra of Propositions

- **Commutative laws:** P V Q = Q V P; P Λ Q = Q Λ P
- **Associative laws:** (P V Q) V R = P V (Q V R); (P Λ Q) Λ R = P Λ (Q Λ R)
- **Distributive laws:** P V (Q Λ R) = (P V Q) Λ (P V R); P Λ (Q V R) = (P Λ Q) V (P Λ R)
- **De Morgan's laws:** ¬(P V Q) = ¬P Λ ¬Q; ¬(P Λ Q) = ¬P V ¬Q

### Worked Example 3
Use De Morgan's law to simplify: ¬(P V ¬Q)

**Solution**
¬(P V ¬Q) = ¬P Λ ¬(¬Q) = ¬P Λ **Q**

### Worked Example 4
Construct a truth table to verify: P V (Q Λ R) = (P V Q) Λ (P V R)

**Solution**
This is the distributive law. The truth table confirms both sides give identical results for all combinations of truth values.

## Class Activity
Essential Mathematics SS1, Page 186, Ex 14.2, Nos 1b, 1e, 1h, 2d, 3c, 3d, 4a, 4b, 6a, 6b; Page 190, Ex 14.3, No 4; Page 190, Ex 14.3, No 3a & 3b.

## Assignment
Essential Mathematics SS1, Page 186, Ex 14.2, Nos 1i, 2c, 3a, 4c, 6c; Page 190, Ex 14.3, No 5.

## Summary — Key Points
- A **proposition** is T or F; compound propositions use connectives (and, or, if-then, iff).
- **Conditional P → Q** is only false when P is true and Q is false.
- **Contrapositive** is logically equivalent to the original conditional.
- **De Morgan's laws:** ¬(P V Q) = ¬P Λ ¬Q; ¬(P Λ Q) = ¬P V ¬Q.
- Truth tables are a systematic way to check logical equivalence.`,
      quiz: {
        title: 'Quiz W10 — Logic',
        description: '8 questions on propositions, truth tables, and logical laws.',
        timeLimit: 600,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { id: 'q1', questionText: 'The statement "x + 1 = 3" is a proposition when x is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A variable', isCorrect: false }, { id: 'b', text: 'A specific number', isCorrect: true }, { id: 'c', text: 'Always true', isCorrect: false }, { id: 'd', text: 'Always false', isCorrect: false }], correctAnswer: 'b', explanation: 'A proposition must be definitively true or false; a variable makes it an open statement.' },
          { id: 'q2', questionText: '"P and Q" is true when:', questionType: 'fill_blank', correctAnswer: 'both P and Q are true' },
          { id: 'q3', questionText: 'True or false: The contrapositive of "If P then Q" is "If not Q then not P".', questionType: 'true_false', correctAnswer: 'true' },
          { id: 'q4', questionText: 'If P is true and Q is false, what is P V Q (P or Q)?', questionType: 'fill_blank', correctAnswer: 'true' },
          { id: 'q5', questionText: 'De Morgan law: ~(P and Q) =', questionType: 'fill_blank', correctAnswer: '~P or ~Q' },
          { id: 'q6', questionText: 'True or false: P → Q is false when P is false and Q is true.', questionType: 'true_false', correctAnswer: 'false' },
          { id: 'q7', questionText: 'The negation of "P or Q" is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'P or Q', isCorrect: false }, { id: 'b', text: 'not P and not Q', isCorrect: true }, { id: 'c', text: 'not P or not Q', isCorrect: false }, { id: 'd', text: 'P and Q', isCorrect: false }], correctAnswer: 'b' },
          { id: 'q8', questionText: 'P ↔ Q is true when P and Q have the same:', questionType: 'fill_blank', correctAnswer: 'truth value' },
        ],
      },
      assignment: {
        title: 'Assignment W10 — Logic',
        description: 'Show full truth tables. Simplify step by step.',
        dueDate: '2026-11-05T23:59:59Z',
        totalMarks: 20,
        passingScore: 10,
        assignmentType: 'mixed',
        questions: [
          { id: 'a1', type: 'subjective', title: 'Construct a truth table for: (P → Q) Λ (Q → P). What standard logical equivalence does this represent?', marks: 7 },
          { id: 'a2', type: 'subjective', title: 'Write the converse, inverse, and contrapositive of: "If it is raining, then the ground is wet."', marks: 6 },
          { id: 'a3', type: 'subjective', title: 'Use De Morgan laws to simplify: (a) ~(P V ~Q), (b) ~(~P Λ Q).', marks: 7 },
        ],
      },
    },
  ],
}