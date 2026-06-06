# Phase 2 — AI Integration
## Frontend Implementation Plan

> **Scope:** The 10-step Document Builder wizard, AI-assisted content generation (professional summary, bullet rewrite, inline "Improve this"), Cover Letter generation, and the basic document preview panel.
> **Prerequisite:** Phase 1 complete. User has an authenticated account with a populated Master Profile.

---

## Requirements Covered

| ID | Description | Priority |
|----|-------------|----------|
| FR-015 | 10-step wizard, forward/back without data loss | HIGH |
| FR-016 | Step 2 requires job title, company type, target country; others optional | HIGH |
| FR-017 | JD paste → AI maps requirements to profile fields, pre-selects them | HIGH |
| FR-018 | Steps 3–9 pre-populated from Master Profile as togglable cards | HIGH |
| FR-019 | Per-experience "AI Rewrite" button → action-verb impact-first bullets | HIGH |
| FR-020 | Step 4 "Generate with AI" → 3-sentence professional summary | HIGH |
| FR-021 | Inline "Improve this" button on every text field; max 2/user/day | HIGH |
| FR-022 | Drag-reorder sections; preview updates immediately | MEDIUM |
| FR-023 | Completeness meter 0–100 with 3 suggestions | MEDIUM |
| FR-024 | Step 10 AI strength check 0–100 with 5 sub-scores + explanations | MEDIUM |
| FR-025 | Generate all 8 document types (Phase 2: CV + Cover Letter; others Phase 5) | HIGH |
| FR-026 | Each generation request passes structured context to AI | HIGH |
| FR-027 | Native bilingual generation (EN/FR), language switch = full re-generation | HIGH |
| FR-028 | Work experience bullets: action verb + task + measurable result | HIGH |
| FR-029 | Empty profile fields omitted from output — no placeholders | HIGH |
| FR-030 | Section order context-aware (graduate vs experienced vs developer) | MEDIUM |
| FR-031 | AI selects 2–3 most relevant projects for context | MEDIUM |
| FR-038 | Export as PDF | HIGH |
| FR-039 | Export as DOCX | HIGH |
| FR-043 | Duplicate document and adapt | HIGH |
| FR-045 | Companion doc prompt after CV generation | MEDIUM |
| UI-002 | Split-screen ≥768px: form left, live preview right | HIGH |
| UI-003 | Mobile <768px: single column with form/preview toggle | HIGH |
| UI-006 | Live preview reflects edits within 1 second | HIGH |
| NFR-003 | Full AI generation completes ≤30s; show progress indicator | HIGH |
| NFR-004 | Inline AI rewrite returns ≤10s | HIGH |
| NFR-027 | Claude API retry logic, max 3 attempts, exponential back-off | HIGH |

---

## Route Map

```
/documents                    → Documents list page (protected)
/documents/new                → New document flow — type + context selection (protected)
/builder/:documentId          → Full builder shell (protected)
/builder/:documentId?step=N   → Builder at step N (1–10)
```

---

## Pages

---

### 1. Documents List Page

**Route:** `/documents`
**Layout:** `<AppLayout>`
**Purpose:** Show all user's saved documents; entry point to create, continue, duplicate, or delete documents.

#### Layout
- Page header: "My Documents" (H1) + "New Document" primary button (top-right)
- Filter/sort bar:
  - Tabs: All | CVs | Cover Letters (more types added in Phase 5)
  - Sort dropdown: "Last edited" | "Created date" | "Name"
- Document cards grid (3-col desktop, 2-col tablet, 1-col mobile)

#### Document Card
- Template thumbnail (Horizon template mockup — placeholder image)
- Document type badge pill (e.g., "CV", "Cover Letter") with appropriate `bg-ds-*` color
- Document title (e.g., "Software Engineer @ MTN Cameroon")
- Last edited: "2 days ago"
- Language badge: "EN" or "FR"
- Card actions on hover (icon row):
  - Edit (pencil) → opens `/builder/:documentId`
  - Duplicate (copy icon) → creates copy, opens in builder
  - Download PDF (download icon) → triggers export
  - Delete (trash) → confirmation dialog

