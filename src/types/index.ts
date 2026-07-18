// ─── Shared enums ─────────────────────────────────────────────────────────────
export type Subject              = 'mathematics' | 'programming'
export type Level                = 'beginner' | 'intermediate' | 'advanced'
export type UserRole             = 'student' | 'trainer' | 'admin'
export type UserStatus           = 'active' | 'suspended' | 'pending'
export type CourseStatus         = 'published' | 'draft' | 'archived'
export type CourseAccessLevel    = 'free' | 'premium'
export type AssignmentStatus     = 'pending' | 'submitted' | 'under_review' | 'graded' | 'passed' | 'failed' | 'overdue'
export type SubscriptionStatus   = 'pending' | 'active' | 'cancelled' | 'expired'
export type SessionStatus        = 'scheduled' | 'live' | 'completed'
export type ResourceType         = 'pdf' | 'video' | 'link'
export type AnnouncementAudience = 'all' | 'students' | 'trainers'

// ─── DB row shapes (snake_case matches PostgreSQL) ────────────────────────────
export interface UserRow {
  id: string; name: string; email: string; password_hash: string
  role: UserRole; status: UserStatus; bio: string; avatar_url: string | null; created_at: Date; last_active: Date
}
export interface CourseRow {
  id: string; title: string; description: string; subject: Subject
  level: Level; instructor_id: string; status: CourseStatus
  lesson_count: number; outcomes: string[]; thumbnail_url: string | null
  access_level: CourseAccessLevel; price_cents: number; currency: string; premium_enabled: boolean
  created_at: Date
}
export interface ModuleRow    { id: string; course_id: string; title: string; position: number }
export interface LessonRow    { id: string; module_id: string; title: string; duration: number; position: number }
export interface ResourceRow  { id: string; lesson_id: string; title: string; type: ResourceType; url: string }
export interface LiveClassRow {
  id: string; course_id: string; title: string; date: Date
  duration: number; meet_url: string; status: SessionStatus; attendees: number
}
export interface EnrollmentRow { id: string; user_id: string; course_id: string; progress: number; enrolled_at: Date }
export interface LessonCompletionRow { id: string; user_id: string; lesson_id: string; completed_at: Date }
export interface AssignmentRow { id: string; course_id: string; title: string; due_date: Date; total_marks: number; passing_score: number; created_at: Date }
export interface SubmissionRow { id: string; assignment_id: string; user_id: string; status: AssignmentStatus; submitted_at: Date | null; content: string | null; score: number | null; feedback: string | null; graded_at: Date | null; returned_for_correction: boolean }
export interface SubscriptionRow { id: string; user_id: string; plan_code: string; status: SubscriptionStatus; provider: string | null; provider_reference: string | null; starts_at: Date; ends_at: Date; created_at: Date }
export interface AnnouncementRow { id: string; title: string; body: string; audience: AnnouncementAudience; created_by: string; created_at: Date }

// ─── API response types (camelCase matches frontend) ─────────────────────────
export interface ApiResponse<T> { success: boolean; data: T | null; message?: string }
export interface AuthUser { id: string; name: string; email: string; role: UserRole; createdAt: string }
export interface AuthResponse { user: AuthUser; token: string }
export interface JwtPayload { userId: string; role: UserRole; iat?: number; exp?: number }

// ─── Express augmentation ────────────────────────────────────────────────────
declare global {
  namespace Express {
    interface Request { user?: JwtPayload }
  }
}
