import { FileText, ExternalLink, Edit2, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { ApplicationEntry } from '@/types/application'
import type { DocDocument } from '@/lib/api/document.api'

interface Props {
  app: ApplicationEntry
  docs: DocDocument[]
  onEdit: (app: ApplicationEntry) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

function fmt(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ApplicationCard({ app, docs, onEdit, onDelete, onView }: Props) {
  const { t } = useTranslation()
  const linked = docs.filter((d) => app.linkedDocumentIds.includes(d.id))

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: app.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  // Initials from company name
  const initials = app.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-card border border-border rounded-xl p-3.5 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      {/* Company row */}
      <div className="flex items-start gap-2.5 mb-2">
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{app.role}</p>
          <p className="text-xs text-muted-foreground truncate">{app.company}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-2.5">
        {t('applications.appliedOn')} {fmt(app.applicationDate)}
      </p>

      {/* Linked documents */}
      {linked.length > 0 && (
        <div className="border-t border-border pt-2 mb-2.5 space-y-1">
          {linked.slice(0, 2).map((doc) => (
            <div key={doc.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="size-3 shrink-0" />
              <span className="truncate">{doc.title}</span>
            </div>
          ))}
          {linked.length > 2 && (
            <p className="text-xs text-muted-foreground">+{linked.length - 2} more</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-1 border-t border-border">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onView(app.id) }}
          className="flex-1 text-xs text-primary hover:underline flex items-center gap-1 justify-center py-1"
        >
          <ExternalLink className="size-3" />
          {t('common.view')}
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onEdit(app) }}
          className="p-1.5 rounded hover:bg-muted transition-colors"
        >
          <Edit2 className="size-3 text-muted-foreground" />
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete(app.id) }}
          className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="size-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
