import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TEMPLATES } from '@/lib/templates/templateSettings'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { useBuilderStore } from '@/store/builder.store'

type Category = 'all' | 'simple' | 'modern' | 'creative'

export default function TemplateGalleryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { templateId, accentColor, setTemplateSettings } = useBuilderStore()
  const [activeCategory, setActiveCategory] = React.useState<Category>('all')
  const [previewAccents, setPreviewAccents] = React.useState<Record<string, string>>({})

  const filtered = TEMPLATES.filter(
    (tmpl) => activeCategory === 'all' || tmpl.category === activeCategory,
  )

  const categories: { id: Category; labelKey: string }[] = [
    { id: 'all',      labelKey: 'templates.catAll' },
    { id: 'simple',   labelKey: 'templates.catSimple' },
    { id: 'modern',   labelKey: 'templates.catModern' },
    { id: 'creative', labelKey: 'templates.catCreative' },
  ]

  const handleAccentChange = (tid: string, accent: string) => {
    setPreviewAccents((prev) => ({ ...prev, [tid]: accent }))
  }

  const handleSelect = (tid: string) => {
    const accent = previewAccents[tid]
    setTemplateSettings({ templateId: tid, ...(accent ? { accentColor: accent } : {}) })
    navigate(`/templates/${tid}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('templates.galleryTitle')}</h1>
        <p className="mt-1.5 text-muted-foreground">{t('templates.gallerySubtitle')}</p>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors border',
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:bg-muted',
            ].join(' ')}
          >
            {t(cat.labelKey)}
          </button>
        ))}
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
            onAccentChange={handleAccentChange}
          />
        ))}
      </div>
    </div>
  )
}
