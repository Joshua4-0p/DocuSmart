import { Link } from 'react-router-dom'
import { Bell, LogOut, Settings, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '@/lib/api/auth.api'
import { cn } from '@/lib/utils'

interface AppNavbarProps {
  className?: string
}

export function AppNavbar({ className }: AppNavbarProps) {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // continue
    }
    logout()
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between h-14 px-4 sm:px-6 border-b border-border bg-background/95 backdrop-blur shrink-0',
        className,
      )}
    >
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
        <div className="size-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-black">
          D
        </div>
        <span className="hidden sm:block">DocuSmart</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Avatar className="size-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="size-4 mr-2" />
                {t('nav.profile')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="size-4 mr-2" />
                {t('nav.settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void handleLogout()} className="text-destructive">
              <LogOut className="size-4 mr-2" />
              {t('nav.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
