import type { ReactNode } from 'react'

interface TabHeadingProps {
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly icon: ReactNode
  readonly children?: ReactNode
}

export function TabHeading({ eyebrow, title, description, icon, children }: TabHeadingProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-sky-400">
          {icon}
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-500">
            {eyebrow}
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-100 sm:text-2xl">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
      </div>
      {children ? <div className="flex flex-wrap gap-2 lg:justify-end">{children}</div> : null}
    </header>
  )
}
