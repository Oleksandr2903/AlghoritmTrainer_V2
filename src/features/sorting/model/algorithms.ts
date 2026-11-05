import {
  SORTING_ALGORITHM_IDS,
  type AlgorithmInfo,
  type SortGenerator,
  type SortSnapshot,
  type SortingAlgorithmId,
} from './types'

interface Counters {
  comparisons: number
  movements: number
}

interface SnapshotOptions {
  readonly counters: Counters
  readonly comparing?: readonly number[]
  readonly swapped?: readonly number[]
  readonly sorted?: readonly number[]
  readonly message: string
  readonly done?: boolean
}

/**
 * Creates an immutable frame. The array and every index list are copied,
 * which is what makes stepping backwards safe.
 */
function snapshot(array: readonly number[], options: SnapshotOptions): SortSnapshot {
  return {
    array: [...array],
    comparing: options.comparing ? [...options.comparing] : [],
    swapped: options.swapped ? [...options.swapped] : [],
    sorted: options.sorted ? [...options.sorted] : [],
    comparisons: options.counters.comparisons,
    movements: options.counters.movements,
    message: options.message,
    done: options.done ?? false,
  }
}

function allIndices(length: number): number[] {
  return Array.from({ length }, (_, index) => index)
}

function addSorted(sorted: number[], index: number): void {
  if (!sorted.includes(index)) {
    sorted.push(index)
  }
}

/* -------------------------------------------------------------------------- */
/* Bubble Sort                                                                */
/* -------------------------------------------------------------------------- */

export function* bubbleSort(input: readonly number[]): SortGenerator {
  const array = [...input]
  const counters: Counters = { comparisons: 0, movements: 0 }
  const sorted: number[] = []

  yield snapshot(array, {
    counters,
    message: 'Початковий стан масиву',
  })

  for (let end = array.length - 1; end > 0; end -= 1) {
    let swappedInPass = false

    for (let index = 0; index < end; index += 1) {
      counters.comparisons += 1
      yield snapshot(array, {
        counters,
        comparing: [index, index + 1],
        sorted,
        message: `Порівнюємо ${array[index]} і ${array[index + 1]}`,
      })

      if (array[index] > array[index + 1]) {
        ;[array[index], array[index + 1]] = [array[index + 1], array[index]]
        counters.movements += 2
        swappedInPass = true

        yield snapshot(array, {
          counters,
          swapped: [index, index + 1],
          sorted,
          message: `Обмін ${array[index + 1]} ↔ ${array[index]}`,
        })
      }
    }

    sorted.push(end)
    yield snapshot(array, {
      counters,
      sorted,
      message: `Елемент ${array[end]} на своєму місці`,
    })

    // The array is already ordered — no need to run the remaining passes.
    if (!swappedInPass) {
      break
    }
  }

  yield snapshot(array, {
    counters,
    sorted: allIndices(array.length),
    message: 'Масив відсортовано',
    done: true,
  })
}

/* -------------------------------------------------------------------------- */
/* Insertion Sort                                                             */
/* -------------------------------------------------------------------------- */

export function* insertionSort(input: readonly number[]): SortGenerator {
  const array = [...input]
  const counters: Counters = { comparisons: 0, movements: 0 }
  const sorted: number[] = []

  yield snapshot(array, {
    counters,
    message: 'Початковий стан масиву',
  })

  for (let index = 1; index < array.length; index += 1) {
    const key = array[index]
    let scan = index - 1

    while (scan >= 0) {
      counters.comparisons += 1
      yield snapshot(array, {
        counters,
        comparing: [scan, scan + 1],
        sorted,
        message: `Порівнюємо ${array[scan]} з ключем ${key}`,
      })

      if (array[scan] <= key) {
        break
      }

      array[scan + 1] = array[scan]
      counters.movements += 1
      yield snapshot(array, {
        counters,
        swapped: [scan, scan + 1],
        sorted,
        message: `Зсуваємо ${array[scan]} праворуч`,
      })

      scan -= 1
    }

    if (scan + 1 !== index) {
      array[scan + 1] = key
      counters.movements += 1
      yield snapshot(array, {
        counters,
        swapped: [scan + 1],
        sorted,
        message: `Вставляємо ${key} у позицію ${scan + 1}`,
      })
    }

    sorted.length = 0
    sorted.push(...allIndices(index + 1))
    yield snapshot(array, {
      counters,
      sorted,
      message: `Відсортована частина: 1…${index + 1}`,
    })
  }

  yield snapshot(array, {
    counters,
    sorted: allIndices(array.length),
    message: 'Масив відсортовано',
    done: true,
  })
}

