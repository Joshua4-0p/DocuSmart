# Phase 4 — Template Gallery
## Frontend Implementation Plan

> **Scope:** All 6 CV templates fully implemented and rendered, template gallery page, colour picker, font pairing selector, spacing controls, and template switching within the builder.
> **Prerequisite:** Phase 3 complete. Horizon template already exists.

---

## Requirements Covered

| ID | Description | Priority |
|----|-------------|----------|
| FR-033 | 6 templates: Horizon, Sidebar Pro, Clean Slate, Blueprint, Mosaic, Noir. Free: Horizon + Clean Slate + Blueprint. Pro: all 6. | HIGH |
| FR-034 | 6 accent colours per template, live preview updates on change | HIGH |
| FR-035 | 5 font pairings per template | MEDIUM |
| FR-036 | 3 spacing options: Compact / Normal / Spacious | MEDIUM |
| FR-037 | Template switching at any builder step, no data loss | HIGH |
| UI-008 | Template gallery previews show user's own name and primary job title | HIGH |

---

## Route Map

```
/templates                         → Template gallery (public browsing + authenticated customisation)
/builder/:documentId?step=template → Template selection step within builder
```

---

## Pages

---

### 1. Template Gallery Page

**Route:** `/templates`
**Layout:** `<AppLayout>` for authenticated users; `<PublicLayout>` for guests (same content, different nav)
**Purpose:** Let users browse all templates, preview with their own data, and select a template to start building. Also serves as a public marketing page for template variety.

#### URL structure
- `/templates` → shows all templates
- `/templates?category=simple` → filtered view
- `/templates/:slug` → individual template detail page

#### Page Header
- H1: "Professional CV Templates"
- Subtitle: "Choose from 6 professionally designed templates. ATS-optimised. Works in French and English."
- For authenticated users: "Your current template: **[Template Name]**" indicator

#### Category Filter Tabs
- Tabs: All | Simple | Modern | Creative | ATS-Optimised
- Hash-anchor based or URL param-based navigation
- Active tab: blue underline + blue text
- Tab bar is sticky below the page header on scroll

#### Template Cards Grid
- 3-col desktop, 2-col tablet, 1-col mobile
- Card structure:
  ```
  ┌─────────────────────────────┐
  │                             │
  │   [Template Preview Image]  │  ← 3:4 aspect ratio (A4 portrait)
  │                             │
  ├─────────────────────────────┤
  │  Template Name         [🔒] │  ← 🔒 shown for Pro-only templates for Free users
  │  Simple · ATS-Safe          │  ← Tags row
  │                             │
  │  [Use This Template]        │  ← Primary action button
  │  [Preview →]                │  ← Secondary action link
  └─────────────────────────────┘
  ```

#### Template Preview Images (UI-008)
- **Authenticated users:** Template thumbnails are dynamically generated/pre-rendered with the user's own first name and professional title
  - Implementation: template thumbnail is a React component rendered in a canvas or iframe, captured as an image
  - For Phase 4 MVP: use pre-rendered static thumbnails per template + apply the user's name as a text overlay on the thumbnail image using Canvas API
- **Guest users:** Show template thumbnails with placeholder "John Doe, Software Engineer" data

#### Hover State on Template Card
- Card lifts slightly (shadow + 2px translate-y)
- Template thumbnail animates to "Use This Template" overlay:
  - Semi-transparent overlay appears
  - Two buttons: "Use Template" (blue) | "Preview" (ghost)

#### Pro Template Lock State (FR-033)
- Noir and Sidebar Pro (Pro only): card shows a subtle lock icon (🔒) in the top-right corner
- Card is still visible and clickable
- On "Use Template" click: upgrade prompt modal instead of template selection
- Visual: card has a slightly reduced opacity (90%) with a "Pro" badge in top-right