#### Empty State (Phase 1 users arriving here)
- Centered illustration
- H3: "No documents yet"
- Body: "Create your first document in under 3 minutes using your profile."
- "Create Document" button → `/documents/new`

---

### 2. New Document — Type & Context Selection

**Route:** `/documents/new`
**Layout:** `<AppLayout>` with centered content, no sidebar
**Purpose:** Guided entry point before the builder. User selects document type and briefly configures the generation context.

#### Step A — Choose Document Type

Full-width centered card grid (2-col desktop, 1-col mobile):

| Type | Icon | Description | Tier badge |
|------|------|-------------|-----------|
| CV / Resume | document icon | "Your professional story for job applications" | Free |
| Cover Letter | letter icon | "Personalised letter for a specific role" | Free |
| Motivation Letter | — | "For scholarships and study programmes" | Pro |
| Recommendation Letter | — | "Draft for supervisor review and signature" | Pro |
| Personal Statement | — | "For university admissions and fellowships" | Pro |
| Research Proposal | — | "For graduate school and grants" | Pro |
| Expression of Interest | — | "For leadership and NGO roles" | Pro |
| Writing Sample | — | "For research and journalism positions" | Pro |

- Free Tier users can select CV and Cover Letter; Pro-only types show a lock icon + "Upgrade to Pro" on click
- Selected card gets a blue border highlight
- "Continue →" button activates when a type is selected

#### Step B — Quick Context (before entering builder)
After type selection, a second screen appears (same page, animated transition):

- H3: "Tell us about this application"
- **Job Title / Role** (text input, required)
- **Company / Organisation Name** (text input, optional — "e.g. MTN Cameroon, University of Buea")
- **Company Type** (dropdown, required):
  - Private Company · Government / Public Sector · NGO / Non-Profit · Academic / University · Startup · International Organisation · Other
- **Target Country** (dropdown, required, default: Cameroon)
- **Language** (toggle: English | French, default: English)
- "Create Document →" button

This creates a draft document record and redirects to `/builder/:documentId?step=1`

---

### 3. Builder Shell

**Route:** `/builder/:documentId`
**Layout:** Custom full-screen builder layout (replaces `<AppLayout>`)
**Purpose:** The main 10-step document creation experience.

#### Builder Layout (≥768px — FR-015, UI-002)

```
┌────────────────────────────────────────────────────────────────┐
│  Builder Navbar                                                 │
│  [← Back] DocuSmart · [Document Title editable] · [Exit ×]    │
├──────────────────────────┬─────────────────────────────────────┤
│  Step Sidebar (left)     │  Right Panel                        │
│  ─────────────────────── │  ───────────────────────────────    │
│  Step progress (1-10)    │  Toggles: [Form] [Preview]          │
│  Step nav list           │                                     │
│  ─────────────────────── │  [Live Preview Panel]               │
│  Completeness meter      │  OR                                 │
│  (circular or bar)       │  [Step Form Content]                │
│                          │                                     │
│                          │  ─────────────────────────────────  │
│                          │  [← Back]  Step N of 10  [Next →]   │
└──────────────────────────┴─────────────────────────────────────┘
```

- **Left sidebar (280px fixed):**
  - Step list with step number, name, and completion status (circle: empty / in-progress / complete)
  - Completeness meter (circular progress, 0–100%)
  - Template mini-preview (thumbnail of selected template — placeholder Horizon in Phase 2)
  - "Change Template" link (active in Phase 4)

- **Main content area (fills remaining width):**
  - Step form content (see steps 1–10 below)
  - Bottom nav: "← Back" | "Step N of 10" | "Next →" / "Review & Export" on step 10

#### Mobile Builder Layout (<768px — UI-003)

```
┌────────────────────────────────────┐
│  Builder Navbar (compact)          │
│  [← ] Title                [× ]   │
├────────────────────────────────────┤
│  [Form]  [Preview]  (toggle tabs)  │
├────────────────────────────────────┤
│  Step content / Preview panel      │
├────────────────────────────────────┤
│  [← Back]  1/10  [Next →]          │
└────────────────────────────────────┘
```

