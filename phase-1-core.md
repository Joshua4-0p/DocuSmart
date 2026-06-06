# Phase 1 — Core
## Frontend Implementation Plan

> **Scope:** Authentication, Master Profile setup, Dashboard, Account Settings, Landing page, and one working CV template (Horizon) with PDF export trigger.
> **All HIGH and MEDIUM priority FRs and NFRs for this phase must be implemented.**

---

## Requirements Covered

| ID | Description | Priority |
|----|-------------|----------|
| FR-001 | Email + password registration | HIGH |
| FR-002 | Google OAuth login | HIGH |
| FR-003 | Email verification before activation | HIGH |
| FR-004 | Password reset via time-limited link | HIGH |
| FR-005 | JWT session management, 7-day expiry, logout invalidation | HIGH |
| FR-006 | Update email, password, notification preferences | MEDIUM |
| FR-007 | Account deletion with 14-day grace period | MEDIUM |
| FR-008 | Master Profile with all defined fields | HIGH |
| FR-009 | Multiple entries per repeatable section | HIGH |
| FR-010 | Auto-save within 3s, visible save indicator | HIGH |
| FR-011 | Profile photo upload (JPEG/PNG/WebP, max 5MB) | HIGH |
| FR-012 | Cameroonian format toggle | HIGH |
| FR-013 | Referee details stored and linkable | MEDIUM |
| FR-014 | GPA show/hide threshold, user-overridable | MEDIUM |
| UI-001 | Responsive 320px–1920px | HIGH |
| UI-004 | 44×44px minimum touch targets | MEDIUM |
| UI-005 | On-blur inline validation, ≤500ms | HIGH |
| UI-009 | Light/dark mode via OS preference | LOW |
| UI-010 | Initial page load ≤3s on 3G | HIGH |
| NFR-001 | LCP < 2.5s on 3G | HIGH |
| NFR-008 | DB read queries < 500ms (loading states should reflect this) | HIGH |
| NFR-024 | First document creatable within 15 min of registration | HIGH |
| NFR-025 | Human-readable errors in user's language | HIGH |
| NFR-028 | Auto-save with optimistic UI, graceful failure recovery | HIGH |
| NFR-029 | No data loss on refresh/navigation | HIGH |

---

## Route Map

```
/                          → Landing page (public)
/login                     → Login
/register                  → Register
/verify-email              → Email verification (token via URL param)
/forgot-password           → Request password reset
/reset-password            → Complete reset (token via URL param)
/dashboard                 → Authenticated home (protected)
/profile                   → Profile hub overview (protected)
/profile/personal          → Personal details (protected)
/profile/education         → Education entries (protected)
/profile/experience        → Work experience entries (protected)
/profile/skills            → Skills (protected)
/profile/certifications    → Certifications (protected)
/profile/projects          → Projects (protected)
/profile/volunteer         → Volunteer work (protected)
/profile/publications      → Publications (protected)
/profile/languages         → Languages (protected)
/profile/references        → References (protected)
/settings                  → Account settings (protected)
*                          → 404 Not Found
```

---

## App Shell & Routing Architecture

### Route Guards
Create a `<ProtectedRoute>` wrapper component:
- Reads auth state from global auth context/store
- If not authenticated → redirect to `/login` with `?redirect=<current-path>` so user is sent back after login
- Shows a full-page skeleton loader while auth state is being determined (prevents flash of login page for valid sessions)

### Layouts
Two root layouts:
1. **`<PublicLayout>`** — used for `/`, `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`
   - Sticky top navbar (logo left, nav links center, Login + Register buttons right)
   - Footer
   - No sidebar

2. **`<AppLayout>`** — used for all protected routes
   - Sticky top navbar (logo left, search placeholder center, notification bell + user avatar dropdown right)
   - Left sidebar for profile section navigation (collapsible on mobile)
   - Main content area with breadcrumb
   - No footer (except thin copyright bar)

### Auth Store (Zustand or React Context)
Stores: `user`, `session`, `isLoading`, `isAuthenticated`
- Persists session token in `localStorage` / `sessionStorage`
- On app boot, validates token with backend before setting `isAuthenticated = true`

