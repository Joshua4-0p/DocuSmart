import * as React from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBuilderStore } from '@/store/builder.store'
import { getProfileSnapshot } from '@/lib/api/profile.api'
import { ToggleCard } from '@/components/builder/ToggleCard'
import type { SectionKey } from '@/types/document'

const EXTRA_SECTIONS: { key: SectionKey; profileKey: keyof ReturnType<typeof getProfileSnapshot> }[] = [
  { key: 'certifications', profileKey: 'certifications' },
  { key: 'volunteer', profileKey: 'volunteer' },
  { key: 'publications', profileKey: 'publications' },
  { key: 'languages', profileKey: 'languages' },
  { key: 'references', profileKey: 'references' },
]

export function Step9Additional() {
  const { t } = useTranslation()
  const { selectedSections, toggleSection, generatedContent, setGeneratedContent } = useBuilderStore()
  const profile = getProfileSnapshot()
  const [openSections, setOpenSections] = React.useState<string[]>([])

  const toggleOpen = (key: string) =>
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )

  const refsMode = generatedContent['references-mode'] ?? 'full'

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <h2 className="text-xl font-bold mb-1">{t('builder.step9Title')}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Toggle optional sections on or off for this document.
      </p>

      <div className="max-w-2xl space-y-3">
        {EXTRA_SECTIONS.map(({ key, profileKey }) => {
          const entries = profile[profileKey] as unknown[]
          const count = Array.isArray(entries) ? entries.length : 0
          const isIncluded = selectedSections.includes(key)
          const isOpen = openSections.includes(key)

          return (
            <div key={key} className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Master toggle */}
                <button
                  type="button"
                  onClick={() => toggleSection(key)}
                  className={`size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${isIncluded ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-background'}`}
                >
                  {isIncluded && (
                    <svg viewBox="0 0 10 8" className="size-3 fill-current">
                      <polyline points="1,4 4,7 9,1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="flex-1 font-medium text-sm capitalize">
                  {t(`profile.${key}`)}
                  {count > 0 && <span className="ml-1.5 text-xs text-muted-foreground">({count})</span>}
                </span>
                {count > 0 && (
                  <button type="button" onClick={() => toggleOpen(key)} className="text-muted-foreground">
                    {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                )}
              </div>

              {isOpen && count > 0 && (
                <div className="border-t border-border px-4 pb-3 pt-2 space-y-2">
                  {/* References: special mode toggle */}
                  {key === 'references' && (
                    <div className="flex gap-2 mb-3">
                      {(['full', 'on-request'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setGeneratedContent('references-mode', mode)}
                          className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors ${refsMode === mode ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}
                        >
                          {mode === 'full' ? t('builder.includeReferences') : t('builder.referencesOnRequest')}
                        </button>
                      ))}
                    </div>
                  )}
                  {(entries as { id?: string; name?: string; organisation?: string; title?: string; language?: string; role?: string }[]).map((entry, i) => (
                    <div key={entry.id ?? i} className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted/30">
                      {entry.name ?? entry.organisation ?? entry.title ?? entry.language ?? entry.role ?? `Entry ${i + 1}`}
                    </div>
                  ))}
                </div>
              )}

              {!count && (
                <div className="border-t border-border px-4 py-2">
                  <Link
                    to={`/profile/${key}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {t('builder.addToProfile')}
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
