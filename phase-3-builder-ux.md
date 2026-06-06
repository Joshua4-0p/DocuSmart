# Phase 3 — Builder UX
## Frontend Implementation Plan

> **Scope:** Full live split-screen preview with debounced rendering, section drag-to-reorder, completeness meter, bilingual toggle, mobile builder view, duplicate-and-adapt workflow, PDF/DOCX export polish, and offline profile sync.
> **Prerequisite:** Phase 2 complete. Builder wizard exists with AI integration.

---

## Requirements Covered

| ID | Description | Priority |
|----|-------------|----------|
| FR-022 | Drag-reorder sections; live preview updates immediately | MEDIUM |
| FR-023 | Completeness meter 0–100 with ≥3 improvement suggestions | MEDIUM |
| FR-027 | Native bilingual generation; language switch = full re-generation | HIGH |
| FR-038 | PDF export — pixel-accurate, A4, embedded fonts | HIGH |
| FR-039 | DOCX export — Word 2016+ compatible | HIGH |
| FR-043 | Duplicate document + open copy in builder | HIGH |
| FR-045 | Companion doc prompt after CV generation | MEDIUM |
| FR-053 | Cameroonian university names autocomplete | MEDIUM |
| FR-054 | Mobile-first responsive builder, min 320px viewport | HIGH |
| FR-055 | Offline profile editing + auto-sync on reconnect | MEDIUM |
| UI-002 | Split-screen ≥768px: form left, preview right (debounced ≤1s) | HIGH |
| UI-003 | <768px: single column, form/preview toggle | HIGH |
| UI-006 | Live preview updates within 1 second of user pausing input | HIGH |
| UI-007 | Completeness meter real-time with 3 specific suggestions | MEDIUM |
| NFR-002 | Live preview render ≤1s (debounced 500ms) | HIGH |
| NFR-025 | Human-readable error messages in user's language | HIGH |
| NFR-026 | Contextual onboarding tooltips in builder | MEDIUM |
| NFR-028 | Auto-save optimistic UI, graceful failure recovery | HIGH |
| NFR-029 | No data loss on refresh / network disconnect | HIGH |

---

## Route Map

No new routes in Phase 3. Enhancements are applied to existing routes:

```
/documents                   → Enhanced with duplicate action
/builder/:documentId?step=N  → Enhanced with all Phase 3 UX improvements
/profile/*                   → Enhanced with offline sync + Cameroonian autocomplete
```

---

## Enhancements by Area

---

## 1. Full Split-Screen Live Preview

**Target:** `/builder/:documentId` — right panel
**FR:** UI-002, UI-006, NFR-002

### Implementation

The Phase 2 preview was a basic placeholder. Phase 3 delivers the full polished experience.

#### Preview Panel Architecture

```
┌─────────────────────────────────────────┐
│  [Template: Horizon ▾]  [Scale: 80%]    │  ← Preview toolbar
├─────────────────────────────────────────┤
│                                         │
│         ┌──────────────────┐            │
│         │   A4 Document    │            │  ← Scaled A4 frame
│         │   (Horizon CV)   │            │
│         │                  │            │
│         │   [content]      │            │
│         └──────────────────┘            │
│                                         │
│  [Page 1 of 1]  ◀  ▶                   │  ← Page navigation
└─────────────────────────────────────────┘
```

#### Debounced Update (UI-006, NFR-002)
```ts
// Debounce profile edits before triggering re-render
const debouncedContent = useDebounce(builderState.content, 500)

useEffect(() => {
  renderPreview(debouncedContent) // triggers re-render of HorizonTemplate
}, [debouncedContent])
```
- Maximum 1 second from user stopping input to preview reflecting the change
- Use `React.memo` on `<HorizonTemplate>` with deep equality check to avoid unnecessary re-renders
- Apply CSS `will-change: transform` to preview container for GPU compositing

#### Preview Scaling
- Calculate scale factor: `panelWidth / 794px` (A4 width in pixels at 96dpi)
- Clamp between 0.4 and 1.0
- Apply `transform: scale(factor)` with `transform-origin: top center`
- Show scale percentage in preview toolbar
- User can manually adjust scale via a slider (50%–100%)

#### Rendering States
- **Idle:** Clean rendered template, no indicators
- **Updating (debouncing):** Subtle top-edge blue progress bar (like NProgress)
- **Error:** "Preview unavailable" overlay with refresh button — document data is NOT lost

