/**
 * types/rocket.ts
 *
 * Raw Launch Library 2 (v2.2.0) response types and the normalized internal model.
 */

// --- API response types ---

export interface ApiManufacturer {
  id: number
  name: string
  country_code: string | null
}

export interface ApiLauncherConfig {
  id: number
  name: string
  full_name: string | null
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  active: boolean | null
  reusable: boolean | null
  manufacturer: ApiManufacturer | null
}

export interface ApiPaginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// --- Internal model ---

export interface Rocket {
  /** String(api id) for API rockets, `local-...` for rockets added in the client */
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  costPerLaunch: number | null
  /** Manufacturer country code, e.g. "USA" */
  country: string | null
  /** ISO date string (YYYY-MM-DD) */
  firstFlight: string | null
  active: boolean | null
  reusable: boolean | null
  isLocal: boolean
}

export type NewRocketInput = Pick<
  Rocket,
  'name' | 'description' | 'imageUrl' | 'costPerLaunch' | 'country' | 'firstFlight'
>

export type RocketStatusFilter = 'all' | 'active' | 'inactive' | 'reusable'
