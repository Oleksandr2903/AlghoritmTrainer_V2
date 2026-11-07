import { cn } from '../lib/format'
import { ALGORITHM_FAMILY_LABELS } from '../model/sortingAlgorithms'
import type { AlgorithmAccent } from '../model/types'
import { useAlgorithmExplorer } from '../model/useAlgorithmExplorer'
import { Badge, ComplexityCell } from './ComplexityBadge'
import { CodeBlock } from './CodeBlock'
import { IconAlgorithms, IconCheck, IconClose } from './Icons'
import { TabHeading } from './TabHeading'

const ACCENTS: Record<
  AlgorithmAccent,
  { dot: string; text: string; border: string; soft: string; chip: string }
> = {
  sky: {
    dot: 'bg-sky-500',
    text: 'text-sky-400',
    border: 'border-sky-500/60',
    soft: 'bg-sky-500/10',
    chip: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  },
  emerald: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-emerald-500/60',
    soft: 'bg-emerald-500/10',
    chip: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  },
  rose: {
    dot: 'bg-rose-500',
    text: 'text-rose-400',
    border: 'border-rose-500/60',
    soft: 'bg-rose-500/10',
    chip: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  },
  amber: {
    dot: 'bg-amber-500',
    text: 'text-amber-400',
    border: 'border-amber-500/60',
    soft: 'bg-amber-500/10',
    chip: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  },
  violet: {
    dot: 'bg-violet-500',
    text: 'text-violet-400',
    border: 'border-violet-500/60',
    soft: 'bg-violet-500/10',
    chip: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  },
}

export function AlgorithmsTab() {
  const explorer = useAlgorithmExplorer()
  const selected = explorer.selectedAlgorithm
  const accent = ACCENTS[selected.accent]

  const filters = [
    { id: 'all', label: 'Усі' },
    { id: 'comparison', label: 'Порівняльні' },
    { id: 'linear', label: 'Без порівнянь' },
  ] as const

  return (
    <section className="space-y-6">
      <TabHeading
        eyebrow="Довідник · 8 алгоритмів"
        title="Алгоритми та їхня складність"
        description="Оберіть алгоритм, щоб побачити найкращий, середній і найгірший випадки, додаткову пам’ять, стабільність, переваги та типові сценарії використання."
        icon={<IconAlgorithms className="h-4 w-4" />}
      >
        <Badge tone="emerald">Стабільність</Badge>
        <Badge tone="sky">In-place</Badge>
        <Badge tone="violet">Пам’ять</Badge>
      </TabHeading>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="self-start rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-lg lg:sticky lg:top-4">
          <div className="flex flex-wrap gap-1.5 px-1 pb-3">
            {filters.map((filter) => {
              const active = explorer.family === filter.id
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => explorer.setFamily(filter.id)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60',
                    active
                      ? 'border-sky-500/50 bg-sky-500/10 text-sky-300'
                      : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300',
                  )}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>

          <div className="space-y-1.5">
            {explorer.filteredAlgorithms.map((algorithm) => {
              const algorithmAccent = ACCENTS[algorithm.accent]
              const isSelected = algorithm.id === selected.id
              return (
                <button
                  key={algorithm.id}
                  type="button"
                  onClick={() => explorer.selectAlgorithm(algorithm.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'w-full rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60',
                    isSelected
                      ? cn(algorithmAccent.border, algorithmAccent.soft)
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn('h-2 w-2 shrink-0 rounded-full', algorithmAccent.dot)}
                        aria-hidden="true"
                      />
                      <span
                        className={cn(
                          'truncate text-xs font-semibold',
                          isSelected ? 'text-slate-100' : 'text-slate-300',
                        )}
                      >
                        {algorithm.name}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[10px]',
                        algorithmAccent.chip,
                      )}
                    >
                      Θ {algorithm.average}
                    </span>
                  </div>
                  <p className="mt-1 truncate pl-4 font-mono text-[10px] text-slate-600">
                    {algorithm.englishName}
                  </p>
                </button>
              )
            })}
          </div>

          <p className="mt-3 px-1 text-[10px] leading-relaxed text-slate-600">
            Натисніть на картку, щоб змінити деталі праворуч.
          </p>
        </aside>

        <div className="min-w-0 space-y-4">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', accent.dot)} aria-hidden="true" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {ALGORITHM_FAMILY_LABELS[selected.family]}
                  </span>
                </div>
                <h4 className="mt-1.5 text-xl font-bold text-slate-100 sm:text-2xl">
                  {selected.name}
                </h4>
                <p className={cn('mt-0.5 font-mono text-xs', accent.text)}>
                  {selected.englishName}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge tone={selected.stable ? 'emerald' : 'rose'}>
                  {selected.stable ? 'Стабільне' : 'Нестабільне'}
                </Badge>
                <Badge tone={selected.inPlace ? 'sky' : 'amber'}>
                  {selected.inPlace ? 'In-place' : 'Не in-place'}
                </Badge>
                <Badge tone={selected.adaptive ? 'violet' : 'slate'}>
                  {selected.adaptive ? 'Адаптивне' : 'Не адаптивне'}
                </Badge>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">{selected.short}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{selected.idea}</p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <ComplexityCell label="Найкращий" prefix="Ω" value={selected.best} tone="emerald" />
              <ComplexityCell label="Середній" prefix="Θ" value={selected.average} tone="sky" />
              <ComplexityCell label="Найгірший" prefix="O" value={selected.worst} tone="rose" />
              <ComplexityCell label="Пам’ять" prefix="O" value={selected.space} tone="violet" />
            </div>
          </article>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
              <p className="text-sm font-semibold text-slate-200">Як працює</p>
              <ol className="mt-3 space-y-2.5">
                {selected.steps.map((step, index) => (
                  <li key={step} className="flex gap-2.5 text-xs leading-relaxed text-slate-400">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-950 font-mono text-[10px] text-slate-400">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
              <p className="text-sm font-semibold text-slate-200">Коли обирати</p>
              <ul className="mt-3 space-y-2.5">
                {selected.useCases.map((useCase) => (
                  <li key={useCase} className="flex gap-2.5 text-xs leading-relaxed text-slate-400">
                    <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
              <p className="text-sm font-semibold text-emerald-300">Переваги</p>
              <ul className="mt-3 space-y-2">
                {selected.advantages.map((advantage) => (
                  <li key={advantage} className="flex gap-2.5 text-xs leading-relaxed text-slate-400">
                    <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-5">
              <p className="text-sm font-semibold text-rose-300">Недоліки</p>
              <ul className="mt-3 space-y-2">
                {selected.disadvantages.map((disadvantage) => (
                  <li key={disadvantage} className="flex gap-2.5 text-xs leading-relaxed text-slate-400">
                    <IconClose className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                    <span>{disadvantage}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <CodeBlock code={selected.pseudocode} language="Псевдокод" label="Алгоритм" />
        </div>
      </div>
    </section>
  )
}
