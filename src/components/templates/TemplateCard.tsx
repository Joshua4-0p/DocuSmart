import * as React from 'react'
import { useTranslation } from 'react-i18next'
import type { TemplateInfo } from '../../lib/templates/templateSettings'
import { ACCENT_COLORS } from '../../lib/templates/templateSettings'
import { ProTemplateLock } from './ProTemplateLock'

interface Props {
  template: TemplateInfo
  selectedAccent?: string
  isSelected?: boolean
  isPro?: boolean
  onSelect: (id: string) => void
  onPreview?: (id: string) => void
  onAccentChange?: (id: string, accent: string) => void
}

export function TemplateCard({
  template,
  selectedAccent = 'navy',
  isSelected = false,
  isPro = false,
  onSelect,
  onPreview,
  onAccentChange,
}: Props) {
  const { t } = useTranslation()
  const [hovered, setHovered] = React.useState(false)
  const locked = !template.free && !isPro
  const accentHex = ACCENT_COLORS.find((a) => a.id === selectedAccent)?.hex ?? '#1E3A5F'

  return (
    <div
      className="group relative rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer"
      style={{ borderColor: isSelected ? accentHex : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !locked && onSelect(template.id)}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[210/297] bg-muted overflow-hidden">
        {/* Simplified A4-shaped placeholder */}
        <div className="w-full h-full flex flex-col" style={{ background: '#f9f9f9', padding: '8px', gap: '4px' }}>
          <div style={{ height: '12%', background: accentHex, borderRadius: '2px', opacity: 0.9 }} />
          <div style={{ height: '6%', background: '#ddd', borderRadius: '1px', width: '70%' }} />
          <div style={{ height: '4%', background: '#e8e8e8', borderRadius: '1px', width: '50%' }} />
          {[90, 75, 85, 60, 70].map((w, i) => (
            <div key={i} style={{ height: '5%', background: '#ebebeb', borderRadius: '1px', width: `${w}%` }} />
          ))}
        </div>

        {/* Hover overlay — two action buttons */}
        {hovered && !locked && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 p-4">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect(template.id) }}
              className="w-full max-w-40 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              {isSelected ? t('templates.selected') : t('templates.useTemplate')}
            </button>
            {onPreview && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onPreview(template.id) }}
                className="w-full max-w-40 px-4 py-1.5 bg-transparent border border-white text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                {t('templates.preview')} →
              </button>
            )}
          </div>
        )}

        {/* Locked overlay */}
        {hovered && locked && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <ProTemplateLock size="md" />
          </div>
        )}

        {/* Pro badge (top-right, always visible when locked) */}
        {locked && !hovered && (
          <div className="absolute top-2 right-2">
            <ProTemplateLock />
          </div>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <div
            className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background: accentHex }}
          >
            ✓
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="p-3 bg-card">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{template.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{template.category}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {template.atsSafe && (
              <span className="text-xs text-green-600 bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded font-medium">ATS</span>
            )}
            {locked && <ProTemplateLock />}
          </div>
        </div>

        {/* Colour swatches + preview link row */}
        <div className="flex items-center justify-between gap-2">
          {onAccentChange && (
            <div className="flex gap-1.5">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  title={color.label}
                  aria-label={color.label}
                  onClick={(e) => { e.stopPropagation(); onAccentChange(template.id, color.id) }}
                  className="rounded-full transition-transform hover:scale-110 focus:outline-none"
                  style={{
                    width: '14px',
                    height: '14px',
                    background: color.hex,
                    border: selectedAccent === color.id ? `2px solid ${color.hex}` : '1.5px solid transparent',
                    outline: selectedAccent === color.id ? '1.5px solid white' : 'none',
                    outlineOffset: '-3px',
                  }}
                />
              ))}
            </div>
          )}

          {/* Preview link */}
          {onPreview && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPreview(template.id) }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors shrink-0 underline underline-offset-2"
            >
              {t('templates.preview')} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
