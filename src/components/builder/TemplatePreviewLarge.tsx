import { getTemplateComponent } from '@/components/templates'
import { CoverLetterTemplate } from '@/components/templates/CoverLetterTemplate'
import type { BuilderState } from '@/types/document'

interface Props {
  state: BuilderState
  zoom?: number
}

export function TemplatePreviewLarge({ state, zoom = 0.55 }: Props) {
  const TemplateComponent =
    state.documentType === 'cover_letter'
      ? CoverLetterTemplate
      : getTemplateComponent(state.templateId)

  return (
    <div className="flex-1 overflow-auto bg-muted/30 p-6 flex justify-center">
      <div
        className="shadow-2xl rounded overflow-hidden"
        style={{ zoom, transformOrigin: 'top center' }}
      >
        <TemplateComponent state={state} scale={1} />
      </div>
    </div>
  )
}
