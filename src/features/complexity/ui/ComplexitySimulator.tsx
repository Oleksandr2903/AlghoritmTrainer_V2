import { cn } from '../lib/format'
import { CHALLENGES } from '../model/challenges'
import { QNA_ITEMS } from '../model/qna'
import { SORTING_ALGORITHMS } from '../model/sortingAlgorithms'
import type { ComplexityTabId } from '../model/types'
import { COMPLEXITY_TABS, useComplexityNavigation } from '../model/useComplexityNavigation'
import { AlgorithmsTab } from './AlgorithmsTab'
import {
  IconAlgorithms,
  IconInfo,
  IconOverview,
  IconPractice,
  IconQna,
} from './Icons'
import { OverviewTab } from './OverviewTab'
import { PracticeTab } from './PracticeTab'
import { QnaTab } from './QnaTab'

const TAB_ICONS = {
  overview: IconOverview,
  algorithms: IconAlgorithms,
  qna: IconQna,
  practice: IconPractice,
} as const

const ACTIVE_TAB_CLASSES: Record<ComplexityTabId, string> = {
  overview: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
  algorithms: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  qna: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
  practice: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
}

export function ComplexitySimulator() {
  const navigation = useComplexityNavigation()

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 text-slate-200">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-500">
            Складність алгоритмів
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-100 sm:text-3xl">
            Складність сортувальних алгоритмів
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Від Big-O до реального коду: графіки зростання, довідник алгоритмів,
            часті питання та задачі з розбором. Усе, щоб упевнено відповідати
            «яка тут складність і чому».
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            {SORTING_ALGORITHMS.length} алгоритмів
          </span>
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-400">
            {QNA_ITEMS.length} питань
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            {CHALLENGES.length} задач
          </span>
        </div>
      </header>

      <nav
        role="tablist"
        aria-label="Розділи модуля складності"
        className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/70 p-2"
      >
        {COMPLEXITY_TABS.map((tab) => {
          const Icon = TAB_ICONS[tab.id]
          const active = navigation.activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`complexity-tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`complexity-panel-${tab.id}`}
              onClick={() => navigation.setActiveTab(tab.id)}
              className={cn(
                'flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 sm:flex-none',
                active
                  ? ACTIVE_TAB_CLASSES[tab.id]
                  : 'border-transparent text-slate-500 hover:bg-slate-800/50 hover:text-slate-300',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold">{tab.label}</span>
                <span className="hidden truncate text-[10px] opacity-70 sm:block">
                  {tab.caption}
                </span>
              </span>
            </button>
          )
        })}
      </nav>

      <div
        role="tabpanel"
        id={`complexity-panel-${navigation.activeTab}`}
        aria-labelledby={`complexity-tab-${navigation.activeTab}`}
      >
        {navigation.activeTab === 'overview' ? <OverviewTab /> : null}
        {navigation.activeTab === 'algorithms' ? <AlgorithmsTab /> : null}
        {navigation.activeTab === 'qna' ? <QnaTab /> : null}
        {navigation.activeTab === 'practice' ? <PracticeTab /> : null}
      </div>

      <footer className="flex flex-col gap-2 border-t border-slate-800/80 pt-4 text-[11px] leading-relaxed text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2">
          <IconInfo className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />
          Порада: спочатку оцініть кількість операцій, потім перевірте себе на практиці.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600">
          Ω · Θ · O
        </p>
      </footer>
    </section>
  )
}
