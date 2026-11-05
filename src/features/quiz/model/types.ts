/**
 * Public contracts of the Quiz feature.
 *
 * SortingStatePayload is the integration seam for Module 1 ("Sorting").
 * The quiz engine only depends on this interface, never on Module 1 internals,
 * so mock data can be replaced with the real sorting state export without
 * touching the quiz lifecycle, validation or UI.
 */

export type QuizStatus = 'idle' | 'playing' | 'finished'

export type QuizMode = 'mixed' | 'sorting' | 'theory'

export type QuizDifficulty = 'easy' | 'medium' | 'hard'

export type QuizQuestionSource = 'generated' | 'bank'

export type SortingAlgorithm =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap'

export type SortingOperation =
  | 'compare'
  | 'swap'
  | 'insert'
  | 'select-minimum'
  | 'mark-sorted'
  | 'partition'
  | 'merge'

/** One immutable snapshot of the sorting visualizer. */
export interface SortingStep {
  stepIndex: number
  array: number[]
  activeIndices: number[]
  sortedIndices: number[]
  operation: SortingOperation
  description: string
}

/**
 * Expected payload from Module 1.
 *
 * `steps` contains the full iteration history (past and future). The quiz
 * generator needs the future steps to ask "what happens next". A future
 * adapter can build this payload from the sorting store:
 *
 *   toSortingPayload(state) -> SortingStatePayload
 */
export interface SortingStatePayload {
  algorithm: SortingAlgorithm
  algorithmLabel: string
  steps: SortingStep[]
  currentStepIndex?: number
  pseudocode?: string[]
  metadata?: Record<string, string | number | boolean>
}

export interface QuizOption {
  id: string
  label: string
  /** Canonical answer payload, used by pure validation helpers. */
  value?: string
}

export interface QuizQuestionContext {
  algorithmLabel: string
  array: number[]
  activeIndices: number[]
  sortedIndices: number[]
  stepNumber: number
  stepDescription: string
  pseudocode?: string[]
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: QuizOption[]
  correctOptionId: string
  explanation: string
  difficulty: QuizDifficulty
  source: QuizQuestionSource
  context?: QuizQuestionContext
  hint?: string
  tags: string[]
}

export interface QuizAnswerRecord {
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
  answeredAt: number
}

export interface QuizSessionState {
  status: QuizStatus
  mode: QuizMode
  questions: QuizQuestion[]
  currentIndex: number
  answers: QuizAnswerRecord[]
  score: number
  startedAt: number | null
  finishedAt: number | null
}

export interface QuizProgress {
  bestScore: number
  bestTotal: number
  bestPercent: number
  completedRuns: number
  totalAnswered: number
  totalCorrect: number
  lastPlayedAt: string | null
}

export interface AnswerEvaluation {
  isCorrect: boolean
  normalizedAnswer: string
  expectedAnswer: string
}
