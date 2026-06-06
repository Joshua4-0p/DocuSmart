import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CompletionSuggestion } from '@/store/builder.store'

interface CompletenessRingProps {
  score: number
  suggestions: CompletionSuggestion[]
  onStepClick: (step: number) => void
}

function ringColor(score: number): string {
  if (score >= 70) return '#22c55e' // green
  if (score >= 40) return '#f59e0b' // amber
  return '#ef4444'                   // red
}

export function CompletenessRing({ score, suggestions, onStepClick }: CompletenessRingProps) {
  const { t } = useTranslation()

  const radius = 28
  const circumference = 2 * Math.PI * radius
  const filled = circumference * (score / 100)
  const gap = circumference - filled
  const color = ringColor(score)

  return (
    <div className="p-4 border-b border-border">
      {/* Ring + label */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative shrink-0">
          <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
            {/* Track */}
            <circle
              cx="34" cy="34" r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted/60"
            />
            {/* Progress */}
            <circle
              cx="34" cy="34" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${gap}`}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-sm font-black"
            style={{ color }}
          >
            {score}%
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground leading-tight">
            {t('builder.completeness')}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {score < 40
              ? 'Getting started'
              : score < 70
              ? 'Good progress'
              : score < 100
              ? 'Almost there!'
              : 'Complete!'}
          </p>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('builder.completionSuggestions')}
          </p>
          <ul className="flex flex-col gap-1">
            {suggestions.slice(0, 3).map((sg) => (
              <li key={sg.id}>
                <button
                  type="button"
                  onClick={() => onStepClick(sg.stepLink)}
                  className={cn(
                    'w-full flex items-center gap-1.5 text-left px-2 py-1.5 rounded-lg',
                    'text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    'transition-colors group',
                  )}
                >
                  <span className="flex-1 leading-tight">{t(sg.textKey)}</span>
                  <span className="text-[10px] font-semibold text-primary shrink-0">
                    +{sg.points}
                  </span>
                  <ArrowRight className="size-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
