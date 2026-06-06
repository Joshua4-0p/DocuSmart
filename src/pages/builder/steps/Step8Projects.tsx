import * as React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { ToggleCard } from '@/components/builder/ToggleCard'
import { useBuilderStore } from '@/store/builder.store'
import { getProfileSnapshot } from '@/lib/api/profile.api'
import { aiApi } from '@/lib/api/ai.api'

export function Step8Projects() {
  const { t } = useTranslation()
  const { context, selectedSections, toggleSection, generatedContent, setGeneratedContent } = useBuilderStore()
  const profile = getProfileSnapshot()
  const projects = profile.projects
  const isProjIncluded = selectedSections.includes('projects')

  // Track AI-selected project IDs
  const aiSelectedIds: string[] = React.useMemo(() => {
    try {
      return JSON.parse(generatedContent['ai-selected-projects'] ?? '[]') as string[]
    } catch { return [] }
  }, [generatedContent])

  const [hasAISelected, setHasAISelected] = React.useState(false)

  // excluded projects
  const excludedIds: string[] = React.useMemo(() => {
    try {
      return JSON.parse(generatedContent['excluded-projects'] ?? '[]') as string[]
    } catch { return [] }
  }, [generatedContent])

  React.useEffect(() => {
    if (projects.length > 0 && !hasAISelected && context.jobTitle) {
      void aiApi.selectRelevantProjects(
        projects.map((p) => p.id),
        projects.map((p) => p.name),
        context.jobTitle,
      ).then((ids) => {
        setGeneratedContent('ai-selected-projects', JSON.stringify(ids))
        setHasAISelected(true)
      })
    }
  }, [projects, context.jobTitle, hasAISelected, setGeneratedContent])

  const toggleProject = (id: string) => {
    const next = excludedIds.includes(id)
      ? excludedIds.filter((i) => i !== id)
      : [...excludedIds, id]
    setGeneratedContent('excluded-projects', JSON.stringify(next))
  }

  if (!projects.length) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-3">{t('builder.projectsEmpty')}</p>
        <Link to="/profile/projects" className="text-primary text-sm underline">{t('builder.addToProfile')}</Link>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-bold">{t('builder.step8Title')}</h2>
        <button
          type="button"
          onClick={() => toggleSection('projects')}
          className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${isProjIncluded ? 'border-primary/30 text-primary bg-primary/5' : 'border-border text-muted-foreground'}`}
        >
          {isProjIncluded ? t('builder.sectionIncluded') : t('builder.sectionExcluded')}
        </button>
      </div>

      {aiSelectedIds.length > 0 && context.jobTitle && (
        <div className="flex items-start gap-2 mb-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 max-w-2xl">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-primary">
            {t('builder.step8AINote')}
          </p>
        </div>
      )}

      <div className="max-w-2xl space-y-3">
        {projects.map((proj) => {
          const isExcluded = excludedIds.includes(proj.id)
          const isAISelected = aiSelectedIds.includes(proj.id)

          return (
            <ToggleCard
              key={proj.id}
              included={isProjIncluded && !isExcluded}
              onToggle={() => toggleProject(proj.id)}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{proj.name}</p>
                  {isAISelected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      AI pick
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-muted-foreground">{proj.description}</p>
                )}
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((tech) => (
                      <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </ToggleCard>
          )
        })}
      </div>
    </div>
  )
}