---

## Pages

---

### 1. Landing Page

**Route:** `/`
**Layout:** `<PublicLayout>`
**Purpose:** Convert visitors to registered users. Must communicate DocuSmart's core value proposition for the Cameroonian market.

#### Navbar
- Logo text "DocuSmart" left-aligned
- Nav links: Features, Templates (placeholder, Phase 4), Pricing (placeholder, Phase 6), About
- Right: "Sign In" (ghost button) + "Get Started Free" (primary blue button)
- Sticky, transparent on top → white/dark background on scroll (using `IntersectionObserver` or scroll listener)
- Mobile: hamburger menu with slide-down drawer

#### Section 1 — Hero
- **Layout:** Two-column on ≥768px (60% left / 40% right), single-column on mobile
- **Left:**
  - Eyebrow label: "For Cameroon & Beyond" (small colored pill badge)
  - H1: "Build the CV That Gets You the Interview" (bold, 48–56px desktop)
  - Subtitle: 2-sentence value prop mentioning Cameroonian universities, bilingual FR/EN, and local payment (2 sentences max)
  - Primary CTA button: "Create Your CV Free" (blue, large)
  - Secondary CTA: "See Templates →" (text link)
  - Trust badges row (3 items, horizontal): ✓ Free forever plan · ✓ Bilingual FR / EN · ✓ MTN & Orange Money
- **Right:**
  - Mockup image of Horizon CV template
  - Two floating social proof mini-cards (absolutely positioned, slight rotation):
    - Card 1: "Generated in 3 minutes" with a star rating
    - Card 2: User quote from a Cameroonian university student
- **Below hero:** "Trusted by [N] professionals across Cameroon" with avatar row

#### Section 2 — How It Works (4 Steps)
- H2: "From Profile to Perfect CV in 4 Steps"
- Four numbered cards in a row (4-col desktop, 2-col tablet, 1-col mobile):
  1. Build Your Profile — Enter your info once
  2. Choose Your Context — Tell us the role and company
  3. Let AI Do the Work — Professional content, instantly
  4. Download & Apply — PDF or Word, ready to send
- Each card: step number (large, muted), icon/screenshot thumbnail, H3, short description

#### Section 3 — Features Grid (6 cards)
- H2: "Everything You Need, Nothing You Don't"
- 3-col desktop, 2-col tablet, 1-col mobile grid
- Cards (icon + H3 + description):
  1. One Master Profile — Fill once, use everywhere
  2. AI-Powered Writing — Claude API writes impact-first bullets
  3. Bilingual Output — French and English, natively
  4. 6 Professional Templates — ATS-optimised designs
  5. Pay Local — MTN MoMo & Orange Money
  6. Your Data, Your Privacy — GDPR-grade security

#### Section 4 — Template Preview Teaser
- H2: "Choose Your Professional Look"
- Horizontal scroll row on mobile, 3-col grid on desktop showing 3 template thumbnails (Horizon, Clean Slate, Blueprint)
- Each thumbnail: hover reveals "Use This Template" overlay button
- CTA: "Browse All Templates →" (links to `/templates` — placeholder for Phase 4)

#### Section 5 — Testimonials (3 cards)
- H2: "What Cameroonian Professionals Say"
- 3-col desktop, 1-col mobile
- Each card: quote, user name, role/university, star rating
- Use placeholder realistic testimonials matching target audience (UB student, UYCII graduate, working professional in Douala)

#### Section 6 — FAQ Accordion (6 items)
- H2: "Frequently Asked Questions"
- Max-width ~700px, centered
- Items:
  1. Is DocuSmart free?
  2. What languages are supported?
  3. Which payment methods are accepted?
  4. Can I create multiple document types?
  5. Is my data secure?
  6. Do generated CVs work with ATS systems?
- Radix UI `<Accordion>` component, single expand at a time

#### Section 7 — Final CTA Banner
- Background: near-black (`--ds-stone-900`)
- H2: "Start Your First Document Today — It's Free"
- CTA button: "Create My CV Free" (blue)
- Sub-text: "No credit card. No hidden fees. Cancel anytime."

