import { Lock, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onClose: () => void
  featureName?: string
}

const PRO_FEATURES = [
  'upgrade.featureUnlimitedDocs',
  'upgrade.featureAllDocTypes',
  'upgrade.featureAllTemplates',
  'upgrade.featureJdScanner',
  'upgrade.featureApplicationsLog',
  'upgrade.featureInterviewCoach',
  'upgrade.featureBundleExport',
  'upgrade.featureShareableProfile',
]

export function UpgradePromptModal({ open, onClose, featureName }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleUpgrade = () => {
    onClose()
    void navigate('/pricing')
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-sm">
        <div className="flex flex-col items-center text-center px-2 pb-2">
          <div className="size-14 rounded-2xl bg-ds-premium/10 flex items-center justify-center mb-4">
            <Lock className="size-7 text-ds-premium-foreground" />
          </div>

          <DialogTitle className="text-lg font-bold mb-1">
            {featureName
              ? t('upgrade.featureGated', { feature: featureName })
              : t('upgrade.title')}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mb-5">
            {t('upgrade.subtitle')}
          </p>

          <ul className="w-full space-y-2 mb-6 text-left">
            {PRO_FEATURES.map((key) => (
              <li key={key} className="flex items-center gap-2.5 text-sm">
                <Check className="size-4 text-ds-success-foreground shrink-0" />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>

          <Button className="w-full mb-3 bg-ds-premium text-ds-premium-foreground hover:opacity-90" onClick={handleUpgrade}>
            {t('upgrade.cta')}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('upgrade.continueFree')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
