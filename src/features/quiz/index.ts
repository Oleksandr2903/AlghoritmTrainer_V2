/**
 * Public facade of the Quiz feature.
 *
 * App.tsx consumes only this file:
 *   import { QuizTrainer } from './features/quiz'
 */
export { QuizTrainer } from './ui/QuizTrainer'

export type {
  AnswerEvaluation,
  QuizAnswerRecord,
  QuizDifficulty,
  QuizMode,
  QuizOption,
  QuizProgress,
  QuizQuestion,
  QuizQuestionContext,
  QuizQuestionSource,
  QuizSessionState,
  QuizStatus,
  SortingAlgorithm,
  SortingOperation,
  SortingStatePayload,
  SortingStep,
} from './model/types'
