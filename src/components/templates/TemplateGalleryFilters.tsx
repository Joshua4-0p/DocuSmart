import { useTranslation } from 'react-i18next'

export type GalleryCategory = 'all' | 'simple' | 'modern' | 'creative' | 'ats-optimised'

interface Props {
  active: GalleryCategory
  onChange: (cat: GalleryCategory) => void
}

const CATEGORIES: { id: GalleryCategory; labelKey: string }[] = [
  { id: 'all',           labelKey: 'templates.catAll' },
  { id: 'simple',        labelKey: 'templates.catSimple' },
  { id: 'modern',        labelKey: 'templates.catModern' },
  { id: 'creative',      labelKey: 'templates.catCreative' },
  { id: 'ats-optimised', labelKey: 'templates.catAtsOptimised' },
]

export function TemplateGalleryFilters({ active, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors border',
            active === cat.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted',
          ].join(' ')}
        >
          {t(cat.labelKey)}
        </button>
      ))}
    </div>
  )
}
