import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Wand2 } from 'lucide-react'
import { TEMPLATES } from '@/lib/templates/templateSettings'
import { AccentColorPicker } from '@/components/templates/AccentColorPicker'
import { FontPairingSelector } from '@/components/templates/FontPairingSelector'
import { SpacingToggle } from '@/components/templates/SpacingToggle'
import { TemplatePreviewLarge } from '@/components/builder/TemplatePreviewLarge'
import { useBuilderStore } from '@/store/builder.store'

export default function TemplateDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { templateId, accentColor, fontPairing, spacing, setTemplateSettings } = useBuilderStore()

  const template = TEMPLATES.find((tmpl) => tmpl.id === slug)

  // Local preview settings — don't write to store until "Use Template"
  const [previewAccent, setPreviewAccent] = React.useState(
    slug === templateId ? accentColor : 'navy',
  )
  const [previewFont, setPreviewFont] = React.useState(
    slug === templateId ? fontPairing : 'modern-sans',
  )
  const [previewSpacing, setPreviewSpacing] = React.useState<'compact' | 'normal' | 'spacious'>(
    slug === templateId ? spacing : 'normal',
  )

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('templates.notFound')}</p>
      </div>
    )
  }

  // Build mock state for TemplatePreviewLarge
  const baseState = useBuilderStore.getState()
  const mockState = {
    ...baseState,
    templateId: template.id,
    accentColor: previewAccent,
    fontPairing: previewFont,
    spacing: previewSpacing,
  }

  const handleUse = () => {
    setTemplateSettings({
      templateId: template.id,
      accentColor: previewAccent,
      fontPairing: previewFont,
      spacing: previewSpacing,
    })
    navigate('/documents/new')
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 overflow-hidden">
      {/* Left panel: customisation */}
      <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card overflow-y-auto">
        <div className="p-4 border-b border-border">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={15} />
            {t('common.back')}
          </button>
          <h1 className="text-lg font-bold text-foreground">{template.name}</h1>
          <p className="text-sm text-muted-foreground capitalize">
            {template.category}{template.atsSafe ? ' · ATS-safe' : ''}
          </p>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">{t('templates.accentColor')}</p>
            <AccentColorPicker value={previewAccent} onChange={setPreviewAccent} />
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">{t('templates.fontPairing')}</p>
            <FontPairingSelector value={previewFont} onChange={setPreviewFont} />
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">{t('templates.spacing')}</p>
            <SpacingToggle value={previewSpacing} onChange={setPreviewSpacing} />
          </div>

          <button
            type="button"
            onClick={handleUse}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-xl hover:opacity-90 transition-opacity mt-2"
          >
            <Wand2 size={16} />
            {templateId === template.id ? t('templates.updateSettings') : t('templates.useTemplate')}
          </button>
        </div>
      </div>

      {/* Right panel: live preview via TemplatePreviewLarge */}
      <TemplatePreviewLarge state={mockState} zoom={0.55} />
    </div>
  )
}
