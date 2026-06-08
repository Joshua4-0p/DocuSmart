export type FontPairing = 'modern-sans' | 'classic-serif' | 'tech-mono' | 'elegant' | 'compact'
export type SpacingMode = 'compact' | 'normal' | 'spacious'
export type AccentColorKey = 'navy' | 'teal' | 'purple' | 'coral' | 'olive' | 'charcoal'

// ── Accent colors ────────────────────────────────────────────────────────────

export interface AccentColorDef {
  id: AccentColorKey
  hex: string
  label: string
}

export const ACCENT_COLORS: AccentColorDef[] = [
  { id: 'navy',     hex: '#1E3A5F', label: 'Navy' },
  { id: 'teal',     hex: '#0D9488', label: 'Teal' },
  { id: 'purple',   hex: '#7C3AED', label: 'Purple' },
  { id: 'coral',    hex: '#E11D48', label: 'Coral' },
  { id: 'olive',    hex: '#4D7C0F', label: 'Olive' },
  { id: 'charcoal', hex: '#1A1A1A', label: 'Charcoal' },
]

const ACCENT_MAP: Record<string, string> = Object.fromEntries(
  ACCENT_COLORS.map((c) => [c.id, c.hex]),
)

export function resolveAccentColor(key?: string): string {
  if (!key) return ACCENT_MAP.navy
  return ACCENT_MAP[key] ?? key // pass-through if already a hex
}

// ── Font pairings ────────────────────────────────────────────────────────────

export interface FontPairingDef {
  id: FontPairing
  label: string
  heading: string
  body: string
  googleFontsParam?: string
}

export const FONT_PAIRINGS: FontPairingDef[] = [
  {
    id: 'modern-sans',
    label: 'Modern Sans',
    heading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    body:    "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  {
    id: 'classic-serif',
    label: 'Classic Serif',
    heading: "'Playfair Display', Georgia, 'Times New Roman', serif",
    body:    "'Lato', 'Helvetica Neue', Arial, sans-serif",
    googleFontsParam: 'Playfair+Display:wght@700&family=Lato:wght@400;700',
  },
  {
    id: 'tech-mono',
    label: 'Tech Mono',
    heading: "'Space Mono', 'Courier New', monospace",
    body:    "'Inter', 'Helvetica Neue', Arial, sans-serif",
    googleFontsParam: 'Space+Mono:wght@400;700',
  },
  {
    id: 'elegant',
    label: 'Elegant',
    heading: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    body:    "'Nunito', 'Helvetica Neue', Arial, sans-serif",
    googleFontsParam: 'Cormorant+Garamond:wght@400;600&family=Nunito:wght@400;700',
  },
  {
    id: 'compact',
    label: 'Compact',
    heading: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    body:    "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    googleFontsParam: 'DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700',
  },
]

const FONT_MAP = Object.fromEntries(FONT_PAIRINGS.map((f) => [f.id, f]))

export function resolveFontPairing(id?: string): FontPairingDef {
  return FONT_MAP[id ?? 'modern-sans'] ?? FONT_MAP['modern-sans']
}

export function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// ── Spacing ──────────────────────────────────────────────────────────────────

export const SPACING_SCALE: Record<SpacingMode, number> = {
  compact:  0.72,
  normal:   1.0,
  spacious: 1.35,
}

export function resolveSpacingMultiplier(mode?: string): number {
  return SPACING_SCALE[(mode as SpacingMode) ?? 'normal'] ?? 1.0
}

// ── Section labels (bilingual) ───────────────────────────────────────────────

export function getSectionLabels(lang: 'en' | 'fr'): Record<string, string> {
  if (lang === 'fr') {
    return {
      summary:        'Résumé Professionnel',
      experience:     'Expérience Professionnelle',
      education:      'Formation',
      skills:         'Compétences',
      projects:       'Projets',
      certifications: 'Certifications',
      volunteer:      'Bénévolat',
      publications:   'Publications',
      languages:      'Langues',
      references:     'Références',
    }
  }
  return {
    summary:        'Professional Summary',
    experience:     'Work Experience',
    education:      'Education',
    skills:         'Skills',
    projects:       'Projects',
    certifications: 'Certifications',
    volunteer:      'Volunteer Work',
    publications:   'Publications',
    languages:      'Languages',
    references:     'References',
  }
}

// ── Template catalog ─────────────────────────────────────────────────────────

