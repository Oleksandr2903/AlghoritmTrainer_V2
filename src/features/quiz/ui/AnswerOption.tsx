import type { QuizOption } from '../model/types'
import { cn } from '../lib/format'

interface AnswerOptionProps {
  option: QuizOption
  index: number
  isSelected: boolean
  isCorrectOption: boolean
  isAnswered: boolean
  onSelect: (optionId: string) => void
}

export function AnswerOption({
  option,
  index,
  isSelected,
  isCorrectOption,
  isAnswered,
  onSelect,
}: AnswerOptionProps) {
  const showCorrect = isAnswered && isCorrectOption
  const showWrong = isAnswered && isSelected && !isCorrectOption
  const isMuted = isAnswered && !showCorrect && !showWrong

  return (
    <button
      type="button"
      disabled={isAnswered}
      onClick={() => onSelect(option.id)}
      aria-pressed={isSelected}
      className={cn(
        'group flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors sm:items-center',
        !isAnswered &&
          'cursor-pointer border-slate-800 bg-slate-900 hover:border-sky-500/70 hover:bg-slate-800/70',
        showCorrect && 'border-emerald-500 bg-emerald-500/10',
        showWrong && 'border-rose-500 bg-rose-500/10',
        isMuted && 'border-slate-800 bg-slate-900 opacity-60',
        isAnswered && 'cursor-default',
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-colors',
          !isAnswered &&
            'border-slate-700 bg-slate-950 text-slate-400 group-hover:text-sky-400',
          showCorrect && 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300',
          showWrong && 'border-rose-500/60 bg-rose-500/15 text-rose-300',
          isMuted && 'border-slate-800 bg-slate-950 text-slate-600',
        )}
      >
        {String.fromCharCode(65 + index)}
      </span>
      <span
        className={cn(
          'min-w-0 flex-1 text-sm leading-relaxed',
          showCorrect
            ? 'text-emerald-100'
            : showWrong
              ? 'text-rose-100'
              : isMuted
                ? 'text-slate-500'
                : 'text-slate-200',
        )}
      >
        {option.label}
      </span>
      {showCorrect && (
        <span
          className="shrink-0 text-base font-bold text-emerald-400"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
      {showWrong && (
        <span
          className="shrink-0 text-base font-bold text-rose-400"
          aria-hidden="true"
        >
          ✕
        </span>
      )}
    </button>
  )
}
