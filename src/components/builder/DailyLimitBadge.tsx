import { useTranslation } from 'react-i18next'
import { getAiUsageToday, AI_DAILY_LIMIT } from '@/lib/api/ai.api'

export function DailyLimitBadge() {
  const { t } = useTranslation()
  const used = getAiUsageToday()

  return (
    <span className="text-xs text-muted-foreground tabular-nums">
      {t('builder.aiUsageToday', { used, max: AI_DAILY_LIMIT })}
    </span>
  )
}
