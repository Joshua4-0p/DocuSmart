import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TEMPLATES } from '@/lib/templates/templateSettings'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { TemplateGalleryFilters, type GalleryCategory } from '@/components/templates/TemplateGalleryFilters'
import { useBuilderStore } from '@/store/builder.store'

export default function TemplateGalleryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { templateId, accentColor, setTemplateSettings } = useBuilderStore()

  // Read category from URL; fall back to 'all'
  const rawCat = searchParams.get('category') as GalleryCategory | null
  const validCats: GalleryCategory[] = ['all', 'simple', 'modern', 'creative', 'ats-optimised']
  const activeCategory: GalleryCategory = rawCat && validCats.includes(rawCat) ? rawCat : 'all'

  const [previewAccents, setPreviewAccents] = React.useState<Record<string, string>>({})

  const filtered = TEMPLATES.filter((tmpl) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'ats-optimised') return tmpl.atsSafe === true
    return tmpl.category === activeCategory
  })

  const handleCategoryChange = (cat: GalleryCategory) => {
    if (cat === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
  }

  const handleAccentChange = (tid: string, accent: string) => {
    setPreviewAccents((prev) => ({ ...prev, [tid]: accent }))
  }

  const handleSelect = (tid: string) => {
    const accent = previewAccents[tid]
    setTemplateSettings({ templateId: tid, ...(accent ? { accentColor: accent } : {}) })
    navigate(`/templates/${tid}`)
  }

  const handlePreview = (tid: string) => {
    navigate(`/templates/${tid}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('templates.galleryTitle')}</h1>
        <p className="mt-1.5 text-muted-foreground">{t('templates.gallerySubtitle')}</p>
      </div>

      {/* Category filter tabs — standalone component, synced to URL */}
      <div className="mb-6">
        <TemplateGalleryFilters active={activeCategory} onChange={handleCategoryChange} />
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => (
          <TemplateCard
            key={tmpl.id}
            template={tmpl}
            selectedAccent={previewAccents[tmpl.id] ?? (tmpl.id === templateId ? accentColor : 'navy')}
            isSelected={tmpl.id === templateId}
            isPro={false}
            onSelect={handleSelect}
            onPreview={handlePreview}
            onAccentChange={handleAccentChange}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">{t('templates.noResults')}</p>
      )}
    </div>
  )
}
