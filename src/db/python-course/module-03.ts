// ─── Python Course — Module 3: Files, Modules & Environments ─────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'P3.1 — Reading & Writing Text Files',
  duration: 8,
  content: `# P3.1 — Reading & Writing Text Files

Files live on disk; open() connects your program to a file. The \`with\` statement closes it automatically.

## Learning Objectives
- Open a file for reading and write its contents to a list of lines.
- Open a file for writing and save new text, overwriting safely.
- Use \`with\` to guarantee the file is closed even if an error occurs.

## Introduction
So far your data lived in the program. Real data lives in files. Python's open() returns a file object; you read or write through it; then you close it. The with statement is the safe way — it closes the file for you.

## Opening for Reading
with open("notes.txt", "r") as f:
    text = f.read()         # entire file as one string
with open("notes.txt", "r") as f:
    lines = f.readlines()   # list of lines, each ending with \\n

## Opening for Writing
with open("out.txt", "w") as f:
    f.write("hello")
    f.write("\\nworld")     # no auto-newline; you add it

## Worked Example — Save a Summary
scores = {"ada": 82, "bob": 91}
with open("summary.txt", "w") as f:
    for name, score in scores.items():
        f.write(f"{name},{score}\\n")
with open("summary.txt", "r") as f:
    print(f.read())
# ada,82
# bob,91

## Practical Exercise
Create a file "todo.txt" with three tasks, then read it back and print each line with line numbers. Run this:
with open("todo.txt", "w") as f:
    f.write("buy milk\\nwalk dog\\nread book\\n")
with open("todo.txt", "r") as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    print(i, line.strip())
Tasks: (1) what prints; (2) why we call .strip() on line. Check: 0 buy milk / 1 walk dog / 2 read book; strip removes the trailing newline.
Expected scaffold lines (copy exactly):
    with open("todo.txt", "w") as f:
        f.write("buy milk\\nwalk dog\\nread book\\n")
    with open("todo.txt", "r") as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        print(i, line.strip())

## Key Takeaways
- open(path, "r") reads; open(path, "w") writes (and truncates the file).
- read() returns the whole file as a string; readlines() returns a list of lines.
- with guarantees the file is closed, even if an error happens inside.
- f.write does not add newlines; you must add \\n yourself.

## Quiz Answer Key
1. (b) with open(...) as f: guarantees the file is closed after the block.
2. (c) f.readlines() returns a list where each element is one line.
3. False — f.write does not add a newline; you must add one.
4. (a) "w" mode truncates the existing file to zero length before writing.
5. (b) .strip() removes the trailing newline so numbers stay aligned.
`,
  quiz: {
    title: 'Quiz P3.1 — Reading & Writing Text Files',
    description: '5 auto-gradable questions on open, with, read, and write.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'What does "with open(...) as f:" guarantee?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Opens in binary mode', isCorrect: false }, { id: 'b', text: 'Closes the file automatically', isCorrect: true }, { id: 'c', text: 'Reads the whole file', isCorrect: false }, { id: 'd', text: 'Creates a new file', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'f.readlines() returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A single string', isCorrect: false }, { id: 'b', text: 'A list of lines', isCorrect: true }, { id: 'c', text: 'A dictionary', isCorrect: false }, { id: 'd', text: 'An integer', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: f.write("hello") automatically adds a newline after "hello".', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: open(path, "w") opens the file for ______, truncating any existing content.', questionType: 'fill_blank', correctAnswer: 'writing' },
      { id: 'q5', questionText: 'Why call line.strip() after readlines():', questionType: 'multiple_choice', options: [{ id: 'a', text: 'To sort the lines', isCorrect: false }, { id: 'b', text: 'To remove trailing newlines', isCorrect: true }, { id: 'c', text: 'To convert to uppercase', isCorrect: false }, { id: 'd', text: 'To delete the line', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P3.1 — File I/O',
    description: 'Write a program that writes a list of student-score pairs to a file, then reads it back and prints only those who scored above 70. Good: correct write format, correct read-back, correct filter; rubric: 6 format, 5 write, 5 read, 4 filter = 20.',
    dueDate: '2026-07-16T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write scores = {"ada":78,"bob":65,"carol":92,"dave":50}. Save each name,score pair on its own line, then read the file back and print names with score > 70.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is with open(...) preferred over f = open(...) without with?', marks: 8 }],
  },
}
)