#### Colour Preview Switcher on Gallery Card (FR-034)
- Below each template card: 6 colour dot swatches
- Clicking a dot updates the thumbnail to show that accent colour variant (client-side CSS variable swap)
- The 6 accent colours per template:
  1. Navy (`#1E3A5F`) — default
  2. Teal (`#0D9488`)
  3. Purple (`#7C3AED`)
  4. Coral (`#E11D48`)
  5. Olive (`#4D7C0F`)
  6. Charcoal/Black (`#1A1A1A`)

---

### 2. Individual Template Detail Page

**Route:** `/templates/:slug` (e.g., `/templates/horizon`)
**Layout:** `<PublicLayout>` or `<AppLayout>`

#### Layout
- Full-width top: large template preview (left 55%) + customisation panel (right 45%)
- Below: template description, features list, sample CVs using this template

#### Left — Large Preview
- A4-sized preview panel showing the template at ~50% scale
- Changes in real-time as user adjusts customisations on the right
- Full-screen preview button

#### Right — Customisation Panel
**Accent Colour (FR-034)**
```
Accent Colour
○ Navy   ● Teal   ○ Purple   ○ Coral   ○ Olive   ○ Black
(colour swatches — 28px circles)
```

**Font Pairing (FR-035)**
```
Font Pairing
(dropdown or visual selector)
• Modern Sans     —  Inter / Inter
• Classic Serif   —  Playfair Display / Lato
• Tech Mono       —  Space Mono / Inter
• Elegant         —  Cormorant Garamond / Nunito
• Compact         —  DM Sans / DM Sans
```
Show a short "Aa" preview of each pairing

**Spacing (FR-036)**
```
Spacing
[ Compact ]  [ Normal ]  [ Spacious ]
(pill toggle group)
```
Brief description below: "Normal spacing is recommended for most applications"

**Action**
- "Use This Template →" (blue, large) — for authenticated users
- "Get Started Free →" — for guest users → `/register`

---

### 3. Template System Architecture

Build each template as a standalone React component that accepts a `CVData` prop.

#### Template Interface
```ts
interface CVData {
  personal: PersonalDetails
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: SkillEntry[]
  projects: ProjectEntry[]
  certifications: CertEntry[]
  volunteer: VolunteerEntry[]
  publications: PublicationEntry[]
  languages: LanguageEntry[]
  references: ReferenceEntry[]
  sectionOrder: string[]
  settings: {
    accentColor: string    // hex value
    fontPairing: FontPairing
    spacing: 'compact' | 'normal' | 'spacious'
    language: 'en' | 'fr'
    showPhoto: boolean
    cameroonianFormat: boolean
  }
}
```

#### Template Component Structure
```
/src/components/templates/
  ├── index.ts                  — exports all templates
  ├── BaseTemplate.tsx          — shared layout primitives (A4 sizing, margins)
  ├── horizon/
  │   ├── HorizonTemplate.tsx
  │   └── horizon.styles.ts
  ├── clean-slate/
  │   ├── CleanSlateTemplate.tsx
  │   └── clean-slate.styles.ts
  ├── blueprint/
  │   ├── BlueprintTemplate.tsx
  │   └── blueprint.styles.ts
  ├── sidebar-pro/
  │   ├── SidebarProTemplate.tsx
  │   └── sidebar-pro.styles.ts
  ├── mosaic/
  │   ├── MosaicTemplate.tsx
  │   └── mosaic.styles.ts
  └── noir/
      ├── NoirTemplate.tsx
      └── noir.styles.ts
```

#### Template Styling Constraint (critical for PDF)
Templates must use **inline styles** or **CSS variables injected at component level**, NOT Tailwind utility classes. Reason: Puppeteer renders templates server-side and cannot use Tailwind's JIT-compiled CSS. All template styles must be self-contained.

Use a `useTemplateStyles(settings)` hook that returns a style object based on `accentColor`, `fontPairing`, and `spacing`.

---

### 4. The 6 Templates

Each template must satisfy:
- A4 format (794px × 1123px at 96dpi base)
- PDF-safe: all text as real text (no text-in-images), for ATS compatibility
- Supports all 6 accent colours (CSS variable `--accent`)
- Supports all 5 font pairings (CSS `@import` for web fonts + fallback stack)
- Supports 3 spacing modes (CSS variable `--spacing-unit`)
- Supports dark section variants where applicable (e.g., dark header)
- Handles optional sections gracefully (no empty whitespace when section excluded)
- Handles bilingual section labels (FR/EN)