#### Footer
- 4-column grid: DocuSmart (logo + tagline + socials), Product (links), Legal (Terms, Privacy), Contact
- Bottom bar: copyright + "Made for Cameroon 🇨🇲"

**Animations (Framer Motion):**
- Hero elements stagger-fade on mount (title → subtitle → CTA → trust badges → image)
- Feature cards fade-up on scroll intersection (`react-intersection-observer`)
- Testimonial cards fade-in on scroll
- Smooth scroll-to-section for nav links

---

### 2. Register Page

**Route:** `/register`
**Layout:** `<PublicLayout>` without footer, full-height centered card
**Purpose:** Create new account via email/password or Google OAuth.

#### Layout
- Centered card (max-width 420px), vertically centered on desktop, full-width on mobile
- DocuSmart logo above card
- Card: white background, `border` color, `radius-lg`

#### Content
1. **Header:** "Create your account" (H2) + "Already have an account? [Sign in]" link
2. **Google OAuth button** — full-width, outlined, Google logo icon, "Continue with Google"
3. **Divider:** "or continue with email"
4. **Form fields (react-hook-form + Zod):**
   - Full Name (text input) — required, min 2 chars
   - Email (email input) — required, valid email format
   - Password (password input with show/hide toggle) — required, min 8 chars, at least 1 uppercase, 1 number, 1 special char
   - Confirm Password — must match password field
   - **Password strength indicator** (4-segment bar below password field): Weak / Fair / Strong / Very Strong — computed from zxcvbn or custom regex
5. **Terms checkbox** — "I agree to the [Terms of Service] and [Privacy Policy]" — required to submit
6. **Submit button:** "Create Account" (primary blue, full-width, shows spinner on submit)
7. **Language toggle** at bottom: FR / EN (sets app language preference for new user)

#### Validation (on-blur, ≤500ms — FR-005, UI-005)
- Full Name: required
- Email: valid format, not already registered (server error handled gracefully)
- Password: complexity rule — show specific rule checklist below field that turns green as rules are met
- Confirm Password: must match
- Terms: must be checked

#### States
- Loading: button disabled with spinner
- Success: brief success toast → auto-redirect to `/verify-email`
- Error: server errors displayed as inline field-level errors or top-of-form alert

#### Notes
- After successful registration, user is NOT authenticated yet — they must verify email (FR-003)
- Redirect to `/dashboard` happens after email verification, not immediately after registration

---

### 3. Login Page

**Route:** `/login`
**Layout:** `<PublicLayout>` without footer, full-height centered card

#### Content
1. Header: "Welcome back" (H2) + "Don't have an account? [Sign up]" link
2. Google OAuth button (same as register)
3. Divider: "or"
4. Form:
   - Email (email input)
   - Password (password input with show/hide toggle)
   - "Forgot password?" link (right-aligned below password field)
5. Submit button: "Sign In" (primary blue, full-width)

#### Validation
- Email: required, valid format
- Password: required

#### States
- Loading: button disabled with spinner
- Success: redirect to `/dashboard` (or `?redirect` param if present)
- Error: "Invalid email or password" as a top-of-form error alert (do NOT indicate which field is wrong — security best practice)
- Account not verified: special error state with "Resend verification email" inline link

#### Rate Limiting UX (NFR-013)
- After 5 failed attempts, show CAPTCHA placeholder / "Too many attempts. Please wait 60 seconds" message

---

### 4. Email Verification Page

**Route:** `/verify-email`
**Layout:** `<PublicLayout>` without footer, full-height centered card

#### States

**State A — Just Registered (no token in URL)**
- Illustration / envelope icon
- H2: "Check your inbox"
- Body: "We sent a verification link to **[email]**. Click it to activate your account."
- "Resend verification email" button (with 60-second cooldown after click)
- "Wrong email? [Go back]" link

