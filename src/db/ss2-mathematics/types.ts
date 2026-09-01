// ─── SS2 Mathematics — First Term: seed data types ───────────────────────────
// Content-only data shapes used by the idempotent SS2 Mathematics seeder
// (see ./index.ts). They mirror the existing courses/modules/lessons schema —
// no new tables, no new API surface.

export interface Ss2LessonData {
  title: string
  duration: number
  content: string
}

export interface Ss2ModuleData {
  title: string
  lessons: Ss2LessonData[]
}
