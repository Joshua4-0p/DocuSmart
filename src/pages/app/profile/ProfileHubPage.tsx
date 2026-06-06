import { Link } from 'react-router-dom'
import {
  User, GraduationCap, Briefcase, Zap, Award,
  FolderOpen, Heart, BookOpen, Globe, Users, ChevronRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth.store'

const sections = [
  { key: 'personal', icon: User, path: '/profile/personal', count: 0 },
  { key: 'education', icon: GraduationCap, path: '/profile/education', count: 0 },
  { key: 'experience', icon: Briefcase, path: '/profile/experience', count: 0 },
  { key: 'skills', icon: Zap, path: '/profile/skills', count: 0 },
  { key: 'certifications', icon: Award, path: '/profile/certifications', count: 0 },
  { key: 'projects', icon: FolderOpen, path: '/profile/projects', count: 0 },
  { key: 'volunteer', icon: Heart, path: '/profile/volunteer', count: 0 },
  { key: 'publications', icon: BookOpen, path: '/profile/publications', count: 0 },
  { key: 'languages', icon: Globe, path: '/profile/languages', count: 0 },
  { key: 'references', icon: Users, path: '/profile/references', count: 0 },
] as const

export function ProfileHubPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const completeness = 10
  const filled = sections.filter((s) => s.count > 0).length

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col gap-8">
      {/* Overview card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-5">
          <Avatar className="size-16">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{user?.name}</h1>
            <p className="text-sm text-muted-foreground">
              {t('profile.sectionsComplete', { done: filled, total: 10 })}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-black text-primary">{completeness}%</p>
            <p className="text-xs text-muted-foreground">{t('profile.completeness', { percent: completeness })}</p>
          </div>
        </div>
        <Progress value={completeness} />
      </div>

      {/* Section grid */}
      <div>
        <h2 className="text-base font-semibold mb-3">{t('profile.overview')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map(({ key, icon: Icon, path, count }) => (
            <Link
              key={key}
              to={path}
              className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/40 hover:shadow-sm transition-all group min-h-[44px]"
            >
              <Icon className="size-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{t(`profile.${key}`)}</p>
                {count > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {t(count === 1 ? 'common.entry' : 'common.entries', { count })}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">{t('common.noEntries')}</p>
                )}
              </div>
              <Badge variant={count > 0 ? 'success' : 'muted'} className="shrink-0 text-[10px]">
                {count > 0 ? t('dashboard.filled') : t('dashboard.empty')}
              </Badge>
              <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
