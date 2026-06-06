import * as React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GripVertical } from 'lucide-react'
import { ToggleCard } from '@/components/builder/ToggleCard'
import { AIButton } from '@/components/builder/AIButton'
import { DailyLimitBadge } from '@/components/builder/DailyLimitBadge'
import { useBuilderStore } from '@/store/builder.store'
import { getProfileSnapshot } from '@/lib/api/profile.api'
import { aiApi } from '@/lib/api/ai.api'

export function Step5Experience() {
  const { t } = useTranslation()
  const { context, generatedContent, setGeneratedContent, selectedSections, toggleSection } = useBuilderStore()
  const profile = getProfileSnapshot()
  const experiences = profile.experience
  const [rewritingId, setRewritingId] = React.useState<string | null>(null)
  const [originalBullets, setOriginalBullets] = React.useState<Record<string, string>>({})

  const isExpIncluded = selectedSections.includes('experience')

  const handleRewrite = async (expId: string) => {
    const exp = experiences.find((e) => e.id === expId)
    if (!exp) return
    const key = `exp-${expId}`
    // Save original for undo
    if (!originalBullets[expId]) {
      setOriginalBullets((prev) => ({ ...prev, [expId]: generatedContent[key] ?? '' }))
    }
    setRewritingId(expId)
    try {
      const bullets = await aiApi.rewriteBullets(exp, context.jobTitle, context.language)
      setGeneratedContent(key, bullets.join('\n'))
    } finally {
      setRewritingId(null)
    }
  }

  const handleUndo = (expId: string) => {
    const key = `exp-${expId}`
    const orig = originalBullets[expId]
    if (orig !== undefined) {
      setGeneratedContent(key, orig)
      setOriginalBullets((prev) => {
        const next = { ...prev }
        delete next[expId]
        return next
      })
    }
  }

  if (!experiences.length) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-3">{t('builder.experienceEmpty')}</p>
        <Link to="/profile/experience" className="text-primary text-sm underline">{t('builder.addToProfile')}</Link>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-bold">{t('builder.step5Title')}</h2>
        <button
          type="button"
          onClick={() => toggleSection('experience')}
          className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${isExpIncluded ? 'border-primary/30 text-primary bg-primary/5' : 'border-border text-muted-foreground'}`}
        >
          {isExpIncluded ? t('builder.sectionIncluded') : t('builder.sectionExcluded')}
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{t('builder.step5RewriteNote')}</p>
      <div className="flex items-center justify-end mb-4"><DailyLimitBadge /></div>

      <div className="max-w-2xl space-y-4">
        {experiences.map((exp) => {
          const key = `exp-${exp.id}`
          const isRewritten = Boolean(generatedContent[key])
          const canUndo = Boolean(originalBullets[exp.id])
          const isLoading = rewritingId === exp.id
          const bullets = generatedContent[key]
            ? generatedContent[key].split('\n').filter(Boolean)
            : exp.description?.split('\n').filter(Boolean) ?? exp.achievements

          return (
            <ToggleCard
              key={exp.id}
              included={isExpIncluded}
              onToggle={() => toggleSection('experience')}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{exp.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {exp.company} · {exp.startDate?.slice(0, 7)} –{' '}
                      {exp.ongoing ? t('common.present') : exp.endDate?.slice(0, 7)}
                    </p>
                  </div>
                  <GripVertical className="size-4 text-muted-foreground shrink-0 cursor-grab" />
                </div>

                {/* Bullets */}
                {bullets.length > 0 ? (
                  <ul className="space-y-1 pl-3">
                    {bullets.map((b, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                        <span className="shrink-0 mt-1">•</span>
                        <span>{b.replace(/^[•\-]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No description added yet.</p>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <AIButton
                    onClick={() => void handleRewrite(exp.id)}
                    loading={isLoading}
                    variant="inline"
                    label={isRewritten ? t('builder.aiRewrite') : t('builder.aiRewrite')}
                  />
                  {canUndo && (
                    <button
                      type="button"
                      onClick={() => handleUndo(exp.id)}
                      className="text-xs text-muted-foreground hover:text-foreground underline"
                    >
                      {t('builder.undo')}
                    </button>
                  )}
                  {isRewritten && !canUndo && (
                    <span className="text-xs text-ds-success-foreground">{t('builder.rewritten')}</span>
                  )}
                </div>
              </div>
            </ToggleCard>
          )
        })}
      </div>
    </div>
  )
}
