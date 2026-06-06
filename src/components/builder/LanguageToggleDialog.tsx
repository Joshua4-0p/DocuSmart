import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface LanguageToggleDialogProps {
  open: boolean
  targetLang: 'en' | 'fr'
  onConfirm: () => void
  onCancel: () => void
}

export function LanguageToggleDialog({
  open,
  targetLang,
  onConfirm,
  onCancel,
}: LanguageToggleDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('builder.languageSwitchTitle')}</DialogTitle>
          <DialogDescription className="pt-1">
            {t('builder.languageSwitchWarning')}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {targetLang === 'en'
            ? 'The document will be regenerated in English.'
            : 'Le document sera régénéré en Français.'}
        </p>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onConfirm}>
            {t('builder.languageSwitchConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
