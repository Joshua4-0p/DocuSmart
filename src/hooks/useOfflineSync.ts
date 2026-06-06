import { useState, useEffect, useCallback } from 'react'

export type SyncStatus = 'online' | 'offline' | 'syncing' | 'synced'

export function useOfflineSync() {
  const [status, setStatus] = useState<SyncStatus>(navigator.onLine ? 'online' : 'offline')
  const [syncedAt, setSyncedAt] = useState<Date | null>(null)

  useEffect(() => {
    const handleOnline = () => {
      setStatus('syncing')
      // Simulate a sync flush — real impl would flush the offline queue
      const timer = setTimeout(() => {
        setStatus('synced')
        setSyncedAt(new Date())
        // Fade back to 'online' after 3s
        const fadeTimer = setTimeout(() => setStatus('online'), 3000)
        return () => clearTimeout(fadeTimer)
      }, 1000)
      return () => clearTimeout(timer)
    }
    const handleOffline = () => setStatus('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const saveOffline = useCallback((key: string, data: object) => {
    try {
      localStorage.setItem(`ds-offline-${key}`, JSON.stringify({ data, savedAt: new Date().toISOString() }))
    } catch { /* storage full */ }
  }, [])

  return { status, syncedAt, saveOffline, isOnline: status !== 'offline' }
}
