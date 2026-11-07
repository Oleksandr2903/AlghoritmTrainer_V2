/**
 * Public facade of the complexity feature.
 *
 * App.tsx consumes only this file:
 *   import { ComplexitySimulator } from './features/complexity'
 */
export { ComplexitySimulator } from './ui/ComplexitySimulator'

export type {
  AlgorithmFamily,
  ChallengeDifficulty,
  ChallengeKind,
  CodeChallenge,
  ComplexityTabId,
  QnaCategory,
  QnaItem,
  SortingComplexity,
} from './model/types'

export { SORTING_ALGORITHMS } from './model/sortingAlgorithms'
export { QNA_ITEMS } from './model/qna'
export { CHALLENGES } from './model/challenges'
