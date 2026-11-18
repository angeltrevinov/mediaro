/**
 * Formats a runtime in minutes as `2h 5m`, `2h` or `45m`
 */
export function formatRuntime(minutes?: number | null): string | null {
  if (!minutes || minutes <= 0) return null
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

/**
 * Extracts the year from an ISO date string (YYYY-MM-DD)
 */
export function getYear(date?: string | null): string | null {
  if (!date) return null
  const year = date.slice(0, 4)
  return /^\d{4}$/.test(year) ? year : null
}
