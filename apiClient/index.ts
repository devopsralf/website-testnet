// Client for ironfish-http-api.

// Environment variables set in Vercel config.
const API_URL = process.env.API_URL;

export type ApiEvent = {
  id: number;
  created_at: string;
  updated_at: string;
  type: string;
  occurred_at: string;
  points: number;
  user_id: number;
}

export type ApiUser = {
  id: number;
  created_at: string;
  updated_at: string;
  email: string;
  graffiti: string;
  discord_username: string | null;
  telegram_username: string | null;
  total_points: number;
}

type ApiError = {
  statusCode: number;
  message: ReadonlyArray<string>;
  error: string;
}
  
type ListEventsResponse = {
  data: ReadonlyArray<ApiEvent>
}

type ListLeaderboardResponse = {
  data: ReadonlyArray<ApiUser>
}

export async function listLeaderboard(): Promise<ListLeaderboardResponse | ApiError> {
  const res = await fetch(`${API_URL}/users?order_by=total_points`)
  return await res.json()
}

export async function getUser(userId: string): Promise<ApiUser | ApiError> {
  const res = await fetch(`${API_URL}/users/${userId}`)
  return await res.json()
}

export async function listEvents(userId: string): Promise<ListEventsResponse | ApiError> {
  const res = await fetch(`${API_URL}/events?user_id=${userId}`)
  return await res.json()
}
