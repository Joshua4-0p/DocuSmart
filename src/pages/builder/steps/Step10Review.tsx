import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { StrengthScoreCard } from '@/components/builder/StrengthScoreCard'
import { ExportButton } from '@/components/builder/ExportButton'
import { CompanionDocPrompt } from '@/components/builder/CompanionDocPrompt'
import { AILoadingOverlay } from '@/components/builder/AILoadingOverlay'
import { useBuilderStore } from '@/store/builder.store'
import { aiApi } from '@/lib/api/ai.api'
import { documentApi } from '@/lib/api/document.api'
import { useToast } from '@/components/ui/toast'

export function Step10Review() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const state = useBuilderStore()
  const [checking, setChecking] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [showCompanion, setShowCompanion] = React.useState(false)

  // Auto-run strength check on mount
  React.useEffect(() => {
    if (state.strengthScore) return
    setChecking(true)
    aiApi
      .strengthCheck(state.generatedContent, state.selectedSections, state.jdMatchResult)
      .then((score) => {
        state.setStrengthScore(score)
      })
      .finally(() => setChecking(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    await documentApi.update(state.documentId, {
      generatedContent: state.generatedContent,
      selectedSections: state.selectedSections,
      sectionOrder: state.sectionOrder,
      strengthScore: state.strengthScore,
      step: 10,
    })
    state.markSaved()
    setSaved(true)
    toast(t('builder.savedToDocuments'), 'success')
    setTimeout(() => void navigate('/dashboard'), 800)
  }

  const handleExportDone = () => {
    if (state.documentType === 'cv') {
      setTimeout(() => setShowCompanion(true), 800)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <h2 className="text-xl font-bold mb-1">{t('builder.step10Title')}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Review your AI strength score and download your document.
      </p>

      <div className="max-w-2xl space-y-6">
        {/* Strength score */}
        {checking ? (
          <div className="flex items-center gap-3 px-4 py-4 rounded-xl border border-border bg-card">
            <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">{t('builder.strengthChecking')}</span>
          </div>
        ) : state.strengthScore ? (
          <StrengthScoreCard score={state.strengthScore} />
        ) : null}

        {/* Export actions */}
        <div className="space-y-3">
          <ExportButton
            format="pdf"
            documentTitle={state.context.jobTitle || 'Document'}
            onExportDone={handleExportDone}
          />
          <ExportButton
            format="docx"
            documentTitle={state.context.jobTitle || 'Document'}
            onExportDone={handleExportDone}
          />
        </div>

        {/* Save */}
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saved}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saved ? t('builder.savedToDocuments') : t('builder.saveAndExit')}
        </button>
      </div>

      <CompanionDocPrompt
        visible={showCompanion}
        state={state}
        onDismiss={() => setShowCompanion(false)}
      />
    </div>
  )
}
