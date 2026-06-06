import { Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface SaveIndicatorProps {
  status: SaveStatus
  className?: string
}

export function SaveIndicator({ status, className }: SaveIndicatorProps) {
  const { t } = useTranslation()

  if (status === 'idle') return null

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium transition-opacity',
        status === 'saving' && 'text-muted-foreground',
        status === 'saved' && 'text-ds-success-foreground',
        status === 'error' && 'text-destructive',
        className,
      )}
    >
      {status === 'saving' && (
        <>
          <Loader2 className="size-3 animate-spin" />
          <span>{t('common.saving')}</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <Check className="size-3" />
          <span>{t('common.saved')}</span>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle className="size-3" />
          <span>{t('common.saveFailed')}</span>
        </>
      )}
    </div>
  )
}