---

#### Template A — Horizon (Free)
**Vibe:** Clean, open, professional. Best for: all industries.
**Layout:** Full-width single column.
```
┌──────────────────────────────────────┐
│  [NAME]                              │  ← Name (large, near-black)
│  Job Title                           │  ← Title (accent color)
│  ─────────────────────────────────   │
│  📧 email · 📞 phone · 🌐 website    │  ← Contact row (icons)
├──────────────────────────────────────┤
│  PROFESSIONAL SUMMARY                │  ← Section label (small caps, accent)
│  Summary text...                     │
├──────────────────────────────────────┤
│  WORK EXPERIENCE                     │
│  Job Title · Company         Dates   │
│  • Bullet point                      │
│  • Bullet point                      │
├──────────────────────────────────────┤
│  EDUCATION                           │
│  Degree · Institution         Dates  │
│  GPA: X/20                           │
├──────────────────────────────────────┤
│  SKILLS    LANGUAGES    CERTIFICATIONS│ ← 3-col bottom row
└──────────────────────────────────────┘
```
- ATS-safe: fully parseable text, no columns for main content
- Accent colour used for: section labels, job title, dividers

---

#### Template B — Clean Slate (Free)
**Vibe:** Minimalist, typographic, zero-decoration. Best for: finance, law, academia.
**Layout:** Single column, no accent color in sections — uses font weight and spacing only.
```
┌──────────────────────────────────────┐
│  FIRSTNAME LASTNAME                  │  ← All caps, letter-spaced
│  Job Title              email/phone  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │  ← Full-width rule (accent color)
├──────────────────────────────────────┤
│  EXPERIENCE                          │  ← Small caps, full-width underline
│  Company Name                 DATES  │
│  Job Title                           │
│  ─────────────────────────────────   │
│  • Bullet                            │
├──────────────────────────────────────┤
│  EDUCATION                           │
│  ... (same pattern)                  │
├──────────────────────────────────────┤
│  SKILLS & COMPETENCIES               │
│  Technical:  skill · skill · skill   │
│  Languages:  French (Native), Eng... │
└──────────────────────────────────────┘
```
- ATS-safe: plainest possible layout
- No icons, no graphics, maximum ATS compatibility

---

#### Template C — Blueprint (Free)
**Vibe:** Structured, grid-based, clear hierarchy. Best for: engineering, IT, technical roles.
**Layout:** Two-column (left sidebar 30% + main content 70%).
```
┌────────────┬─────────────────────────┐
│ [Photo]    │  FIRSTNAME LASTNAME     │
│            │  Job Title              │
│  ─────     │  ─────────────────────  │
│  CONTACT   │  SUMMARY                │
│  email     │  Summary text...        │
│  phone     │                         │
│  city      │  ─────────────────────  │
│  ─────     │  EXPERIENCE             │
│  SKILLS    │  Title · Company · Date │
│  skill●●●  │  • Bullet               │
│  skill●●○  │  • Bullet               │
│  ─────     │                         │
│  LANGUAGES │  ─────────────────────  │
│  EN  ████  │  EDUCATION              │
│  FR  █████ │  Degree · Institution   │
└────────────┴─────────────────────────┘
```
- Left column uses accent colour as background (at ~15% opacity)
- Skills shown as filled dot bars (●●●○○ = 3/5 proficiency)
- ATS-safe: rendered as real text, column order handled by reading order

---

