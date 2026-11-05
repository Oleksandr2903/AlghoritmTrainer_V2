import { useState } from 'react'
import type { QuizMode, QuizProgress } from '../model/types'
import { cn, formatDate } from '../lib/format'
import { StatsGrid } from './StatsGrid'

interface QuizLobbyProps {
  stats: QuizProgress
  onStart: (mode: QuizMode) => void
  onResetProgress: () => void
}

interface ModeOption {
  id: QuizMode
  title: string
  description: string
  icon: string
  accentClass: string
  hint: string
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'mixed',
    title: 'Мікс',
    description:
      'Динамічні кроки сортування та теорія в одній сесії — найкращий варіант для розминки.',
    icon: '⚡',
    accentClass: 'bg-sky-500/15 text-sky-400',
    hint: '10 питань',
  },
  {
    id: 'sorting',
    title: 'Наступний крок',
    description:
      'Вгадай, яким стане масив після наступного обміну, вставки або дії алгоритму.',
    icon: '↔',
    accentClass: 'bg-emerald-500/15 text-emerald-400',
    hint: 'Динамічні завдання',
  },
  {
    id: 'theory',
    title: 'Банк тестів',
    description:
      'Перевір знання складності, стабільності, памʼяті та властивостей алгоритмів.',
    icon: '§',
    accentClass: 'bg-rose-500/15 text-rose-400',
    hint: 'Теорія',
  },
]

export function QuizLobby({
  stats,
  onStart,
  onResetProgress,
}: QuizLobbyProps) {
  const [selectedMode, setSelectedMode] = useState<QuizMode>('mixed')
  const [resetArmed, setResetArmed] = useState(false)

  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0
  const hasProgress =
    stats.completedRuns > 0 ||
    stats.totalAnswered > 0 ||
    stats.bestTotal > 0
  const selectedModeOption =
    MODE_OPTIONS.find((mode) => mode.id === selectedMode) ?? MODE_OPTIONS[0]

  const statItems: Array<{
    label: string
    value: string
    hint: string
    tone: 'sky' | 'emerald' | 'rose' | 'slate'
  }> = [
    {
      label: 'Найкращий результат',
      value:
        stats.bestTotal > 0 ? `${stats.bestScore}/${stats.bestTotal}` : '—',
      hint:
        stats.bestTotal > 0
          ? `${stats.bestPercent}% правильних`
          : 'Заверши першу гру',
      tone: 'emerald',
    },
    {
      label: 'Завершено ігор',
      value: String(stats.completedRuns),
      hint: stats.lastPlayedAt
        ? formatDate(stats.lastPlayedAt)
        : 'Історія порожня',
      tone: 'sky',
    },
    {
      label: 'Точність',
      value: `${accuracy}%`,
      hint: `${stats.totalCorrect} з ${stats.totalAnswered} відповідей`,
      tone: 'sky',
    },
    {
      label: 'Відповідей',
      value: String(stats.totalAnswered),
      hint: 'Зберігається локально',
      tone: 'slate',
    },
  ]

  const handleResetClick = () => {
    if (!resetArmed) {
      setResetArmed(true)
      return
    }

    onResetProgress()
    setResetArmed(false)
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-500">
              Quiz · Модуль 4
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-100">
              Вгадай наступний крок
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Інтерактивний тренажер для алгоритмів сортування: динамічні
              запитання на основі покрокових знімків масиву та статичний банк
              теорії.
            </p>
          </div>
          <span className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
            Прогрес зберігається
          </span>
        </div>
      </div>

      <StatsGrid items={statItems} />

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-200">
            Обери режим
          </h2>
          <span className="text-[11px] text-slate-500">
            Миттєва перевірка відповідей
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {MODE_OPTIONS.map((mode) => {
            const isSelected = selectedMode === mode.id

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
                aria-pressed={isSelected}
                className={cn(
                  'flex flex-col gap-3 rounded-2xl border p-5 text-left transition-colors',
                  isSelected
                    ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/60',
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold',
                    mode.accentClass,
                  )}
                  aria-hidden="true"
                >
                  {mode.icon}
                </span>
                <span className="text-base font-semibold text-slate-100">
                  {mode.title}
                </span>
                <span className="text-sm leading-relaxed text-slate-400">
                  {mode.description}
                </span>
                <span
                  className={cn(
                    'mt-auto text-[11px] font-medium',
                    isSelected ? 'text-sky-400' : 'text-slate-500',
                  )}
                >
                  {isSelected ? 'Обрано' : mode.hint}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-500">
          {selectedModeOption.hint} · швидкий старт · результати одразу
        </p>
        <button
          type="button"
          onClick={() => onStart(selectedMode)}
          className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400"
        >
          Почати «{selectedModeOption.title}»
          <span className="ml-2" aria-hidden="true">
            →
          </span>
        </button>
      </div>

      {hasProgress && (
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-slate-500">
            Найкращий результат, точність і завершені ігри зберігаються у
            цьому браузері.
          </p>
          <button
            type="button"
            onClick={handleResetClick}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              resetArmed
                ? 'border-rose-500 bg-rose-500/15 text-rose-300'
                : 'border-slate-800 text-slate-500 hover:border-rose-500/50 hover:text-rose-400',
            )}
          >
            {resetArmed
              ? 'Натисни ще раз для підтвердження'
              : 'Скинути статистику'}
          </button>
        </div>
      )}
    </section>
  )
}
