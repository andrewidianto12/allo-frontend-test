/**
 * utils/format.ts
 *
 * Display formatters with fallbacks for missing data.
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

export function formatCurrency (value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return 'N/A'
  return currencyFormatter.format(value)
}

export function formatDate (value: string | null | undefined): string {
  if (!value) return 'Unknown'
  // Parse date-only strings as UTC to avoid off-by-one-day shifts
  const date = new Date(ISO_DATE_ONLY.test(value) ? `${value}T00:00:00Z` : value)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return dateFormatter.format(date)
}
