// ─── Python Course — Module 6: Capstone & Next Steps ────────────────────────
import type { ModuleData, LessonData } from './types'

const lessons: LessonData[] = []

lessons.push({
  title: 'P6.1 — HTTP Requests & Automation',
  duration: 10,
  content: `# P6.1 — HTTP Requests & Automation

Most real data comes from APIs. The requests library fetches it; json parses it.

## Learning Objectives
- Fetch JSON from a public API with requests.get().
- Check status codes before parsing.
- Save API results to a file for later analysis.

## Introduction
An API is a URL that returns data (usually JSON) instead of a web page. requests.get(url) performs the fetch; .json() parses the body. Always check response.status_code == 200 before trusting the data.

## Fetching Data
import requests
response = requests.get("https://api.github.com/users/python")
if response.status_code == 200:
    data = response.json()
    print(data["login"])
else:
    print("request failed:", response.status_code)

## Parsing the Payload
data = response.json()          # dict or list
for repo in data[:3]:           # first three items if a list
    print(repo)

## Saving Results
import json
with open("api_result.json", "w") as f:
    json.dump(data, f, indent=2)

## Worked Example — Download and Summarize
import requests
response = requests.get("https://api.github.com/repos/python/cpython")
if response.status_code == 200:
    repo = response.json()
    print(repo["full_name"], "stars:", repo["stargazers_count"])

## Practical Exercise
Run this:
import requests
response = requests.get("https://api.github.com/users/octocat")
print(response.status_code)
if response.status_code == 200:
    print(response.json()["login"])
Tasks: (1) what prints; (2) save the JSON body to octocat.json and reload it. Check: 200 then octocat; the saved file reloads to the same dict.
Expected scaffold lines (copy exactly):
    import requests
    response = requests.get("https://api.github.com/users/octocat")
    print(response.status_code)
    if response.status_code == 200:
        print(response.json()["login"])

## Key Takeaways
- requests.get(url) fetches; response.json() parses JSON bodies.
- Always check status_code == 200 before using the data.
- API keys and rate limits are real — read the API docs.
- Save raw responses to disk so you can re-analyze without re-fetching.

## Quiz Answer Key
1. (b) requests.get(url) performs an HTTP GET request.
2. (a) response.json() parses the JSON body into Python objects.
3. False — status_code 200 means success; check it before parsing.
4. (c) json.dump(data, f) writes the parsed data to an open file.
5. (b) Checking status_code first avoids parsing an error page as JSON.
`,
  quiz: {
    title: 'Quiz P6.1 — HTTP Requests & Automation',
    description: '5 auto-gradable questions on requests, status codes, and saving API data.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'requests.get(url) does what?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Parses JSON', isCorrect: false }, { id: 'b', text: 'Performs an HTTP GET', isCorrect: true }, { id: 'c', text: 'Creates a venv', isCorrect: false }, { id: 'd', text: 'Renders HTML', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'response.json() returns:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Python objects from the JSON body', isCorrect: true }, { id: 'b', text: 'The HTML', isCorrect: false }, { id: 'c', text: 'A status code', isCorrect: false }, { id: 'd', text: 'Headers', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: A status_code of 200 means the request failed.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: Check response.______ before trusting the body.', questionType: 'fill_blank', correctAnswer: 'status_code' },
      { id: 'q5', questionText: 'Why save an API response to disk?', questionType: 'multiple_choice', options: [{ id: 'a', text: 'To re-analyze without re-fetching', isCorrect: true }, { id: 'b', text: 'To speed the API', isCorrect: false }, { id: 'c', text: 'To delete it', isCorrect: false }, { id: 'd', text: 'No reason', isCorrect: false }], correctAnswer: 'a' },
    ],
  },
  assignment: {
    title: 'Assignment P6.1 — API Fetcher',
    description: 'Fetch a public API endpoint, guard on status code, extract two fields, and save the raw JSON to disk. Good: correct guard, extraction, saved file; rubric: 6 fetch, 4 guard, 5 extract, 5 save = 20.',
    dueDate: '2026-07-31T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Write a script that fetches a public API of your choice, checks status_code, prints two fields, and saves the raw JSON with json.dump.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'What can go wrong if you call response.json() without checking the status code?', marks: 8 }],
  },
})

