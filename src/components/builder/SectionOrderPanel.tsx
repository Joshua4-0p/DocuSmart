import { RotateCcw, GripVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { DEFAULT_SECTION_ORDER, type SectionKey } from '@/types/document'

const SECTION_LABELS: Record<SectionKey, string> = {
  personal: 'Personal Details',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  volunteer: 'Volunteer',
  publications: 'Publications',
  languages: 'Languages',
  references: 'References',
}

function SortableRow({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-2 px-2 py-2 rounded-lg bg-card border border-border text-sm select-none',
        isDragging ? 'shadow-lg opacity-75 z-50' : 'hover:bg-muted/40',
      )}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors touch-none"
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${label}`}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex-1 text-xs font-medium truncate">{label}</span>
    </div>
  )
}

interface SectionOrderPanelProps {
  sections: string[]
  onChange: (newOrder: string[]) => void
}

export function SectionOrderPanel({ sections, onChange }: SectionOrderPanelProps) {
  const { t } = useTranslation()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIdx = sections.indexOf(String(active.id))
      const newIdx = sections.indexOf(String(over.id))
      onChange(arrayMove(sections, oldIdx, newIdx))
    }
  }

  const handleReset = () => {
    onChange([...DEFAULT_SECTION_ORDER])
  }

  return (
    <div className="p-3 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {t('builder.reorderSections')}
        </p>
        <button
          type="button"
          onClick={handleReset}
          title={t('builder.resetSectionOrder')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="size-3" />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mb-2">{t('builder.dragToReorder')}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1">
            {sections.map((key) => (
              <SortableRow
                key={key}
                id={key}
                label={SECTION_LABELS[key as SectionKey] ?? key}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
