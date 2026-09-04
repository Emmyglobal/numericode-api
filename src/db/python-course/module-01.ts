// ─── Python Course — Module 2: Python Foundations ───────────────────────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'P1.1 — Your First Program: Variables & Output',
  duration: 8,
  content: `# P1.1 — Your First Program: Variables & Output

A variable is a named box that holds a value. \`print\` shows it.

## Learning Objectives
- Store text and numbers in variables and print them with \`print\`.
- Tell the difference between a number and its name in memory.
- Run a Python program and read the output without errors.

## Introduction
Python powers data science and machine learning, so we start by talking to Python. The two moves you need are: store something in a name, then show it. That is a program.

## Variables and Types
price = 250          # a number (int)
name = "iris"        # text (str)
Python infers the type from the value; you do not declare it. Reassigning changes the value in place.

## Output with print
print(name)          # iris
print(price)         # 250
To print more than one thing, separate with commas; print joins them with spaces.
print(name, price)   # iris 250
If you need text and a number together, wrap the number with str():
print("price: " + str(price))   # price: 250

## Worked Example — Store Prices
prices = [120, 45, 300, 80, 199]
total = 0
for p in prices:
    if p > 100:
        print(p, "is expensive")
        total = total + p
print("total expensive revenue:", total)   # 619

## Practical Exercise — Your First Program
Run this and observe:
prices = [120, 45, 300, 80, 199]
for p in prices:
    if p > 100:
        print(p, "is expensive")
Tasks: (1) which prices print; (2) add expensive_total = 0 before the loop, then expensive_total = expensive_total + p inside the if, then print(expensive_total). Check your work: it prints 120, 300, 199, then 619.
Expected scaffold lines (copy exactly):
    prices = [120, 45, 300, 80, 199]
    for p in prices:
        if p > 100:
            print(p, "is expensive")

## Key Takeaways
- A variable is a name bound to a value; print writes to the screen.
- str() converts a number into text so you can join it with +.
- Indentation (four spaces) is syntax: one wrong space and Python errors.
- Read the traceback from the bottom up — the last line tells you the error.

## Quiz Answer Key
1. (b) Python is the language scikit-learn, pandas, and NumPy are built with.
2. (c) A list (square brackets) keeps order and you index by position.
3. False — you assign by name, not by type; Python infers it.
4. (a) def — the keyword that creates a function.
5. (b) print(price) outputs 250.
`,
  quiz: {
    title: 'Quiz P1.1 — Variables & Output',
    description: '5 auto-gradable questions on variables, types, and printing.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Which language do scikit-learn, pandas, and NumPy run on?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Java', isCorrect: false }, { id: 'b', text: 'Python', isCorrect: true }, { id: 'c', text: 'R', isCorrect: false }, { id: 'd', text: 'Ruby', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'What does `prices = [120, 45, 300, 80, 199]` create?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A number', isCorrect: false }, { id: 'b', text: 'A text string', isCorrect: false }, { id: 'c', text: 'A list', isCorrect: true }, { id: 'd', text: 'A function', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q3', questionText: 'True or false: In Python you must declare a variable type when you create it.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'A reusable block of code is created with the ______ keyword.', questionType: 'fill_blank', correctAnswer: 'def' },
      { id: 'q5', questionText: 'Given `price = 250` then `print(price)`, what is output?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'price', isCorrect: false }, { id: 'b', text: '250', isCorrect: true }, { id: 'c', text: "'250'", isCorrect: false }, { id: 'd', text: 'name error', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P1.1 — First Python Script',
    description: 'Write a program that stores a product name (string), its price (number), and units sold (int), then prints them with labels and computes revenue = price * units. Good: clear variable names, labeled prints, correct revenue; rubric: 5 variables, 9 labels+output, 6 revenue, 4 readability = 20.',
    dueDate: '2026-07-06T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'q1', type: 'theory', title: 'Write the complete program: declare the three variables, print each with a label, and print the revenue.', marks: 12 },
      { id: 'q2', type: 'subjective', title: 'Why is Python, not a spreadsheet, the tool for machine learning — one sentence?', marks: 8 },
    ],
  },
})



