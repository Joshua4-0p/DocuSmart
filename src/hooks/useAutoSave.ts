import { useEffect, useRef, useState, useCallback } from 'react'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useAutoSave<T>(
  value: T,
  saveFn: (value: T) => Promise<void>,
  delay = 3000,
) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveFnRef = useRef(saveFn)
  const isFirstRender = useRef(true)

  saveFnRef.current = saveFn

  const save = useCallback(async (val: T) => {
    setStatus('saving')
    try {
      await saveFnRef.current(val)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => void save(value), delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, delay, save])

  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    void save(value)
  }, [save, value])

  return { status, saveNow }
}
