import { useState } from 'react'
import type {
  QuizAnswerRecord,
  QuizProgress,
  QuizQuestion,
} from '../model/types'
import { cn, formatDuration, formatPercent } from '../lib/format'
import { StatsGrid } from './StatsGrid'

interface QuizResultsProps {
  questions: QuizQuestion[]
  answers: QuizAnswerRecord[]
  score: number
  total: number
  stats: QuizProgress
  startedAt: number | null
  finishedAt: number | null
  onRestart: () => void
  onExit: () => void
}

function getVerdict(percentage: number, score: number): string {
  if (score === 0) {
    return 'Початок покладено. Розбери пояснення нижче й спробуй ще раз.'
  }

  if (percentage >= 90) {
    return 'Відмінно! Ти впевнено бачиш наступний крок алгоритмів.'
  }

  if (percentage >= 70) {
    return 'Гарний результат. Залишилося кілька деталей.'
  }

  if (percentage >= 50) {
    return 'Непогано, але варто повторити ключові кроки.'
  }

  return 'Є над чим попрацювати. Розбір відповідей допоможе.'
}

export function QuizResults({
  questions,
  answers,
  score,
  total,
  stats,
  startedAt,
  finishedAt,
  onRestart,
  onExit,
}: QuizResultsProps) {
  const [showReview, setShowReview] = useState(false)

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  const wrong = Math.max(total - score, 0)
  const answerByQuestion = new Map(
    answers.map((answer) => [answer.questionId, answer]),
  )
  const percentageClass =
    percentage >= 80
      ? 'text-emerald-400'
      : percentage >= 50
        ? 'text-sky-400'
        : 'text-rose-400'

  const statItems: Array<{
    label: string
    value: string
    hint: string
    tone: 'sky' | 'emerald' | 'rose' | 'slate'
  }> = [
    {
      label: 'Правильні',
      value: String(score),
      hint: `з ${total} питань`,
      tone: 'emerald',
    },
    {
      label: 'Помилки',
      value: String(wrong),
      hint: wrong === 0 ? 'Ідеальна серія' : 'Є що повторити',
      tone: 'rose',
    },
    {
      label: 'Час гри',
      value: formatDuration(startedAt, finishedAt),
      hint: 'Без таймера й поспіху',
      tone: 'sky',
    },
    {
      label: 'Найкращий',
      value:
        stats.bestTotal > 0 ? `${stats.bestScore}/${stats.bestTotal}` : '—',
      hint:
        stats.bestTotal > 0
          ? `${stats.bestPercent}% правильних`
          : 'Результат збережеться',
      tone: 'slate',
    },
  ]

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="p-6 text-center sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-500">
            Результат
          </p>
          <p
            className={cn(
              'mt-3 text-6xl font-bold tabular-nums',
              percentageClass,
            )}
          >
            {formatPercent(percentage)}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-100">
            {score} з {total} правильних
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            {getVerdict(percentage, score)}
          </p>
        </div>
      </div>

      <StatsGrid items={statItems} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400"
        >
          Спробувати ще раз
        </button>
        <button
          type="button"
          onClick={onExit}
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:text-slate-100"
        >
          До вибору режиму
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => setShowReview((previous) => !previous)}
          aria-expanded={showReview}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="text-sm font-semibold text-slate-200">
            Розбір відповідей
          </span>
          <span className="text-[11px] font-medium text-sky-400">
            {showReview ? 'Сховати ↑' : 'Показати ↓'}
          </span>
        </button>

        {showReview && (
          <ul className="mt-4 space-y-3">
            {questions.map((question, index) => {
              const answer = answerByQuestion.get(question.id)
              const selectedOption = question.options.find(
                (option) => option.id === answer?.selectedOptionId,
              )
              const correctOption = question.options.find(
                (option) => option.id === question.correctOptionId,
              )
              const isCorrect = answer?.isCorrect === true

              return (
                <li
                  key={question.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        isCorrect
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400',
                      )}
                      aria-hidden="true"
                    >
                      {isCorrect ? '✓' : '✕'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-relaxed text-slate-200">
                        {index + 1}. {question.prompt}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        Твоя відповідь:{' '}
                        <span
                          className={
                            isCorrect ? 'text-emerald-400' : 'text-rose-400'
                          }
                        >
                          {selectedOption?.label ?? '—'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="mt-1 text-xs leading-relaxed text-emerald-400/90">
                          Правильно: {correctOption?.label ?? '—'}
                        </p>
                      )}
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
