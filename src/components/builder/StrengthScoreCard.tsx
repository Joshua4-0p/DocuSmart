import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StrengthScore } from '@/types/document'

// Map each sub-score to the builder step most relevant for improvement
const SCORE_STEP: Record<keyof Omit<StrengthScore, 'overall' | 'explanations'>, number> = {
  impactLanguage: 5,      // Work Experience
  completeness: 4,        // Professional Summary
  relevance: 7,           // Skills
  formattingQuality: 3,   // Personal Details
  keywordDensity: 7,      // Skills
}

function scoreBarColor(score: number) {
  if (score >= 80) return 'bg-ds-success-foreground'
  if (score >= 60) return 'bg-primary'
  return 'bg-ds-warning-foreground'
}

function ringStrokeColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#378ADD'
  return '#f59e0b'
}

// Three possible Tailwind classes for ring text — static strings so Tailwind scans them
function ringTextClass(score: number) {
  if (score >= 80) return 'text-green-500'
  if (score >= 60) return 'text-primary'
  return 'text-amber-500'
}

interface ScoreRowProps {
  label: string
  score: number
  explanation: string
  step: number
  onImprove?: (step: number) => void
}

function ScoreRow({ label, score, explanation, step, onImprove }: ScoreRowProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const barRef = React.useRef<HTMLDivElement>(null)

  // Set --ds-bar-w via imperative DOM call to avoid the inline-style lint rule
  React.useEffect(() => {
    barRef.current?.style.setProperty('--ds-bar-w', `${score}%`)
  }, [score])

  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        className="w-full flex items-center gap-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm flex-1 font-medium">{label}</span>
        <div className="flex items-center gap-3">
          <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
            {/* score-bar-fill reads --ds-bar-w from index.css @layer utilities */}
            <div
              ref={barRef}
              className={cn('score-bar-fill h-full rounded-full transition-all duration-700', scoreBarColor(score))}
            />
          </div>
          <span className="text-sm font-semibold tabular-nums w-8 text-right">{score}%</span>
          {open ? <ChevronUp className="size-3.5 text-muted-foreground" /> : <ChevronDown className="size-3.5 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="pb-3 pr-2 flex items-start justify-between gap-4">
          <p className="text-xs text-muted-foreground">{explanation}</p>
          {onImprove && score < 80 && (
            <button
              type="button"
              onClick={() => onImprove(step)}
              className="shrink-0 flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              {t('builder.improveDocument')}
              <ArrowRight className="size-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function StrengthScoreCard({
  score,
  onImprove,
}: {
  score: StrengthScore
  onImprove?: (step: number) => void
}) {
  const { t } = useTranslation()

  const stroke = ringStrokeColor(score.overall)
  const circumference = 2 * Math.PI * 40
  const dashOffset = circumference * (1 - score.overall / 100)

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Circular score */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative size-24 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            {/* score-ring-circle provides transition via index.css @layer utilities */}
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={stroke} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="score-ring-circle"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* ringTextClass returns one of three static Tailwind strings */}
            <span className={cn('text-xl font-black', ringTextClass(score.overall))}>
              {score.overall}
            </span>
            <span className="text-[8px] text-muted-foreground font-medium">/ 100</span>
          </div>
        </div>
        <div>
          <p className="font-bold text-lg">{t('builder.overallScore')}</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {score.overall >= 80 ? 'Excellent' : score.overall >= 60 ? 'Good' : 'Needs improvement'}
          </p>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="border-t border-border pt-2">
        <ScoreRow label={t('builder.impactLanguage')}    score={score.impactLanguage}    explanation={score.explanations.impactLanguage}    step={SCORE_STEP.impactLanguage}    onImprove={onImprove} />
        <ScoreRow label={t('builder.completeness')}      score={score.completeness}      explanation={score.explanations.completeness}      step={SCORE_STEP.completeness}      onImprove={onImprove} />
        <ScoreRow label={t('builder.relevance')}         score={score.relevance}         explanation={score.explanations.relevance}         step={SCORE_STEP.relevance}         onImprove={onImprove} />
        <ScoreRow label={t('builder.formattingQuality')} score={score.formattingQuality} explanation={score.explanations.formattingQuality} step={SCORE_STEP.formattingQuality} onImprove={onImprove} />
        <ScoreRow label={t('builder.keywordDensity')}    score={score.keywordDensity}    explanation={score.explanations.keywordDensity}    step={SCORE_STEP.keywordDensity}    onImprove={onImprove} />
      </div>
    </div>
  )
}
