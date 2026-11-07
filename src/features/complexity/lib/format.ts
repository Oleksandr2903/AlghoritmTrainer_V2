export function cn(...classes: ReadonlyArray<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

const numberFormatter = new Intl.NumberFormat('uk-UA')

export function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value))
}

function formatDecimal(value: number): string {
  const digits = value < 10 ? 1 : 0
  return value.toFixed(digits).replace('.', ',')
}

export function formatOperations(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value < 1_000) return formatNumber(value)

  const units = [
    { threshold: 1_000_000_000_000, label: 'трлн' },
    { threshold: 1_000_000_000, label: 'млрд' },
    { threshold: 1_000_000, label: 'млн' },
    { threshold: 1_000, label: 'тис.' },
  ] as const

  const unit = units.find((entry) => value >= entry.threshold)
  if (!unit) return formatNumber(value)

  return `${formatDecimal(value / unit.threshold)} ${unit.label}`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase('uk-UA')
}
