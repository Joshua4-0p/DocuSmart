export { HorizonTemplate } from './HorizonTemplate'
export { CleanSlateTemplate } from './CleanSlateTemplate'
export { BlueprintTemplate } from './BlueprintTemplate'
export { SidebarProTemplate } from './SidebarProTemplate'
export { MosaicTemplate } from './MosaicTemplate'
export { NoirTemplate } from './NoirTemplate'
export { AtlanticBlueTemplate } from './AtlanticBlueTemplate'
export { MercuryFlowTemplate } from './MercuryFlowTemplate'
export { SaffronLineTemplate } from './SaffronLineTemplate'
export { QuicksilverTemplate } from './QuicksilverTemplate'
export { HunterGreenTemplate } from './HunterGreenTemplate'
export { GreyGooseTemplate } from './GreyGooseTemplate'
export { CobaltEdgeTemplate } from './CobaltEdgeTemplate'
export { BlueNeonTemplate } from './BlueNeonTemplate'
export { CoralNavyTemplate } from './CoralNavyTemplate'
export { BlackPatternTemplate } from './BlackPatternTemplate'
export { SpaceTemplate } from './SpaceTemplate'
export { PlumAccentTemplate } from './PlumAccentTemplate'

import type { BuilderState } from '../../types/document'
import * as React from 'react'

import { HorizonTemplate } from './HorizonTemplate'
import { CleanSlateTemplate } from './CleanSlateTemplate'
import { BlueprintTemplate } from './BlueprintTemplate'
import { SidebarProTemplate } from './SidebarProTemplate'
import { MosaicTemplate } from './MosaicTemplate'
import { NoirTemplate } from './NoirTemplate'
import { AtlanticBlueTemplate } from './AtlanticBlueTemplate'
import { MercuryFlowTemplate } from './MercuryFlowTemplate'
import { SaffronLineTemplate } from './SaffronLineTemplate'
import { QuicksilverTemplate } from './QuicksilverTemplate'
import { HunterGreenTemplate } from './HunterGreenTemplate'
import { GreyGooseTemplate } from './GreyGooseTemplate'
import { CobaltEdgeTemplate } from './CobaltEdgeTemplate'
import { BlueNeonTemplate } from './BlueNeonTemplate'
import { CoralNavyTemplate } from './CoralNavyTemplate'
import { BlackPatternTemplate } from './BlackPatternTemplate'
import { SpaceTemplate } from './SpaceTemplate'
import { PlumAccentTemplate } from './PlumAccentTemplate'

type TemplateComponent = React.ComponentType<{ state: BuilderState; scale?: number }>

const TEMPLATE_MAP: Record<string, TemplateComponent> = {
  'horizon':        HorizonTemplate,
  'clean-slate':    CleanSlateTemplate,
  'blueprint':      BlueprintTemplate,
  'sidebar-pro':    SidebarProTemplate,
  'mosaic':         MosaicTemplate,
  'noir':           NoirTemplate,
  'atlantic-blue':  AtlanticBlueTemplate,
  'mercury-flow':   MercuryFlowTemplate,
  'saffron-line':   SaffronLineTemplate,
  'quicksilver':    QuicksilverTemplate,
  'hunter-green':   HunterGreenTemplate,
  'grey-goose':     GreyGooseTemplate,
  'cobalt-edge':    CobaltEdgeTemplate,
  'blue-neon':      BlueNeonTemplate,
  'coral-navy':     CoralNavyTemplate,
  'black-pattern':  BlackPatternTemplate,
  'space':          SpaceTemplate,
  'plum-accent':    PlumAccentTemplate,
}

export function getTemplateComponent(templateId: string): TemplateComponent {
  return TEMPLATE_MAP[templateId] ?? HorizonTemplate
}
