import { useCallback, useEffect, useMemo, useState } from 'react'
import { CHALLENGES } from './challenges'
import { readStoredJson, writeStoredJson } from '../lib/storage'

export type ChallengeStatus = 'unanswered' | 'correct' | 'incorrect'

type AnswerMap = Record<string, string>

const STORAGE_KEY = 'practice-answers'

function loadAnswers(): AnswerMap {
  const stored = readStoredJson<Record<string, unknown>>(STORAGE_KEY, {})
  const answers: AnswerMap = {}

  for (const challenge of CHALLENGES) {
    const answer = stored[challenge.id]
    if (typeof answer === 'string' && challenge.options.some((option) => option.id === answer)) {
      answers[challenge.id] = answer
    }
  }

  return answers
}

export function usePracticeSession() {
  const [answers, setAnswers] = useState<AnswerMap>(loadAnswers)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    writeStoredJson(STORAGE_KEY, answers)
  }, [answers])

  const total = CHALLENGES.length
  const currentChallenge = CHALLENGES[Math.min(currentIndex, total - 1)]

  const selectedOptionId = answers[currentChallenge.id] ?? null
  const selectedOption =
    currentChallenge.options.find((option) => option.id === selectedOptionId) ?? null
  const isAnswered = selectedOption !== null
  const isCorrect = selectedOption?.correct ?? false

  const answeredCount = CHALLENGES.filter((challenge) => Boolean(answers[challenge.id])).length
  const correctCount = CHALLENGES.filter((challenge) =>
    challenge.options.some(
      (option) => option.id === answers[challenge.id] && option.correct,
    ),
  ).length
  const isComplete = answeredCount === total
  const progressPercent = total > 0 ? (answeredCount / total) * 100 : 0
  const scorePercent = total > 0 ? (correctCount / total) * 100 : 0

  const selectOption = useCallback(
    (optionId: string) => {
      if (!currentChallenge.options.some((option) => option.id === optionId)) return

      setAnswers((current) => {
        if (current[currentChallenge.id]) return current
        return { ...current, [currentChallenge.id]: optionId }
      })
    },
    [currentChallenge],
  )

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(Math.max(index, 0), total - 1))
    },
    [total],
  )

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, total - 1))
  }, [total])

  const goPrevious = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0))
  }, [])

  const reset = useCallback(() => {
    setAnswers({})
    setCurrentIndex(0)
  }, [])

  const getStatus = useCallback(
    (challengeId: string): ChallengeStatus => {
      const answer = answers[challengeId]
      if (!answer) return 'unanswered'

      const challenge = CHALLENGES.find((item) => item.id === challengeId)
      const option = challenge?.options.find((item) => item.id === answer)
      return option?.correct ? 'correct' : 'incorrect'
    },
    [answers],
  )

  const statusPerChallenge = useMemo(
    () => CHALLENGES.map((challenge) => getStatus(challenge.id)),
    [getStatus],
  )

  return {
    total,
    currentIndex,
    currentChallenge,
    selectedOptionId,
    isAnswered,
    isCorrect,
    answeredCount,
    correctCount,
    isComplete,
    progressPercent,
    scorePercent,
    statusPerChallenge,
    selectOption,
    goTo,
    goNext,
    goPrevious,
    reset,
    getStatus,
  }
}