lessons.push({
  title: 'P3.2 — CSV & JSON Data',
  duration: 10,
  content: `# P3.2 — CSV & JSON Data

CSV stores tabular rows as comma-separated text; JSON stores structured objects. Both are standard exchange formats.

## Learning Objectives
- Read and write CSV rows with the csv module.
- Convert between Python objects and JSON with json.load/dump.
- Choose CSV vs JSON for a given data shape.

## Introduction
Data you download is usually CSV (one record per line) or JSON (nested objects). Python ships with csv and json modules in the standard library, so no installs are needed.

## CSV
import csv
with open("scores.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "score"])
    writer.writerow(["ada", 82])
    writer.writerow(["bob", 91])

with open("scores.csv", "r") as f:
    for row in csv.reader(f):
        print(row)
# ['name', 'score']
# ['ada', '82']
# ['bob', '91']

## JSON
import json
person = {"name": "ada", "scores": [82, 91], "active": True}
text = json.dumps(person)      # object -> string
again = json.loads(text)       # string -> object
print(again["scores"][0])      # 82

# file-based
with open("person.json", "w") as f:
    json.dump(person, f)
with open("person.json", "r") as f:
    loaded = json.load(f)
print(loaded["name"])          # ada

## Worked Example — Save and Load Records
records = [{"name": "ada", "score": 82}, {"name": "bob", "score": 91}]
with open("records.json", "w") as f:
    json.dump(records, f, indent=2)
with open("records.json", "r") as f:
    saved = json.load(f)
print(saved[1]["name"])        # bob

## Practical Exercise
Run this:
import json
data = {"city": "lagos", "temp": 31, "raining": False}
text = json.dumps(data)
print(text)
back = json.loads(text)
print(back["temp"])
Tasks: (1) what prints; (2) dump data to a file and load it back, then print the loaded city. Check: text is a JSON string with double quotes; back["temp"] is 31.
Expected scaffold lines (copy exactly):
    import json
    data = {"city": "lagos", "temp": 31, "raining": False}
    text = json.dumps(data)
    print(text)
    back = json.loads(text)
    print(back["temp"])

## Key Takeaways
- csv.writer writes rows; csv.reader yields each row as a list of strings.
- json.dumps/loads convert between objects and strings; json.dump/load use files.
- JSON keys are always strings; True becomes true, None becomes null.
- CSV suits flat tabular data; JSON suits nested or hierarchical data.

## Quiz Answer Key
1. (b) json.dumps converts a Python object into a JSON-formatted string.
2. (a) csv.reader yields each row as a list of strings (numbers included).
3. False — JSON represents booleans as true/false (lowercase).
4. (c) json.dump(obj, file) writes the object into an open file object.
5. (a) CSV — one record per row suits flat tabular data.
`,
  quiz: {
    title: 'Quiz P3.2 — CSV & JSON Data',
    description: '5 auto-gradable questions on the csv and json standard-library modules.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'What does json.dumps(person) do?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Reads a JSON file', isCorrect: false }, { id: 'b', text: 'Converts a Python object to a JSON string', isCorrect: true }, { id: 'c', text: 'Deletes a key', isCorrect: false }, { id: 'd', text: 'Formats CSV', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'csv.reader(f) yields each row as:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A list of strings', isCorrect: true }, { id: 'b', text: 'A dictionary', isCorrect: false }, { id: 'c', text: 'A single string', isCorrect: false }, { id: 'd', text: 'An integer', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: JSON represents Python True as the string "True".', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: To write a Python object into an open file, use json.______(obj, f).', questionType: 'fill_blank', correctAnswer: 'dump' },
      { id: 'q5', questionText: 'Which format is better for a flat table of rows?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'CSV', isCorrect: true }, { id: 'b', text: 'JSON', isCorrect: false }, { id: 'c', text: 'TXT', isCorrect: false }, { id: 'd', text: 'XML', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment P3.2 — Data Exchange',
    description: 'Save a list of product records to JSON, load it back, and print total inventory value. Good: valid JSON output, correct load-back, correct sum; rubric: 6 dump, 4 load, 6 sum, 4 explanation = 20.',
    dueDate: '2026-07-17T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'With products = [{"name":"pen","price":12,"qty":100},{"name":"bag","price":150,"qty":5}], dump to products.json, load it back, and print sum(price*qty).', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Give one reason to choose JSON over CSV when sharing data.', marks: 8 }],
  },
})

