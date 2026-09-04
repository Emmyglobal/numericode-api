// ─── Python Course — Module 4: Data with NumPy & Pandas ─────────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'P4.1 — NumPy Arrays',
  duration: 10,
  content: `# P4.1 — NumPy Arrays

A NumPy array is a grid of numbers with fast, vectorized math — no loops needed.

## Learning Objectives
- Create arrays from lists and with arange/ones/zeros.
- Apply element-wise math without writing loops.
- Index and slice arrays; compute basic statistics.

## Introduction
Python lists are flexible but slow for numeric work. NumPy arrays store numbers contiguously and apply operations to every element at once — this is vectorization, and it is why NumPy underpins pandas and scikit-learn.

## Creating Arrays
import numpy as np
a = np.array([1, 2, 3, 4])
b = np.arange(5)        # [0 1 2 3 4]
c = np.ones(3)          # [1. 1. 1.]
d = np.zeros(3)         # [0. 0. 0.]

## Vectorized Math
a * 2           # array([2, 4, 6, 8])
a + 10          # array([11, 12, 13, 14])
a ** 2          # array([ 1,  4,  9, 16])

## Statistics
a.sum()      # 10
a.mean()     # 2.5
a.max()      # 4
a.min()      # 1
a.std()      # standard deviation

## Indexing and Slicing
a[0]     # 1
a[-1]    # 4
a[1:3]   # array([2, 3])
a[a > 2] # array([3, 4])  boolean masking

## Worked Example — Normalize Scores
scores = np.array([82, 91, 77, 65])
normalized = (scores - scores.min()) / (scores.max() - scores.min())
print(normalized)   # [0.647 1. 0.461 0.]

## Practical Exercise
Run this:
import numpy as np
x = np.arange(1, 6)
print(x)
print(x ** 2)
print(x.mean())
Tasks: (1) what each line prints; (2) compute x[x > 3]. Check: [1 2 3 4 5]; [1 4 9 16 25]; 3.0; then [4 5].
Expected scaffold lines (copy exactly):
    import numpy as np
    x = np.arange(1, 6)
    print(x)
    print(x ** 2)
    print(x.mean())

## Key Takeaways
- np.array turns a list into an array; arange/ones/zeros build them directly.
- Math applies element-wise: a * 2 doubles every element — no loop.
- Arrays expose sum, mean, max, min, std as one-call methods.
- Boolean masks (a[a > 2]) filter arrays in one expression.

## Quiz Answer Key
1. (b) np.arange(5) produces [0 1 2 3 4] — like range, ending before 5.
2. (a) Vectorized math applies to every element without a loop.
3. False — a.mean() returns 2.5 for [1,2,3,4].
4. (c) a[a > 2] keeps [3, 4] — a boolean mask.
5. (b) (x ** 2) squares every element, giving [1 4 9 16 25].
`,
  quiz: {
    title: 'Quiz P4.1 — NumPy Arrays',
    description: '5 auto-gradable questions on array creation, vectorized math, and masking.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'np.arange(5) produces:', questionType: 'multiple_choice', options: [{ id: 'a', text: '[1 2 3 4 5]', isCorrect: false }, { id: 'b', text: '[0 1 2 3 4]', isCorrect: true }, { id: 'c', text: '[5 5 5 5 5]', isCorrect: false }, { id: 'd', text: 'error', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Vectorized math means:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Operations apply to every element without a loop', isCorrect: true }, { id: 'b', text: 'Only works on matrices', isCorrect: false }, { id: 'c', text: 'Requires a GPU', isCorrect: false }, { id: 'd', text: 'Slower than loops', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: np.array([1,2,3,4]).mean() returns 2.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: a[a > 2] is called ______ masking.', questionType: 'fill_blank', correctAnswer: 'boolean' },
      { id: 'q5', questionText: 'For x = np.arange(1,6), x ** 2 gives:', questionType: 'multiple_choice', options: [{ id: 'a', text: '[2 4 6 8 10]', isCorrect: false }, { id: 'b', text: '[1 4 9 16 25]', isCorrect: true }, { id: 'c', text: '[1 2 3 4 5]', isCorrect: false }, { id: 'd', text: '25', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P4.1 — Vectorized Stats',
    description: 'Given a NumPy array of exam scores, compute min, max, mean, and a boolean mask of scores above the mean. Good: correct vectorized stats, correct mask; rubric: 5 min, 5 max, 5 mean, 5 mask = 20.',
    dueDate: '2026-07-21T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'With scores = np.array([55, 82, 91, 77, 68, 95]), compute min, max, mean, and the array of scores above the mean. Show code and output.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why is vectorized NumPy math faster than a Python for-loop?', marks: 8 }],
  },
})

lessons.push({
  title: 'P4.2 — Pandas Basics',
  duration: 10,
  content: `# P4.2 — Pandas Basics

A DataFrame is a table with named columns. pandas loads, filters, and summarizes it in a few lines.

## Learning Objectives
- Build a DataFrame from a dict and read one from a CSV.
- Select columns and filter rows with boolean conditions.
- Group data and compute per-group summaries.

## Introduction
pandas is the spreadsheet of Python. A DataFrame holds rows and named columns; you select, filter, and aggregate with expressive one-liners that replace whole loops.

## Creating a DataFrame
import pandas as pd
data = {"name": ["ada", "bob", "carol"], "score": [82, 91, 77]}
df = pd.DataFrame(data)
print(df)
#     name  score
# 0    ada     82
# 1    bob     91
# 2  carol     77

## Selecting and Filtering
df["score"]            # one column (a Series)
df[["name", "score"]]  # two columns
df[df["score"] > 80]   # rows where score > 80

## Grouping
df.groupby("grade")["score"].mean()

## Worked Example — Pass List
df = pd.DataFrame({"name": ["a", "b", "c"], "score": [55, 75, 88]})
passed = df[df["score"] >= 60]["name"]
print(list(passed))   # ['b', 'c']

## Practical Exercise
Run this:
import pandas as pd
df = pd.DataFrame({"city": ["lagos", "abuja", "lagos"], "temp": [31, 28, 33]})
print(df[df["temp"] > 29])
print(df.groupby("city")["temp"].mean())
Tasks: (1) what each prints; (2) add a humidity column and filter on it. Check: first print shows the two rows with temp > 29; groupby shows lagos 32.0, abuja 28.0.
Expected scaffold lines (copy exactly):
    import pandas as pd
    df = pd.DataFrame({"city": ["lagos", "abuja", "lagos"], "temp": [31, 28, 33]})
    print(df[df["temp"] > 29])
    print(df.groupby("city")["temp"].mean())

## Key Takeaways
- pd.DataFrame(dict) builds a table; pd.read_csv loads one from disk.
- df["col"] selects a column; df[df["col"] > x] filters rows.
- groupby(key)[col].agg() computes per-group statistics in one line.
- Operations return new DataFrames; the original is unchanged unless you assign.

## Quiz Answer Key
1. (b) df[df["score"] > 80] keeps only rows meeting the condition.
2. (a) df["score"] returns a Series (a single column with an index).
3. False — filtering returns a new DataFrame; df itself is unchanged.
4. (c) groupby("city")["temp"].mean() gives per-city average temperature.
5. (b) pd.read_csv("file.csv") loads a CSV into a DataFrame.
`,
  quiz: {
    title: 'Quiz P4.2 — Pandas Basics',
    description: '5 auto-gradable questions on DataFrames, filtering, and groupby.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'df[df["score"] > 80] returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'All rows', isCorrect: false }, { id: 'b', text: 'Rows where score > 80', isCorrect: true }, { id: 'c', text: 'The score column', isCorrect: false }, { id: 'd', text: 'An error', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'df["score"] returns a:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Series', isCorrect: true }, { id: 'b', text: 'DataFrame', isCorrect: false }, { id: 'c', text: 'list', isCorrect: false }, { id: 'd', text: 'dict', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Filtering a DataFrame modifies the original in place.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: df.______("city")["temp"].mean() gives per-city averages.', questionType: 'fill_blank', correctAnswer: 'groupby' },
      { id: 'q5', questionText: 'To load a CSV into a DataFrame:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'pd.DataFrame(csv)', isCorrect: false }, { id: 'b', text: 'pd.read_csv(path)', isCorrect: true }, { id: 'c', text: 'pd.load(path)', isCorrect: false }, { id: 'd', text: 'pd.csv(path)', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P4.2 — DataFrame Analysis',
    description: 'Build a DataFrame of 5 students with name, subject, and score; filter to scores >= 80; compute the average per subject. Good: correct filter, correct groupby, clean output; rubric: 6 build, 5 filter, 5 groupby, 4 explanation = 20.',
    dueDate: '2026-07-22T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Create the DataFrame, show df[df["score"] >= 80], and compute df.groupby("subject")["score"].mean(). Show code and outputs.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When is groupby more convenient than manual loops?', marks: 8 }],
  },
})

