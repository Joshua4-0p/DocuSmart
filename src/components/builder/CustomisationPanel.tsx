import * as React from 'react'
import { ChevronDown, ChevronUp, Palette } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AccentColorPicker } from '@/components/templates/AccentColorPicker'
import { FontPairingSelector } from '@/components/templates/FontPairingSelector'
import { SpacingToggle } from '@/components/templates/SpacingToggle'
import { useBuilderStore } from '@/store/builder.store'

export function CustomisationPanel() {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(true)
  const { accentColor, fontPairing, spacing, setTemplateSettings } = useBuilderStore()

  return (
    <div className="border-t border-border">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Palette size={15} className="text-muted-foreground" />
          {t('templates.customise')}
        </span>
        {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Accent colour */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t('templates.accentColor')}</p>
            <AccentColorPicker
              value={accentColor}
              onChange={(color) => setTemplateSettings({ accentColor: color })}
            />
          </div>

          {/* Font pairing */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t('templates.fontPairing')}</p>
            <FontPairingSelector
              value={fontPairing}
              onChange={(fp) => setTemplateSettings({ fontPairing: fp })}
            />
          </div>

          {/* Spacing */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t('templates.spacing')}</p>
            <SpacingToggle
              value={spacing}
              onChange={(mode) => setTemplateSettings({ spacing: mode })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
