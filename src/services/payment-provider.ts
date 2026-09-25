import {
  initializeTransaction as paystackInitialize,
  verifyTransaction as paystackVerify,
  verifyWebhookSignature as paystackVerifyWebhookSignature,
  isPaystackConfigured,
} from './paystack.service'
import {
  initializeCheckout as flutterwaveInitialize,
  verifyTransaction as flutterwaveVerify,
  verifyWebhookSignature as flutterwaveVerifyWebhookSignature,
  isFlutterwaveConfigured,
} from './flutterwave.service'

// ─── Payment provider abstraction (Phase 21 — Flutterwave + Paystack) ─────────
// One provider-neutral surface (initializeTransaction / verifyTransaction /
// verifyWebhookSignature) with per-provider adapters. The ACTIVE provider is
// chosen by PAYMENT_PROVIDER (default 'paystack' → safe rollback) and is used
// for NEW checkouts only. Existing payment records are ALWAYS verified through
// the provider that created them, so switching PAYMENT_PROVIDER never
// invalidates in-flight Paystack or Flutterwave payments.
// Secrets stay inside the provider services and are never exposed by this layer.

export type PaymentProviderName = 'paystack' | 'flutterwave'

export interface NormalizedVerification {
  status: 'success' | 'failed' | 'abandoned' | 'pending'
  reference: string
  amountSubunits: number
  currency: string
  providerTransactionId: string | null
  paidAt: string | null
  rawStatus: string
}

export interface InitializeCheckoutInput {
  email: string
  name?: string | null
  amountSubunits: number
  currency: string
  reference: string
  callbackUrl?: string
  courseTitle?: string
  metadata?: Record<string, unknown>
}

export interface PaymentProviderAdapter {
  name: PaymentProviderName
  isConfigured: () => boolean
  initializeTransaction: (input: InitializeCheckoutInput) => Promise<{ checkoutUrl: string; reference: string }>
  verifyTransaction: (reference: string) => Promise<NormalizedVerification>
  /** Authenticate an inbound webhook with the provider's documented scheme. */
  verifyWebhookSignature: (
    rawBody: Buffer | undefined,
    headers: Record<string, string | string[] | undefined>
  ) => boolean
}

const paystackAdapter: PaymentProviderAdapter = {
  name: 'paystack',
  isConfigured: isPaystackConfigured,
  initializeTransaction: async (input) => {
    const init = await paystackInitialize({
      email: input.email,
      amountSubunits: input.amountSubunits,
      currency: input.currency,
      reference: input.reference,
      callbackUrl: input.callbackUrl,
      metadata: input.metadata,
    })
    return { checkoutUrl: init.authorizationUrl, reference: init.reference }
  },
  verifyTransaction: paystackVerify,
  verifyWebhookSignature: (rawBody, headers) => {
    if (!rawBody) return false
    const signature = headers['x-paystack-signature']
    return paystackVerifyWebhookSignature(rawBody, Array.isArray(signature) ? signature[0] : signature)
  },
}

const flutterwaveAdapter: PaymentProviderAdapter = {
  name: 'flutterwave',
  isConfigured: isFlutterwaveConfigured,
  initializeTransaction: (input) =>
    flutterwaveInitialize({
      email: input.email,
      name: input.name,
      amountSubunits: input.amountSubunits,
      currency: input.currency,
      reference: input.reference,
      callbackUrl: input.callbackUrl,
      courseTitle: input.courseTitle,
      metadata: input.metadata,
    }),
  verifyTransaction: flutterwaveVerify,
  // Flutterwave authenticates webhooks with the `verif-hash` header (compared to
  // FLW_SECRET_HASH) rather than an HMAC over the body.
  verifyWebhookSignature: (_rawBody, headers) => flutterwaveVerifyWebhookSignature(headers['verif-hash']),
}

const ADAPTERS: Record<PaymentProviderName, PaymentProviderAdapter> = {
  paystack: paystackAdapter,
  flutterwave: flutterwaveAdapter,
}

export function isPaymentProviderName(value: unknown): value is PaymentProviderName {
  return value === 'paystack' || value === 'flutterwave'
}

/** The provider used for NEW checkouts. Unset/invalid → Paystack (rollback-safe). */
export function getActiveProviderName(): PaymentProviderName {
  const configured = (process.env.PAYMENT_PROVIDER ?? '').trim().toLowerCase()
  if (!configured) return 'paystack'
  if (isPaymentProviderName(configured)) return configured
  console.warn(`Unknown PAYMENT_PROVIDER "${configured}" — falling back to paystack`)
  return 'paystack'
}

export function getActiveProvider(): PaymentProviderAdapter {
  return ADAPTERS[getActiveProviderName()]
}

/** Verification always follows the RECORD's provider, not the active setting. */
export function getProviderByName(name: string | null | undefined): PaymentProviderAdapter {
  return isPaymentProviderName(name) ? ADAPTERS[name] : getActiveProvider()
}
