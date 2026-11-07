import { useEffect, useState } from 'react'
import type { ComplexityTabId } from '../model/types'
import { readStoredJson, writeStoredJson } from '../lib/storage'

export interface ComplexityTabMeta {
  readonly id: ComplexityTabId
  readonly label: string
  readonly caption: string
}

export const COMPLEXITY_TABS: readonly ComplexityTabMeta[] = [
  { id: 'overview', label: 'Огляд', caption: 'Big-O та зростання' },
  { id: 'algorithms', label: 'Алгоритми', caption: '8 довідкових карток' },
  { id: 'qna', label: 'Питання', caption: 'Часті запитання' },
  { id: 'practice', label: 'Практика', caption: 'Код + задачі' },
]

const STORAGE_KEY = 'active-tab'

function isTabId(value: unknown): value is ComplexityTabId {
  return COMPLEXITY_TABS.some((tab) => tab.id === value)
}

function loadInitialTab(): ComplexityTabId {
  const stored = readStoredJson<unknown>(STORAGE_KEY, 'overview')
  return isTabId(stored) ? stored : 'overview'
}

export function useComplexityNavigation() {
  const [activeTab, setActiveTab] = useState<ComplexityTabId>(loadInitialTab)

  useEffect(() => {
    writeStoredJson(STORAGE_KEY, activeTab)
  }, [activeTab])

  return {
    activeTab,
    setActiveTab,
    tabs: COMPLEXITY_TABS,
  }
}
