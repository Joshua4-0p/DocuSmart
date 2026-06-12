import * as React from 'react'
import { getTemplateComponent } from '@/components/templates'
import { CoverLetterTemplate } from '@/components/templates/CoverLetterTemplate'
import { FormalLetterTemplate } from '@/components/templates/FormalLetterTemplate'
import { PreviewToolbar } from '@/components/builder/PreviewToolbar'
import { useDebounce } from '@/hooks/useDebounce'
import type { BuilderState } from '@/types/document'

const FORMAL_LETTER_TYPES = new Set([
  'motivation_letter',
  'recommendation_letter',
  'personal_statement',
  'research_proposal',
  'expression_of_interest',
  'writing_sample',
])

interface LivePreviewProps {
  state: BuilderState
  mobileView?: boolean
}

export function LivePreviewPanel({ state, mobileView = false }: LivePreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [autoScale, setAutoScale] = React.useState(0.5)
  const [manualScale, setManualScale] = React.useState<number | null>(null)
  const [fullscreen, setFullscreen] = React.useState(false)

  const scale = manualScale ?? autoScale

  // Debounce builder state by 350ms so the template only re-renders when typing pauses
  const debouncedState = useDebounce(state, 350)

  // Compute auto-zoom so A4 (794px) fills available width
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const compute = () => {
      const avail = el.clientWidth - 48
      setAutoScale(Math.min(avail / 794, 1))
    }
    compute()
    const obs = new ResizeObserver(compute)
    obs.observe(el)
    return () => obs.disconnect()
  }, [fullscreen])

  // Reset manual scale when entering fullscreen
  const handleFullscreen = () => {
    setFullscreen((f) => !f)
    setManualScale(null)
  }

  const Template =
    debouncedState.documentType === 'cover_letter'
      ? CoverLetterTemplate
      : FORMAL_LETTER_TYPES.has(debouncedState.documentType)
      ? FormalLetterTemplate
      : getTemplateComponent(debouncedState.templateId)

  const wrapperCls = fullscreen
    ? 'fixed inset-0 z-50 flex flex-col bg-background'
    : `flex flex-col ${mobileView ? '' : 'h-full'} overflow-hidden`

  return (
    <div className={wrapperCls}>
      <PreviewToolbar
        scale={scale}
        onScaleChange={setManualScale}
        fullscreen={fullscreen}
        onFullscreenToggle={handleFullscreen}
        templateName={debouncedState.templateId}
      />

      <div ref={containerRef} className="flex-1 overflow-auto bg-muted/30 py-6 px-6">
        {/*
          CSS zoom (unlike transform: scale) keeps layout space, so the A4 page
          visual AND layout width both equal 794 * scale — no horizontal overflow.
          Dynamic value via --ds-zoom custom property; .preview-page-wrap reads it.
        */}
        <div
          className="preview-page-wrap shadow-xl rounded overflow-hidden mx-auto"
          style={{ '--ds-zoom': scale } as React.CSSProperties}
        >
          <Template state={debouncedState} scale={1} />
        </div>
      </div>
    </div>
  )
}
