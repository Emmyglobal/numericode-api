import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Third Term, Week 2 — Algebraic Expressions I. Verified: substituting x = 4
// into 3x + 5 gives 17; "four times a number, less 7" is 4x - 7; expanding
// (x + 3)(x + 5) gives x^2 + 8x + 15.
export const module02: Jss1ModuleData = {
  title: 'Module 2 — Week 2: Algebraic Expressions I',
  lessons: [
    {
      title: 'Week 2 — Algebraic Expressions I',
      duration: 45,
      content: `## Learning Objectives
- Substitute values into an expression correctly.
- Construct an expression from words.
- Expand the product of two linear expressions.

## Substituting into an Expression
When you substitute a number into an expression, remember to still use the
**order of operations**. Substitution is just replacing the letter.

### Worked Example 1
Find the value of 3x + 5 when x = 4.

Replace x with 4: 3(4) + 5 = 12 + 5 = **17**

Brackets first, then multiply, then add.

### Worked Example 2
Find the value of x² - 5 when x = 3.

Remember the power applies to x only: 3² - 5 = 9 - 5 = **4**

## Constructing Algebraic Expressions
Letters represent the unknown so that a problem can be solved.

### Worked Example 3
"Four times a number, less 7"

"Four times a number" is 4x. "Less 7" means subtract 7.

The expression is **4x - 7**

### Key phrases to recognise
| Words | Expression |
|---|---|
| a number n | n |
| more than | + |
| less than | - |
| times / of | x |
| divided by | / |
| the square of | n² |

## Expressions and Indices
### Worked Example 4
The area of a square with side s is s². If s = 5 cm, the area is 25 cm².

Powers come before multiplication and division, so always substitute carefully.

## Expanding the Product of Two Expressions
When multiplying two sets of brackets, multiply **every term in the first pair by
every term in the second pair**. There must be as many terms out as in.

### Worked Example 5
(x + 3)(x + 5)

Multiply each term of (x + 3) by each term of (x + 5):

- x x x = x²
- x x 5 = 5x
- 3 x x = 3x
- 3 x 5 = 15

**x² + 5x + 3x + 15 = x² + 8x + 15**

## Common Mistakes
- Missing a term because you did not multiply every pair.
- Forgetting brackets around a negative number when substituting.
- Reading "less than" as addition.

## Practice
1. Find the value of 3x + 5 when x = 4.
2. Find the value of x² - 5 when x = 3.
3. Write an expression for "seven more than twice a number n".
4. Expand (x + 3)(x + 5).
5. Expand (2x + 1)(x - 4).`,
      quiz: quiz(
        'Week 2 Quiz — Algebraic Expressions I',
        'Five questions on substitution, constructing expressions and expanding.',
        [
          fb(
            'Find the value of 3x + 5 when x = 4. (Enter a number only)',
            '17',
            'Substitute x = 4: 3(4) + 5 = 12 + 5 = 17.',
          ),
          mc(
            'Which expression means "four times a number, less 7"?',
            ['4x - 7', '4x + 7', '7 - 4x', '(x - 4) / 7'],
            '"Four times a number" is 4x, and "less 7" means subtract 7, giving 4x - 7.',
          ),
          mc(
            'Expand (x + 3)(x + 5).',
            ['x^2 + 8x + 15', 'x^2 + 15', 'x^2 + 8x + 8', '2x + 8'],
            'Multiply every term by every term: x^2 + 5x + 3x + 15, and 5x + 3x = 8x, giving x^2 + 8x + 15.',
          ),
          mc(
            'Find the value of x^2 - 5 when x = 3.',
            ['4', '14', '-14', '9'],
            'The square applies to x only, so 3^2 - 5 = 9 - 5 = 4.',
          ),
          mc(
            'How many terms should the expansion of (a + b)(c + d) have?',
            ['Four', 'Two', 'Three', 'Six'],
            'Each of the 2 terms in the first bracket pairs with each of the 2 in the second, giving 2 x 2 = 4 terms.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 2.1 — Algebraic Expressions I',
        'Show each pair of multiplications in your expansions so no term is missed.',
        [
          { id: 'a1', type: 'theory', title: 'Find the value of each expression: (i) 3x + 5 when x = 4, (ii) x^2 - 5 when x = 3, (iii) 2x^2 + 7 when x = -2, (iv) 5 - 3p when p = 4.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Write an expression for each: (i) seven more than twice a number n, (ii) four less than three times a number m, (iii) half of a number p plus 5.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Expand fully: (i) (x + 3)(x + 5), (ii) (2x + 1)(x - 4), (iii) (x - 2)(x + 6).', marks: 6 },
          { id: 'a4', type: 'subjective', title: 'Explain in your own words why an expansion of two binomials must produce four terms.', marks: 2 },
        ],
      ),
    },
  ],
}