**State B — Token in URL (`?token=xxx`)**
- Show loading spinner while token is being verified
- On success: green checkmark, "Email verified! Redirecting to your dashboard…" → auto-redirect after 2s
- On failure (expired/invalid token): red icon, "This link has expired or is invalid.", "Request a new link" button

---

### 5. Forgot Password Page

**Route:** `/forgot-password`
**Layout:** `<PublicLayout>` without footer, centered card

#### Content
- H2: "Reset your password"
- Body: "Enter the email address linked to your account and we'll send you a reset link."
- Email input
- Submit button: "Send Reset Link"

#### States
- Loading: button spinner
- Success (regardless of whether email exists — prevents user enumeration): "If that email is registered, you'll receive a reset link shortly." — redirect user or just show this state
- Error: network/server error only

---

### 6. Reset Password Page

**Route:** `/reset-password`
**Layout:** `<PublicLayout>` without footer, centered card
**Query params:** `?token=xxx`

#### Content
- On mount: validate token with backend
  - If invalid/expired: show error state with "Request a new link" button
  - If valid: show form
- Form:
  - New password (with strength indicator)
  - Confirm new password
  - Submit: "Set New Password"

#### States
- Success: "Password updated! [Sign in now]" link
- Error: field-level validation + server errors

---

### 7. Dashboard

**Route:** `/dashboard`
**Layout:** `<AppLayout>`
**Purpose:** Authenticated home. Shows profile completion status, recent documents, and quick actions.

#### Layout Structure
- Full-width, single-column main content with responsive padding

#### Section 1 — Welcome Banner
- "Good morning, [First Name]" (H2)
- Sub: "Your profile is [N]% complete. A complete profile generates better AI documents."

#### Section 2 — Profile Completeness Card (visible if < 80% complete)
- Horizontal progress bar (0–100%)
- List of 3 incomplete sections with "Complete →" links
- Dismiss button (persisted in localStorage)

#### Section 3 — Quick Actions Row
- 3 action cards (icon + label):
  - "New Document" → links to `/documents/new` (Phase 2, but card visible with "Coming in next update" if not built yet — or show a modal)
  - "Complete Profile" → links to `/profile`
  - "Upload Photo" → opens photo upload dialog if no photo yet

#### Section 4 — Recent Documents (empty state in Phase 1)
- H3: "Your Documents"
- Empty state: illustration + "You haven't created any documents yet." + "Create Your First CV" button → `/documents/new`
- When Phase 2 is built: shows last 3 documents as cards (template thumbnail, doc type, last edited)

#### Section 5 — Profile Sections Status Grid
- 3-col desktop, 2-col tablet, 1-col mobile
- One mini card per profile section (Personal, Education, Experience, Skills, etc.)
- Each card: icon, section name, "Filled" (green pill) or "Empty" (gray pill) or "N entries"
- Click → navigates to that section's page

---

### 8. Profile Hub

**Route:** `/profile`
**Layout:** `<AppLayout>` with profile-specific left sub-navigation
**Purpose:** Overview of all profile sections; entry point to edit any section.

#### Left Sub-Nav (sidebar within `<AppLayout>`)
- Section links with completion dot indicator:
  - Personal Details ● (green if filled)
  - Education (N entries)
  - Work Experience (N entries)
  - Skills (N entries)
  - Certifications
  - Projects
  - Volunteer Work
  - Publications
  - Languages
  - References

#### Main Content — Profile Overview Card
- User avatar (large, 80px) + name + title (from personal details)
- Overall completeness progress bar (0–100)
- Completeness percentage + "X sections complete of 10"

#### Section Cards Grid
- 2-col desktop, 1-col mobile
- Each card: section name, number of entries or filled/empty status, last updated date, "Edit" button
- Clicking any card or "Edit" → navigates to that section's page

---

### 9. Profile — Personal Details

**Route:** `/profile/personal`
**Layout:** `<AppLayout>` with profile sub-nav active on "Personal Details"
**FR:** FR-008, FR-011, FR-012

#### Form Fields
All inputs use `react-hook-form` with Zod schema validation.

