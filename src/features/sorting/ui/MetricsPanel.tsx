import type { SortSnapshot } from '../model/types'

export interface MetricsPanelProps {
  readonly snapshot: SortSnapshot
  readonly currentStep: number
  readonly totalSteps: number
  readonly progress: number
}

interface MetricCardProps {
  readonly abbreviation: string
  readonly label: string
  readonly value: number
  readonly accent: 'rose' | 'emerald'
}

const METRIC_ACCENTS = {
  rose: {
    card: 'border-rose-500/30 bg-rose-500/10',
    label: 'text-rose-400',
    value: 'text-rose-400',
  },
  emerald: {
    card: 'border-emerald-500/30 bg-emerald-500/10',
    label: 'text-emerald-400',
    value: 'text-emerald-400',
  },
} as const

function MetricCard({ abbreviation, label, value, accent }: MetricCardProps) {
  const styles = METRIC_ACCENTS[accent]

  return (
    <div className={`rounded-xl border p-3 ${styles.card}`}>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${styles.label}`}>
        {abbreviation} · {label}
      </p>
      <p className={`mt-1 font-mono text-2xl font-semibold ${styles.value}`}>{value}</p>
    </div>
  )
}

export function MetricsPanel({
  snapshot,
  currentStep,
  totalSteps,
  progress,
}: MetricsPanelProps) {
  const percent = Math.round(progress * 100)

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Метрики
        </h3>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
            snapshot.done
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-sky-500/30 bg-sky-500/10 text-sky-400'
          }`}
        >
          {snapshot.done ? 'Завершено' : 'У процесі'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <MetricCard
          abbreviation="Cmp"
          label="Порівняння"
          value={snapshot.comparisons}
          accent="rose"
        />
        <MetricCard
          abbreviation="Mov"
          label="Переміщення"
          value={snapshot.movements}
          accent="emerald"
        />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>Прогрес</span>
          <span className="font-mono text-slate-400">
            {currentStep + 1} / {totalSteps} · {percent}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Прогрес сортування"
          className="h-2 w-full overflow-hidden rounded-full bg-slate-800"
        >
          <svg
            viewBox="0 0 100 4"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            <rect
              x={0}
              y={0}
              width={Math.max(progress * 100, 0)}
              height={4}
              className="fill-sky-500"
            />
          </svg>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        Cmp рахує кожне порівняння, Mov — обміни (2) та записи (1). Обидва лічильники
        відновлюються під час кроку назад.
      </p>
    </section>
  )
}
