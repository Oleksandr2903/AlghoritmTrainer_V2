export interface ControlPanelProps {
  readonly isPlaying: boolean
  readonly isFinished: boolean
  readonly canStepBackward: boolean
  readonly canStepForward: boolean
  readonly currentStep: number
  readonly totalSteps: number
  readonly onTogglePlayback: () => void
  readonly onStepBackward: () => void
  readonly onStepForward: () => void
  readonly onSeek: (step: number) => void
  readonly onGenerate: () => void
}

const PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'

const SECONDARY_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-sky-500/60 hover:text-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-300'

const GENERATE_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:ml-auto'

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
    </svg>
  )
}

function StepBackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path d="M6 5h2v14H6zM19 5v14l-9-7z" fill="currentColor" />
    </svg>
  )
}

function StepForwardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path d="M16 5h2v14h-2zM5 5v14l9-7z" fill="currentColor" />
    </svg>
  )
}

function ShuffleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  )
}

export function ControlPanel({
  isPlaying,
  isFinished,
  canStepBackward,
  canStepForward,
  currentStep,
  totalSteps,
  onTogglePlayback,
  onStepBackward,
  onStepForward,
  onSeek,
  onGenerate,
}: ControlPanelProps) {
  const maxStep = Math.max(totalSteps - 1, 0)
  const sliderValue = Math.min(currentStep, maxStep)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={PRIMARY_BUTTON} onClick={onTogglePlayback}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
          {isPlaying ? 'Пауза' : isFinished ? 'Спочатку' : 'Грати'}
        </button>

        <button
          type="button"
          className={SECONDARY_BUTTON}
          onClick={onStepBackward}
          disabled={!canStepBackward}
        >
          <StepBackIcon />
          Крок назад
        </button>

        <button
          type="button"
          className={SECONDARY_BUTTON}
          onClick={onStepForward}
          disabled={!canStepForward}
        >
          Крок уперед
          <StepForwardIcon />
        </button>

        <button type="button" className={GENERATE_BUTTON} onClick={onGenerate}>
          <ShuffleIcon />
          Новий масив
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>Часова шкала</span>
          <span className="font-mono text-slate-300">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={maxStep}
          step={1}
          value={sliderValue}
          onChange={(event) => onSeek(Number(event.target.value))}
          className="w-full cursor-pointer accent-sky-500"
          aria-label="Позиція відтворення алгоритму"
        />

        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-slate-600">
          <span>Старт</span>
          <span>Фініш</span>
        </div>
      </div>
    </div>
  )
}
