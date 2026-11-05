export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(' ')
}

export function formatArray(array: readonly number[]): string {
  return `[${array.join(', ')}]`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function formatDuration(
  startedAt: number | null,
  finishedAt: number | null,
): string {
  if (!startedAt) {
    return '—'
  }

  const end = finishedAt ?? Date.now()
  const totalSeconds = Math.max(0, Math.round((end - startedAt) / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return minutes > 0 ? `${minutes} хв ${seconds} с` : `${seconds} с`
}

export function formatDate(isoDate: string | null): string {
  if (!isoDate) {
    return '—'
  }

  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
