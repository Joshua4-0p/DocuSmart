import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Breadcrumb {
  label: string
  to: string
}

interface PageHeaderProps {
  title: string
  breadcrumb?: Breadcrumb
  actions?: React.ReactNode
}

export function PageHeader({ title, breadcrumb, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex flex-col gap-1">
        {breadcrumb && (
          <Link
            to={breadcrumb.to}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" />
            {breadcrumb.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
