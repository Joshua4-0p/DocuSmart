import * as React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Info, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBuilderStore } from '@/store/builder.store'
import { getProfileSnapshot, profileApi } from '@/lib/api/profile.api'
import type { Skill } from '@/types/profile'

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

  const [extraSkills, setExtraSkills] = React.useState<Skill[]>([])
  const [newSkillName, setNewSkillName] = React.useState('')
  const [adding, setAdding] = React.useState(false)

  const handleAddSkill = async () => {
    const name = newSkillName.trim()
    if (!name) return
    setAdding(true)
    try {
      const created = await profileApi.createSkill({ name, level: 'intermediate' })
      setExtraSkills((prev) => [...prev, created])
      setNewSkillName('')
    } finally {
      setAdding(false)
    }
  }

  const allSkills = [...skills, ...extraSkills]
  const matchedSkillNames = new Set(jdMatchResult?.matchedSkills.map((s) => s.toLowerCase()) ?? [])

  const techSkills = allSkills.filter((s) => !s.category || !['soft'].includes(s.category.toLowerCase()))
  const softSkills = allSkills.filter((s) => s.category?.toLowerCase() === 'soft')

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
        {allSkills.length === 0 && (
          <p className="text-muted-foreground text-sm">
            {t('builder.skillsEmpty')}{' '}
            <Link to="/profile/skills" className="text-primary underline">{t('builder.addToProfile')}</Link>
          </p>
        )}

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

        {/* Inline skill adder */}
        <div className="pt-1 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Add a skill for this document
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Adds to your master profile and includes it here automatically.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); void handleAddSkill() }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. React, Leadership, SQL…"
              maxLength={50}
              className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={adding || !newSkillName.trim()}
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-3.5" />
              {adding ? 'Adding…' : 'Add'}
            </button>
          </form>
        </div>

        {allSkills.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Click a skill to toggle it in/out of your document.
            {jdMatchResult && ' Highlighted skills match the job description.'}
          </p>
        )}
      </div>
    </div>
  )
}
