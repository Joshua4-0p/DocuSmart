import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Copy, Trash2, Download, FileText, FilePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { useToast } from '@/components/ui/toast'
import { documentApi } from '@/lib/api/document.api'
import type { DocDocument } from '@/lib/api/document.api'
import { DOCUMENT_TYPE_LABELS } from '@/types/document'

const TYPE_COLORS: Record<string, string> = {
  cv: 'bg-primary/10 text-primary',
  cover_letter: 'bg-ds-ai/10 text-ds-ai-foreground',
  motivation_letter: 'bg-ds-success/10 text-ds-success-foreground',
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

type FilterTab = 'all' | 'cv' | 'cover_letter'
type SortKey = 'updated' | 'created' | 'name'

export function DocumentsListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [docs, setDocs] = React.useState<DocDocument[]>([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState<FilterTab>('all')
  const [sort, setSort] = React.useState<SortKey>('updated')
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [duplicatingId, setDuplicatingId] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    const list = await documentApi.list()
    setDocs(list)
    setLoading(false)
  }, [])

  React.useEffect(() => { void load() }, [load])

  const filtered = React.useMemo(() => {
    const list = docs.filter((d) => {
      if (filter === 'all') return true
      if (filter === 'cv') return d.type === 'cv'
      if (filter === 'cover_letter') return d.type === 'cover_letter'
      return true
    })
    return [...list].sort((a, b) => {
      if (sort === 'name') return a.title.localeCompare(b.title)
      if (sort === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [docs, filter, sort])

  const handleDuplicate = async (id: string) => {
    setDuplicatingId(id)
    try {
      const copy = await documentApi.duplicate(id)
      void navigate(`/builder/${copy.id}`)
    } finally {
      setDuplicatingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await documentApi.delete(deleteId)
    setDeleteId(null)
    void load()
    toast(t('common.delete') + ' successful', 'success')
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('documents.title')}</h1>
        <Button asChild>
          <Link to="/documents/new">
            <Plus className="size-4 mr-2" />
            {t('documents.newDocument')}
          </Link>
        </Button>
      </div>

      {/* Filter tabs + sort */}
      <div className="flex items-center justify-between mb-6 border-b border-border">
        <div className="flex gap-1">
          {(['all', 'cv', 'cover_letter'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${filter === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {tab === 'all' ? t('documents.all') : tab === 'cv' ? t('documents.cvs') : t('documents.coverLetters')}
            </button>
          ))}
        </div>
        <select
          title={t('documents.sortBy')}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="mb-1 h-8 rounded-lg border border-input bg-background px-2 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="updated">{t('documents.sortUpdated')}</option>
          <option value="created">{t('documents.sortCreated')}</option>
          <option value="name">{t('documents.sortName')}</option>
        </select>
      </div>

      {/* Empty state */}
      {!filtered.length && (
        <EmptyState
          icon={<FilePlus className="size-10" />}
          title={t('documents.noDocuments')}
          description={t('documents.noDocumentsDesc')}
          actionLabel={t('documents.createDocument')}
          onAction={() => void navigate('/documents/new')}
        />
      )}

      {/* Document grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Template thumbnail */}
              <div className="h-36 bg-linear-to-br from-muted/50 to-muted flex items-center justify-center border-b border-border">
                <FileText className="size-10 text-muted-foreground/40" />
              </div>

              <div className="p-4">
                <Badge
                  className={`text-[10px] px-2 py-0.5 mb-2 ${TYPE_COLORS[doc.type] ?? 'bg-muted text-muted-foreground'}`}
                >
                  {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
                </Badge>

                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{doc.title}</h3>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {doc.language}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(doc.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Action row — visible on hover */}
              <div className="flex items-center justify-between px-4 pb-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="default" size="sm" className="flex-1 text-xs" asChild>
                  <Link to={`/builder/${doc.id}`}>
                    <Edit2 className="size-3 mr-1" />
                    {t('documents.edit')}
                  </Link>
                </Button>

                <div className="flex gap-1">
                  <button
                    type="button"
                    title={t('documents.downloadPDF')}
                    onClick={() => void navigate(`/builder/${doc.id}?step=10`)}
                    className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Download className="size-3.5 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    title={t('documents.duplicate')}
                    onClick={() => void handleDuplicate(doc.id)}
                    disabled={duplicatingId === doc.id}
                    className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    <Copy className="size-3.5 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    title={t('documents.delete')}
                    onClick={() => setDeleteId(doc.id)}
                    className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                  >
                    <Trash2 className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        title={t('documents.deleteConfirmTitle')}
        description={t('documents.deleteConfirmDesc')}
        onConfirm={handleDelete}
        isDestructive
      />
    </div>
  )
}