/* -------------------------------------------------------------------------- */
/* Selection Sort                                                             */
/* -------------------------------------------------------------------------- */

export function* selectionSort(input: readonly number[]): SortGenerator {
  const array = [...input]
  const counters: Counters = { comparisons: 0, movements: 0 }
  const sorted: number[] = []

  yield snapshot(array, {
    counters,
    message: 'Початковий стан масиву',
  })

  for (let index = 0; index < array.length - 1; index += 1) {
    let minIndex = index

    for (let scan = index + 1; scan < array.length; scan += 1) {
      counters.comparisons += 1
      yield snapshot(array, {
        counters,
        comparing: [minIndex, scan],
        sorted,
        message: `Шукаємо мінімум: ${array[minIndex]} і ${array[scan]}`,
      })

      if (array[scan] < array[minIndex]) {
        minIndex = scan
      }
    }

    if (minIndex !== index) {
      ;[array[index], array[minIndex]] = [array[minIndex], array[index]]
      counters.movements += 2
      yield snapshot(array, {
        counters,
        swapped: [index, minIndex],
        sorted,
        message: `Ставимо мінімум ${array[index]} на позицію ${index}`,
      })
    }

    sorted.push(index)
    yield snapshot(array, {
      counters,
      sorted,
      message: `Позиція ${index} зафіксована`,
    })
  }

  yield snapshot(array, {
    counters,
    sorted: allIndices(array.length),
    message: 'Масив відсортовано',
    done: true,
  })
}

/* -------------------------------------------------------------------------- */
/* Merge Sort                                                                 */
/* -------------------------------------------------------------------------- */

function* mergeRange(
  array: number[],
  left: number,
  middle: number,
  right: number,
  counters: Counters,
): SortGenerator {
  const leftPart = array.slice(left, middle + 1)
  const rightPart = array.slice(middle + 1, right + 1)

  let leftIndex = 0
  let rightIndex = 0
  let writeIndex = left

  while (leftIndex < leftPart.length && rightIndex < rightPart.length) {
    counters.comparisons += 1
    yield snapshot(array, {
      counters,
      comparing: [left + leftIndex, middle + 1 + rightIndex],
      message: `Порівнюємо ${leftPart[leftIndex]} і ${rightPart[rightIndex]}`,
    })

    if (leftPart[leftIndex] <= rightPart[rightIndex]) {
      array[writeIndex] = leftPart[leftIndex]
      leftIndex += 1
    } else {
      array[writeIndex] = rightPart[rightIndex]
      rightIndex += 1
    }

    counters.movements += 1
    yield snapshot(array, {
      counters,
      swapped: [writeIndex],
      message: `Записуємо ${array[writeIndex]} у позицію ${writeIndex}`,
    })
    writeIndex += 1
  }

  while (leftIndex < leftPart.length) {
    array[writeIndex] = leftPart[leftIndex]
    counters.movements += 1
    yield snapshot(array, {
      counters,
      swapped: [writeIndex],
      message: `Переносимо ${array[writeIndex]} у позицію ${writeIndex}`,
    })
    leftIndex += 1
    writeIndex += 1
  }

  while (rightIndex < rightPart.length) {
    array[writeIndex] = rightPart[rightIndex]
    counters.movements += 1
    yield snapshot(array, {
      counters,
      swapped: [writeIndex],
      message: `Переносимо ${array[writeIndex]} у позицію ${writeIndex}`,
    })
    rightIndex += 1
    writeIndex += 1
  }
}

