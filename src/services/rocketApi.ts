/**
 * services/rocketApi.ts
 *
 * Fetches rockets from Launch Library 2 and maps them to the internal `Rocket` model.
 */

import { API_BASE_URL, ROCKET_LIST_LIMIT, SPACEX_MANUFACTURER } from '@/config/api'
import type { ApiLauncherConfig, ApiPaginated, Rocket } from '@/types/rocket'

export class ApiError extends Error {
  constructor (message: string, public readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

function messageForStatus (status: number): string {
  if (status === 404) return 'Rocket not found'
  if (status === 429) return 'Rate limit reached. Please try again later.'
  return `Request failed (${status})`
}

async function request<T> (path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new Error('Network error. Please check your connection.')
  }

  if (!response.ok) {
    throw new ApiError(messageForStatus(response.status), response.status)
  }
  return response.json() as Promise<T>
}

/** Trims a string and turns empty values into null */
function clean (value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function toNumber (value: string | null | undefined): number | null {
  if (value == null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function toRocket (api: ApiLauncherConfig): Rocket {
  return {
    id: String(api.id),
    name: clean(api.full_name) ?? clean(api.name) ?? 'Unnamed rocket',
    description: clean(api.description),
    imageUrl: clean(api.image_url),
    costPerLaunch: toNumber(api.launch_cost),
    country: clean(api.manufacturer?.country_code),
    firstFlight: clean(api.maiden_flight),
    active: api.active ?? null,
    reusable: api.reusable ?? null,
    isLocal: false,
  }
}

export async function fetchSpaceXRockets (signal?: AbortSignal): Promise<Rocket[]> {
  const params = new URLSearchParams({
    manufacturer__name: SPACEX_MANUFACTURER,
    mode: 'detailed',
    limit: String(ROCKET_LIST_LIMIT),
  })
  const data = await request<ApiPaginated<ApiLauncherConfig>>(`/config/launcher/?${params}`, signal)
  return (data.results ?? []).map(toRocket)
}

export async function fetchRocket (id: string, signal?: AbortSignal): Promise<Rocket> {
  const data = await request<ApiLauncherConfig>(`/config/launcher/${encodeURIComponent(id)}/`, signal)
  return toRocket(data)
}