lessons.push({
  title: 'P1.2 — Data Types & Operators',
  duration: 10,
  content: `# P1.2 — Data Types & Operators

## Learning Objectives
- Tell integers, floats, strings, and booleans apart.
- Use arithmetic, comparison, and logical operators on values.
- Predict how Python orders mixed types in comparisons.

## Introduction
Every value in Python has a type, and every type decides what you can do with it. Numbers add and multiply; strings join; comparisons ask questions that return True or False.

## Numbers — ints and floats
count = 3        # int
price = 2.5      # float
Python prints ints without a decimal and floats with one. Division (/) always returns a float; floor division (//) returns an int.
7 / 2   # 3.5
7 // 2  # 3
7 % 2   # 1

## Strings
name = "iris"
greeting = "hello, " + name        # hello, iris
len(greeting)                      # 8
A string is a sequence of characters; you can slice it: name[0] is 'i', name[1:] is 'ris'.

## Comparison and Logic
5 > 3        # True
5 == 5       # True
5 != 4       # True
True and False   # False
True or False    # True
not True         # False

Strings compare alphabetically (Python compares by ordinal value, so 'a' < 'b' is True).

## Worked Example — Price Check
price = 2.5
quantity = 4
total = price * quantity           # 10.0
is_expensive = total > 20          # False
print(total, is_expensive)         # 10.0 False

## Practical Exercise
Run this and observe:
price = 2.5
quantity = 4
total = price * quantity
print("total is", total)
print("expensive?", total > 20)
Tasks: (1) what prints on each line; (2) change the threshold to 100 and rerun. Check: line 1 -> total is 10.0; line 2 -> expensive? False (becomes True only above 20).
Expected scaffold lines (copy exactly):
    price = 2.5
    quantity = 4
    total = price * quantity
    print("total is", total)
    print("expensive?", total > 20)

## Key Takeaways
- int vs float: / gives float, // gives int, % gives remainder.
- Strings are sequences: len, indexing, slicing, and + all work.
- Comparisons return booleans; and/or/not combine them.
- Mixing types in arithmetic is fine, but mixing types in comparison can surprise you — keep operands the same type.

## Quiz Answer Key
1. (b) Floats can hold fractional values; ints cannot.
2. (a) 7 // 2 discards the remainder, giving 3.
3. False — comparisons return True or False.
4. c) + and len are the right tools (b) and (d) mix incompatible types.
5. (a) True or False short-circuits; the result is always True.
`,
  quiz: {
    title: 'Quiz P1.2 — Data Types & Operators',
    description: '5 auto-gradable questions on Python types and operators.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Which type can hold a fractional value like 2.5?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'int', isCorrect: false }, { id: 'b', text: 'float', isCorrect: true }, { id: 'c', text: 'str', isCorrect: false }, { id: 'd', text: 'bool', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'What does 7 // 2 evaluate to?', questionType: 'multiple_choice', options: [{ id: 'a', text: '3.5', isCorrect: false }, { id: 'b', text: '4', isCorrect: false }, { id: 'c', text: '3', isCorrect: true }, { id: 'd', text: '0', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q3', questionText: 'True or false: True + True evaluates to 2 in Python.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Which line would raise a TypeError?', questionType: 'multiple_choice', options: [{ id: 'a', text: '"x" + "y"', isCorrect: false }, { id: 'b', text: '"x" * 3', isCorrect: false }, { id: 'c', text: '"x" + 3', isCorrect: true }, { id: 'd', text: 'str(3) + "x"', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q5', questionText: 'Evaluate: True or (False and False)', questionType: 'multiple_choice', options: [{ id: 'a', text: 'True', isCorrect: true }, { id: 'b', text: 'False', isCorrect: false }, { id: 'c', text: '0', isCorrect: false }, { id: 'd', text: 'None', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment P1.2 — Types & Operators',
    description: 'Write a small program computing the final price after a percentage discount, then describe each type involved. Good: correct discounted total, correct types named, readable output; rubric: 6 discount calc, 4 output formatting, 5 types named, 5 explanation = 20.',
    dueDate: '2026-07-07T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'q1', type: 'theory', title: 'Given original_price = 80 and discount_pct = 25, compute the discounted price and print a labeled message. Show the calculation line and the print line.', marks: 10 },
      { id: 'q2', type: 'subjective', title: 'Name the Python type (int, float, str, or bool) of each of these values: original_price, 80, discount_pct, 25.', marks: 10 },
    ],
  },
})