#### Template D — Sidebar Pro (Pro only)
**Vibe:** Modern, bold sidebar, executive presence. Best for: management, sales, marketing.
**Layout:** Wide two-column (left sidebar 35% + main 65%) with a solid-colour sidebar.
```
┌──────────────┬──────────────────────┐
│[solid accent]│  FIRSTNAME LASTNAME  │
│              │  Job Title           │
│  Name large  │                      │
│  Title       │  EXPERIENCE          │
│  ─────       │  Title · Company     │
│  CONTACT     │  Dates               │
│  email       │  • Impact bullet     │
│  phone       │                      │
│  ─────       │  EDUCATION           │
│  SKILLS      │  Degree · School     │
│  Skill ████  │                      │
│  Skill ███░  │  PROJECTS            │
│  ─────       │  Project · Tech      │
│  LANGUAGES   │                      │
│  FR ●●●●●    │                      │
└──────────────┴──────────────────────┘
```
- Solid accent-coloured sidebar (left) with white text
- Right column: white background, dark text, clean typography
- Pro-only badge in gallery

---

#### Template E — Mosaic (Pro only)
**Vibe:** Contemporary, creative-professional, modular. Best for: design, product, startups.
**Layout:** Creative mixed layout — full-width header band + two-column below.
```
┌──────────────────────────────────────┐
│  FIRSTNAME LASTNAME · Job Title      │  ← Full-width accent header
│  email | phone | city | linkedin     │
├────────────────────────────┬─────────┤
│  SUMMARY                   │ SKILLS  │
│  Summary text...           │ skill   │
│                            │ skill   │
├────────────────────────────┤ skill   │
│  EXPERIENCE                │ ─────── │
│  Title · Company   Dates   │ CERTIF  │
│  • Bullet                  │ cert 1  │
│  • Bullet                  │ cert 2  │
├────────────────────────────┤ ─────── │
│  EDUCATION                 │ LANGS   │
│  Degree · School           │ FR ●●●  │
└────────────────────────────┴─────────┘
```
- Header band: solid accent colour, white text
- Below: asymmetric two-column (70% left, 30% right sidebar)
- Pro-only

---

#### Template F — Noir (Pro only)
**Vibe:** Bold, premium, high-impact. Best for: executive roles, MBA applications.
**Layout:** Single column with dramatic typographic hierarchy.
```
┌──────────────────────────────────────┐
│                                      │
│  FIRSTNAME LASTNAME                  │  ← Very large, thin weight
│  ─────────────────────── ●───────── │  ← Thin rule + accent dot
│  Job Title                           │  ← Accent color
│  email · phone · city · linkedin     │  ← Small, muted
│                                      │
├──────────────────────────────────────┤
│  EXPERIENCE                          │  ← Section: small caps, letter-spaced
│                                      │
│  JOB TITLE                           │  ← Role in bold
│  Company Name · Location     Dates   │
│                                      │
│  • Impact bullet with result         │
│  • Impact bullet with result         │
│                                      │
├──────────────────────────────────────┤
│  EDUCATION                           │
│  ... same typography                 │
├──────────────────────────────────────┤
│  SKILLS ·  LANGUAGES · CERTS         │  ← Inline compressed section
└──────────────────────────────────────┘
```
- Near-black background option OR pure white — controlled by accent colour choice
- Typography-driven: relies on size hierarchy and whitespace
- Pro-only

---

### 5. Template Switching in Builder (FR-037)

**Target:** `/builder/:documentId` — step sidebar + dedicated template step

#### Where Template Can Be Changed
- Sidebar bottom: "Template: Horizon" link → opens template selector panel
- Step 1 (Document Type): also shows current template with change option

#### Template Selector Panel (in-builder)
- Right-side slide-over (or inline within step 1)
- Shows all 6 template thumbnails in 2-col grid
- Pro-only templates show lock if user is Free tier
- Current template highlighted with blue border
- Clicking a different template:
  1. Instantly switches preview (no data loss — FR-037)
  2. Updates `BuilderState.templateId`
  3. Shows brief "Template changed" toast

#### Data Safety on Switch (FR-037)
- All user-entered text, AI content, section selections remain unchanged
- Only the visual rendering component swaps
- Test: switch template at every step and verify all data persists

---

### 6. Customisation Panel in Builder

**Target:** Available in builder after template selection (sidebar bottom section)

