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
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

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
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Scroll active item into view
  React.useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | null
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const selectOption = (university: string) => {
    setQuery(university)
    onChange(university)
    setOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || matches.length === 0) {
      if (e.key === 'ArrowDown' && matches.length > 0) {
        setOpen(true)
        setActiveIndex(0)
        e.preventDefault()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        setActiveIndex((i) => Math.min(i + 1, matches.length - 1))
        e.preventDefault()
        break
      case 'ArrowUp':
        setActiveIndex((i) => Math.max(i - 1, 0))
        e.preventDefault()
        break
      case 'Enter':
        if (activeIndex >= 0 && matches[activeIndex]) {
          selectOption(matches[activeIndex])
          e.preventDefault()
        }
        break
      case 'Escape':
        setOpen(false)
        setActiveIndex(-1)
        e.preventDefault()
        break
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <input
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open && matches.length > 0 ? 'true' : 'false'}
        aria-controls={id ? `${id}-listbox` : 'univ-listbox'}
        aria-activedescendant={activeIndex >= 0 ? `univ-option-${activeIndex}` : undefined}
        aria-label={placeholder ?? t('builder.universityPlaceholder')}
        value={query}
        placeholder={placeholder ?? t('builder.universityPlaceholder')}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange(e.target.value)
          setActiveIndex(-1)
          setOpen(true)
        }}
        onFocus={() => { if (matches.length > 0) setOpen(true) }}
        onKeyDown={handleKeyDown}
        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {open && matches.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          id={id ? `${id}-listbox` : 'univ-listbox'}
          className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg py-1"
        >
          {matches.map((university, idx) => (
            <li
              key={university}
              id={`univ-option-${idx}`}
              role="option"
              aria-selected={university === value ? 'true' : 'false'}
              onMouseDown={(e) => {
                e.preventDefault()
                selectOption(university)
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer transition-colors',
                idx === activeIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted',
                university === value && 'font-medium',
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
