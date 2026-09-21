// ─── React Course — prerequisite assessment ──────────────────────────────────
// "React Readiness Check": a course-level prerequisite quiz that measures the
// HTML / CSS / JavaScript foundations the React course assumes. It deliberately
// contains NO React questions — it asks only about what comes before React.
import { fill, mcq, tf } from './helpers'
import type { ModuleData, QuizQuestion } from './types'

export const READINESS_QUIZ_TITLE = 'React Readiness Check'

/** Passing mark for the readiness check (percentage). */
export const READINESS_PASSING_SCORE = 70

export const readinessQuestions: QuizQuestion[] = [
  mcq('Which HTML tag creates the largest heading?', ['<h1>', '<h6>', '<head>', '<big>'], 0, 'Headings run from <h1> (largest) to <h6> (smallest). Aim for one h1 per page.'),
  tf('HTML describes the structure of a page, and CSS controls how it looks.', true, 'HTML gives the page its structure; CSS styles that structure.'),
  fill('The HTML tag `<p>` creates a ______.', 'paragraph', '<p> marks a paragraph of text.'),
  mcq('Which line correctly creates a variable in JavaScript?', ['let score = 10;', 'variable score = 10;', 'score := 10;', 'make score 10'], 0, 'let and const are the modern ways to declare a variable.'),
  fill('A value stored with const cannot be ______.', 'reassigned', 'const prevents the variable from being reassigned.'),
  mcq('What is the type of the value `"hello"`?', ['string', 'number', 'boolean', 'array'], 0, 'Text wrapped in quotes is a string.'),
  mcq('What does `[1, 2, 3].length` give?', ['3', '2', '1', '[1,2,3]'], 0, 'length counts the items in the array.'),
  fill('In `marks[0]`, the index 0 refers to the ______ item in the array.', 'first', 'Array indexes start at 0, so index 0 is the first item.'),
  mcq('Which line creates a JavaScript object?', ['{ name: "Ada", age: 15 }', '[name, age]', '(name: Ada)', 'name = Ada, age = 15'], 0, 'An object literal uses curly braces with key: value pairs.'),
  mcq('How do you read the `name` property of an object called `student`?', ['student.name', 'student->name', 'name.student', 'student(name)'], 0, 'Dot notation reads a property from an object.'),
  fill('A function sends a value back to its caller with the ______ keyword.', 'return', 'return ends the function and hands the value back.'),
  mcq('What does `add(2, 3)` return for `function add(a, b) { return a + b; }`?', ['5', '23', 'a + b', 'undefined'], 0, 'The parameters 2 and 3 are added, so the result is 5.'),
  mcq('Which arrow function matches `function double(n) { return n * 2; }`?', ['const double = n => n * 2;', 'const double => n * 2;', 'arrow double(n) { n * 2 }', 'const double = (n) { return n * 2 }'], 0, 'An arrow function with one parameter needs no brackets and returns the expression directly.'),
  fill('`map` returns a ______ array and leaves the original unchanged.', 'new', 'map builds a new array; the original array is not modified.'),
  mcq('What does `[1, 2, 3].map(n => n * 2)` give?', ['[2, 4, 6]', '[1, 2, 3, 2, 4, 6]', '[3, 4, 5]', '[2]'], 0, 'map runs the function on every item and collects the results in a new array.'),
  mcq('What does `[1, 2, 3, 4].filter(n => n % 2 === 0)` give?', ['[2, 4]', '[1, 3]', '[1, 2, 3, 4]', '[2]'], 0, 'filter keeps only the items where the test is true — here the even numbers.'),
  fill('`filter` keeps an item when its test returns ______.', 'true', 'The test function decides which items survive the filter.'),
  mcq('What does DOM stand for?', ['Document Object Model', 'Data Output Method', 'Digital Order Map', 'Document Order Mode'], 0, 'The DOM is the browser\'s live model of the page, built from your HTML.'),
  mcq('Which line finds the element with id "title" in plain JavaScript?', ['document.getElementById("title")', 'document.findId("title")', 'document.id("title")', 'window.title()'], 0, 'getElementById looks up an element by its id attribute.'),
  tf('`document.querySelector(".card")` selects the first element with the class `card`.', true, 'querySelector returns the first matching element using CSS selector syntax.'),
  mcq('Which line builds a string with a variable inside it?', ['`Score: ${score}`', '"Score: " + score', '"Score: {score}"', 'Score(${score})'], 0, 'Template literals use backticks and ${ } to insert values.'),
  mcq('Which line takes the `name` value out of the object `student`?', ['const { name } = student;', 'const name = student[0];', 'const name = {student};', 'student = name;'], 0, 'That is object destructuring — pulling named properties into variables.'),
  fill('To copy the items of an array into a new one you use the ______ operator: `[...items]`.', 'spread', 'The spread operator copies items out of an array or object.'),
  mcq('What does an `async` function always return?', ['A Promise', 'A string', 'An array', 'Nothing at all'], 0, 'An async function wraps its result in a Promise.'),
  mcq('What does `await` do inside an async function?', ['Pauses until the Promise finishes, then gives the value', 'Stops the whole program forever', 'Repeats the previous line', 'Creates a new Promise'], 0, 'await waits for the Promise to settle and hands back its resolved value.'),
  tf('`===` compares both the value and the type, while `==` may convert types first.', true, 'Strict equality (===) avoids surprising type conversions, so it is the safer default.'),
]

