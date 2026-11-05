import { useCallback, useEffect, useMemo, useState } from 'react'
import { ALGORITHM_INFO, runSort } from './algorithms'
import type {
  AlgorithmInfo,
  SortSnapshot,
  SortingAlgorithmId,
} from './types'

export const MIN_ARRAY_SIZE = 10
export const MAX_ARRAY_SIZE = 100
export const DEFAULT_ARRAY_SIZE = 24

export const MIN_SPEED = 1
export const MAX_SPEED = 100
export const DEFAULT_SPEED = 20

const MIN_VALUE = 5
const MAX_VALUE = 100

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export function createRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => {
    return MIN_VALUE + Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1))
  })
}

export interface UseSortingEngineOptions {
  readonly initialSize?: number
  readonly initialAlgorithm?: SortingAlgorithmId
  readonly initialSpeed?: number
}

export interface UseSortingEngineResult {
  /** Source array the current history was generated from. */
  readonly values: readonly number[]
  /** Current frame — the arrays, highlights and counters to render. */
  readonly snapshot: SortSnapshot

  readonly algorithm: SortingAlgorithmId
  readonly algorithmInfo: AlgorithmInfo
  readonly arraySize: number
  readonly speed: number

  readonly comparisons: number
  readonly movements: number
  readonly currentStep: number
  readonly totalSteps: number
  /** Playback progress in the `[0, 1]` range. */
  readonly progress: number
  readonly isPlaying: boolean
  readonly isFinished: boolean
  readonly canStepBackward: boolean
  readonly canStepForward: boolean

  readonly play: () => void
  readonly pause: () => void
  readonly togglePlayback: () => void
  readonly stepForward: () => void
  readonly stepBackward: () => void
  readonly seek: (step: number) => void
  readonly generateNewArray: () => void
  readonly setArraySize: (size: number) => void
  readonly setSpeed: (speed: number) => void
  readonly setAlgorithm: (algorithm: SortingAlgorithmId) => void
}

/**
 * Central engine for the arena.
 *
 * Algorithms are generators, so every comparison / swap / write produces a
 * complete snapshot. The full history is built once per array + algorithm
 * pair; that makes backwards stepping and scrubbing instant while playback
 * simply advances an index through the precomputed frames.
 */
export function useSortingEngine(
  options: UseSortingEngineOptions = {},
): UseSortingEngineResult {
  const [arraySize, setArraySizeState] = useState(() =>
    clamp(options.initialSize ?? DEFAULT_ARRAY_SIZE, MIN_ARRAY_SIZE, MAX_ARRAY_SIZE),
  )
  const [values, setValues] = useState<number[]>(() => createRandomArray(arraySize))
  const [algorithm, setAlgorithmState] = useState<SortingAlgorithmId>(
    options.initialAlgorithm ?? 'bubble',
  )
  const [speed, setSpeedState] = useState(() =>
    clamp(options.initialSpeed ?? DEFAULT_SPEED, MIN_SPEED, MAX_SPEED),
  )
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const history = useMemo(() => runSort(algorithm, values), [algorithm, values])

  const lastStep = history.length - 1
  const snapshot = history[Math.min(currentStep, lastStep)]
  const isFinished = currentStep >= lastStep
  const isActivelyPlaying = isPlaying && !isFinished
  const progress = lastStep === 0 ? 1 : currentStep / lastStep

  useEffect(() => {
    if (!isActivelyPlaying) {
      return undefined
    }

    const delay = Math.max(10, Math.round(1000 / speed))
    const timeoutId = window.setTimeout(() => {
      setCurrentStep((step) => Math.min(step + 1, lastStep))
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [currentStep, isActivelyPlaying, lastStep, speed])

  const play = useCallback(() => {
    setCurrentStep((step) => (step >= lastStep ? 0 : step))
    setIsPlaying(true)
  }, [lastStep])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const togglePlayback = useCallback(() => {
    if (isActivelyPlaying) {
      setIsPlaying(false)
      return
    }

    setCurrentStep((step) => (step >= lastStep ? 0 : step))
    setIsPlaying(true)
  }, [isActivelyPlaying, lastStep])

  const stepForward = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep((step) => Math.min(step + 1, lastStep))
  }, [lastStep])

  const stepBackward = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep((step) => Math.max(step - 1, 0))
  }, [])

  const seek = useCallback(
    (step: number) => {
      setIsPlaying(false)
      setCurrentStep(clamp(Math.round(step), 0, lastStep))
    },
    [lastStep],
  )

  const generateNewArray = useCallback(() => {
    setValues(createRandomArray(arraySize))
    setCurrentStep(0)
    setIsPlaying(false)
  }, [arraySize])

  const setArraySize = useCallback((size: number) => {
    const nextSize = clamp(Math.round(size), MIN_ARRAY_SIZE, MAX_ARRAY_SIZE)
    setArraySizeState(nextSize)
    setValues(createRandomArray(nextSize))
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const setSpeed = useCallback((nextSpeed: number) => {
    setSpeedState(clamp(Math.round(nextSpeed), MIN_SPEED, MAX_SPEED))
  }, [])

  const setAlgorithm = useCallback((nextAlgorithm: SortingAlgorithmId) => {
    setAlgorithmState(nextAlgorithm)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  return {
    values,
    snapshot,
    algorithm,
    algorithmInfo: ALGORITHM_INFO[algorithm],
    arraySize,
    speed,
    comparisons: snapshot.comparisons,
    movements: snapshot.movements,
    currentStep,
    totalSteps: history.length,
    progress,
    isPlaying: isActivelyPlaying,
    isFinished,
    canStepBackward: currentStep > 0,
    canStepForward: currentStep < lastStep,
    play,
    pause,
    togglePlayback,
    stepForward,
    stepBackward,
    seek,
    generateNewArray,
    setArraySize,
    setSpeed,
    setAlgorithm,
  }
}
