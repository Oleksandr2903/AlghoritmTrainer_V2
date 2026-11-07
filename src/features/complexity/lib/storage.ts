const STORAGE_PREFIX = 'algolab:complexity:'

export function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStoredJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  } catch {
    // Приватний режим або переповнене сховище — просто ігноруємо.
  }
}
