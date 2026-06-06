import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PublicNavbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

  // Non-landing pages always show the floating pill style
  const floating = scrolled || !isLanding

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.templates'), href: '#templates' },
    { label: t('nav.pricing'), href: '/pricing' },
    { label: t('nav.about'), href: '/about' },
  ]

  return (
    // Outer wrapper: just handles fixed positioning + top padding so pill floats
    <div className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', floating ? 'pt-3 px-4 sm:px-6' : 'pt-0 px-0')}>
      {/* Inner pill: gets rounded + shadow + bg when floating */}
      <div
        className={cn(
          'transition-all duration-300',
          floating
            ? 'max-w-6xl mx-auto rounded-2xl bg-background/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-border/60'
            : 'max-w-7xl mx-auto',
        )}
      >
        <div className={cn('flex items-center justify-between transition-all duration-300', floating ? 'h-14 px-5' : 'h-16 px-4 sm:px-6 lg:px-8')}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight shrink-0">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-black">
              D
            </div>
            DocuSmart
          </Link>

          {/* Desktop nav — center */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop actions — right */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
              className="text-muted-foreground text-xs font-semibold"
            >
              {i18n.language === 'en' ? 'FR' : 'EN'}
            </Button>
            <Button variant="outline" className="rounded-xl h-10 px-5 text-sm" asChild>
              <Link to="/login">{t('nav.signIn')}</Link>
            </Button>
            <Button className="rounded-xl h-10 px-5 text-sm" asChild>
              <Link to="/register">{t('nav.getStarted')}</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {/* Mobile menu — inside the pill */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="md:hidden overflow-hidden border-t border-border/50"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm py-2.5 px-3 rounded-lg text-foreground hover:bg-accent transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-border/50">
                  <Button variant="outline" asChild className="w-full rounded-xl">
                    <Link to="/login">{t('nav.signIn')}</Link>
                  </Button>
                  <Button asChild className="w-full rounded-xl">
                    <Link to="/register">{t('nav.getStarted')}</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
