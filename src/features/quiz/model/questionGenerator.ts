import { arraysEqual, serializeNumberArray } from '../lib/arrayUtils'
import { formatArray } from '../lib/format'
import { hashString, shuffleWithSeed } from '../lib/random'
import type {
  QuizOption,
  QuizQuestion,
  QuizQuestionContext,
  SortingOperation,
  SortingStatePayload,
  SortingStep,
} from './types'

const OPTION_IDS = ['a', 'b', 'c', 'd'] as const

const OPERATION_ORDER: SortingOperation[] = [
  'compare',
  'swap',
  'insert',
  'select-minimum',
  'mark-sorted',
  'partition',
  'merge',
]

const OPERATION_LABELS: Record<SortingOperation, string> = {
  compare: 'Порівняння двох елементів',
  swap: 'Обмін двох елементів',
  insert: 'Вставка елемента у відсортовану частину',
  'select-minimum': 'Пошук мінімального елемента',
  'mark-sorted': 'Позначення елемента як відсортованого',
  partition: 'Розбиття навколо опорного елемента',
  merge: 'Злиття двох відсортованих частин',
}

export interface GenerateSortingQuestionsOptions {
  maxQuestions?: number
  includeOperationQuestions?: boolean
}

function createContext(
  payload: SortingStatePayload,
  step: SortingStep,
): QuizQuestionContext {
  return {
    algorithmLabel: payload.algorithmLabel,
    array: [...step.array],
    activeIndices: [...step.activeIndices],
    sortedIndices: [...step.sortedIndices],
    stepNumber: step.stepIndex + 1,
    stepDescription: step.description,
    pseudocode: payload.pseudocode ? [...payload.pseudocode] : undefined,
  }
}

function swapAt(
  array: readonly number[],
  first: number,
  second: number,
): number[] {
  const copy = [...array]

  if (
    first < 0 ||
    second < 0 ||
    first >= copy.length ||
    second >= copy.length ||
    first === second
  ) {
    return copy
  }

  const temporary = copy[first]
  copy[first] = copy[second]
  copy[second] = temporary

  return copy
}

function rotate(array: readonly number[], offset: number): number[] {
  if (array.length === 0) {
    return []
  }

  const shift = ((offset % array.length) + array.length) % array.length
  return [...array.slice(shift), ...array.slice(0, shift)]
}

function createArrayDistractors(
  currentArray: readonly number[],
  correctArray: readonly number[],
  activeIndices: readonly number[],
): number[][] {
  const candidates: number[][] = []
  const seen = new Set<string>([serializeNumberArray(correctArray)])

  const tryAdd = (candidate: readonly number[]) => {
    const key = serializeNumberArray(candidate)

    if (seen.has(key)) {
      return
    }

    seen.add(key)
    candidates.push([...candidate])
  }

  tryAdd(currentArray)
  tryAdd([...correctArray].reverse())
  tryAdd(rotate(correctArray, 1))
  tryAdd(swapAt(correctArray, 0, correctArray.length - 1))

  for (
    let first = 0;
    first < correctArray.length && candidates.length < 3;
    first += 1
  ) {
    for (
      let second = first + 1;
      second < correctArray.length && candidates.length < 3;
      second += 1
    ) {
      const isActivePair =
        activeIndices.includes(first) && activeIndices.includes(second)

      if (!isActivePair) {
        tryAdd(swapAt(correctArray, first, second))
      }
    }
  }

  let attempt = 0

  while (candidates.length < 3 && attempt < 64) {
    tryAdd(
      shuffleWithSeed(
        correctArray,
        hashString(`${serializeNumberArray(correctArray)}:${attempt}`),
      ),
    )
    attempt += 1
  }

  for (
    let index = 0;
    index < correctArray.length && candidates.length < 3;
    index += 1
  ) {
    const value = (correctArray[index] ?? 0) + 1
    tryAdd(
      correctArray.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    )
  }

  return candidates.slice(0, 3)
}

