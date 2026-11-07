import { useCallback, useMemo, useState } from 'react'
import { QNA_ITEMS } from './qna'
import type { QnaCategory } from './types'
import { normalizeSearch } from '../lib/format'

export type QnaFilter = 'all' | QnaCategory

export const QNA_FILTERS: ReadonlyArray<{ id: QnaFilter; label: string }> = [
  { id: 'all', label: 'Усі' },
  { id: 'basics', label: 'Основи' },
  { id: 'algorithms', label: 'Алгоритми' },
  { id: 'practice', label: 'Практика' },
  { id: 'exam', label: 'Іспит' },
]

export function useQnaBrowser() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<QnaFilter>('all')
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set())

  const categoryCounts = useMemo(() => {
    return QNA_ITEMS.reduce<Record<string, number>>((counts, item) => {
      counts[item.category] = (counts[item.category] ?? 0) + 1
      return counts
    }, {})
  }, [])

  const filteredItems = useMemo(() => {
    const needle = normalizeSearch(query)

    return QNA_ITEMS.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category
      if (!matchesCategory) return false
      if (!needle) return true

      const haystack = normalizeSearch(
        [item.question, ...item.answer].join(' '),
      )
      return haystack.includes(needle)
    })
  }, [category, query])

  const toggleItem = useCallback((id: string) => {
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setOpenIds(new Set(filteredItems.map((item) => item.id)))
  }, [filteredItems])

  const collapseAll = useCallback(() => {
    setOpenIds(new Set())
  }, [])

  const isOpen = useCallback((id: string) => openIds.has(id), [openIds])

  return {
    query,
    setQuery,
    category,
    setCategory,
    categoryCounts,
    filteredItems,
    toggleItem,
    expandAll,
    collapseAll,
    isOpen,
    openCount: openIds.size,
  }
}
