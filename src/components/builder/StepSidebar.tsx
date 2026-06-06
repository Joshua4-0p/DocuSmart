import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { calcCompletenessData, useBuilderStore } from '@/store/builder.store'
import { CompletenessRing } from '@/components/builder/CompletenessRing'
import { SectionOrderPanel } from '@/components/builder/SectionOrderPanel'
import type { BuilderState } from '@/types/document'

const STEPS = [
  'step1Name', 'step2Name', 'step3Name', 'step4Name', 'step5Name',
  'step6Name', 'step7Name', 'step8Name', 'step9Name', 'step10Name',
] as const

function StepCircle({ stepNum, current, completed }: { stepNum: number; current: number; completed: boolean }) {
  const isActive = stepNum === current
  const isDone = completed || stepNum < current
  return (
    <div
      className={cn(
        'size-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors',
        isDone ? 'bg-primary text-primary-foreground' :
        isActive ? 'bg-primary/15 text-primary border-2 border-primary' :
        'bg-muted text-muted-foreground',
      )}
    >
      {isDone && !isActive ? <Check className="size-3" strokeWidth={3} /> : stepNum}
    </div>
  )
}

export function StepSidebar({
  state,
  onStepClick,
}: {
  state: BuilderState
  onStepClick: (step: number) => void
}) {
  const { t } = useTranslation()
  const { score, suggestions } = calcCompletenessData(state)
  const { reorderSections } = useBuilderStore()

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-card overflow-y-auto">
      {/* Completeness ring + suggestions */}
      <CompletenessRing
        score={score}
        suggestions={suggestions}
        onStepClick={onStepClick}
      />

      {/* Step navigation */}
      <nav className="flex-1 p-3">
        {STEPS.map((nameKey, i) => {
          const stepNum = i + 1
          const isActive = stepNum === state.step
          const isDone = stepNum < state.step
          return (
            <button
              key={stepNum}
              type="button"
              onClick={() => onStepClick(stepNum)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
                isActive ? 'bg-primary/10 text-primary font-medium' :
                isDone ? 'text-foreground hover:bg-muted/50' :
                'text-muted-foreground hover:bg-muted/50',
              )}
            >
              <StepCircle stepNum={stepNum} current={state.step} completed={isDone} />
              <span className="truncate">{t(`builder.${nameKey}`)}</span>
            </button>
          )
        })}
      </nav>

      {/* Section order panel */}
      <SectionOrderPanel
        sections={state.sectionOrder}
        onChange={reorderSections}
      />
    </aside>
  )
}
