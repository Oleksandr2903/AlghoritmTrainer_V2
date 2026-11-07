import type { CodeChallenge } from './types'

const BUBBLE_CODE = `void bubbleSort(std::vector<int>& a) {
  bool swapped = true;
  for (int i = 0; i < (int)a.size() - 1 && swapped; ++i) {
    swapped = false;
    for (int j = 0; j < (int)a.size() - 1 - i; ++j) {
      if (a[j] > a[j + 1]) {
        std::swap(a[j], a[j + 1]);
        swapped = true;
      }
    }
  }
}`

const INSERTION_CODE = `void insertionSort(std::vector<int>& a) {
  for (int i = 1; i < (int)a.size(); ++i) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      --j;
    }
    a[j + 1] = key;
  }
}`

const SELECTION_CODE = `void selectionSort(std::vector<int>& a) {
  for (int i = 0; i < (int)a.size() - 1; ++i) {
    int minIndex = i;
    for (int j = i + 1; j < (int)a.size(); ++j) {
      if (a[j] < a[minIndex]) minIndex = j;
    }
    std::swap(a[i], a[minIndex]);
  }
}`

const MERGE_CODE = `void mergeSort(std::vector<int>& a, std::vector<int>& tmp,
               int left, int right) {
  if (right - left <= 1) return;
  int mid = left + (right - left) / 2;
  mergeSort(a, tmp, left, mid);
  mergeSort(a, tmp, mid, right);

  int i = left, j = mid, k = left;
  while (i < mid && j < right)
    tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
  while (i < mid) tmp[k++] = a[i++];
  while (j < right) tmp[k++] = a[j++];
  for (int p = left; p < right; ++p) a[p] = tmp[p];
}`

const QUICK_CODE = `void quickSort(std::vector<int>& a, int lo, int hi) {
  if (lo >= hi) return;
  int pivot = a[hi];
  int i = lo;
  for (int j = lo; j < hi; ++j) {
    if (a[j] <= pivot) std::swap(a[i++], a[j]);
  }
  std::swap(a[i], a[hi]);
  quickSort(a, lo, i - 1);
  quickSort(a, i + 1, hi);
}`

const COUNTING_CODE = `std::vector<int> countingSort(const std::vector<int>& a, int k) {
  std::vector<int> count(k + 1, 0), out(a.size());
  for (int x : a) ++count[x];
  for (int v = 1; v <= k; ++v) count[v] += count[v - 1];
  for (int i = (int)a.size() - 1; i >= 0; --i)
    out[--count[a[i]]] = a[i];
  return out;
}`

const SCAN_TWICE_CODE = `int scanTwice(const std::vector<int>& a) {
  int even = 0;
  for (int x : a) {
    if (x % 2 == 0) ++even;
  }

  int positive = 0;
  for (int x : a) {
    if (x > 0) ++positive;
  }
  return even + positive;
}`