lessons.push({
  title: 'P4.3 — Cleaning Data',
  duration: 10,
  content: `# P4.3 — Cleaning Data

Real data is messy: missing values, wrong types, duplicates. pandas cleans it in a few calls.

## Learning Objectives
- Detect missing values with isna() and count them per column.
- Fill or drop missing values deliberately.
- Remove duplicates and fix column dtypes.

## Introduction
Analysis is only as good as the data underneath. Cleaning is not optional — it is where most real data work happens. pandas gives you the tools: isna, fillna, dropna, drop_duplicates, astype.

## Detecting Missing Values
df.isna().sum()      # count of NaNs per column

## Handling Missing Values
df["age"] = df["age"].fillna(df["age"].mean())  # fill with mean
df = df.dropna(subset=["name"])                 # drop rows missing name

## Duplicates and Types
df = df.drop_duplicates()
df["score"] = df["score"].astype(int)

## Worked Example — Clean a Small Table
import pandas as pd
df = pd.DataFrame({
    "name": ["ada", "bob", None, "ada"],
    "score": [82, None, 77, 82],
})
print(df.isna().sum())          # name 1, score 1
df = df.dropna(subset=["name"])
df["score"] = df["score"].fillna(df["score"].mean())
df = df.drop_duplicates()
print(df)

## Practical Exercise
Run this:
import pandas as pd
df = pd.DataFrame({"v": [1.0, None, 3.0, None]})
print(df.isna().sum())
filled = df["v"].fillna(0)
print(filled.sum())
Tasks: (1) what each line prints; (2) fill with the mean instead of 0 and compare. Check: 2 NaNs; filled.sum() with 0 is 4.0; with the mean (2.0) it is 8.0.
Expected scaffold lines (copy exactly):
    import pandas as pd
    df = pd.DataFrame({"v": [1.0, None, 3.0, None]})
    print(df.isna().sum())
    filled = df["v"].fillna(0)
    print(filled.sum())

## Key Takeaways
- isna().sum() shows where data is missing, column by column.
- Choose fill (keep rows) or drop (lose rows) deliberately — document the choice.
- drop_duplicates removes repeated rows; astype fixes wrong dtypes.
- Always inspect with head() and info() before and after cleaning.

## Quiz Answer Key
1. (b) df.isna().sum() counts missing values per column.
2. (a) fillna(mean) keeps every row and replaces NaN with the column mean.
3. False — dropna removes rows (or columns) that contain NaN.
4. (c) astype(int) converts a column dtype to integer.
5. (b) drop_duplicates keeps the first occurrence and removes later repeats.
`,
  quiz: {
    title: 'Quiz P4.3 — Cleaning Data',
    description: '5 auto-gradable questions on missing values, duplicates, and dtypes.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'df.isna().sum() shows:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Row count', isCorrect: false }, { id: 'b', text: 'Missing values per column', isCorrect: true }, { id: 'c', text: 'Column names', isCorrect: false }, { id: 'd', text: 'Duplicates', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'df["age"].fillna(df["age"].mean()) does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Replaces NaN with the column mean', isCorrect: true }, { id: 'b', text: 'Drops NaN rows', isCorrect: false }, { id: 'c', text: 'Sorts by age', isCorrect: false }, { id: 'd', text: 'Nothing', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: dropna() fills missing values with zeros.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: df["score"].______(int) converts the column dtype to integer.', questionType: 'fill_blank', correctAnswer: 'astype' },
      { id: 'q5', questionText: 'df.drop_duplicates() removes:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'NaN values', isCorrect: false }, { id: 'b', text: 'Repeated rows', isCorrect: true }, { id: 'c', text: 'All columns', isCorrect: false }, { id: 'd', text: 'The index', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P4.3 — Clean a Dataset',
    description: 'Clean a small DataFrame: report missing counts, fill numeric gaps with the median, drop rows missing names, remove duplicates, and print the result. Good: correct counts, sensible fill, clean output; rubric: 5 detect, 5 fill, 5 drop, 5 output = 20.',
    dueDate: '2026-07-23T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Clean df = pd.DataFrame({"name":["a",None,"b","a"],"score":[80,None,90,80]}): report missing counts, fill score with the median, drop rows missing name, dedupe. Show each step and final df.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'When would you prefer dropna over fillna — one situation?', marks: 8 }],
  },
})

