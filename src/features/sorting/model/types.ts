/**
 * Public domain types for the sorting feature.
 *
 * Every algorithm is implemented as a generator of `SortSnapshot`s. Because
 * each snapshot is a complete, immutable frame, the UI can move both forward
 * and backward through the recorded history ("time travel").
 */

export const SORTING_ALGORITHM_IDS = [
  'bubble',
  'insertion',
  'selection',
  'merge',
  'quick',
  'counting',
] as const

export type SortingAlgorithmId = (typeof SORTING_ALGORITHM_IDS)[number]

export interface AlgorithmComplexity {
  readonly best: string
  readonly average: string
  readonly worst: string
  readonly space: string
}

export interface AlgorithmInfo {
  readonly id: SortingAlgorithmId
  readonly name: string
  readonly ukrainianName: string
  readonly description: string
  readonly complexity: AlgorithmComplexity
  readonly stable: boolean
}

/**
 * A single frame produced by an algorithm generator.
 *
 * Index arrays contain positions in `array`, not values. They are always
 * copied by the algorithm so older snapshots can never be mutated.
 */
export interface SortSnapshot {
  /** Array state after the operation that produced this frame. */
  readonly array: readonly number[]
  /** Indices currently being compared (rendered in rose). */
  readonly comparing: readonly number[]
  /** Indices just swapped or written (rendered in emerald). */
  readonly swapped: readonly number[]
  /** Indices that belong to a finished / sorted region (emerald). */
  readonly sorted: readonly number[]
  /** Cumulative comparison counter at this frame. */
  readonly comparisons: number
  /** Cumulative movement counter (swap = 2, write = 1). */
  readonly movements: number
  /** Human-readable description of the current operation. */
  readonly message: string
  /** True only for the final frame. */
  readonly done: boolean
}

/** Generator contract implemented by every sorting algorithm. */
export type SortGenerator = Generator<SortSnapshot, void, void>
