import type {
  QuizDifficulty,
  QuizQuestion,
  QuizQuestionContext,
} from '../model/types'
import { cn } from '../lib/format'
import { AnswerOption } from './AnswerOption'
import { ArrayVisualization } from './ArrayVisualization'

interface QuestionCardProps {
  question: QuizQuestion
  selectedOptionId: string | null
  isAnswered: boolean
  isCorrect: boolean
  onSelectAnswer: (optionId: string) => void
}

const DIFFICULTY_LABELS: Record<QuizDifficulty, string> = {
  easy: 'Легко',
  medium: 'Середньо',
  hard: 'Складно',
}

const DIFFICULTY_CLASSES: Record<QuizDifficulty, string> = {
  easy: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  medium: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  hard: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
}

function SortingContext({ context }: { context: QuizQuestionContext }) {
  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-400">
          {context.algorithmLabel}
        </span>
        <span className="text-[11px] text-slate-500">
          Поточний крок {context.stepNumber}
        </span>
      </div>

      <div className="mt-3">
        <ArrayVisualization
          array={context.array}
          activeIndices={context.activeIndices}
          sortedIndices={context.sortedIndices}
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {context.stepDescription}
      </p>

      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full bg-sky-500"
            aria-hidden="true"
          />
          активні індекси
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          відсортовані
        </span>
      </div>

      {context.pseudocode && context.pseudocode.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer list-none text-[11px] font-medium text-slate-500 hover:text-slate-300">
            Показати псевдокод
          </summary>
          <div className="mt-2 space-y-1 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-3">
            {context.pseudocode.map((line, index) => (
              <p
                key={index}
                className="whitespace-pre font-mono text-[11px] leading-relaxed text-slate-400"
              >
                {line}
              </p>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

export function QuestionCard({
  question,
  selectedOptionId,
  isAnswered,
  isCorrect,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
            DIFFICULTY_CLASSES[question.difficulty],
          )}
        >
          {DIFFICULTY_LABELS[question.difficulty]}
        </span>
        <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-400">
          {question.source === 'generated'
            ? 'Динамічне завдання'
            : 'Банк тестів'}
        </span>
        {question.context && (
          <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-400">
            Крок {question.context.stepNumber}
          </span>
        )}
      </div>

      {question.context && <SortingContext context={question.context} />}

      <h2 className="mt-5 text-lg font-semibold leading-snug text-slate-100 sm:text-xl">
        {question.prompt}
      </h2>

      <div className="mt-4 space-y-2.5">
        {question.options.map((option, index) => (
          <AnswerOption
            key={option.id}
            option={option}
            index={index}
            isSelected={selectedOptionId === option.id}
            isCorrectOption={question.correctOptionId === option.id}
            isAnswered={isAnswered}
            onSelect={onSelectAnswer}
          />
        ))}
      </div>

      {isAnswered && (
        <div
          role="status"
          className={cn(
            'mt-5 rounded-xl border p-4',
            isCorrect
              ? 'border-emerald-500/50 bg-emerald-500/10'
              : 'border-rose-500/50 bg-rose-500/10',
          )}
        >
          <p
            className={cn(
              'text-sm font-semibold',
              isCorrect ? 'text-emerald-300' : 'text-rose-300',
            )}
          >
            {isCorrect ? 'Правильно!' : 'Неправильно'}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">
            {question.explanation}
          </p>
        </div>
      )}

      {!isAnswered && question.hint && (
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Підказка: {question.hint}
        </p>
      )}
    </article>
  )
}
