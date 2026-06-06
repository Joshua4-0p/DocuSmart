import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const PHASES = [
  'aiLoadingAnalysing',
  'aiLoadingCrafting',
  'aiLoadingRewriting',
  'aiLoadingFinalising',
] as const

interface AILoadingOverlayProps {
  visible: boolean
  role?: string
  progress?: number
  onCancel?: () => void
  compact?: boolean
}

export function AILoadingOverlay({
  visible,
  role = '',
  progress,
  onCancel,
  compact = false,
}: AILoadingOverlayProps) {
  const { t } = useTranslation()
  const [phaseIdx, setPhaseIdx] = React.useState(0)

  React.useEffect(() => {
    if (!visible) { setPhaseIdx(0); return }
    const tid = setInterval(() => {
      setPhaseIdx((p) => Math.min(p + 1, PHASES.length - 1))
    }, 4000)
    return () => clearInterval(tid)
  }, [visible])

  if (compact) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20"
          >
            <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="text-sm text-primary font-medium">
              {t(`builder.${PHASES[phaseIdx]}`)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="size-10 border-3 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {t(`builder.${PHASES[phaseIdx]}`)}
                </p>
                {role && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('builder.aiLoadingLabel', { role })}
                  </p>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: '5%' }}
                animate={{ width: progress != null ? `${progress}%` : '80%' }}
                transition={{ duration: 20, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              This usually takes 15–30 seconds
            </p>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-muted-foreground hover:text-foreground underline mx-auto block"
              >
                {t('builder.cancelBtn')}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
