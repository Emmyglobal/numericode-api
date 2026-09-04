// ─── Python Course — Module 2: Collections & Data Structures ─────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'P2.1 — Strings',
  duration: 8,
  content: `# P2.1 — Strings

A string is text in quotes. Strings are sequences, so you can slice and count them.

## Learning Objectives
- Create strings and choose single vs. double quotes.
- Slice strings and use len().
- Apply common string methods (replace, split, strip, upper/lower).

## Introduction
Text is everywhere in data — names of categories, free-form answers, file names. Python strings are sequences of characters, which means they support indexing and slicing just like lists.

## Creating Strings
s = "hello"
t = 'world'
Both are strings; quotes just need to be balanced and not collide with the content.

## Indexing and Slicing
s = "hello"
s[0]    # 'h'
s[-1]   # 'o'
s[1:4]  # 'ell'   up to but not including index 4
s[::2]  # 'hlo'   every second character

## Methods
s.upper()      # 'HELLO'  (returns a new string; does not change s)
s.replace('l', 'L')   # 'heLLo'
s.split('l')          # ['he', '', 'o']
"  hello  ".strip()   # 'hello' (removes surrounding whitespace)

## Formatted Strings (f-strings)
name = "iris"
score = 95
msg = f"{name} scored {score}"   # f-string inserts variables
print(msg)                        # iris scored 95

## Worked Example — Name Formatter
full = "  Ada Lovelace  "
clean = full.strip()
last = clean.split(' ')[-1]
print(f"Welcome, {last.upper()}!")   # Welcome, LOVELACE!

## Practical Exercise
Run this:
word = "hello"
print(word[1:4])
print(word.upper())
Tasks: (1) what each line prints; (2) change "hello" to "Hello, World!" and call .split(", ") — what is the result. Check: line 1 -> ell, line 2 -> HELLO; splitting gives ['Hello', 'World!'].
Expected scaffold lines (copy exactly):
    word = "hello"
    print(word[1:4])
    print(word.upper())

## Key Takeaways
- Strings are sequences: index and slice with [start:stop:step].
- Methods like upper, replace, split, strip return new strings.
- f-strings (f"...{var}...") insert values into text cleanly.
- Strings are immutable: methods do not change the original.

## Quiz Answer Key
1. (a) Strings are sequences of characters, so you can slice and index them.
2. (b) s[1:4] on "hello" gives 'ell' (indices 1,2,3).
3. False — upper returns a new string; s is unchanged.
4. (c) f"..." lets you embed variables with curly braces.
5. (b) strip removes surrounding whitespace, giving 'hi'.
`,
  quiz: {
    title: 'Quiz P2.1 — Strings',
    description: '5 auto-gradable questions on string basics, slicing, and methods.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'In Python, what is a string?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A sequence of characters', isCorrect: true }, { id: 'b', text: 'A number', isCorrect: false }, { id: 'c', text: 'A list', isCorrect: false }, { id: 'd', text: 'A function', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'For s = "hello", what is s[1:4]?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'he', isCorrect: false }, { id: 'b', text: 'ell', isCorrect: true }, { id: 'c', text: 'llo', isCorrect: false }, { id: 'd', text: 'o', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: s.upper() changes the original string s in place.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'An f-string uses ______ syntax to embed a variable.', questionType: 'fill_blank', correctAnswer: 'curly brace' },
      { id: 'q5', questionText: '"  hi  ".strip() returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: '"  hi  "', isCorrect: false }, { id: 'b', text: '"hi"', isCorrect: true }, { id: 'c', text: '""', isCorrect: false }, { id: 'd', text: 'hi', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P2.1 — String Processing',
    description: 'Given a raw CSV field, strip whitespace, split on commas, remove empty entries, and print a clean list. Good: strip then split, filter empties, correct list; rubric: 4 strip+split, 4 filter, 6 clean list, 6 explanation = 20.',
    dueDate: '2026-07-13T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'q1', type: 'theory', title: 'Write a program that cleans the field raw = "  Alice, Bob , , Carol  " into ["Alice", "Bob", "Carol"].', marks: 12 },
      { id: 'q2', type: 'subjective', title: 'Why is strip important before split when processing CSV fields?', marks: 8 },
    ],
  },
})