#### Panel Location
- Collapsible section at the bottom of the left sidebar in the builder
- Label: "Customise Template"
- Click to expand/collapse

#### Controls (mirroring template detail page)

**Accent Colour (FR-034)**
- 6 colour swatches (28px circles)
- Selected swatch has white checkmark ✓ in center
- Changes reflected in live preview within 300ms (no debounce needed — instant CSS variable swap)

**Font Pairing (FR-035)**
- Compact dropdown showing "Aa Modern Sans" style preview text
- Options: Modern Sans, Classic Serif, Tech Mono, Elegant, Compact
- Font change triggers template re-render (≤1s — NFR-002)

**Spacing (FR-036)**
- 3-button pill group: Compact | Normal | Spacious
- Normal selected by default
- Spacing change: template adjusts `line-height`, `margin-bottom` between sections

#### Preview Update on Customisation
- All customisation changes are real-time (≤300ms for color/spacing, ≤1s for font — fonts may need to load)
- Fonts are preloaded via `<link rel="preload">` for the 5 most common pairings
- Show "Loading font…" tiny indicator if font not yet loaded

---

## Shared Components for Phase 4

| Component | Description |
|-----------|-------------|
| `<TemplateCard>` | Template gallery card with thumbnail, hover overlay, colour swatches |
| `<TemplatePreviewLarge>` | Full-size template preview for detail page and builder |
| `<AccentColourPicker>` | 6-dot colour swatch selector |
| `<FontPairingSelector>` | Dropdown or grid with "Aa" previews |
| `<SpacingToggle>` | 3-way pill: Compact / Normal / Spacious |
| `<ProTemplateLock>` | Lock badge + upgrade prompt for Pro-only templates |
| `<TemplateSwitcherPanel>` | In-builder slide-over for template switching |
| `<CustomisationPanel>` | Sidebar collapsible section with colour/font/spacing controls |
| `<TemplateGalleryFilters>` | Category filter tab bar |

---

## Implementation Notes

### Template Rendering for PDF vs. Screen
- **Screen rendering:** React component mounted in DOM, uses CSS
- **PDF rendering:** Same component sent to backend, rendered by Puppeteer
  - Templates use inline styles, not Tailwind or external CSS
  - Web fonts loaded by Puppeteer via `page.addStyleTag` with Google Fonts URL
  - `@media print` overrides applied where needed

### Font Loading
- Pre-defined 5 pairings use only Google Fonts (free, reliable CDN)
- Fonts loaded with `@fontsource` npm packages where available:
  - Inter (already installed)
  - Playfair Display: `@fontsource/playfair-display`
  - Space Mono: `@fontsource/space-mono`
  - Cormorant Garamond: `@fontsource/cormorant-garamond`
  - DM Sans: `@fontsource/dm-sans`
  - Nunito: `@fontsource/nunito`
  - Lato: `@fontsource/lato`

### ATS Compatibility
- Clean Slate and Horizon templates: verified ATS-safe
  - No multi-column layouts (single column main content)
  - No text inside SVG or image elements
  - Logical reading order (top-to-bottom)
  - Section headings as real text (`<h2>`, `<h3>`) not styled divs
  - Add data attribute `data-ats-safe="true"` to these templates for filtering

### Template Thumbnail Generation (UI-008)
For showing user's name in gallery thumbnails:
- Server-side: when user visits gallery, backend generates personalised thumbnails on demand and caches them (5-minute TTL)
- Client-side fallback: React renders miniature template component in a hidden div, captured via `html2canvas` or similar
- For Phase 4 MVP: use pre-generated static thumbnails with user name overlaid via CSS absolute positioning (simpler, ship faster)

### Feature Gating (FR-033)
- Check `user.plan` from auth store
- Free tier: `templateId` must be one of `['horizon', 'clean-slate', 'blueprint']`
- If Free user tries to use `sidebar-pro`, `mosaic`, or `noir`: `<UpgradePromptModal>` appears (built in Phase 6)
- In Phase 4: show the modal but route to a placeholder `/pricing` page
