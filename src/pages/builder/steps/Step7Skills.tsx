import * as React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBuilderStore } from '@/store/builder.store'
import { getProfileSnapshot } from '@/lib/api/profile.api'

export function Step7Skills() {
  const { t } = useTranslation()
  const { selectedSections, toggleSection, jdMatchResult, generatedContent, setGeneratedContent } = useBuilderStore()
  const profile = getProfileSnapshot()
  const skills = profile.skills
  const isSkillsIncluded = selectedSections.includes('skills')

  // Track which skills are individually toggled off
  const excludedSkillIds: string[] = React.useMemo(() => {
    try {
      return JSON.parse(generatedContent['excluded-skills'] ?? '[]') as string[]
    } catch { return [] }
  }, [generatedContent])

  const toggleSkill = (id: string) => {
    const current = excludedSkillIds
    const next = current.includes(id) ? current.filter((i) => i !== id) : [...current, id]
    setGeneratedContent('excluded-skills', JSON.stringify(next))
  }

  const matchedSkillNames = new Set(jdMatchResult?.matchedSkills.map((s) => s.toLowerCase()) ?? [])

  if (!skills.length) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-3">{t('builder.skillsEmpty')}</p>
        <Link to="/profile/skills" className="text-primary text-sm underline">{t('builder.addToProfile')}</Link>
      </div>
    )
  }

  const techSkills = skills.filter((s) => !s.category || !['soft'].includes(s.category.toLowerCase()))
  const softSkills = skills.filter((s) => s.category?.toLowerCase() === 'soft')

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-bold">{t('builder.step7Title')}</h2>
        <button
          type="button"
          onClick={() => toggleSection('skills')}
          className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${isSkillsIncluded ? 'border-primary/30 text-primary bg-primary/5' : 'border-border text-muted-foreground'}`}
        >
          {isSkillsIncluded ? t('builder.sectionIncluded') : t('builder.sectionExcluded')}
        </button>
      </div>

      {jdMatchResult && (
        <div className="flex items-start gap-2 mb-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 max-w-2xl">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-primary">{t('builder.step7RelevanceNote')}</p>
        </div>
      )}

      <div className="max-w-2xl space-y-5">
        {techSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Technical Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {techSkills.map((sk) => {
                const excluded = excludedSkillIds.includes(sk.id)
                const isMatched = matchedSkillNames.has(sk.name.toLowerCase())
                return (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all',
                      excluded
                        ? 'opacity-40 bg-muted border-border line-through'
                        : isMatched
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20'
                          : 'bg-card border-border text-foreground hover:border-primary/40',
                    )}
                  >
                    {sk.name}
                    {isMatched && !excluded && <span className="ml-1 text-[9px]">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {softSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Soft Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((sk) => {
                const excluded = excludedSkillIds.includes(sk.id)
                return (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                      excluded
                        ? 'opacity-40 bg-muted border-border line-through'
                        : 'bg-muted/50 border-border text-muted-foreground hover:border-primary/40',
                    )}
                  >
                    {sk.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Click a skill to toggle it in/out of your document.
          {jdMatchResult && ' Highlighted skills match the job description.'}
        </p>
      </div>
    </div>
  )
}
