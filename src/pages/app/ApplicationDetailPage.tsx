import * as React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, FileText, Edit2, BrainCircuit, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AddApplicationModal } from '@/components/app/AddApplicationModal'
import { applicationsApi } from '@/lib/api/applications.api'
import { documentApi } from '@/lib/api/document.api'
import { useToast } from '@/components/ui/toast'
import type { ApplicationEntry, ApplicationStatus } from '@/types/application'
import { APPLICATION_STATUS_ORDER } from '@/types/application'
import type { DocDocument } from '@/lib/api/document.api'
import { DOCUMENT_TYPE_LABELS } from '@/types/document'

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  wishlist: 'bg-muted text-muted-foreground',
  applied: 'bg-primary/10 text-primary',
  interview: 'bg-ds-warning/10 text-ds-warning-foreground',
  offer: 'bg-ds-success/10 text-ds-success-foreground',
  rejected: 'bg-muted text-muted-foreground',
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [app, setApp] = React.useState<ApplicationEntry | null>(null)
  const [docs, setDocs] = React.useState<DocDocument[]>([])
  const [editOpen, setEditOpen] = React.useState(false)
  const [notes, setNotes] = React.useState('')
  const [savingNotes, setSavingNotes] = React.useState(false)

  const load = React.useCallback(async () => {
    if (!id) return
    const [entry, docList] = await Promise.all([applicationsApi.get(id), documentApi.list()])
    setApp(entry)
    setNotes(entry?.notes ?? '')
    setDocs(docList)
  }, [id])

  React.useEffect(() => { void load() }, [load])

  const handleStatusChange = async (status: ApplicationStatus) => {
    if (!app) return
    const updated = await applicationsApi.update(app.id, { status })
    setApp(updated)
    toast(t('applications.movedTo', { status: t(`applications.status_${status}`) }), 'success')
  }

  const handleSaveNotes = async () => {
    if (!app) return
    setSavingNotes(true)
    const updated = await applicationsApi.update(app.id, { notes: notes || undefined })
    setApp(updated)
    setSavingNotes(false)
    toast(t('common.saved'), 'success')
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const linkedDocs = docs.filter((d) => app.linkedDocumentIds.includes(d.id))
  const cvDoc = linkedDocs.find((d) => d.type === 'cv')

  return (
    <div className="max-w-2xl">
      <button
        type="button"
        onClick={() => void navigate('/applications')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="size-4" />
        {t('applications.title')}
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{app.role}</h1>
          <p className="text-muted-foreground">{app.company}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('applications.appliedOn')} {fmt(app.applicationDate)}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          title={t('common.edit')}
        >
          <Edit2 className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* Status selector */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('applications.status')}</p>
        <div className="flex flex-wrap gap-2">
          {APPLICATION_STATUS_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void handleStatusChange(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                app.status === s
                  ? `${STATUS_COLORS[s]} border-current`
                  : 'border-transparent bg-muted/50 text-muted-foreground hover:border-border'
              }`}
            >
              {t(`applications.status_${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Application URL */}
      {app.applicationUrl && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('applications.applicationUrl')}</p>
          <a
            href={app.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="size-4" />
            {app.applicationUrl}
          </a>
        </div>
      )}

      {/* Linked documents */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('applications.linkedDocuments')}</p>
        {linkedDocs.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('applications.noDocumentsLinked')}</p>
        ) : (
          <div className="space-y-2">
            {linkedDocs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                <FileText className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
                </div>
                <Link to={`/builder/${doc.id}`} className="text-xs text-primary hover:underline shrink-0">
                  {t('documents.edit')}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interview Coach CTA */}
      {(app.status === 'interview' || app.status === 'applied') && cvDoc && (
        <div className="mb-5 p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-3">
          <BrainCircuit className="size-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold">{t('applications.coachCta')}</p>
            <p className="text-xs text-muted-foreground">{t('applications.coachCtaDesc')}</p>
          </div>
          <Button size="sm" asChild>
            <Link to={`/documents/${cvDoc.id}/interview-coach`}>{t('applications.coachBtn')}</Link>
          </Button>
        </div>
      )}

      {/* Notes */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('applications.notes')}</p>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          placeholder={t('applications.notesPlaceholder')}
          rows={4}
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">{notes.length}/500</span>
          <Button size="sm" variant="outline" onClick={() => void handleSaveNotes()} disabled={savingNotes}>
            {savingNotes ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </div>

      <AddApplicationModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={(updated) => { setApp(updated); setNotes(updated.notes ?? '') }}
        editing={app}
      />
    </div>
  )
}
