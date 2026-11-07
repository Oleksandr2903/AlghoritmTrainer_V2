import { cn } from '../lib/format'
import { QNA_CATEGORY_LABELS, QNA_ITEMS } from '../model/qna'
import type { QnaCategory } from '../model/types'
import { QNA_FILTERS, useQnaBrowser } from '../model/useQnaBrowser'
import { IconChevronDown, IconClose, IconQna, IconSearch } from './Icons'
import { TabHeading } from './TabHeading'
import { Badge } from './ComplexityBadge'

const CATEGORY_BADGES: Record<QnaCategory, string> = {
  basics: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  algorithms: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  practice: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  exam: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
}

export function QnaTab() {
  const qna = useQnaBrowser()

  return (
    <section className="space-y-6">
      <TabHeading
        eyebrow={`Q&A · ${QNA_ITEMS.length} питань`}
        title="Часті питання про складність"
        description="Короткі відповіді на те, що найчастіше плутають: межі O, Ω і Θ, стабільність, вибір pivot, пам’ять Merge Sort і типові іспитові пастки."
        icon={<IconQna className="h-4 w-4" />}
      >
        <Badge tone="sky">Пошук</Badge>
        <Badge tone="emerald">Пояснення</Badge>
        <Badge tone="amber">Іспит</Badge>
      </TabHeading>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <label htmlFor="complexity-qna-search" className="sr-only">
              Пошук серед питань
            </label>
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="complexity-qna-search"
              type="search"
              value={qna.query}
              onChange={(event) => qna.setQuery(event.target.value)}
              placeholder="Пошук: стабільність, pivot, O(n²)…"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-slate-200 placeholder:text-slate-600 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
            {qna.query ? (
              <button
                type="button"
                onClick={() => qna.setQuery('')}
                aria-label="Очистити пошук"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
              >
                <IconClose className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={qna.expandAll}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-sky-500/60 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
            >
              Розгорнути всі
            </button>
            <button
              type="button"
              onClick={qna.collapseAll}
              disabled={qna.openCount === 0}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:border-slate-700 hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
            >
              Згорнути
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {QNA_FILTERS.map((filter) => {
            const active = qna.category === filter.id
            const count =
              filter.id === 'all'
                ? QNA_ITEMS.length
                : (qna.categoryCounts[filter.id] ?? 0)

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => qna.setCategory(filter.id)}
                aria-pressed={active}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60',
                  active
                    ? 'border-sky-500/50 bg-sky-500/10 text-sky-300'
                    : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300',
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    'rounded px-1 font-mono text-[10px]',
                    active ? 'bg-sky-500/15 text-sky-300' : 'bg-slate-800 text-slate-500',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}

          <span className="ml-auto self-center font-mono text-[10px] text-slate-600">
            Знайдено: {qna.filteredItems.length} / {QNA_ITEMS.length}
          </span>
        </div>
      </div>

      {qna.filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center">
          <IconSearch className="mx-auto h-8 w-8 text-slate-700" />
          <p className="mt-3 text-sm font-semibold text-slate-300">Нічого не знайдено</p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
            Спробуйте інший запит або скиньте фільтри — можливо, питання сформульоване
            іншими словами.
          </p>
          <button
            type="button"
            onClick={() => {
              qna.setQuery('')
              qna.setCategory('all')
            }}
            className="mt-4 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold text-sky-300 transition hover:bg-sky-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
          >
            Скинути фільтри
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {qna.filteredItems.map((item) => {
            const open = qna.isOpen(item.id)
            return (
              <article
                key={item.id}
                className={cn(
                  'overflow-hidden rounded-2xl border bg-slate-900 transition',
                  open ? 'border-sky-500/40' : 'border-slate-800 hover:border-slate-700',
                )}
              >
                <button
                  type="button"
                  onClick={() => qna.toggleItem(item.id)}
                  aria-expanded={open}
                  aria-controls={`qna-answer-${item.id}`}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500/60 sm:px-5"
                >
                  <span
                    className={cn(
                      'mt-0.5 inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                      CATEGORY_BADGES[item.category],
                    )}
                  >
                    {QNA_CATEGORY_LABELS[item.category]}
                  </span>
                  <span className="flex-1 text-sm font-medium leading-relaxed text-slate-200">
                    {item.question}
                  </span>
                  <IconChevronDown
                    className={cn(
                      'mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-transform',
                      open && 'rotate-180 text-sky-400',
                    )}
                  />
                </button>

                {open ? (
                  <div
                    id={`qna-answer-${item.id}`}
                    className="border-t border-slate-800/70 bg-slate-950/40 px-4 py-4 sm:px-5"
                  >
                    <div className="space-y-3 border-l-2 border-sky-500/40 pl-4">
                      {item.answer.map((paragraph, index) => (
                        <p
                          key={`${item.id}-${index}`}
                          className="text-xs leading-relaxed text-slate-400"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
