import { useCallback, useMemo, useState } from 'react'
import type { ChartTick, GrowthSeries } from './types'
import { formatNumber } from '../lib/format'

export type ChartScale = 'linear' | 'log'

const N_MAX = 64
const MAX_OPERATIONS = N_MAX * N_MAX
const WIDTH = 580
const HEIGHT = 280
const PADDING = { top: 18, right: 18, bottom: 34, left: 58 } as const

const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom
const SAMPLE_STEP = 2

interface CurveDefinition {
  readonly id: string
  readonly label: string
  readonly strokeClassName: string
  readonly textClassName: string
  readonly dotClassName: string
  readonly formula: (n: number) => number
}

const CURVES: readonly CurveDefinition[] = [
  {
    id: 'constant',
    label: 'O(1)',
    strokeClassName: 'stroke-violet-500',
    textClassName: 'text-violet-400',
    dotClassName: 'bg-violet-500',
    formula: () => 1,
  },
  {
    id: 'logarithmic',
    label: 'O(log n)',
    strokeClassName: 'stroke-amber-500',
    textClassName: 'text-amber-400',
    dotClassName: 'bg-amber-500',
    formula: (n) => Math.log2(n + 2),
  },
  {
    id: 'linear',
    label: 'O(n)',
    strokeClassName: 'stroke-sky-500',
    textClassName: 'text-sky-400',
    dotClassName: 'bg-sky-500',
    formula: (n) => n,
  },
  {
    id: 'linearithmic',
    label: 'O(n log n)',
    strokeClassName: 'stroke-emerald-500',
    textClassName: 'text-emerald-400',
    dotClassName: 'bg-emerald-500',
    formula: (n) => n * Math.log2(n + 2),
  },
  {
    id: 'quadratic',
    label: 'O(n²)',
    strokeClassName: 'stroke-rose-500',
    textClassName: 'text-rose-400',
    dotClassName: 'bg-rose-500',
    formula: (n) => n * n,
  },
]

function normalizeValue(value: number, scale: ChartScale): number {
  if (scale === 'log') {
    return Math.log10(value + 1) / Math.log10(MAX_OPERATIONS + 1)
  }
  return value / MAX_OPERATIONS
}

function buildPath(formula: (n: number) => number, scale: ChartScale): string {
  const commands: string[] = []

  for (let n = 0; n <= N_MAX; n += SAMPLE_STEP) {
    const x = PADDING.left + (n / N_MAX) * PLOT_WIDTH
    const normalized = Math.min(Math.max(normalizeValue(formula(n), scale), 0), 1)
    const y = PADDING.top + PLOT_HEIGHT * (1 - normalized)
    commands.push(`${commands.length === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }

  return commands.join(' ')
}

function buildXTicks(): ChartTick[] {
  return [0, 16, 32, 48, 64].map((value) => ({
    position: PADDING.left + (value / N_MAX) * PLOT_WIDTH,
    label: String(value),
  }))
}

function buildYTicks(scale: ChartScale): ChartTick[] {
  if (scale === 'log') {
    const denominator = Math.log10(MAX_OPERATIONS + 1)
    return [1, 10, 100, 1000, MAX_OPERATIONS].map((value) => ({
      position: PADDING.top + PLOT_HEIGHT * (1 - Math.log10(value + 1) / denominator),
      label: formatNumber(value),
    }))
  }

  return [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
    position: PADDING.top + PLOT_HEIGHT * (1 - fraction),
    label: formatNumber(fraction * MAX_OPERATIONS),
  }))
}

export function useGrowthChart() {
  const [scale, setScale] = useState<ChartScale>('log')
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(() => new Set())

  const series = useMemo<GrowthSeries[]>(() => {
    return CURVES.map((curve) => ({
      id: curve.id,
      label: curve.label,
      strokeClassName: curve.strokeClassName,
      textClassName: curve.textClassName,
      dotClassName: curve.dotClassName,
      path: buildPath(curve.formula, scale),
    }))
  }, [scale])

  const xTicks = useMemo(() => buildXTicks(), [])
  const yTicks = useMemo(() => buildYTicks(scale), [scale])

  const toggleSeries = useCallback((id: string) => {
    setHiddenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
        return next
      }

      if (next.size >= CURVES.length - 1) return current
      next.add(id)
      return next
    })
  }, [])

  const toggleScale = useCallback(() => {
    setScale((current) => (current === 'log' ? 'linear' : 'log'))
  }, [])

  return {
    width: WIDTH,
    height: HEIGHT,
    padding: PADDING,
    plotWidth: PLOT_WIDTH,
    plotHeight: PLOT_HEIGHT,
    maxN: N_MAX,
    scale,
    toggleScale,
    series,
    xTicks,
    yTicks,
    hiddenIds,
    toggleSeries,
    isHidden: (id: string) => hiddenIds.has(id),
  }
}
