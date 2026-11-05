import type { QuizProgress, QuizSessionState } from '../model/types'

export const QUIZ_STORAGE_KEYS = {
  progress: 'algolab.quiz.progress.v1',
  session: 'algolab.quiz.session.v1',
} as const

export function createEmptyProgress(): QuizProgress {
  return {
    bestScore: 0,
    bestTotal: 0,
    bestPercent: 0,
    completedRuns: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    lastPlayedAt: null,
  }
}

export function createIdleSession(): QuizSessionState {
  return {
    status: 'idle',
    mode: 'mixed',
    questions: [],
    currentIndex: 0,
    answers: [],
    score: 0,
    startedAt: null,
    finishedAt: null,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isQuizProgress(value: unknown): value is QuizProgress {
  if (!isRecord(value)) {
    return false
  }

  return (
    isNumber(value.bestScore) &&
    isNumber(value.bestTotal) &&
    isNumber(value.bestPercent) &&
    isNumber(value.completedRuns) &&
    isNumber(value.totalAnswered) &&
    isNumber(value.totalCorrect) &&
    (value.lastPlayedAt === null || typeof value.lastPlayedAt === 'string')
  )
}

function isStoredQuestion(value: unknown): boolean {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.prompt === 'string' &&
    typeof value.correctOptionId === 'string' &&
    Array.isArray(value.options) &&
    value.options.length > 0 &&
    value.options.every(
      (option) =>
        isRecord(option) &&
        typeof option.id === 'string' &&
        typeof option.label === 'string',
    )
  )
}

function isStoredAnswer(value: unknown): boolean {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.questionId === 'string' &&
    typeof value.selectedOptionId === 'string' &&
    typeof value.isCorrect === 'boolean' &&
    isNumber(value.answeredAt)
  )
}

export function isQuizSession(value: unknown): value is QuizSessionState {
  if (!isRecord(value)) {
    return false
  }

  if (
    value.status !== 'idle' &&
    value.status !== 'playing' &&
    value.status !== 'finished'
  ) {
    return false
  }

  if (
    value.mode !== 'mixed' &&
    value.mode !== 'sorting' &&
    value.mode !== 'theory'
  ) {
    return false
  }

  if (
    !Array.isArray(value.questions) ||
    !Array.isArray(value.answers) ||
    !value.questions.every(isStoredQuestion) ||
    !value.answers.every(isStoredAnswer)
  ) {
    return false
  }

  if (
    !isNumber(value.currentIndex) ||
    !Number.isInteger(value.currentIndex) ||
    value.currentIndex < 0 ||
    !isNumber(value.score) ||
    value.score < 0
  ) {
    return false
  }

  if (
    value.questions.length > 0 &&
    value.currentIndex >= value.questions.length
  ) {
    return false
  }

  if (value.answers.length > value.questions.length) {
    return false
  }

  if (
    value.status === 'playing' &&
    (value.questions.length === 0 ||
      value.currentIndex >= value.questions.length)
  ) {
    return false
  }

  return (
    (value.startedAt === null || isNumber(value.startedAt)) &&
    (value.finishedAt === null || isNumber(value.finishedAt))
  )
}
