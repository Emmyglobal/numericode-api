import type { Request, Response, NextFunction } from 'express'
import { query } from '../db/pool'
import { ok, fail, notFound } from '../utils/response'
import { notifyUser } from '../utils/notify'

interface BadgeRow {
  id: string; name: string; description: string; icon_url: string | null
  criteria: unknown; created_at: Date
}

interface UserBadgeRow {
  id: string; user_id: string; badge_id: string; course_id: string | null; earned_at: Date
}

interface TemplateRow {
  id: string; name: string; html_template: string; css_styles: string
  is_default: boolean; created_at: Date
}

interface PenaltyRow {
  id: string; assignment_id: string; penalty_per_hour: number
  max_penalty: number; grace_period: number; created_at: Date
}

// ─── Badges ──────────────────────────────────────────────────────────────────

export async function listBadges(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<BadgeRow>(
      'SELECT * FROM badges ORDER BY created_at DESC'
    )

    return ok(res, rows.map(b => ({
      id: b.id,
      name: b.name,
      description: b.description,
      iconUrl: b.icon_url,
      criteria: b.criteria,
      createdAt: b.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function createBadge(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, iconUrl, criteria } = req.body as {
      name: string; description: string; iconUrl?: string; criteria: unknown
    }

    if (!name || !description || !criteria) {
      return fail(res, 'Name, description, and criteria are required', 400)
    }

    const { rows: [badge] } = await query<BadgeRow>(
      `INSERT INTO badges (name, description, icon_url, criteria)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, iconUrl || null, JSON.stringify(criteria)]
    )

    return ok(res, {
      id: badge.id,
      name: badge.name,
      description: badge.description,
      iconUrl: badge.icon_url,
      criteria: badge.criteria,
      createdAt: badge.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function updateBadge(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, iconUrl, criteria } = req.body as {
      name?: string; description?: string; iconUrl?: string; criteria?: unknown
    }

    const { rows: [badge] } = await query<BadgeRow>(
      `UPDATE badges SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        icon_url = COALESCE($3, icon_url),
        criteria = COALESCE($4, criteria)
       WHERE id = $5 RETURNING *`,
      [name, description, iconUrl, criteria ? JSON.stringify(criteria) : undefined, req.params.badgeId]
    )

    if (!badge) return notFound(res, 'Badge not found')

    return ok(res, {
      id: badge.id,
      name: badge.name,
      description: badge.description,
      iconUrl: badge.icon_url,
      criteria: badge.criteria,
      createdAt: badge.created_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteBadge(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query('DELETE FROM badges WHERE id = $1 RETURNING id', [req.params.badgeId])
    if (!rows[0]) return notFound(res, 'Badge not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── User Badges ─────────────────────────────────────────────────────────────

export async function getUserBadges(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId

    const { rows } = await query<(UserBadgeRow & { badge_name: string; badge_description: string; badge_icon: string | null; course_title: string | null })>(
      `SELECT ub.*, b.name as badge_name, b.description as badge_description, 
        b.icon_url as badge_icon, c.title as course_title
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       LEFT JOIN courses c ON c.id = ub.course_id
       WHERE ub.user_id = $1
       ORDER BY ub.earned_at DESC`,
      [userId]
    )

    return ok(res, rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      badgeId: r.badge_id,
      badgeName: r.badge_name,
      badgeDescription: r.badge_description,
      badgeIcon: r.badge_icon,
      courseId: r.course_id,
      courseTitle: r.course_title,
      earnedAt: r.earned_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function awardBadge(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, badgeId, courseId } = req.body as {
      userId: string; badgeId: string; courseId?: string
    }

    if (!userId || !badgeId) {
      return fail(res, 'User ID and badge ID are required', 400)
    }

    const { rows: [userBadge] } = await query<UserBadgeRow>(
      `INSERT INTO user_badges (user_id, badge_id, course_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, badgeId, courseId || null]
    )

    // Send notification to user
    const { rows: [badge] } = await query<{ name: string }>('SELECT name FROM badges WHERE id = $1', [badgeId])
    if (badge) {
      await notifyUser(
        userId,
        'Badge Earned!',
        `Congratulations! You've earned the "${badge.name}" badge`,
        'general',
        '/dashboard/badges'
      )
    }

    return ok(res, {
      id: userBadge.id,
      userId: userBadge.user_id,
      badgeId: userBadge.badge_id,
      courseId: userBadge.course_id,
      earnedAt: userBadge.earned_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

// ─── Certificate Templates ───────────────────────────────────────────────────

export async function listCertificateTemplates(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<TemplateRow>(
      'SELECT * FROM certificate_templates ORDER BY is_default DESC, created_at DESC'
    )

    return ok(res, rows.map(t => ({
      id: t.id,
      name: t.name,
      htmlTemplate: t.html_template,
      cssStyles: t.css_styles,
      isDefault: t.is_default,
      createdAt: t.created_at.toISOString(),
    })))
  } catch (err) { next(err) }
}

export async function createCertificateTemplate(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, htmlTemplate, cssStyles, isDefault } = req.body as {
      name: string; htmlTemplate: string; cssStyles?: string; isDefault?: boolean
    }

    if (!name || !htmlTemplate) {
      return fail(res, 'Name and HTML template are required', 400)
    }

    const { rows: [template] } = await query<TemplateRow>(
      `INSERT INTO certificate_templates (name, html_template, css_styles, is_default)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, htmlTemplate, cssStyles || '', isDefault || false]
    )

    return ok(res, {
      id: template.id,
      name: template.name,
      htmlTemplate: template.html_template,
      cssStyles: template.css_styles,
      isDefault: template.is_default,
      createdAt: template.created_at.toISOString(),
    }, 201)
  } catch (err) { next(err) }
}

export async function updateCertificateTemplate(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, htmlTemplate, cssStyles, isDefault } = req.body as {
      name?: string; htmlTemplate?: string; cssStyles?: string; isDefault?: boolean
    }

    const { rows: [template] } = await query<TemplateRow>(
      `UPDATE certificate_templates SET
        name = COALESCE($1, name),
        html_template = COALESCE($2, html_template),
        css_styles = COALESCE($3, css_styles),
        is_default = COALESCE($4, is_default)
       WHERE id = $5 RETURNING *`,
      [name, htmlTemplate, cssStyles, isDefault, req.params.templateId]
    )

    if (!template) return notFound(res, 'Template not found')

    return ok(res, {
      id: template.id,
      name: template.name,
      htmlTemplate: template.html_template,
      cssStyles: template.css_styles,
      isDefault: template.is_default,
      createdAt: template.created_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteCertificateTemplate(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query('DELETE FROM certificate_templates WHERE id = $1 RETURNING id', [req.params.templateId])
    if (!rows[0]) return notFound(res, 'Template not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}

// ─── Late Submission Penalties ───────────────────────────────────────────────

export async function getLateSubmissionPenalty(req: Request, res: Response, next: NextFunction) {
  try {
    const { assignmentId } = req.params

    const { rows: [penalty] } = await query<PenaltyRow>(
      'SELECT * FROM late_submission_penalties WHERE assignment_id = $1',
      [assignmentId]
    )

    if (!penalty) {
      return ok(res, null)
    }

    return ok(res, {
      id: penalty.id,
      assignmentId: penalty.assignment_id,
      penaltyPerHour: Number(penalty.penalty_per_hour),
      maxPenalty: Number(penalty.max_penalty),
      gracePeriod: penalty.grace_period,
      createdAt: penalty.created_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function setLateSubmissionPenalty(req: Request, res: Response, next: NextFunction) {
  try {
    const { assignmentId } = req.params
    const { penaltyPerHour, maxPenalty, gracePeriod } = req.body as {
      penaltyPerHour: number; maxPenalty: number; gracePeriod: number
    }

    const { rows: [penalty] } = await query<PenaltyRow>(
      `INSERT INTO late_submission_penalties (assignment_id, penalty_per_hour, max_penalty, grace_period)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (assignment_id) 
       DO UPDATE SET 
         penalty_per_hour = EXCLUDED.penalty_per_hour,
         max_penalty = EXCLUDED.max_penalty,
         grace_period = EXCLUDED.grace_period
       RETURNING *`,
      [assignmentId, penaltyPerHour, maxPenalty, gracePeriod]
    )

    return ok(res, {
      id: penalty.id,
      assignmentId: penalty.assignment_id,
      penaltyPerHour: Number(penalty.penalty_per_hour),
      maxPenalty: Number(penalty.max_penalty),
      gracePeriod: penalty.grace_period,
      createdAt: penalty.created_at.toISOString(),
    })
  } catch (err) { next(err) }
}

export async function deleteLateSubmissionPenalty(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query(
      'DELETE FROM late_submission_penalties WHERE assignment_id = $1 RETURNING id',
      [req.params.assignmentId]
    )
    if (!rows[0]) return notFound(res, 'Penalty not found')
    return ok(res, { deleted: true })
  } catch (err) { next(err) }
}