lessons.push({
  title: 'P2.2 — Dictionaries & Sets',
  duration: 10,
  content: `# P2.2 — Dictionaries & Sets

A dictionary maps keys to values; a set holds unique items. Both trade order for fast lookup.

## Learning Objectives
- Build a dictionary and look up, add, update, and delete items.
- Iterate a dictionary with .items().
- Use a set to test membership and remove duplicates.

## Introduction
Lists index by position; dictionaries index by key. If you know the name of something (not its position), reach for a dict. Sets answer "is this item present?" and "what items are unique?".

## Dictionaries
person = {"name": "ada", "age": 30, "city": "lagos"}
person["name"]      # 'ada'
person["age"] = 31  # update
person["email"] = "ada@x.com"  # add
del person["city"]  # remove
"age" in person     # True

## Iterating a Dictionary
for key, value in person.items():
    print(key, value)
for key in person:          # keys only
    print(key)

## Sets
primes = {2, 3, 5, 5, 3, 7}
print(primes)               # {2, 3, 5, 7}  (duplicates removed, order not guaranteed)
evens = {2, 4, 6, 8}
print(primes & evens)       # {2}  (intersection)
print(primes | evens)       # {2,3,5,7,4,6,8}  (union)
x = {1, 2, 3}
print(2 in x)               # True

## Worked Example — Grade Lookup
grades = {"alice": 82, "bob": 91, "carol": 77}
grades["dave"] = 88
grades["bob"] = 95
passed = []
for name, score in grades.items():
    if score >= 80:
        passed.append(name)
print(passed)   # ['alice', 'bob', 'dave']

## Practical Exercise
Run this:
counts = {"apple": 5, "banana": 3}
counts["cherry"] = counts.get("cherry", 0) + 1
counts["banana"] = counts.get("banana", 0) + 1
print(counts)
Tasks: (1) what prints; (2) add a .get for "apple" the same way and rerun. Check: {"apple": 5, "banana": 4, "cherry": 1}; then apple becomes 6.
Expected scaffold lines (copy exactly):
    counts = {"apple": 5, "banana": 3}
    counts["cherry"] = counts.get("cherry", 0) + 1
    counts["banana"] = counts.get("banana", 0) + 1
    print(counts)

## Key Takeaways
- Dictionaries map keys to values; look up, update, add, delete with bracket syntax and in.
- .items() gives (key, value) pairs; keys() and values() give just the keys/values.
- Sets deduplicate and support fast membership tests and set math (& |).
- .get(key, default) avoids KeyError when a key is missing.

## Quiz Answer Key
1. (a) person["name"] returns the value associated with the key "name".
2. (b) del removes a key-value pair from the dictionary.
3. False — sets do not guarantee order; only that items are unique.
4. (c) {2, 3, 5, 7} — duplicates removed, order not guaranteed.
5. (b) .get returns the default (0) when the key is absent, avoiding a crash.
`,
  quiz: {
    title: 'Quiz P2.2 — Dictionaries & Sets',
    description: '5 auto-gradable questions on dict lookup, iteration, and sets.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'For d = {"x": 10}, what is d["x"]?', questionType: 'multiple_choice', options: [{ id: 'a', text: '10', isCorrect: true }, { id: 'b', text: '"x"', isCorrect: false }, { id: 'c', text: '0', isCorrect: false }, { id: 'd', text: 'None', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'Which statement deletes the key "city" from dict d?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'd.pop("city")', isCorrect: false }, { id: 'b', text: 'del d["city"]', isCorrect: true }, { id: 'c', text: 'd.remove("city")', isCorrect: false }, { id: 'd', text: 'd["city"] = None', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: A Python set guarantees insertion order of its elements.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: '{2, 3, 5, 5, 3, 7} evaluates to:', questionType: 'fill_blank', correctAnswer: '{2, 3, 5, 7}' },
      { id: 'q5', questionText: 'counts.get("pear", 0) returns 0 when "pear" is absent because:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'del removes it', isCorrect: false }, { id: 'b', text: '.get returns a default', isCorrect: true }, { id: 'c', text: 'sets deduplicate', isCorrect: false }, { id: 'd', text: 'loops skip it', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P2.2 — Word Frequency Counter',
    description: 'Given a list of words, build a frequency dictionary counting occurrences, then print words appearing more than twice. Good: correct counts, correct filter, clean output; rubric: 6 count, 4 filter, 6 output, 6 explanation = 20.',
    dueDate: '2026-07-13T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'q1', type: 'theory', title: 'With words = ["cat","dog","cat","bird","cat","dog","fish"], write a loop using .get() to build a counts dict, then print every word with count > 2.', marks: 12 },
      { id: 'q2', type: 'subjective', title: 'Why is a set the natural tool for collecting unique user IDs?', marks: 8 },
    ],
  },
})

