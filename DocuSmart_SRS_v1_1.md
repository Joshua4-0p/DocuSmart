# DocuSmart
## AI-Powered Career Document Builder

### SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

| | |
|---|---|
| **Version** | 1.1 |
| **Prepared by** | DocuSmart Development Team |
| **Date** | June 2025 |
| **Classification** | Confidential |

---

## Document Revision History

| Version | Date | Description | Author(s) |
|---------|------|-------------|-----------|
| 1.0 | June 2025 | Initial SRS document release | DocuSmart Dev Team |
| 1.1 | June 2025 | Updated tech stack: React+Vite frontend, TypeScript/Prisma backend, Supabase confirmed; AI usage limits revised (2 improvements/day) | DocuSmart Dev Team |

---

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Document Conventions](#12-document-conventions)
  - [1.3 Intended Audience](#13-intended-audience)
  - [1.4 Project Scope](#14-project-scope)
  - [1.5 References](#15-references)
- [2. Overall Description](#2-overall-description)
  - [2.1 Product Perspective](#21-product-perspective)
  - [2.2 Product Functions](#22-product-functions)
  - [2.3 User Classes and Characteristics](#23-user-classes-and-characteristics)
  - [2.4 Operating Environment](#24-operating-environment)
  - [2.5 Design and Implementation Constraints](#25-design-and-implementation-constraints)
  - [2.6 Assumptions and Dependencies](#26-assumptions-and-dependencies)
- [3. Specific Requirements](#3-specific-requirements)
  - [3.1 External Interface Requirements](#31-external-interface-requirements)
  - [3.2 Functional Requirements](#32-functional-requirements)
  - [3.3 Non-Functional Requirements](#33-non-functional-requirements)
- [4. System Architecture Overview](#4-system-architecture-overview)
  - [4.1 Architectural Pattern](#41-architectural-pattern)
  - [4.2 MVP Build Phases](#42-mvp-build-phases)
  - [4.3 Data Model Summary](#43-data-model-summary)
- [5. Appendices](#5-appendices)
  - [5.1 Appendix A — Glossary of Terms](#51-appendix-a--glossary-of-terms)
  - [5.2 Appendix B — Requirements Traceability Matrix Summary](#52-appendix-b--requirements-traceability-matrix-summary)
  - [5.3 Appendix C — Document Type Specifications](#53-appendix-c--document-type-specifications)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the complete functional and non-functional requirements for DocuSmart, an Artificial Intelligence (AI)-powered career document builder. The purpose of this document is to provide a comprehensive, unambiguous, and testable specification that serves as the contractual baseline between the development team, project stakeholders, and quality assurance personnel throughout the full software development lifecycle.

DocuSmart is designed to address the pervasive challenge faced by students, graduates, and working professionals in Cameroon and across Francophone and Anglophone Africa — the inability to produce tailored, high-quality career documents for diverse application contexts. This specification governs the development of a web-based platform that uses a centralised Master Profile and an AI-driven context engine to generate professionally formatted career documents including CVs, cover letters, motivation letters, recommendation letters, and research proposals, among others.

The domain of application is career development, professional documentation, and AI-assisted writing within the African higher education and employment market. The platform targets a primary market of Cameroonian users and extends its scope to the broader Central and West African region.

---

### 1.2 Document Conventions

This document adheres to the IEEE Std 830-1998 standard for Software Requirements Specifications. The following conventions apply throughout this document:

- Requirement identifiers follow the format `[CATEGORY-NNN]`, where CATEGORY denotes the requirement type (e.g., FR for Functional Requirement, NFR for Non-Functional Requirement, UI for User Interface) and NNN is a three-digit sequential number (e.g., FR-001, NFR-003).

- The terms **"shall"** and **"must"** indicate mandatory requirements. The terms **"should"** and **"may"** indicate recommended or optional behaviours.

- Headings follow a hierarchical numbering system (e.g., 3.2.1 denotes Chapter 3, Section 2, Subsection 1).

- Technical terms and acronyms are defined upon first use. A reference glossary is maintained in Appendix A.

- Priority levels for requirements are classified as:
  - **HIGH** — must be implemented for MVP launch
  - **MEDIUM** — required before general release
  - **LOW** — desirable for future iterations

- All monetary values are expressed in Central African CFA Francs (XAF) unless stated otherwise.

---

### 1.3 Intended Audience

This document is intended for the following stakeholder groups:

- **Software Developers and Engineers** — Responsible for implementing the system architecture, backend services, frontend interfaces, and AI integration described in this document.

- **Project Managers** — Use this document as the master reference for scope definition, sprint planning, milestone tracking, and change control.

- **Quality Assurance (QA) Engineers and Testers** — Use the specific requirements and defined test criteria herein to develop test cases, acceptance criteria, and validation procedures.

- **UI/UX Designers** — Reference the user interface requirements and user class definitions to design appropriate wireframes, prototypes, and final interface implementations.

- **Product Owners and Business Stakeholders** — Use this document to verify that the system to be built aligns with the commercial objectives and market strategy of DocuSmart.

- **Third-Party Integrators** — Vendors and service providers (e.g., FedaPay, Monetbil, Anthropic API) who must understand the integration requirements of their respective services within the DocuSmart ecosystem.

Technical familiarity with software engineering principles is assumed for the development and QA audiences. Business stakeholders may reference the product overview and functional requirements sections without requiring detailed technical knowledge.

---

### 1.4 Project Scope

DocuSmart is a web-based, AI-powered career document platform whose core value proposition is encapsulated in the tagline:

> **One Profile. Infinite Tailored Applications. Zero Blank Page Anxiety.**

The platform enables users to create a single Master Profile containing all their professional, academic, and personal information. Using a proprietary Context Engine powered by the Claude API (Anthropic), the system generates fully tailored, professionally formatted career documents for specific roles, institutions, and application contexts — without requiring users to re-enter their data.

#### Within Scope

- User registration, authentication, and account management.
- Master Profile creation and management (personal details, education, work experience, skills, certifications, projects, and references).
- AI-powered document generation for eight distinct document types: CV/Resume, Cover Letter, Motivation Letter, Recommendation Letter, Personal Statement, Research Proposal, Expression of Interest/Vision Statement, and Writing Sample.
- Six professionally designed, customisable CV templates with live preview functionality.
- A ten-step guided document builder with real-time split-screen preview.
- Context Engine inputs including target role, company type, country/region, and optional job description (JD) pasting.
- Document export in PDF and DOCX formats, and shareable public profile links.
- Freemium subscription model with payment processing via MTN Mobile Money and Orange Money (FedaPay/Monetbil gateways).
- Bilingual document generation (French and English).
- Localisation features for the Cameroonian and broader Central/West African market.
- Premium features including JD scanner, AI strength scorer, applications log, bundle export, interview coach, and version history.

#### Out of Scope

- Direct job board integration or automated application submission to external recruitment platforms.
- Human review or editing services.
- Mobile native applications (iOS/Android) — the initial release targets mobile-responsive web browsers only.
- Integration with academic institution information systems or external credential verification services.

---

### 1.5 References

The following documents and standards were consulted in the preparation of this SRS:

- IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.
- DocuSmart Product Specification v1.0 (internal document, June 2025).
- Anthropic Claude API Documentation: https://docs.anthropic.com/
- Supabase Documentation: https://supabase.com/docs
- FedaPay API Documentation: https://docs.fedapay.com/
- Monetbil API Documentation: https://www.monetbil.com/api/
- React Documentation: https://react.dev/
- Vite Build Tool Documentation: https://vitejs.dev/
- OWASP Top Ten (2021) — Web Application Security Risks.
- GDPR General Data Protection Regulation (EU) 2016/679 — referenced for international data protection best practices.

---

## 2. Overall Description

### 2.1 Product Perspective

DocuSmart operates as an independent web-based Software-as-a-Service (SaaS) platform. It is not a component of a larger existing system; however, it depends on and integrates with a set of external services and APIs to deliver its full functionality.

The system is structured around a three-layer internal architecture:

- **Layer 1 — Master Profile:** The centralised data repository of all user professional information. This layer acts as the single source of truth from which all document generation is derived.

- **Layer 2 — Context Engine:** The AI-driven decision layer that accepts application-specific inputs (target role, company type, region, language, and optional JD text) and determines which profile elements to include, how to frame them, and what tone and structure to apply.

- **Layer 3 — Document Generator:** The output layer that renders structured, formatted documents by interfacing with the Claude API (Anthropic) for natural language generation and with a PDF/DOCX rendering engine (Puppeteer) for file production.

External system interfaces include the Anthropic Claude API for AI-generated text content, Supabase for database management, authentication, and file storage, FedaPay or Monetbil for payment processing, and Vercel and Railway hosting platforms for frontend and backend deployment respectively.

The platform is accessed exclusively via web browser and does not require any client-side software installation. Memory usage on the user's device is minimal, as all processing occurs server-side.

---

### 2.2 Product Functions

The following summarises the major functional capabilities of DocuSmart:

- **User Account Management:** Registration, login (email/password and Google OAuth), profile settings, subscription management, and account deletion.
- **Master Profile Management:** Create, read, update, and delete all profile sections including personal details, education, work experience, skills, certifications, projects, volunteer work, publications, and references.
- **Document Builder Wizard:** A guided ten-step interface for creating tailored documents, featuring real-time live preview, section toggling, and AI-assisted content generation at each step.
- **AI Document Generation:** Context-aware generation of eight document types using the Claude API, with outputs in professional, impact-first language in either English or French.
- **Template Gallery and Customisation:** Selection from six CV templates with controls for accent colour, font pairing, section reordering, spacing, and page margin adjustments.
- **Export and Sharing:** PDF and DOCX file export, bundle ZIP export (all documents for one application), and shareable public profile URL.
- **AI Enhancement Tools:** AI "Improve this" inline rewrites (limited to 2 activations per user per day), JD scanner for match analysis, AI CV strength scorer, and interview question coach.
- **Document and Application Management:** Applications log with status tracking, document version history, and duplicate-and-adapt workflow.
- **Payment and Subscription:** MTN Mobile Money and Orange Money payment processing, free/paid tier gating, monthly subscription, and one-time per-document purchase.
- **Bilingual Support:** Full document generation in both English and French.

---

### 2.3 User Classes and Characteristics

DocuSmart identifies four primary user classes and one administrative user class:

#### 2.3.1 Guest User (Unauthenticated)

Unauthenticated visitors who access the landing page and public-facing content. They may view template previews and pricing information but cannot create documents or access the builder. Technical proficiency: low to moderate. Actions available: view landing page, register, and initiate login.

#### 2.3.2 Free Tier User

Registered users on the free plan (0 XAF/month). Primarily final-year students and first-time job seekers. May have limited digital literacy. Can generate up to two documents per month, access three templates (Horizon, Clean Slate, Blueprint), and export PDF and DOCX. Access to CV and Cover Letter generation only. Technical proficiency: low to moderate.

#### 2.3.3 Pro Tier User (Paid Subscriber)

Registered users on the Pro Plan (1,000 XAF/month). Includes graduates, working professionals, and scholarship applicants making frequent, high-volume applications. Require all eight document types, all six templates, and premium features (JD scanner, strength scorer, interview coach, applications log, version history, bundle export, and shareable link). Technical proficiency: moderate to high.

#### 2.3.4 One-Time Purchase User

Registered users who purchase individual documents at 200 XAF each without a monthly subscription. Infrequent users with occasional document needs. Technical proficiency: varied. A One-Time Purchase User is any registered user who makes a one-time purchase but is not on a Pro subscription. Such users retain the basic Free Tier limits in addition to their purchased document credits.

#### 2.3.5 System Administrator

Internal platform administrators with access to the backend management console. Responsible for user management, subscription oversight, system monitoring, content moderation, and template updates. High technical proficiency required. This user class does not interact with the public-facing application.

---

### 2.4 Operating Environment

DocuSmart shall operate within the following environment:

- **Client Environment:** Any modern web browser (Google Chrome v90+, Mozilla Firefox v88+, Safari v14+, Microsoft Edge v90+) on Windows, macOS, Linux, iOS, or Android operating systems. No browser extensions or plugins shall be required.

- **Frontend Hosting:** Vercel platform with global CDN. The frontend is built using React.js (with Vite as the build tool and development server), styled with Tailwind CSS, and uses shadcn/ui as the component library.

- **Backend Hosting:** Railway platform. The backend is a Node.js application built with the Express framework, written in TypeScript, and using Prisma as the Object-Relational Mapping (ORM) layer for all database interactions.

- **Database:** Supabase (PostgreSQL) with real-time capabilities, managed authentication, and file storage. Prisma connects to the Supabase PostgreSQL instance.

- **AI Service:** Anthropic Claude API (`claude-sonnet` model), accessed via HTTPS from the backend server only.

- **Payment Gateway:** FedaPay or Monetbil API, supporting MTN Mobile Money and Orange Money.

- **PDF Rendering:** Puppeteer (headless Chromium) running on the backend server.

- **Network:** The system shall be optimised for low-bandwidth environments including 3G mobile networks prevalent in the target market. Client-side rendering with lazy loading shall minimise data transfer on initial page loads.

---

### 2.5 Design and Implementation Constraints

- **Language Support:** The system must support full document generation in both English and French from day one, without relying on post-generation translation.

- **Payment Method Constraint:** The platform may not require credit card or international payment methods as the primary payment option. MTN Mobile Money and Orange Money must be the primary supported payment channels.

- **API Rate Limits:** The Anthropic Claude API imposes rate limits on requests per minute and tokens per day. The system must implement request queuing, graceful degradation, and user-facing feedback when API limits are approached or reached.

- **AI Usage Limits:** To manage operational costs and prevent abuse, the inline "Improve this" AI feature shall be limited to a maximum of **two (2) activations per registered user per calendar day**, regardless of subscription tier.

- **Data Residency:** User personal data must be stored in compliance with applicable Cameroonian data protection regulations. Supabase region configuration must reflect this requirement.

- **Browser Compatibility:** The application must function correctly without any client-side native code execution (WebAssembly, native plugins). All processing must be web-standard.

- **Offline Profile Editing:** The frontend must implement a service worker or equivalent mechanism to allow profile edits when the user is temporarily offline, with synchronisation on connection restoration.

- **ATS Compatibility:** Templates designated as ATS-compatible (particularly Clean Slate and Horizon) must produce PDF output that passes standard applicant tracking system text-parsing checks, with no text rendered inside images.

- **Third-Party Dependency Management:** The system architecture must allow substitution of the payment gateway (FedaPay vs Monetbil) without requiring changes to core application logic.

---

### 2.6 Assumptions and Dependencies

- **Anthropic API Availability:** The system assumes continued availability of the Anthropic Claude API at commercially acceptable rates. Any significant change in API pricing or availability may necessitate architectural review.

- **Supabase Free Tier:** The MVP is designed around Supabase's free tier limitations. Should user growth exceed free tier thresholds, a paid Supabase plan must be activated.

- **FedaPay/Monetbil Gateway Approval:** Successful merchant account approval with FedaPay or Monetbil is required before the payment module can be activated. This approval process is external to the development team.

- **User Device Capability:** It is assumed that target users have a device (smartphone or computer) capable of running a modern browser and maintaining an internet connection for the duration of document generation (approximately 30–120 seconds).

- **Claude API Instruction Compliance:** It is assumed that the Claude API will consistently follow structured prompting instructions for professional writing tasks in both English and French.

- **Template Rendering Consistency:** It is assumed that Puppeteer-based PDF generation will produce visually consistent output across the deployment environment. Rendering differences across operating systems are addressed by using a controlled server-side headless browser.

---

## 3. Specific Requirements

This chapter constitutes the core of the SRS. It defines every functional and non-functional requirement that the DocuSmart system must satisfy. All requirements are identified with unique identifiers, described with sufficient precision to be independently verifiable, and assigned a priority level.

### 3.1 External Interface Requirements

#### 3.1.1 User Interface Requirements

| Req. ID | Description | Priority |
|---------|-------------|----------|
| UI-001 | The system shall display a responsive web interface that is fully functional on screen widths from 320px (small mobile) to 1920px (desktop widescreen). | HIGH |
| UI-002 | The document builder shall present a split-screen layout on screens wider than 768px, with the data entry form on the left and a live-updating document preview on the right. | HIGH |
| UI-003 | On screens narrower than 768px, the builder shall display in a single-column view with a toggle button to switch between the form view and the preview view. | HIGH |
| UI-004 | All interactive elements (buttons, inputs, toggles) shall have a minimum touch target size of 44×44 pixels in compliance with WCAG 2.1 accessibility guidelines. | MEDIUM |
| UI-005 | The system shall display inline validation messages adjacent to erroneous form fields within 500 milliseconds of the user leaving the field (on-blur validation). | HIGH |
| UI-006 | The live preview panel shall reflect all user edits within 1 second of the user stopping input (debounced update). | HIGH |
| UI-007 | The completeness meter shall update in real time and display a percentage score (0–100) and a minimum of three specific improvement suggestions below it. | MEDIUM |
| UI-008 | The template gallery shall display live previews of each template pre-populated with the user's own name and primary job title. | HIGH |
| UI-009 | The system shall support both Light Mode and Dark Mode display based on the user's browser or OS preference setting. | LOW |
| UI-010 | The application shall load its initial page (landing or dashboard) within 3 seconds on a 3G mobile connection (approximately 1.5 Mbps). | HIGH |

#### 3.1.2 Hardware Interfaces

DocuSmart is a web-based application and does not directly interface with any hardware beyond standard client devices. The following hardware interface considerations apply:

- **Photo Upload:** The system shall interface with the device's file system via the browser's standard file input API to allow users to upload a profile photo. Accepted formats: JPEG, PNG, WebP. Maximum file size: 5 MB.

- **Local Storage:** The system shall use the browser's IndexedDB (or equivalent) for offline caching of unsaved profile edits.

#### 3.1.3 Software Interfaces

| Req. ID | Description | Priority |
|---------|-------------|----------|
| SI-001 | The system shall integrate with the Anthropic Claude API (`v1/messages` endpoint) using the `claude-sonnet` model for all AI text generation. Requests shall include structured system prompts, user context, and profile data. | HIGH |
| SI-002 | The system shall integrate with Supabase for PostgreSQL database access (via Prisma ORM), user authentication (email/password and Google OAuth via Supabase Auth), and file storage (user photos and generated document files). | HIGH |
| SI-003 | The system shall integrate with FedaPay or Monetbil payment gateway API to process MTN Mobile Money and Orange Money subscription and one-time payments. The integration shall handle payment initiation, status webhooks, and subscription lifecycle events. | HIGH |
| SI-004 | The backend shall expose a RESTful JSON API to the frontend. All API responses shall use HTTP status codes correctly and return error details in a standardised JSON error object. | HIGH |
| SI-005 | The PDF generation module shall use Puppeteer (headless Chromium) to render the HTML/CSS document template to a print-ready PDF with embedded fonts, pixel-accurate layout, and proper page sizing (A4). | HIGH |
| SI-006 | The DOCX export module shall produce standard Open XML (`.docx`) files compatible with Microsoft Word 2016+ and LibreOffice 6+. | MEDIUM |

#### 3.1.4 Communication Interfaces

- All client-server communication shall use HTTPS (TLS 1.2 or higher). HTTP requests shall be automatically redirected to HTTPS.

- API communication with the Anthropic Claude API shall be performed server-side only. The Anthropic API key shall never be exposed to the client browser.

- Payment gateway callbacks and webhooks shall be received on a dedicated, authenticated webhook endpoint.

- Real-time updates (e.g., profile sync) shall use Supabase Realtime subscriptions over WebSocket.

---

### 3.2 Functional Requirements

#### 3.2.1 User Authentication and Account Management

| Req. ID | Description | Priority |
|---------|-------------|----------|
| FR-001 | The system shall allow a new user to register an account using a valid email address and a password meeting complexity requirements (minimum 8 characters, at least one uppercase letter, one number, and one special character). | HIGH |
| FR-002 | The system shall allow users to register and log in using Google OAuth via Supabase Auth. | HIGH |
| FR-003 | The system shall send a verification email to newly registered users and require email confirmation before the account is activated. | HIGH |
| FR-004 | The system shall allow authenticated users to reset their password via a time-limited, single-use password reset link sent to their registered email address. | HIGH |
| FR-005 | The system shall maintain authenticated sessions using secure JWT tokens with a configurable expiry period (default: 7 days). Sessions shall be invalidated on explicit logout. | HIGH |
| FR-006 | The system shall allow users to update their account email, password, and notification preferences from the account settings page. | MEDIUM |
| FR-007 | The system shall allow users to permanently delete their account and all associated data, subject to a 14-day grace period before irreversible deletion. | MEDIUM |

#### 3.2.2 Master Profile Management

| Req. ID | Description | Priority |
|---------|-------------|----------|
| FR-008 | The system shall allow authenticated users to create and populate a Master Profile containing all fields defined in the product specification: personal details, education, work experience, skills, certifications, projects, volunteer work, publications, languages, and references. | HIGH |
| FR-009 | The system shall allow users to add multiple entries for each repeatable profile section (e.g., multiple education records, multiple work experience entries, multiple projects). | HIGH |
| FR-010 | The system shall auto-save all profile changes to the database within 3 seconds of the user stopping input. A visible save status indicator shall be displayed. | HIGH |
| FR-011 | The system shall allow users to upload a profile photo (JPEG/PNG/WebP, max 5 MB). The uploaded image shall be stored in Supabase Storage and linked to the user's profile record. | HIGH |
| FR-012 | The system shall support a "Cameroonian Format" toggle that, when enabled, makes the nationality, date of birth, place of birth, and marital status fields visible and includable in generated documents. | HIGH |
| FR-013 | The system shall store referee details (name, role, institution, email) in the profile and automatically insert them into documents that include a References section. | MEDIUM |
| FR-014 | The GPA/grade field shall include a configurable show/hide threshold. By default, GPA shall be visible in generated documents only if the entered grade is above 14/20 or 3.0/4.0. Users may manually override this threshold to accommodate alternative grading scales. | MEDIUM |

#### 3.2.3 Context Engine and Document Builder

| Req. ID | Description | Priority |
|---------|-------------|----------|
| FR-015 | The system shall present a ten-step wizard interface for document creation. Users shall be able to navigate forward and backward between steps without losing data. | HIGH |
| FR-016 | In Step 2 (Target Role), the system shall require the user to enter at minimum: job title, company type (from a predefined dropdown), and target country. All other fields in this step are optional. | HIGH |
| FR-017 | When a user pastes a job description into the optional JD text area in Step 2, the system shall send the text to the AI engine, which shall identify and highlight the top matching profile fields and pre-select them for inclusion. The AI engine shall return a structured JSON response mapping JD requirements to specific profile sections. | HIGH |
| FR-018 | The system shall pre-populate all steps from 3 to 9 with the relevant sections from the user's Master Profile, displayed as togglable cards. | HIGH |
| FR-019 | Each experience entry card in Step 5 shall include an "AI Rewrite" button. When clicked, the system shall send the existing bullet points to the Claude API and replace them with action-verb, impact-first reformulations. | HIGH |
| FR-020 | Step 4 (Professional Summary) shall include a "Generate with AI" button that calls the Claude API with the target role and company type to produce a 3-sentence professional summary. The button may be clicked multiple times to regenerate. | HIGH |
| FR-021 | Every text field in the builder shall display an inline "Improve this" AI button. When activated on a selected sentence or paragraph, the system shall return a rewritten version using the Claude API. Each registered user shall be permitted a maximum of **two (2) "Improve this" activations per calendar day**, regardless of subscription tier. Upon reaching this limit, the button shall be disabled and a notification shall inform the user that their daily limit has been reached. | HIGH |
| FR-022 | The system shall allow users to reorder sections within the document by dragging cards or using up/down controls. The live preview shall update immediately upon reordering. | MEDIUM |
| FR-023 | The completeness meter in the builder shall calculate and display a score from 0 to 100 based on the number of populated sections, the richness of content, and keyword density relative to the target role. | MEDIUM |
| FR-024 | In Step 10 (Review & Export), the system shall run an AI strength check on the completed document and return a score from 0 to 100 with sub-scores for: impact language, completeness, relevance, formatting quality, and keyword density. The AI strength check response shall include a textual explanation for each sub-score to guide the user in improving their document. | MEDIUM |

#### 3.2.4 AI Document Generation

| Req. ID | Description | Priority |
|---------|-------------|----------|
| FR-025 | The system shall generate all eight defined document types (CV/Resume, Cover Letter, Motivation Letter, Recommendation Letter, Personal Statement, Research Proposal, Expression of Interest, and Writing Sample) from the user's Master Profile using the Claude API. | HIGH |
| FR-026 | Each document generation request shall pass to the Claude API: the structured profile data, the application context (role, company type, country, language), the document type, and a type-specific system prompt defining tone, structure, and length requirements. | HIGH |
| FR-027 | The system shall generate all documents natively in either English or French based on the user's language selection. Language switching shall trigger a full re-generation of the document content, not a translation of existing output. | HIGH |
| FR-028 | Work experience bullet points in generated CVs shall follow the format: **strong action verb + task description + measurable result or outcome**. | HIGH |
| FR-029 | The system shall omit any profile field left empty from the generated document. No placeholder text or blank spaces shall appear in generated output. | HIGH |
| FR-030 | Section ordering in the generated CV shall be determined by the context: for recent graduates, Education shall precede Work Experience; for experienced professionals, Work Experience shall precede Education; for developers, Projects shall precede Education. | MEDIUM |
| FR-031 | The AI shall select the most relevant 2–3 projects for the current role context and reorder the Projects section accordingly in the generated output. | MEDIUM |
| FR-032 | For Recommendation Letter generation, the system shall produce a draft pre-filled with the applicant's specific achievements, formatted for a supervisor or professor to review, edit, and sign. | MEDIUM |

#### 3.2.5 Template Gallery and Customisation

| Req. ID | Description | Priority |
|---------|-------------|----------|
| FR-033 | The system shall provide six CV templates: Horizon, Sidebar Pro, Clean Slate, Blueprint, Mosaic, and Noir. Free Tier users shall have access to Horizon, Clean Slate, and Blueprint. Pro users shall have access to all six. | HIGH |
| FR-034 | Each template shall support six accent colour options: Purple, Teal, Navy, Coral, Olive, and Black. Colour changes shall be reflected immediately in the live preview. | HIGH |
| FR-035 | Each template shall support five font pairings: Modern Sans, Classic Serif, Tech Mono-accent, Elegant, and Compact. | MEDIUM |
| FR-036 | The customisation panel shall include three spacing controls: Compact, Normal, and Spacious, adjusting line height and section gap values in the template. | MEDIUM |
| FR-037 | Template selection shall be changeable at any step of the builder without loss of any entered or generated data. | HIGH |

#### 3.2.6 Export and Sharing

| Req. ID | Description | Priority |
|---------|-------------|----------|
| FR-038 | The system shall allow any user to export a generated document as a print-ready PDF file. The PDF shall be pixel-accurate to the on-screen preview, A4 page size, with embedded fonts. | HIGH |
| FR-039 | The system shall allow any user to export a generated document as an editable DOCX file compatible with Microsoft Word 2016+ and LibreOffice 6+. | HIGH |
| FR-040 | Pro users shall be able to export all documents generated for one application as a single ZIP archive, named with the format `[CompanyName]_[Role]_[Date].zip`. The ZIP archive shall group all documents linked to the corresponding ApplicationLog entry. | MEDIUM |
| FR-041 | Pro users shall be able to generate a shareable public URL (e.g., `docusmart.cm/username`) that displays a read-only, formatted version of their CV. The user shall be able to enable or disable this link at any time. The public profile page shall display only fields that the user has explicitly permitted to be shown publicly, excluding sensitive data such as email address and phone number by default. | MEDIUM |

#### 3.2.7 Document and Application Management

| Req. ID | Description | Priority |
|---------|-------------|----------|
| FR-042 | The system shall save every version of a document when the user explicitly saves or exports it. Pro users shall be able to view a version history list and restore any previous version. The ApplicationLog entry shall link to a specific document version rather than to the document entity alone. | MEDIUM |
| FR-043 | The system shall allow users to duplicate an existing saved document and open the duplicate in the builder for adaptation to a different role without modifying the original. | HIGH |
| FR-044 | Pro users shall have access to an Applications Log where they can record: company name, role, date, document used (specific version), and application status (Applied, Interview Scheduled, Offer Received, Rejected, Withdrawn). | MEDIUM |
| FR-045 | After generating a CV, the system shall prompt the user with an option to generate a companion Cover Letter or other document type for the same application context in one click. | MEDIUM |

#### 3.2.8 Payment and Subscription Management

| Req. ID | Description | Priority |
|---------|-------------|----------|
| FR-046 | The system shall provide a Free Tier (0 XAF/month) with the following constraints: a maximum of two (2) documents generated per calendar month, access to Horizon, Clean Slate, and Blueprint templates only, and CV and Cover Letter document types only. | HIGH |
| FR-047 | The system shall provide a Pro Plan at 1,000 XAF/month with unlimited document generation, all six templates, all eight document types, and all premium features as defined in the product specification. | HIGH |
| FR-048 | The system shall process subscription and one-time payment transactions via the FedaPay or Monetbil API, supporting MTN Mobile Money and Orange Money as payment methods. Webhook endpoints shall validate payload signatures to ensure authenticity, and idempotency keys shall be used to prevent duplicate transaction processing. | HIGH |
| FR-049 | The system shall send a payment confirmation notification (in-app and email) within 60 seconds of successful payment processing. | MEDIUM |
| FR-050 | The system shall automatically downgrade a Pro user to Free Tier if their subscription payment fails and is not remedied within a 3-day grace period. | MEDIUM |
| FR-051 | The system shall allow users to purchase individual documents at 200 XAF per document without a subscription. Such one-time purchases shall grant a single export credit for the specified document type. One-Time Purchase Users retain Free Tier feature limits in addition to their purchased credits. | MEDIUM |
| FR-052 | The system shall enforce feature gating for paid-only features (JD Scanner, AI Strength Scorer, Noir template, etc.), displaying an upgrade prompt when a Free Tier user or a One-Time Purchase user who has not purchased the relevant feature attempts to access them. | HIGH |

#### 3.2.9 Localisation and Accessibility

| Req. ID | Description | Priority |
|---------|-------------|----------|
| FR-053 | The system shall recognise major Cameroonian universities (University of Buea, University of Yaoundé I, University of Yaoundé II, University of Douala, University of Ngaoundéré, University of Dschang, University of Bamenda) and display them with correct institutional names in education sections. | MEDIUM |
| FR-054 | The system shall implement mobile-first responsive design. The document builder shall be fully usable on mobile browsers with a minimum viewport width of 320px. | HIGH |
| FR-055 | The system shall support offline profile editing via service worker caching. Unsaved profile changes made while offline shall be synchronised automatically when an internet connection is restored. | MEDIUM |
| FR-056 | The interview coach feature shall generate 10 role-specific interview questions with bullet-point answer guidance for each question after CV generation. | MEDIUM |

---

### 3.3 Non-Functional Requirements

#### 3.3.1 Performance Requirements

| Req. ID | Description | Priority |
|---------|-------------|----------|
| NFR-001 | The web application landing page and dashboard shall achieve a Largest Contentful Paint (LCP) score of under 2.5 seconds on a 3G connection (1.5 Mbps) as measured by Google Lighthouse. | HIGH |
| NFR-002 | Live preview updates in the document builder shall render within 1 second of the user pausing input (debounced at 500ms). This applies to all template rendering operations. | HIGH |
| NFR-003 | AI document generation (full document) shall complete and return the generated output to the user within 30 seconds under normal load conditions (Claude API latency included). A progress indicator shall be displayed during generation. | HIGH |
| NFR-004 | Individual AI "Improve this" and "AI Rewrite" operations (single field or paragraph) shall return results within 10 seconds under normal load conditions. | HIGH |
| NFR-005 | PDF export generation shall complete within 15 seconds on the backend server under normal load. DOCX export shall complete within 10 seconds. | HIGH |
| NFR-006 | The system shall support a minimum of 500 concurrent users performing active document building sessions without degradation in response times below the specified thresholds. | MEDIUM |
| NFR-007 | The system shall achieve 99.5% uptime availability (measured monthly), excluding planned maintenance windows announced 48 hours in advance. | MEDIUM |
| NFR-008 | Database read queries for profile retrieval and document loading shall return results within 500 milliseconds under normal load. | HIGH |

#### 3.3.2 Security and Privacy Requirements

| Req. ID | Description | Priority |
|---------|-------------|----------|
| NFR-009 | All data in transit between the client and server shall be encrypted using TLS 1.2 or higher. The system shall not accept HTTP connections and shall redirect all HTTP requests to HTTPS. | HIGH |
| NFR-010 | All user passwords shall be hashed using bcrypt with a minimum cost factor of 12 before storage. Plaintext passwords shall never be logged or stored. | HIGH |
| NFR-011 | The Anthropic Claude API key, Supabase service role key, and all payment gateway API keys shall be stored exclusively as server-side environment variables. These keys shall never be transmitted to or accessible from the client browser. | HIGH |
| NFR-012 | The system shall implement Row-Level Security (RLS) policies in Supabase to ensure that users can only read and modify their own profile data and documents. | HIGH |
| NFR-013 | The system shall implement rate limiting on authentication endpoints (login, registration, password reset) to a maximum of 10 requests per IP address per minute, to prevent brute-force attacks. | HIGH |
| NFR-014 | All user-submitted text fields shall be sanitised to prevent Cross-Site Scripting (XSS) attacks before rendering in the browser. The Content Security Policy (CSP) header shall be configured to restrict inline script execution. | HIGH |
| NFR-015 | The system shall implement CSRF (Cross-Site Request Forgery) protection on all state-changing API endpoints using SameSite cookie attributes and/or CSRF token validation. | HIGH |
| NFR-016 | Profile photos and generated document files stored in Supabase Storage shall be accessible only to the owning user through signed URLs with a maximum 1-hour expiry. No publicly accessible permanent file URLs shall be used for private user data. | HIGH |
| NFR-017 | The platform shall not share, sell, or provide user profile data or generated document content to any third party, except as required for core functionality (Claude API for generation, payment gateway for transactions). | HIGH |
| NFR-018 | User data deletion requests (account deletion) shall result in the permanent removal of all personally identifiable information from the database and file storage within the 14-day grace period. | MEDIUM |
| NFR-032 | The system shall track per-user daily AI usage (specifically "Improve this" activations) in the database. The counter shall reset at midnight UTC each calendar day. The per-user daily limit shall be configurable via a server-side environment variable without requiring a code deployment. | HIGH |

#### 3.3.3 Software Quality Attributes

##### Maintainability

| Req. ID | Description | Priority |
|---------|-------------|----------|
| NFR-019 | The codebase shall follow a modular, component-based architecture. Each major functional area (auth, profile, builder, AI engine, export, payments) shall be implemented as an independent module with clearly defined interfaces. | HIGH |
| NFR-020 | All Claude API prompt templates shall be stored as versioned configuration files, separate from application logic, to allow prompt updates without code deployments. | MEDIUM |
| NFR-021 | The system shall maintain a minimum of 80% unit test coverage on all backend service modules. | MEDIUM |

##### Portability

| Req. ID | Description | Priority |
|---------|-------------|----------|
| NFR-022 | The application shall be containerisable using Docker. A Dockerfile and docker-compose configuration shall be maintained to allow local development environment setup without manual dependency installation. | MEDIUM |
| NFR-023 | The payment gateway integration shall be implemented behind an abstraction layer to allow switching between FedaPay and Monetbil with configuration changes only, and without changes to core application logic. | MEDIUM |

##### Usability

| Req. ID | Description | Priority |
|---------|-------------|----------|
| NFR-024 | New users shall be able to create and export their first document within 15 minutes of registration, based on usability testing with the target audience. | HIGH |
| NFR-025 | The system shall display informative, human-readable error messages in the user's selected language (French or English) for all anticipated error conditions. No raw technical error codes shall be displayed to end users. | HIGH |
| NFR-026 | The application shall provide contextual onboarding tooltips at each step of the document builder to guide first-time users. | MEDIUM |

##### Reliability

| Req. ID | Description | Priority |
|---------|-------------|----------|
| NFR-027 | The system shall implement retry logic with exponential back-off for Claude API calls. A maximum of 3 retry attempts shall be made before returning a user-facing error message. | HIGH |
| NFR-028 | The Master Profile auto-save mechanism shall implement optimistic UI updates and shall gracefully handle save failures by preserving the user's changes in local browser storage and retrying on reconnection. | HIGH |
| NFR-029 | No user data loss shall occur as a result of a browser refresh, accidental navigation away from the builder, or temporary network disconnection during an active session. | HIGH |

##### Scalability

| Req. ID | Description | Priority |
|---------|-------------|----------|
| NFR-030 | The backend architecture shall be stateless, enabling horizontal scaling by adding additional server instances behind a load balancer without application-level changes. JWT-based authentication shall be used to maintain this stateless property. | MEDIUM |
| NFR-031 | AI generation requests shall be processed through an asynchronous job queue to prevent blocking the primary API process and to allow graceful handling of traffic spikes. | MEDIUM |

---

## 4. System Architecture Overview

This chapter provides a high-level overview of the DocuSmart system architecture. Detailed architecture documentation is maintained separately in the System Design Document (SDD); this chapter summarises architectural decisions relevant to requirements traceability.

### 4.1 Architectural Pattern

DocuSmart follows a three-tier client-server architecture:

- **Presentation Tier:** A React.js single-page application (SPA) built with Vite, hosted on Vercel. The UI is composed using Tailwind CSS utility classes and shadcn/ui components. This tier is responsible for all user interface rendering, real-time preview updates, and client-side form validation.

- **Application Tier:** A Node.js with Express RESTful API written in TypeScript, hosted on Railway. Prisma ORM manages all database interactions, providing type-safe queries against the Supabase PostgreSQL instance. This tier handles business logic, AI prompt construction, Claude API integration, PDF/DOCX generation, payment processing, and data validation.

- **Data Tier:** Supabase (PostgreSQL) for structured data (user accounts, Master Profiles, documents, application logs), Supabase Storage for binary files (photos, exported documents), and Supabase Auth for identity management.

---

### 4.2 MVP Build Phases

The system shall be built iteratively across six defined phases:

| Phase | Name | Scope |
|-------|------|-------|
| Phase 1 | Core | User authentication, Master Profile setup, one working CV template (Horizon), and PDF export. |
| Phase 2 | AI Integration | Context engine inputs, AI summary generation, AI bullet rewrite, and basic Cover Letter generation. |
| Phase 3 | Builder UX | Live split-screen preview, completeness meter, section toggle and reorder, duplicate-and-adapt, and bilingual toggle. |
| Phase 4 | Template Gallery | All six templates, colour picker, font switcher, and spacing controls. |
| Phase 5 | Premium Features | JD scanner, AI strength scorer, applications log, bundle export, shareable link, interview coach, and version history. |
| Phase 6 | Payments | FedaPay/Monetbil integration, subscription management, and free/paid tier enforcement. |

---

### 4.3 Data Model Summary

The primary data entities in the DocuSmart system and their relationships are as follows:

| Entity | Relationship | Description |
|--------|-------------|-------------|
| **User** | Central entity | Stores account information, subscription status, and plan tier. Linked to all other entities. |
| **MasterProfile** | One-to-one with User | Contains all structured profile sections as JSON columns or related child tables (`Education[]`, `Experience[]`, `Skill[]`, `Project[]`, `Reference[]`). |
| **Document** | Many-to-one with User | Stores document type, version, context parameters, generated content, template settings, and export history. A parent Document entity groups version records; each explicit save or export creates a new `DocumentVersion` child record. |
| **Subscription** | One-to-one with User | Stores plan type, start date, renewal date, payment gateway reference, and status. |
| **ApplicationLog** | Many-to-one with User | Stores company, role, date, linked `DocumentVersion` ID, and status. |
| **AIUsageLog** | Many-to-one with User | Tracks the number of "Improve this" activations per user per calendar day for enforcement of the daily usage limit. |

---

## 5. Appendices

### 5.1 Appendix A — Glossary of Terms

| Term / Acronym | Definition |
|----------------|-----------|
| **AI — Artificial Intelligence** | The simulation of human intelligence processes by computer systems. |
| **ATS — Applicant Tracking System** | Software used by employers to manage and filter job applications automatically. |
| **Claude API** | The AI language model API provided by Anthropic, used as the AI engine for DocuSmart. |
| **Context Engine** | The DocuSmart module that processes application context inputs and determines which profile data to include in generated documents. |
| **DOCX** | Open XML format for word processing documents, the native format of Microsoft Word. |
| **FedaPay** | A Cameroonian payment gateway supporting MTN Mobile Money and Orange Money. |
| **GDPR** | General Data Protection Regulation: EU regulation governing data protection and privacy. |
| **JD — Job Description** | A formal description of a job role used by applicants and employers. |
| **JWT — JSON Web Token** | A compact, URL-safe means of representing claims transferred between two parties, used for session authentication. |
| **Master Profile** | The centralised repository of all user professional data within DocuSmart, used as the source for all document generation. |
| **Monetbil** | A payment gateway for Mobile Money transactions in Francophone Africa. |
| **MTN MoMo** | MTN Mobile Money: A mobile payment service by MTN Group. |
| **MVP** | Minimum Viable Product: The earliest version of a product with sufficient features to attract early adopters. |
| **NFR** | Non-Functional Requirement: A system quality attribute that defines how a system performs a function rather than what it does. |
| **OAuth** | Open Authorisation: An open standard for access delegation used for secure authorisation. |
| **ORM — Object-Relational Mapping** | A programming technique for converting data between incompatible type systems; Prisma is used as the ORM in this project. |
| **PDF** | Portable Document Format: A file format used to present documents independently of application software and operating systems. |
| **Prisma** | An open-source Node.js/TypeScript ORM that provides type-safe database access and schema management. |
| **RLS** | Row-Level Security: A PostgreSQL feature that restricts which rows a user can access in a database table. |
| **SaaS** | Software as a Service: A software distribution model in which applications are hosted in the cloud and delivered over the internet. |
| **shadcn/ui** | A collection of reusable React components built on Radix UI and Tailwind CSS, used as the UI component library for the DocuSmart frontend. |
| **SRS** | Software Requirements Specification: A document describing the intended purpose and environment for software under development. |
| **Supabase** | An open-source Firebase alternative providing a PostgreSQL database, authentication, real-time subscriptions, and file storage as a service. |
| **Tailwind CSS** | A utility-first CSS framework used for styling the DocuSmart frontend application. |
| **TLS** | Transport Layer Security: A cryptographic protocol providing communications security over a computer network. |
| **Vite** | A fast frontend build tool and development server used to bundle the DocuSmart React application. |
| **XAF** | Central African CFA Franc: The currency used in Cameroon and several other Central African nations. |

---

### 5.2 Appendix B — Requirements Traceability Matrix Summary

| Req. ID Range | Functional Area | Spec. Section | MVP Phase |
|---------------|-----------------|---------------|-----------|
| FR-001 – FR-007 | User Auth & Account Management | §2.1, §7 | Phase 1 |
| FR-008 – FR-014 | Master Profile Management | §2.1, §9 | Phase 1 |
| FR-015 – FR-024 | Context Engine & Builder | §2.2, §3 | Phase 2 & 3 |
| FR-025 – FR-032 | AI Document Generation | §2.3, §4 | Phase 2 |
| FR-033 – FR-037 | Template Gallery | §5 | Phase 4 |
| FR-038 – FR-041 | Export & Sharing | §6 | Phase 3 & 5 |
| FR-042 – FR-045 | Document Management | §6 | Phase 5 |
| FR-046 – FR-052 | Payment & Subscription | §7 | Phase 6 |
| FR-053 – FR-056 | Localisation | §9 | Phase 3 |
| NFR-001 – NFR-008 | Performance | N/A | All Phases |
| NFR-009 – NFR-018, NFR-032 | Security & Privacy | N/A | All Phases |
| NFR-019 – NFR-031 | Quality Attributes | N/A | All Phases |

---

### 5.3 Appendix C — Document Type Specifications

| Document Type | Primary Use Case | Plan |
|---------------|------------------|------|
| CV / Resume | Job applications, internships, scholarships | Free + Pro |
| Cover Letter | Corporate job applications, professional roles | Free + Pro |
| Motivation Letter | Graduate scholarships, study programmes, NGO roles | Pro only |
| Recommendation Letter | Drafted for supervisor/professor review and signature | Pro only |
| Personal Statement | University admissions, fellowships, competitive scholarships | Pro only |
| Research Proposal | Graduate school, academic grants, thesis submissions | Pro only |
| Expression of Interest | Leadership roles, NGO board applications, government posts | Pro only |
| Writing Sample | Research, academic, and journalism positions | Pro only |

---

*DocuSmart SRS | Version 1.1 | Confidential*
