import * as React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useBuilderStore } from '@/store/builder.store'
import { getProfileSnapshot } from '@/lib/api/profile.api'
import { ToggleCard } from '@/components/builder/ToggleCard'
import type { SectionKey } from '@/types/document'

export function Step3Personal() {
  const { t } = useTranslation()
  const { selectedSections, toggleSection, generatedContent, setGeneratedContent } = useBuilderStore()
  const profile = getProfileSnapshot()
  const p = profile.personal

  const fields = [
    { key: 'name', label: 'Full Name', value: p ? `${p.firstName} ${p.lastName}` : '' },
    { key: 'title', label: 'Professional Title', value: p?.professionalTitle ?? '' },
    { key: 'phone', label: 'Phone', value: p?.phone ?? '' },
    { key: 'location', label: 'Location', value: p ? `${p.city ?? ''}${p.city && p.country ? ', ' : ''}${p.country}` : '' },
    { key: 'linkedin', label: 'LinkedIn', value: p?.linkedinUrl ?? '' },
    { key: 'website', label: 'Website', value: p?.websiteUrl ?? '' },
    { key: 'github', label: 'GitHub', value: p?.githubUrl ?? '' },
  ].filter((f) => f.value)

  const includePhoto = generatedContent['include-photo'] !== 'false'

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <h2 className="text-xl font-bold mb-1">{t('builder.step3Title')}</h2>
      <p className="text-sm text-muted-foreground mb-6">{t('builder.step3EditNote')}</p>

      {!p ? (
        <div className="max-w-xl rounded-xl border border-border p-6 text-center">
          <p className="text-muted-foreground text-sm mb-3">No personal details in your profile yet.</p>
          <Link to="/profile/personal" className="text-primary text-sm underline">{t('builder.addToProfile')}</Link>
        </div>
      ) : (
        <div className="max-w-xl space-y-3">
          {fields.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card"
            >
              <div>
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium">{field.value}</p>
              </div>
              <Link
                to="/profile/personal"
                target="_blank"
                className="text-xs text-primary hover:underline"
              >
                {t('common.edit')}
              </Link>
            </div>
          ))}

          {/* Photo toggle */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card">
            <div>
              <p className="text-xs text-muted-foreground">{t('builder.includePhoto')}</p>
              <p className="text-sm text-muted-foreground">{p.avatarUrl ? 'Photo uploaded' : t('builder.noPhoto')}</p>
            </div>
            <button
              type="button"
              onClick={() => setGeneratedContent('include-photo', includePhoto ? 'false' : 'true')}
              className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${includePhoto ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform mt-0.5 ${includePhoto ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {p.cameroonian && (
            <div className="px-4 py-3 rounded-xl border border-ds-ai/30 bg-ds-ai/5">
              <p className="text-xs text-ds-ai-foreground font-medium mb-1">Cameroonian Format Active</p>
              <p className="text-xs text-muted-foreground">Nationality, DOB, and marital status will be included if filled.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
