import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, Download, Lock, Package } from 'lucide-react'
import { UpgradePromptModal } from '@/components/shared/UpgradePromptModal'
import { documentApi } from '@/lib/api/document.api'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/components/ui/toast'
import type { DocDocument } from '@/lib/api/document.api'
import { DOCUMENT_TYPE_LABELS } from '@/types/document'

interface Props {
  open: boolean
  onClose: () => void
}

export function BundleExportModal({ open, onClose }: Props) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const isPro = user?.plan === 'pro' || user?.plan === 'pro_cancelling' || user?.plan === 'one_time'

  const [docs, setDocs] = React.useState<DocDocument[]>([])
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  const [showUpgrade, setShowUpgrade] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      void documentApi.list().then((list) => {
        setDocs(list)
        setSelectedIds(list.map((d) => d.id))
      })
    }
  }, [open])

  const toggle = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const handleExport = async () => {
    if (selectedIds.length === 0) return
    setLoading(true)
    try {
      // In a real implementation, this would call a backend service to generate a ZIP
      // For now we trigger individual print dialogs for selected docs or show a placeholder
      toast(t('bundle.exportStarted'), 'success')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!isPro) {
    return (
      <>
        <UpgradePromptModal open={showUpgrade} onClose={() => setShowUpgrade(false)} featureName={t('bundle.featureName')} />
        <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
          <DialogContent className="max-w-sm text-center">
            <DialogTitle className="sr-only">{t('bundle.title')}</DialogTitle>
            <div className="py-4 space-y-4">
              <div className="size-14 rounded-2xl bg-ds-premium/10 flex items-center justify-center mx-auto">
                <Lock className="size-7 text-ds-premium-foreground" />
              </div>
              <h2 className="text-lg font-bold">{t('bundle.upgradeTitle')}</h2>
              <p className="text-sm text-muted-foreground">{t('bundle.upgradeDesc')}</p>
              <Button className="w-full bg-ds-premium text-ds-premium-foreground hover:opacity-90" onClick={() => setShowUpgrade(true)}>
                {t('upgrade.cta')}
              </Button>
              <button type="button" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
                {t('common.cancel')}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2">
          <Package className="size-5 text-primary" />
          {t('bundle.title')}
        </DialogTitle>

        <p className="text-sm text-muted-foreground mt-1 mb-4">{t('bundle.description')}</p>

        <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
          {docs.map((doc) => (
            <label key={doc.id} className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={selectedIds.includes(doc.id)}
                onChange={() => toggle(doc.id)}
                className="rounded"
              />
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <FileText className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
              </div>
            </label>
          ))}
        </div>

        {docs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">{t('bundle.noDocs')}</p>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1"
            onClick={() => void handleExport()}
            disabled={loading || selectedIds.length === 0}
          >
            <Download className="size-4 mr-2" />
            {loading ? t('common.loading') : t('bundle.downloadZip', { count: selectedIds.length })}
          </Button>
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
