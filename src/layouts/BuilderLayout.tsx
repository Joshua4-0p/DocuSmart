import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, ArrowLeft, Pencil, Check, LayoutList } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBuilderStore } from '@/store/builder.store'
import { StepSidebar } from '@/components/builder/StepSidebar'
import { OfflineBanner } from '@/components/builder/OfflineBanner'
import { MobileStepsSheet } from '@/components/builder/MobileStepsSheet'
import { useOfflineSync } from '@/hooks/useOfflineSync'

interface BuilderLayoutProps {
  children: React.ReactNode
  onStepClick: (step: number) => void
}

export function BuilderLayout({ children, onStepClick }: BuilderLayoutProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const state = useBuilderStore()
  const { status, syncedAt } = useOfflineSync()
  const [editingTitle, setEditingTitle] = React.useState(false)
  const [titleValue, setTitleValue] = React.useState('')
  const [stepsOpen, setStepsOpen] = React.useState(false)

  // Warn on browser close / refresh when there are unsaved changes
  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.hasUnsavedChanges])

  const startEditTitle = () => {
    setTitleValue(state.context.jobTitle || '')
    setEditingTitle(true)
  }

  const saveTitle = () => {
    state.setContext({ jobTitle: titleValue })
    setEditingTitle(false)
  }

  const docTitle = state.context.jobTitle
    ? `${state.context.jobTitle}${state.context.companyName ? ` @ ${state.context.companyName}` : ''}`
    : 'Untitled Document'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Offline banner */}
      <OfflineBanner status={status} syncedAt={syncedAt} />

      {/* Builder Navbar */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0 z-30">
        <Link
          to="/documents"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            if (state.hasUnsavedChanges) {
              if (!window.confirm(t('builder.unsavedChanges'))) {
                e.preventDefault()
              }
            }
          }}
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">{t('nav.documents')}</span>
        </Link>

        <div className="flex-1 flex items-center justify-center">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={titleValue}
                aria-label={t('builder.step2Title')}
                placeholder="Document title"
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveTitle()
                  if (e.key === 'Escape') setEditingTitle(false)
                }}
                className="text-sm font-semibold bg-muted/50 border border-border rounded-lg px-3 py-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button type="button" onClick={saveTitle} aria-label={t('common.save')} className="text-primary">
                <Check className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startEditTitle}
              className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors group"
            >
              <span className="truncate max-w-64">{docTitle}</span>
              <Pencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        {/* Mobile steps FAB */}
        <button
          type="button"
          onClick={() => setStepsOpen(true)}
          className="lg:hidden flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t('builder.mobileSteps')}
        >
          <LayoutList className="size-4" />
          <span className="hidden sm:inline">{t('builder.mobileSteps')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (state.hasUnsavedChanges && !window.confirm(t('builder.unsavedChanges'))) return
            void navigate('/documents')
          }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
          <span className="hidden sm:inline">{t('builder.exitBtn')}</span>
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <StepSidebar state={state} onStepClick={onStepClick} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>

      {/* Mobile steps sheet */}
      <MobileStepsSheet
        open={stepsOpen}
        onOpenChange={setStepsOpen}
        currentStep={state.step}
        onStepClick={onStepClick}
      />
    </div>
  )
}
