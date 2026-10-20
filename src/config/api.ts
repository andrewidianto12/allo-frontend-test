/**
 * config/api.ts
 *
 * Launch Library 2 API configuration (version 2.2.0, dev host).
 */

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'https://lldev.thespacedevs.com/2.2.0'

export const SPACEX_MANUFACTURER = 'SpaceX'

export const ROCKET_LIST_LIMIT = 20
