import { useCallback, useEffect, useMemo, useState } from 'react'
import { SORTING_ALGORITHMS, findAlgorithm } from './sortingAlgorithms'
import type { AlgorithmFamily, SortingComplexity } from './types'
import { readStoredJson, writeStoredJson } from '../lib/storage'

export type FamilyFilter = 'all' | AlgorithmFamily

export const FAMILY_FILTERS: ReadonlyArray<{ id: FamilyFilter; label: string }> = [
  { id: 'all', label: 'Усі' },
  { id: 'comparison', label: 'Порівняльні' },
  { id: 'linear', label: 'Без порівнянь' },
]

const STORAGE_KEY = 'selected-algorithm'

function loadInitialAlgorithm(): SortingComplexity {
  const stored = readStoredJson<unknown>(STORAGE_KEY, 'merge')
  return typeof stored === 'string' ? findAlgorithm(stored) : findAlgorithm('merge')
}

export function useAlgorithmExplorer() {
  const [family, setFamilyState] = useState<FamilyFilter>('all')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingComplexity>(loadInitialAlgorithm)

  const filteredAlgorithms = useMemo(() => {
    if (family === 'all') return SORTING_ALGORITHMS
    return SORTING_ALGORITHMS.filter((algorithm) => algorithm.family === family)
  }, [family])

  useEffect(() => {
    writeStoredJson(STORAGE_KEY, selectedAlgorithm.id)
  }, [selectedAlgorithm.id])

  const selectAlgorithm = useCallback((id: string) => {
    setSelectedAlgorithm(findAlgorithm(id))
  }, [])

  const setFamily = useCallback((nextFamily: FamilyFilter) => {
    setFamilyState(nextFamily)

    if (nextFamily === 'all') return

    setSelectedAlgorithm((current) => {
      if (current.family === nextFamily) return current
      return SORTING_ALGORITHMS.find((algorithm) => algorithm.family === nextFamily) ?? current
    })
  }, [])

  return {
    family,
    setFamily,
    filteredAlgorithms,
    selectedAlgorithm,
    selectAlgorithm,
  }
}