lessons.push({
  title: 'P6.2 — Capstone: Analyze a Dataset End-to-End',
  duration: 15,
  content: `# P6.2 — Capstone: Analyze a Dataset End-to-End

Load, clean, summarize, and chart a dataset — the full workflow in one project.

## Learning Objectives
- Load a CSV into pandas and inspect it (head, info, describe).
- Clean missing values and fix dtypes.
- Compute per-group summaries and draw one labeled chart.
- Save the cleaned data and your findings.

## Introduction
This is the course capstone. You will take a raw CSV through the whole pipeline: inspect, clean, analyze, visualize, and report. Every step uses a skill from an earlier module.

## The Workflow
import pandas as pd
import matplotlib.pyplot as plt

# 1. Load
df = pd.read_csv("sales.csv")
print(df.head())
print(df.info())

# 2. Clean
df["revenue"] = df["revenue"].fillna(df["revenue"].median())
df = df.drop_duplicates()
df["date"] = pd.to_datetime(df["date"])

# 3. Analyze
monthly = df.groupby(df["date"].dt.month)["revenue"].sum()
best = monthly.idxmax()
print("best month:", best, "revenue:", monthly.max())

# 4. Visualize
monthly.plot(kind="bar", title="Revenue by month")
plt.ylabel("revenue")
plt.tight_layout()
plt.savefig("revenue.png")

# 5. Save
df.to_csv("sales_clean.csv", index=False)

## Report Structure
1. Data: where it came from, how many rows/columns.
2. Cleaning: what was missing, what you did.
3. Findings: the numbers that answer your question.
4. Chart: one labeled chart supporting the finding.
5. Limitation: one thing the data cannot tell you.

## Practical Exercise
With sales.csv (columns: date, region, revenue), run the pipeline above and answer: which region earned the most?
Tasks: (1) group revenue by region and print totals; (2) sort descending and take the top row. Check: df.groupby("region")["revenue"].sum().sort_values(ascending=False) with .index[0] naming the top region.
Expected scaffold lines (copy exactly):
    import pandas as pd
    df = pd.read_csv("sales.csv")
    by_region = df.groupby("region")["revenue"].sum().sort_values(ascending=False)
    print(by_region)
    print("top region:", by_region.index[0])

## Key Takeaways
- Inspect before you change: head, info, describe are your first three calls.
- Clean with intent: every fillna/dropna decision should be explainable.
- groupby turns raw rows into answers; charts make answers convincing.
- Save both the cleaned data and the chart — reproducibility matters.

## Quiz Answer Key
1. (b) head(), info(), describe() are the standard first inspection calls.
2. (a) groupby("region")["revenue"].sum() totals revenue per region.
3. False — the median fill keeps rows and resists outliers better than the mean.
4. (c) df.to_csv("sales_clean.csv", index=False) saves without the index column.
5. (b) A limitation states what the data cannot answer — honesty in reporting.
`,
  quiz: {
    title: 'Quiz P6.2 — Capstone Workflow',
    description: '5 auto-gradable questions on the end-to-end analysis pipeline.',
    timeLimit: 300,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      { id: 'q1', questionText: 'The first three calls on a new DataFrame are:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'plot, save, print', isCorrect: false }, { id: 'b', text: 'head, info, describe', isCorrect: true }, { id: 'c', text: 'dropna, merge, sort', isCorrect: false }, { id: 'd', text: 'groupby only', isCorrect: false }], correctAnswer: 'b' },
      { id: 'q2', questionText: 'df.groupby("region")["revenue"].sum() gives:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'Revenue per region', isCorrect: true }, { id: 'b', text: 'Regions per revenue', isCorrect: false }, { id: 'c', text: 'Row count', isCorrect: false }, { id: 'd', text: 'A chart', isCorrect: false }], correctAnswer: 'a' },
      { id: 'q3', questionText: 'True or false: Filling missing revenue with the median is always wrong.', questionType: 'true_false', correctAnswer: 'false' },
      { id: 'q4', questionText: 'Fill in the blank: df.to_csv(path, ______=False) saves without the index column.', questionType: 'fill_blank', correctAnswer: 'index' },
      { id: 'q5', questionText: 'A good report includes a limitation because:', questionType: 'multiple_choice', options: [{ id: 'a', text: 'It pads the length', isCorrect: false }, { id: 'b', text: 'It states what the data cannot answer', isCorrect: true }, { id: 'c', text: 'Charts require it', isCorrect: false }, { id: 'd', text: 'It hides errors', isCorrect: false }], correctAnswer: 'b' },
    ],
  },
  assignment: {
    title: 'Assignment P6.2 — Full Capstone Report',
    description: 'Take a small CSV through the full pipeline: inspect, clean, analyze one question, chart it, and write a 5-part report. Good: complete pipeline, clear finding, labeled chart, honest limitation; rubric: 5 inspect, 4 clean, 5 analyze, 4 chart, 2 report = 20.',
    dueDate: '2026-08-01T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [{ id: 'q1', type: 'theory', title: 'Submit your notebook or script plus the report: data source, cleaning steps, one finding with a number, one labeled chart, one limitation.', marks: 12 }, { id: 'q2', type: 'subjective', title: 'Which pipeline step would you automate first for a weekly report — and why?', marks: 8 }],
  },
})

export const module06: ModuleData = {
  title: 'Module 6 — Capstone & Next Steps',
  lessons,
}
