/**
 * Public facade of the sorting feature.
 * Only this file should be imported by the rest of the application.
 */
export { SortingArena } from './ui/SortingArena'

export { useSortingEngine } from './model/useSortingEngine'
export type {
  UseSortingEngineOptions,
  UseSortingEngineResult,
} from './model/useSortingEngine'

export {
  ALGORITHM_IMPLEMENTATIONS,
  ALGORITHM_INFO,
  SORTING_ALGORITHMS,
  runSort,
} from './model/algorithms'

export { SORTING_ALGORITHM_IDS } from './model/types'
export type {
  AlgorithmComplexity,
  AlgorithmInfo,
  SortGenerator,
  SortSnapshot,
  SortingAlgorithmId,
} from './model/types'
