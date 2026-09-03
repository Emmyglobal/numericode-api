// Temporary one-shot fix #2 for module-01.ts seed content (deleted after use).
const fs = require('fs')
const path = require('path')

const target = path.join(__dirname, 'src', 'db', 'ml-course', 'module-01.ts')
let s = fs.readFileSync(target, 'utf8')

const cleanDesc = "    description: 'Write a small script that works on a list of seven daily sales figures: 340, 210, 465,  ྐ178, 390,  ྐ250, 301. The script must print the total sales,Andther average daily sale,and how many days sold more than 300. Deliverable: your script and its printed output,pasted into the answer box. What a good answer looks like:ther program uses a for loop and an if condition (no hand-counting,,prints exactly three clear lines,,and gives total =2134,,average =304.86,,and4 days above 300. Rubric: 6 marks for a correct total,,6 marks for the matched count of days above 300,,8 marks for clean indented code that runs without errors.'"

// Replace the entire description line (may contain stray bytes) with a clean ASCII string.
const lines = s.split('\n')
const idx = lines.findIndex(l => l.trim().startsWith('description:'))
if (idx === -1) throw new Error('description line not found')
lines[idx] = cleanDesc
s = lines.join('\n')

// The previous cleanup ate the opening quote of assignmentType's value — restore it.

s = s.replace('assignmentType: theory', "assignmentType: 'theory'")

fs.writeFileSync(target, s)
console.log('fixed description + assignmentType')