lessons.push({
  title: 'P1.3 — Lists, Indexing & Loops',
  duration: 10,
  content: `# P1.3 — Lists, Indexing & Loops

## Learning Objectives
- Create, index, and slice a list; tell what counts from 0.
- Loop over a list with \`for\` and accumulate a result.
- Append/extend a list as it grows.

## Introduction
A list is an ordered collection of values, one after another. You reach into it by position (starting at 0) and walk through it with a loop.

## Creating and Indexing
names = ['ada', 'alan', 'grace']
names[0]    # 'ada'   (first)
names[-1]   # 'grace' (last)
names[1]    # 'alan'

## Slicing
names[0:2]  # ['ada', 'alan']  up to but not including index 2
names[1:]   # ['alan', 'grace']

## Loops
for n in names:
    print(n)
total = 0
for n in names:
    total = total + len(n)
print(total)   # 12

## Building Lists
nums = []
nums.append(1)
nums.append(2)        # [1, 2]
nums.extend([3, 4])   # [1, 2, 3, 4]

## Worked Example — Word Lengths
words = ['data', 'science', 'python']
lengths = []
for w in words:
    lengths.append(len(w))
print(lengths)        # [4, 7, 6]
total = 0
for L in lengths:
    total = total + L
print('total letters:', total)   # 17

## Practical Exercise
Run this:
scores = [80, 95, 60, 45, 100]
over_90 = []
for s in scores:
    if s > 90:
        over_90.append(s)
print(over_90)
Tasks: (1) what prints; (2) change the condition to s >= 60 and rerun. Check: with s > 90 only 95 and 100 pass, so the list is [95, 100]; with >= 60 it also includes 80.
Expected scaffold lines (copy exactly):
    scores = [80, 95, 60, 45, 100]
    over_90 = []
    for s in scores:
        if s > 90:
            over_90.append(s)
    print(over_90)

## Key Takeaways
- Lists are ordered and 0-indexed; negative indices count from the end.
- Slices [a:b] go up to but excluding b.
- for var in list: walks each value in order; use total = total + x to accumulate.
- Lists grow with append (one item) and extend (many).

## Quiz Answer Key
1. (a) Python lists are 0-indexed; name[0] is the first element.
2. (b) The slice [0:2] includes index 0 and 1, excluding index 2.
3. False — append adds one; extend accepts an iterable of items.
4. (a) over_90 grows; total becomes 80 + 95 + 60 + 45 + 100 = 380.
5. (b) [0, 1, 8, 27, 64] — cubes in order.
`,
  quiz: {
    title: 'Quiz P1.3 — Lists, Indexing & Loops',
    description: '5 auto-gradable questions on lists, indexing, slicing, and loops.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'If a = [10, 20, 30], what is a[0]?', questionType: 'multiple_choice', options: [{ id: 'a', text: '10', isCorrect: true }, { id: 'b', text: '20', isCorrect: false }, { id: 'c', text: '30', isCorrect: false }, { id: 'd', text: '0', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'For nums = [5, 9, 13, 17], what does nums[1:3] return?', questionType: 'multiple_choice', options: [{ id: 'a', text: '[5, 9]', isCorrect: false }, { id: 'b', text: '[9, 13]', isCorrect: true }, { id: 'c', text: '[13, 17]', isCorrect: false }, { id: 'd', text: '[9, 13, 17]', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: `lst.append([1,2])` and `lst.extend([1,2])` produce the same list.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'After `total = 0` and `for x in [80,95,60,45,100]: total = total + x`, what is total?', questionType: 'fill_blank', correctAnswer: '380' },
      { id: 'q5', questionText: 'Given `items = [0, 1, 2, 3, 4]` and `squares = [x**3 for x in items]`, what is squares?', questionType: 'multiple_choice', options: [{ id: 'a', text: '[0, 1, 4, 9, 16]', isCorrect: false }, { id: 'b', text: '[0, 1, 8, 27, 64]', isCorrect: true }, { id: 'c', text: '[1, 8, 27, 64]', isCorrect: false }, { id: 'd', text: 'Error', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P1.3 — Looping & Accumulating',
    description: 'Given a list of daily step counts, compute and print the total, the maximum, and how many days exceeded 10000. Good: correct totals/max using a single loop, correct count; rubric: 6 total, 4 max, 6 count>10000, 4 readable code = 20.',
    dueDate: '2026-07-08T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
        questions: [
      { id: 'q1', type: 'theory', title: 'With steps = [9500, 12000, 8000, 11000, 7000], write a loop that computes total, max, and the count of days over 10000. Show the program.', marks: 12 },
      { id: 'q2', type: 'subjective', title: 'Why is it important to initialize total = 0 before the loop?', marks: 8 },
    ],
  },
})

lessons.push({
  title: 'P1.4 — Conditionals & Boolean Logic',
  duration: 10,
  content: `# P1.4 — Conditionals & Boolean Logic

## Learning Objectives
- Write if / elif / else branches that choose between outcomes.
- Combine conditions with and, or, not.
- Read nested conditionals and trace which branch runs.

## Introduction
Most programs must choose. You give Python a condition that is True or False, and it runs one block of code or another.

## If / Elif / Else
score = 82
if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
else:
    grade = 'C'
print(grade)   # B

Only the first matching branch runs; the rest are skipped.

## Logical Operators
raining = True
umbrella = True
if raining and umbrella:
    print('stay dry')
elif raining or umbrella:
    print('cautious')
else:
    print('fine')

not flips a boolean: if not raining: ...

## Nested Conditionals
age = 17
if age >= 16:
    if age >= 18:
        print('vote')
    else:
        print('permit only')
else:
    print('too young')

## Worked Example — Shipping Cost
weight = 5
zone = 'domestic'
if weight < 1:
    base = 3
elif weight < 5:
    base = 6
else:
    base = 12
if zone == 'international':
    base = base + 5
print('cost:', base)   # 11

## Practical Exercise
Run this:
temp = 18
if temp > 30:
    print('hot')
elif temp > 15:
    print('mild')
else:
    print('cold')
Tasks: (1) which branch runs; (2) add an international check: if temp > 15 and you are abroad, print 'pack a jacket'. Check: temp=18 prints 'mild'; the added line prints only when both are true.
Expected scaffold lines (copy exactly):
    temp = 18
    if temp > 30:
        print('hot')
    elif temp > 15:
        print('mild')
    else:
        print('cold')

## Key Takeaways
- if/elif/else picks exactly one path; order matters.
- and needs both sides true; or needs one; not inverts.
- Nest ifs when a decision depends on a previous decision.
- Always align the colon and the indented block — indentation is the syntax.

## Quiz Answer Key
1. (c) elif stands for "else if" — one more condition to test.
2. (a) and requires both operands True; True and False is False.
3. False — only the first matching branch runs.
4. (b) 11 — base 6 for 1 <= weight < 5, +5 for international.
5. (a) 18 is between 16 and 30, so 'mild' runs.
`,
  quiz: {
    title: 'Quiz P1.4 — Conditionals & Logic',
    description: '5 auto-gradable questions on if/elif/else and logical operators.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'In `if x > 90: ... elif x > 80: ... else: ...`, what does `elif` do?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Ends the chain', isCorrect: false }, { id: 'b', text: 'Loops back', isCorrect: false }, { id: 'c', text: 'Tests another condition', isCorrect: true }, { id: 'd', text: 'Always runs', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q2', questionText: 'What is the value of True and False?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'True', isCorrect: false }, { id: 'b', text: 'False', isCorrect: true }, { id: 'c', text: 'None', isCorrect: false }, { id: 'd', text: 'Error', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: in an if/elif/else chain, multiple branches can run at once.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'weight=3, zone=international, cost=base+5; base for weight<5 is 6. What is cost?', questionType: 'fill_blank', correctAnswer: '11' },
      { id: 'q5', questionText: 'temp=18, temp>15 prints "mild". This is the?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'elif branch', isCorrect: true }, { id: 'b', text: 'if branch', isCorrect: false }, { id: 'c', text: 'else branch', isCorrect: false }, { id: 'd', text: 'no branch', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment P1.4 — Grading Logic',
    description: 'Write a grading program that converts a numeric score (0-100) to a letter (A>=90, B>=80, C>=70, D>=60, F<60), then describe one case where chaining order matters. Good: correct thresholds via elif, correct letter; rubric: 8 thresholds, 4 output, 4 edge case, 4 explanation = 20.',
    dueDate: '2026-07-09T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'q1', type: 'theory', title: 'Write the if/elif/else program that converts score to a letter grade, then show its output for score=85.', marks: 12 },
      { id: 'q2', type: 'subjective', title: 'Why does the order if>=90 / elif>=80 / elif>=70 matter — give one score that would grade differently if the order were reversed.', marks: 8 },
    ],
  },
})

lessons.push({
  title: 'P1.5 — Functions & Scope',
  duration: 10,
  content: `# P1.5 — Functions & Scope

## Learning Objectives
- Define a function with \`def\` and call it by name.
- Pass arguments and return values from a function.
- Distinguish local scope (inside) from global scope (outside).

## Introduction
A function is a named bundle of code you can reuse with different inputs. Each call runs the body; each call gets its own workspace, so local variables do not leak out.

## Defining and Calling
def greet(name):
    msg = "hello, " + name
    return msg
print(greet("iris"))   # hello, iris

def is defined with def, parameters go in parentheses, return sends a value back.

## Arguments and Return
def add(a, b):
    return a + b
total = add(3, 5)   # 8
If no return, the function gives back None.

## Scope
balance = 100
def spend(amount):
    balance = balance - amount   # BUG: local shadow, not the global
    return balance
print(spend(20))   # UnboundLocalError

Local names live only inside the function. To change a global inside a function:
def spend(amount):
    global balance
    balance = balance - amount
    return balance

## Default Arguments and Keywords
def label(name, active=True):
    return name + ":" + str(active)
print(label("iris"))               # iris:True
print(label("iris", active=False)) # iris:False

## Worked Example — Area of a Circle
from math import pi
def circle_area(radius):
    return pi * radius ** 2
r = 3
print(circle_area(r))   # 28.274333882308138

## Practical Exercise
Run this:
def tax(amount, rate=0.1):
    return amount * rate
print(tax(100))
print(tax(100, 0.2))
Tasks: (1) what each line prints; (2) add a line total_with_tax = 100 + tax(100) and print it. Check: 10.0; 20.0; then 110.0.
Expected scaffold lines (copy exactly):
    def tax(amount, rate=0.1):
        return amount * rate
    print(tax(100))
    print(tax(100, 0.2))

## Key Takeaways
- def NAME(params): body; return sends a value out.
- Calling runs the body; arguments become the parameters.
- Local scope keeps variables inside the function; use global to edit a global.
- Default arguments let callers omit a value.
- Docstrings and small, single-purpose functions make code readable.

## Quiz Answer Key
1. (a) def is the keyword that declares a function.
2. (b) return sends a value back; without it the result is None.
3. False — only globals can, locals cannot; locals are private to one function call.
4. (c) circle_area(3) = pi * 3**2 approx 28.27.
5. (b) tax(100, 0.2) uses 0.2 as rate; tax(100) uses the default 0.1.
`,
  quiz: {
    title: 'Quiz P1.5 — Functions & Scope',
    description: '5 auto-gradable questions on defining, calling, and scoping functions.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
            { id: 'q1', questionText: 'Which keyword starts a function definition in Python?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'function', isCorrect: false }, { id: 'b', text: 'def', isCorrect: true }, { id: 'c', text: 'func', isCorrect: false }, { id: 'd', text: 'define', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'True or false: `return x` ends the function and sends x back to the caller.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q3', questionText: 'Fill in the blank: A variable defined inside a function is called a ______ variable.', questionType: 'fill_blank', correctAnswer: 'local' },
      { id: 'q4', questionText: 'If radius=3, what does circle_area return (pi*3**2)?', questionType: 'multiple_choice', options: [{ id: 'a', text: '9.42', isCorrect: false }, { id: 'b', text: '18.85', isCorrect: false }, { id: 'c', text: '28.27', isCorrect: true }, { id: 'd', text: '36.0', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q5', questionText: 'def tax(amount, rate=0.1): print(tax(100, 0.2)) prints:', questionType: 'multiple_choice', options: [{ id: 'a', text: '10.0', isCorrect: false }, { id: 'b', text: '20.0', isCorrect: true }, { id: 'c', text: '0.2', isCorrect: false }, { id: 'd', text: '100', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P1.5 — Functions & Scope',
    description: 'Write a function convert(fahrenheit) that returns Celsius, and a global counter that tracks how many times it is called. Good: correct formula C=(F-32)*5/9, global call count increments, returns correct value; rubric: 5 formula, 5 conversion, 5 global counter, 5 explanation = 20.',
    dueDate: '2026-07-10T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'q1', type: 'theory', title: 'Implement convert(fahrenheit) -> celsius and a global calls counter that increments each time convert runs. Show the full program and its output for convert(32) and convert(212).', marks: 12 },
      { id: 'q2', type: 'subjective', title: 'Why do you need the `global` keyword to increment a global counter inside a function — one sentence?', marks: 8 },
    ],
  },
})

lessons.push({
  title: 'P1.6 — Errors & Debugging',
  duration: 10,
  content: `# P1.6 — Errors & Debugging

## Learning Objectives
- Read a Python traceback to find the exact line and cause of an error.
- Recognise the four most common error types: syntax, name, type, and value.
- Debug a function by adding print statements and checking intermediate results.

## Introduction
Errors are not failures — they are messages telling you what went wrong and where. A traceback prints the call stack and points at the offending line.

## The Four Common Errors
- SyntaxError: rules of the language broken (missing colon, unbalanced quotes).
- NameError: you used a name Python does not know (undefined variable).
- TypeError: an operation on an incompatible type (e.g., "x" + 3).
- ValueError: a value of the right type but wrong kind (int("abc")).

## Reading a Traceback
Traceback is read bottom-up: the last line is the error type and message; above it are the frames that led there.

## Debugging Strategy
1. Read the last line first (the actual error).
2. Check the line number it names.
3. Insert print() to inspect intermediate values.
4. Test a small slice of the code in isolation.

## Worked Example — Debugging a Loop
def total_length(words):
    total = 0
    for w in words:
        total = total + len(w)
    return total
print(total_length(["hi", "hello"]))   # 7
A buggy version would forget total = 0, or use words.length (wrong attribute).
Use print inside the loop: print(w, len(w), total) at each step.

## Practical Exercise
The code below has one bug. Find it, fix it, and say what it printed before the fix.
numbers = [1, 2, 3, 4]
total = 0
for n in numbers:
    total = total + n
print("total is " + total)
Tasks: (1) what error occurs; (2) the one-character fix; (3) the correct output. Check: TypeError because you cannot add str + int; fix with str(total); output "total is 10".
Expected scaffold lines (copy exactly):
    numbers = [1, 2, 3, 4]
    total = 0
    for n in numbers:
        total = total + n
    print("total is " + total)

## Key Takeaways
- Read tracebacks bottom-up: last line is the error, the line above is where.
- Know the big four error types and what each one names.
- Debug by isolating the failing line and printing intermediate values.
- A one-character fix (str()) can resolve a type mismatch.

## Quiz Answer Key
1. (a) 1 — SyntaxErrors are the most frequent beginner mistake.
2. (b) Tracebacks are read bottom-up; the last line is the error message.
3. False — TypeError, not NameError, is raised for str + int.
4. (b) TypeError — adding a string and an int.
5. (c) str(total) converts the number so it can join the string.
`,
  quiz: {
    title: 'Quiz P1.6 — Errors & Debugging',
    description: '5 auto-gradable questions on reading tracebacks and common error types.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Which error fires most often from a missing colon or quote?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'SyntaxError', isCorrect: true }, { id: 'b', text: 'NameError', isCorrect: false }, { id: 'c', text: 'TypeError', isCorrect: false }, { id: 'd', text: 'ValueError', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'True or false: You read a traceback from the top line first.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q3', questionText: 'Fill in the blank: "print("value: " + 5)" raises a ______ error.', questionType: 'fill_blank', correctAnswer: 'TypeError' },
      { id: 'q4', questionText: 'Which line is buggy: `print("total is " + total)`?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'total = 0', isCorrect: false }, { id: 'b', text: 'for n in numbers:', isCorrect: false }, { id: 'c', text: '"total is " + total', isCorrect: true }, { id: 'd', text: 'print(...', isCorrect: false }], correctAnswer: 'c' },
      { id: 'q5', questionText: 'The fix that makes "print("total is " + total)" work is:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'total = str(total)', isCorrect: false }, { id: 'b', text: 'print("total is:", total)', isCorrect: false }, { id: 'c', text: 'str(total)', isCorrect: true }, { id: 'd', text: 'total = float(total)', isCorrect: false }], correctAnswer: 'c' },
    ],
  },
  assignment: {
    title: 'Assignment P1.6 — Debugging Practice',
    description: 'Three short buggy snippets are provided; for each, (1) name the error type, (2) show the one-line fix, (3) state the corrected output. Good: correct error type per snippet, minimal fix, correct output; rubric: 6 error-type, 6 fix, 6 output, 2 clarity = 20.',
    dueDate: '2026-07-11T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'q1', type: 'theory', title: 'Snippet A: `print(len(123))`. State the error type, the one-line fix, and the corrected output (or "fixed" if a value cannot be recovered).', marks: 7 },
      { id: 'q2', type: 'theory', title: 'Snippet B: `nums = [1,2,3]; print(nums[5])`. Same three things.', marks: 7 },
      { id: 'q3', type: 'subjective', title: 'In one sentence, what is the single most useful debugging habit from this lesson?', marks: 6 },
    ],
  },
})

export const module01: ModuleData = { title: 'Module 1 — Python Foundations', lessons }