#### Preview Toolbar (above the preview panel)
- Template name dropdown (placeholder — activates in Phase 4): "Horizon"
- Scale control (slider or +/- buttons)
- "Full screen preview" icon button → opens preview in a modal dialog at larger size
- Page number indicator (when document > 1 page)

---

## 2. Section Drag-to-Reorder

**Target:** All section toggle steps in the builder (steps 3–9) and a dedicated "Section Order" panel
**FR:** FR-022

### Drag-to-Reorder in Each Step
- Each toggled-ON section card has a drag handle (⠿ icon, left or right edge)
- Use HTML5 drag-and-drop with a polished drop zone indicator:
  - Dragged card lifts (shadow + slight scale)
  - Drop zone shows blue insertion line
  - Adjacent cards shift to make room (smooth animation — 200ms ease)
- Keyboard alternative: Up/Down arrow buttons on each card (accessible alternative — UI-004)
- Reorder persists to `BuilderState.sectionOrder` and immediately updates preview

### Section Order Panel (dedicated UI)
Add a "Section Order" panel accessible from the step sidebar:
- Shows all enabled sections as draggable rows in their current order
- Same drag mechanics as within steps, but shows all sections together
- "Reset to AI default" button (restores context-aware ordering from FR-030)

### Preview Update on Reorder
- Reordering triggers immediate preview re-render (no debounce needed — UI-006)
- Smooth section slide animation in preview as sections move

---

## 3. Completeness Meter (Full Implementation)

**Target:** Builder step sidebar
**FR:** FR-023, UI-007

### Visual Component
```
  Completeness
  ┌──────────────────────────┐
  │   [Circular progress]    │
  │        78%               │
  │   "Good — nearly there!" │
  └──────────────────────────┘

  Suggestions:
  ○ Add a measurable result to your
    Software Engineer role at Banque Atlantique
  ○ Include at least one certification
  ○ Add 2 more keywords: "Agile", "REST API"
```

### Scoring Formula
```
Base score (0–60 pts):
  - Professional Summary populated: 10 pts
  - Work Experience (≥1 entry with bullets): 15 pts
  - Education (≥1 entry): 10 pts
  - Skills (≥5 skills): 10 pts
  - Contact info complete: 5 pts
  - Photo included: 5 pts (if applicable to template)
  - References included: 5 pts

Content quality (0–25 pts):
  - Average bullet length > 80 chars: 5 pts
  - At least 1 AI rewrite used: 5 pts
  - Professional summary AI-generated: 5 pts
  - At least 3 quantified results in bullets: 10 pts

Relevance (0–15 pts — if JD was pasted):
  - JD keyword match ≥ 60%: 15 pts
  - JD keyword match 40–60%: 10 pts
  - JD keyword match < 40%: 5 pts
  - No JD pasted: 0 pts (just skip this component)

TOTAL: 0–100
```

### Suggestions Engine (UI-007)
- Minimum 3 suggestions always shown
- Suggestions are specific (reference actual section + content) not generic:
  - ✗ "Add more experience" (too vague)
  - ✓ "Add a measurable result to your 'Software Engineer' role at Banque Atlantique"
- Suggestions sorted by impact on score
- Each suggestion is a clickable link that navigates to the relevant step and highlights the relevant field

### Completion Milestones
- 0–30%: 🔴 Red ring, "Let's build your profile"
- 31–60%: 🟡 Amber ring, "Good progress!"
- 61–80%: 🟢 Green ring, "Nearly there!"
- 81–100%: 💙 Blue ring, "Document looks great!"
- 100%: Confetti animation (Framer Motion), "Your document is complete!"

---

## 4. Bilingual Toggle

**Target:** Builder step 2 and step sidebar
**FR:** FR-027

### Language Toggle
- Toggle switch in step 2 (pre-set when document was created)
- Also accessible from builder sidebar bottom (persistent language indicator)
- Shows: "Document Language: English 🇬🇧" or "Langue du document : Français 🇫🇷"

### Language Switch Warning Dialog
When user changes language after content has been generated:
```
┌────────────────────────────────────────┐
│  Switch to French?                     │
│                                        │
│  All AI-written content (summary,      │
│  experience bullets) will be           │
│  regenerated in French. Any manual     │
│  edits you made will be lost.          │
│                                        │
│  [Cancel]   [Yes, switch to French]    │
└────────────────────────────────────────┘
```
- If no AI content has been generated yet: switch without warning
- "Remember my choice" checkbox to skip future warnings for this document

### Preview Language
- Preview updates to show regenerated content in the new language
- Template labels (section headings) also switch language: "Professional Summary" → "Résumé Professionnel", etc.
- Section heading translations maintained in i18n locale files

