import * as React from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface ToastData {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  const toast = React.useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4 shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-200',
                t.type === 'success' && 'bg-card border-ds-success text-foreground',
                t.type === 'error' && 'bg-card border-destructive text-foreground',
                t.type === 'info' && 'bg-card border-border text-foreground',
              )}
            >
              {t.type === 'success' && <CheckCircle className="size-4 text-ds-success-foreground mt-0.5 shrink-0" />}
              {t.type === 'error' && <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />}
              {t.type === 'info' && <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />}
              <span className="flex-1 text-sm">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
