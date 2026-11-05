import { cn } from '../lib/format'

interface ArrayVisualizationProps {
  array: readonly number[]
  activeIndices?: readonly number[]
  sortedIndices?: readonly number[]
}

export function ArrayVisualization({
  array,
  activeIndices = [],
  sortedIndices = [],
}: ArrayVisualizationProps) {
  return (
    <div className="flex flex-wrap items-end gap-1.5">
      {array.map((value, index) => {
        const isActive = activeIndices.includes(index)
        const isSorted = sortedIndices.includes(index)
        const cellClass = isActive
          ? 'border-sky-500 bg-sky-500/15 text-sky-200'
          : isSorted
            ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
            : 'border-slate-700 bg-slate-950 text-slate-300'
        const indexClass = isActive
          ? 'text-sky-400'
          : isSorted
            ? 'text-emerald-500'
            : 'text-slate-600'

        return (
          <div
            key={index}
            className="flex flex-col items-center gap-1"
          >
            <span
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg border font-mono text-sm font-semibold tabular-nums transition-colors',
                cellClass,
              )}
            >
              {value}
            </span>
            <span
              className={cn(
                'font-mono text-[10px] tabular-nums',
                indexClass,
              )}
            >
              {index}
            </span>
          </div>
        )
      })}
    </div>
  )
}
