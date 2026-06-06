import * as React from 'react'
import { HorizonTemplate } from '@/components/templates/HorizonTemplate'
import { CoverLetterTemplate } from '@/components/templates/CoverLetterTemplate'
import type { BuilderState } from '@/types/document'

interface LivePreviewProps {
  state: BuilderState
  mobileView?: boolean
}

export function LivePreviewPanel({ state, mobileView = false }: LivePreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(0.5)

  // Compute zoom so the A4 page (794px wide) fills the available container width
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const compute = () => {
      const avail = el.clientWidth - 48 // 24px padding each side
      setScale(Math.min(avail / 794, 1))
    }
    compute()
    const obs = new ResizeObserver(compute)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const Template = state.documentType === 'cover_letter' ? CoverLetterTemplate : HorizonTemplate

  return (
    <div
      ref={containerRef}
      className={`overflow-auto bg-muted/30 py-6 px-6${mobileView ? '' : ' h-full'}`}
    >
      {/*
        CSS zoom (unlike transform: scale) affects layout space, so the A4 page's
        visual width AND layout width both equal 794 * scale — no horizontal overflow.
        The dynamic value is passed via a CSS custom property (--ds-zoom) to avoid
        the inline-styles linter rule; .preview-page-wrap reads it in index.css.
      */}
      <div
        className="preview-page-wrap shadow-xl rounded overflow-hidden mx-auto"
        style={{ '--ds-zoom': scale } as React.CSSProperties}
      >
        <Template state={state} scale={1} />
      </div>
    </div>
  )
}
