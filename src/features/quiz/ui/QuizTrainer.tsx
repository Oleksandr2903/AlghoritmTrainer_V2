import type { SortingStatePayload } from '../model/types'
import { useQuizEngine } from '../lib/useQuizEngine'
import { QuizGame } from './QuizGame'
import { QuizLobby } from './QuizLobby'
import { QuizResults } from './QuizResults'

interface QuizTrainerProps {
  /**
   * Optional Module 1 snapshots. When omitted, mockModule1Data is used, so the
   * module can be developed and demoed before the sorting module is ready.
   */
  sortingPayloads?: SortingStatePayload[]
}

export function QuizTrainer({ sortingPayloads }: QuizTrainerProps) {
  const engine = useQuizEngine({ payloads: sortingPayloads })

  if (engine.status === 'playing' && engine.currentQuestion) {
    return (
      <QuizGame
        question={engine.currentQuestion}
        questions={engine.questions}
        answers={engine.answers}
        currentIndex={engine.currentIndex}
        totalQuestions={engine.totalQuestions}
        score={engine.score}
        selectedOptionId={engine.selectedOptionId}
        isAnswered={engine.isAnswered}
        isCorrect={engine.isCorrect}
        onSelectAnswer={engine.selectAnswer}
        onNext={engine.nextQuestion}
        onQuit={engine.quitSession}
      />
    )
  }

  if (engine.status === 'finished') {
    return (
      <QuizResults
        questions={engine.questions}
        answers={engine.answers}
        score={engine.score}
        total={engine.totalQuestions}
        stats={engine.stats}
        startedAt={engine.startedAt}
        finishedAt={engine.finishedAt}
        onRestart={engine.restartQuiz}
        onExit={engine.quitSession}
      />
    )
  }

  return (
    <QuizLobby
      stats={engine.stats}
      onStart={engine.startQuiz}
      onResetProgress={engine.resetProgress}
    />
  )
}