export interface TemplateInfo {
  id: string
  name: string
  category: 'simple' | 'modern' | 'creative' | 'ats-optimised'
  free: boolean
  tags: string[]
  description: string
  atsSafe?: boolean
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'horizon',
    name: 'Horizon',
    category: 'simple',
    free: true,
    tags: ['ATS-Safe', 'All Industries'],
    description: 'Clean, open, professional layout for all industries.',
    atsSafe: true,
  },
  {
    id: 'clean-slate',
    name: 'Clean Slate',
    category: 'simple',
    free: true,
    tags: ['ATS-Safe', 'Finance', 'Law', 'Academia'],
    description: 'Minimalist typographic layout with zero decoration.',
    atsSafe: true,
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    category: 'modern',
    free: true,
    tags: ['Two Column', 'Tech', 'IT', 'Engineering'],
    description: 'Structured two-column layout for technical roles.',
  },
  {
    id: 'sidebar-pro',
    name: 'Sidebar Pro',
    category: 'modern',
    free: false,
    tags: ['Pro', 'Management', 'Sales', 'Marketing'],
    description: 'Bold sidebar with executive presence.',
  },
  {
    id: 'mosaic',
    name: 'Mosaic',
    category: 'creative',
    free: false,
    tags: ['Pro', 'Creative', 'Design', 'Product'],
    description: 'Contemporary mixed layout for creative professionals.',
  },
  {
    id: 'noir',
    name: 'Noir',
    category: 'creative',
    free: false,
    tags: ['Pro', 'Executive', 'MBA', 'Leadership'],
    description: 'Dramatic typographic hierarchy for premium applications.',
  },
  // ── Modern Resume Templates ──────────────────────────────────────────────────
  {
    id: 'atlantic-blue',
    name: 'Atlantic Blue',
    category: 'modern',
    free: true,
    tags: ['Photo', 'Two Column', 'Contemporary', 'Corporate'],
    description: 'Dark accent sidebar with circular photo and skills progress bars.',
  },
  {
    id: 'mercury-flow',
    name: 'Mercury Flow',
    category: 'modern',
    free: true,
    tags: ['Photo', 'Single Column', 'Tech', 'Contemporary'],
    description: 'Single column with photo header, date gutter, and accent chip skills.',
  },
  {
    id: 'saffron-line',
    name: 'Saffron Line',
    category: 'modern',
    free: true,
    tags: ['Photo', 'Two Column', 'Professional', 'Contemporary'],
    description: 'Full-width header with accent bottom border, clean two-column body.',
  },
  {
    id: 'quicksilver',
    name: 'Quicksilver',
    category: 'modern',
    free: true,
    tags: ['Photo', 'Geometric', 'Bold', 'Contemporary'],
    description: 'Geometric diagonal header with accent panel and square photo.',
  },
  {
    id: 'hunter-green',
    name: 'Hunter Green',
    category: 'modern',
    free: true,
    tags: ['Photo', 'Sidebar', 'Nature', 'Contemporary'],
    description: 'Solid accent sidebar with centered circular photo and skill chips.',
  },
  {
    id: 'grey-goose',
    name: 'Grey Goose',
    category: 'modern',
    free: true,
    tags: ['Photo', 'Centered', 'Minimal', 'Contemporary'],
    description: 'Elegant centered layout with white card body and dot-line separator.',
  },
  {
    id: 'cobalt-edge',
    name: 'Cobalt Edge',
    category: 'modern',
    free: false,
    tags: ['Pro', 'Photo', 'Two Column', 'Bold', 'Contemporary'],
    description: 'Full-width accent header band with two-column body and dot skill indicators.',
  },
  {
    id: 'blue-neon',
    name: 'Blue Neon',
    category: 'creative',
    free: false,
    tags: ['Pro', 'Photo', 'Dark', 'Electric', 'Contemporary'],
    description: 'Dark background with electric accent elements and glowing photo ring.',
  },
  {
    id: 'coral-navy',
    name: 'Coral Navy',
    category: 'modern',
    free: false,
    tags: ['Pro', 'Photo', 'Two Column', 'Navy', 'Contemporary'],
    description: 'Accent top banner with dark navy contact bar and navy sidebar.',
  },
  {
    id: 'black-pattern',
    name: 'Black Pattern',
    category: 'creative',
    free: false,
    tags: ['Pro', 'Photo', 'Dark Sidebar', 'Bold', 'Contemporary'],
    description: 'Pure black sidebar with square photo, accent progress bars.',
  },
  {
    id: 'space',
    name: 'Space',
    category: 'creative',
    free: false,
    tags: ['Pro', 'Photo', 'Dark', 'Cosmic', 'Contemporary'],
    description: 'Dark cosmic aesthetic with glowing circular photo and accent chip skills.',
  },
  {
    id: 'plum-accent',
    name: 'Plum Accent',
    category: 'modern',
    free: false,
    tags: ['Pro', 'Photo', 'Sidebar', 'Rich', 'Contemporary'],
    description: 'Rich accent sidebar with circular photo and white-bar skill indicators.',
  },
]

export const FREE_TEMPLATE_IDS = TEMPLATES.filter((t) => t.free).map((t) => t.id)

export function getTemplateInfo(id: string): TemplateInfo {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
