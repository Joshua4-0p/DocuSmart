import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface StepNavProps {
  step: number
  total?: number
  onBack: () => void
  onNext: () => void
  nextDisabled?: boolean
  isLastStep?: boolean
}

export function StepNav({
  step,
  total = 10,
  onBack,
  onNext,
  nextDisabled = false,
  isLastStep = false,
}: StepNavProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card/80 backdrop-blur-sm shrink-0">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={step <= 1}
        className="min-w-24"
      >
        {t('builder.backBtn')}
      </Button>

      <span className="text-sm text-muted-foreground font-medium">
        {t('builder.stepOf', { current: step, total })}
      </span>

      <Button
        onClick={onNext}
        disabled={nextDisabled}
        className="min-w-32"
      >
        {isLastStep ? t('builder.reviewExportBtn') : t('builder.nextBtn')}
      </Button>
    </div>
  )
}
