import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { HorizonTemplate } from '@/components/templates/HorizonTemplate'
import { CoverLetterTemplate } from '@/components/templates/CoverLetterTemplate'
import type { BuilderState } from '@/types/document'

interface LivePreviewProps {
  state: BuilderState
  mobileView?: boolean
}

export function LivePreviewPanel({ state, mobileView = false }: LivePreviewProps) {
  const { t } = useTranslation()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(0.5)

  // Compute scale so the A4 page (794px wide) fits the container
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      const w = el.clientWidth - 32 // 16px padding each side
      setScale(Math.min(w / 794, 1))
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const Template = state.documentType === 'cover_letter' ? CoverLetterTemplate : HorizonTemplate

  return (
    <div
      ref={containerRef}
      className="overflow-auto bg-muted/30 flex flex-col items-center py-6 px-4"
      style={{ height: mobileView ? undefined : '100%' }}
    >
      <div className="shadow-xl rounded overflow-hidden" style={{ transformOrigin: 'top center' }}>
        <Template state={state} scale={scale} />
      </div>
    </div>
  )
}
