import * as React from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useOnboarding } from '@/hooks/useOnboarding'

interface OnboardingTooltipProps {
  tooltipKey: string
  textKey: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function OnboardingTooltip({
  tooltipKey,
  textKey,
  children,
  side = 'bottom',
  className,
}: OnboardingTooltipProps) {
  const { t } = useTranslation()
  const { isSeen, dismiss } = useOnboarding()
  const [visible, setVisible] = React.useState(false)

  // Show tooltip on first render if not dismissed yet
  React.useEffect(() => {
    if (!isSeen(tooltipKey)) {
      const timer = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(timer)
    }
  }, [tooltipKey, isSeen])

  const handleDismiss = () => {
    setVisible(false)
    dismiss(tooltipKey)
  }

  const positionClasses = {
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  }

  const arrowClasses = {
    bottom: '-top-1.5 left-1/2 -translate-x-1/2 border-l border-t',
    top: '-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b',
    left: '-right-1.5 top-1/2 -translate-y-1/2 border-t border-r',
    right: '-left-1.5 top-1/2 -translate-y-1/2 border-b border-l',
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      {children}
      {visible && (
        <div
          className={cn(
            'absolute z-50 w-64 rounded-xl bg-foreground text-background shadow-lg p-3',
            positionClasses[side],
          )}
          role="tooltip"
        >
          {/* Arrow */}
          <div
            className={cn(
              'absolute size-3 rotate-45 bg-foreground border-foreground',
              arrowClasses[side],
            )}
          />
          <div className="flex items-start gap-2">
            <p className="text-xs flex-1 leading-relaxed">{t(textKey)}</p>
            <button
              type="button"
              onClick={handleDismiss}
              className="shrink-0 text-background/70 hover:text-background transition-colors mt-0.5"
              aria-label={t('builder.gotIt')}
            >
              <X className="size-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="mt-2 text-[10px] font-semibold text-background/80 hover:text-background transition-colors"
          >
            {t('builder.gotIt')} →
          </button>
        </div>
      )}
    </div>
  )
}
