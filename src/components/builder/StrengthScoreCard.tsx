import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StrengthScore } from '@/types/document'

interface ScoreRowProps {
  label: string
  score: number
  explanation: string
}

function ScoreRow({ label, score, explanation }: ScoreRowProps) {
  const [open, setOpen] = React.useState(false)
  const color =
    score >= 80 ? 'bg-ds-success-foreground' :
    score >= 60 ? 'bg-primary' :
    'bg-ds-warning-foreground'

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
            <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${score}%` }} />
          </div>
          <span className="text-sm font-semibold tabular-nums w-8 text-right">{score}%</span>
          {open ? <ChevronUp className="size-3.5 text-muted-foreground" /> : <ChevronDown className="size-3.5 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <p className="text-xs text-muted-foreground pb-3 pr-2">{explanation}</p>
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

  const ringColor =
    score.overall >= 80 ? '#22c55e' :
    score.overall >= 60 ? '#378ADD' :
    '#f59e0b'

  const circumference = 2 * Math.PI * 40
  const dashOffset = circumference * (1 - score.overall / 100)

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Circular score */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative size-24 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={ringColor} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black" style={{ color: ringColor }}>{score.overall}</span>
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
        <ScoreRow
          label={t('builder.impactLanguage')}
          score={score.impactLanguage}
          explanation={score.explanations.impactLanguage}
        />
        <ScoreRow
          label={t('builder.completeness')}
          score={score.completeness}
          explanation={score.explanations.completeness}
        />
        <ScoreRow
          label={t('builder.relevance')}
          score={score.relevance}
          explanation={score.explanations.relevance}
        />
        <ScoreRow
          label={t('builder.formattingQuality')}
          score={score.formattingQuality}
          explanation={score.explanations.formattingQuality}
        />
        <ScoreRow
          label={t('builder.keywordDensity')}
          score={score.keywordDensity}
          explanation={score.explanations.keywordDensity}
        />
      </div>
    </div>
  )
}