lessons.push({
  title: 'P3.3 — Modules, Packages & Imports',
  duration: 8,
  content: `# P3.3 — Modules, Packages & Imports

A module is a .py file; a package is a folder of modules. import brings code from elsewhere into your program.

## Learning Objectives
- Import a standard-library module and call its functions.
- Write your own module and import it from another file.
- Explain what pip installs and what __name__ == "__main__" does.

## Introduction
Python's power is its ecosystem. import math gives you sqrt; import json gives you data formats; import of your own file lets you split a big program into reusable pieces.

## Standard Library Imports
import math
math.sqrt(16)        # 4.0
math.pi              # 3.14159...

from math import sqrt
sqrt(25)             # 5.0  (no math. prefix)

import random
random.randint(1, 6)  # a number from 1 to 6

## Your Own Module
# file: mytools.py
def shout(text):
    return text.upper() + "!"

# file: main.py
import mytools
print(mytools.shout("hello"))   # HELLO!

## __name__ == "__main__"
Code under this guard runs only when the file is executed directly, not when imported.

## Worked Example — Using random and math
import random, math
rolls = [random.randint(1, 6) for _ in range(5)]
print(rolls)
print("average:", sum(rolls) / len(rolls))
print("sqrt of average:", math.sqrt(sum(rolls) / len(rolls)))

## Practical Exercise
Run this:
import math
radii = [1, 2, 3]
areas = [math.pi * r ** 2 for r in radii]
print(areas)
Tasks: (1) what prints; (2) round each area to 2 decimals using round(area, 2) in a comprehension. Check: [3.14..., 12.56..., 28.27...]; rounded gives [3.14, 12.57, 28.27].
Expected scaffold lines (copy exactly):
    import math
    radii = [1, 2, 3]
    areas = [math.pi * r ** 2 for r in radii]
    print(areas)

## Key Takeaways
- import module gives you module.function; from module import name skips the prefix.
- A .py file you write is itself a module; import it by filename (no .py).
- pip install downloads third-party packages from PyPI into your environment.
- if __name__ == "__main__": runs code only when the file is the entry point.

## Quiz Answer Key
1. (b) import math then math.sqrt(16) returns 4.0.
2. (a) from math import sqrt lets you call sqrt(25) without the prefix.
3. False — pip installs packages from PyPI into the current environment.
4. (b) __name__ == "__main__" guards code that should run only on direct execution.
5. (c) mytools.shout("hello") returns HELLO!.
`,
  quiz: {
    title: 'Quiz P3.3 — Modules & Imports',
    description: '5 auto-gradable questions on imports, the standard library, and pip.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'import math; math.sqrt(16) returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: '4', isCorrect: false }, { id: 'b', text: '4.0', isCorrect: true }, { id: 'c', text: '16', isCorrect: false }, { id: 'd', text: 'error', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Which import style lets you write sqrt(25) directly?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'from math import sqrt', isCorrect: true }, { id: 'b', text: 'import math', isCorrect: false }, { id: 'c', text: 'import sqrt', isCorrect: false }, { id: 'd', text: 'pip install sqrt', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: pip install downloads packages from PyPI.', questionType: 'true_false', correctAnswer: 'true' },
      { id: 'q4', questionText: 'Fill in the blank: if ______ == "__main__": guards code that runs only on direct execution.', questionType: 'fill_blank', correctAnswer: '__name__' },
      { id: 'q5', questionText: 'mytools.py defines shout(text). In main.py you call:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'shout(text)', isCorrect: false }, { id: 'b', text: 'import.mytools', isCorrect: false }, { id: 'c', text: 'mytools.shout(text)', isCorrect: true }, { id: 'd', text: 'shout.mytools(text)', isCorrect: false }], correctAnswer: 'c' },
    ],
  },
  assignment: {
    title: 'Assignment P3.3 — Build a Module',
    description: 'Create mytools.py with two functions (shout, whisper), import it from main.py, and call both. Good: clean module, correct import, both calls work; rubric: 6 module, 4 import, 6 calls, 4 explanation = 20.',
    dueDate: '2026-07-18T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write mytools.py with shout(text) (uppercases and adds !) and whisper(text) (lowercases), then main.py that imports and calls both.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why split code into modules instead of one big file?', marks: 8 }],
  },
})