**Basic Info:**
- First Name (required), Last Name (required)
- Professional Title / Headline (e.g., "Software Engineer | University of Buea") — required
- Email address (display only, not editable here — goes to Settings)
- Phone Number (with country code selector — default +237)
- LinkedIn URL (optional, URL validation)
- Personal Website / Portfolio URL (optional)
- GitHub URL (optional)

**Profile Photo (FR-011):**
- Avatar upload area (drag-and-drop or click to browse)
- Accepted: JPEG, PNG, WebP; max 5MB
- Shows current photo or placeholder initials avatar
- On upload: shows crop/preview modal (simple, no heavy library needed — just preview)
- Remove photo option

**Location:**
- City (text input)
- Country (dropdown — default: Cameroon, includes all countries)

**Cameroonian Format Toggle (FR-012):**
- Toggle switch: "Cameroonian document format"
- Help text: "Enables nationality, date of birth, place of birth, and marital status fields — commonly required for Cameroonian and French-style CVs"
- When toggled ON, reveal:
  - Nationality (text, default: Cameroonian)
  - Date of Birth (date picker — restrict to reasonable range, 16–70 years ago)
  - Place of Birth (text input)
  - Marital Status (dropdown: Single, Married, Divorced, Widowed)

**Professional Summary (short bio):**
- Textarea (max 500 chars)
- Character counter
- Note: "This is your personal bio. The AI builder generates a tailored professional summary per document."

#### Auto-Save (FR-010)
- Debounced auto-save: 3 seconds after user stops typing
- Save indicator in top-right: "Saving…" (spinner) → "Saved ✓" (green) → idle
- On save failure: "Save failed — changes kept locally. Retrying…" with manual retry button
- NFR-028: optimistic UI — show saved state immediately, revert only if server returns error

#### Page Actions
- "Back to Profile" breadcrumb link
- No explicit save button needed (auto-save only)
- "Preview in Document" button (disabled in Phase 1, active in Phase 2)

---

### 10. Profile — Education

**Route:** `/profile/education`
**Layout:** `<AppLayout>` with profile sub-nav active
**FR:** FR-008, FR-009, FR-014

#### Layout
- Page header with section name + "Add Education" button (top-right, primary)
- Empty state: illustration + "No education entries yet." + "Add Your First Entry" button

#### Education Entry Card (when entries exist)
- Each entry displayed as a card with:
  - Institution name (bold) — recognises Cameroonian universities (FR-053, show in Phase 1 as plain input, auto-suggest added in Phase 3)
  - Degree type + field of study
  - Date range (start → end or "Present")
  - GPA/grade (if visible per threshold)
  - Description (truncated, expand on click)
  - Card actions: Edit (pencil icon) | Delete (trash icon) | Drag handle for reorder

#### Add / Edit Entry (in-page slide-over panel or modal)
Fields:
- Institution Name (text, required) — with autocomplete suggestions for Cameroonian universities
- Degree Type (dropdown: Bachelor's, Master's, PhD, HND, BTS, Professional Certificate, Other)
- Field of Study (text, required)
- Start Date (month/year picker)
- End Date (month/year picker OR "Ongoing" toggle)
- Location (City, Country — default Cameroon)
- GPA / Grade (text input)
  - GPA Display Toggle (FR-014): "Show grade in documents"
  - Default: visible only if ≥ 14/20 or 3.0/4.0
  - Manual override checkbox: "Always show regardless of grade"
- Description / Achievements (textarea, max 300 chars per entry)
- Honors/Awards for this degree (optional, chips input)

#### Actions
- Save Entry (validates form, auto-saves to profile)
- Cancel (discards changes)
- Delete (confirmation dialog before deletion)

#### Ordering
- Drag-and-drop reorder using HTML5 drag API or simple up/down buttons
- Most recent first by default

---

### 11. Profile — Work Experience

**Route:** `/profile/experience`
**Layout:** `<AppLayout>` with profile sub-nav active
**FR:** FR-008, FR-009

