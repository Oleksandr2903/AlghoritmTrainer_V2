import { cn } from '../lib/format'
import { useGrowthChart } from '../model/useGrowthChart'
import { IconScale } from './Icons'

export function GrowthChart() {
  const chart = useGrowthChart()

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-200">Криві зростання</p>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
            Усі функції на одному графіку. Зверніть увагу, як O(n²) відривається вже на n = 64.
          </p>
        </div>

        <button
          type="button"
          onClick={chart.toggleScale}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-sky-500/60 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
          aria-label="Перемкнути шкалу графіка"
        >
          <IconScale className="h-3.5 w-3.5" />
          {chart.scale === 'log' ? 'Логарифмічна шкала' : 'Лінійна шкала'}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-2">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="h-auto w-full"
          role="img"
          aria-label="Графік зростання складності O(1), O(log n), O(n), O(n log n) та O(n²)"
        >
          {chart.yTicks.map((tick) => (
            <line
              key={`grid-${tick.position}`}
              x1={chart.padding.left}
              x2={chart.width - chart.padding.right}
              y1={tick.position}
              y2={tick.position}
              className="stroke-slate-800"
              strokeDasharray="3 6"
            />
          ))}

          {chart.yTicks.map((tick) => (
            <text
              key={`y-${tick.position}`}
              x={chart.padding.left - 10}
              y={tick.position + 3}
              textAnchor="end"
              className="fill-slate-500 text-[9px]"
            >
              {tick.label}
            </text>
          ))}

          {chart.xTicks.map((tick) => (
            <text
              key={`x-${tick.position}`}
              x={tick.position}
              y={chart.height - chart.padding.bottom + 17}
              textAnchor="middle"
              className="fill-slate-500 text-[9px]"
            >
              {tick.label}
            </text>
          ))}

          <text
            x={chart.padding.left}
            y={12}
            className="fill-slate-500 text-[9px] uppercase tracking-[0.18em]"
          >
            операцій
          </text>
          <text
            x={chart.width - chart.padding.right}
            y={chart.height - 4}
            textAnchor="end"
            className="fill-slate-500 text-[9px] uppercase tracking-[0.18em]"
          >
            n
          </text>

          {chart.series
            .filter((item) => !chart.isHidden(item.id))
            .map((item) => (
              <path
                key={item.id}
                d={item.path}
                fill="none"
                strokeWidth={2.4}
                strokeLinecap="round"
                className={item.strokeClassName}
              />
            ))}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {chart.series.map((item) => {
          const hidden = chart.isHidden(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => chart.toggleSeries(item.id)}
              aria-pressed={!hidden}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60',
                hidden
                  ? 'border-slate-800 bg-slate-950 text-slate-600'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-600',
              )}
            >
              <span
                className={cn('h-2 w-2 rounded-full', hidden ? 'bg-slate-700' : item.dotClassName)}
                aria-hidden="true"
              />
              <span className={hidden ? 'line-through' : undefined}>{item.label}</span>
            </button>
          )
        })}
      </div>

      <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
        <IconScale className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />
        {chart.scale === 'log'
          ? 'Логарифмічна шкала стискає великі значення, тому всі криві видно одночасно. Порядок зростання від цього не змінюється.'
          : 'Лінійна шкала показує реальні пропорції: O(n²) поглинає майже весь графік, а O(log n) майже не відрізняється від нуля.'}
      </p>
    </div>
  )
}