lessons.push({
  title: 'P4.4 — Combining & Summarizing Data',
  duration: 10,
  content: `# P4.4 — Combining & Summarizing Data

Data often lives in pieces. concat stacks tables; merge joins them on a key; describe summarizes a column.

## Learning Objectives
- Stack DataFrames vertically with pd.concat.
- Join two tables on a shared key with merge.
- Summarize a DataFrame with describe() and value_counts().

## Introduction
One file per month, one table per region — sooner or later you combine data. concat glues tables end to end; merge is the SQL-style join on a shared column.

## concat — Stack Rows
jan = pd.DataFrame({"day": [1, 2], "sales": [100, 150]})
feb = pd.DataFrame({"day": [1, 2], "sales": [120, 90]})
both = pd.concat([jan, feb], ignore_index=True)

## merge — Join on a Key
prices = pd.DataFrame({"item": ["pen", "bag"], "price": [12, 150]})
orders = pd.DataFrame({"item": ["pen", "pen", "bag"], "qty": [3, 2, 1]})
combined = orders.merge(prices, on="item")
combined["total"] = combined["qty"] * combined["price"]

## Summarizing
df.describe()          # count, mean, std, min, quartiles, max
df["city"].value_counts()   # frequency per category

## Worked Example — Sales Report
orders = pd.DataFrame({"item": ["pen", "bag"], "qty": [3, 1]})
prices = pd.DataFrame({"item": ["pen", "bag"], "price": [12, 150]})
report = orders.merge(prices, on="item")
report["total"] = report["qty"] * report["price"]
print(report)
print("grand total:", report["total"].sum())   # 186

## Practical Exercise
Run this:
import pandas as pd
a = pd.DataFrame({"k": ["x", "y"], "v": [1, 2]})
b = pd.DataFrame({"k": ["x", "y"], "w": [10, 20]})
m = a.merge(b, on="k")
print(m)
print(m["v"].sum() + m["w"].sum())
Tasks: (1) what each prints; (2) add row ("z", 3, 30) to both frames and recompute. Check: merged table with columns k, v, w; 33; adding z gives 66.
Expected scaffold lines (copy exactly):
    import pandas as pd
    a = pd.DataFrame({"k": ["x", "y"], "v": [1, 2]})
    b = pd.DataFrame({"k": ["x", "y"], "w": [10, 20]})
    m = a.merge(b, on="k")
    print(m)
    print(m["v"].sum() + m["w"].sum())

## Key Takeaways
- pd.concat([a, b]) stacks tables; ignore_index=True renumbers rows.
- merge(on="key") joins frames on a shared column, like SQL JOIN.
- describe() gives quick numeric summaries; value_counts() counts categories.
- Derived columns (like total) are just assignments to a new name.

## Quiz Answer Key
1. (b) merge joins two frames on a shared key column.
2. (a) pd.concat stacks rows; ignore_index=True renumbers them.
3. False — describe() summarizes numeric columns; value_counts counts categories.
4. (b) combined["total"] = qty * price creates a derived column.
5. (c) report["total"].sum() adds the per-row totals.
`,
  quiz: {
    title: 'Quiz P4.4 — Combining & Summarizing',
    description: '5 auto-gradable questions on concat, merge, and describe.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'orders.merge(prices, on="item") does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Stacks rows', isCorrect: false }, { id: 'b', text: 'Joins on the item key', isCorrect: true }, { id: 'c', text: 'Drops duplicates', isCorrect: false }, { id: 'd', text: 'Sorts', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'pd.concat([jan, feb], ignore_index=True) stacks frames:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Side by side', isCorrect: false }, { id: 'b', text: 'Vertically, renumbering rows', isCorrect: true }, { id: 'c', text: 'On a key', isCorrect: false }, { id: 'd', text: 'Into a Series', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q3', questionText: 'True or false: value_counts() computes the mean of a column.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: combined["total"] = combined["qty"] * combined["price"] creates a ______ column.', questionType: 'fill_blank', correctAnswer: 'derived' },
      { id: 'q5', questionText: 'report["total"].sum() returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'First value', isCorrect: false }, { id: 'b', text: 'Mean', isCorrect: false }, { id: 'c', text: 'Grand total', isCorrect: true }, { id: 'd', text: 'Count', isCorrect: false }], correctAnswer: 'c' },
    ],
  },
  assignment: {
    title: 'Assignment P4.4 — Join and Report',
    description: 'Join a products table to an orders table on item, compute line totals and the grand total, then summarize with describe(). Good: correct merge, totals, and summary; rubric: 6 merge, 4 totals, 5 grand total, 5 summary = 20.',
    dueDate: '2026-07-24T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'With products (item, price) and orders (item, qty), merge them, add a total column, print the grand total, and run describe() on the totals. Show code and output.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'What problem does merge(on=...) solve that concat cannot?', marks: 8 }],
  },
})