function* mergeSortRange(
  array: number[],
  left: number,
  right: number,
  counters: Counters,
): SortGenerator {
  if (left >= right) {
    return
  }

  const middle = Math.floor((left + right) / 2)

  yield* mergeSortRange(array, left, middle, counters)
  yield* mergeSortRange(array, middle + 1, right, counters)
  yield* mergeRange(array, left, middle, right, counters)
}

export function* mergeSort(input: readonly number[]): SortGenerator {
  const array = [...input]
  const counters: Counters = { comparisons: 0, movements: 0 }

  yield snapshot(array, {
    counters,
    message: 'Початковий стан масиву',
  })

  yield* mergeSortRange(array, 0, array.length - 1, counters)

  yield snapshot(array, {
    counters,
    sorted: allIndices(array.length),
    message: 'Масив відсортовано',
    done: true,
  })
}

/* -------------------------------------------------------------------------- */
/* Quick Sort (Lomuto partition)                                              */
/* -------------------------------------------------------------------------- */

function* partition(
  array: number[],
  low: number,
  high: number,
  counters: Counters,
  sorted: number[],
): Generator<SortSnapshot, number, void> {
  const pivot = array[high]
  let boundary = low

  yield snapshot(array, {
    counters,
    comparing: [high],
    sorted,
    message: `Опорний елемент: ${pivot}`,
  })

  for (let scan = low; scan < high; scan += 1) {
    counters.comparisons += 1
    yield snapshot(array, {
      counters,
      comparing: [scan, high],
      sorted,
      message: `Порівнюємо ${array[scan]} з опорним ${pivot}`,
    })

    if (array[scan] < pivot) {
      if (boundary !== scan) {
        ;[array[boundary], array[scan]] = [array[scan], array[boundary]]
        counters.movements += 2
        yield snapshot(array, {
          counters,
          swapped: [boundary, scan],
          sorted,
          message: 'Менший елемент переміщуємо ліворуч від опорного',
        })
      }
      boundary += 1
    }
  }

  if (boundary !== high) {
    ;[array[boundary], array[high]] = [array[high], array[boundary]]
    counters.movements += 2
    yield snapshot(array, {
      counters,
      swapped: [boundary, high],
      sorted,
      message: `Опорний елемент ${pivot} стає на позицію ${boundary}`,
    })
  }

  addSorted(sorted, boundary)
  yield snapshot(array, {
    counters,
    sorted,
    message: `Позиція ${boundary} зафіксована`,
  })

  return boundary
}

function* quickSortRange(
  array: number[],
  low: number,
  high: number,
  counters: Counters,
  sorted: number[],
): SortGenerator {
  if (low > high) {
    return
  }

  if (low === high) {
    addSorted(sorted, low)
    yield snapshot(array, {
      counters,
      sorted,
      message: `Елемент ${array[low]} на своєму місці`,
    })
    return
  }

  const pivotIndex = yield* partition(array, low, high, counters, sorted)

  yield* quickSortRange(array, low, pivotIndex - 1, counters, sorted)
  yield* quickSortRange(array, pivotIndex + 1, high, counters, sorted)
}

export function* quickSort(input: readonly number[]): SortGenerator {
  const array = [...input]
  const counters: Counters = { comparisons: 0, movements: 0 }
  const sorted: number[] = []

  yield snapshot(array, {
    counters,
    message: 'Початковий стан масиву',
  })

  yield* quickSortRange(array, 0, array.length - 1, counters, sorted)

  yield snapshot(array, {
    counters,
    sorted: allIndices(array.length),
    message: 'Масив відсортовано',
    done: true,
  })
}

/* -------------------------------------------------------------------------- */
/* Counting Sort                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Counting sort expects non-negative integers. The arena generates values in
 * the `[5, 100]` range, so the counting table never grows unexpectedly.
 */
