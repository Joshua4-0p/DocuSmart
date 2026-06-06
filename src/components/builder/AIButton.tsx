import * as React from 'react'
import { Wand2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { getAiUsageToday, AI_DAILY_LIMIT } from '@/lib/api/ai.api'

interface AIButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  variant?: 'inline' | 'block'
  label?: string
  className?: string
}

export function AIButton({
  onClick,
  loading = false,
  disabled = false,
  variant = 'inline',
  label,
  className,
}: AIButtonProps) {
  const { t } = useTranslation()
  const usageToday = getAiUsageToday()
  const limitReached = usageToday >= AI_DAILY_LIMIT

  const isDisabled = disabled || loading || (variant === 'inline' && limitReached)

  const title =
    variant === 'inline' && limitReached
      ? t('builder.dailyLimitReached', { used: usageToday, max: AI_DAILY_LIMIT })
      : undefined

  if (variant === 'block') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        title={title}
        className={cn(
          'flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary font-semibold px-4 py-3 text-sm hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          loading && 'animate-pulse',
          className,
        )}
      >
        <Wand2 className="size-4" />
        {loading ? t('builder.generating') : (label ?? t('builder.generateWithAI'))}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
        loading && 'animate-pulse',
        className,
      )}
    >
      <Wand2 className="size-3" />
      {loading ? t('builder.improving') : (label ?? t('builder.improveThis'))}
    </button>
  )
}
