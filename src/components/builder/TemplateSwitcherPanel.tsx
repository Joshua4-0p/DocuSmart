import * as React from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TEMPLATES } from '@/lib/templates/templateSettings'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { useBuilderStore } from '@/store/builder.store'

interface Props {
  open: boolean
  onClose: () => void
  isPro?: boolean
}

type Category = 'all' | 'simple' | 'modern' | 'creative'

export function TemplateSwitcherPanel({ open, onClose, isPro = false }: Props) {
  const { t } = useTranslation()
  const { templateId, accentColor, setTemplateSettings } = useBuilderStore()
  const [activeCategory, setActiveCategory] = React.useState<Category>('all')
  const [pendingAccents, setPendingAccents] = React.useState<Record<string, string>>({})

  const filtered = TEMPLATES.filter(
    (tmpl) => activeCategory === 'all' || tmpl.category === activeCategory,
  )

  const handleAccentChange = (tid: string, accent: string) => {
    setPendingAccents((prev) => ({ ...prev, [tid]: accent }))
    if (tid === templateId) {
      setTemplateSettings({ accentColor: accent })
    }
  }

  const handleSelect = (tid: string) => {
    const accent = pendingAccents[tid]
    setTemplateSettings({
      templateId: tid,
      ...(accent ? { accentColor: accent } : {}),
    })
    onClose()
  }

  if (!open) return null

  const categories: { id: Category; labelKey: string }[] = [
    { id: 'all',      labelKey: 'templates.catAll' },
    { id: 'simple',   labelKey: 'templates.catSimple' },
    { id: 'modern',   labelKey: 'templates.catModern' },
    { id: 'creative', labelKey: 'templates.catCreative' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-[420px] max-w-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">{t('templates.switchTemplate')}</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label={t('common.close')}>
            <X size={18} />
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5 px-4 py-3 border-b border-border">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70',
              ].join(' ')}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((tmpl) => (
              <TemplateCard
                key={tmpl.id}
                template={tmpl}
                selectedAccent={pendingAccents[tmpl.id] ?? (tmpl.id === templateId ? accentColor : 'navy')}
                isSelected={tmpl.id === templateId}
                isPro={isPro}
                onSelect={handleSelect}
                onAccentChange={handleAccentChange}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