export const CHALLENGES: readonly CodeChallenge[] = [
  {
    id: 'bubble-best',
    title: 'Бульбашка з прапорцем',
    topic: 'Bubble Sort · найкращий випадок',
    kind: 'complexity',
    difficulty: 'basic',
    language: 'C++',
    code: BUBBLE_CODE,
    question:
      'Масив уже відсортований за зростанням. Яка найкраща складність цієї реалізації?',
    options: [
      { id: 'a', text: 'Ω(n) — достатньо одного проходу без обмінів', correct: true },
      { id: 'b', text: 'Θ(n log n)', correct: false },
      { id: 'c', text: 'Θ(n²) — алгоритм завжди виконує всі проходи', correct: false },
      { id: 'd', text: 'O(1)', correct: false },
    ],
    explanation:
      'Прапорець swapped лишається false після першого проходу, тому зовнішній цикл ' +
      'зупиняється. Внутрішній цикл виконує n − 1 порівнянь, отже найкращий випадок — Ω(n). ' +
      'Без прапорця було б Θ(n²) навіть на відсортованому масиві.',
    takeaway: 'Адаптивність — це властивість реалізації, а не лише назви алгоритму.',
  },
  {
    id: 'insertion-nearly-sorted',
    title: 'Вставки на майже відсортованих даних',
    topic: 'Insertion Sort · адаптивність',
    kind: 'complexity',
    difficulty: 'medium',
    language: 'C++',
    code: INSERTION_CODE,
    question:
      'Кожен елемент масиву зміщений від своєї фінальної позиції не більше ніж на 2 позиції. Яка складність?',
    options: [
      { id: 'a', text: 'O(n)', correct: true },
      { id: 'b', text: 'O(n log n)', correct: false },
      { id: 'c', text: 'O(n²)', correct: false },
      { id: 'd', text: 'O(log n)', correct: false },
    ],
    explanation:
      'Внутрішній while зсуває елемент максимум на 2 позиції, тому на кожен із n елементів ' +
      'виконується стала кількість операцій. Сумарно O(n). На випадковому масиві цей самий ' +
      'код дає Θ(n²), а на обернено відсортованому — найгірший випадок Θ(n²).',
    takeaway: 'Адаптивні алгоритми реагують на наявний порядок у даних, а не лише на n.',
  },
  {
    id: 'selection-comparisons',
    title: 'Скільки порівнянь у Selection Sort?',
    topic: 'Selection Sort · кількість операцій',
    kind: 'complexity',
    difficulty: 'basic',
    language: 'C++',
    code: SELECTION_CODE,
    question: 'Скільки порівнянь виконає алгоритм для n = 1000 незалежно від порядку елементів?',
    options: [
      { id: 'a', text: 'Приблизно 500 000', correct: true },
      { id: 'b', text: 'Приблизно 1 000 000', correct: false },
      { id: 'c', text: 'Приблизно 10 000', correct: false },
      { id: 'd', text: 'Приблизно 1 000', correct: false },
    ],
    explanation:
      'Кількість порівнянь дорівнює (n − 1) + (n − 2) + … + 1 = n(n − 1) / 2. ' +
      'Для n = 1000 це 1000 · 999 / 2 = 499 500, тобто Θ(n²). Порядок елементів не впливає: ' +
      'Selection Sort не адаптивний, зате робить лише n − 1 обмінів.',
    takeaway: 'Θ(n²) може ховатися за дуже простим подвійним циклом.',
  },
  {
    id: 'merge-memory',
    title: 'Пам’ять Merge Sort',
    topic: 'Merge Sort · додаткова пам’ять',
    kind: 'memory',
    difficulty: 'medium',
    language: 'C++',
    code: MERGE_CODE,
    question: 'Яка додаткова пам’ять потрібна цій реалізації для масиву з n елементів?',
    options: [
      { id: 'a', text: 'O(n) — буфер tmp для злиття', correct: true },
      { id: 'b', text: 'O(log n) — лише стек рекурсії', correct: false },
      { id: 'c', text: 'O(1) — алгоритм in-place', correct: false },
      { id: 'd', text: 'O(n²) — двовимірна таблиця', correct: false },
    ],
    explanation:
      'Для злиття двох половин потрібен допоміжний буфер tmp розміру n (у цій реалізації він ' +
      'передається ззовні). Глибина рекурсії — O(log n), але вона не визначальна. ' +
      'Саме через O(n) пам’яті Merge Sort програє Quick Sort на великих масивах у кеші.',
    takeaway: 'Час і пам’ять оцінюють окремо: O(n log n) часу не означає O(1) пам’яті.',
  },
  {
    id: 'merge-advantage',
    title: 'Перевага злиття',
    topic: 'Merge Sort · властивості',
    kind: 'advantage',
    difficulty: 'basic',
    language: 'C++',
    code: MERGE_CODE,
    question: 'Яка ключова перевага цієї реалізації Merge Sort?',
    options: [
      { id: 'a', text: 'Стабільність і гарантоване O(n log n) у всіх випадках', correct: true },
      { id: 'b', text: 'O(1) додаткової пам’яті', correct: false },
      { id: 'c', text: 'Адаптивність: Ω(n) на майже відсортованому масиві', correct: false },
      { id: 'd', text: 'Найгірший випадок O(n)', correct: false },
    ],
    explanation:
      'Умова a[i] <= a[j] зберігає порядок рівних елементів — сортування стабільне. ' +
      'Рекурсія завжди ділить масив навпіл, тому час у найгіршому випадку O(n log n). ' +
      'Натомість додаткова пам’ять O(n), а звичайна реалізація не адаптивна.',
    takeaway: 'Переваги й недоліки алгоритму завжди йдуть у парі: стабільність коштує пам’яті.',
  },
  {
    id: 'quick-worst',
    title: 'Найгірший випадок Quick Sort',
    topic: 'Quick Sort · вибір pivot',
    kind: 'complexity',
    difficulty: 'advanced',
    language: 'C++',
    code: QUICK_CODE,
    question:
      'Масив уже відсортований за зростанням, опорним вибирається останній елемент. Яка складність?',
    options: [
      { id: 'a', text: 'O(n²)', correct: true },
      { id: 'b', text: 'O(n log n)', correct: false },
      { id: 'c', text: 'O(n)', correct: false },
      { id: 'd', text: 'O(log n)', correct: false },
    ],
    explanation:
      'Останній елемент відсортованого масиву — максимум. Після partition ліва частина містить ' +
      'n − 1 елемент, права порожня. Рекурсія стає ланцюжком глибини n, а сумарна робота — ' +
      'Θ(n²). Випадковий pivot або median-of-three роблять такий сценарій малоймовірним.',
    takeaway: 'Середня складність Θ(n log n) не гарантує захисту від O(n²) на поганих даних.',
  },
  {
    id: 'counting-when',
    title: 'Коли Counting Sort доречний',
    topic: 'Counting Sort · обмеження',
    kind: 'advantage',
    difficulty: 'medium',
    language: 'C++',
    code: COUNTING_CODE,
    question: 'У якому випадку цей алгоритм буде справді ефективним?',
    options: [
      { id: 'a', text: 'Ключі — цілі числа, а діапазон k порівнянний із n', correct: true },
      { id: 'b', text: 'Ключі — довільні рядки змінної довжини', correct: false },
      { id: 'c', text: 'Діапазон k = 10⁹, а n = 10³', correct: false },
      { id: 'd', text: 'Сортування об’єктів без цілочисельного ключа', correct: false },
    ],
    explanation:
      'Counting Sort створює масив лічильників розміру k + 1, тому його час O(n + k), а пам’ять ' +
      'O(k). Якщо k = O(n), це лінійно й дуже швидко. Якщо k = 10⁹ при n = 10³, більшість ' +
      'лічильників залишаться нулями — пам’ять витрачається марно.',
    takeaway: 'Лінійні сортування виграють лише тоді, коли структура ключів це дозволяє.',
  },
  {
    id: 'two-sequential-loops',
    title: 'Два послідовні цикли',
    topic: 'Аналіз коду · послідовні цикли',
    kind: 'complexity',
    difficulty: 'basic',
    language: 'C++',
    code: SCAN_TWICE_CODE,
    question: 'Яка часова складність функції scanTwice?',
    options: [
      { id: 'a', text: 'O(n)', correct: true },
      { id: 'b', text: 'O(n²)', correct: false },
      { id: 'c', text: 'O(log n)', correct: false },
      { id: 'd', text: 'O(2ⁿ)', correct: false },
    ],
    explanation:
      'Цикли не вкладені, а послідовні: перший виконує n ітерацій, другий — ще n. Разом 2n ' +
      'операцій. Сталий множник 2 відкидається, тому O(n), а не O(n²). Вкладені цикли ' +
      'множилися б, послідовні — додаються.',
    takeaway: 'Спочатку визначте структуру: вкладеність множить, послідовність додає.',
  },
]
