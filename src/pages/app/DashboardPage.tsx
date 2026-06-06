import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FilePlus2,
  User,
  ImagePlus,
  GraduationCap,
  Briefcase,
  Zap,
  Award,
  FolderOpen,
  Heart,
  BookOpen,
  Globe,
  Users,
  FileText,
  Edit2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { useAuthStore } from '@/store/auth.store'
import { documentApi } from '@/lib/api/document.api'
import { getProfileSnapshot } from '@/lib/api/profile.api'
import type { DocDocument } from '@/lib/api/document.api'
import { DOCUMENT_TYPE_LABELS } from '@/types/document'

const sectionMeta = [
  { key: 'personal', icon: User, path: '/profile/personal', alwaysFilled: true },
  { key: 'education', icon: GraduationCap, path: '/profile/education', alwaysFilled: false },
  { key: 'experience', icon: Briefcase, path: '/profile/experience', alwaysFilled: false },
  { key: 'skills', icon: Zap, path: '/profile/skills', alwaysFilled: false },
  { key: 'certifications', icon: Award, path: '/profile/certifications', alwaysFilled: false },
  { key: 'projects', icon: FolderOpen, path: '/profile/projects', alwaysFilled: false },
  { key: 'volunteer', icon: Heart, path: '/profile/volunteer', alwaysFilled: false },
  { key: 'publications', icon: BookOpen, path: '/profile/publications', alwaysFilled: false },
  { key: 'languages', icon: Globe, path: '/profile/languages', alwaysFilled: false },
  { key: 'references', icon: Users, path: '/profile/references', alwaysFilled: false },
] as const

function getTimeOfDay(t: (k: string) => string) {
  const h = new Date().getHours()
  if (h < 12) return t('dashboard.morning')
  if (h < 18) return t('dashboard.afternoon')
  return t('dashboard.evening')
}

function calcProfileCompleteness(): number {
  const p = getProfileSnapshot()
  let score = 10 // personal always counts
  if (Array.isArray(p.education) && p.education.length) score += 10
  if (Array.isArray(p.experience) && p.experience.length) score += 15
  if (Array.isArray(p.skills) && p.skills.length) score += 15
  if (Array.isArray(p.certifications) && p.certifications.length) score += 10
  if (Array.isArray(p.projects) && p.projects.length) score += 10
  if (Array.isArray(p.volunteer) && p.volunteer.length) score += 10
  if (Array.isArray(p.publications) && p.publications.length) score += 5
  if (Array.isArray(p.languages) && p.languages.length) score += 10
  if (Array.isArray(p.references) && p.references.length) score += 5
  return Math.min(score, 100)
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [recentDocs, setRecentDocs] = React.useState<DocDocument[]>([])

  React.useEffect(() => {
    documentApi.list().then((docs) => {
      setRecentDocs(docs.slice(0, 3))
    }).catch(() => {})
  }, [])

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const completeness = calcProfileCompleteness()

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          {t('dashboard.greeting', { timeOfDay: getTimeOfDay(t), name: firstName })} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t('dashboard.profileCompletion', { percent: completeness })}
        </p>
      </div>

      {/* Profile Completeness Card */}
      {completeness < 80 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-semibold text-sm">Complete your profile</p>
              <p className="text-xs text-muted-foreground">
                A complete profile generates better AI documents.
              </p>
            </div>
            <span className="text-lg font-black text-primary">{completeness}%</span>
          </div>
          <Progress value={completeness} className="h-2 mb-4" />
          <div className="flex flex-col gap-1.5">
            {['Add a professional photo', 'Fill in your work experience', 'Add your education'].map((step) => (
              <div key={step} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="size-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                {step}
              </div>
            ))}
          </div>
          <Button size="sm" className="mt-4" asChild>
            <Link to="/profile">{t('dashboard.completeProfile')}</Link>
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold mb-3">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => void navigate('/documents/new')}
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 hover:shadow-sm transition-all group min-h-11"
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FilePlus2 className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{t('dashboard.newDocument')}</p>
              <p className="text-xs text-muted-foreground">CV, Cover Letter…</p>
            </div>
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-sm transition-all min-h-11"
          >
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <User className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">{t('dashboard.completeProfile')}</p>
              <p className="text-xs text-muted-foreground">{completeness}% done</p>
            </div>
          </Link>

          <Link
            to="/profile/personal"
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-sm transition-all min-h-11"
          >
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <ImagePlus className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">{t('dashboard.uploadPhoto')}</p>
              <p className="text-xs text-muted-foreground">Stand out</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">{t('dashboard.recentDocuments')}</h2>
          {recentDocs.length > 0 && (
            <Link to="/documents" className="text-xs text-primary hover:underline">
              View all
            </Link>
          )}
        </div>

        {recentDocs.length === 0 ? (
          <EmptyState
            icon={<FilePlus2 className="size-10" />}
            title={t('dashboard.noDocuments')}
            description="Create your first CV and let AI write the content for you."
            actionLabel={t('dashboard.createFirstCV')}
            onAction={() => void navigate('/documents/new')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                to={`/builder/${doc.id}`}
                className="group flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type} · {timeAgo(doc.updatedAt)}
                  </p>
                </div>
                <Edit2 className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Profile Status */}
      <div>
        <h2 className="text-base font-semibold mb-3">{t('dashboard.profileStatus')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {sectionMeta.map(({ key, icon: Icon, path }) => (
            <Link
              key={key}
              to={path}
              className="flex flex-col items-center gap-2 bg-card border border-border rounded-xl p-3 text-center hover:border-primary/40 hover:shadow-sm transition-all min-h-11"
            >
              <Icon className="size-5 text-muted-foreground" />
              <span className="text-xs font-medium truncate w-full text-center">
                {t(`profile.${key}`)}
              </span>
              <Badge variant="muted" className="text-[10px]">
                {t('dashboard.empty')}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
