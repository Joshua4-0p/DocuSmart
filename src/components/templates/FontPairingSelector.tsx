import { FONT_PAIRINGS } from '../../lib/templates/templateSettings'

interface Props {
  value: string
  onChange: (pairing: string) => void
}

export function FontPairingSelector({ value, onChange }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
        aria-label="Font pairing"
      >
        {FONT_PAIRINGS.map((fp) => (
          <option key={fp.id} value={fp.id}>{fp.label}</option>
        ))}
      </select>
      {/* Aa preview */}
      <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2">
        {(() => {
          const fp = FONT_PAIRINGS.find(f => f.id === value) ?? FONT_PAIRINGS[0]
          return (
            <span style={{ fontFamily: fp.heading, fontSize: '12px', color: 'currentColor', opacity: 0.6 }}>Aa</span>
          )
        })()}
      </div>
      {/* Dropdown chevron */}
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