#### Entry Card Fields
- Job Title (required)
- Company Name (required)
- Employment Type (dropdown: Full-time, Part-time, Internship, Contract, Freelance, Volunteer)
- Start / End Date (same as education)
- Location (City, Country, or "Remote")
- Description / Bullet Points (textarea)
  - Note: "In the Document Builder, AI will rewrite these as impact-first bullet points"
- Key Achievements (optional, chips or bullet list)

#### Layout
Same pattern as Education: card list → slide-over add/edit form → auto-save

---

### 12. Profile — Skills

**Route:** `/profile/skills`
**Layout:** `<AppLayout>` with profile sub-nav active

#### Layout
- Two columns on desktop: Technical Skills | Soft Skills
- Each skill added as a chip/tag

#### Input
- Type skill name → press Enter or click Add → chip appears
- Each chip has a level selector on hover/focus: Beginner / Intermediate / Advanced / Expert (shown as dots or filled bar)
- Click chip X to remove
- Chips are drag-sortable

#### Skill Categories (optional, can toggle)
Predefined categories: Programming Languages, Frameworks, Tools, Design, Languages, Leadership, Communication, etc.

---

### 13. Profile — Certifications

**Route:** `/profile/certifications`

#### Fields per entry
- Certification Name, Issuing Organisation, Date Issued, Expiry Date (optional, "No expiry" toggle), Credential URL (optional)

---

### 14. Profile — Projects

**Route:** `/profile/projects`

#### Fields per entry
- Project Name (required)
- Description (textarea, max 300 chars)
- Role / Your Contribution
- Technologies Used (chips input)
- Project URL (optional)
- Start / End Date
- Status: Completed / Ongoing

---

### 15. Profile — Volunteer Work

**Route:** `/profile/volunteer`

#### Fields per entry
- Organisation, Role, Start / End Date, Description

---

### 16. Profile — Publications

**Route:** `/profile/publications`

#### Fields per entry
- Title, Authors (chips), Publication / Journal Name, Date, URL or DOI (optional), Description (optional)

---

### 17. Profile — Languages

**Route:** `/profile/languages`

#### Layout
- Language + Proficiency level pairs
- Proficiency: Native / Fluent / Professional / Conversational / Basic
- Default: French (Native) and English pre-filled if detected from browser locale, editable

---

### 18. Profile — References

**Route:** `/profile/references`
**FR:** FR-013

#### Fields per entry
- Referee Full Name (required)
- Job Title / Role (required)
- Institution / Company (required)
- Email Address (required, valid email format)
- Phone Number (optional)
- Relationship to You (dropdown: Direct Manager, Professor/Supervisor, Colleague, Client, Other)

#### Privacy note
- Info banner: "Reference contact details are never shared publicly. They appear only in documents you explicitly choose to include them in."

---

### 19. Account Settings

**Route:** `/settings`
**Layout:** `<AppLayout>` with tabs
**FR:** FR-006, FR-007

#### Tab 1 — General
- Display name / Full name (editable)
- Email address — show current email, "Change email" button → opens verification flow
- Interface language: English / French (dropdown)
- Date format preference: DD/MM/YYYY | MM/DD/YYYY
- Save button

#### Tab 2 — Security
- Current password, New password, Confirm new password form
- Password strength indicator
- Submit: "Update Password" button

#### Tab 3 — Notifications
- Email notification toggles:
  - Document export complete
  - Payment confirmation
  - Pro plan renewal reminder
  - Product updates & tips
- Each toggle: shadcn `<Switch>` component

#### Tab 4 — Danger Zone
- Section with red border
- "Delete Account" button — opens confirmation dialog:
  - Dialog H3: "Delete your account?"
  - Body: "All your profile data, documents, and settings will be permanently deleted after 14 days. This cannot be undone."
  - Requires user to type "DELETE" in a text field to confirm
  - Two buttons: "Cancel" (ghost) | "Delete My Account" (destructive red)
- On confirm: show success message "Account deletion scheduled. You have 14 days to change your mind. [Cancel Deletion]"

---

### 20. 404 Not Found Page

**Route:** `*`

- Simple centered layout
- Large "404" heading (muted)
- "Page not found" message
- "Go to Dashboard" or "Go Home" button depending on auth state

