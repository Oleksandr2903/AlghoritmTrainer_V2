export function arraysEqual(
  first: readonly number[],
  second: readonly number[],
): boolean {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  )
}

export function serializeNumberArray(values: readonly number[]): string {
  return values.join(',')
}

export function parseNumberArrayInput(input: string): number[] | null {
  const cleaned = input.replace(/[[\]]/g, ' ').trim()

  if (!cleaned) {
    return null
  }

  const parts = cleaned.split(/[,;\s]+/).filter(Boolean)
  const numbers = parts.map(Number)

  if (numbers.some((value) => Number.isNaN(value))) {
    return null
  }

  return numbers
}
