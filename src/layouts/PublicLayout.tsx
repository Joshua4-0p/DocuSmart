import { Outlet } from 'react-router-dom'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { Footer } from '@/components/layout/Footer'

interface PublicLayoutProps {
  hideFooter?: boolean
  hideNav?: boolean
}

export function PublicLayout({ hideFooter = false, hideNav = false }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <PublicNavbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}
