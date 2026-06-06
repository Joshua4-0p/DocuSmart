import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PreviewToolbarProps {
  scale: number
  onScaleChange: (scale: number) => void
  fullscreen: boolean
  onFullscreenToggle: () => void
  templateName?: string
}

const SCALE_STEPS = [0.3, 0.4, 0.5, 0.6, 0.75, 0.9, 1.0]
const MIN_SCALE = 0.3
const MAX_SCALE = 1.0

export function PreviewToolbar({
  scale,
  onScaleChange,
  fullscreen,
  onFullscreenToggle,
  templateName,
}: PreviewToolbarProps) {
  const { t } = useTranslation()

  const zoomOut = () => {
    const prev = SCALE_STEPS.slice().reverse().find((s) => s < scale)
    onScaleChange(prev ?? MIN_SCALE)
  }

  const zoomIn = () => {
    const next = SCALE_STEPS.find((s) => s > scale)
    onScaleChange(next ?? MAX_SCALE)
  }

  const pct = Math.round(scale * 100)

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card shrink-0">
      {/* Template badge */}
      <span className="text-[11px] font-medium text-muted-foreground capitalize">
        {templateName ?? 'Horizon'}
      </span>

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          aria-label="Zoom out"
          className="size-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
        >
          <ZoomOut className="size-3.5" />
        </button>
        <span className="text-[11px] font-mono text-muted-foreground w-9 text-center tabular-nums">
          {pct}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          aria-label="Zoom in"
          className="size-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
        >
          <ZoomIn className="size-3.5" />
        </button>
      </div>

      {/* Fullscreen */}
      <button
        type="button"
        onClick={onFullscreenToggle}
        aria-label={fullscreen ? t('builder.exitFullscreen') : t('builder.fullscreen')}
        title={fullscreen ? t('builder.exitFullscreen') : t('builder.fullscreen')}
        className="size-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        {fullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
      </button>
    </div>
  )
}
