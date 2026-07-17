# NumeriCode API

> Backend for NumeriCode — Node.js + Express + TypeScript + PostgreSQL
>
> Implements the full contract defined in the frontend's `API_CONTRACT.md`. Zero deviation.

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally (or a connection string to a hosted instance)

### Setup

```bash
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env — set DATABASE_URL to your PostgreSQL connection string

# Create the database (if it doesn't exist)
createdb numericode

# Run migrations (creates all 13 tables)
npm run db:migrate

# Seed demo data (7 users, 4 courses, enrollments, assignments, announcements)
npm run db:seed

# Start the dev server
npm run dev   # → http://localhost:3001
```

### Demo Accounts (after seeding)

| Role    | Email                       | Password    |
|---------|------------------------------|-------------|
| Admin   | `emmanuel@numericode.com`    | password123 |
| Trainer | `trainer@numericode.com`     | password123 |
| Student | `kolade@gmail.com`           | password123 |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL 14+ (raw `pg` driver, no ORM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Security | Helmet, CORS |
| Logging | Morgan |
| Testing | Vitest + Supertest (55 tests against a real database) |

---

## Project Structure

```
src/
├── app.ts               # createApp() factory — testable Express app
├── index.ts             # Server entry point (calls app.listen)
├── db/
│   ├── pool.ts           # PostgreSQL connection pool + query() helper
│   ├── migrate.ts        # Creates all 13 tables, indexes, constraints
│   └── seed.ts           # Seeds demo users, courses, enrollments, assignments
├── middleware/
│   ├── auth.ts           # requireAuth (JWT verify) + requireRole (RBAC)
│   └── errorHandler.ts   # Centralised error + 404 handling
├── controllers/
│   ├── auth.controller.ts       # login, register, forgotPassword
│   ├── courses.controller.ts    # public course catalogue
│   ├── dashboard.controller.ts  # 8 student portal endpoints
│   ├── trainer.controller.ts    # 5 trainer portal endpoints
│   └── admin.controller.ts      # 6 admin panel endpoints
├── routes/               # Express routers — one per domain
├── types/                # Shared TypeScript types (DB rows + API shapes)
├── utils/
│   ├── jwt.ts             # signToken / verifyToken
│   └── response.ts        # ok(), fail(), notFound(), unauthorized(), forbidden()
└── test/                 # 55 tests — auth, courses, RBAC, dashboard, trainer, admin
```

---

## Database Schema

13 tables with foreign key constraints and indexes:

`users` · `courses` · `modules` · `lessons` · `resources` · `live_classes` · `enrollments` · `lesson_completions` · `assignments` · `submissions` · `announcements` · `announcement_reads`

Every table uses `gen_random_uuid()` for primary keys (via the `pgcrypto` extension, auto-enabled in migrations).

---

## Authentication & Authorization

- **Password hashing:** bcryptjs with 10 salt rounds
- **Tokens:** JWT signed with `JWT_SECRET`, containing `{ userId, role }`, default 7-day expiry
- **Header format:** `Authorization: Bearer <token>`
- **Role guard:** `requireRole('student')` / `requireRole('trainer')` / `requireRole('admin')` — applied per-route (not via `router.use()`, to avoid intercepting unmatched paths before the 404 handler)

### RBAC Matrix (verified by 14 automated tests)

| Route prefix | Required role | Wrong role response |
|---|---|---|
| `/api/*dashboard*`, `/api/assignments`, `/api/profile`, etc. | `student` | `403 Forbidden` |
| `/api/trainer/*` | `trainer` | `403 Forbidden` |
| `/api/admin/*` | `admin` | `403 Forbidden` |
| Any protected route, no token | — | `401 Unauthorized` |
| Any protected route, malformed token | — | `401 Unauthorized` |

---

## Testing

```bash
npm test          # Run all 55 tests once
npm run test:watch # Watch mode
```

Tests run against a **real PostgreSQL database** (not mocked) — every query, join, and constraint is genuinely exercised.

| Test file | Tests | Covers |
|---|---|---|
| `auth.test.ts` | 13 | Login (all 3 roles), register, validation, suspended account, wrong password |
| `rbac.test.ts` | 14 | Every role × every route combination — no token, malformed token, wrong role, correct role |
| `courses.test.ts` | 9 | List, filter by subject, search, single course, 404 |
| `dashboard.test.ts` | 7 | All 8 student endpoints, profile update |
| `trainer.test.ts` | 5 | All 5 trainer endpoints |
| `admin.test.ts` | 7 | All 6 admin endpoints, user status update, announcement creation |

---

## API Reference

See `../numericode/API_CONTRACT.md` in the frontend repository for the complete, authoritative specification this backend implements — every endpoint, request body, response shape, and status code.

---

## Environment Variables

```bash
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/numericode
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4.1-mini
```

---

## Available Scripts

```bash
npm run dev          # Start with ts-node-dev (auto-restart on file change)
npm run build        # Compile TypeScript to dist/
npm start            # Run the compiled build (production)
npm run db:migrate   # Create all tables
npm run db:seed      # Seed demo data
npm test             # Run all 55 tests
```

---

## Connecting the Frontend

In the frontend project (`numericode/.env`):

```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ADSENSE_CLIENT=ca-pub-your-publisher-id
VITE_ADSENSE_HOME_SLOT=your-homepage-slot-id
VITE_LINKEDIN_URL=https://www.linkedin.com/company/your-company
VITE_FACEBOOK_URL=https://www.facebook.com/your-page
```

That's it — no other frontend code changes required. The Axios instance, all service functions, and every TypeScript type were already written against this exact contract in Phase 5.

---

## Prepared by
Nwafor Ugochukwu Emmanuel — Phase 10 Backend Integration — July 2026
