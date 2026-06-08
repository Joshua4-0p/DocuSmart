export { HorizonTemplate } from './HorizonTemplate'
export { CleanSlateTemplate } from './CleanSlateTemplate'
export { BlueprintTemplate } from './BlueprintTemplate'
export { SidebarProTemplate } from './SidebarProTemplate'
export { MosaicTemplate } from './MosaicTemplate'
export { NoirTemplate } from './NoirTemplate'

import type { BuilderState } from '../../types/document'
import * as React from 'react'

import { HorizonTemplate } from './HorizonTemplate'
import { CleanSlateTemplate } from './CleanSlateTemplate'
import { BlueprintTemplate } from './BlueprintTemplate'
import { SidebarProTemplate } from './SidebarProTemplate'
import { MosaicTemplate } from './MosaicTemplate'
import { NoirTemplate } from './NoirTemplate'

type TemplateComponent = React.ComponentType<{ state: BuilderState; scale?: number }>

const TEMPLATE_MAP: Record<string, TemplateComponent> = {
  'horizon':     HorizonTemplate,
  'clean-slate': CleanSlateTemplate,
  'blueprint':   BlueprintTemplate,
  'sidebar-pro': SidebarProTemplate,
  'mosaic':      MosaicTemplate,
  'noir':        NoirTemplate,
}

export function getTemplateComponent(templateId: string): TemplateComponent {
  return TEMPLATE_MAP[templateId] ?? HorizonTemplate
}
