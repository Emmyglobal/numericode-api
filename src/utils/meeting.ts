/**
 * Meeting provider integration — Google Meet & Zoom.
 *
 * Both providers use server-to-server OAuth with a service account.
 * Credentials are loaded from environment variables.
 *
 * ── Google Meet ────────────────────────────────────────────────
 *   MEET_SERVICE_ACCOUNT_EMAIL  — service account client email
 *   MEET_PRIVATE_KEY            — service account private key
 *
 * ── Zoom ──────────────────────────────────────────────────────
 *   ZOOM_ACCOUNT_ID             — Zoom Data Center (DC) account id
 *   ZOOM_CLIENT_ID              — Zoom Server-to-Server OAuth app client id
 *   ZOOM_CLIENT_SECRET          — Zoom Server-to-Server OAuth app client secret
 */

interface MeetingInput {
  title: string
  startTime: Date
  durationMinutes: number
}

interface MeetingOutput {
  url: string
  provider: 'google_meet' | 'zoom'
}

// ── Google Meet ───────────────────────────────────────────────

/**
 * Creates a Google Calendar event with Google Meet video-conference
 * and returns the meet link.  Uses a service-account that has
 * domain-wide delegation enabled.
 */
async function createGoogleMeetLink(input: MeetingInput): Promise<string> {
  const { google } = await import('googleapis')

  const auth = new google.auth.JWT({
    email:     process.env.MEET_SERVICE_ACCOUNT_EMAIL,
    key:       (process.env.MEET_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    scopes:    ['https://www.googleapis.com/auth/calendar.events'],
    subject:   process.env.MEET_IMPERSONATE_USER,   // user to act as
  })

  const calendar = google.calendar({ version: 'v3', auth })

  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary:     input.title,
      start:       { dateTime: input.startTime.toISOString(), timeZone: 'Africa/Lagos' },
      end:         { dateTime: new Date(input.startTime.getTime() + input.durationMinutes * 60000).toISOString(), timeZone: 'Africa/Lagos' },
      conferenceData: {
        createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
      },
    },
    conferenceDataVersion: 1,
  })

  const hangoutLink = event.data.hangoutLink
  if (!hangoutLink) throw new Error('Google Meet link was not generated')
  return hangoutLink
}

// ── Zoom ──────────────────────────────────────────────────────

let _zoomAccessToken: { token: string; expiresAt: number } | null = null

async function getZoomAccessToken(): Promise<string> {
  if (_zoomAccessToken && Date.now() < _zoomAccessToken.expiresAt) {
    return _zoomAccessToken.token
  }

  const resp = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      },
    },
  )

  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`Zoom OAuth failed: ${resp.status} ${body}`)
  }

  const json = (await resp.json()) as { access_token: string; expires_in: number }
  _zoomAccessToken = { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 }
  return json.access_token
}

async function createZoomMeetingLink(input: MeetingInput): Promise<string> {
  const token = await getZoomAccessToken()

  const resp = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic:      input.title,
      type:       2, // scheduled meeting
      start_time: input.startTime.toISOString(),
      duration:   input.durationMinutes,
      timezone:   'Africa/Lagos',
      settings: {
        host_video:          true,
        participant_video:   true,
        join_before_host:    true,
        mute_upon_entry:     false,
        auto_recording:      'none',
      },
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`Zoom meeting creation failed: ${resp.status} ${body}`)
  }

  const json = (await resp.json()) as { join_url: string }
  return json.join_url
}

// ── Public API ────────────────────────────────────────────────

export async function createMeetingLink(input: MeetingInput): Promise<MeetingOutput> {
  // Prefer Zoom if credentials are configured, fallback to Google Meet.
  if (process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET) {
    const url = await createZoomMeetingLink(input)
    return { url, provider: 'zoom' }
  }

  if (process.env.MEET_SERVICE_ACCOUNT_EMAIL && process.env.MEET_PRIVATE_KEY) {
    const url = await createGoogleMeetLink(input)
    return { url, provider: 'google_meet' }
  }

  // No meeting provider configured — return a placeholder.
  // The caller can still set a manual meet_url on the live_class row.
  throw new Error('No meeting provider configured. Set Zoom or Google Meet credentials.')
}