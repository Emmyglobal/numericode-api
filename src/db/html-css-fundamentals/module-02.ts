import type { HcfModuleData } from './types'

export const module02: HcfModuleData = {
  title: 'Module 2 — HTML Document Structure & Text Elements',
  lessons: [
    {
      title: 'The <head> in Depth',
      duration: 30,
      content: `## Key Ideas

**Essential <head> elements:**
- \`<meta charset="UTF-8">\` — character encoding (should be near the top)
- \`<meta name="viewport" content="width=device-width, initial-scale=1.0">\` — mobile rendering
- \`<meta name="description" content="...">\` — SEO description
- \`<link rel="stylesheet" href="styles.css">\` — linking external CSS
- \`<link rel="icon" href="favicon.ico">\` — favicon
- \`<title>\` — browser tab text

\`\`\`html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="A short summary of the page for search engines." />
  <link rel="stylesheet" href="styles.css" />
  <link rel="icon" href="favicon.ico" />
  <title>My Page</title>
</head>
\`\`\`

## Key Takeaways

- \`<meta charset="UTF-8">\` should be one of the first tags in \`<head>\`.
- The viewport meta tag is essential for mobile-responsive rendering.
- \`<link rel="stylesheet">\` connects your HTML to external CSS.
- The \`<title>\` element sets the browser tab text and is important for SEO.
- The \`<link>\` tag can also be used for favicons and other resources.`,
      quiz: {
        title: 'Quiz 2.1 — The <head> in Depth',
        description: 'Three questions on head metadata, viewport, and linking CSS.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'Which meta tag makes a page render correctly on mobile devices?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<meta name="viewport" content="width=device-width, initial-scale=1.0">', isCorrect: true },
              { id: 'b', text: '<meta charset="UTF-8">', isCorrect: false },
              { id: 'c', text: '<meta name="description">', isCorrect: false },
              { id: 'd', text: '<meta http-equiv="refresh">', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'Which tag links an external CSS file to an HTML page?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<stylesheet>', isCorrect: false },
              { id: 'b', text: '<css>', isCorrect: false },
              { id: 'c', text: '<link rel="stylesheet" href="...">', isCorrect: true },
              { id: 'd', text: '<style src="...">', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
          {
            questionText: 'True/False: <meta charset="UTF-8"> should be one of the first tags inside <head>.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Text Formatting Elements',
      duration: 25,
      content: `## Key Ideas

**Semantic vs stylistic elements:**
- \`<strong>\` vs \`<b>\` — \`<strong>\` conveys strong importance (semantic), \`<b>\` is purely stylistic bold
- \`<em>\` vs \`<i>\` — \`<em>\` conveys emphasis (semantic), \`<i>\` is purely stylistic italic

**Other text elements:**
- \`<small>\` — small print (e.g., disclaimers, fine print)
- \`<mark>\` — highlighted text
- \`<br>\` — line break (void element)
- \`<hr>\` — thematic break (often rendered as horizontal line)

\`\`\`html
<p>This is <strong>very important</strong> and this is <em>emphasized</em>.</p>
<p>Line one<br />Line two</p>
<hr />
\`\`\`

## Key Takeaways

- \`<strong>\` conveys strong importance; \`<b>\` is purely stylistic bold with no added meaning.
- \`<em>\` conveys emphasis; \`<i>\` is purely stylistic italic.
- \`<br>\` inserts a line break.
- \`<hr>\` represents a thematic break, often rendered as a horizontal line.`,
      quiz: {
        title: 'Quiz 2.2 — Text Formatting Elements',
        description: 'Three questions on semantic vs stylistic text elements.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What is the semantic difference between <strong> and <b>?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '<strong> conveys strong importance; <b> is purely stylistic bold with no added meaning', isCorrect: true },
              { id: 'b', text: 'There is no difference; they are identical', isCorrect: false },
              { id: 'c', text: '<strong> is for bold text, <b> is for important text', isCorrect: false },
              { id: 'd', text: '<strong> is inline, <b> is block-level', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What does <br> do?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Creates a new paragraph', isCorrect: false },
              { id: 'b', text: 'Inserts a line break', isCorrect: true },
              { id: 'c', text: 'Makes text bold', isCorrect: false },
              { id: 'd', text: 'Adds a horizontal rule', isCorrect: false },
            ],
            correctAnswer: 'b',
          },
          {
            questionText: 'What does <hr> typically represent?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'A hyperlink reference', isCorrect: false },
              { id: 'b', text: 'A heading reference', isCorrect: false },
              { id: 'c', text: 'A thematic break (often rendered as a horizontal line)', isCorrect: true },
              { id: 'd', text: 'A horizontal rule for data tables only', isCorrect: false },
            ],
            correctAnswer: 'c',
          },
        ],
      },
    },
  ],
}
