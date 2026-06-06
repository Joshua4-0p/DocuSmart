import { useState, useCallback } from 'react'

const STORAGE_KEY = 'ds-onboarding-v1'

export function useOnboarding() {
  const getDismissed = (): string[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch { return [] }
  }

  const [dismissed, setDismissed] = useState<string[]>(getDismissed)

  const dismiss = useCallback((key: string) => {
    setDismissed((prev) => {
      const next = prev.includes(key) ? prev : [...prev, key]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isSeen = useCallback((key: string) => dismissed.includes(key), [dismissed])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setDismissed([])
  }, [])

  return { isSeen, dismiss, reset }
}
