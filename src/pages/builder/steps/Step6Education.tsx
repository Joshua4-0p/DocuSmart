import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GripVertical, Info } from 'lucide-react'
import { ToggleCard } from '@/components/builder/ToggleCard'
import { useBuilderStore } from '@/store/builder.store'
import { getProfileSnapshot } from '@/lib/api/profile.api'

const DEGREE_LABELS: Record<string, string> = {
  bachelor: "Bachelor's",
  master: "Master's",
  phd: 'PhD',
  hnd: 'HND',
  bts: 'BTS',
  certificate: 'Certificate',
  other: 'Other',
}

export function Step6Education() {
  const { t } = useTranslation()
  const { selectedSections, toggleSection } = useBuilderStore()
  const profile = getProfileSnapshot()
  const education = profile.education
  const isEduIncluded = selectedSections.includes('education')

  // FR-030: Graduate detection
  const totalExpYears = profile.experience.reduce((acc, exp) => {
    const start = exp.startDate ? new Date(exp.startDate).getFullYear() : 0
    const end = exp.endDate ? new Date(exp.endDate).getFullYear() : new Date().getFullYear()
    return acc + (end - start)
  }, 0)
  const isGraduate = totalExpYears < 3

  if (!education.length) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-3">{t('builder.educationEmpty')}</p>
        <Link to="/profile/education" className="text-primary text-sm underline">{t('builder.addToProfile')}</Link>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-bold">{t('builder.step6Title')}</h2>
        <button
          type="button"
          onClick={() => toggleSection('education')}
          className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${isEduIncluded ? 'border-primary/30 text-primary bg-primary/5' : 'border-border text-muted-foreground'}`}
        >
          {isEduIncluded ? t('builder.sectionIncluded') : t('builder.sectionExcluded')}
        </button>
      </div>

      {isGraduate && (
        <div className="flex items-start gap-2 mb-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 max-w-2xl">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-primary">{t('builder.step6GradNote')}</p>
        </div>
      )}

      <div className="max-w-2xl space-y-4">
        {education.map((edu) => (
          <ToggleCard
            key={edu.id}
            included={isEduIncluded}
            onToggle={() => toggleSection('education')}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm">
                  {DEGREE_LABELS[edu.degreeType] ?? edu.degreeType} in {edu.fieldOfStudy}
                </p>
                <p className="text-xs text-muted-foreground">{edu.institution}</p>
                <p className="text-xs text-muted-foreground">
                  {edu.startDate?.slice(0, 7)} – {edu.ongoing ? t('common.present') : edu.endDate?.slice(0, 7)}
                  {edu.showGpa && edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </p>
                {edu.description && <p className="text-xs text-muted-foreground mt-1">{edu.description}</p>}
              </div>
              <GripVertical className="size-4 text-muted-foreground shrink-0 cursor-grab" />
            </div>
          </ToggleCard>
        ))}
      </div>
    </div>
  )
}
