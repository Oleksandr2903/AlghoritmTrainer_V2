import { cn } from '../lib/format'

type StatsGridTone = 'sky' | 'emerald' | 'rose' | 'slate'

interface StatsGridProps {
  items: Array<{
    label: string
    value: string
    hint?: string
    tone?: StatsGridTone
  }>
}

const TONE_CLASSES: Record<StatsGridTone, string> = {
  sky: 'text-sky-400',
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
  slate: 'text-slate-200',
}

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {item.label}
          </p>
          <p
            className={cn(
              'mt-2 text-xl font-semibold tabular-nums',
              TONE_CLASSES[item.tone ?? 'slate'],
            )}
          >
            {item.value}
          </p>
          {item.hint && (
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {item.hint}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
