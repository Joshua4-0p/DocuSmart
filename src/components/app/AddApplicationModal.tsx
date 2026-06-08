import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { applicationsApi } from '@/lib/api/applications.api'
import { documentApi } from '@/lib/api/document.api'
import type { ApplicationEntry, ApplicationStatus } from '@/types/application'
import type { DocDocument } from '@/lib/api/document.api'
import { DOCUMENT_TYPE_LABELS } from '@/types/document'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: (entry: ApplicationEntry) => void
  initialStatus?: ApplicationStatus
  editing?: ApplicationEntry | null
}

export function AddApplicationModal({ open, onClose, onSaved, initialStatus = 'applied', editing }: Props) {
  const { t } = useTranslation()
  const [company, setCompany] = React.useState(editing?.company ?? '')
  const [role, setRole] = React.useState(editing?.role ?? '')
  const [date, setDate] = React.useState(editing?.applicationDate ?? new Date().toISOString().slice(0, 10))
  const [status, setStatus] = React.useState<ApplicationStatus>(editing?.status ?? initialStatus)
  const [notes, setNotes] = React.useState(editing?.notes ?? '')
  const [url, setUrl] = React.useState(editing?.applicationUrl ?? '')
  const [linkedIds, setLinkedIds] = React.useState<string[]>(editing?.linkedDocumentIds ?? [])
  const [docs, setDocs] = React.useState<DocDocument[]>([])
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      void documentApi.list().then(setDocs)
      if (editing) {
        setCompany(editing.company)
        setRole(editing.role)
        setDate(editing.applicationDate)
        setStatus(editing.status)
        setNotes(editing.notes ?? '')
        setUrl(editing.applicationUrl ?? '')
        setLinkedIds(editing.linkedDocumentIds)
      } else {
        setCompany(''); setRole(''); setDate(new Date().toISOString().slice(0, 10))
        setStatus(initialStatus); setNotes(''); setUrl(''); setLinkedIds([])
      }
    }
  }, [open, editing, initialStatus])

  const toggleDoc = (id: string) => {
    setLinkedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const handleSave = async () => {
    if (!company.trim() || !role.trim()) return
    setSaving(true)
    try {
      let result: ApplicationEntry
      if (editing) {
        result = await applicationsApi.update(editing.id, { company, role, applicationDate: date, status, notes: notes || undefined, applicationUrl: url || undefined, linkedDocumentIds: linkedIds })
      } else {
        result = await applicationsApi.create({ company, role, applicationDate: date, status, notes: notes || undefined, applicationUrl: url || undefined, linkedDocumentIds: linkedIds })
      }
      onSaved(result)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const STATUS_OPTIONS: ApplicationStatus[] = ['wishlist', 'applied', 'interview', 'offer', 'rejected']

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogTitle>{editing ? t('applications.editTitle') : t('applications.addTitle')}</DialogTitle>

        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('applications.company')} *</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Digisol Group" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>{t('applications.role')} *</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('applications.date')}</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('applications.status')}</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{t(`applications.status_${s}`)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('applications.applicationUrl')}</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." type="url" />
          </div>

          {/* Document selector */}
          {docs.length > 0 && (
            <div className="space-y-1.5">
              <Label>{t('applications.linkDocuments')}</Label>
              <div className="border border-border rounded-lg divide-y divide-border max-h-40 overflow-y-auto">
                {docs.map((doc) => (
                  <label key={doc.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={linkedIds.includes(doc.id)}
                      onChange={() => toggleDoc(doc.id)}
                      className="rounded"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>{t('applications.notes')}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 500))}
              placeholder={t('applications.notesPlaceholder')}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">{notes.length}/500</p>
          </div>

          <div className="flex gap-2 pt-1">
            <Button className="flex-1" onClick={() => void handleSave()} disabled={saving || !company.trim() || !role.trim()}>
              {saving ? t('common.saving') : t('common.save')}
            </Button>
            <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
