import type { HcfModuleData } from './types'

export const module11: HcfModuleData = {
  title: 'Module 11 — Capstone Project & Final Exam',
  lessons: [
    {
      title: 'Capstone Project Brief & Requirements',
      duration: 30,
      content: `## Capstone Project

Choose **one** capstone track (or propose your own, subject to instructor approval):

### Track A — Personal Portfolio Site
A 3+ page site (Home, About, Projects/Contact) showcasing your work, fully responsive.

### Track B — Small Business Landing Page
A single-page site for a fictional or real small business with hero, services, testimonials, and contact form sections.

### Track C — Blog Template
A 2-page site (post list + single post view) using semantic \`<article>\`/`<time>\` markup and a consistent style guide.

### Track D — Interactive Product Page
A single product page with an image gallery, expandable FAQ (accordion), and animated call-to-action button.

## Requirements (all tracks)

1. At least 3 distinct pages OR 3 distinct sections on a single page, all linked correctly.
2. Fully semantic HTML (header/nav/main/section/article/aside/footer used appropriately).
3. A responsive layout using Flexbox and/or Grid, tested at mobile, tablet, and desktop widths.
4. A documented style guide (colors, type scale, spacing) applied consistently.
5. At least one animated/interactive element (transition, transform, or keyframe animation).
6. Passes the W3C HTML validator with no errors, and meets WCAG AA color contrast on all text.

## Capstone Grading Rubric (100 pts)

| Criterion | Points |
|---|---|
| Semantic HTML structure & validation | 25 |
| Responsive layout (Flexbox/Grid + media queries) | 25 |
| Visual design & style guide consistency | 20 |
| Accessibility (contrast, labels, alt text, focus states) | 20 |
| Presentation & peer feedback given | 10 |`,`,
      quiz: {
        title: 'Quiz 11.1 - Capstone Project Brief',
        description: 'Three questions on capstone requirements and tracks.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What is Track A of the capstone project?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Personal Portfolio Site - a 3+ page site showcasing your work', isCorrect: true },
              { id: 'b', text: 'Small Business Landing Page', isCorrect: false },
              { id: 'c', text: 'Blog Template', isCorrect: false },
              { id: 'd', text: 'Interactive Product Page', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'How many distinct pages or sections must your capstone have?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'At least 3', isCorrect: true },
              { id: 'b', text: 'At least 1', isCorrect: false },
              { id: 'c', text: 'At least 5', isCorrect: false },
              { id: 'd', text: 'Exactly 2', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What is the minimum color contrast ratio required for WCAG AA compliance?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '4.5:1', isCorrect: true },
              { id: 'b', text: '3:1', isCorrect: false },
              { id: 'c', text: '7:1', isCorrect: false },
              { id: 'd', text: '2:1', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
        ],
      },
    },
    {
      title: 'Project Work Session: Design & Plan',
      duration: 45,
      content: `## Design & Planning Deliverables

Create a 1-page design doc that includes:

1. **Sitemap/Wireframe sketch** - Draw out your page structure and layout
2. **Chosen track** - Which capstone track you are building
3. **Color palette** - Your chosen colors with hex values
4. **Type scale** - Your heading and body text sizes
5. **Task breakdown** - What you will build and in what order

## Tips for Planning

- Start with mobile-first: design for small screens first
- Choose a limited color palette (2-3 primary colors)
- Define your type scale before you start coding
- Plan your semantic HTML structure before styling
- Break the work into small, manageable tasks

## Key Takeaways

- A design doc helps you think through the project before coding.
- Plan mobile-first for easier responsive development.
- Break large projects into small tasks.`,`,
      quiz: {
        title: 'Quiz 11.2 - Design & Planning',
        description: 'Three questions on project planning and design docs.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'What should a 1-page design doc include?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Sitemap/wireframe, chosen track, color palette, type scale, task breakdown', isCorrect: true },
              { id: 'b', text: 'Only the color palette', isCorrect: false },
              { id: 'c', text: 'Full CSS code for the project', isCorrect: false },
              { id: 'd', text: 'A list of all HTML tags to use', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What approach is recommended for responsive design planning?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Mobile-first - design for small screens first', isCorrect: true },
              { id: 'b', text: 'Desktop-first - design for large screens first', isCorrect: false },
              { id: 'c', text: 'Tablet-first - design for medium screens first', isCorrect: false },
              { id: 'd', text: 'No specific approach is recommended', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: You should plan your semantic HTML structure before styling.',
            questionType: 'true_false',
            correctAnswer: 'true',
          },
        ],
      },
    },
    {
      title: 'Project Work Session: Build & Test',
      duration: 90,
      content: `## Build & Test Deliverables

Create working site files that:

1. Pass validation with the W3C validator
2. Are tested at 3 breakpoints in DevTools responsive mode:
   - Mobile (typically 320-480px)
   - Tablet (typically 600-900px)
   - Desktop (900px+)
3. Meet all the requirements from the capstone brief

## Testing Checklist

- [ ] HTML validates with no errors at validator.w3.org
- [ ] Layout works at 320px, 768px, and 1200px widths
- [ ] All links navigate correctly
- [ ] Colors meet 4.5:1 contrast ratio
- [ ] Images have meaningful alt text
- [ ] Forms have properly associated labels
- [ ] Focus states are visible
- [ ] Animation works smoothly

## Key Takeaways

- Test at multiple breakpoints throughout development.
- Validate early and often to catch errors.
- Use a checklist to ensure all requirements are met.`,`,
      quiz: {
        title: 'Quiz 11.3 - Build & Test',
        description: 'Three questions on building and testing the capstone.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'How many breakpoints should you test your capstone at?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '3 (mobile, tablet, desktop)', isCorrect: true },
              { id: 'b', text: '1 (desktop only)', isCorrect: false },
              { id: 'c', text: '5 (every possible width)', isCorrect: false },
              { id: 'd', text: '2 (mobile and desktop)', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What tool should you use to validate your HTML?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'W3C Markup Validator (validator.w3.org)', isCorrect: true },
              { id: 'b', text: 'Browser Console', isCorrect: false },
              { id: 'c', text: 'CSS Validator only', isCorrect: false },
              { id: 'd', text: 'A code editor', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'True/False: You should validate your HTML only after completing the entire project.',
            questionType: 'true_false',
            correctAnswer: 'false',
          },
        ],
      },
    },
    {
      title: 'Peer Review & Presentation',
      duration: 30,
      content: `## Peer Review Deliverables

1. **5-10 minute recorded or live walkthrough** of your site
2. **Written feedback on 2 peers' submissions** using the provided rubric

## Peer Review Rubric Categories

- **Structure/Semantics** - Is semantic HTML used correctly?
- **Responsiveness** - Does the layout work at all breakpoints?
- **Accessibility** - Are contrast, labels, alt text, and focus states in place?
- **Visual Design** - Is the design polished and consistent?

## Presentation Tips

- Show your site at multiple screen sizes
- Point out specific design decisions
- Explain how you met the requirements
- Be ready to answer questions about your code

## Key Takeaways

- Peer review helps you learn from others' approaches.
- Present your work clearly and confidently.
- Giving constructive feedback improves your own skills.`,`,
      quiz: {
        title: 'Quiz 11.4 - Peer Review & Presentation',
        description: 'Three questions on peer review and presentation.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'How long should your capstone presentation be?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '5-10 minutes', isCorrect: true },
              { id: 'b', text: '1-2 minutes', isCorrect: false },
              { id: 'c', text: '30 minutes', isCorrect: false },
              { id: 'd', text: 'Exactly 15 minutes', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'How many peers' submissions should you provide written feedback on?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '2', isCorrect: true },
              { id: 'b', text: '1', isCorrect: false },
              { id: 'c', text: '3', isCorrect: false },
              { id: 'd', text: '5', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'Which of these is NOT a peer review rubric category?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'Backend Database Design', isCorrect: true },
              { id: 'b', text: 'Structure/Semantics', isCorrect: false },
              { id: 'c', text: 'Responsiveness', isCorrect: false },
              { id: 'd', text: 'Accessibility', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
        ],
      },
    },
    {
      title: 'Final Exam Overview',
      duration: 20,
      content: `## Final Exam Format

- **50 multiple-choice/short-answer questions** (5 per Module 1-10)
- **3 practical build problems** (navbar, accessible form, Grid layout)
- **Time limit:** 120 minutes
- **Passing score:** 60% minimum
- **Retakes:** One retake allowed after a 48-hour cooldown

## What to Study

Review all 10 core modules:
1. HTML Basics
2. Document Structure & Text
3. Links, Images & Lists
4. Tables & Forms
5. Semantic HTML & Accessibility
6. CSS Selectors & Box Model
7. Flexbox Layout
8. Grid & Responsive Design
9. Typography & Color
10. Transitions & Animations

## Final Exam Weight

The Final Exam contributes **20%** to your overall course grade. You must score at least 60% on the Final Exam (in addition to 70% overall) to pass the course.

## Key Takeaways

- The final exam has 50 questions + 3 practical problems.
- You have 120 minutes to complete it.
- One retake is allowed after a 48-hour cooldown.
- The final exam is worth 20% of your course grade.`,`,
      quiz: {
        title: 'Quiz 11.5 - Final Exam Overview',
        description: 'Three questions on the final exam format and requirements.',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          {
            questionText: 'How many questions are on the final exam?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '50 multiple-choice/short-answer + 3 practical build problems', isCorrect: true },
              { id: 'b', text: '25 multiple-choice questions', isCorrect: false },
              { id: 'c', text: '100 multiple-choice questions', isCorrect: false },
              { id: 'd', text: '10 practical build problems', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'What is the time limit for the final exam?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: '120 minutes', isCorrect: true },
              { id: 'b', text: '60 minutes', isCorrect: false },
              { id: 'c', text: '180 minutes', isCorrect: false },
              { id: 'd', text: '90 minutes', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
          {
            questionText: 'How many retakes are allowed for the final exam?',
            questionType: 'multiple_choice',
            options: [
              { id: 'a', text: 'One retake after a 48-hour cooldown', isCorrect: true },
              { id: 'b', text: 'Unlimited retakes', isCorrect: false },
              { id: 'c', text: 'No retakes allowed', isCorrect: false },
              { id: 'd', text: 'Three retakes', isCorrect: false },
            ],
            correctAnswer: 'a',
          },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 11 Assignment — Capstone Project',
    description: 'Choose one capstone track (Personal Portfolio, Small Business Landing Page, Blog Template, or Interactive Product Page) and build a complete, responsive, accessible multi-page website. See Module 11 lessons for full requirements and grading rubric (100 pts: Semantic HTML 25, Responsiveness 25, Visual Design 20, Accessibility 20, Presentation 10).',
    dueDate: '2027-01-04T23:59:59Z',
    totalMarks: 100,
    passingScore: 70,
    assignmentType: file,
    questions: [
      { id: 'a11-1', type: file, title: 'Capstone Project Submission', marks: 100 },
    ],
  },
}
