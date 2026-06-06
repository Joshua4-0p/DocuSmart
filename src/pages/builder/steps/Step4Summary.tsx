import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { AIButton } from '@/components/builder/AIButton'
import { AILoadingOverlay } from '@/components/builder/AILoadingOverlay'
import { DailyLimitBadge } from '@/components/builder/DailyLimitBadge'
import { useBuilderStore } from '@/store/builder.store'
import { aiApi } from '@/lib/api/ai.api'

export function Step4Summary() {
  const { t } = useTranslation()
  const { context, generatedContent, setGeneratedContent, toggleSection, selectedSections } = useBuilderStore()
  const [loading, setLoading] = React.useState(false)
  const [improving, setImproving] = React.useState(false)
  const summary = generatedContent['summary'] ?? ''
  const isGenerated = Boolean(generatedContent['summary'])

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const text = await aiApi.generateSummary(
        context.jobTitle,
        context.companyName ?? '',
        context.language,
      )
      setGeneratedContent('summary', text)
      if (!selectedSections.includes('summary')) {
        toggleSection('summary')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImprove = async () => {
    if (!summary) return
    setImproving(true)
    try {
      const result = await aiApi.improveText(summary, context.jobTitle, context.language)
      if (!result.limitReached) {
        setGeneratedContent('summary', result.improved)
      }
    } finally {
      setImproving(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <h2 className="text-xl font-bold mb-1">{t('builder.step4Title')}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        A tailored 3-sentence summary for your target role.
      </p>

      <div className="max-w-xl space-y-4">
        {/* Textarea */}
        <div className="relative">
          <textarea
            value={summary}
            onChange={(e) => setGeneratedContent('summary', e.target.value.slice(0, 600))}
            placeholder={t('builder.summaryPlaceholder')}
            rows={6}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
          />
          {summary && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <AIButton
                onClick={handleImprove}
                loading={improving}
                variant="inline"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {t('builder.summaryCharCount', { count: summary.length })}
          </span>
          <DailyLimitBadge />
        </div>

        {/* Generate / Regenerate button */}
        <AIButton
          onClick={handleGenerate}
          loading={loading}
          variant="block"
          label={isGenerated ? t('builder.regenerate') : t('builder.generateWithAI')}
        />

        {isGenerated && (
          <div className="flex items-center gap-1.5 text-xs text-ds-success-foreground">
            <span className="size-2 rounded-full bg-ds-success-foreground" />
            {t('builder.generated')}
          </div>
        )}
      </div>

      <AILoadingOverlay visible={loading} role={context.jobTitle} compact />
    </div>
  )
}