- Tab toggle switches between form and preview panels
- Step sidebar accessible via "Steps" icon button (opens bottom sheet with step list)

#### Builder Navbar
- Left: "← Dashboard" link (shows unsaved-changes warning dialog if changes exist)
- Center: Document title (inline editable, click to edit, auto-saves)
- Right: Save status indicator + "Exit" button (same unsaved-changes warning)

#### Global Builder State (persisted to URL + TanStack Query)
```ts
interface BuilderState {
  documentId: string
  documentType: DocumentType
  step: number        // 1–10
  context: ContextParams
  selectedSections: string[]    // which profile sections are toggled ON
  sectionOrder: string[]        // user-defined section ordering
  generatedContent: Record<string, string>  // AI-generated text per section
  templateId: string
  language: 'en' | 'fr'
}
```
- State persisted in `localStorage` as backup (NFR-029)
- Debounced sync to backend every 3 seconds (FR-010)

---

### 4. Builder Step 1 — Document Type Confirmation

**Step name:** "Document Type"
**Purpose:** Confirm (or change) the document type selected before entering the builder.

- Shows the selected document type with a large card (icon + name + description)
- "Change" link → goes back to `/documents/new`
- Shows 7 other type cards (grayed out / locked if Pro-only)
- Pro-only types show upgrade badge

This step is mostly informational/confirmation. No user input required unless they want to change the type.

---

### 5. Builder Step 2 — Target Context

**Step name:** "Application Context"
**FR:** FR-016, FR-017

#### Form fields

**Required:**
- Job Title / Role (text input, pre-filled from `/documents/new`)
- Company Type (dropdown, pre-filled)
- Target Country (dropdown, pre-filled)

**Optional:**
- Company / Organisation Name (text)
- Industry / Sector (dropdown or text: Technology, Finance, Healthcare, Education, NGO, Government, etc.)
- Application Language (EN / FR toggle — changes generated document language; FR-027)
- Target audience description (one line: "University scholarship committee", "Corporate HR team")

**JD Scanner — Job Description Paste (FR-017):**
- Collapsible accordion: "Paste the job description (optional but recommended)"
- Textarea with placeholder: "Paste the full job description here..."
- Character limit: 5000 chars, counter shown
- "Analyse JD →" button (blue, appears when textarea has content)
  - On click: sends JD to backend AI endpoint
  - Loading state: "Analysing job description…" with spinner (max 10s, NFR-004)
  - On success: shows **JD Match Panel** below the textarea:
    - "Top matching skills from your profile:" — highlighted chips (green = match found)
    - "Skills mentioned but not in your profile:" — orange chips
    - "Sections being pre-selected:" — list of sections AI recommends including
    - Pre-selects those sections in steps 3–9 automatically
  - On failure: "Analysis failed. You can continue without JD analysis." (non-blocking)

---

### 6. Builder Step 3 — Personal Details

**Step name:** "Personal Details"
**FR:** FR-018

#### Layout
- Pre-populated cards from Master Profile (FR-018)
- Each field displayed as a **togglable row** (toggle ON/OFF to include in document)
- Toggle state persisted in `BuilderState.selectedSections`

#### Fields shown (from profile)
- Full Name, Professional Title, Email, Phone, LinkedIn, Website, GitHub
- If **Cameroonian format** is enabled on profile: also shows Nationality, DOB, Place of Birth, Marital Status
- Photo (profile photo toggle — "Include photo in CV")

#### Layout for each field row
```
[Toggle ON/OFF]  [Field Label]  [Field Value]  [Edit ✏️]
```
- "Edit" link opens a quick-edit inline input (saves to profile and updates builder)
- Fields toggled OFF are grayed out and excluded from preview

---

### 7. Builder Step 4 — Professional Summary

**Step name:** "Professional Summary"
**FR:** FR-020, FR-021

