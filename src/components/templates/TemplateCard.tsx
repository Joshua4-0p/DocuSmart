import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Lock } from 'lucide-react'
import type { TemplateInfo } from '../../lib/templates/templateSettings'
import { ACCENT_COLORS } from '../../lib/templates/templateSettings'

interface Props {
  template: TemplateInfo
  selectedAccent?: string
  isSelected?: boolean
  isPro?: boolean
  onSelect: (id: string) => void
  onAccentChange?: (id: string, accent: string) => void
}

export function TemplateCard({ template, selectedAccent = 'navy', isSelected = false, isPro = false, onSelect, onAccentChange }: Props) {
  const { t } = useTranslation()
  const [hovered, setHovered] = React.useState(false)
  const locked = !template.free && !isPro

  return (
    <div
      className="group relative rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer"
      style={{ borderColor: isSelected ? ACCENT_COLORS.find(a => a.id === selectedAccent)?.hex ?? '#1E3A5F' : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !locked && onSelect(template.id)}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[210/297] bg-muted overflow-hidden">
        {/* Placeholder thumbnail using template colors */}
        <div className="w-full h-full flex flex-col" style={{ background: '#f9f9f9', padding: '8px', gap: '4px' }}>
          <div style={{ height: '12%', background: ACCENT_COLORS.find(a => a.id === selectedAccent)?.hex ?? '#1E3A5F', borderRadius: '2px', opacity: 0.9 }} />
          <div style={{ height: '6%', background: '#ddd', borderRadius: '1px', width: '70%' }} />
          <div style={{ height: '4%', background: '#e8e8e8', borderRadius: '1px', width: '50%' }} />
          {[90, 75, 85, 60, 70].map((w, i) => (
            <div key={i} style={{ height: '5%', background: '#ebebeb', borderRadius: '1px', width: `${w}%` }} />
          ))}
        </div>

        {/* Hover overlay */}
        {hovered && !locked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect(template.id) }}
              className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              {isSelected ? t('templates.selected') : t('templates.useTemplate')}
            </button>
          </div>
        )}

        {/* Pro badge */}
        {locked && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
            <Lock size={10} />
            Pro
          </div>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <div
            className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background: ACCENT_COLORS.find(a => a.id === selectedAccent)?.hex ?? '#1E3A5F' }}
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
          {template.atsSafe && (
            <span className="text-xs text-green-600 bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded font-medium shrink-0 ml-2">ATS</span>
          )}
        </div>

        {/* Color swatches */}
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
      </div>
    </div>
  )
}
