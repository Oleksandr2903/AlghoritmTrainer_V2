import { useEffect, useState } from 'react'

const isBrowser = (): boolean => typeof window !== 'undefined'

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback
  }

  try {
    const rawValue = window.localStorage.getItem(key)

    if (rawValue === null) {
      return fallback
    }

    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode, quota), the quiz must keep
    // working in memory in that case.
  }
}

export function removeStorage(key: string): void {
  if (!isBrowser()) {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore storage access errors.
  }
}

/**
 * useState backed by localStorage. The lazy initializer hydrates synchronously
 * on the first render, so there is no flash of empty progress.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    const stored = readStorage<unknown>(key, undefined)

    if (stored === undefined) {
      return initialValue
    }

    if (isValid && !isValid(stored)) {
      return initialValue
    }

    return stored as T
  })

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue] as const
}
