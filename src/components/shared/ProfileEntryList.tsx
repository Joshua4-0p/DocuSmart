import * as React from 'react'
import { Pencil, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { SaveIndicator } from '@/components/shared/SaveIndicator'
import { AddEntrySlideOver } from '@/components/shared/AddEntrySlideOver'
import { useTranslation } from 'react-i18next'

interface Entry {
  id: string
}

interface ProfileEntryListProps<T extends Entry> {
  sectionKey: string
  entries: T[]
  isLoading?: boolean
  onAdd: (data: unknown) => Promise<unknown>
  onEdit: (id: string, data: unknown) => Promise<unknown>
  onDelete: (id: string) => Promise<void>
  renderCard: (entry: T, onEdit: () => void, onDelete: () => void) => React.ReactNode
  renderForm: (defaultValues: Partial<T> | undefined, onSubmit: (d: unknown) => Promise<void>, onCancel: () => void) => React.ReactNode
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error'
}

export function ProfileEntryList<T extends Entry>({
  sectionKey,
  entries,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  renderCard,
  renderForm,
  saveStatus = 'idle',
}: ProfileEntryListProps<T>) {
  const { t } = useTranslation()
  const [slideOverOpen, setSlideOverOpen] = React.useState(false)
  const [editingEntry, setEditingEntry] = React.useState<T | undefined>()
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const sectionLabel = t(`profile.${sectionKey}`)

  const handleAddNew = () => {
    setEditingEntry(undefined)
    setSlideOverOpen(true)
  }

  const handleEdit = (entry: T) => {
    setEditingEntry(entry)
    setSlideOverOpen(true)
  }

  const handleFormSubmit = async (data: unknown) => {
    if (editingEntry) {
      await onEdit(editingEntry.id, data)
    } else {
      await onAdd(data)
    }
    setSlideOverOpen(false)
    setEditingEntry(undefined)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    try {
      await onDelete(deletingId)
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title={sectionLabel}
        breadcrumb={{ label: t('profile.title'), to: '/profile' }}
        actions={
          <div className="flex items-center gap-3">
            <SaveIndicator status={saveStatus} />
            <Button onClick={handleAddNew} disabled={isLoading}>
              {t('profile.addEntry', { section: sectionLabel })}
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<GripVertical className="size-10" />}
          title={`No ${sectionLabel.toLowerCase()} entries yet.`}
          actionLabel={t('profile.addEntry', { section: sectionLabel })}
          onAction={handleAddNew}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) =>
            renderCard(
              entry,
              () => handleEdit(entry),
              () => setDeletingId(entry.id),
            ),
          )}
        </div>
      )}

      <AddEntrySlideOver
        open={slideOverOpen}
        onClose={() => { setSlideOverOpen(false); setEditingEntry(undefined) }}
        title={editingEntry ? t('profile.editEntry', { section: sectionLabel }) : t('profile.addEntry', { section: sectionLabel })}
        footer={null}
      >
        {renderForm(
          editingEntry,
          handleFormSubmit,
          () => { setSlideOverOpen(false); setEditingEntry(undefined) },
        )}
      </AddEntrySlideOver>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => { if (!open) setDeletingId(null) }}
        title={t('profile.deleteConfirmTitle')}
        description={t('profile.deleteConfirmDesc')}
        confirmLabel={t('common.delete')}
        onConfirm={() => void handleDeleteConfirm()}
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  )
}

/* ── Reusable entry card shell ── */
interface EntryCardProps {
  title: string
  subtitle?: string
  dates?: string
  description?: string
  onEdit: () => void
  onDelete: () => void
  children?: React.ReactNode
}

export function EntryCard({ title, subtitle, dates, description, onEdit, onDelete, children }: EntryCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{title}</p>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              {dates && <p className="text-xs text-muted-foreground mt-0.5">{dates}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Edit">
                <Pencil className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onDelete} aria-label="Delete" className="text-destructive hover:text-destructive">
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
