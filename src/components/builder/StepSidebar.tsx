import * as React from 'react'
import { Check, Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { calcCompleteness } from '@/store/builder.store'
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
  const completeness = calcCompleteness(state)

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-card overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('builder.completeness')}
          </span>
          <span className="text-sm font-bold text-primary">{completeness}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

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

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {t('builder.changeTemplate')}
        </p>
      </div>
    </aside>
  )
}