lessons.push({
  title: 'P2.3 — List Comprehensions',
  duration: 8,
  content: `# P2.3 — List Comprehensions

A list comprehension builds a new list in one expression — a compact loop over an iterable.

## Learning Objectives
- Write a basic list comprehension that transforms each element.
- Add a condition to filter elements inside a comprehension.
- Read a comprehension as an equivalent for-loop.

## Introduction
List comprehensions are Pythonic shorthand. They are not a new feature — just a concise way to build a list that a for-loop would also build, often more readably for simple transformations.

## Basic Form: transform each item
squares = [x ** 2 for x in range(1, 5)]
print(squares)   # [1, 4, 9, 16]

## With a Condition: filter
evens = [x for x in range(10) if x % 2 == 0]
print(evens)     # [0, 2, 4, 6, 8]

## Equivalent For-Loop
squares = []
for x in range(1, 5):
    squares.append(x ** 2)
# same result: [1, 4, 9, 16]

## Worked Example — Uppercase Names
names = ["ada", "bob", "carol"]
upper = [n.upper() for n in names]
long_names = [n for n in names if len(n) > 3]
print(upper)       # ['ADA', 'BOB', 'CAROL']
print(long_names)  # ['carol']

## Practical Exercise
Run this:
nums = [1, 2, 3, 4, 5]
doubled = [x * 2 for x in nums if x > 2]
print(doubled)
Tasks: (1) what prints; (2) write the equivalent for-loop and confirm it gives the same list. Check: [6, 8, 10]; the loop appends x*2 for x in 1..5 if x > 2.
Expected scaffold lines (copy exactly):
    nums = [1, 2, 3, 4, 5]
    doubled = [x * 2 for x in nums if x > 2]
    print(doubled)

## Key Takeaways
- Pattern: [expression for item in iterable if condition].
- The condition is optional; if omitted, every item is included.
- A comprehension is sugar for a loop with append — use it for simple transforms.
- Keep comprehensions short (one line) — if it gets complex, use a regular loop.

## Quiz Answer Key
1. (b) [x for x in nums if x > 2] — the if keeps only items where the condition is True.
2. (a) range(1,5) is 1,2,3,4; squared is [1,4,9,16].
3. False — the condition is optional but the for clause is required.
4. (c) list comprehensions build a new list from an existing iterable.
5. (a) [6, 8, 10] — doubles of 3, 4, 5 (the x > 2 survivors).
`,
  quiz: {
    title: 'Quiz P2.3 — List Comprehensions',
    description: '5 auto-gradable questions on the comprehension syntax and filtering.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'What does [x for x in nums if x > 2] keep?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'All x', isCorrect: false }, { id: 'b', text: 'Only x greater than 2', isCorrect: true }, { id: 'c', text: 'Only x less than 2', isCorrect: false }, { id: 'd', text: 'None', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: '[x**2 for x in range(1,5)] is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '[1, 4, 9, 16]', isCorrect: true }, { id: 'b', text: '[0, 1, 4, 9]', isCorrect: false }, { id: 'c', text: '[2, 3, 4, 5]', isCorrect: false }, { id: 'd', text: '[1, 2, 3, 4]', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: [expr for x in items] requires both a transform and a filter.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: A list comprehension is a compact way to build a ______.', questionType: 'fill_blank', correctAnswer: 'list' },
            { id: 'q5', questionText: '[x * 2 for x in [1,2,3,4,5] if x > 2] evaluates to:', questionType: 'multiple_choice', options: [{ id: 'a', text: '[6, 8, 10]', isCorrect: true }, { id: 'b', text: '[2, 4, 6]', isCorrect: false }, { id: 'c', text: '[6, 8]', isCorrect: false }, { id: 'd', text: '[4, 6]', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment P2.3 — Comprehension Practice',
    description: 'Given a list of temperatures in Celsius, build a list of only the freezing ones (<0), and a list of Fahrenheit conversions. Good: correct filter, correct conversion, clean output; rubric: 6 filter, 6 conversion, 4 output, 4 explanation = 20.',
    dueDate: '2026-07-14T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'q1', type: 'theory', title: 'With celsius = [-5, 12, 0, -3, 20, -1], write two comprehensions: (1) freezing = [...], (2) fahrenheit = [c*9/5+32 ...]; show both outputs.', marks: 12 },
      { id: 'q2', type: 'subjective', title: 'When would you prefer a plain for-loop with append over a list comprehension — one reason?', marks: 8 },
    ],
  },
})

lessons.push({
  title: 'P2.4 — Tuples & Nested Data',
  duration: 8,
  content: `# P2.4 — Tuples & Nested Data

A tuple is an ordered, immutable sequence; a nested structure puts lists/dicts inside each other.

## Learning Objectives
- Create tuples and unpack them into separate variables.
- Distinguish tuples (immutable) from lists (mutable).
- Traverse a list of dictionaries (the most common nested shape in data).

## Introduction
Tuples group related values together and signal "these belong together." Because they are immutable, they are safe as dictionary keys and signal intent: this should not change. Nested structures — a list of dicts, or a dict of lists — are how you model real records.

## Tuples
point = (3, 5)
x, y = point        # unpacking
point[0]            # 3
# point[0] = 4       # TypeError: tuples cannot be changed

## Tuples vs Lists
t = (1, 2, 3)   # parentheses, immutable
l = [1, 2, 3]   # brackets, mutable

## Nested Data — List of Dictionaries
students = [
    {"name": "ada", "score": 82},
    {"name": "bob", "score": 91},
]
for s in students:
    print(s["name"], s["score"])
# ada 82
# bob 91

## Indexing Into Nested Structures
students[0]["score"]   # 82
students[1]["name"]    # 'bob'

## Worked Example — Student Pass List
students = [{"name": "ada", "score": 55}, {"name": "bob", "score": 75}]
passed = []
for s in students:
    if s["score"] >= 60:
        passed.append(s["name"])
print(passed)   # ['bob']

## Practical Exercise
Run this:
coords = [(10, 20), (30, 40)]
for x, y in coords:
    print(x + y)
Tasks: (1) what prints; (2) change coords to [(10,20),(30,40),(0,0)] and rerun. Check: 30 then 70; adding (0,0) prints 0 as well.
Expected scaffold lines (copy exactly):
    coords = [(10, 20), (30, 40)]
    for x, y in coords:
        print(x + y)

## Key Takeaways
- Tuples use parentheses and are immutable; lists use brackets and are mutable.
- Unpacking (a, b = pair) assigns each element of a tuple to a variable.
- A list of dictionaries is the standard nested shape for tabular records.
- Index chains like data[0]["key"] reach into nested structures from the outside in.

## Quiz Answer Key
1. (a) Tuples are immutable sequences; that is their defining difference from lists.
2. (b) x, y = point unpacks the tuple into two variables.
3. False — tuples cannot be changed; t[0] = 4 raises TypeError.
4. (a) for s in students iterates each dict; s["name"] reads the name field.
5. (b) coords[0] is (10, 20); coords[0][0] is 10.
`,
  quiz: {
    title: 'Quiz P2.4 — Tuples & Nested Data',
    description: '5 auto-gradable questions on tuples, unpacking, and nested lists/dicts.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'A tuple is best described as:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'An immutable ordered sequence', isCorrect: true }, { id: 'b', text: 'A mutable unordered collection', isCorrect: false }, { id: 'c', text: 'A mapping of keys to values', isCorrect: false }, { id: 'd', text: 'A function', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q2', questionText: 'If point = (3, 5), what does x, y = point assign?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'x=3, y=5', isCorrect: true }, { id: 'b', text: 'x=5, y=3', isCorrect: false }, { id: 'c', text: 'x=(3,5), y=()', isCorrect: false }, { id: 'd', text: 'error', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: You can reassign an element of a tuple, e.g. t[0] = 4.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'For students = [{"name":"ada"},{"name":"bob"}], students[1]["name"] returns:', questionType: 'fill_blank', correctAnswer: 'bob' },
      { id: 'q5', questionText: 'coords = [(10,20),(30,40)]. coords[0] is:', questionType: 'multiple_choice', options: [{ id: 'a', text: '10', isCorrect: false }, { id: 'b', text: '(10,20)', isCorrect: true }, { id: 'c', text: '30', isCorrect: false }, { id: 'd', text: '[10,20]', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P2.4 — Nested Records',
    description: 'Given a list of product dicts, filter to those with price > 100 and collect their names. Good: correct filter, correct name extraction, correct list; rubric: 6 filter, 6 extraction, 6 list, 2 clarity = 20.',
    dueDate: '2026-07-14T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'q1', type: 'theory', title: 'With products list, write a loop that collects names of items over 100 into an "expensive" list, then print it.', marks: 12 },
      { id: 'q2', type: 'subjective', title: 'Why might you choose a tuple instead of a list for a fixed pair like a coordinate?', marks: 8 },
    ],
  },
})

lessons.push({
  title: 'P2.5 — Nested Data Structures',
  duration: 10,
  content: `# P2.5 — Nested Data Structures

Real data is nested: lists inside dicts, dicts inside lists. Reach in layer by layer.

## Learning Objectives
- Build and read a dict-of-lists and a list-of-dicts-of-dicts.
- Iterate nested structures with chained loops.
- Index into nested data correctly without a KeyError.

## Introduction
A single flat list works for one attribute. When each item has multiple attributes (a student has a name AND a score AND a grade), you nest. Group multiple values per key with a dictionary of lists. Model records with a list of dictionaries.

## Dict of Lists — group by key
scores = {}
scores["ada"] = [82, 90, 75]
scores["bob"] = [91, 88]
print(scores["ada"])        # [82, 90, 75]
len(scores["ada"])          # 3

## List of Dicts — records
students = [
    {"name": "ada", "grades": {"math": 82, "eng": 90}},
    {"name": "bob", "grades": {"math": 91, "eng": 88}},
]
students[0]["grades"]["math"]   # 82

## Chained Loops
for s in students:
    for subject, grade in s["grades"].items():
        print(s["name"], subject, grade)

## Worked Example — Average per Student
scores = {"ada": [82, 90, 75], "bob": [91, 88]}
for name, grade_list in scores.items():
    average = sum(grade_list) / len(grade_list)
    print(name, average)
# ada 82.33...
# bob 89.5

## Practical Exercise
Run this:
data = {"x": [1, 2], "y": [3, 4, 5]}
total = 0
for key in data:
    for n in data[key]:
        total = total + n
print(total)
Tasks: (1) what prints; (2) add print(len(data[key])) inside the outer loop. Check: 15; second part prints 2 then 3.
Expected scaffold lines (copy exactly):
    data = {"x": [1, 2], "y": [3, 4, 5]}
    total = 0
    for key in data:
        for n in data[key]:
            total = total + n
    print(total)

## Key Takeaways
- Reach into nesting layer by layer: data[key1][key2].
- Dict-of-lists groups multiple values per key; list-of-dicts models records.
- Chained for-loops walk every level of a nested structure.
- Always check what level you are on before indexing.

## Quiz Answer Key
1. (b) data["y"][2] is 5.
2. (b) sum/len gives the average.
3. False — it has two keys.
4. (b) data[key] is the list; len gives its width.
5. (b) 15 — every number across all lists.
`,
  quiz: {
    title: 'Quiz P2.5 — Nested Data Structures',
    description: '5 auto-gradable questions on nested dicts/lists and chained loops.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'If data = {"x":[1,2], "y":[3,4,5]}, what is data["y"][2]?', questionType: 'multiple_choice', options: [{ id: 'a', text: '3', isCorrect: false }, { id: 'b', text: '5', isCorrect: true }, { id: 'c', text: '4', isCorrect: false }, { id: 'd', text: '2', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'For grades={"ada":[82,90,75]}, sum(grades["ada"])/len(grades["ada"]) computes:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Max', isCorrect: false }, { id: 'b', text: 'Average', isCorrect: true }, { id: 'c', text: 'Count', isCorrect: false }, { id: 'd', text: 'Sum', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: data = {"x":[1,2],"y":[3,4,5]} has five elements total.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'In the double loop, data[key] is:', questionType: 'fill_blank', correctAnswer: 'list' },
      { id: 'q5', questionText: 'Total of data = {"x":[1,2],"y":[3,4,5]}:', questionType: 'multiple_choice', options: [{ id: 'a', text: '9', isCorrect: false }, { id: 'b', text: '15', isCorrect: true }, { id: 'c', text: '10', isCorrect: false }, { id: 'd', text: '12', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P2.5 — Nested Data Project',
    description: 'A school stores scores as a dict-of-lists (name -> list of scores). Compute each average, find the highest, and build a list of students above 80. Good: correct averages, max, filter; rubric: 6 avgs, 4 max, 6 filter, 4 clarity = 20.',
    dueDate: '2026-07-15T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'With scores = {"ada":[82,90,75],"bob":[91,88],"carol":[60,70]}, compute each average, the highest, and students above 80.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is a dict-of-lists better than a list-of-lists for student scores?', marks: 8 }],
  },
})

export const module02: ModuleData = {
  title: 'Module 2 — Collections & Data Structures',
  lessons,
}
