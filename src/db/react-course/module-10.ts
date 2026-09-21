// ─── React Course — Module 10: Working with APIs ─────────────────────────────
import { fill, lesson, mcq, moduleOf, tf } from './helpers'
import type { ModuleData } from './types'

export const module10: ModuleData = moduleOf('Module 10 — Working with APIs', [
  lesson('R10.1 — What Is an API? Fetching with Loading and Error States', {
    duration: 16,
    intro: 'So far your data lived in the file. Real applications ask a server for it — and a request can be slow or fail, so the screen needs to show what is happening.',
    objectives: [
      'Explain what an API is in your own words',
      'Fetch data with fetch and await inside an effect',
      'Show loading, success and error states',
    ],
    teach: [
      ['An API Is a Waiter', 'A restaurant kitchen does not let you walk in and cook. You tell the waiter what you want, and the waiter brings it.\n\nAn **API** is that waiter for programs: you ask for data in a standard way, and the server answers. The most common style on the web is a **REST API**, where each URL identifies a resource — `/api/courses` returns the course list.'],
      ['A Request Takes Time', '```js\nconst response = await fetch("/api/courses");\nconst data = await response.json();\n```\n\nReading the body takes a second step, because the response arrives as a stream of bytes that must be parsed.\n\nWhile that happens the browser is free to keep painting — which is exactly why we show a loading state.'],
      ['Three States, Not One', 'A screen that loads data is never simply "loaded". It is one of three things:\n\n1. **Loading** — the request is in flight\n2. **Success** — data arrived (and it may be empty!)\n3. **Error** — the request failed; the student deserves a message and a way to try again\n\nModel these with state, and the UI becomes honest.'],
    ],
    code: {
      language: 'jsx',
      title: 'Loading Courses From an API',
      code: `function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) throw new Error("Request failed");
        setCourses(await response.json());
      } catch (err) {
        setError("We could not load the courses. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading courses…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (courses.length === 0) return <p>No courses are available yet.</p>;

  return (
    <ul>
      {courses.map(course => <li key={course.id}>{course.title}</li>)}
    </ul>
  );
}`,
      explain: 'The effect runs once (`[]`) and starts the request. `finally` always clears the loading flag, even when the request fails.\n\nThe early returns handle loading, error and the empty case before rendering the list — each state gets its own honest message.',
    },
    tryIt: {
      task: 'Show three states for a public API.',
      steps: [
        'Fetch `https://jsonplaceholder.typicode.com/posts?_limit=5`.',
        'Render "Loading…" while waiting, a red message on failure, and the titles on success.',
        'Break the URL on purpose to see the error state.',
      ],
      starter: `const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
if (!response.ok) throw new Error("Request failed");
const posts = await response.json();`,
      expected: 'The list appears after a short "Loading…" moment, and a friendly error replaces it when the URL is wrong.',
    },
    mistakes: [
      ['Forgetting `response.ok`', 'A 404 or 500 still "succeeds" as far as fetch is concerned, so you end up rendering nothing.'],
      ['Rendering `data.map` before data arrives', 'Calling map on undefined crashes the component. Start state as an empty array or check for loading first.'],
      ['No error state', 'The student sees an empty screen and does not know whether to wait or reload.'],
    ],
    check: ['Which three states should a data-driven screen handle?', [
      'Loading, success (including empty) and error',
      'Light and dark',
      'Desktop and mobile',
      'Read and write',
    ], 0, 'Data screens must handle loading, success/empty and error states.'],
    summary: [
      'An API lets your app ask a server for data in a standard way.',
      'Fetch in an effect and always check `response.ok`.',
      'Show loading, empty and error states — never a blank screen.',
    ],
    quiz: [
      mcq('What is an API?', ['A defined way for programs to request data or actions from a server', 'A CSS framework', 'A database table', 'A browser plugin'], 0, 'An API is the agreed interface between your app and the service it talks to.'),
      mcq('Why check `response.ok`?', ['fetch resolves even for error status codes such as 404', 'It makes the request faster', 'It parses JSON for you', 'It is optional sugar'], 0, 'fetch only rejects on network failure, so error statuses must be checked explicitly.'),
      fill('While a request is in flight, the screen should show a ______ state.', 'loading', 'A loading state tells the student that something is happening.'),
      tf('An empty array from the API means the request failed.', false, 'An empty result is a successful response with no data — show an empty state, not an error.'),
      mcq('Where should the fetch call live?', ['Inside an effect so it is not repeated on every render', 'Directly in the component body', 'In the CSS file', 'In package.json'], 0, 'Fetching during render repeats unpredictably; effects run it at controlled moments.'),
    ],
  }),

  lesson('R10.2 — POST Requests, Environment Variables and Safe Keys', {
    duration: 16,
    intro: 'Reading data is half the story — students also send data: enrolling, submitting an assignment, saving a draft. Learn to send data safely and keep secrets out of the browser.',
    objectives: [
      'Send data with a POST request and a JSON body',
      'Handle a failed request and show feedback',
      'Keep API keys out of frontend code with environment variables',
    ],
    teach: [
      ['Sending Data', '```jsx\nconst response = await fetch("/api/enrollments", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ courseId }),\n});\n```\n\nThree parts matter: the `method`, the `Content-Type` header telling the server it receives JSON, and the `body` containing the JSON string. Forget the header and many servers reject the request with a confusing error.'],
      ['Always Allow for Failure', 'A POST can fail for many reasons: no network, a validation error, a permission problem, a server bug. Keep the student informed:\n\n- disable the button while sending, so they cannot submit twice\n- show the server\'s message when it sends one\n- offer a retry\n- never assume success — act on the response you actually received'],
      ['Secrets Belong on the Server', 'A frontend environment variable is **not** secret. Anything in a Vite variable is compiled into the bundle, where any visitor can read it.\n\n```bash\n# .env — fine to expose: a public URL is not a secret\nVITE_API_URL=http://localhost:4000/api\n```\n\nA payment secret key, database password or admin token must stay on the server. Your React app calls **your own** backend, which holds the key and talks to the provider for you — exactly how a payment flow is built.'],
    ],
    code: {
      language: 'jsx',
      title: 'Enrolling With Feedback',
      code: `// services/enrollments.service.js
const API_URL = import.meta.env.VITE_API_URL;

export async function enroll(courseId) {
  const response = await fetch(\`\${API_URL}/enrollments\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Enrollment failed. Please try again.");
  }
  return payload;
}`,
      explain: 'The service sends JSON and turns any failure into a thrown error with a readable message.\n\nThe API address comes from an environment variable, so the same code works locally and in production. No secret appears anywhere in the frontend.',
    },
    tryIt: {
      task: 'Send a form to a test API and show the result.',
      steps: [
        'Create a small form with a title input.',
        'POST it as JSON to `https://jsonplaceholder.typicode.com/posts`.',
        'Disable the button while sending, then show "Saved" or the error message.',
      ],
      starter: `const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title }),
});`,
      expected: 'The button disables during the request and then a success or failure message appears — never a silent no-op.',
    },
    mistakes: [
      ['Leaving the button enabled during a POST', 'Students double-submit and create duplicate records.'],
      ['Putting a secret key in a VITE_ variable', 'It is bundled into the frontend and readable by anyone. Keep secrets on the server.'],
      ['Assuming every response is JSON', 'An error page may return HTML. Parse defensively with a fallback.'],
    ],
    check: ['Where should a payment secret key live?', [
      'On the backend server, never in the React code',
      'In a VITE_ environment variable',
      'In the browser localStorage',
      'In a comment in the code',
    ], 0, 'Frontend variables are public. Secrets stay on the server, which talks to the provider for you.'],
    summary: [
      'POST with the right method, JSON content type and JSON body.',
      'Handle failure explicitly: disable, report, allow retry.',
      'Frontend environment variables are public — keep secrets on the server.',
    ],
    quiz: [
      mcq('Which header tells the server the body is JSON?', ['Content-Type: application/json', 'Accept: text/html', 'Authorization: json', 'Body-Type: json'], 0, 'Content-Type tells the server how to parse the request body.'),
      mcq('Why disable the submit button while a POST is in flight?', ['To prevent duplicate submissions', 'To speed up the request', 'To hide the button', 'To skip validation'], 0, 'Without it a double click creates two records.'),
      fill('Frontend environment variables are bundled into the app, so they are never ______.', 'secret', 'Anything shipped to the browser can be read by a visitor.'),
      tf('A verified payment must be confirmed by the backend, not only by the frontend.', true, 'The server must verify the provider\'s response before granting access.'),
      mcq('The server returns 400 with `{ message: "Course not found" }`. What should the UI do?', ['Show that message and keep the student\'s input', 'Reload the page', 'Show "Success"', 'Log out the student'], 0, 'Server messages are the most accurate explanation available; surface them safely.'),
    ],
    assignment: {
      goal: 'Connect a mini student dashboard to a real API with correct loading, error and empty handling — and no secrets in the frontend.',
      requirements: [
        'A service module that owns every API call; no fetch calls inside components.',
        'GET a list of courses and render it with loading, empty and error states.',
        'POST one simple action (for example "mark lesson complete") with success and failure feedback.',
        'Read the API base URL from an environment variable with a sensible fallback.',
        'A short security note listing what you kept out of the frontend and why.',
      ],
      starter: 'Use https://jsonplaceholder.typicode.com or your own backend, and follow the service-module pattern from the lesson.',
      expected: 'The dashboard loads, can post a change, and survives a broken URL with a helpful message. No key appears in the bundled code.',
      submission: 'Submit the repository link, the service module and your security note, naming the POST request and how its failure is handled.',
      criteria: [['All API calls isolated in a service module', 7], ['Loading, empty and error states correct for GET and POST', 8], ['Environment variable used and secrets kept server-side', 5]],
      difficulty: 'Challenging',
      time: '90–120 minutes',
    },
  }),

  // __APPEND__
])
