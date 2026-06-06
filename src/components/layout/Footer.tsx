import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl text-background mb-3">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-black">
                D
              </div>
              DocuSmart
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-4">
              {t('landing.footerTagline')}
            </p>
            <p className="text-xs text-background/50">{t('landing.madeForCameroon')}</p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-background/50 mb-4">
              {t('landing.footerProduct')}
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'CV Builder', to: '/register' },
                { label: 'Templates', to: '/templates' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'AI Features', to: '/register' },
              ].map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-sm hover:text-background transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-background/50 mb-4">
              {t('landing.footerLegal')}
            </p>
            <div className="flex flex-col gap-2.5">
              <Link to="/terms" className="text-sm hover:text-background transition-colors">
                {t('landing.footerTerms')}
              </Link>
              <Link to="/privacy" className="text-sm hover:text-background transition-colors">
                {t('landing.footerPrivacy')}
              </Link>
              <Link to="/contact" className="text-sm hover:text-background transition-colors">
                {t('landing.footerContact')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-background/10 text-xs text-background/40">
          {t('landing.footerCopyright', { year })}
        </div>
      </div>
    </footer>
  )
}
