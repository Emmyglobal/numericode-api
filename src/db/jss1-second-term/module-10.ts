import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Second Term, Week 10 — Number Operations. Verified: 4567 rounded to the
// nearest hundred is 4600; 2.345 rounded to two decimal places is 2.35 (look at
// the 3rd decimal place, which is 5, so round up); the HCF of 12 and 18 is 6;
// the LCM of 4 and 6 is 12.
export const module10: Jss1ModuleData = {
  title: 'Module 10 — Week 10: Number Operations',
  lessons: [
    {
      title: 'Week 10 — Number Operations',
      duration: 45,
      content: `## Learning Objectives
- Round numbers to a given number of decimal places or significant figures.
- Find the HCF and the LCM of two numbers.
- Order numbers using the symbols <, > and =.

## Rounding
To round a number to a given place, look at the digit **immediately after** that
place.

- If it is **5 or more**, round up.
- If it is **4 or less**, leave it as it is.

### Worked Example 1 — to the nearest hundred
4567: the hundreds digit is 5 and the digit after it is 6, which is 5 or more, so
round up.

**4567 rounds to 4600**

### Worked Example 2 — to two decimal places
2.345: the second decimal place is 4, and the digit after it is 5, so round the 4
up to 5.

**2.345 rounds to 2.35**

## HCF and LCM
The **HCF** (highest common factor) is the largest number that divides both
numbers exactly. The **LCM** (lowest common multiple) is the smallest number that
is a multiple of both.

### Worked Example 3 — HCF of 12 and 18
Factors of 12: 1, 2, 3, 4, 6, 12
Factors of 18: 1, 2, 3, 6, 9, 18

The largest number in both lists is **6**, so **HCF = 6**

### Worked Example 4 — LCM of 4 and 6
Multiples of 4: 4, 8, 12, 16, 20
Multiples of 6: 6, 12, 18, 24

The smallest number in both lists is **12**, so **LCM = 12**

**A useful check:** HCF x LCM always equals the product of the original pair.
For 4 and 6 the HCF is 2, and 2 x 12 = 24 = 4 x 6. Use this to spot an error
quickly.

## Ordering Numbers
| Symbol | Meaning |
|---|---|
| **<** | less than |
| **>** | greater than |
| **=** | equal to |

The symbol always points at the **smaller** number, like an open mouth facing the
bigger value.

## Common Mistakes
- Rounding using the digit after the rounding place rather than the rounding
  place itself.
- Confusing HCF with LCM, which is the single most common error in this topic.
- Reading < and > the wrong way round.

## Practice
1. Round 6789 to the nearest hundred and to the nearest ten.
2. Round 3.14159 to two decimal places.
3. Find the HCF of 24 and 36.
4. Find the LCM of 8 and 12.
5. Place these in order using < or >: 3/4, 0.7, 2/3.`,
      quiz: quiz(
        'Week 10 Quiz — Number Operations',
        'Five questions on rounding, HCF, LCM and ordering.',
        [
          mc(
            'Round 4567 to the nearest hundred.',
            ['4600', '4500', '4567', '4000'],
            'The hundreds digit is 5 and the next digit is 6, which is 5 or more, so round up to 4600.',
          ),
          fb(
            'Round 2.345 to two decimal places. Give your answer as a number only.',
            '2.35',
            'The second decimal place is 4 and the digit after it is 5, so round the 4 up to 5, giving 2.35.',
          ),
          mc(
            'What is the HCF of 12 and 18?',
            ['6', '3', '36', '2'],
            'Factors of 12 are 1, 2, 3, 4, 6, 12 and of 18 are 1, 2, 3, 6, 9, 18. The largest common factor is 6.',
          ),
          mc(
            'What is the LCM of 4 and 6?',
            ['12', '2', '24', '10'],
            'The smallest number that is a multiple of both 4 and 6 is 12.',
          ),
          mc(
            'Which statement is correct about the HCF and LCM of two numbers?',
            [
              'HCF x LCM = the product of the two numbers',
              'HCF + LCM = the product of the two numbers',
              'They are always equal',
              'LCF x LCM = the difference of the two numbers',
            ],
            'A useful check is that the HCF multiplied by the LCM equals the product of the original two numbers.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 10.1 — Number Operations',
        'Show the digit you used to decide each rounding, and list the factors you used to find each HCF and LCM.',
        [
          { id: 'a1', type: 'theory', title: 'Round each number as stated: (i) 6789 to the nearest hundred, (ii) 6789 to the nearest ten, (iii) 3.14159 to two decimal places, (iv) 3.14159 to three decimal places.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'Find the HCF of each pair: (i) 24 and 36, (ii) 18 and 30, (iii) 40 and 64.', marks: 6 },
          { id: 'a3', type: 'theory', title: 'Find the LCM of each pair: (i) 8 and 12, (ii) 9 and 15, (iii) 10 and 14.', marks: 6 },
          { id: 'a4', type: 'subjective', title: 'Place the following in order using the correct inequality symbols: 3/4, 0.7, 2/3, 0.65. Show how you decided which is bigger.', marks: 2 },
        ],
      ),
    },
  ],
}