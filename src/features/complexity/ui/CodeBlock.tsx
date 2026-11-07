import { cn } from '../lib/format'

interface CodeBlockProps {
  readonly code: string
  readonly language: string
  readonly label?: string
  readonly className?: string
}

export function CodeBlock({ code, language, label, className }: CodeBlockProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-slate-800 bg-slate-950', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/60 px-4 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label ?? 'Приклад коду'}
        </span>
        <span className="rounded-md border border-slate-700 bg-slate-950 px-2 py-0.5 font-mono text-[10px] text-sky-400">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}
