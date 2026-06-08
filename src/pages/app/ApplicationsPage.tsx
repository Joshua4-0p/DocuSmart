import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { Plus, Lock, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ApplicationCard } from '@/components/app/ApplicationCard'
import { AddApplicationModal } from '@/components/app/AddApplicationModal'
import { UpgradePromptModal } from '@/components/shared/UpgradePromptModal'
import { applicationsApi } from '@/lib/api/applications.api'
import { documentApi } from '@/lib/api/document.api'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/components/ui/toast'
import type { ApplicationEntry, ApplicationStatus } from '@/types/application'
import { APPLICATION_STATUS_ORDER } from '@/types/application'
import type { DocDocument } from '@/lib/api/document.api'

function KanbanColumn({
  status,
  apps,
  docs,
  onAdd,
  onEdit,
  onDelete,
  onView,
  label,
}: {
  status: ApplicationStatus
  apps: ApplicationEntry[]
  docs: DocDocument[]
  label: string
  onAdd: (status: ApplicationStatus) => void
  onEdit: (app: ApplicationEntry) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}) {
  const { t } = useTranslation()
  const { setNodeRef, isOver } = useDroppable({ id: status })

  const STATUS_COLORS: Record<ApplicationStatus, string> = {
    wishlist: 'text-muted-foreground bg-muted/50',
    applied: 'text-primary bg-primary/10',
    interview: 'text-ds-warning-foreground bg-ds-warning/10',
    offer: 'text-ds-success-foreground bg-ds-success/10',
    rejected: 'text-muted-foreground bg-muted/50',
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[260px] w-[260px] bg-muted/30 rounded-2xl border ${isOver ? 'border-primary/50 bg-primary/5' : 'border-border'} transition-colors`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>
            {label}
          </span>
          <span className="text-xs text-muted-foreground font-medium">({apps.length})</span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(status)}
          className="size-6 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
          title={t('applications.addCard')}
        >
          <Plus className="size-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-20">
        {apps.map((app) => (
          <ApplicationCard
            key={app.id}
            app={app}
            docs={docs}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>

      {/* Add button at bottom */}
      <button
        type="button"
        onClick={() => onAdd(status)}
        className="m-2 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-dashed border-border"
      >
        <Plus className="size-3" />
        {t('applications.addCard')}
      </button>
    </div>
  )
}

export default function ApplicationsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const isPro = user?.plan === 'pro' || user?.plan === 'pro_cancelling' || user?.plan === 'one_time'

  const [apps, setApps] = React.useState<ApplicationEntry[]>([])
  const [docs, setDocs] = React.useState<DocDocument[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [addModal, setAddModal] = React.useState<{ open: boolean; status: ApplicationStatus }>({ open: false, status: 'applied' })
  const [editEntry, setEditEntry] = React.useState<ApplicationEntry | null>(null)
  const [showUpgrade, setShowUpgrade] = React.useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const load = React.useCallback(async () => {
    const [appList, docList] = await Promise.all([applicationsApi.list(), documentApi.list()])
    setApps(appList)
    setDocs(docList)
    setLoading(false)
  }, [])

  React.useEffect(() => { void load() }, [load])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const newStatus = over.id as ApplicationStatus
    if (!APPLICATION_STATUS_ORDER.includes(newStatus)) return
    const app = apps.find((a) => a.id === active.id)
    if (!app || app.status === newStatus) return
    // Optimistic update
    setApps((prev) => prev.map((a) => a.id === active.id ? { ...a, status: newStatus } : a))
    try {
      await applicationsApi.moveStatus(String(active.id), newStatus)
      toast(t('applications.movedTo', { status: t(`applications.status_${newStatus}`) }), 'success')
    } catch {
      await load() // revert
    }
  }

  const handleDelete = async (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id))
    await applicationsApi.delete(id)
  }

  const filteredApps = search
    ? apps.filter((a) =>
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase()),
      )
    : apps

  const byStatus = (status: ApplicationStatus) =>
    filteredApps.filter((a) => a.status === status)

  if (!isPro) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <UpgradePromptModal
          open={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          featureName={t('applications.featureName')}
        />
        <div className="max-w-sm text-center space-y-4">
          <div className="size-16 rounded-2xl bg-ds-premium/10 flex items-center justify-center mx-auto">
            <Lock className="size-8 text-ds-premium-foreground" />
          </div>
          <h2 className="text-xl font-bold">{t('applications.upgradeTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('applications.upgradeDesc')}</p>
          <Button
            className="w-full bg-ds-premium text-ds-premium-foreground hover:opacity-90"
            onClick={() => setShowUpgrade(true)}
          >
            {t('upgrade.cta')}
          </Button>
          <button
            type="button"
            onClick={() => void navigate('/pricing')}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            {t('upgrade.seeWhatsInPro')}
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">{t('applications.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('applications.subtitle')}</p>
        </div>
        <Button onClick={() => setAddModal({ open: true, status: 'applied' })}>
          <Plus className="size-4 mr-2" />
          {t('applications.addNew')}
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 shrink-0 max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('applications.searchPlaceholder')}
            className="pl-9"
          />
        </div>
      </div>

      {/* Kanban board — horizontal scroll */}
      <div className="flex-1 overflow-auto">
        <DndContext sensors={sensors} onDragEnd={(e) => void handleDragEnd(e)}>
          <div className="flex gap-4 h-full pb-4" style={{ minWidth: 'max-content' }}>
            {APPLICATION_STATUS_ORDER.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                label={t(`applications.status_${status}`)}
                apps={byStatus(status)}
                docs={docs}
                onAdd={(s) => setAddModal({ open: true, status: s })}
                onEdit={(app) => setEditEntry(app)}
                onDelete={(id) => void handleDelete(id)}
                onView={(id) => void navigate(`/applications/${id}`)}
              />
            ))}
          </div>
        </DndContext>
      </div>

      <AddApplicationModal
        open={addModal.open || Boolean(editEntry)}
        onClose={() => { setAddModal({ open: false, status: 'applied' }); setEditEntry(null) }}
        onSaved={() => void load()}
        initialStatus={addModal.status}
        editing={editEntry}
      />
    </div>
  )
}
