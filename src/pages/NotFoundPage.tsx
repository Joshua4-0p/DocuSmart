import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'

export function NotFoundPage() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthStore()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-8xl font-black text-foreground/10">404</p>
      <div>
        <h1 className="text-2xl font-semibold">{t('common.notFound')}</h1>
        <p className="text-muted-foreground mt-1">{t('common.notFoundDesc')}</p>
      </div>
      <Button asChild>
        <Link to={isAuthenticated ? '/dashboard' : '/'}>
          {isAuthenticated ? t('nav.dashboard') : t('common.backHome')}
        </Link>
      </Button>
    </div>
  )
}
