import type { QuizAnswerRecord, QuizQuestion } from '../model/types'
import { cn } from '../lib/format'
import { QuestionCard } from './QuestionCard'
import { QuizProgressBar } from './QuizProgressBar'

interface QuizGameProps {
  question: QuizQuestion
  questions: QuizQuestion[]
  answers: QuizAnswerRecord[]
  currentIndex: number
  totalQuestions: number
  score: number
  selectedOptionId: string | null
  isAnswered: boolean
  isCorrect: boolean
  onSelectAnswer: (optionId: string) => void
  onNext: () => void
  onQuit: () => void
}

export function QuizGame({
  question,
  questions,
  answers,
  currentIndex,
  totalQuestions,
  score,
  selectedOptionId,
  isAnswered,
  isCorrect,
  onSelectAnswer,
  onNext,
  onQuit,
}: QuizGameProps) {
  const isLastQuestion = currentIndex >= totalQuestions - 1
  const helperText = !isAnswered
    ? 'Обери один варіант — результат і пояснення зʼявляться одразу.'
    : isCorrect
      ? 'Відповідь зарахована. Рухайся далі.'
      : 'Правильний варіант підсвічено зеленим. Розбери пояснення.'

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-500">
              Тренажер
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Питання{' '}
              <span className="font-semibold text-slate-100">
                {currentIndex + 1}
              </span>{' '}
              з <span className="tabular-nums">{totalQuestions}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Рахунок:{' '}
              <span className="tabular-nums">{score}</span>
            </span>
            <button
              type="button"
              onClick={onQuit}
              className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-rose-500/50 hover:text-rose-400"
            >
              Вийти
            </button>
          </div>
        </div>

        <div className="mt-4">
          <QuizProgressBar
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
          />
        </div>
      </div>

      <QuestionCard
        question={question}
        selectedOptionId={selectedOptionId}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        onSelectAnswer={onSelectAnswer}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-500">{helperText}</p>
        <button
          type="button"
          onClick={onNext}
          disabled={!isAnswered}
          className={cn(
            'rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors',
            isAnswered
              ? 'bg-sky-500 text-slate-950 hover:bg-sky-400'
              : 'cursor-not-allowed border border-slate-800 bg-slate-900 text-slate-600',
          )}
        >
          {isLastQuestion ? 'Показати результат' : 'Наступне питання'}
          {isAnswered && (
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          )}
        </button>
      </div>
    </section>
  )
}