lessons.push({
  title: 'P3.4 — Virtual Environments & pip',
  duration: 8,
  content: `# P3.4 — Virtual Environments & pip

A virtual environment is an isolated Python setup per project. pip installs packages into it.

## Learning Objectives
- Create and activate a virtual environment.
- Install a package with pip and verify the import.
- Freeze and re-create a project's dependencies.

## Introduction
Different projects need different package versions. A virtual environment gives each project its own packages, so upgrading one project never breaks another.

## Creating an Environment
python -m venv .venv
# activate
# Windows:  .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate

## Installing Packages
pip install requests
pip list            # what is installed
python -c "import requests; print(requests.__version__)"

## Requirements File
pip freeze > requirements.txt
# recreate later:
pip install -r requirements.txt

## Worked Example — Install and Verify
# in an activated venv:
# pip install numpy
# python -c "import numpy; print(numpy.array([1,2,3]).sum())"
# -> 6

## Practical Exercise
Run these steps in a terminal:
python -m venv .venv
.venv\\Scripts\\activate      # or source .venv/bin/activate
pip install numpy
python -c "import numpy as np; print(np.arange(5).sum())"
Tasks: (1) what the last line prints; (2) run pip freeze and note the numpy line. Check: 10 (0+1+2+3+4); pip freeze shows something like numpy==2.1.0.
Expected scaffold lines (copy exactly):
    python -m venv .venv
    .venv\\Scripts\\activate
    pip install numpy
    python -c "import numpy as np; print(np.arange(5).sum())"

## Key Takeaways
- python -m venv .venv creates an isolated environment in your project.
- Activate before installing so packages land in the right place.
- pip install name fetches from PyPI; pip freeze captures your exact versions.
- requirements.txt lets anyone rebuild your exact environment.

## Quiz Answer Key
1. (b) python -m venv .venv creates the environment folder.
2. (a) pip install requests downloads it from PyPI into the active environment.
3. False — you must activate the venv (or use its pip explicitly) first.
4. (c) pip freeze > requirements.txt captures installed versions.
5. (b) np.arange(5).sum() is 0+1+2+3+4 = 10.
`,
  quiz: {
    title: 'Quiz P3.4 — Virtual Environments & pip',
    description: '5 auto-gradable questions on venv, pip, and requirements.txt.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Which command creates a virtual environment named .venv?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'pip create .venv', isCorrect: false }, { id: 'b', text: 'python -m venv .venv', isCorrect: true }, { id: 'c', text: 'venv make .venv', isCorrect: false }, { id: 'd', text: 'python new env', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'pip install requests does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Installs the requests package from PyPI', isCorrect: true }, { id: 'b', text: 'Deletes requests', isCorrect: false }, { id: 'c', text: 'Lists packages', isCorrect: false }, { id: 'd', text: 'Creates a venv', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: You can install into a venv without activating it.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: pip ______ > requirements.txt saves your installed versions.', questionType: 'fill_blank', correctAnswer: 'freeze' },
      { id: 'q5', questionText: 'np.arange(5).sum() equals:', questionType: 'multiple_choice', options: [{ id: 'a', text: '4', isCorrect: false }, { id: 'b', text: '10', isCorrect: true }, { id: 'c', text: '5', isCorrect: false }, { id: 'd', text: '15', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P3.4 — Environment Setup',
    description: 'Create a venv, install a package, freeze requirements, and document each step. Good: correct commands in order, freeze output shown, clear explanation; rubric: 6 venv, 4 install, 5 freeze, 5 explanation = 20.',
    dueDate: '2026-07-19T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'List, in order, the shell commands to: create a venv, activate it, install pandas, and save requirements.txt. Then state one benefit of this workflow.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why not install every package globally instead?', marks: 8 }],
  },
})

lessons.push({
  title: 'P3.5 — Organizing a Reusable Script',
  duration: 8,
  content: `# P3.5 — Organizing a Reusable Script

A good script separates setup, logic, and output. Functions make it testable; __main__ makes it importable.

## Learning Objectives
- Wrap script logic in functions instead of top-level code.
- Use if __name__ == "__main__": as the entry point.
- Add a simple docstring and constants at the top.

## Introduction
Scripts grow. When they do, top-level code becomes hard to test and reuse. Structure fixes this: constants at the top, logic in functions, a main() entry point.

## Anatomy of a Clean Script
"""Sum scores from a file and print the average."""

DEFAULT_PATH = "scores.txt"   # constant

def read_scores(path):
    scores = {}
    with open(path) as f:
        for line in f:
            name, score = line.strip().split(",")
            scores[name] = int(score)
    return scores

def average(scores):
    return sum(scores.values()) / len(scores)

def main():
    scores = read_scores(DEFAULT_PATH)
    print("average:", average(scores))

if __name__ == "__main__":
    main()

## Why This Structure
- read_scores and average can be imported and tested on their own.
- main() runs only when executed directly.
- The docstring explains the purpose in one line.

## Worked Example — Refactor Inline to Functions
# before
nums = [1, 2, 3, 4]
print(sum(nums) / len(nums))

# after
def mean(nums):
    return sum(nums) / len(nums)
print(mean([1, 2, 3, 4]))   # 2.5

## Practical Exercise
Run this:
def describe(scores):
    return {"n": len(scores), "avg": sum(scores) / len(scores)}

data = [82, 91, 77]
print(describe(data))
Tasks: (1) what prints; (2) add a "max" key to the returned dict showing max(scores). Check: {'n': 3, 'avg': 83.33...}; with max the dict adds 'max': 91.
Expected scaffold lines (copy exactly):
    def describe(scores):
        return {"n": len(scores), "avg": sum(scores) / len(scores)}
    data = [82, 91, 77]
    print(describe(data))

## Key Takeaways
- Constants, functions, then main() — that order keeps scripts readable.
- if __name__ == "__main__": separates execution from import.
- Docstrings and named functions make code self-documenting.
- Small pure functions are easy to test and reuse.

## Quiz Answer Key
1. (b) main() is called under the __main__ guard when the script runs directly.
2. (a) DEFAULT_PATH is a constant — fixed value at the top of the file.
3. False — importing a module runs its top-level code but not the __main__ guard.
4. (c) mean([1,2,3,4]) returns 2.5.
5. (b) The dict has n=3 and avg=83.33.
`,
  quiz: {
    title: 'Quiz P3.5 — Reusable Scripts',
    description: '5 auto-gradable questions on script structure and __main__.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'Where should script entry logic go?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Top of the file', isCorrect: false }, { id: 'b', text: 'In main() under the __main__ guard', isCorrect: true }, { id: 'c', text: 'Inside every function', isCorrect: false }, { id: 'd', text: 'In a docstring', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'DEFAULT_PATH = "scores.txt" is an example of:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A constant', isCorrect: true }, { id: 'b', text: 'A function', isCorrect: false }, { id: 'c', text: 'A module', isCorrect: false }, { id: 'd', text: 'A loop', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Importing a module runs the code inside its __main__ guard.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: A ______ is a one-line explanation of what a module does, in triple quotes.', questionType: 'fill_blank', correctAnswer: 'docstring' },
      { id: 'q5', questionText: 'describe([82,91,77]) returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: '{n:3, avg:83.33}', isCorrect: true }, { id: 'b', text: '83.33', isCorrect: false }, { id: 'c', text: '[82,91,77]', isCorrect: false }, { id: 'd', text: '3', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment P3.5 — Script Refactor',
    description: 'Refactor a flat score-summing script into functions (read, compute, report) with a main() entry point. Good: three clean functions, __main__ guard, docstring; rubric: 6 functions, 4 main, 4 docstring, 6 correctness = 20.',
    dueDate: '2026-07-20T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write a structured script with read_scores(path), report(scores), and main() under a __main__ guard, plus a module docstring.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'How does the __main__ guard make a script both runnable and importable?', marks: 8 }],
  },
})

export const module03: ModuleData = {
  title: 'Module 3 — Files, Modules & Environments',
  lessons,
}
