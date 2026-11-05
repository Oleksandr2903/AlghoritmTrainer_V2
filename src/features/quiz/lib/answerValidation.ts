import type { AnswerEvaluation, QuizQuestion } from '../model/types'
import {
  arraysEqual,
  parseNumberArrayInput,
  serializeNumberArray,
} from './arrayUtils'

export function normalizeAnswer(value: string | null | undefined): string {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
}

export function isAnswerCorrect(
  question: QuizQuestion,
  selectedOptionId: string,
): boolean {
  return evaluateAnswer(question, selectedOptionId).isCorrect
}

/**
 * Validates a multiple-choice answer by id and, when both options expose a
 * canonical value, by content as well. The content check keeps the logic
 * reusable for the future free-form "next step" input.
 */
export function evaluateAnswer(
  question: QuizQuestion,
  selectedOptionId: string,
): AnswerEvaluation {
  const selectedOption = question.options.find(
    (option) => option.id === selectedOptionId,
  )
  const expectedOption = question.options.find(
    (option) => option.id === question.correctOptionId,
  )

  const selectedValue = selectedOption?.value ?? selectedOption?.label ?? ''
  const expectedValue = expectedOption?.value ?? expectedOption?.label ?? ''
  const normalizedAnswer = normalizeAnswer(selectedValue)
  const expectedAnswer = normalizeAnswer(expectedValue)

  const sameId = selectedOption?.id === question.correctOptionId
  const sameValue =
    normalizedAnswer.length > 0 &&
    expectedAnswer.length > 0 &&
    normalizedAnswer === expectedAnswer

  return {
    isCorrect: Boolean(selectedOption) && (sameId || sameValue),
    normalizedAnswer,
    expectedAnswer,
  }
}

/**
 * Pure validator for the "guess the next sorting step" game. It accepts either
 * an array or a textual representation such as "[3, 1, 2]" / "3,1,2".
 */
export function matchesExpectedStep(
  input: string | readonly number[] | null | undefined,
  expected: readonly number[],
): boolean {
  if (Array.isArray(input)) {
    return arraysEqual(input as readonly number[], expected)
  }

  if (typeof input !== 'string') {
    return false
  }

  const parsed = parseNumberArrayInput(input)

  if (parsed) {
    return arraysEqual(parsed, expected)
  }

  return normalizeAnswer(input) === normalizeAnswer(serializeNumberArray(expected))
}
