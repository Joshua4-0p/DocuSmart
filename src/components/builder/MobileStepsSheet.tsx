import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const STEP_NAMES = [
  'step1Name', 'step2Name', 'step3Name', 'step4Name', 'step5Name',
  'step6Name', 'step7Name', 'step8Name', 'step9Name', 'step10Name',
] as const

interface MobileStepsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStep: number
  onStepClick: (step: number) => void
}

export function MobileStepsSheet({
  open,
  onOpenChange,
  currentStep,
  onStepClick,
}: MobileStepsSheetProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="text-base">{t('builder.mobileSteps')}</DialogTitle>
        </DialogHeader>

        <nav className="py-2 overflow-y-auto max-h-[70vh]">
          {STEP_NAMES.map((nameKey, i) => {
            const stepNum = i + 1
            const isActive = stepNum === currentStep
            const isDone = stepNum < currentStep

            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => { onStepClick(stepNum); onOpenChange(false) }}
                className={cn(
                  'w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors text-left min-h-11',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : isDone
                    ? 'text-foreground hover:bg-muted/50'
                    : 'text-muted-foreground hover:bg-muted/50',
                )}
              >
                <div
                  className={cn(
                    'size-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                    isDone
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                      ? 'bg-primary/15 text-primary border-2 border-primary'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {isDone ? <Check className="size-3" strokeWidth={3} /> : stepNum}
                </div>
                <span className="truncate">{t(`builder.${nameKey}`)}</span>
              </button>
            )
          })}
        </nav>
      </DialogContent>
    </Dialog>
  )
}
