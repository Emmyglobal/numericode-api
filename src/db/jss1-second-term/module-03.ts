import type { Jss1ModuleData } from './types'
import { assignment, fb, mc, quiz } from './helpers'

// Second Term, Week 3 — Data Analysis. Verified: a sample of 100 from a school
// of 1000 is 10%; observation suits counting traffic flow, a survey suits
// opinions, an experiment isolates one factor, and 50 out of 200 is 25%.
export const module03: Jss1ModuleData = {
  title: 'Module 3 — Week 3: Data Analysis',
  lessons: [
    {
      title: 'Week 3 — Data Analysis',
      duration: 45,
      content: `## Learning Objectives
- Name the common data collection methods and say when to use each.
- Justify your choice of method.
- State the advantages and disadvantages of sampling.

## What is Data Collection?
**Data collection** is gathering information to answer a question or solve a
problem. In Mathematics we collect data to analyse trends, make predictions, or
support decisions.

## Common Data Collection Methods

| Method | Description | Best used when |
|---|---|---|
| **Survey / questionnaire** | Asking people questions and recording the answers | You want opinions or preferences |
| **Observation** | Watching and recording behaviour or events | You want actions or patterns, such as traffic flow |
| **Experiment** | Carrying out a test under controlled conditions | You want to see how one factor affects another |
| **Existing data** | Using data that is already available | You do not need new data |
| **Interview** | Speaking directly to individuals for detail | You need in-depth answers from fewer people |

## How to Justify Your Method
Ask yourself four questions:

1. What question am I trying to answer?
2. Who or what am I collecting data from?
3. How much time do I have?
4. Do I have enough resources?

### Worked Example 1
To count how many cars pass a junction each hour, use **observation**, because
you are counting an action rather than asking anyone's opinion.

### Worked Example 2
To test whether temperature affects how fast an ice cube melts, use an
**experiment**, because it isolates one factor while the others stay the same.

## Sampling
**Sampling** means selecting a smaller group (the sample) from a larger group
(the population) instead of asking everybody.

### Worked Example 3
A school has 1000 students. Asking all 1000 takes too long, so you ask a sample
of 100 to represent the school.

That sample is 100 out of 1000, which is **10%** of the population.

### Advantages of Sampling
- **Saves time** — you do not have to ask everyone.
- **Saves money** — fewer resources are needed.
- **Easier to manage** — a smaller group is more practical.

### Disadvantages of Sampling
- The sample may **not represent** the population fairly.
- Results are only an **estimate**, not an exact count.
- A badly chosen sample can give a **misleading** conclusion.

## Practice
1. Name the best method for counting how many visitors enter a shop in an hour.
2. A population is 400 and the sample is 50. What percentage is the sample?
3. Give two advantages of sampling.
4. Give one disadvantage of sampling.`,
      quiz: quiz(
        'Week 3 Quiz — Data Analysis',
        'Five questions on data collection methods, justification and sampling.',
        [
          mc(
            'Which method is best for counting how many cars pass a junction each hour?',
            ['Observation', 'Survey/questionnaire', 'Interview', 'Existing data'],
            'Observation records actions and patterns directly, such as traffic flow, without having to ask anyone.',
          ),
          fb(
            'A school has 1000 students and 100 are sampled. What percentage of the population is the sample? (Enter a number only)',
            '10',
            '100 out of 1000 is one tenth, which is 10%.',
          ),
          mc(
            'Which method is best for finding out whether temperature affects how fast an ice cube melts?',
            ['Experiment', 'Survey/questionnaire', 'Observation', 'Existing data'],
            'An experiment controls the other conditions so that only one factor, temperature, changes.',
          ),
          mc(
            'Which is NOT an advantage of sampling?',
            [
              'It gives an exact count of the whole population',
              'It saves time',
              'It saves money',
              'It is easier to manage',
            ],
            'Sampling gives an estimate, not an exact count. Saving time, money and effort are genuine advantages.',
          ),
          mc(
            'A population is 200 and 50 members are sampled. What percentage is the sample?',
            ['25%', '50%', '10%', '40%'],
            '50 out of 200 is one quarter, which is 25%.',
          ),
        ],
      ),
      assignment: assignment(
        'Assignment 3.1 — Data Analysis',
        'For each question state which method you would use AND give your reason.',
        [
          { id: 'a1', type: 'theory', title: 'Name the best method for each investigation and justify your choice: (i) counting birds at a feeder, (ii) finding which vegetables students prefer, (iii) testing whether soil type affects plant growth.', marks: 6 },
          { id: 'a2', type: 'theory', title: 'State three advantages of using a sample instead of surveying a whole population.', marks: 3 },
          { id: 'a3', type: 'theory', title: 'State two disadvantages of sampling, explaining why each one matters.', marks: 3 },
          { id: 'a4', type: 'subjective', title: 'A school of 800 pupils samples 80 to find out how many walk to school. What percentage is the sample? Explain why a sample is sensible here.', marks: 8 },
        ],
      ),
    },
  ],
}