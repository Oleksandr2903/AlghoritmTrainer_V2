import { Badge } from './ComplexityBadge'
import { GrowthChart } from './GrowthChart'
import { IconBulb, IconInfo, IconOverview } from './Icons'
import { OperationsEstimator } from './OperationsEstimator'
import { TabHeading } from './TabHeading'

const NOTATIONS = [
  {
    symbol: 'O',
    title: 'Верхня межа',
    text: 'Найгірший сценарій. «Швидше за це не буде» — саме її найчастіше питають на іспиті.',
    className: 'border-rose-500/30 bg-rose-500/5 text-rose-300',
  },
  {
    symbol: 'Ω',
    title: 'Нижня межа',
    text: 'Найкращий сценарій або принциповий мінімум. Показує, швидше за що алгоритм не може.',
    className: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
  },
  {
    symbol: 'Θ',
    title: 'Точна межа',
    text: 'Одночасно O і Ω. Найточніший опис зростання; використовується для середнього випадку.',
    className: 'border-sky-500/30 bg-sky-500/5 text-sky-300',
  },
] as const

const RULES = [
  { code: 'O(3n) = O(n)', text: 'Сталі множники не впливають на характер зростання.' },
  { code: 'O(n² + n) = O(n²)', text: 'Залишаємо лише домінантний доданок.' },
  { code: 'n · n = n²', text: 'Вкладені цикли множаться, послідовні — додаються.' },
  { code: 'T(n) ≠ M(n)', text: 'Час і додаткову пам’ять оцінюють окремо.' },
] as const

const MYTHS = [
  {
    myth: 'O(n log n) завжди швидше за O(n²)',
    truth: 'На малих n і великих сталих множниках квадратичний алгоритм може перемогти.',
  },
  {
    myth: 'Quick Sort завжди працює за O(n log n)',
    truth: 'Найгірший випадок — O(n²). Гарантію дає хіба що introsort або Heap Sort.',
  },
  {
    myth: 'Big-O вимірює секунди',
    truth: 'Big-O описує, як час зростає з n, а не абсолютну швидкість на вашому комп’ютері.',
  },
] as const

const LADDER = [
  {
    label: 'O(1)',
    name: 'Стала',
    example: 'Доступ до A[i]',
    note: 'Не залежить від n',
    className: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  },
  {
    label: 'O(log n)',
    name: 'Логарифмічна',
    example: 'Бінарний пошук',
    note: '≈ 20 кроків для 10⁶',
    className: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  },
  {
    label: 'O(n)',
    name: 'Лінійна',
    example: 'Один прохід по масиву',
    note: '10⁶ операцій',
    className: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  },
  {
    label: 'O(n log n)',
    name: 'Лінеарифмічна',
    example: 'Merge, Quick, Heap',
    note: '≈ 2·10⁷ для 10⁶',
    className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  },
  {
    label: 'O(n²)',
    name: 'Квадратична',
    example: 'Bubble, Insertion, Selection',
    note: '≈ 5·10¹¹ для 10⁶',
    className: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  },
  {
    label: 'O(n + k)',
    name: 'Лінійна від діапазону',
    example: 'Counting, Radix',
    note: 'Потрібен малий k або мале d',
    className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  },
] as const

export function OverviewTab() {
  return (
    <section className="space-y-6">
      <TabHeading
        eyebrow="Big-O · Лекція 5"
        title="Як читати складність сортування"
        description="Складність — це не секунди, а характер зростання кількості операцій і пам’яті зі збільшенням n. Навчіться читати Ω, Θ та O — і зможете порівнювати алгоритми ще до запуску коду."
        icon={<IconOverview className="h-4 w-4" />}
      >
        <Badge tone="sky">Ω · Θ · O</Badge>
        <Badge tone="emerald">Час і пам’ять</Badge>
        <Badge tone="rose">Реальні приклади</Badge>
      </TabHeading>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <GrowthChart />
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <OperationsEstimator />
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <IconInfo className="h-4 w-4 text-sky-400" />
            Три позначення
          </p>
          <div className="mt-4 space-y-3">
            {NOTATIONS.map((item) => (
              <div key={item.symbol} className="flex gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-base font-bold ${item.className}`}
                >
                  {item.symbol}
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-400">
            У таблицях: <span className="text-emerald-400">Ω</span> — best,{' '}
            <span className="text-sky-400">Θ</span> — average,{' '}
            <span className="text-rose-400">O</span> — worst.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <IconBulb className="h-4 w-4 text-emerald-400" />
            Правила спрощення
          </p>
          <div className="mt-4 space-y-3">
            {RULES.map((rule) => (
              <div key={rule.code} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="font-mono text-[11px] font-semibold text-emerald-300">{rule.code}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{rule.text}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <IconInfo className="h-4 w-4 text-rose-400" />
            Міфи, які плутають
          </p>
          <div className="mt-4 space-y-3">
            {MYTHS.map((item) => (
              <div key={item.myth} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="flex gap-2 text-[11px] font-semibold text-slate-300">
                  <span className="text-rose-400" aria-hidden="true">✕</span>
                  {item.myth}
                </p>
                <p className="mt-1.5 flex gap-2 text-[11px] leading-relaxed text-slate-500">
                  <span className="text-emerald-400" aria-hidden="true">✓</span>
                  {item.truth}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-200">Сходинки складності</p>
            <p className="mt-1 text-xs text-slate-500">
              Від найшвидшого зростання до найповільнішого. Пам’ятайте: це порядок зростання,
              а не абсолютний час.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
            швидко → повільно
          </span>
        </div>

        <div className="mt-4 grid gap-2">
          {LADDER.map((step) => (
            <div
              key={step.label}
              className="grid gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5 sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:items-center"
            >
              <span
                className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold ${step.className}`}
              >
                {step.label}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-300">
                  {step.name} <span className="text-slate-600">·</span>{' '}
                  <span className="text-slate-500">{step.example}</span>
                </p>
              </div>
              <span className="font-mono text-[10px] text-slate-500 sm:text-right">{step.note}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