---

## Shared Components for Phase 1

| Component | Description |
|-----------|-------------|
| `<SaveIndicator>` | Auto-save status chip — "Saving…" / "Saved ✓" / "Failed, retrying…" |
| `<ProfileSectionCard>` | Reusable card for profile section list items (edit, delete, drag) |
| `<AddEntrySlideOver>` | Right-side slide-over panel for add/edit forms |
| `<ConfirmDialog>` | Reusable confirmation dialog (shadcn Dialog) |
| `<PasswordStrengthBar>` | 4-segment strength indicator below password inputs |
| `<OAuthButton>` | Google OAuth button (consistent style) |
| `<TrustBadge>` | Landing page checkmark badge pill |
| `<EmptyState>` | Illustration + message + CTA for empty lists |
| `<PageHeader>` | Section title + breadcrumb + primary action button |
| `<AppSidebar>` | Left sidebar with profile section links and completion dots |

---

## NFRs to Enforce in Phase 1

- **UI-001:** Every page must work without horizontal scroll from 320px to 1920px. Test at 320, 375, 768, 1024, 1280, 1920.
- **UI-004:** All buttons, inputs, toggles must be ≥44×44px tap target. Use Tailwind `min-h-11 min-w-11` (`44px = 2.75rem`).
- **UI-005:** Every form field validates on `blur` event. Errors appear ≤500ms. Use `mode: 'onBlur'` in react-hook-form config.
- **UI-009:** Dark mode. Use `@custom-variant dark` already in `index.css`. All components must use semantic tokens (`bg-background`, `text-foreground`, `bg-card`, etc.) — never hardcoded hex colors.
- **UI-010:** Landing page must achieve LCP < 2.5s. Use lazy loading for images (`loading="lazy"`), use WebP format for all images, defer non-critical JS.
- **NFR-025:** All error messages must be human-readable strings, not raw codes. Map all API error codes to friendly messages in a `messages.ts` file. Support both English and French via i18n from day one (use `react-i18next` or equivalent). All UI strings must go through the i18n layer.
- **NFR-028 / NFR-029:** Profile forms use optimistic updates via TanStack Query's `useMutation` with `onMutate` for instant UI feedback. On error, call `onError` to rollback. Store pending changes in `IndexedDB` via a simple `useOfflineSync` hook.
- **NFR-024:** The happy path from registration → profile fill → first document must be completable in < 15 minutes. Profile sections must have sensible defaults and minimal required fields.

---

## Implementation Notes

### Forms
- Use `react-hook-form` with `zodResolver` for all forms
- Define Zod schemas in a separate `/src/lib/schemas/` directory (e.g., `education.schema.ts`, `auth.schema.ts`)
- Use shadcn `<Form>`, `<FormField>`, `<FormItem>`, `<FormMessage>` components for consistent error display

### API Layer
- Use TanStack Query (`useQuery`, `useMutation`) for all data fetching
- Create a typed API client in `/src/lib/api/` with separate modules: `auth.api.ts`, `profile.api.ts`
- Use `axios` or `fetch` with interceptors for auth header injection and 401 handling

### State
- Auth state: Zustand store (`/src/store/auth.store.ts`)
- Profile state: TanStack Query cache (no additional global state needed)
- UI state (sidebar open/closed, active tab): local component state or URL params

### i18n
- Set up `react-i18next` from Phase 1 with locale files: `/src/locales/en.json` and `/src/locales/fr.json`
- All UI strings must be keys, not hardcoded English — enforced from day one
- Language preference persisted in user settings (FR-006) and `localStorage` for unauthenticated users

### Image Optimisation
- All landing page images: WebP format, `srcset` for responsive sizes
- Profile photos: compressed on upload (client-side canvas resize before upload if > 5MB)

### Animation
- Use Framer Motion `<motion.div>` for:
  - Landing page hero stagger animation (mount)
  - Feature cards fade-up on scroll (using `react-intersection-observer`)
  - Slide-over panel (slide from right)
  - Page transitions (simple fade)
