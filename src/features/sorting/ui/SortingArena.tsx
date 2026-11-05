import { useSortingEngine } from '../model/useSortingEngine'
import { ArrayVisualizer } from './ArrayVisualizer'
import { ControlPanel } from './ControlPanel'
import { MetricsPanel } from './MetricsPanel'
import { SettingsPanel } from './SettingsPanel'

const LEGEND = [
  { label: 'Не оброблено', dotClassName: 'bg-sky-500' },
  { label: 'Порівняння', dotClassName: 'bg-rose-500' },
  { label: 'Обмін / відсортовано', dotClassName: 'bg-emerald-500' },
] as const

export function SortingArena() {
  const engine = useSortingEngine()
  const maxValue = Math.max(...engine.values, 1)

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 text-slate-200">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-500">
            Алгоритми сортування
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-100 sm:text-3xl">
            Сортувальна арена
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Порівнюйте шість алгоритмів у реальному часі, керуйте відтворенням і
            подорожуйте історією виконання крок за кроком.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            6 алгоритмів
          </span>
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-400">
            Time travel
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            {engine.algorithmInfo.complexity.average}
          </span>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-200">
                  Візуалізація масиву
                </h3>
                <p className="mt-1 min-h-5 text-xs text-slate-400">
                  {engine.snapshot.message}
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 font-mono text-xs text-slate-400">
                {engine.algorithmInfo.name}
              </span>
            </div>

            <div className="h-64 w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 sm:h-80">
              <ArrayVisualizer snapshot={engine.snapshot} maxValue={maxValue} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              {LEGEND.map((item) => (
                <span key={item.label} className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span
                    className={`h-2.5 w-2.5 rounded-sm ${item.dotClassName}`}
                    aria-hidden="true"
                  />
                  {item.label}
                </span>
              ))}

              <span className="ml-auto font-mono text-[11px] text-slate-600">
                {engine.snapshot.array.length} елементів
              </span>
            </div>
          </div>

          <ControlPanel
            isPlaying={engine.isPlaying}
            isFinished={engine.isFinished}
            canStepBackward={engine.canStepBackward}
            canStepForward={engine.canStepForward}
            currentStep={engine.currentStep}
            totalSteps={engine.totalSteps}
            onTogglePlayback={engine.togglePlayback}
            onStepBackward={engine.stepBackward}
            onStepForward={engine.stepForward}
            onSeek={engine.seek}
            onGenerate={engine.generateNewArray}
          />
        </div>

        <aside className="flex min-w-0 flex-col gap-6">
          <SettingsPanel
            algorithm={engine.algorithm}
            algorithmInfo={engine.algorithmInfo}
            arraySize={engine.arraySize}
            speed={engine.speed}
            onAlgorithmChange={engine.setAlgorithm}
            onArraySizeChange={engine.setArraySize}
            onSpeedChange={engine.setSpeed}
          />

          <MetricsPanel
            snapshot={engine.snapshot}
            currentStep={engine.currentStep}
            totalSteps={engine.totalSteps}
            progress={engine.progress}
          />
        </aside>
      </div>
    </section>
  )
}
