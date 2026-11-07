import { useMemo, useState } from 'react'
import type { OperationRow } from './types'
import { formatNumber, formatOperations } from '../lib/format'

export const MIN_EXPONENT = 2
export const MAX_EXPONENT = 7
export const DEFAULT_EXPONENT = 6

interface EstimateDefinition {
  readonly id: string
  readonly name: string
  readonly formula: string
  readonly estimate: (n: number) => number
  readonly badgeClassName: string
  readonly barClassName: string
}

const DEFINITIONS: readonly EstimateDefinition[] = [
  {
    id: 'merge',
    name: 'Злиттям',
    formula: '≈ n log₂ n',
    estimate: (n) => n * Math.log2(n),
    badgeClassName: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    barClassName: 'bg-emerald-500',
  },
  {
    id: 'quick',
    name: 'Швидке',
    formula: '≈ 1,4 n log₂ n',
    estimate: (n) => 1.39 * n * Math.log2(n),
    badgeClassName: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    barClassName: 'bg-sky-500',
  },
  {
    id: 'heap',
    name: 'Пірамідальне',
    formula: '≈ 2 n log₂ n',
    estimate: (n) => 2 * n * Math.log2(n),
    badgeClassName: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    barClassName: 'bg-violet-500',
  },
  {
    id: 'bubble',
    name: 'Бульбашкою',
    formula: '≈ n² / 2',
    estimate: (n) => (n * (n - 1)) / 2,
    badgeClassName: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    barClassName: 'bg-rose-500',
  },
  {
    id: 'insertion',
    name: 'Вставками',
    formula: '≈ n² / 2',
    estimate: (n) => (n * (n - 1)) / 2,
    badgeClassName: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    barClassName: 'bg-amber-500',
  },
  {
    id: 'selection',
    name: 'Вибором',
    formula: '≈ n² / 2',
    estimate: (n) => (n * (n - 1)) / 2,
    badgeClassName: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    barClassName: 'bg-rose-400',
  },
]

export function useOperationsEstimator() {
  const [exponent, setExponentState] = useState(DEFAULT_EXPONENT)
  const n = 10 ** exponent

  const rows = useMemo<OperationRow[]>(() => {
    const raw = DEFINITIONS.map((definition) => ({
      ...definition,
      operations: Math.round(definition.estimate(n)),
    }))
    const maximum = Math.max(...raw.map((row) => row.operations), 1)
    const fastest = Math.min(...raw.map((row) => row.operations))

    return raw
      .sort((first, second) => first.operations - second.operations)
      .map((row) => {
        const percent = (row.operations / maximum) * 100
        return {
          id: row.id,
          name: row.name,
          formula: row.formula,
          operations: row.operations,
          display: formatOperations(row.operations),
          percent,
          segments: Math.max(1, Math.round(percent / 5)),
          slowdown: row.operations / fastest,
          badgeClassName: row.badgeClassName,
          barClassName: row.barClassName,
        }
      })
  }, [n])

  const setExponent = (value: number) => {
    setExponentState(Math.min(Math.max(Math.round(value), MIN_EXPONENT), MAX_EXPONENT))
  }

  return {
    exponent,
    setExponent,
    n,
    nLabel: formatNumber(n),
    rows,
    minExponent: MIN_EXPONENT,
    maxExponent: MAX_EXPONENT,
  }
}
