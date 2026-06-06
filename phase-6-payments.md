# Phase 6 — Payments
## Frontend Implementation Plan

> **Scope:** Pricing page (public), checkout flow (MTN Mobile Money + Orange Money), payment status pages, subscription management in settings, upgrade prompts integration, one-time purchase flow, feature gate enforcement.
> **Prerequisite:** Phase 5 complete. All features built and gated.

---

## Requirements Covered

| ID | Description | Priority |
|----|-------------|----------|
| FR-046 | Free Tier: 2 docs/month, 3 templates, CV + Cover Letter only | HIGH |
| FR-047 | Pro Plan: 1,000 XAF/month, unlimited, all 8 types, all 6 templates, all premium features | HIGH |
| FR-048 | Payment via FedaPay/Monetbil — MTN Mobile Money + Orange Money; webhook validation, idempotency | HIGH |
| FR-049 | Payment confirmation in-app + email within 60s of success | MEDIUM |
| FR-050 | Auto-downgrade to Free after grace period on failed renewal | MEDIUM |
| FR-051 | One-time purchase: 200 XAF per document, grants single export credit | MEDIUM |
| FR-052 | Feature gating — upgrade prompts for all Pro features | HIGH |
| UI-010 | Pricing page loads ≤3s on 3G | HIGH |
| NFR-025 | Human-readable error messages in payment flow | HIGH |

---

## Route Map

```
/pricing                      → Public pricing page (no auth required)
/checkout                     → Payment checkout (protected)
/checkout/single              → Single document purchase checkout
/payment/pending              → Payment awaiting confirmation
/payment/success              → Payment successful
/payment/failed               → Payment failed
/settings/subscription        → Subscription management (protected)
```

---

## Pages

---

### 1. Pricing Page

**Route:** `/pricing`
**Layout:** `<PublicLayout>` (also accessible from `<AppLayout>` for logged-in users)
**Purpose:** Convert visitors and Free users to Pro subscribers. Must be the clearest, most persuasive page in the app.

#### Page Header
- H1: "Simple, honest pricing"
- Subtitle: "No hidden fees. No credit card required for the free plan. Pay with MTN Mobile Money or Orange Money."
- Toggle: "Monthly billing" (no annual plan in MVP)

#### Pricing Cards (2-column centered)

```
┌─────────────────────────┐   ┌─────────────────────────┐
│         FREE            │   │    PRO          ★        │
│      0 XAF/month        │   │  1,000 XAF/month         │
│                         │   │  + 200 XAF per doc       │
│  ─────────────────────  │   │  (or subscribe for       │
│                         │   │   unlimited)             │
│  ✓ 2 documents/month    │   │  ─────────────────────   │
│  ✓ CV + Cover Letter    │   │  ✓ Unlimited documents   │
│  ✓ 3 templates          │   │  ✓ All 8 document types  │
│  ✓ PDF + DOCX export    │   │  ✓ All 6 templates       │
│  ✗ AI Strength Scorer   │   │  ✓ AI Strength Scorer    │
│  ✗ JD Scanner           │   │  ✓ JD Scanner            │
│  ✗ Applications Log     │   │  ✓ Applications Log      │
│  ✗ Version History      │   │  ✓ Version History       │
│  ✗ Interview Coach      │   │  ✓ Interview Coach       │
│  ✗ Bundle Export        │   │  ✓ Bundle Export         │
│  ✗ Shareable Profile    │   │  ✓ Shareable Profile     │
│  ✗ Priority Support     │   │  ✓ Priority Support      │
│                         │   │                          │
│  [Get Started Free]     │   │  [Upgrade to Pro]        │
│   (outlined button)     │   │   (primary blue button)  │
└─────────────────────────┘   └─────────────────────────┘
                               Pro card: blue border, slight
                               elevation, "Most Popular" badge
```