lessons.push({
  title: 'P4.5 — Plotting with Matplotlib',
  duration: 10,
  content: `# P4.5 — Plotting with Matplotlib

A chart shows what a table hides. Matplotlib draws line, bar, and scatter plots from your data.

## Learning Objectives
- Draw a line chart and label axes and title.
- Draw a bar chart from category counts.
- Choose the right chart type for a question.

## Introduction
Numbers summarize; pictures persuade. Matplotlib is the classic plotting library: plt.plot for lines, plt.bar for categories, plt.scatter for relationships. Labels and titles make charts readable.

## Line Chart
import matplotlib.pyplot as plt
x = [1, 2, 3, 4]
y = [10, 15, 13, 18]
plt.plot(x, y)
plt.xlabel("day")
plt.ylabel("sales")
plt.title("Sales this week")
plt.show()

## Bar Chart
cities = ["lagos", "abuja", "ibadan"]
temps = [31, 28, 29]
plt.bar(cities, temps)
plt.ylabel("temperature")
plt.show()

## Scatter Plot
plt.scatter(heights, weights)   # shows relationships

## Worked Example — Score Distribution
import matplotlib.pyplot as plt
scores = [55, 62, 71, 75, 82, 88, 91, 95]
bins = [50, 60, 70, 80, 90, 100]
plt.hist(scores, bins=bins)
plt.xlabel("score")
plt.ylabel("students")
plt.title("Score distribution")
plt.show()

## Practical Exercise
Run this:
import matplotlib.pyplot as plt
days = ["Mon", "Tue", "Wed"]
temps = [30, 32, 29]
plt.bar(days, temps)
plt.ylabel("temp")
plt.title("Temps")
plt.show()
Tasks: (1) what appears; (2) change bar to plot and describe the difference. Check: a bar chart with 3 bars; plot draws a connected line instead.
Expected scaffold lines (copy exactly):
    import matplotlib.pyplot as plt
    days = ["Mon", "Tue", "Wed"]
    temps = [30, 32, 29]
    plt.bar(days, temps)
    plt.ylabel("temp")
    plt.title("Temps")
    plt.show()

## Key Takeaways
- plt.plot for trends over time; plt.bar for categories; plt.scatter for relationships.
- Always label axes and add a title — an unlabeled chart is unreadable.
- plt.hist shows a distribution; bins control the bucket width.
- plt.show() renders the chart; savefig("out.png") writes it to a file.

## Quiz Answer Key
1. (b) plt.bar draws a bar chart of categories.
2. (a) plt.plot connects points — best for trends over time.
3. False — plt.scatter plots points without connecting lines.
4. (c) plt.xlabel("day") labels the x-axis.
5. (b) plt.hist shows how scores distribute across bins.
`,
  quiz: {
    title: 'Quiz P4.5 — Plotting with Matplotlib',
    description: '5 auto-gradable questions on chart types and labeling.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'plt.bar(days, temps) draws:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'A line', isCorrect: false }, { id: 'b', text: 'A bar chart', isCorrect: true }, { id: 'c', text: 'A scatter', isCorrect: false }, { id: 'd', text: 'A histogram', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'Best chart for a trend over time:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'plt.plot', isCorrect: true }, { id: 'b', text: 'plt.bar', isCorrect: false }, { id: 'c', text: 'plt.hist', isCorrect: false }, { id: 'd', text: 'plt.pie', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: plt.scatter connects points with lines.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: plt.______("day") labels the x-axis.', questionType: 'fill_blank', correctAnswer: 'xlabel' },
      { id: 'q5', questionText: 'To see how scores spread across ranges, use:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'plt.plot', isCorrect: false }, { id: 'b', text: 'plt.hist', isCorrect: true }, { id: 'c', text: 'plt.bar', isCorrect: false }, { id: 'd', text: 'plt.text', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P4.5 — Data Visualization',
    description: 'Plot a line chart of one numeric series and a bar chart of category counts, both with labels and a title. Good: correct chart types, complete labels; rubric: 6 line, 5 bar, 5 labels, 4 explanation = 20.',
    dueDate: '2026-07-25T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Using daily temperature data, draw a labeled line chart; using city counts, draw a labeled bar chart. Include xlabel, ylabel, and title for each.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Why are axis labels and titles essential on every chart?', marks: 8 }],
  },
})

export const module04: ModuleData = {
  title: 'Module 4 — Data with NumPy & Pandas',
  lessons,
}
