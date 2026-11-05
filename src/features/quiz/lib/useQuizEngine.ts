import { useCallback, useEffect, useRef } from 'react'
import { buildQuiz } from '../model/quizBuilder'
import type {
  QuizAnswerRecord,
  QuizMode,
  QuizProgress,
  QuizQuestion,
  QuizSessionState,
  QuizStatus,
  SortingStatePayload,
} from '../model/types'
import { evaluateAnswer } from './answerValidation'
import {
  createEmptyProgress,
  createIdleSession,
  isQuizProgress,
  isQuizSession,
  QUIZ_STORAGE_KEYS,
} from './storage'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT_QUESTION_LIMIT = 10

export interface UseQuizEngineOptions {
  /** Replace mockModule1Data with the real Module 1 sorting snapshots. */
  payloads?: SortingStatePayload[]
}

export interface QuizEngine {
  status: QuizStatus
  mode: QuizMode
  questions: QuizQuestion[]
  currentQuestion: QuizQuestion | null
  currentIndex: number
  totalQuestions: number
  score: number
  answers: QuizAnswerRecord[]
  currentAnswer: QuizAnswerRecord | null
  selectedOptionId: string | null
  isAnswered: boolean
  isCorrect: boolean
  isWrong: boolean
  stats: QuizProgress
  accuracy: number
  startedAt: number | null
  finishedAt: number | null
  startQuiz: (mode?: QuizMode) => void
  selectAnswer: (optionId: string) => void
  nextQuestion: () => void
  restartQuiz: () => void
  quitSession: () => void
  resetProgress: () => void
}

export function useQuizEngine(
  options: UseQuizEngineOptions = {},
): QuizEngine {
  const payloads = options.payloads

  const [stats, setStats] = useLocalStorage<QuizProgress>(
    QUIZ_STORAGE_KEYS.progress,
    createEmptyProgress(),
    isQuizProgress,
  )
  const [session, setSession] = useLocalStorage<QuizSessionState>(
    QUIZ_STORAGE_KEYS.session,
    createIdleSession(),
    isQuizSession,
  )

  const sessionRef = useRef(session)

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  const startQuiz = useCallback(
    (mode: QuizMode = 'mixed') => {
      const questions = buildQuiz(mode, {
        limit: DEFAULT_QUESTION_LIMIT,
        seed: Date.now(),
        payloads,
      })

      if (questions.length === 0) {
        return
      }

      const nextSession: QuizSessionState = {
        status: 'playing',
        mode,
        questions,
        currentIndex: 0,
        answers: [],
        score: 0,
        startedAt: Date.now(),
        finishedAt: null,
      }

      sessionRef.current = nextSession
      setSession(nextSession)
    },
    [payloads, setSession],
  )

  const selectAnswer = useCallback(
    (optionId: string) => {
      const currentSession = sessionRef.current

      if (currentSession.status !== 'playing') {
        return
      }

      const question = currentSession.questions[currentSession.currentIndex]

      if (!question) {
        return
      }

      const alreadyAnswered = currentSession.answers.some(
        (answer) => answer.questionId === question.id,
      )

      if (alreadyAnswered) {
        return
      }

      const evaluation = evaluateAnswer(question, optionId)
      const answer: QuizAnswerRecord = {
        questionId: question.id,
        selectedOptionId: optionId,
        isCorrect: evaluation.isCorrect,
        answeredAt: Date.now(),
      }

      const nextSession: QuizSessionState = {
        ...currentSession,
        answers: [...currentSession.answers, answer],
        score: currentSession.score + (evaluation.isCorrect ? 1 : 0),
      }

      // Update the ref immediately so a fast double click cannot record two
      // answers for the same question before React re-renders.
      sessionRef.current = nextSession
      setSession(nextSession)
      setStats((previous) => ({
        ...previous,
        totalAnswered: previous.totalAnswered + 1,
        totalCorrect:
          previous.totalCorrect + (evaluation.isCorrect ? 1 : 0),
      }))
    },
    [setSession, setStats],
  )

  const nextQuestion = useCallback(() => {
    const currentSession = sessionRef.current

    if (currentSession.status !== 'playing') {
      return
    }

    const currentQuestion =
      currentSession.questions[currentSession.currentIndex]

    if (!currentQuestion) {
      return
    }

    const isAnswered = currentSession.answers.some(
      (answer) => answer.questionId === currentQuestion.id,
    )

    if (!isAnswered) {
      return
    }

    const isLastQuestion =
      currentSession.currentIndex >= currentSession.questions.length - 1

    if (isLastQuestion) {
      const finishedAt = Date.now()
      const finishedSession: QuizSessionState = {
        ...currentSession,
        status: 'finished',
        finishedAt,
      }

      sessionRef.current = finishedSession
      setSession(finishedSession)
      setStats((previous) => {
        const total = currentSession.questions.length
        const percent =
          total > 0
            ? Math.round((currentSession.score / total) * 100)
            : 0
        const isNewBest =
          previous.bestTotal === 0 || percent > previous.bestPercent

        return {
          ...previous,
          bestScore: isNewBest ? currentSession.score : previous.bestScore,
          bestTotal: isNewBest ? total : previous.bestTotal,
          bestPercent: isNewBest ? percent : previous.bestPercent,
          completedRuns: previous.completedRuns + 1,
          lastPlayedAt: new Date().toISOString(),
        }
      })
      return
    }

    const nextSession: QuizSessionState = {
      ...currentSession,
      currentIndex: currentSession.currentIndex + 1,
    }

    sessionRef.current = nextSession
    setSession(nextSession)
  }, [setSession, setStats])

  const restartQuiz = useCallback(() => {
    startQuiz(sessionRef.current.mode)
  }, [startQuiz])

  const quitSession = useCallback(() => {
    const idleSession = createIdleSession()
    sessionRef.current = idleSession
    setSession(idleSession)
  }, [setSession])

  const resetProgress = useCallback(() => {
    const idleSession = createIdleSession()
    sessionRef.current = idleSession
    setSession(idleSession)
    setStats(createEmptyProgress())
  }, [setSession, setStats])

  const currentQuestion =
    session.status === 'playing'
      ? session.questions[session.currentIndex] ?? null
      : null

  const currentAnswer = currentQuestion
    ? session.answers.find(
        (answer) => answer.questionId === currentQuestion.id,
      ) ?? null
    : null

  const isAnswered = currentAnswer !== null
  const isCorrect = currentAnswer?.isCorrect ?? false
  const selectedOptionId = currentAnswer?.selectedOptionId ?? null
  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0

  return {
    status: session.status,
    mode: session.mode,
    questions: session.questions,
    currentQuestion,
    currentIndex: session.currentIndex,
    totalQuestions: session.questions.length,
    score: session.score,
    answers: session.answers,
    currentAnswer,
    selectedOptionId,
    isAnswered,
    isCorrect,
    isWrong: isAnswered && !isCorrect,
    stats,
    accuracy,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    startQuiz,
    selectAnswer,
    nextQuestion,
    restartQuiz,
    quitSession,
    resetProgress,
  }
}
