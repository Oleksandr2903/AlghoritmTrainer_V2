export type ComplexityTabId = 'overview' | 'algorithms' | 'qna' | 'practice'

export type AlgorithmFamily = 'comparison' | 'linear'

export type AlgorithmAccent = 'sky' | 'emerald' | 'rose' | 'amber' | 'violet'

export interface SortingComplexity {
  readonly id: string
  readonly name: string
  readonly englishName: string
  readonly family: AlgorithmFamily
  readonly accent: AlgorithmAccent
  readonly short: string
  readonly best: string
  readonly average: string
  readonly worst: string
  readonly space: string
  readonly stable: boolean
  readonly inPlace: boolean
  readonly adaptive: boolean
  readonly idea: string
  readonly steps: readonly string[]
  readonly advantages: readonly string[]
  readonly disadvantages: readonly string[]
  readonly useCases: readonly string[]
  readonly pseudocode: string
}

export type QnaCategory = 'basics' | 'algorithms' | 'practice' | 'exam'

export interface QnaItem {
  readonly id: string
  readonly category: QnaCategory
  readonly question: string
  readonly answer: readonly string[]
}

export type ChallengeKind = 'complexity' | 'memory' | 'advantage'
export type ChallengeDifficulty = 'basic' | 'medium' | 'advanced'

export interface ChallengeOption {
  readonly id: string
  readonly text: string
  readonly correct: boolean
}

export interface CodeChallenge {
  readonly id: string
  readonly title: string
  readonly topic: string
  readonly kind: ChallengeKind
  readonly difficulty: ChallengeDifficulty
  readonly language: string
  readonly code: string
  readonly question: string
  readonly options: readonly ChallengeOption[]
  readonly explanation: string
  readonly takeaway: string
}

export interface GrowthSeries {
  readonly id: string
  readonly label: string
  readonly strokeClassName: string
  readonly textClassName: string
  readonly dotClassName: string
  readonly path: string
}

export interface ChartTick {
  readonly position: number
  readonly label: string
}

export interface OperationRow {
  readonly id: string
  readonly name: string
  readonly formula: string
  readonly operations: number
  readonly display: string
  readonly percent: number
  readonly segments: number
  readonly slowdown: number
  readonly badgeClassName: string
  readonly barClassName: string
}
