export type FormatDateOptions = {
  /** Full month name (e.g. April) instead of short (Apr). */
  longMonth?: boolean
}

export function formatDate(iso: string, options?: FormatDateOptions) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: options?.longMonth ? 'long' : 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}