#### Feature Comparison Table
Below the cards, a detailed comparison table (toggleable — "Show detailed comparison"):
| Feature | Free | Pro |
|---------|------|-----|
| Documents per month | 2 | Unlimited |
| CV types | CV, Cover Letter | All 8 types |
| Templates | 3 | 6 (incl. Noir, Sidebar Pro) |
| AI rewrites per day | 2 | 2 (fair use limit) |
| JD Scanner | — | ✓ |
| AI Strength Scorer | — | ✓ |
| Applications Log | — | ✓ |
| Version History | — | ✓ |
| Interview Coach | — | ✓ |
| Bundle Export | — | ✓ |
| Shareable Profile | — | ✓ |
| Payment methods | — | MTN MoMo · Orange Money |
| Support | Email (48h) | Priority (24h) |

#### One-Time Purchase Option
Below the main plans, a smaller card:
```
┌──────────────────────────────────────────────────┐
│  Just need one document?                         │
│  200 XAF per document — no subscription needed  │
│  • Valid for one PDF or DOCX export              │
│  • Choose any Free-tier document type            │
│  • Credits don't expire                          │
│                [Buy a Document — 200 XAF]        │
└──────────────────────────────────────────────────┘
```

#### Payment Methods Section
```
  Accepted payment methods:
  [MTN Mobile Money logo]   [Orange Money logo]
  
  "Pay directly from your mobile phone.
   No bank account or credit card needed."
```

#### FAQ Section
6-item accordion:
1. When does my Pro subscription start?
2. Can I cancel anytime?
3. How does the 200 XAF per document work?
4. What happens if my payment fails?
5. Is my payment secure?
6. Can I use the same account with my team?

#### Trust & Social Proof Section
- "Trusted by professionals across Cameroon"
- 3 testimonials specifically about the value (not just the product)
- Emphasis on local payment: "Finally, a platform that accepts what we actually use"

#### CTA for Logged-In Users (different from guests)
- **Guest:** "Get Started Free" → `/register` | "Upgrade to Pro" → `/checkout`
- **Free user:** "Current plan: Free" badge | "Upgrade to Pro →" → `/checkout`
- **Pro user:** "You're on Pro ✓" + "Manage Subscription →" → `/settings/subscription`

---

### 2. Checkout Page

**Route:** `/checkout`
**Layout:** `<AppLayout>` (minimal — no sidebar)
**Purpose:** Process Pro subscription payment via MTN Mobile Money or Orange Money.

