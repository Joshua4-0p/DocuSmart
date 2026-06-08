import { useTranslation } from 'react-i18next'

type SpacingMode = 'compact' | 'normal' | 'spacious'

interface Props {
  value: SpacingMode
  onChange: (mode: SpacingMode) => void
}

const MODES: { id: SpacingMode; labelKey: string }[] = [
  { id: 'compact',  labelKey: 'templates.spacingCompact' },
  { id: 'normal',   labelKey: 'templates.spacingNormal' },
  { id: 'spacious', labelKey: 'templates.spacingSpacious' },
]

export function SpacingToggle({ value, onChange }: Props) {
  const { t } = useTranslation()
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={[
            'flex-1 py-1.5 text-xs font-medium transition-colors',
            value === mode.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-muted',
          ].join(' ')}
          aria-pressed={value === mode.id ? 'true' : 'false'}
        >
          {t(mode.labelKey)}
        </button>
      ))}
    </div>
  )
}
