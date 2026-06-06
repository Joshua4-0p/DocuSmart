import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import universities from '@/data/cm-universities.json'

interface UniversityAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
}

export function UniversityAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  id,
}: UniversityAutocompleteProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState(value)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Sync external value changes
  React.useEffect(() => { setQuery(value) }, [value])

  const matches = React.useMemo(() => {
    if (!query.trim() || query.length < 2) return []
    const lower = query.toLowerCase()
    return (universities as string[])
      .filter((u) => u.toLowerCase().includes(lower))
      .slice(0, 8)
  }, [query])

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <input
        id={id}
        type="text"
        autoComplete="off"
        value={query}
        placeholder={placeholder ?? t('builder.universityPlaceholder')}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => { if (matches.length > 0) setOpen(true) }}
        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {open && matches.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg py-1"
        >
          {matches.map((university) => (
            <li
              key={university}
              role="option"
              aria-selected={university === value}
              onMouseDown={(e) => {
                e.preventDefault()
                setQuery(university)
                onChange(university)
                setOpen(false)
              }}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors',
                university === value && 'bg-primary/10 text-primary font-medium',
              )}
            >
              {university}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