#### Layout
```
┌──────────────────────────────────────────────────────┐
│  ← Back to Pricing                                    │
│                                                       │
│  Upgrade to Pro                                       │
│                                                       │
│  ┌────────────────────────┐ ┌──────────────────────┐  │
│  │  Payment Method        │ │  Order Summary       │  │
│  │  ─────────────────── │ │  ────────────────── │  │
│  │  ○ MTN Mobile Money   │ │  DocuSmart Pro       │  │
│  │  ○ Orange Money        │ │  Monthly Plan        │  │
│  │                        │ │                      │  │
│  │  Phone Number:          │ │  1,000 XAF / month   │  │
│  │  [+237 6XX XXX XXX]     │ │                      │  │
│  │                         │ │  ──────────────────  │  │
│  │  [Pay 1,000 XAF →]      │ │  Total: 1,000 XAF    │  │
│  └────────────────────────┘ └──────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

#### Left — Payment Form

**Step 1: Choose Payment Method**
- Radio group:
  - MTN Mobile Money (MTN logo)
  - Orange Money (Orange logo)
- Selected option shows payment instructions

**Step 2: Enter Phone Number**
- Phone input:
  - Country code fixed to +237 (Cameroon)
  - MTN numbers: starts with 65, 67, 68, 69
  - Orange numbers: starts with 655, 656
  - Auto-validate number format matches selected provider
  - If user selects MTN but enters an Orange number: warning "This looks like an Orange Money number. Did you mean to select Orange Money?"

**Step 3: Submit**
- "Pay 1,000 XAF" primary button
- Below button: "You'll receive a payment prompt on your phone. Approve it to activate Pro."
- Small text: "Subscription renews monthly. Cancel anytime from your settings."
- Security note: "🔒 Payments processed securely by FedaPay"

#### Right — Order Summary
- Plan name: "DocuSmart Pro"
- Period: "Monthly"
- Amount: "1,000 XAF"
- What's included: 3-bullet summary of Pro features
- Lock icon + "Secure payment" badge

#### Loading State (after form submit)
- Button changes to spinner: "Processing…"
- User is redirected to `/payment/pending`

---

### 3. Single Document Purchase Checkout

**Route:** `/checkout/single`
**Layout:** Same as `/checkout` but simplified

#### Differences from subscription checkout
- Order summary shows: "1 Document Credit — 200 XAF"
- Subtitle: "Use to export one CV or Cover Letter as PDF or DOCX"
- After successful payment: credit added to account, redirect to `/documents` with toast "200 XAF document credit added! Create a document to use it."

#### Entry Points
- "Buy a Document — 200 XAF" button on pricing page
- Monthly limit modal: "You've used 2/2 free documents. Buy 1 more document for 200 XAF"

---

### 4. Payment Pending Page

**Route:** `/payment/pending`
**Layout:** `<AppLayout>` minimal, centered
**Purpose:** Show user what to do while waiting for mobile money confirmation.

#### Content
```
┌──────────────────────────────────────────┐
│                                          │
│  📱  Check your phone                    │
│                                          │
│  We sent a payment request to            │
│  MTN Mobile Money (+237 6XX XXX XXX)     │
│                                          │
│  ████████████░░░░░░  Waiting...         │
│                                          │
│  1. Open your MTN MoMo app or dial *126# │
│  2. Approve the payment of 1,000 XAF     │
│  3. Your Pro account activates instantly │
│                                          │
│  [I didn't receive a prompt — Resend]    │
│                                          │
│  Waiting for confirmation...             │
│  (This page will update automatically)  │
└──────────────────────────────────────────┘
```

#### Behavior
- Poll backend every 5 seconds for payment status (`GET /api/payments/status/:paymentId`)
- Timeout after 5 minutes: show "Payment is taking longer than expected" message with manual "Check payment status" button
- On success: auto-redirect to `/payment/success`
- On failure (user declined, insufficient funds, timeout): auto-redirect to `/payment/failed`
- Animated pulsing phone icon to indicate waiting
- "Cancel and go back" link (cancels the payment intent)

#### Instructions Vary by Provider
- MTN: "Dial `*126#` → Confirm Payment"
- Orange: "Open Orange Money app or dial `#144#`"

---

### 5. Payment Success Page

**Route:** `/payment/success`
**Layout:** `<AppLayout>` minimal, centered

#### Content
```
┌──────────────────────────────────────────┐
│                                          │
│  ✓  You're now on Pro!                   │
│                                          │
│  Your DocuSmart Pro subscription is      │
│  active. Start creating unlimited        │
│  documents right away.                   │
│                                          │
│  Receipt: 1,000 XAF — Jun 5, 2026       │
│  Renews: Jul 5, 2026                     │
│                                          │
│  [Start Building Now →]                  │
│  [View Subscription Settings]            │
└──────────────────────────────────────────┘
```

- Green checkmark icon (Framer Motion scale-in animation)
- Confetti animation (subtle, 2-second burst)
- "A confirmation has been sent to your email" message
- Update `user.plan` in auth store immediately (or refetch user profile)
- All Pro features now unlocked — if user had any blocked UI, it's now accessible

#### Edge Case: Double Navigation
- If user navigates to `/payment/success` without a valid payment in session → redirect to `/dashboard`

---

### 6. Payment Failed Page

**Route:** `/payment/failed`
**Layout:** `<AppLayout>` minimal, centered

#### Content
```
┌──────────────────────────────────────────┐
│                                          │
│  ✗  Payment unsuccessful                 │
│                                          │
│  Reason: [Reason from API or "Payment    │
│  was declined by your mobile operator"]  │
│                                          │
│  Common reasons:                         │
│  • Insufficient MoMo balance             │
│  • Request timed out (you didn't approve)│
│  • Network error during transaction      │
│                                          │
│  [Try Again →]                           │
│  [Use a different payment method]        │
│  [Continue on Free Plan]                 │
└──────────────────────────────────────────┘
```

- Red X icon (no dramatic animation — failure should feel calm, not alarming)
- Show specific reason if available from payment gateway
- "Try Again" → back to `/checkout` with method pre-selected
- No user data is lost — their profile and any documents are safe

---

### 7. Subscription Management

**Route:** `/settings/subscription`
**Layout:** `<AppLayout>` — tab within Settings page (alongside existing tabs)
**FR:** FR-050

#### For Free Tier Users
```
Your Plan: Free
─────────────────────────────────────────
Documents this month: 1/2
Resets on: July 1, 2026

  [Upgrade to Pro — 1,000 XAF/month]

What you get with Pro:
  ✓ Unlimited documents
  ✓ All document types
  ✓ JD Scanner, AI Scorer, and more
```

#### For Pro Users
```
Your Plan: Pro  ✓
─────────────────────────────────────────
Status: Active
Next billing date: July 5, 2026
Amount: 1,000 XAF
Payment method: MTN Mobile Money
Phone: +237 6XX XXX XXX

[Change payment method]   [Cancel subscription]

Payment History:
  Jun 5, 2026 — 1,000 XAF — ✓ Paid   [Receipt]
  May 5, 2026 — 1,000 XAF — ✓ Paid   [Receipt]
  Apr 5, 2026 — 1,000 XAF — ✓ Paid   [Receipt]
```

#### Cancel Subscription Flow (FR-050)
- "Cancel subscription" link opens confirmation dialog:
  ```
  ┌────────────────────────────────────────┐
  │  Cancel Pro subscription?              │
  │                                        │
  │  You'll keep Pro access until          │
  │  July 5, 2026. After that, your        │
  │  account switches to Free tier.        │
  │                                        │
  │  Your documents and profile data       │
  │  are never deleted.                    │
  │                                        │
  │  [Keep My Pro Plan]  [Cancel Plan]     │
  └────────────────────────────────────────┘
  ```
- After cancellation: "Subscription cancelled. You have Pro until July 5, 2026." banner in settings
- `user.plan` status in auth store updated to `pro_cancelling` — still shows Pro features until expiry

#### Failed Payment Banner (FR-050)
- If backend detects a failed renewal payment:
  - Global in-app banner (dismissable, orange): "Your Pro subscription renewal failed. Please update your payment method to keep Pro access. You have a 3-day grace period."
  - Banner links to `/settings/subscription`
  - After 3-day grace period: `user.plan` downgrades to `free`, banner changes to "Your subscription has ended. [Resubscribe]"

#### Change Payment Method
- Opens a form to enter a new phone number with provider selection
- Same validation as checkout form

---

## Upgrade Prompt Integration (Final Phase)

With all features built and gating in place, ensure every `<UpgradePromptModal>` (built in Phase 5) now correctly routes to `/checkout` and then back to the feature the user was trying to use.

### Flow
1. Free user clicks "JD Scanner"
2. `<UpgradePromptModal>` opens
3. "Upgrade to Pro" button → navigates to `/checkout?feature=jd-scanner&returnTo=/builder/:id?step=2`
4. Successful payment → `/payment/success?returnTo=/builder/:id?step=2`
5. Success page button: "Start Building Now" → navigates to `/builder/:id?step=2` (the JD scanner step)

### `returnTo` Pattern
Store the original destination in a `returnTo` URL param through the checkout flow, so after payment success the user lands exactly where they were trying to go.

---

## Shared Components for Phase 6

| Component | Description |
|-----------|-------------|
| `<PricingCard>` | Free/Pro pricing card with features list |
| `<PricingComparison>` | Full feature comparison table |
| `<CheckoutForm>` | Payment method selector + phone input |
| `<OrderSummary>` | Right-side order details card |
| `<PaymentPendingStatus>` | Polling status with phone instructions |
| `<PaymentResultPage>` | Success/Failed page with appropriate content |
| `<SubscriptionStatus>` | Current plan display for settings tab |
| `<PaymentHistory>` | List of past payments with receipt links |
| `<CancelSubscriptionDialog>` | Confirmation dialog for cancellation |
| `<FailedPaymentBanner>` | Global sticky banner for failed renewal |
| `<UpgradePromptModal>` | Final integrated version with `returnTo` routing |

---

## Implementation Notes

### Payment Flow Architecture (Frontend)
The frontend never directly calls FedaPay/Monetbil. Flow:
1. `POST /api/payments/initiate` with `{ plan, method, phoneNumber }`
2. Backend calls payment gateway API, returns `{ paymentId, externalRef }`
3. Frontend stores `paymentId` in `sessionStorage` (for pending page refresh resilience)
4. Frontend polls `GET /api/payments/status/:paymentId` every 5 seconds
5. Backend receives webhook from gateway → updates database → polling returns `{ status: 'success' }` or `{ status: 'failed' }`
6. Frontend redirects based on status

### Feature Flag System
In Phase 6, all feature gates must be live and based on real subscription data:
```ts
// useSubscription hook
const { plan, documentsUsedThisMonth, creditsRemaining } = useSubscription()

function canAccess(feature: Feature): boolean {
  if (plan === 'pro') return true
  if (plan === 'free') return freeFeatures.includes(feature)
  if (feature === 'single_doc_export') return creditsRemaining > 0
  return false
}
```

- `plan` values: `'free'` | `'pro'` | `'pro_cancelling'` | `'one_time'`
- `documentsUsedThisMonth`: counter from backend, cached in TanStack Query (5-min stale time)
- On Pro plan: all gates open, no prompts shown

### Error Messages for Payment (NFR-025)
Map all payment error codes to human-readable messages (in both EN and FR):
```ts
const PAYMENT_ERRORS = {
  INSUFFICIENT_FUNDS:   { en: "Insufficient balance on your mobile money account.", fr: "Solde insuffisant sur votre compte Mobile Money." },
  USER_DECLINED:        { en: "You declined the payment request on your phone.", fr: "Vous avez refusé la demande de paiement." },
  TIMEOUT:              { en: "Payment request timed out. Please try again.", fr: "La demande de paiement a expiré. Veuillez réessayer." },
  NETWORK_ERROR:        { en: "Network error during payment. No funds were deducted.", fr: "Erreur réseau. Aucun fonds n'a été débité." },
  ACCOUNT_NOT_FOUND:    { en: "No mobile money account found for this number.", fr: "Aucun compte Mobile Money trouvé pour ce numéro." },
}
```

### Subscription State in Auth Store
Update the Zustand auth store to include:
```ts
interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'pro_cancelling' | 'one_time'
  planExpiresAt: Date | null
  documentsUsedThisMonth: number
  oneTimeCredits: number
  aiUsageToday: number   // for "Improve this" daily limit
}
```
- Refetch user data after every successful payment
- Cache with a 30-second stale time (not too frequent but not stale)

### Pricing Page Performance (UI-010)
- Pricing page must be fast for users on 3G — no heavy libraries
- Lazy load the FAQ accordion content
- Use `Suspense` + `React.lazy` for the comparison table
- Pre-render pricing page statically if using Vercel SSG (no auth needed, content is static)

### Receipts
- "Receipt" link in payment history: `GET /api/payments/:id/receipt` → downloads a simple PDF receipt
- Receipt PDF generated by backend (simple Puppeteer template)
- Frontend just triggers a file download from the API URL
