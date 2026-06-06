import * as React from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BuilderLayout } from '@/layouts/BuilderLayout'
import { StepNav } from '@/components/builder/StepNav'
import { LivePreviewPanel } from '@/components/builder/LivePreviewPanel'
import { useBuilderStore } from '@/store/builder.store'
import { documentApi } from '@/lib/api/document.api'
import { Step1DocType } from './steps/Step1DocType'
import { Step2Context } from './steps/Step2Context'
import { Step3Personal } from './steps/Step3Personal'
import { Step4Summary } from './steps/Step4Summary'
import { Step5Experience } from './steps/Step5Experience'
import { Step6Education } from './steps/Step6Education'
import { Step7Skills } from './steps/Step7Skills'
import { Step8Projects } from './steps/Step8Projects'
import { Step9Additional } from './steps/Step9Additional'
import { Step10Review } from './steps/Step10Review'
import { DEFAULT_SECTION_ORDER } from '@/types/document'

const TOTAL_STEPS = 10
const SHOW_PREVIEW_FROM = 3

export function BuilderPage() {
  const { documentId } = useParams<{ documentId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  // Reactive store snapshot — safe to call in render
  const builderState = useBuilderStore()
  const [loading, setLoading] = React.useState(true)
  const [previewMode, setPreviewMode] = React.useState(false)

  const stepParam = parseInt(searchParams.get('step') ?? '1', 10)
  const step = isNaN(stepParam) ? 1 : Math.max(1, Math.min(stepParam, TOTAL_STEPS))

  React.useEffect(() => {
    if (!documentId) { void navigate('/documents'); return }
    setLoading(true)
    documentApi.get(documentId).then((doc) => {
      if (!doc) { void navigate('/documents'); return }

      // Restore localStorage draft if available (NFR-029)
      const draft = documentApi.loadDraft(documentId) as Partial<typeof builderState> | null

      builderState.initBuilder(documentId, {
        documentType: doc.type,
        step: doc.step,
        context: doc.context,
        selectedSections: doc.selectedSections,
        sectionOrder: doc.sectionOrder.length ? doc.sectionOrder : [...DEFAULT_SECTION_ORDER],
        generatedContent: draft
          ? (draft as Record<string, unknown>).generatedContent as Record<string, string> ?? doc.generatedContent
          : doc.generatedContent,
        templateId: doc.templateId,
        language: doc.language,
        jdMatchResult: doc.jdMatchResult,
        strengthScore: doc.strengthScore,
      })
      setLoading(false)
    }).catch(() => void navigate('/documents'))
  }, [documentId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStepClick = (newStep: number) => {
    builderState.setStep(newStep)
    setSearchParams({ step: String(newStep) })
  }

  const handleBack = () => {
    if (step <= 1) { void navigate('/documents'); return }
    handleStepClick(step - 1)
  }

  const handleNext = () => {
    if (step >= TOTAL_STEPS) return
    handleStepClick(step + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const showPreview = step >= SHOW_PREVIEW_FROM
  const isMobilePreview = previewMode

  function renderStep() {
    switch (step) {
      case 1: return <Step1DocType />
      case 2: return <Step2Context />
      case 3: return <Step3Personal />
      case 4: return <Step4Summary />
      case 5: return <Step5Experience />
      case 6: return <Step6Education />
      case 7: return <Step7Skills />
      case 8: return <Step8Projects />
      case 9: return <Step9Additional />
      case 10: return <Step10Review />
      default: return <Step1DocType />
    }
  }

  return (
    <BuilderLayout onStepClick={handleStepClick}>
      {/* Mobile: form/preview toggle tabs (UI-003) */}
      {showPreview && (
        <div className="lg:hidden flex border-b border-border">
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${!previewMode ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            {t('builder.form')}
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${previewMode ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            {t('builder.preview')}
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Step form — left side */}
        <div
          className={`flex flex-col overflow-hidden ${showPreview ? 'lg:w-1/2' : 'w-full'} ${isMobilePreview ? 'hidden lg:flex' : 'flex'} w-full`}
        >
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderStep()}
          </div>
          <StepNav
            step={step}
            total={TOTAL_STEPS}
            onBack={handleBack}
            onNext={handleNext}
            isLastStep={step === TOTAL_STEPS}
          />
        </div>

        {/* Live preview — right side. State is passed directly; LivePreviewPanel debounces internally */}
        {showPreview && (
          <div
            className={`lg:block lg:w-1/2 border-l border-border overflow-hidden ${isMobilePreview ? 'block w-full' : 'hidden'}`}
          >
            <LivePreviewPanel state={builderState} />
          </div>
        )}
      </div>
    </BuilderLayout>
  )
}