export function* countingSort(input: readonly number[]): SortGenerator {
  const array = [...input]
  const counters: Counters = { comparisons: 0, movements: 0 }

  yield snapshot(array, {
    counters,
    message: 'Початковий стан масиву',
  })

  if (array.length === 0) {
    yield snapshot(array, {
      counters,
      message: 'Порожній масив уже відсортовано',
      done: true,
    })
    return
  }

  const maximum = Math.max(...array)
  const counts = new Array<number>(maximum + 1).fill(0)

  yield snapshot(array, {
    counters,
    message: `Будуємо таблицю частот для значень 0…${maximum}`,
  })

  for (let index = 0; index < array.length; index += 1) {
    counts[array[index]] += 1
    yield snapshot(array, {
      counters,
      comparing: [index],
      message: `Рахуємо значення ${array[index]}`,
    })
  }

  // Prefix sums turn frequencies into final output positions.
  for (let value = 1; value < counts.length; value += 1) {
    counts[value] += counts[value - 1]
  }

  const source = [...array]

  // Iterate backwards to keep the algorithm stable.
  for (let index = source.length - 1; index >= 0; index -= 1) {
    const value = source[index]
    counts[value] -= 1
    const position = counts[value]

    array[position] = value
    counters.movements += 1

    yield snapshot(array, {
      counters,
      swapped: [position],
      message: `Ставимо ${value} на позицію ${position}`,
    })
  }

  yield snapshot(array, {
    counters,
    sorted: allIndices(array.length),
    message: 'Масив відсортовано',
    done: true,
  })
}

/* -------------------------------------------------------------------------- */
/* Registry                                                                   */
/* -------------------------------------------------------------------------- */

export type SortImplementation = (values: readonly number[]) => SortGenerator

export const ALGORITHM_IMPLEMENTATIONS: Record<SortingAlgorithmId, SortImplementation> = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  merge: mergeSort,
  quick: quickSort,
  counting: countingSort,
}

export const ALGORITHM_INFO: Record<SortingAlgorithmId, AlgorithmInfo> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    ukrainianName: 'Бульбашкове сортування',
    description:
      'Послідовно порівнює сусідні елементи та міняє їх місцями, доки більші значення не «спливуть» у кінець.',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    stable: true,
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    ukrainianName: 'Сортування вставками',
    description:
      'Бере черговий елемент і вставляє його на правильну позицію у вже відсортовану частину масиву.',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    stable: true,
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    ukrainianName: 'Сортування вибором',
    description:
      'На кожному кроці знаходить мінімальний елемент у невідсортованій частині та ставить його на початок.',
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    stable: false,
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    ukrainianName: 'Сортування злиттям',
    description:
      'Рекурсивно ділить масив навпіл, сортує частини та зливає їх у єдину впорядковану послідовність.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
    },
    stable: true,
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    ukrainianName: 'Швидке сортування',
    description:
      'Обирає опорний елемент (Lomuto), розбиває масив на менші та більші частини й рекурсивно сортує кожну.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)',
    },
    stable: false,
  },
  counting: {
    id: 'counting',
    name: 'Counting Sort',
    ukrainianName: 'Сортування підрахунком',
    description:
      'Рахує частоту кожного значення, обчислює префіксні суми та розставляє елементи без попарних порівнянь.',
    complexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n + k)',
      space: 'O(n + k)',
    },
    stable: true,
  },
}

export const SORTING_ALGORITHMS: readonly AlgorithmInfo[] = SORTING_ALGORITHM_IDS.map(
  (id) => ALGORITHM_INFO[id],
)

/**
 * Runs a generator from start to finish and collects every frame.
 * History is built once per (array, algorithm) pair, so seeking is O(1).
 */
export function runSort(
  algorithm: SortingAlgorithmId,
  values: readonly number[],
): SortSnapshot[] {
  const snapshots: SortSnapshot[] = []

  for (const frame of ALGORITHM_IMPLEMENTATIONS[algorithm](values)) {
    snapshots.push(frame)
  }

  if (snapshots.length === 0) {
    snapshots.push({
      array: [...values],
      comparing: [],
      swapped: [],
      sorted: allIndices(values.length),
      comparisons: 0,
      movements: 0,
      message: 'Масив відсортовано',
      done: true,
    })
  }

  return snapshots
}