#### Layout
- H3: "Professional Summary"
- Editable textarea showing:
  - Either: the professional summary from Master Profile (pre-filled)
  - Or: placeholder "Click 'Generate with AI' to create a tailored summary for this role"

#### AI Generate (FR-020)
- Prominent "Generate with AI ✨" button (blue, centered)
- On click:
  - Sends to backend: target role, company type, country, user's work experience titles, skills
  - Loading state: typing animation / shimmer skeleton (max 30s — NFR-003)
  - On success: replaces textarea content with 3-sentence summary
  - "Regenerate" button appears (can click multiple times — FR-020)
  - "✓ Generated" badge appears on step indicator

#### "Improve this" button (FR-021)
- Appears as a small magic-wand icon button on the right edge of the textarea when it has content
- On click: sends selected text to Claude API for inline rewrite
- If daily limit reached (2/day): button is disabled, tooltip shows "Daily AI limit reached (2/2). Resets at midnight."
- Usage counter displayed: "AI rewrites today: 1/2" shown subtly below textarea

#### Edit
- User can always manually type/edit the textarea
- Character counter (max 600)
- Language is set by Step 2 context (FR-027)

---

### 8. Builder Step 5 — Work Experience

**Step name:** "Work Experience"
**FR:** FR-018, FR-019, FR-021

#### Layout
- List of work experience cards (one per job, from profile)
- Toggle ON/OFF each entry
- Entries with toggle OFF are grayed and excluded from document

#### Each experience card
```
┌──────────────────────────────────────────────────────┐
│ [ON/OFF Toggle]  Job Title · Company  |  Dates        │
│ ─────────────────────────────────────────────────────│
│ • Bullet point 1                                     │
│ • Bullet point 2                                     │
│ • Bullet point 3                                     │
│                                                      │
│ [AI Rewrite ✨]  [Edit]  [Drag ⠿]                    │
└──────────────────────────────────────────────────────┘
```

#### AI Rewrite per entry (FR-019)
- "AI Rewrite ✨" button on each active experience card
- On click:
  - Sends existing bullet points + job title + target role to Claude API
  - Loading: shimmer skeleton on bullet area (max 10s — NFR-004)
  - On success: replaces bullet points with action-verb, impact-first reformulations (FR-028)
  - User can accept (default) or click "Undo" to revert to original
  - Shows "AI Enhanced" badge on card after rewrite

#### Inline "Improve this" (FR-021)
- Available on each bullet point text when user clicks into edit mode
- Same daily limit (shared 2/day budget across all "Improve this" uses)

#### Ordering (FR-022 — preview in Phase 3)
- Drag handle on each card (HTML5 drag or keyboard up/down) — functional drag but preview update deferred to Phase 3

---

### 9. Builder Step 6 — Education

**Step name:** "Education"
**FR:** FR-018, FR-030

#### Layout
Same pattern as Work Experience: toggle cards, one per education entry.

Each card shows:
- Institution, Degree, Field, Dates, GPA (if visible per FR-014 threshold)
- No AI rewrite for education (just include/exclude and reorder)

#### Smart section ordering (FR-030)
- If user has < 3 years total work experience (detected from date ranges): "For recent graduates, your Education section will appear before Work Experience in the generated document."
- Info banner shown on this step

---

### 10. Builder Step 7 — Skills

**Step name:** "Skills"
**FR:** FR-018

#### Layout
- Skills displayed as chip groups (Technical Skills | Soft Skills | Languages)
- Toggle individual skills ON/OFF (click to deselect)
- AI highlights recommended skills for the target role (chips glowing blue border if JD analysis was run in Step 2)

#### Skill Relevance Scoring
- If JD was pasted: chips are sorted by relevance score (most relevant first)
- Chips show subtle relevance indicator (full color = highly relevant, faded = less relevant)

---

### 11. Builder Step 8 — Projects

**Step name:** "Projects"
**FR:** FR-018, FR-031

#### Layout
- Project cards from profile, toggleable
- AI auto-selects 2–3 most relevant projects for the role (FR-031):
  - Info banner: "AI selected the most relevant projects for [target role]. You can override below."
  - Pre-toggled based on AI selection; user can change

