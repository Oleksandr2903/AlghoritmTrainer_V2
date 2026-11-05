import { SORTING_ALGORITHMS } from '../model/algorithms'
import {
  MAX_ARRAY_SIZE,
  MAX_SPEED,
  MIN_ARRAY_SIZE,
  MIN_SPEED,
} from '../model/useSortingEngine'
import type { AlgorithmInfo, SortingAlgorithmId } from '../model/types'

export interface SettingsPanelProps {
  readonly algorithm: SortingAlgorithmId
  readonly algorithmInfo: AlgorithmInfo
  readonly arraySize: number
  readonly speed: number
  readonly onAlgorithmChange: (algorithm: SortingAlgorithmId) => void
  readonly onArraySizeChange: (size: number) => void
  readonly onSpeedChange: (speed: number) => void
}

export function SettingsPanel({
  algorithm,
  algorithmInfo,
  arraySize,
  speed,
  onAlgorithmChange,
  onArraySizeChange,
  onSpeedChange,
}: SettingsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Алгоритм
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {SORTING_ALGORITHMS.map((info) => {
            const isActive = info.id === algorithm

            return (
              <button
                key={info.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onAlgorithmChange(info.id)}
                className={`rounded-lg border px-3 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                  isActive
                    ? 'border-sky-500 bg-sky-500/15 text-sky-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="block text-sm font-medium">{info.name}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-slate-500">
                  {info.complexity.average}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-200">{algorithmInfo.ukrainianName}</p>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                algorithmInfo.stable
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
              }`}
            >
              {algorithmInfo.stable ? 'Стабільний' : 'Нестабільний'}
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {algorithmInfo.description}
          </p>

          <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <dt className="text-slate-500">Найкращий</dt>
              <dd className="font-mono text-emerald-400">{algorithmInfo.complexity.best}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Середній</dt>
              <dd className="font-mono text-sky-400">{algorithmInfo.complexity.average}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Найгірший</dt>
              <dd className="font-mono text-rose-400">{algorithmInfo.complexity.worst}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Пам'ять</dt>
              <dd className="font-mono text-slate-300">{algorithmInfo.complexity.space}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Налаштування
        </h3>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label htmlFor="sorting-array-size" className="text-sm text-slate-300">
              Розмір масиву
            </label>
            <span className="rounded-md border border-slate-800 bg-slate-950/60 px-2 py-0.5 font-mono text-xs text-sky-400">
              {arraySize}
            </span>
          </div>

          <input
            id="sorting-array-size"
            type="range"
            min={MIN_ARRAY_SIZE}
            max={MAX_ARRAY_SIZE}
            step={1}
            value={arraySize}
            onChange={(event) => onArraySizeChange(Number(event.target.value))}
            className="mt-3 w-full cursor-pointer accent-sky-500"
          />

          <div className="mt-1 flex justify-between text-[10px] text-slate-600">
            <span>{MIN_ARRAY_SIZE}</span>
            <span>{MAX_ARRAY_SIZE}</span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <label htmlFor="sorting-speed" className="text-sm text-slate-300">
              Швидкість
            </label>
            <span className="rounded-md border border-slate-800 bg-slate-950/60 px-2 py-0.5 font-mono text-xs text-emerald-400">
              {speed} крок/с
            </span>
          </div>

          <input
            id="sorting-speed"
            type="range"
            min={MIN_SPEED}
            max={MAX_SPEED}
            step={1}
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="mt-3 w-full cursor-pointer accent-emerald-500"
          />

          <div className="mt-1 flex justify-between text-[10px] text-slate-600">
            <span>Повільно</span>
            <span>Швидко</span>
          </div>
        </div>
      </section>
    </div>
  )
}
