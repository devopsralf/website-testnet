// Client for ironfish-http-api.
import { magic } from 'utils/magic'

import {
  ApiUserMetadata,
  ApiError,
  ApiUser,
  ListEventsResponse,
  ListLeaderboardResponse,
  MetricsConfigResponse,
  UserMetricsResponse,
  LoginEvent,
} from './types'
import { LocalError } from './errors'

// Environment variables set in Vercel config.
const SERVER_API_URL = process.env.API_URL
const SERVER_API_KEY = process.env.API_KEY
const BROWSER_API_URL = process.env.NEXT_PUBLIC_API_URL
const BROWSER_API_KEY = process.env.NEXT_PUBLIC_API_KEY

const API_URL = SERVER_API_URL || BROWSER_API_URL
const API_KEY = SERVER_API_KEY || BROWSER_API_KEY

export async function createUser(
  email: string,
  graffiti: string,
  socialChoice: string,
  social: string,
  country_code: string
): Promise<ApiUser | ApiError> {
  const body = JSON.stringify({
    email,
    graffiti,
    country_code,
    [socialChoice]: social,
  })
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body,
  })
  return await res.json()
}

export async function listLeaderboard({
  search,
  country_code: countryCode,
  event_type: eventType,
}: {
  search?: string
  country_code?: string
  event_type?: string
} = {}): Promise<ListLeaderboardResponse | ApiError> {
  const params = new URLSearchParams({
    order_by: 'rank',
  })
  if (search) {
    params.append('search', search)
  }
  if (countryCode) {
    params.append('country_code', countryCode)
  }
  if (eventType) {
    params.append('event_type', eventType)
  }
  const res = await fetch(`${API_URL}/users?${params.toString()}`)
  return await res.json()
}

// Returns the start date of the current week of the testnet.
// Each week starts on Monday at midnight UTC.
function getWeeklyStart(): Date {
  const d = new Date()

  // Days are 0-based, so Monday is 1. On Tuesday (2) we
  // want the offset to be 1, and Sunday we want the offset to be 6.
  const dayOffset = (d.getUTCDay() + 6) % 7

  d.setUTCDate(d.getUTCDate() - dayOffset)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export async function getUser(userId: string): Promise<ApiUser | ApiError> {
  const res = await fetch(`${API_URL}/users/${userId}`)
  return await res.json()
}

export async function getUserWeeklyMetrics(
  userId: string
): Promise<UserMetricsResponse | ApiError> {
  const start = getWeeklyStart()
  const end = new Date()

  const res = await fetch(
    `${API_URL}/users/${userId}/metrics?granularity=total&start=${start.toISOString()}&end=${end.toISOString()}`
  )
  return await res.json()
}

export async function getUserAllTimeMetrics(
  userId: string
): Promise<UserMetricsResponse | ApiError> {
  const res = await fetch(
    `${API_URL}/users/${userId}/metrics?granularity=lifetime`
  )
  return await res.json()
}

export async function listEvents({
  userId,
  after,
  limit,
  before,
}: {
  userId: string
  after?: string
  limit?: number
  before?: string
}): Promise<ListEventsResponse | ApiError> {
  const params = new URLSearchParams({
    user_id: userId,
    ...(after ? { after } : {}),
    ...(before ? { before } : {}),
    ...(limit ? { limit: limit.toString() } : {}),
  })
  const res = await fetch(`${API_URL}/events?${params.toString()}`)
  return await res.json()
}

export async function getMetricsConfig(): Promise<
  MetricsConfigResponse | ApiError
> {
  const res = await fetch(`${API_URL}/metrics/config`)
  return await res.json()
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function login(email: string): Promise<any> {
  if (typeof window === 'undefined' || !magic) {
    return new LocalError('Only runnable in the browser', 500)
  }
  try {
    await magic.auth.loginWithMagicLink({
      email,
      redirectURI: new URL(`/callback`, window.location.origin).href,
    })
    const token = await magic.user.getIdToken()
    const auth = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (auth) {
      return { statusCode: 200, loaded: true }
    }
  } catch (e) {
    return new LocalError(e.message, 500)
  }
}

export async function getUserDetails(
  token: string
): Promise<ApiUserMetadata | ApiError | LocalError> {
  try {
    const data = await fetch(`${API_URL}/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return data.json()
  } catch (e) {
    return new LocalError(e.message, 500)
  }
}

export async function tokenLogin(): Promise<LoginEvent | LocalError> {
  if (typeof window === 'undefined' || !magic) {
    return new LocalError('Only runnable in the browser', 500)
  }
  try {
    const token = await magic.auth.loginWithCredential()
    const res = await fetch(`/api/login`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return res.json()
  } catch (e) {
    return new LocalError(e.message, 500)
  }
}