---

## 5. Mobile Builder (Full Implementation)

**Target:** `/builder/:documentId` on viewports < 768px
**FR:** FR-054, UI-003

### Mobile Layout Structure
```
┌─────────────────────────────┐
│  ← DocuSmart · Job Title  × │  ← Compact navbar (48px)
├─────────────────────────────┤
│  [Form ▾]  [Preview]        │  ← Tab toggle (sticky below navbar)
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                             │
│   [Step Content]            │  ← Scrollable main area
│   OR                        │
│   [Preview Panel]           │
│                             │
├─────────────────────────────┤
│  [← Back]  1/10  [Next →]   │  ← Fixed bottom nav bar (56px)
└─────────────────────────────┘
```

### Mobile-Specific Behaviors
- Bottom nav bar is always visible (`position: sticky; bottom: 0`)
- "Steps" floating action button (bottom-left) → opens a bottom sheet with step list and completeness meter
- Form inputs scroll into view on focus (avoid keyboard obstruction)
- Preview panel shows scaled-down A4 (scale ~0.4–0.5 on small screens)
- Drag-to-reorder on mobile uses touch events (HTML5 drag doesn't work on iOS — use pointer events or a touch-capable drag library like `@dnd-kit/core`)

### Touch Targets (UI-004)
- All buttons ≥ 44×44px
- Toggle switches ≥ 44px wide
- Drag handles ≥ 44px tall
- Step nav buttons use full tap width half the screen

### Performance on Mobile (UI-010, NFR-001)
- Lazy load preview panel (don't load until user switches to "Preview" tab)
- Debounce at 800ms instead of 500ms on mobile to reduce renders
- Use `React.lazy` for heavy builder components

---

## 6. Duplicate Document & Adapt Workflow

**Target:** `/documents` list page + builder
**FR:** FR-043

### Duplicate from Documents List
- Each document card has a "Duplicate" action (copy icon in card action bar)
- On click: shows brief inline loading state on the card ("Duplicating…")
- Backend creates a copy with title "[Original Title] — Copy"
- Frontend redirects to `/builder/:newDocumentId?step=1` with a toast: "Document duplicated! Adapt it for a new application."

### Duplicate from Builder
- In the builder navbar: "…" overflow menu → "Duplicate this document"
- Same flow as above

### "Adapt for New Role" Variant
- Trigger: "New Application" button on an existing document card
- Creates a duplicate BUT opens at Step 2 (Target Context) instead of Step 1
- Context is cleared: user re-enters role, company, JD
- All manual edits and AI content from original are preserved
- User sees: "Adapting 'Software Engineer CV' for a new role. Update the context below."

---

## 7. Cameroonian University Autocomplete

**Target:** `/profile/education` — Institution Name field
**FR:** FR-053

### Implementation
- Add autocomplete dropdown to the Institution Name input
- Trigger: when user types 2+ characters in the field
- Source: static JSON file in `/src/data/cm-universities.json` (no API call needed):
```json
[
  "University of Buea (UB)",
  "University of Yaoundé I",
  "University of Yaoundé II – Soa",
  "University of Douala",
  "University of Ngaoundéré",
  "University of Dschang",
  "University of Bamenda",
  "Ecole Nationale Supérieure Polytechnique (ENSP)",
  "Institut Universitaire de Technologie (IUT)",
  "Catholic University of Cameroon (CATUC)",
  ...
]
```
- Filter as user types (case-insensitive, matches anywhere in string)
- Keyboard navigable (arrow keys, Enter to select, Esc to close)
- Also suggests major institutions in neighbouring countries (Gabon, CENTRAFRIQUE, Chad, Nigeria, Congo)

---

## 8. Offline Profile Editing

**Target:** All `/profile/*` pages
**FR:** FR-055, NFR-028, NFR-029

### Service Worker Setup
- Register a service worker (`/sw.ts`) using Workbox or a custom implementation
- Cache strategy for profile pages: `NetworkFirst` with `IndexedDB` fallback
- Cache profile API responses in IndexedDB keyed by section type

### Offline UI
- When `navigator.onLine` is false:
  - Show a subtle sticky banner: "You're offline. Changes are saved locally and will sync when you reconnect."
  - Auto-save indicator changes to: "Saved offline ○" (hollow dot)
  - Form continues to work normally — writes to IndexedDB

### Sync on Reconnect
```ts
// useOfflineSync hook
window.addEventListener('online', () => {
  const pendingChanges = getIndexedDBPendingChanges()
  pendingChanges.forEach(change => syncToServer(change))
  showToast("Connected! Syncing your changes…")
})
```
- Show "Syncing…" spinner during sync
- On success: "All changes synced ✓" toast
- On partial failure: "Some changes couldn't sync. Tap to retry." with specific section name

### Conflict Resolution (simple strategy for MVP)
- Last-write-wins: server timestamp beats local if server data is more recent
- If offline draft is newer: upload offline draft and overwrite server

---

## 9. Export Polish

**Target:** Builder Step 10
**FR:** FR-038, FR-039

### PDF Export UX (FR-038)
- "Download PDF" button shows a multi-step progress:
  1. "Preparing document…" (brief, client-side)
  2. "Generating PDF on server…" (Puppeteer running, max 15s)
  3. "Download starting…" (success state, browser download dialog)
- If generation takes > 15s: show "This is taking longer than usual. Still working…" with spinner
- On failure: "PDF generation failed." with details and "Try Again" button
- Success: Download starts automatically + toast "Your PDF is ready!"

### DOCX Export UX (FR-039)
- "Download Word" button, same loading pattern but faster (< 10s)
- DOCX downloads as `[UserName]_CV_[Date].docx`

### Filename Conventions
- PDF: `[FirstName]_[LastName]_[DocumentType]_[TargetRole].pdf` (spaces replaced with underscores)
- DOCX: same naming convention with `.docx` extension

### Download History (UI feedback)
- After a successful download, the "Download PDF" button briefly shows "Downloaded ✓" (green) before reverting
- Bottom of Step 10: "Download history" small section showing:
  - "PDF downloaded on [date at time]"

---

## 10. Contextual Onboarding Tooltips

**Target:** All builder steps (first-time users)
**FR:** NFR-026

### Implementation
- Use a `useOnboarding` hook that tracks which steps the user has already seen (persisted in `localStorage`)
- On first visit to each step: show a tooltip or spotlight overlay
- Dismiss with "Got it" button, persists dismissal state per step

### Tooltip Content by Step
| Step | Tooltip |
|------|---------|
| 2 | "Paste a job description to let AI analyse which of your skills match the role." |
| 3 | "Toggle any section OFF to exclude it from this specific document." |
| 4 | "Click 'Generate with AI' to create a tailored summary for this exact role." |
| 5 | "Use 'AI Rewrite' to transform your bullet points into impactful, results-driven statements." |
| 10 | "Your AI Strength Score tells you exactly how to improve your document before sending." |

### Tooltip Component
- Use a simple positioned tooltip (Radix `<Tooltip>`) with a dismiss button
- First-time users see all tooltips in sequence
- "Skip all" option to dismiss all at once
- Can be re-triggered from Settings → "Reset onboarding"

---

## Shared Components for Phase 3

| Component | Description |
|-----------|-------------|
| `<DraggableSection>` | Drag-and-drop section card (touch + mouse support via @dnd-kit) |
| `<SectionOrderPanel>` | Full section order manager in sidebar |
| `<CompletenessRing>` | Animated circular progress ring with score and milestone color |
| `<SuggestionItem>` | Clickable improvement suggestion linking to relevant step |
| `<LanguageToggle>` | EN/FR toggle with switch dialog for after-content warning |
| `<OfflineBanner>` | Sticky offline status banner |
| `<OnboardingTooltip>` | First-use contextual tooltip with spotlight |
| `<DownloadButton>` | PDF/DOCX download button with multi-step progress states |
| `<PreviewScaleControl>` | Slider or +/- for preview zoom |
| `<MobileStepsSheet>` | Bottom sheet drawer for step navigation on mobile |

---

## NFRs to Enforce in Phase 3

- **NFR-002:** Preview re-render ≤1s after debounce fires. Profile this with React DevTools. The `<HorizonTemplate>` component must be memoized. Heavy computation (completeness score, section order) must happen outside the render cycle using `useMemo`.
- **NFR-026:** First-time builder users must see onboarding tooltips. Implement `useOnboarding` from the start — don't retrofit later.
- **NFR-028:** All profile mutations use TanStack Query's optimistic update pattern. Every `useMutation` must define `onMutate` (optimistic update), `onError` (rollback), and `onSettled` (refetch).
- **NFR-029:** Test the following scenarios:
  - User refreshes mid-build → draft restored from `localStorage`
  - User's connection drops while typing → changes captured in IndexedDB
  - User edits profile offline → changes visible on reconnect
- **FR-054:** Test builder on a real iPhone SE (375px) and a budget Android (360px). Every interactive element must be usable with a finger.