/**
 * The readiness check is seeded as its own module so the enrolled student meets
 * it before Module 1, and the quiz is also attached to `courses.prerequisite_quiz_id`
 * so the course-level gate (PrerequisiteQuizGate) locks the lessons until it is passed.
 */
export const prerequisiteModule: ModuleData = {
  title: 'Start Here — React Readiness Check',
  lessons: [
    {
      title: 'React Readiness Check',
      duration: 30,
      slides: [
        {
          id: 'react-readiness-s01',
          type: 'title',
          title: READINESS_QUIZ_TITLE,
          content: 'Before the React lessons begin, let us check that the HTML, CSS and JavaScript foundations you need are in place. There are no React questions here.',
        },
        {
          id: 'react-readiness-s02',
          type: 'objectives',
          title: 'What This Check Covers',
          items: [
            'HTML structure and common tags',
            'CSS basics',
            'Variables, strings, numbers and booleans',
            'Arrays, objects, functions and arrow functions',
            'map, filter, destructuring and the spread operator',
            'Basic DOM ideas and async/await',
          ],
        },
        {
          id: 'react-readiness-s03',
          type: 'callout',
          callout: {
            type: 'note',
            title: 'A readiness check, not a React test',
            content: `You need ${READINESS_PASSING_SCORE}% to unlock the React lessons. If you score lower you keep your enrollment — revise the JavaScript basics and try again, up to 3 attempts.`,
          },
        },
        {
          id: 'react-readiness-s04',
          type: 'summary',
          title: 'Before You Begin',
          items: [
            'Answer every question — there is no penalty for guessing.',
            'Read each question twice; several ask you to predict an output.',
            'Reaching 70% unlocks the course material.',
          ],
        },
      ],
      content: `# React Readiness Check

This check confirms that you have the HTML, CSS and JavaScript foundations the React course builds on. It contains **no React questions**.

## What It Covers
- HTML structure and common tags, CSS basics
- Variables, strings, numbers and booleans
- Arrays, objects, functions and arrow functions
- \`map\`, \`filter\`, destructuring and the spread operator
- Basic DOM ideas and async/await

## How It Works
- 26 questions, about 30 minutes.
- You need **${READINESS_PASSING_SCORE}%** to unlock the React lessons.
- You may try up to 3 times, with no penalty for guessing.`,
      quiz: {
        title: READINESS_QUIZ_TITLE,
        description: `Compulsory readiness check for Complete React Development. Score ${READINESS_PASSING_SCORE}% or higher to unlock the lessons.`,
        timeLimit: 1800,
        passingScore: READINESS_PASSING_SCORE,
        maxAttempts: 3,
        questions: readinessQuestions.map((q, i) => ({ ...q, id: `pq${i + 1}` })),
      },
    },
  ],
}
