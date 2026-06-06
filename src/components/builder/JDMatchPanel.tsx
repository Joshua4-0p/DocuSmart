import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import type { JDMatchResult } from '@/types/document'

export function JDMatchPanel({ result }: { result: JDMatchResult }) {
  const { t } = useTranslation()

  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 space-y-3">
      {result.matchedSkills.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            {t('builder.jdMatchedSkills')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedSkills.map((sk) => (
              <Badge key={sk} className="bg-ds-success/20 text-ds-success-foreground border-ds-success/30 text-xs">
                {sk}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {result.unmatchedSkills.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            {t('builder.jdUnmatchedSkills')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.unmatchedSkills.map((sk) => (
              <Badge key={sk} variant="outline" className="text-ds-warning-foreground border-ds-warning/50 text-xs">
                {sk}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {result.recommendedSections.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            {t('builder.jdRecommendedSections')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.recommendedSections.map((sec) => (
              <Badge key={sec} variant="outline" className="text-xs capitalize">
                {sec}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
