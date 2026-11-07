import { cn, formatPercent } from '../lib/format'
import { CHALLENGES } from '../model/challenges'
import type { ChallengeDifficulty, ChallengeKind } from '../model/types'
import { usePracticeSession } from '../model/usePracticeSession'
import { CodeBlock } from './CodeBlock'
import { Badge } from './ComplexityBadge'
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClose,
  IconPractice,
  IconReset,
  IconTrophy,
} from './Icons'
import { TabHeading } from './TabHeading'

const KIND_LABELS: Record<ChallengeKind, string> = {
  complexity: 'Складність',
  memory: 'Пам’ять',
  advantage: 'Переваги',
}

const KIND_TONES: Record<ChallengeKind, 'sky' | 'violet' | 'emerald'> = {
  complexity: 'sky',
  memory: 'violet',
  advantage: 'emerald',
}

const DIFFICULTY_LABELS: Record<ChallengeDifficulty, string> = {
  basic: 'База',
  medium: 'Середнє',
  advanced: 'Складно',
}

const DIFFICULTY_CLASSES: Record<ChallengeDifficulty, string> = {
  basic: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  medium: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  advanced: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
}

const STATUS_CLASSES = {
  unanswered: 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-600',
  correct: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  incorrect: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
} as const

export function PracticeTab() {
  const practice = usePracticeSession()
  const challenge = practice.currentChallenge
  const isLast = practice.currentIndex === practice.total - 1

  return (
    <section className="space-y-6">
      <TabHeading
        eyebrow={`Код + самоперевірка · ${CHALLENGES.length} задач`}
        title="Що це за складність?"
        description="Читайте фрагмент коду, визначайте час, пам’ять або переваги — і одразу отримуйте розбір. Задачі охоплюють найпоширеніші пастки: адаптивність, найгірший pivot, стабільність і приховані цикли."
        icon={<IconPractice className="h-4 w-4" />}
      >
        <Badge tone="sky">C++</Badge>
        <Badge tone="emerald">Пояснення</Badge>
        <Badge tone="rose">Прогрес</Badge>
      </TabHeading>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/40 bg-sky-500/10 text-sky-300">
              <IconTrophy className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Результат
              </p>
              <p className="text-sm font-semibold text-slate-200">
                {practice.correctCount} з {practice.total} правильних
                <span className="ml-2 font-mono text-[11px] text-slate-500">
                  ({formatPercent(practice.scorePercent)})
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5" aria-label="Навігація задачами">
            {practice.statusPerChallenge.map((status, index) => (
              <button
                key={CHALLENGES[index].id}
                type="button"
                onClick={() => practice.goTo(index)}
                aria-label={`Задача ${index + 1}: ${CHALLENGES[index].title}`}
                aria-current={index === practice.currentIndex ? 'step' : undefined}
                className={cn(
                  'h-8 w-8 rounded-lg border font-mono text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60',
                  STATUS_CLASSES[status],
                  index === practice.currentIndex && 'ring-2 ring-sky-500/60 ring-offset-2 ring-offset-slate-900',
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={practice.reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-400 transition hover:border-rose-500/50 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60"
          >
            <IconReset className="h-3.5 w-3.5" />
            Скинути прогрес
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
          <p className="text-[11px] text-slate-500">
            Пройдено <span className="font-mono text-slate-300">{practice.answeredCount}</span> з{' '}
            {practice.total}. Відповіді зберігаються у браузері.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-600">
            {practice.isComplete ? 'усі задачі пройдено' : 'прогрес у процесі'}
          </p>
        </div>
      </div>

      {practice.isComplete ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                <IconTrophy className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-bold text-slate-100">Усі задачі пройдено</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Ваш результат: {practice.correctCount} з {practice.total} (
                  {formatPercent(practice.scorePercent)}). Можна переглянути розбори ще раз
                  або скинути прогрес і спробувати знову.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={practice.reset}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
            >
              <IconReset className="h-3.5 w-3.5" />
              Пройти ще раз
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
          Задача {practice.currentIndex + 1} з {practice.total}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={practice.goPrevious}
            disabled={practice.currentIndex === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-400 transition hover:border-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
            Назад
          </button>
          <button
            type="button"
            onClick={practice.goNext}
            disabled={isLast}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold text-sky-300 transition hover:bg-sky-500/15 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
          >
            Далі
            <IconArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={KIND_TONES[challenge.kind]}>{KIND_LABELS[challenge.kind]}</Badge>
              <span
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[10px] font-semibold',
                  DIFFICULTY_CLASSES[challenge.difficulty],
                )}
              >
                {DIFFICULTY_LABELS[challenge.difficulty]}
              </span>
              <span className="font-mono text-[10px] text-slate-600">{challenge.topic}</span>
            </div>
            <h4 className="mt-2 text-lg font-bold text-slate-100">{challenge.title}</h4>
          </div>
          <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-[10px] text-sky-400">
            {challenge.language}
          </span>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <CodeBlock code={challenge.code} language={challenge.language} label="Фрагмент коду" />

          <div className="flex min-w-0 flex-col">
            <p className="text-sm font-semibold leading-relaxed text-slate-200">
              {challenge.question}
            </p>

            <div className="mt-3 space-y-2" role="group" aria-label="Варіанти відповіді">
              {challenge.options.map((option, index) => {
                const isSelected = practice.selectedOptionId === option.id
                const showCorrect = practice.isAnswered && option.correct
                const showWrong = practice.isAnswered && isSelected && !option.correct

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => practice.selectOption(option.id)}
                    disabled={practice.isAnswered}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-xs leading-relaxed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60',
                      !practice.isAnswered &&
                        'border-slate-800 bg-slate-950 text-slate-300 hover:border-sky-500/60 hover:bg-sky-500/[0.06]',
                      showCorrect && 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200',
                      showWrong && 'border-rose-500/60 bg-rose-500/10 text-rose-200',
                      practice.isAnswered &&
                        !showCorrect &&
                        !showWrong &&
                        'border-slate-800 bg-slate-950 text-slate-500 opacity-70',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border font-mono text-[10px]',
                        showCorrect
                          ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                          : showWrong
                            ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
                            : 'border-slate-700 bg-slate-900 text-slate-500',
                      )}
                    >
                      {showCorrect ? (
                        <IconCheck className="h-3 w-3" />
                      ) : showWrong ? (
                        <IconClose className="h-3 w-3" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </button>
                )
              })}
            </div>

            {practice.isAnswered ? (
              <div
                className={cn(
                  'mt-3 rounded-xl border p-3.5',
                  practice.isCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/[0.06]'
                    : 'border-rose-500/30 bg-rose-500/[0.06]',
                )}
              >
                <p
                  className={cn(
                    'flex items-center gap-2 text-xs font-bold',
                    practice.isCorrect ? 'text-emerald-300' : 'text-rose-300',
                  )}
                >
                  {practice.isCorrect ? (
                    <IconCheck className="h-4 w-4" />
                  ) : (
                    <IconClose className="h-4 w-4" />
                  )}
                  {practice.isCorrect ? 'Правильно!' : 'Не зовсім'}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                  {challenge.explanation}
                </p>
                <p className="mt-2.5 border-t border-slate-800/80 pt-2.5 text-[11px] leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-300">Головне: </span>
                  {challenge.takeaway}
                </p>
                {!isLast ? (
                  <button
                    type="button"
                    onClick={practice.goNext}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold text-sky-300 transition hover:bg-sky-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
                  >
                    Наступна задача
                    <IconArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-[10px] text-slate-600">
                Оберіть один варіант — після цього з’явиться розбір.
              </p>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}
