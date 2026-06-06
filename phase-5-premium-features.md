# Phase 5 — Premium Features
## Frontend Implementation Plan

> **Scope:** JD Scanner, AI Strength Scorer, Applications Log (Kanban), Version History, Bundle Export, Shareable Public Profile, Interview Coach, remaining document types (6 Pro-only types), and upgrade prompts.
> **Prerequisite:** Phase 4 complete.

---

## Requirements Covered

| ID | Description | Priority |
|----|-------------|----------|
| FR-024 | AI strength check 0–100 with 5 sub-scores + explanations (polish from Phase 2) | MEDIUM |
| FR-025 | All 8 document types generated (remaining 6 Pro-only types) | HIGH |
| FR-031 | AI selects 2–3 most relevant projects per role (polish) | MEDIUM |
| FR-032 | Recommendation Letter draft for supervisor review | MEDIUM |
| FR-040 | Bundle ZIP export for Pro users — all docs for one application | MEDIUM |
| FR-041 | Shareable public URL `docusmart.cm/username` — Pro, toggleable | MEDIUM |
| FR-042 | Version history list + restore previous version | MEDIUM |
| FR-043 | Duplicate + adapt document workflow (polish) | HIGH |
| FR-044 | Applications Log: company, role, date, document version, status | MEDIUM |
| FR-045 | Companion doc prompt after CV (polish from Phase 2) | MEDIUM |
| FR-052 | Feature gating: upgrade prompts for Pro-only features | HIGH |
| FR-056 | Interview Coach: 10 questions + answer guidance | MEDIUM |

---

## Route Map

```
/applications                      → Applications Log / Kanban board (protected, Pro)
/applications/new                  → Add new application log entry
/applications/:id                  → Application detail page
/documents/:id/versions            → Version history for a document
/documents/:id/interview-coach     → Interview Coach results page
/:username                         → Public shareable profile (public, no auth)
/settings/profile-link             → Manage shareable link (protected, Pro)
```

---

## Pages

---

### 1. Applications Log Page

**Route:** `/applications`
**Layout:** `<AppLayout>`
**Access:** Pro users only (feature gated — FR-052)
**Purpose:** Track all job applications in a visual Kanban board with status management.
**FR:** FR-044

#### Feature Gate (FR-052)
- Free Tier users visiting `/applications`: full-page upgrade prompt
  ```
  ┌──────────────────────────────────────┐
  │  [Locked icon]                       │
  │  Track Every Application             │
  │  "Never lose track of where you      │
  │   applied and what document you sent"│
  │                                      │
  │  [Upgrade to Pro — 1,000 XAF/month]  │
  │  [See what else is in Pro →]         │
  └──────────────────────────────────────┘
  ```

#### Kanban Board Layout (≥768px)
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ WISHLIST │ APPLIED  │INTERVIEW │  OFFER   │ REJECTED │
│    (3)   │   (8)    │   (2)    │   (1)    │   (4)    │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│  Card    │  Card    │  Card    │  Card    │  Card    │
│  Card    │  Card    │  Card    │          │  Card    │
│  Card    │  Card    │          │          │  Card    │
│  + Add   │  + Add   │  + Add   │  + Add   │  + Add   │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

5 columns corresponding to status options (FR-044):
1. **Wishlist** — applications being prepared
2. **Applied** — submitted
3. **Interview Scheduled** — in process
4. **Offer Received** — success
5. **Rejected / Withdrawn**

#### Application Card (in Kanban)
```
┌─────────────────────────────┐
│  [Company Logo/Initials]    │
│  Job Title                  │
│  Company Name               │
│  Applied: Jun 3, 2026       │
│  ─────────────────────      │
│  📄 CV — Software Eng v2    │  ← linked document version
│  📄 Cover Letter v1         │
│  ─────────────────────      │
│  [View]  [Edit]  [Delete]   │
└─────────────────────────────┘
```

#### Mobile Layout (<768px)
- Kanban columns become horizontal scrollable tabs: "Wishlist (3)" | "Applied (8)" | etc.
- Cards displayed as a vertical list under the selected tab
- "Add Application" floating action button (bottom-right)

#### Kanban Drag-and-Drop
- Cards are draggable between columns (drag-and-drop using `@dnd-kit/core`)
- Dragging a card to a different column automatically updates its status
- Status change triggers a toast: "Application moved to 'Interview Scheduled'"
- Undo action available in the toast (5-second window)
- Drag-and-drop works on mobile via touch events

#### Filters & Search Bar
- Above the board: search input (search by company or role)
- Filter chips: "All" | "This Month" | "Specific document linked"
- Sort: "By date" | "By company A–Z"

---

### 2. Add / Edit Application

**Route:** Modal overlay on `/applications` (or `/applications/new` for full page on mobile)
**Purpose:** Log a new application entry.

