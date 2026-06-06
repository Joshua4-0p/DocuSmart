# FlowCV — Complete UI/UX Design Analysis

> **Purpose:** Reference document for building a similar (but improved) SaaS product interface.
> **Source:** [flowcv.com](https://flowcv.com) — analyzed June 2026
> **Company:** Uniqkorn Creative GmbH, Vienna, Austria

---

## Table of Contents

1. [Site Map & Page Inventory](#1-site-map--page-inventory)
2. [Design System & Color Palette](#2-design-system--color-palette)
3. [Typography System](#3-typography-system)
4. [Layout & Grid System](#4-layout--grid-system)
5. [Component Library](#5-component-library)
6. [Page-by-Page Breakdown](#6-page-by-page-breakdown)
7. [UX Patterns & Interactions](#7-ux-patterns--interactions)
8. [Content & Copy Strategy](#8-content--copy-strategy)
9. [Strengths & Weaknesses](#9-strengths--weaknesses)
10. [Recommendations for a Better Interface](#10-recommendations-for-a-better-interface)

---

## 1. Site Map & Page Inventory

### Marketing Site (`flowcv.com`)

| Page                             | Route                           | Purpose                                                |
| -------------------------------- | ------------------------------- | ------------------------------------------------------ |
| **Landing / Home**               | `/`                             | Primary conversion — resume builder pitch              |
| **Resume Templates**             | `/resume-templates`             | Template gallery with category filters (50+ templates) |
| **AI Resume Builder**            | `/ai-resume-builder`            | Feature marketing for AI writing assistant             |
| **Cover Letter Builder**         | `/cover-letter-builder`         | Feature marketing for cover letter tool                |
| **Cover Letter Templates**       | `/cover-letter-templates`       | Template gallery (53 templates)                        |
| **Job Tracker**                  | `/job-tracker`                  | Feature marketing for Kanban-based job tracker         |
| **About**                        | `/about`                        | Team story, mission, values                            |
| **Terms of Service**             | `/terms-of-service`             | Legal — 11 sections                                    |
| **Privacy Policy**               | `/privacy-policy`               | GDPR compliance details                                |
| **Individual Template Pages**    | `/resume-template/[slug]`       | Per-template detail/preview                            |
| **Individual CL Template Pages** | `/cover-letter-template/[slug]` | Per-template detail/preview                            |

### Application (`app.flowcv.com`)

| Page                    | Route            | Purpose                         |
| ----------------------- | ---------------- | ------------------------------- |
| **Pricing**             | `/pricing`       | Plan comparison and checkout    |
| **Login**               | `/login`         | Authentication                  |
| **Resume Editor**       | `/resumes`       | Core app — resume builder       |
| **Cover Letter Editor** | `/cover-letters` | Core app — cover letter builder |

### Architecture Pattern

- **Separation of concerns:** Marketing site (flowcv.com) is separate from the application (app.flowcv.com)
- Static marketing pages redirect to the app subdomain for authenticated features
- `/pricing` on the marketing site 301-redirects to `app.flowcv.com/pricing`

---

## 2. Design System & Color Palette

### Primary Colors (Inferred)

| Role                       | Color                                        | Usage                            |
| -------------------------- | -------------------------------------------- | -------------------------------- |
| **Primary / CTA**          | Vibrant Blue (`~#2563EB` to `#3B82F6` range) | Buttons, links, active states    |
| **Primary Dark**           | Deep Navy (`~#1E3A5F`)                       | Headers, hero backgrounds        |
| **Accent**                 | Warm Gold/Saffron (`~#F59E0B`)               | Star ratings, highlights, badges |
| **Success**                | Green (`~#10B981`)                           | Checkmarks, positive indicators  |
| **Background — Primary**   | Pure White (`#FFFFFF`)                       | Main content areas               |
| **Background — Secondary** | Light Gray (`~#F9FAFB` to `#F3F4F6`)         | Section alternation, cards       |
| **Text — Primary**         | Near Black (`~#111827` to `#1F2937`)         | Headings, body copy              |
| **Text — Secondary**       | Medium Gray (`~#6B7280`)                     | Subtitles, descriptions          |
| **Text — Muted**           | Light Gray (`~#9CA3AF`)                      | Placeholders, meta info          |
| **Border**                 | Very Light Gray (`~#E5E7EB`)                 | Card borders, dividers           |

### Template-Derived Color Names

The template naming reveals their design color palette vocabulary:

- **Blues:** Atlantic Blue, Cobalt Edge, Blue Steel, Blue Neon, Simply Blue
- **Greens:** Hunter Green, Classic Green, Sophisticated Green
- **Warm tones:** Saffron Line, Coral Navy, Rosewood, Desert Rock
- **Neutrals:** Mercury Flow, Quicksilver, Silver, Charcoal Glow, Monochrome
- **Florals/Soft:** Lavender, Powder Blush, Minty, Flora, Viola, Pastel

### Color Strategy

- Minimal use of color on marketing pages — relies on whitespace and typography
- Blue as the dominant brand color for trust and professionalism
- Emoji used as color accents instead of icons (cost-effective, lightweight)
- Template previews provide visual color diversity across the page

---

## 3. Typography System

### Font Stack

- **Headings:** Bold sans-serif (likely Inter, Plus Jakarta Sans, or similar modern geometric sans-serif)
- **Body:** Regular-weight sans-serif, optimized for readability
- **Monospace:** Not used on marketing pages

### Scale (Estimated)

| Level               | Size    | Weight           | Usage                            |
| ------------------- | ------- | ---------------- | -------------------------------- |
| **H1**              | 48–56px | 800 (Extra Bold) | Page hero headlines              |
| **H2**              | 32–40px | 700 (Bold)       | Section titles                   |
| **H3**              | 20–24px | 600 (Semi Bold)  | Feature card titles, subsections |
| **Body Large**      | 18px    | 400 (Regular)    | Hero subtitles, lead paragraphs  |
| **Body**            | 16px    | 400 (Regular)    | Standard paragraphs              |
| **Small / Caption** | 14px    | 400–500          | Meta text, badges, footer links  |
| **Tiny**            | 12px    | 500              | Legal text, copyright            |

### Typography Patterns

- **Bold inline emphasis** used within paragraphs for scannability
- Section headers are concise (3–6 words)
- No all-caps text observed — title case for headings
- Line height appears generous (~1.6–1.75) for body text

---

## 4. Layout & Grid System

### Container

- **Max width:** ~1200px (standard centered container)
- **Horizontal padding:** ~24px mobile, ~48px desktop
- **Section vertical spacing:** ~80–120px between major sections

### Grid Patterns

| Pattern                 | Columns | Usage                                           |
| ----------------------- | ------- | ----------------------------------------------- |
| **Single column**       | 1       | Hero sections, about page, legal pages          |
| **Two column**          | 2       | Hero with image (60/40 split), feature + visual |
| **Three column**        | 3       | Feature highlight cards, step process           |
| **Four column**         | 4       | How-it-works steps (home page)                  |
| **Six column**          | 6       | Template gallery grid (desktop), feature grids  |
| **Responsive collapse** | 6→3→2→1 | Templates grid on smaller viewports             |

### Section Pattern (Repeated)

Every major section follows this structure:

```
[Section Heading — centered H2]
[Subtitle paragraph — centered, max-width ~600px]
[Content grid / cards / visual]
[Optional CTA link]
```

---

## 5. Component Library

### Navigation Bar

- **Position:** Sticky top
- **Height:** ~64px
- **Layout:** Logo (left) — Nav links (center-right) — Auth buttons (far right)
- **Logo:** Text-based "FlowCV"
- **Nav links:** 4 items (Resume Builder, Resume Templates, Pricing, About)
- **Auth:** "Login" (text/ghost) + "Start now" (filled primary button)
- **Mobile:** Likely hamburger menu (not verified)

### Buttons

| Variant         | Style                                         | Usage                                  |
| --------------- | --------------------------------------------- | -------------------------------------- |
| **Primary CTA** | Filled blue, rounded, emoji suffix (✨ or 🚀) | Hero sections, major conversion points |
| **Secondary**   | Outlined or ghost, blue text                  | Login, secondary actions               |
| **Text Link**   | Underline on hover, blue                      | Inline navigation, "See more"          |
| **Nav Button**  | Filled, smaller padding                       | Header "Start now"                     |

### Cards

| Type                           | Structure                                        | Interaction                          |
| ------------------------------ | ------------------------------------------------ | ------------------------------------ |
| **Template Preview Card**      | Thumbnail image + name label                     | Hover reveals "See Template" overlay |
| **Feature Card**               | Icon/emoji + H3 title + description paragraph    | Static (no hover effect noted)       |
| **Testimonial Card**           | Quote text + author name + source platform badge | Static                               |
| **Social Proof Floating Card** | Platform logo + star rating + snippet            | Floating/positioned over hero images |
| **Step Card**                  | Number + screenshot + H3 + paragraph             | Sequential, numbered                 |

### Trust Badges

- Row of 3 horizontal badges below hero CTA
- Structure: Checkmark icon + short text
- Examples: "1st resume, free forever" / "Privacy & GDPR compliant" / "Professional Templates"

### FAQ Accordion

- 5–10 expandable Q&A items per page
- Click to expand/collapse
- Used on: Home, Cover Letter Builder, Job Tracker pages

### Social Proof Bar

- Platform logos (Google, Trustpilot, Product Hunt) with star ratings
- Inline rating numbers (4.8, 4.9, 4.9)
- Links to external review pages

### Category Filter Tabs

- Horizontal pill/tab navigation
- Hash-based anchor links for in-page scrolling
- Active state highlight (likely underline or filled background)
- Used on: Resume Templates (7 categories), Cover Letter Templates (3 categories)

---

## 6. Page-by-Page Breakdown

### 6.1 Home Page (`/`)

**Sections (top to bottom):**

1. **Hero Section (Two-column)**
   - Left: H1 "Free Online Resume Builder" + subtitle + primary CTA "Get started for free ✨" + trust badges row
   - Right: Resume mockup image + floating social proof cards (Product Hunt review, TikTok mention)
   - Below: User count — "Trusted by 5.3 million users" with composite face images

2. **How It Works (4 steps)**
   - Sequential numbered cards with screenshots
   - Step 1: Pick template → Step 2: Fill in details → Step 3: Customize design → Step 4: Download PDF

3. **Template Gallery Teaser**
   - Grid of 16 template thumbnails (of 50+ total)
   - CTA: "All Resume Templates" link to gallery page

4. **Free Plan Features (6-card grid)**
   - No watermarks, no branding, unlimited PDFs, GDPR compliance, multilingual, ATS-friendly
   - Each card: icon + heading + paragraph

5. **Testimonials (10 reviews)**
   - Mixed sources: Google Reviews, Trustpilot, Product Hunt, Reddit, LinkedIn
   - Card layout with attribution

6. **FAQ Accordion (10 items)**
   - Covers: pricing, ATS, languages, privacy, import, templates

7. **Footer**

**Conversion Points:** 3 CTAs (hero, mid-page, template gallery link)

---

### 6.2 Resume Templates (`/resume-templates`)

**Sections:**

1. **Hero**
   - H1 centered + subtitle
   - Trust strip: "Unlimited PDF downloads • No watermarks • No paywalls • No hidden fees • Yes, really 🚀"

2. **Category Filter Tabs**
   - 7 tabs: Popular, Simple, Modern, Creative, Photo, Compact, First Job
   - Anchor-based navigation (`#popular`, `#simple`, etc.)

3. **Per-Category Sections (×7)**
   - H2 category name
   - Description with "Ideal for:" bold callout
   - 6 image template cards + overflow as text-only links
   - "See More" toggle expander
   - "[Category] Resume Examples" subsection with 9 role-specific links

4. **Footer**

**Template Count:** 50+ resume templates
**Card Grid:** 6 columns desktop, responsive collapse

---

### 6.3 AI Resume Builder (`/ai-resume-builder`)

**Sections:**

1. **Hero** — Large screenshot + H1 "The Magic of AI Resume Building" + CTA
2. **3-column Feature Highlights** — Contextual AI Suggestions, Skills Optimization, Match Job Requirements (🔮 coming soon)
3. **6-card Feature Grid** — AI writing helper, smart skills curator, job matcher, grammar cop, qualifications optimizer, AI coach (2 marked 🔮 coming soon)
4. **Mid-page CTA Banner** — "Unlock Your AI Resume Superpowers" with rocket emoji
5. **Footer**

**Unique Pattern:** 🔮 emoji used as "Coming Soon" badge on unreleased features

---

### 6.4 Cover Letter Builder (`/cover-letter-builder`)

**Sections:**

1. **Hero** — H1 "Free Cover Letter Generator" + H2 "Craft Impactful Cover Letters" + social proof (Product Hunt, TikTok, user count) + CTA "Take Action - It's free ✨"
2. **3-step Process** — Create → Customize → Download
3. **Template Gallery Link** — "See all templates"
4. **6-card Feature Grid** — Design freedom, free forever, data security, multilingual, tailored, simple editing
5. **FAQ (5 items)**
6. **Final CTA** — "Get started now 🚀"
7. **Footer**

**Key Differentiator:** Resume ↔ Cover Letter sync emphasized in 3+ sections

---

### 6.5 Cover Letter Templates (`/cover-letter-templates`)

**Sections:**

1. **Hero** — H1 centered + subtitle
2. **3 Filter Tabs** — Simple, Modern, Creative
3. **Template Card Grid** — 53 templates, 3–4 column responsive grid
4. **CTA Section**
5. **Footer**

---

### 6.6 Job Tracker (`/job-tracker`)

**Sections:**

1. **Hero** — Screenshot of tracker UI + H1 "Job Application Tracker" + CTA "Start tracking jobs ✨"
2. **3-step Walkthrough** — Add Job Details → Upload Documents → Track Status
3. **Kanban Board UI** — 5 columns: Wishlist → Applied → Interviewing → Offer Received → Rejected
4. **6-card Feature Grid** — Easy saving, status tracking, cross-device, task management, market insights, performance tracking
5. **4 Expandable Benefits** — Centralized tracking, status visibility, document storage, task management
6. **FAQ (3 items)**
7. **Final CTA** — "Don't chase your dream job – land it!" + "Get started now 🚀"
8. **Footer**

---

### 6.7 About (`/about`)

**Sections:**

1. **Hero** — H1 "Why We Created FlowCV" + narrative introduction
2. **Mission/Team** — "Small, quality-oriented team" of indie developers
3. **Differentiators** — Anti-competitor positioning (vs Canva, Word, Adobe)
4. **Social Proof Bar** — Google 4.8⭐, Trustpilot 4.9⭐, Product Hunt 4.9⭐
5. **CTA**
6. **Partnership Outreach** — Unique for an About page
7. **Footer**

**Design:** Text-only page — no images, illustrations, or photography. Uses emoji as visual ornamentation.

**Storytelling Arc:** Problem → Solution → Credibility → Action

---

### 6.8 Legal Pages

- **Terms of Service** — 11 numbered sections, dense legal text, standard layout
- **Privacy Policy** — GDPR-focused, data handling details

---

## 7. UX Patterns & Interactions

### Conversion Strategy

- **Multiple CTA touchpoints** per page (hero + mid-page + footer CTA)
- **Progressive disclosure** — template galleries show 6 images first, then text-only overflow with "See More"
- **Social proof layered** — platform reviews + user count + floating cards simultaneously
- **Trust-first messaging** — "free forever" + "no watermarks" + GDPR badges appear before any feature pitch

### Navigation Patterns

- **Sticky header** with persistent "Start now" CTA
- **Hash-based category filtering** on template pages (no full page reload)
- **301 redirects** from marketing routes to app routes for authenticated features

### Interactive Elements

- FAQ accordion expand/collapse
- Template card hover states (overlay reveal)
- "See More" toggle expanders
- Category tab switching (anchor scrolling)
- Kanban drag-and-drop in the job tracker app

### Performance Patterns

- WebP images for hero visuals
- JPEG thumbnails for template previews (960px width)
- CDN-hosted assets (`prod.flowcvassets.com`, `assets.flowcvassets.com`)
- Progressive disclosure reduces initial page weight
- Cloudflare email obfuscation for contact links

---

## 8. Content & Copy Strategy

### Tone

- **Friendly & approachable** — conversational, not corporate
- **Empowering** — "Take control," "Unlock superpowers," "Land your dream job"
- **Transparent** — explicitly calls out what's free vs paid, anti-upselling stance

### Emoji Usage

- ✨ (sparkle) — primary CTAs ("Get started for free ✨")
- 🚀 (rocket) — secondary CTAs ("Get started now 🚀")
- 🔮 (crystal ball) — "Coming soon" features
- ⭐ (star) — ratings
- ✅ (checkmark) — feature lists
- 👉 (pointing) — bullet emphasis
- 😉 (wink) — playful copy moments

### Recurring Copy Patterns

- "Free forever" / "No tricks, no traps"
- "No watermarks, no branding"
- "GDPR compliant"
- "Trusted by 5.3 million users"
- "Mozart, not kangaroos" (Austria brand identity joke, used in every footer)

### Anti-Competitor Positioning

Direct comparisons drawn against Canva, Word, and Adobe on the About page — framing FlowCV as purpose-built vs. generic tools.

---

## 9. Strengths & Weaknesses

### Strengths

| Area                  | Detail                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Trust building**    | Social proof from multiple platforms (Google, Trustpilot, Product Hunt, Reddit, TikTok) layered throughout |
| **Content clarity**   | Clear "How it works" steps with screenshots                                                                |
| **Template volume**   | 50+ resume + 53 cover letter templates — strong selection                                                  |
| **Transparency**      | Honest free-tier messaging with no hidden upsells                                                          |
| **Performance**       | WebP images, CDN delivery, progressive disclosure                                                          |
| **Brand personality** | Playful emoji use + Austrian identity adds warmth                                                          |
| **SEO**               | Category pages + individual template pages + role-specific examples                                        |

### Weaknesses

| Area                  | Detail                                                                              | Improvement Opportunity                                                |
| --------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Visual monotony**   | Marketing pages are mostly text-heavy with minimal illustrations or custom graphics | Add custom illustrations, micro-animations, or interactive demos       |
| **About page**        | No team photos, no visuals at all — pure text feels impersonal                      | Add team imagery, office photos, or illustrated brand story            |
| **Color system**      | Extremely muted — relies almost entirely on blue + white                            | Introduce a richer accent palette with gradients or secondary colors   |
| **Template previews** | Static JPEG thumbnails — no interactive preview                                     | Add live preview, hover animations, or template customization previews |
| **Mobile experience** | No evidence of mobile-specific optimizations beyond responsive grid                 | Design mobile-first with thumb-friendly interactions                   |
| **Dark mode**         | No dark mode support observed                                                       | Implement system-preference-aware dark theme                           |
| **Onboarding**        | Direct jump from marketing to app — no guided onboarding                            | Add interactive onboarding wizard or demo mode                         |
| **Pricing page**      | Returns empty content (SPA-rendered) — SEO and accessibility issue                  | Server-side render pricing for SEO and no-JS users                     |
| **Navigation depth**  | Only 4 nav links — some products hidden in footer only                              | Surface all products in a mega-menu or dropdown                        |
| **Accessibility**     | Emoji used as UI indicators (🔮 for coming soon) — not screen-reader friendly       | Use proper badge components with aria-labels                           |
| **Feature discovery** | AI features, cover letters, and job tracker are buried                              | Create a unified product overview or features hub page                 |
| **Animation**         | Minimal motion — pages feel static                                                  | Add scroll-triggered animations, transitions, and micro-interactions   |
| **Personalization**   | Same experience for all visitors                                                    | Add industry-specific landing pages or template recommendations        |

---

## 10. Recommendations for a Better Interface

### 10.1 Enhanced Color System

```
Primary Palette:
  --primary-50:   #EFF6FF    (lightest blue tint)
  --primary-100:  #DBEAFE
  --primary-200:  #BFDBFE
  --primary-300:  #93C5FD
  --primary-400:  #60A5FA
  --primary-500:  #3B82F6    (primary blue)
  --primary-600:  #2563EB    (CTA blue)
  --primary-700:  #1D4ED8
  --primary-800:  #1E40AF
  --primary-900:  #1E3A8A    (darkest blue)

Accent Palette:
  --accent-400:   #A78BFA    (violet — for premium features)
  --accent-500:   #8B5CF6
  --accent-600:   #7C3AED

Warm Accent:
  --warm-400:     #FB923C    (orange — for alerts, highlights)
  --warm-500:     #F97316

Success:
  --success-500:  #22C55E
  --success-600:  #16A34A

Neutrals:
  --gray-50:      #F9FAFB
  --gray-100:     #F3F4F6
  --gray-200:     #E5E7EB
  --gray-300:     #D1D5DB
  --gray-400:     #9CA3AF
  --gray-500:     #6B7280
  --gray-600:     #4B5563
  --gray-700:     #374151
  --gray-800:     #1F2937
  --gray-900:     #111827

Dark Mode:
  --dark-bg:      #0F172A
  --dark-surface: #1E293B
  --dark-border:  #334155
  --dark-text:    #F1F5F9
```

### 10.2 Better Page Structure

Add these pages FlowCV is missing:

- **Features Hub** (`/features`) — unified overview of all tools
- **Use Cases** (`/use-cases`) — industry/role-specific landing pages
- **Blog/Resources** (`/blog`) — SEO content, career guides
- **Changelog** (`/changelog`) — build transparency and trust
- **Interactive Demo** (`/demo`) — try-before-signup experience

### 10.3 Improved Component Patterns

| FlowCV Approach                 | Better Alternative                                              |
| ------------------------------- | --------------------------------------------------------------- |
| Static JPEG template thumbnails | Interactive live previews with hover customization              |
| Plain text "See More" toggle    | Animated accordion with smooth height transitions               |
| Emoji as UI indicators (🔮)     | Proper badge components (`<Badge variant="coming-soon">`)       |
| Text-only About page            | Illustrated timeline with team photos and milestone markers     |
| Single sticky header            | Context-aware header that transforms on scroll (compact mode)   |
| Basic FAQ accordion             | Searchable FAQ with category filters                            |
| Hash-based category tabs        | Animated tab bar with smooth content transitions and URL params |
| Floating social proof cards     | Animated testimonial carousel with platform verification badges |

### 10.4 Motion & Animation

Add scroll-triggered animations:

- **Hero elements** — staggered fade-in on load (title → subtitle → CTA → image)
- **Feature cards** — fade-up on scroll intersection
- **Template grid** — staggered reveal animation
- **Numbers/stats** — count-up animation (e.g., "5.3 million" counts up from 0)
- **Page transitions** — smooth route transitions with shared layout animations
- **Micro-interactions** — button hover scales, card lift shadows, tab slide indicators

### 10.5 Improved Navigation

```
Desktop Nav:
  Logo | Products ▾ | Templates ▾ | Pricing | About | [Login] [Start Free →]

Products Dropdown (Mega Menu):
  ┌─────────────────────────────────────────────────┐
  │ Resume Builder     │ Cover Letter Builder        │
  │ AI features, 50+   │ Matching templates,         │
  │ templates           │ sync with resume            │
  │                     │                             │
  │ Job Tracker         │ AI Writing Assistant        │
  │ Kanban board,       │ Smart suggestions,          │
  │ document storage    │ skills optimization         │
  └─────────────────────────────────────────────────┘

Templates Dropdown:
  ┌─────────────────────────────────────────────────┐
  │ Resume Templates (50+)                          │
  │ Simple | Modern | Creative | Compact            │
  │                                                 │
  │ Cover Letter Templates (53)                     │
  │ Simple | Modern | Creative                      │
  └─────────────────────────────────────────────────┘
```

### 10.6 Dark Mode Support

- System preference detection via `prefers-color-scheme`
- Manual toggle in header
- All components should have dark variants
- Template previews should maintain their own colors (not be inverted)

### 10.7 Accessibility Improvements

- Replace emoji indicators with semantic HTML badges + `aria-label`
- Ensure all interactive elements have visible focus states
- Template images need descriptive alt text (not just template names)
- Color contrast ratio ≥ 4.5:1 for all text
- Keyboard navigation for template galleries and FAQ accordions
- Screen reader announcements for filter/tab state changes

---

## Appendix: Template Inventory

### Resume Templates by Category

**Simple:** Classic Clear, Precision Line, Steady Form, Classic Serif, Executive, Compact Serif, Mono Underline

**Modern:** Atlantic Blue, Mercury Flow, Saffron Line, Quicksilver, Hunter Green, Cobalt Edge, Blue Steel

**Creative:** Leaves, Blue Neon, Coral Navy, Flower, Space, Typewriter

**Compact:** Condensed Rule, Clean Slate, Charcoal Glow, Confident Grid

**+ Photo, Popular, First Job categories** (additional templates)

### Cover Letter Templates (53 total)

Organized by: Simple, Modern, Creative
Naming conventions: Color-based, layout-based (one-column, two-column, multi-column), style-based (serif, sans-serif, monochrome)

---

_Document generated for design reference. Use as a foundation — aim to exceed FlowCV's execution in every dimension outlined in Section 10._
