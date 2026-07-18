import type { NextFunction, Request, Response } from 'express'
import { query } from '../db/pool'
import { fail, notFound, ok } from '../utils/response'
import type { SubscriptionRow } from '../types'

function serialize(subscription: SubscriptionRow) {
  return {
    id: subscription.id, planCode: subscription.plan_code, status: subscription.status,
    provider: subscription.provider, startsAt: subscription.starts_at.toISOString(),
    endsAt: subscription.ends_at.toISOString(), isActive: subscription.status === 'active' && subscription.ends_at > new Date(),
  }
}

export async function getMySubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await query<SubscriptionRow>(
      `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY (status = 'active' AND ends_at > NOW()) DESC, ends_at DESC LIMIT 1`,
      [req.user!.userId]
    )
    return ok(res, rows[0] ? serialize(rows[0]) : { isActive: false, status: 'none' })
  } catch (error) { next(error) }
}

/**
 * Creates a provider-neutral payment intent. A Paystack, Flutterwave, or Stripe adapter can
 * consume this contract and later activate the subscription from its webhook.
 */
export async function createCheckoutIntent(req: Request, res: Response, next: NextFunction) {
  try {
    const { provider } = req.body as { provider?: string }
    if (provider && !['paystack', 'flutterwave', 'stripe'].includes(provider)) {
      return fail(res, 'Unsupported payment provider', 400)
    }
    const { rows } = await query<SubscriptionRow>(
      `INSERT INTO subscriptions (user_id, provider, ends_at) VALUES ($1, $2, NOW() + INTERVAL '30 days') RETURNING *`,
      [req.user!.userId, provider ?? null]
    )
    return ok(res, { subscription: serialize(rows[0]), checkoutRequired: true }, 201)
  } catch (error) { next(error) }
}

export async function grantSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const { status = 'active', endsAt, provider, providerReference } = req.body as {
      status?: string; endsAt?: string; provider?: string; providerReference?: string
    }
    if (!['pending', 'active', 'cancelled', 'expired'].includes(status)) return fail(res, 'Invalid subscription status', 400)
    const expiresAt = endsAt ? new Date(endsAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    if (Number.isNaN(expiresAt.valueOf())) return fail(res, 'endsAt must be a valid date', 400)
    const { rows: users } = await query<{ id: string }>(`SELECT id FROM users WHERE id = $1 AND role = 'student'`, [req.params.userId])
    if (!users[0]) return notFound(res, 'Student not found')
    const { rows } = await query<SubscriptionRow>(
      `INSERT INTO subscriptions (user_id, status, provider, provider_reference, ends_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.params.userId, status, provider ?? 'manual', providerReference ?? null, expiresAt]
    )
    return ok(res, serialize(rows[0]), 201)
  } catch (error) { next(error) }
}