Each card shows:
- Project name, description (truncated), technologies (chips)
- Toggle ON/OFF, drag handle

---

### 12. Builder Step 9 — Additional Sections

**Step name:** "Additional Info"
**FR:** FR-018

#### Layout
- Accordion list of remaining profile sections:
  - Certifications
  - Volunteer Work
  - Publications
  - Awards & Honors (from education entries)
  - References (FR-013)
  - Custom Section (free text — Pro only in later phase)

Each section:
- Toggle ON/OFF the entire section
- Within section: individual entry cards with ON/OFF toggles
- Collapsed by default; expand to see entries

#### References (FR-013)
- "Include References" toggle
- Shows referee name + role + institution (not email/phone — only shown in document)
- Or "References available upon request" option (adds that phrase instead of full details)

---

### 13. Builder Step 10 — Review & Export

**Step name:** "Review & Export"
**FR:** FR-024, FR-038, FR-039, FR-045

#### Layout (two-column on desktop)
- Left: AI Strength Report + Export controls
- Right: Full document preview (final render)

#### AI Strength Check (FR-024)
- On entering step 10: auto-triggers AI strength analysis (can be skipped)
- Loading state: "Analysing your document…" progress bar (max 30s — NFR-003)
- Results display:

```
Overall Score: 82/100        [circular progress ring, blue]

Sub-scores:
Impact Language      ████████░░  78%   "Add more quantified results"
Completeness         █████████░  90%   "Consider adding a certifications section"
Relevance            ████████░░  82%   "Strong keyword alignment with the role"
Formatting Quality   ██████████  95%   "Well-structured layout"
Keyword Density      ███████░░░  70%   "Add 3 more keywords from the JD"
```

- Each sub-score has an expandable explanation (accordion)
- "Improve Document" button → goes back to the relevant step with the issue highlighted

#### Export Actions (FR-038, FR-039)
- Primary: "Download PDF" (large blue button)
  - Loading: "Generating PDF…" progress indicator (max 15s — NFR-005)
  - Success: browser download triggered
  - Error: "PDF generation failed. Please try again." with retry
- Secondary: "Download Word (.docx)" (outlined button)
  - Same loading/success/error pattern
- Tertiary (Phase 5): "Export Bundle .zip" (Pro badge, disabled if Free)

#### Save & Share
- "Save to My Documents" button (auto-saves if already triggered)
- Shareable link (Phase 5 — greyed out with Pro badge)

#### Companion Document Prompt (FR-045)
- After any successful export, show a toast/banner:
  - "Your CV is ready! Want to create a matching Cover Letter for this application?"
  - [Yes, create Cover Letter →] [No thanks]
  - If Yes: creates new Cover Letter document with same context, opens in builder

---

## Live Preview Panel

**Used in:** Steps 3–10 (right panel on desktop, "Preview" tab on mobile)
**FR:** UI-006, NFR-002

### Behavior
- Shows the rendered Horizon CV template populated with the user's current builder state
- Updates within 1 second of user stopping input (debounced at 500ms — UI-006, NFR-002)
- Renders as a scaled-down A4 document (CSS `transform: scale()` based on panel width)
- Toggle sections on/off in the form → immediately reflected in preview
- AI-generated content appears in preview as it's accepted

### Preview States
- **Loading:** Skeleton placeholder of A4 document structure
- **Rendering:** Brief shimmer while content updates
- **Ready:** Fully rendered template
- **Error:** "Preview unavailable. Your data is safe." with refresh button

### Horizon Template (Phase 2 — only template)
Build a React component that renders the Horizon CV template:
- Single-column clean layout
- Header: name, title, contact info row
- Sections in user-defined order: Summary, Experience, Education, Skills, Projects, Additional
- All text from `BuilderState.generatedContent` or profile data
- Styled with inline CSS (for PDF rendering compatibility with Puppeteer)
- The same component is used for both in-builder preview and PDF export

---

## AI Integration UX Patterns

### Loading States (NFR-003, NFR-004)