function createArrayOptions(
  correctArray: readonly number[],
  distractors: readonly (readonly number[])[],
  questionId: string,
): { options: QuizOption[]; correctOptionId: string } {
  const allArrays = shuffleWithSeed(
    [correctArray, ...distractors],
    hashString(`${questionId}:options`),
  )

  const options = allArrays.map((array, index) => ({
    id: OPTION_IDS[index] ?? `option-${index}`,
    label: formatArray(array),
    value: serializeNumberArray(array),
  }))

  const correctIndex = allArrays.findIndex((array) =>
    arraysEqual(array, correctArray),
  )

  return {
    options,
    correctOptionId:
      options[correctIndex]?.id ?? options[0]?.id ?? OPTION_IDS[0],
  }
}

function createArrayOutcomeQuestion(
  payload: SortingStatePayload,
  currentStep: SortingStep,
  nextStep: SortingStep,
): QuizQuestion {
  const id = `gen-${payload.algorithm}-array-${currentStep.stepIndex}`
  const actionPhrase =
    nextStep.operation === 'swap'
      ? 'наступного обміну'
      : nextStep.operation === 'insert'
        ? 'наступної вставки'
        : 'наступного кроку'
  const { options, correctOptionId } = createArrayOptions(
    nextStep.array,
    createArrayDistractors(
      currentStep.array,
      nextStep.array,
      currentStep.activeIndices,
    ),
    id,
  )

  return {
    id,
    prompt: `Яким стане масив після ${actionPhrase}?`,
    options,
    correctOptionId,
    explanation: `На кроці ${nextStep.stepIndex + 1} ${nextStep.description} Отже, масив матиме вигляд ${formatArray(nextStep.array)}.`,
    difficulty: 'medium',
    source: 'generated',
    context: createContext(payload, currentStep),
    hint: 'Зверни увагу на активні індекси та напрямок обміну.',
    tags: [payload.algorithm, 'next-step', nextStep.operation],
  }
}

function createOperationQuestion(
  payload: SortingStatePayload,
  currentStep: SortingStep,
  nextStep: SortingStep,
): QuizQuestion {
  const id = `gen-${payload.algorithm}-operation-${currentStep.stepIndex}`
  const correctOperation = nextStep.operation
  const decoyOperations = shuffleWithSeed(
    OPERATION_ORDER.filter((operation) => operation !== correctOperation),
    hashString(`${id}:decoys`),
  ).slice(0, 3)
  const allOperations = shuffleWithSeed(
    [correctOperation, ...decoyOperations],
    hashString(`${id}:options`),
  )

  const options = allOperations.map((operation, index) => ({
    id: OPTION_IDS[index] ?? `option-${index}`,
    label: OPERATION_LABELS[operation],
    value: operation,
  }))
  const correctIndex = allOperations.indexOf(correctOperation)

  return {
    id,
    prompt: `Яку дію виконає алгоритм на кроці ${nextStep.stepIndex + 1}?`,
    options,
    correctOptionId:
      options[correctIndex]?.id ?? options[0]?.id ?? OPTION_IDS[0],
    explanation: `На кроці ${nextStep.stepIndex + 1} ${nextStep.description}`,
    difficulty: 'easy',
    source: 'generated',
    context: createContext(payload, currentStep),
    hint: 'Порівняй поточний стан масиву з описом кроку.',
    tags: [payload.algorithm, 'operation'],
  }
}

/**
 * Turns one sorting payload into a set of multiple-choice questions.
 *
 * The generator is intentionally pure: the same payload and options always
 * produce the same questions, which makes persistence and review stable.
 */
export function generateSortingQuestions(
  payload: SortingStatePayload,
  options: GenerateSortingQuestionsOptions = {},
): QuizQuestion[] {
  const { maxQuestions = 5, includeOperationQuestions = true } = options

  if (payload.steps.length < 2) {
    return []
  }

  const questions: QuizQuestion[] = []

  for (let index = 0; index < payload.steps.length - 1; index += 1) {
    const currentStep = payload.steps[index]
    const nextStep = payload.steps[index + 1]

    if (!currentStep || !nextStep) {
      continue
    }

    if (!arraysEqual(currentStep.array, nextStep.array)) {
      questions.push(
        createArrayOutcomeQuestion(payload, currentStep, nextStep),
      )
    }

    if (includeOperationQuestions) {
      questions.push(createOperationQuestion(payload, currentStep, nextStep))
    }
  }

  return shuffleWithSeed(
    questions,
    hashString(`${payload.algorithm}:questions`),
  ).slice(0, maxQuestions)
}
