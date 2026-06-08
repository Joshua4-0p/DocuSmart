import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onClose: () => void
  used: number
  limit: number
}

function getResetDate(): string {
  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return first.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
}

export function MonthlyLimitModal({ open, onClose, used, limit }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-sm">
        <div className="flex flex-col items-center text-center px-2 pb-2">
          <div className="size-14 rounded-2xl bg-ds-warning/10 flex items-center justify-center mb-4">
            <FileText className="size-7 text-ds-warning-foreground" />
          </div>

          <DialogTitle className="text-lg font-bold mb-1">
            {t('upgrade.monthlyLimitTitle', { used, limit })}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mb-5">
            {t('upgrade.monthlyLimitDesc', { date: getResetDate() })}
          </p>

          <div className="w-full space-y-2">
            <Button
              className="w-full bg-ds-premium text-ds-premium-foreground hover:opacity-90"
              onClick={() => { onClose(); void navigate('/pricing') }}
            >
              {t('upgrade.cta')}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { onClose(); void navigate('/pricing?single=true') }}
            >
              {t('upgrade.buySingleDoc')}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
