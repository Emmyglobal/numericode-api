import { query } from './pool'

type CourseSeed = { title: string; subject: 'mathematics' | 'programming'; description: string; modules: Array<[string, string[]]> }

const courses: CourseSeed[] = [
  { title: 'Mathematics: Foundation to High School', subject: 'mathematics', description: 'A complete pathway from number sense to high-school mathematics and examination preparation.', modules: [
    ['Foundation Mathematics', ['Whole Numbers and Place Value', 'Fractions, Decimals and Percentages', 'Ratio, Proportion and Rates']],
    ['Algebra and Functions', ['Expressions and Linear Equations', 'Graphs and Linear Functions', 'Quadratic Equations']],
    ['Geometry and Trigonometry', ['Angles, Shapes and Constructions', 'Mensuration', 'Right-Angle Trigonometry']],
    ['Statistics and Revision', ['Data Handling and Probability', 'High School Mathematics Examination Practice']],
  ] },
  { title: 'HTML: Web Foundations', subject: 'programming', description: 'HTML5 document structure, text, links, media, tables, forms, semantic elements, and accessible web pages.', modules: [
    ['HTML Basics', ['What is HTML?', 'Document Structure', 'Elements, Tags and Attributes']],
    ['Text and Media', ['Headings, Paragraphs and Text', 'Links and Images', 'Lists and Tables']],
    ['Forms and Semantic HTML', ['Forms and Inputs', 'Semantic Page Layout', 'HTML Accessibility and Common Pitfalls']],
  ] },
  { title: 'CSS: Responsive Design', subject: 'programming', description: 'Style modern responsive websites with CSS selectors, the box model, Flexbox, Grid, and media queries.', modules: [['CSS Fundamentals', ['Selectors and the Cascade', 'Box Model and Typography', 'Colours and Layout']], ['Responsive Layout', ['Flexbox', 'CSS Grid', 'Media Queries and Portfolio Project']]] },
  { title: 'JavaScript: From Basics to DOM', subject: 'programming', description: 'Learn JavaScript syntax, functions, arrays, objects, browser events, and DOM programming.', modules: [['JavaScript Fundamentals', ['Variables and Data Types', 'Conditions and Loops', 'Functions']], ['Working in the Browser', ['Arrays and Objects', 'DOM Selection and Events', 'Interactive Calculator Project']]] },
  { title: 'Python Programming Fundamentals', subject: 'programming', description: 'Start programming with Python through practical exercises, functions, collections, files, and projects.', modules: [['Python Essentials', ['Python Setup and Syntax', 'Variables, Conditions and Loops', 'Functions']], ['Problem Solving', ['Lists, Dictionaries and Sets', 'Files and Exceptions', 'Python Project']]] },
  { title: 'C Programming Fundamentals', subject: 'programming', description: 'Build solid programming foundations with C syntax, functions, arrays, pointers, and files.', modules: [['C Essentials', ['Program Structure and Data Types', 'Operators and Control Flow', 'Functions and Arrays']], ['C Practice', ['Pointers', 'Strings and Structures', 'File Handling and Exercises']]] },
  { title: 'C++ Programming and OOP', subject: 'programming', description: 'Learn C++ programming, object-oriented design, STL containers, and algorithms.', modules: [['C++ Foundations', ['Syntax and Control Flow', 'Functions and Classes', 'Inheritance and Polymorphism']], ['Modern C++ Practice', ['STL Containers', 'Algorithms', 'Object-Oriented Project']]] },
  { title: 'Web Development Projects', subject: 'programming', description: 'Combine HTML, CSS, and JavaScript to build accessible responsive web applications.', modules: [['Project Skills', ['Planning a Web Project', 'Building Responsive Interfaces', 'JavaScript Interactions']], ['Portfolio Projects', ['Personal Profile Page', 'Interactive Quiz Application', 'Deployment and Code Review']]] },
]

export async function ensureCurriculumCatalog() {
  const { rows: instructors } = await query<{ id: string }>("SELECT id FROM users WHERE role IN ('trainer', 'admin') AND status = 'active' ORDER BY created_at LIMIT 1")
  const instructorId = instructors[0]?.id
  if (!instructorId) return
  for (const course of courses) {
    const { rows: existing } = await query<{ id: string }>('SELECT id FROM courses WHERE title = $1 LIMIT 1', [course.title])
    const courseId = existing[0]?.id ?? (await query<{ id: string }>(
      "INSERT INTO courses (title, description, subject, level, instructor_id, status, lesson_count, outcomes) VALUES ($1, $2, $3, 'beginner', $4, 'published', $5, $6) RETURNING id",
      [course.title, course.description, course.subject, instructorId, course.modules.reduce((total, module) => total + module[1].length, 0), ['Understand the core concepts', 'Complete practical exercises', 'Prepare for course assessments']]
    )).rows[0].id
    const { rows: count } = await query<{ count: string }>('SELECT COUNT(*)::text AS count FROM modules WHERE course_id = $1', [courseId])
    if (Number(count[0].count) > 0) continue
    for (const [modulePosition, module] of course.modules.entries()) {
      const { rows: modules } = await query<{ id: string }>('INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id', [courseId, module[0], modulePosition])
      for (const [lessonPosition, title] of module[1].entries()) {
        const content = `${title}. Work through the explanation, practise in the learning workspace, then complete the MCQ and theory exercises.`
        const { rows: lessons } = await query<{ id: string }>('INSERT INTO lessons (module_id, title, content, duration, position) VALUES ($1, $2, $3, 35, $4) RETURNING id', [modules[0].id, title, content, lessonPosition])
        const resource = course.subject === 'programming' ? 'https://developer.mozilla.org/en-US/docs/Learn' : 'https://www.khanacademy.org/math'
        await query("INSERT INTO resources (lesson_id, title, type, url) VALUES ($1, 'Lesson reference', 'link', $2)", [lessons[0].id, resource])
      }
    }
  }
}