For full document generation (≤30s):
```
[Spinner] Generating your professional CV...
          Claude is tailoring your content for [Job Title] at [Company Type]
          ████████████░░░░░░  65%
          This usually takes 15–30 seconds
```
- Show a multi-step progress animation: "Analysing your profile…" → "Crafting your summary…" → "Rewriting experience bullets…" → "Finalising document…"
- Cancel button available after 10 seconds

For inline rewrites (≤10s):
- Replace text with shimmer skeleton
- Subtle "Thinking…" label

### Retry Logic (NFR-027)
- Exponential back-off: retry after 1s, 2s, 4s
- After 3 failures: "AI service temporarily unavailable. Your document is saved. Try again in a moment." with retry button
- Never show raw API error messages to user

### Daily Limit Counter (FR-021)
- Stored in: `AIUsageLog` table (backend), mirrored in frontend app state
- On page load: fetch current day's usage count
- Counter resets at midnight UTC
- When limit reached: all "Improve this" buttons disabled system-wide for that user
- Display: subtle info badge somewhere in builder sidebar: "AI rewrites: 2/2 used today"

### Language Generation (FR-027)
- Language is set in Step 2 (EN/FR toggle)
- Any AI generation action uses the selected language
- Changing language after content has been generated: shows warning dialog:
  - "Switching to [French/English] will regenerate all AI-written content. Manually edited text will be reset. Continue?"
  - [Yes, switch language] [Cancel]

---

## Shared Components for Phase 2

| Component | Description |
|-----------|-------------|
| `<BuilderLayout>` | Full-screen layout replacing AppLayout for builder pages |
| `<StepSidebar>` | Left sidebar with step list, completion indicators, completeness meter |
| `<StepNav>` | Bottom Back/Next navigation bar |
| `<ToggleCard>` | Reusable profile section card with ON/OFF toggle |
| `<AIButton>` | Magic-wand icon button for inline "Improve this" with usage-limit awareness |
| `<AILoadingOverlay>` | Loading state for full generation with progress messages |
| `<LivePreviewPanel>` | Scaled A4 preview of the rendered template |
| `<HorizonTemplate>` | React component rendering the Horizon CV template |
| `<JDMatchPanel>` | Displays JD analysis results — matched/unmatched skills |
| `<StrengthScoreCard>` | Circular score ring + sub-score rows + explanations |
| `<ExportButton>` | PDF/DOCX export button with loading, success, error states |
| `<CompanionDocPrompt>` | Post-export toast/banner suggesting companion document |
| `<DailyLimitBadge>` | Shows "AI rewrites: N/2 used today" in sidebar |

---

## Implementation Notes

### Builder State Persistence (NFR-029)
- Primary: TanStack Query mutation to backend (auto-saves every 3s)
- Fallback: `localStorage` with key `builder_draft_${documentId}`
- On mount: if `localStorage` draft exists and is newer than server version → show "Restore unsaved draft?" prompt
- On exit: warn user if unsaved changes exist ("You have unsaved changes. Leave?")

### Document Generation Flow
The frontend does NOT call Claude API directly. Flow:
1. Frontend sends structured request to backend: `POST /api/documents/:id/generate`
2. Backend constructs prompt, calls Claude, returns structured JSON content
3. Frontend receives content and populates `BuilderState.generatedContent`
4. Live preview renders immediately from this content

For streaming responses (smoother UX for long generation):
- Backend sends `text/event-stream` response
- Frontend uses `EventSource` or `fetch` with `ReadableStream` to receive content token by token
- Preview updates as tokens arrive (streaming preview)

### Completeness Meter (FR-023)
Computed client-side from `BuilderState`:
- Score formula: (filled required fields / total fields) × 60 + (AI content generated / sections) × 25 + (keyword match from JD) × 15
- Updates in real-time as user toggles sections

### Route Protection in Builder
- If user navigates to `/builder/:documentId` for a document that doesn't belong to them → 403 redirect to `/documents`
- If `documentId` doesn't exist → redirect to `/documents/new`
