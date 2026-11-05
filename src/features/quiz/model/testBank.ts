import type { QuizQuestion } from './types'

/**
 * Static test bank. The questions are independent from Module 1 and cover the
 * theory behind the sorting visualizations.
 */
export const testBankQuestions: QuizQuestion[] = [
  {
    id: 'bank-bubble-worst',
    prompt:
      'Яка часова складність бульбашкового сортування в найгіршому випадку?',
    options: [
      { id: 'a', label: 'O(n)' },
      { id: 'b', label: 'O(n log n)' },
      { id: 'c', label: 'O(n²)' },
      { id: 'd', label: 'O(2ⁿ)' },
    ],
    correctOptionId: 'c',
    explanation:
      'У найгіршому випадку виконується близько n(n − 1) / 2 порівнянь, тому складність — O(n²).',
    difficulty: 'easy',
    source: 'bank',
    tags: ['bubble', 'complexity'],
  },
  {
    id: 'bank-stable-algorithm',
    prompt: 'Який із наведених алгоритмів є стабільним?',
    options: [
      { id: 'a', label: 'Quick sort' },
      { id: 'b', label: 'Selection sort' },
      { id: 'c', label: 'Merge sort' },
      { id: 'd', label: 'Heap sort' },
    ],
    correctOptionId: 'c',
    explanation:
      'Merge sort зберігає відносний порядок рівних елементів, тому вважається стабільним.',
    difficulty: 'medium',
    source: 'bank',
    tags: ['merge', 'stability'],
  },
  {
    id: 'bank-quick-worst',
    prompt: 'Коли quick sort деградує до O(n²)?',
    options: [
      {
        id: 'a',
        label:
          'Коли масив уже відсортований, а опорним вибирають перший або останній елемент',
      },
      { id: 'b', label: 'Коли всі елементи масиву різні' },
      { id: 'c', label: 'Коли довжина масиву парна' },
      { id: 'd', label: 'Коли використовується тристороннє розбиття' },
    ],
    correctOptionId: 'a',
    explanation:
      'На відсортованому масиві крайній опорний елемент дає максимально незбалансований поділ, і глибина рекурсії сягає n.',
    difficulty: 'hard',
    source: 'bank',
    tags: ['quick', 'complexity'],
  },
  {
    id: 'bank-insertion-best',
    prompt: 'Для якого випадку insertion sort працює за O(n)?',
    options: [
      { id: 'a', label: 'Для вже відсортованого масиву' },
      { id: 'b', label: 'Для масиву у зворотному порядку' },
      { id: 'c', label: 'Для масиву з великою кількістю дублікатів' },
      { id: 'd', label: 'Завжди, незалежно від порядку' },
    ],
    correctOptionId: 'a',
    explanation:
      'Якщо масив уже відсортований, кожен елемент стоїть на своєму місці й виконується лише одне порівняння на елемент.',
    difficulty: 'easy',
    source: 'bank',
    tags: ['insertion', 'complexity'],
  },
  {
    id: 'bank-selection-swaps',
    prompt: 'Яка перевага selection sort перед bubble sort?',
    options: [
      { id: 'a', label: 'Менша кількість обмінів' },
      { id: 'b', label: 'Стабільність сортування' },
      { id: 'c', label: 'Краща складність у найгіршому випадку' },
      { id: 'd', label: 'Алгоритм взагалі не виконує порівнянь' },
    ],
    correctOptionId: 'a',
    explanation:
      'Selection sort робить щонайбільше n − 1 обмінів, хоча кількість порівнянь усе одно залишається O(n²).',
    difficulty: 'medium',
    source: 'bank',
    tags: ['selection', 'bubble'],
  },
  {
    id: 'bank-merge-space',
    prompt: 'Скільки додаткової памʼяті потребує класичне сортування злиттям?',
    options: [
      { id: 'a', label: 'O(1)' },
      { id: 'b', label: 'O(log n)' },
      { id: 'c', label: 'O(n)' },
      { id: 'd', label: 'O(n²)' },
    ],
    correctOptionId: 'c',
    explanation:
      'Для злиття двох відсортованих частин потрібен допоміжний масив, розмір якого пропорційний n.',
    difficulty: 'medium',
    source: 'bank',
    tags: ['merge', 'memory'],
  },
  {
    id: 'bank-bubble-early-exit',
    prompt:
      'Коли бульбашкове сортування можна завершити достроково?',
    options: [
      { id: 'a', label: 'Якщо за прохід не було жодного обміну' },
      { id: 'b', label: 'Після першого порівняння' },
      { id: 'c', label: 'Коли в масиві є дублікати' },
      { id: 'd', label: 'Дострокове завершення неможливе' },
    ],
    correctOptionId: 'a',
    explanation:
      'Відсутність обмінів за повний прохід означає, що всі сусідні пари впорядковані, тобто масив уже відсортований.',
    difficulty: 'easy',
    source: 'bank',
    tags: ['bubble', 'optimization'],
  },
  {
    id: 'bank-big-o-meaning',
    prompt: 'Що саме описує запис O(n log n)?',
    options: [
      { id: 'a', label: 'Асимптотичну верхню межу зростання часу' },
      { id: 'b', label: 'Точний час виконання в секундах' },
      { id: 'c', label: 'Кількість рядків коду алгоритму' },
      { id: 'd', label: 'Обсяг памʼяті, який завжди дорівнює n log n' },
    ],
    correctOptionId: 'a',
    explanation:
      'Big-O описує верхню межу зростання функції, а не точний час роботи на конкретному компʼютері.',
    difficulty: 'easy',
    source: 'bank',
    tags: ['big-o', 'theory'],
  },
  {
    id: 'bank-insertion-online',
    prompt: 'Чому insertion sort іноді називають онлайн-алгоритмом?',
    options: [
      {
        id: 'a',
        label: 'Він може сортувати елементи в міру їх надходження',
      },
      { id: 'b', label: 'Він працює лише з мережевими даними' },
      { id: 'c', label: 'Він не потребує додаткової памʼяті' },
      { id: 'd', label: 'Він завжди працює за O(n log n)' },
    ],
    correctOptionId: 'a',
    explanation:
      'Insertion sort підтримує відсортований префікс і може долучати нові елементи по одному, не перечитуючи весь масив.',
    difficulty: 'medium',
    source: 'bank',
    tags: ['insertion', 'theory'],
  },
]
