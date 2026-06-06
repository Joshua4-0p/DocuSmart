import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface ToggleCardProps {
  included: boolean
  onToggle: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function ToggleCard({ included, onToggle, children, className, disabled }: ToggleCardProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'border rounded-xl transition-all duration-200',
        included
          ? 'border-primary/30 bg-card shadow-sm'
          : 'border-border bg-muted/30 opacity-60',
        className,
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className={cn(
            'mt-0.5 size-5 rounded shrink-0 border-2 flex items-center justify-center transition-colors',
            included
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-border bg-background',
          )}
          aria-label={included ? t('builder.toggleOff') : t('builder.toggleOn')}
        >
          {included && (
            <svg viewBox="0 0 10 8" className="size-3 fill-current">
              <polyline points="1,4 4,7 9,1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
