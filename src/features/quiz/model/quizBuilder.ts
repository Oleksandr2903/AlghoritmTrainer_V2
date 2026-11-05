import { shuffleWithSeed } from '../lib/random'
import { mockSortingPayloads } from './mockModule1Data'
import { generateSortingQuestions } from './questionGenerator'
import { testBankQuestions } from './testBank'
import type { QuizMode, QuizQuestion, SortingStatePayload } from './types'

export interface BuildQuizOptions {
  limit?: number
  seed?: number
  payloads?: SortingStatePayload[]
  questionsPerAlgorithm?: number
}

const DEFAULT_LIMIT = 10

function pickMixedQuestions(
  generated: QuizQuestion[],
  theory: QuizQuestion[],
  limit: number,
  seed: number,
): QuizQuestion[] {
  if (generated.length === 0) {
    return shuffleWithSeed(theory, seed).slice(0, limit)
  }

  if (theory.length === 0) {
    return shuffleWithSeed(generated, seed).slice(0, limit)
  }

  const generatedShuffled = shuffleWithSeed(generated, seed + 211)
  const theoryShuffled = shuffleWithSeed(theory, seed + 101)
  const theoryCount = Math.min(
    theoryShuffled.length,
    Math.max(3, Math.round(limit / 3)),
  )
  const generatedCount = Math.min(generatedShuffled.length, limit - theoryCount)
  const selected = [
    ...generatedShuffled.slice(0, generatedCount),
    ...theoryShuffled.slice(0, theoryCount),
  ]

  if (selected.length < limit) {
    const usedIds = new Set(selected.map((question) => question.id))
    const remaining = [...theoryShuffled, ...generatedShuffled].filter(
      (question) => !usedIds.has(question.id),
    )
    selected.push(...remaining.slice(0, limit - selected.length))
  }

  return shuffleWithSeed(selected, seed)
}

/**
 * Builds a fresh quiz for the selected mode. `payloads` is the only bridge to
 * Module 1: pass real sorting snapshots here and the rest of the feature keeps
 * working unchanged.
 */
export function buildQuiz(
  mode: QuizMode,
  options: BuildQuizOptions = {},
): QuizQuestion[] {
  const {
    limit = DEFAULT_LIMIT,
    seed = Date.now(),
    payloads = mockSortingPayloads,
    questionsPerAlgorithm = 20,
  } = options

  const generated =
    mode === 'theory'
      ? []
      : payloads.flatMap((payload) =>
          generateSortingQuestions(payload, {
            maxQuestions: questionsPerAlgorithm,
          }),
        )

  if (mode === 'sorting') {
    return shuffleWithSeed(generated, seed).slice(0, limit)
  }

  if (mode === 'theory') {
    return shuffleWithSeed(testBankQuestions, seed).slice(0, limit)
  }

  return pickMixedQuestions(generated, testBankQuestions, limit, seed)
}
