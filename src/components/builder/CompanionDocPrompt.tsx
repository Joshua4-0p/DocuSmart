import * as React from 'react'
import { FileText, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { documentApi } from '@/lib/api/document.api'
import type { BuilderState } from '@/types/document'

interface CompanionDocPromptProps {
  visible: boolean
  state: BuilderState
  onDismiss: () => void
}

export function CompanionDocPrompt({ visible, state, onDismiss }: CompanionDocPromptProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [creating, setCreating] = React.useState(false)

  const handleCreate = async () => {
    setCreating(true)
    try {
      const doc = await documentApi.create(
        'cover_letter',
        state.context,
        ['personal', 'summary'],
        ['personal', 'summary'],
      )
      void navigate(`/builder/${doc.id}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-card border border-primary/30 rounded-2xl shadow-2xl p-5"
        >
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{t('builder.companionTitle')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('builder.companionDesc')}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={creating} className="flex-1 text-xs">
              {creating ? t('common.loading') : t('builder.companionYes')}
            </Button>
            <Button size="sm" variant="ghost" onClick={onDismiss} className="text-xs">
              {t('builder.companionNo')}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
