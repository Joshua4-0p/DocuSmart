import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Zap,
  Award,
  FolderOpen,
  Heart,
  BookOpen,
  Globe,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  LayoutTemplate,
  Kanban,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const primaryNav = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'documents', icon: FileText, path: '/documents' },
  { key: 'templates', icon: LayoutTemplate, path: '/templates' },
  { key: 'applications', icon: Kanban, path: '/applications' },
] as const

const profileSections = [
  { key: 'personal', icon: User, path: '/profile/personal' },
  { key: 'education', icon: GraduationCap, path: '/profile/education' },
  { key: 'experience', icon: Briefcase, path: '/profile/experience' },
  { key: 'skills', icon: Zap, path: '/profile/skills' },
  { key: 'certifications', icon: Award, path: '/profile/certifications' },
  { key: 'projects', icon: FolderOpen, path: '/profile/projects' },
  { key: 'volunteer', icon: Heart, path: '/profile/volunteer' },
  { key: 'publications', icon: BookOpen, path: '/profile/publications' },
  { key: 'languages', icon: Globe, path: '/profile/languages' },
  { key: 'references', icon: Users, path: '/profile/references' },
] as const

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
  sectionCounts: Record<string, number>
}

export function AppSidebar({ collapsed, onToggle, sectionCounts }: AppSidebarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const isProfileSection = location.pathname.startsWith('/profile')

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-border bg-sidebar transition-all duration-200 shrink-0',
        collapsed ? 'w-16' : 'w-56',
      )}
    >
      {/* Toggle header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {isProfileSection ? t('nav.profile') : 'Menu'}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className={cn('text-muted-foreground', collapsed && 'mx-auto')}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto flex flex-col gap-px px-2">
        {/* Primary nav */}
        {primaryNav.map(({ key, icon: Icon, path }) => (
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors min-h-11',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                collapsed && 'justify-center px-0',
              )
            }
            title={collapsed ? t(`nav.${key}`) : undefined}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && <span className="flex-1 truncate">{t(`nav.${key}`)}</span>}
          </NavLink>
        ))}

        {/* Divider */}
        <div className="my-1 border-t border-sidebar-border" />

        {/* Profile hub link */}
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors min-h-11',
              isActive || isProfileSection
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
              collapsed && 'justify-center px-0',
            )
          }
          title={collapsed ? t('nav.profile') : undefined}
        >
          <User className="size-4 shrink-0" />
          {!collapsed && <span className="flex-1 truncate">{t('nav.profile')}</span>}
        </NavLink>

        {/* Profile sub-sections — visible when in profile area */}
        {isProfileSection && (
          <div className={cn('ml-2 flex flex-col gap-px border-l border-sidebar-border pl-2', collapsed && 'ml-0 border-l-0 pl-0')}>
            {profileSections.map(({ key, icon: Icon, path }) => {
              const count = sectionCounts[key] ?? 0
              const isFilled = count > 0 || key === 'personal'
              return (
                <NavLink
                  key={key}
                  to={path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs transition-colors min-h-9',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                      collapsed && 'justify-center px-0',
                    )
                  }
                  title={collapsed ? t(`profile.${key}`) : undefined}
                >
                  <div className="relative shrink-0">
                    <Icon className="size-3.5" />
                    {isFilled && (
                      <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-ds-success-foreground" />
                    )}
                  </div>
                  {!collapsed && (
                    <span className="flex-1 truncate">{t(`profile.${key}`)}</span>
                  )}
                  {!collapsed && count > 1 && (
                    <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                  )}
                </NavLink>
              )
            })}
          </div>
        )}

        {/* Bottom settings */}
        <div className="mt-auto pt-2 border-t border-sidebar-border">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors min-h-11',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                collapsed && 'justify-center px-0',
              )
            }
            title={collapsed ? t('nav.settings') : undefined}
          >
            <Settings className="size-4 shrink-0" />
            {!collapsed && <span className="flex-1 truncate">{t('nav.settings')}</span>}
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
