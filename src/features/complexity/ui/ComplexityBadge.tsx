import type { ReactNode } from 'react'
import { cn } from '../lib/format'

export type BadgeTone = 'sky' | 'emerald' | 'rose' | 'amber' | 'violet' | 'slate'

const TONE_CLASSES: Record<BadgeTone, string> = {
  sky: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  rose: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  amber: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  violet: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  slate: 'border-slate-700 bg-slate-800/60 text-slate-300',
}

const TONE_TEXT_CLASSES: Record<BadgeTone, string> = {
  sky: 'text-sky-300',
  emerald: 'text-emerald-300',
  rose: 'text-rose-300',
  amber: 'text-amber-300',
  violet: 'text-violet-300',
  slate: 'text-slate-400',
}

export function Badge({
  tone = 'slate',
  children,
  className,
}: {
  readonly tone?: BadgeTone
  readonly children: ReactNode
  readonly className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function ComplexityToken({
  prefix,
  value,
  tone,
}: {
  readonly prefix: string
  readonly value: string
  readonly tone: BadgeTone
}) {
  return (
    <span className="inline-flex items-baseline gap-1 font-mono text-sm text-slate-100">
      <span className={cn('text-[11px] font-semibold', TONE_TEXT_CLASSES[tone])}>
        {prefix}
      </span>
      <span>{value}</span>
    </span>
  )
}

export function ComplexityCell({
  label,
  prefix,
  value,
  tone,
}: {
  readonly label: string
  readonly prefix: string
  readonly value: string
  readonly tone: BadgeTone
}) {
  return (
    <div className={cn('rounded-xl border p-3', TONE_CLASSES[tone])}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <div className="mt-1.5">
        <ComplexityToken prefix={prefix} value={value} tone={tone} />
      </div>
    </div>
  )
}