#### Form Fields (FR-044)
- Company Name (required, text)
- Job Title / Role (required, text)
- Application Date (date picker, defaults to today)
- Status (dropdown: Wishlist | Applied | Interview | Offer | Rejected — defaults to Applied)
- Link Documents (multi-select from user's document list):
  - Each document shows name, type, version number
  - Can link CV + Cover Letter + other documents together
- Notes (textarea, optional, max 500 chars — "interview notes, salary expectations, referral contact")
- Application URL (optional — link to job posting)

#### Linked Document Selector
```
Select Documents for This Application
─────────────────────────────────────
□  Software Engineer CV — v3  (last edited Jun 2)
□  Cover Letter — MTN Cameroon v2
□  Motivation Letter v1
─────────────────────────────────────
[+ Create new document for this application]
```

---

### 3. Application Detail Page

**Route:** `/applications/:id`
**Layout:** `<AppLayout>`

#### Content
- Application header: Company + Role + Status badge
- Status change controls (dropdown or move-to-column)
- Timeline of status changes (with dates)
- Linked documents list with direct edit/download links
- Notes section (editable inline)
- Interview date/time field (if status is "Interview Scheduled")
- Interview Coach button: "Prepare for this interview →" → opens interview coach for the linked CV

---

### 4. Version History

**Route:** `/documents/:id/versions`
**Layout:** `<AppLayout>` (or slide-over panel accessible from builder)
**Access:** Pro users only (FR-042)
**FR:** FR-042

#### Layout
- Split view: left list + right diff preview

#### Left — Version List
```
Version History — Software Engineer CV
─────────────────────────────────────
  v5  Today, 14:23             CURRENT
      "Added project section"
      [Preview]  [Restore]

  v4  Yesterday, 09:15
      "AI rewrote experience bullets"
      [Preview]  [Restore]

  v3  Jun 2, 18:40
      "Changed template to Noir"
      [Preview]  [Restore]

  v2  Jun 1, 11:00
      "Added second job experience"
      [Preview]  [Restore]

  v1  May 31, 16:30              FIRST
      "Initial creation"
      [Preview]  [Restore]
```

Each version shows:
- Version number (v1, v2…)
- Timestamp
- Auto-generated description of what changed (from diff metadata)
- [Preview] — opens preview panel on the right
- [Restore] — confirmation dialog → restores to that version, saves current as new version first

#### Right — Version Preview
- A4 preview of the selected version's document
- If comparing: side-by-side diff view (current vs. selected version)
  - Added content: green highlight
  - Removed content: red strikethrough

#### Feature Gate
- Free users on a document's versions: show a panel explaining Pro version history feature with upgrade button

---

### 5. Bundle Export

**Target:** Builder Step 10 + Application detail page
**Access:** Pro only
**FR:** FR-040

#### In Builder Step 10
- "Export Bundle" button (below PDF/DOCX buttons)
- Pro badge next to it; disabled and shows upgrade prompt for Free users
- When clicked:
  1. Modal: "Select documents to include in this bundle"
     - Lists all documents linked to the same application context
     - Checkboxes for each
  2. "Download Bundle (.zip)" button
  3. Loading: "Preparing bundle… (2/3 documents)"
  4. Success: ZIP downloads as `[CompanyName]_[Role]_[YYYY-MM-DD].zip` (FR-040)

#### In Application Detail Page
- "Export All Documents" button → same bundle modal pre-filled with application's linked docs

---

### 6. Interview Coach

**Route:** `/documents/:id/interview-coach`
**Layout:** `<AppLayout>`
**Access:** Pro only
**FR:** FR-056

#### Entry Points
- From builder Step 10: "Prepare for Interview" button (after export)
- From Application detail page: "Coach Me" button
- From Documents list: option in document card menu

#### Page Layout

**Header**
- "Interview Coach — [Job Title] at [Company]"
- Sub: "10 likely interview questions based on your CV and the target role"

**Question List (10 items)**
Each question rendered as an expandable accordion card:
```
┌────────────────────────────────────────────────────┐
│  Q3  "Tell me about a time you led a project       │
│       from start to finish."                       │
│                                           [▼ Prep] │
├────────────────────────────────────────────────────┤
│  Answer Guidance:                                  │
│  • Use the STAR method: Situation, Task, Action,   │
│    Result                                          │
│  • Reference your experience at [Company from CV]  │
│  • Mention the specific outcome: [AI pulled this   │
│    from the user's bullet: "reduced deployment     │
│    time by 40%"]                                   │
│                                                    │
│  Your answer notes (editable):                     │
│  [_______________________________________]         │
└────────────────────────────────────────────────────┘
```

**Question Categories shown as section dividers:**
- Opening questions (Q1–Q2)
- Experience & Achievements (Q3–Q5)
- Technical / Role-specific (Q6–Q8)
- Situational / Behavioural (Q9)
- Closing / Motivation (Q10)

**Actions**
- "Regenerate Questions" — re-calls AI for a fresh set (counts toward AI usage? No — this is a Pro feature, no daily limit)
- "Download Q&A as PDF" — exports the 10 questions + guidance as a preparation sheet
- "Print" — browser print dialog

#### Loading State
- Skeleton of 10 accordion cards while AI generates
- Progress: "Generating personalised interview questions…" (max 30s)

---

### 7. Shareable Public Profile

**Route:** `/:username` (e.g., `docusmart.cm/achambede`)
**Layout:** Custom minimal public layout (no app nav, no sidebar)
**Access:** Public (no auth required)
**FR:** FR-041

#### What Is Shown
- Only the user's chosen "public CV" (one designated document, not all documents)
- Only fields the user has enabled in their privacy settings:
  - Shown by default: name, title, professional summary, skills, experience (company + role, no dates unless enabled), education (institution + degree), projects
  - Hidden by default: email, phone number, references, date of birth, marital status

#### Public Profile Layout
```
┌──────────────────────────────────────────────────┐
│  [Profile Photo]  FIRSTNAME LASTNAME             │
│                   Job Title                      │
│                   LinkedIn  |  GitHub  |  Site   │
├──────────────────────────────────────────────────┤
│  About                                           │
│  [Professional Summary]                          │
├──────────────────────────────────────────────────┤
│  Experience                                      │
│  Title · Company                                 │
│  • Bullet                                        │
├──────────────────────────────────────────────────┤
│  Education  |  Skills  |  Projects               │
├──────────────────────────────────────────────────┤
│  Powered by DocuSmart.cm                         │  ← Subtle footer
└──────────────────────────────────────────────────┘
```

#### "Powered by DocuSmart" Footer
- Small branded footer: "Professional profile created with DocuSmart — [Get started free]"
- This is a subtle growth/referral mechanism

#### "Download My CV" Button
- Optional: if the owner has enabled it, a "Download CV" button appears
- Triggers a request to backend for a freshly generated PDF of the user's current CV

#### Profile Link Management (`/settings/profile-link`)
**Route:** `/settings/profile-link`
Layout: tab within Settings

- Enable/Disable shareable link toggle: "Your public profile is [Active / Disabled]"
- Username / URL customisation: "docusmart.cm/[username]" — editable once, with availability check
- Privacy settings:
  - Toggle each section: Show Experience dates | Show Full Education | Show Phone | Show Email | etc.
  - Each toggle defaulting to sensible privacy (email/phone hidden by default)
- "Visit Your Profile" button → opens `/:username` in new tab
- Copy URL button (copies link to clipboard with "Copied!" feedback)
- QR code download: generates a QR code for the public profile URL (useful for business cards)

---

### 8. Remaining 6 Pro Document Types

**Target:** Builder — extends the existing 10-step wizard
**Access:** Pro only
**FR:** FR-025, FR-032

Add UI support for these 6 types that were locked in Phase 2:

| Type | Step 4 label | AI prompt variant | Key difference |
|------|-------------|-------------------|----------------|
| Motivation Letter | "Opening Statement" | Scholarship/study motivation | Longer (1 page), first-person narrative |
| Recommendation Letter | "Candidate Overview" | For supervisor to sign | Written in 3rd person, requires referee name |
| Personal Statement | "Your Story" | Fellowship/university admission | Personal narrative, 600–800 words |
| Research Proposal | "Research Question" | Academic grant/thesis | Structured sections: Abstract, Background, Methodology |
| Expression of Interest | "Vision Statement" | Leadership/NGO application | Forward-looking, 400–600 words |
| Writing Sample | "Sample Type" | Research/journalism | User provides topic; AI drafts a sample |

#### Recommendation Letter Special UI (FR-032)
- Step 3 (after personal details): "Recommender Details"
  - Recommender's Name, Title, Institution, Email
  - Relationship to applicant
- Generated output rendered as a formal letter template (not CV layout)
- Step 10 shows: "This is a draft for your [Referee Name] to review, edit, and sign. Download and share it with them."
- A special note banner throughout: "This document is a draft. Ask your recommender to personalise and sign it before submission."

#### Builder Adaptation for Letter Documents
- Replace the split-screen CV preview with a split-screen letter preview
- Letter preview uses a formal letter template component (`<FormalLetterTemplate>`)
- Letter template: white background, left-aligned text, letterhead area, signature area

---

### 9. Feature Gating & Upgrade Prompts

**Target:** Everywhere a Pro feature is attempted by a Free user
**FR:** FR-052

#### `<UpgradePromptModal>` Component
Reusable modal triggered when a Free/non-subscribed user attempts a Pro feature:

```
┌──────────────────────────────────────────┐
│  🔒  [Feature Name] is a Pro feature     │
│                                          │
│  You're on the Free plan.                │
│  Upgrade to Pro for 1,000 XAF/month:     │
│                                          │
│  ✓  Unlimited document generation        │
│  ✓  All 8 document types                 │
│  ✓  All 6 CV templates                   │
│  ✓  JD Scanner + AI Strength Scorer      │
│  ✓  Applications Log & Version History   │
│  ✓  Interview Coach                      │
│  ✓  Bundle Export & Shareable Profile    │
│                                          │
│  [Upgrade to Pro — 1,000 XAF/month]      │
│  [Continue on Free Plan] (text link)     │
└──────────────────────────────────────────┘
```

#### Feature Gate Triggers
| Feature | Gate condition |
|---------|---------------|
| Noir, Sidebar Pro, Mosaic templates | Free tier |
| Motivation/Recommendation/Personal Statement etc. | Free tier |
| JD Scanner (full analysis) | Free tier |
| AI Strength Scorer | Free tier |
| Applications Log | Free tier |
| Version History | Free tier |
| Bundle Export | Free tier |
| Shareable Profile | Free tier |
| More than 2 docs/month | Free tier (document count check) |

#### Monthly Document Limit (FR-046)
- Track `user.documentsThisMonth` from auth store / TanStack Query
- When Free user has used 2 documents in current calendar month:
  - "New Document" button shows a different modal: "You've used 2/2 free documents this month."
  - "Documents reset on [first day of next month]"
  - Options: [Upgrade to Pro] | [Buy a single document — 200 XAF]

#### Pro Badge UI Pattern
- Pro-only features in the builder or gallery show a small `<ProBadge>` chip (amber color: `bg-ds-premium text-ds-premium-foreground`)
- Text: "Pro" inside a rounded pill
- Hovering a locked Pro feature shows a tooltip: "Available on Pro plan"

---

## Shared Components for Phase 5

| Component | Description |
|-----------|-------------|
| `<KanbanBoard>` | Drag-and-drop kanban with 5 columns (@dnd-kit) |
| `<ApplicationCard>` | Kanban card showing company, role, date, linked docs |
| `<AddApplicationModal>` | Form modal for new/edit application |
| `<VersionHistoryPanel>` | Split-panel version list + diff preview |
| `<VersionCard>` | Single version row with preview/restore actions |
| `<InterviewCoachPage>` | Full page with 10 AI-generated Q&A accordions |
| `<QuestionAccordion>` | Expandable Q with STAR guidance + user notes |
| `<PublicProfilePage>` | Public-facing profile (no auth, minimal layout) |
| `<ProfileLinkSettings>` | Settings tab for shareable link management |
| `<QRCodeDisplay>` | QR code rendered and downloadable |
| `<UpgradePromptModal>` | Reusable Pro upgrade dialog |
| `<ProBadge>` | Amber "Pro" pill badge |
| `<BundleExportModal>` | Document selector + ZIP download flow |
| `<FormalLetterTemplate>` | React template component for letter-type documents |
| `<MonthlyLimitModal>` | Specific modal for "2/2 free docs used" state |

---

## Implementation Notes

### Applications Log State
- TanStack Query for fetching applications list
- Optimistic updates for drag-to-new-column (update `status` field immediately, sync to backend)
- If backend sync fails: revert column position + show error toast
- Board columns are read-only UI — no editing inline, must use the modal

### Version History
- Each `DocumentVersion` has: `id`, `versionNumber`, `content (JSON)`, `templateSettings`, `createdAt`, `changeDescription`
- Frontend generates `changeDescription` by diffing consecutive versions: count added/removed sections
- Restore: `POST /api/documents/:id/restore` with `{ targetVersionId }` — backend creates a new version based on the old one's content

### Public Profile SEO
- Server-side render the public profile page (`/:username`) for SEO and social sharing
  - Since this is a React SPA (Vite), use `react-helmet-async` to set `<title>`, `<meta description>`, and OpenGraph tags dynamically
  - For proper SSR/SSG: consider that Vercel supports edge functions — generate OG image for the profile using `@vercel/og`
- Meta tags on `/:username`:
  - `<title>[Name] — Professional Profile | DocuSmart</title>`
  - `<meta property="og:image" content="/api/og?username=[username]">` (generated OG card)

### Interview Coach Data Flow
- User visits `/documents/:id/interview-coach`
- Frontend sends: `{ documentId, targetRole, companyType, country }` to `POST /api/documents/:id/interview-coach`
- Backend calls Claude with CV content + context, returns structured JSON: `{ questions: [{question, answerGuidance, category}] }`
- Frontend renders the 10 Q&A items
- User notes saved locally to `localStorage` (not backed to server in Phase 5 — synced in future iteration)
