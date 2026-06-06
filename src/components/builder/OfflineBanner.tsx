import { Wifi, WifiOff, RefreshCw, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { SyncStatus } from '@/hooks/useOfflineSync'

interface OfflineBannerProps {
  status: SyncStatus
  syncedAt: Date | null
}

export function OfflineBanner({ status, syncedAt }: OfflineBannerProps) {
  const { t, i18n } = useTranslation()

  if (status === 'online') return null

  const timeStr = syncedAt
    ? syncedAt.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })
    : ''

  const config = {
    offline: {
      bg: 'bg-destructive/10 border-destructive/20 text-destructive',
      icon: <WifiOff className="size-3.5 shrink-0" />,
      text: t('builder.offlineBanner'),
    },
    syncing: {
      bg: 'bg-ds-warning/10 border-ds-warning/20 text-ds-warning-foreground',
      icon: <RefreshCw className="size-3.5 shrink-0 animate-spin" />,
      text: t('builder.syncingBanner'),
    },
    synced: {
      bg: 'bg-ds-success/10 border-ds-success/20 text-ds-success-foreground',
      icon: <Check className="size-3.5 shrink-0" />,
      text: t('builder.syncedAt', { time: timeStr }),
    },
  } as const

  const { bg, icon, text } = config[status as keyof typeof config] ?? config.offline

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium border-b',
        bg,
      )}
    >
      <Wifi className="size-3.5 shrink-0 opacity-0 absolute" aria-hidden />
      {icon}
      <span>{text}</span>
    </div>
  )
}
