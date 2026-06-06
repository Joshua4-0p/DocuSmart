import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import {
  Check,
  Star,
  Sparkles,
  Brain,
  Globe,
  Shield,
  CreditCard,
  Layout,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

/* ─── Fade-up animation variant ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

function FadeInSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Mini CV preview (hero right side) ─── */
function CVPreview() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-[11px] leading-tight select-none w-full max-w-[440px]">
      {/* Header bar */}
      <div className="bg-stone-900 px-6 pt-6 pb-4 text-white">
        <div className="font-bold text-[17px]">Jean-Baptiste Nkomo</div>
        <div className="text-stone-300 text-[13px] mt-0.5">Senior Software Engineer</div>
        <div className="flex gap-2 mt-2 text-stone-400 text-[11px]">
          <span>jean@email.cm</span>
          <span>•</span>
          <span>+237 677 123 456</span>
          <span>•</span>
          <span>Douala, Cameroon</span>
        </div>
      </div>
      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        <div>
          <div className="font-bold text-stone-700 uppercase tracking-widest text-[9px] mb-1.5 border-b border-stone-200 pb-1">
            PROFESSIONAL SUMMARY
          </div>
          <p className="text-stone-600 leading-relaxed">
            Results-driven engineer with 6+ years building scalable web applications. Led cross-functional teams delivering 40% performance improvements.
          </p>
        </div>
        <div>
          <div className="font-bold text-stone-700 uppercase tracking-widest text-[9px] mb-1.5 border-b border-stone-200 pb-1">
            EXPERIENCE
          </div>
          <div className="mb-2">
            <div className="flex justify-between">
              <span className="font-semibold text-stone-800 text-xs">Lead Engineer</span>
              <span className="text-stone-500">2021 – Present</span>
            </div>
            <div className="text-stone-500">MTN Cameroon · Douala</div>
            <div className="mt-1 text-stone-600 space-y-0.5">
              <div>• Architected microservices reducing latency by 35%</div>
              <div>• Mentored team of 8 junior developers</div>
            </div>
          </div>
        </div>
        <div>
          <div className="font-bold text-stone-700 uppercase tracking-widest text-[9px] mb-1.5 border-b border-stone-200 pb-1">
            EDUCATION
          </div>
          <div className="flex justify-between">
            <div>
              <div className="font-semibold text-stone-800 text-xs">M.Sc. Computer Science</div>
              <div className="text-stone-500">University of Yaoundé I</div>
            </div>
            <span className="text-stone-500">2019</span>
          </div>
        </div>
        <div>
          <div className="font-bold text-stone-700 uppercase tracking-widest text-[9px] mb-1.5 border-b border-stone-200 pb-1">
            SKILLS
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'].map((s) => (
              <span key={s} className="bg-stone-100 text-stone-700 rounded-md px-2 py-0.5 text-[10px]">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Floating social proof card ─── */
function FloatingCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className={cn(
        'absolute bg-white rounded-xl border border-stone-200 shadow-xl px-3 py-2.5 text-xs',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

/* ─── Trust badge ─── */
function TrustBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Check className="size-3.5 text-ds-success-foreground" />
      <span>{label}</span>
    </div>
  )
}

/* ─── Step card ─── */
function StepCard({
  number,
  title,
  desc,
  visual,
  reverse = false,
}: {
  number: string
  title: string
  desc: string
  visual: React.ReactNode
  reverse?: boolean
}) {
  return (
    <FadeInSection>
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center',
          reverse && 'lg:[direction:rtl]',
        )}
      >
        <div className={cn(reverse && 'lg:[direction:ltr]')}>
          <div className="inline-block text-5xl font-black text-border mb-3 leading-none tabular-nums">
            {number}
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{desc}</p>
        </div>
        <div className={cn('bg-card rounded-2xl border border-border p-6 shadow-sm', reverse && 'lg:[direction:ltr]')}>
          {visual}
        </div>
      </div>
    </FadeInSection>
  )
}

/* ─── Feature card ─── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType
  title: string
  desc: string
}) {
  return (
    <FadeInSection>
      <div className="flex flex-col gap-3">
        <div className="size-11 rounded-lg bg-foreground flex items-center justify-center shrink-0">
          <Icon className="size-5 text-background" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </FadeInSection>
  )
}

/* ─── Testimonial card ─── */
function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string
  name: string
  role: string
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-4">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-card-foreground italic">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-semibold text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  )
}

/* ─── Template thumb (placeholder) ─── */
function TemplateThumbnail({ name, color }: { name: string; color: string }) {
  return (
    <div className="group relative bg-card rounded-xl border border-border overflow-hidden aspect-[3/4] cursor-pointer hover:shadow-lg transition-shadow">
      <div className={cn('h-12 w-full', color)} />
      <div className="p-3 space-y-1.5">
        {[100, 75, 90, 60, 80, 70].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" className="bg-background text-foreground hover:bg-background/90">
          Use This Template
        </Button>
      </div>
      <div className="absolute bottom-2 left-2 text-[10px] font-medium text-muted-foreground">
        {name}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════════════ */
export function LandingPage() {
  const { t } = useTranslation()

  const faqs = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: t(`landing.faq${n}Q`),
    a: t(`landing.faq${n}A`),
  }))

  const features = [
    { icon: Layers, title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
    { icon: Brain, title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
    { icon: Globe, title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
    { icon: Layout, title: t('landing.feature4Title'), desc: t('landing.feature4Desc') },
    { icon: CreditCard, title: t('landing.feature5Title'), desc: t('landing.feature5Desc') },
    { icon: Shield, title: t('landing.feature6Title'), desc: t('landing.feature6Desc') },
  ]

  return (
    <div className="bg-background">
      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">
            {/* Left */}
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full"
                >
                  <Sparkles className="size-4" />
                  {t('landing.eyebrow')}
                </motion.span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-5"
              >
                {t('landing.headline')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-muted-foreground leading-relaxed mb-8"
              >
                {t('landing.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 mb-8"
              >
                <Button size="lg" className="h-12 px-7 text-base font-semibold" asChild>
                  <Link to="/register">{t('landing.ctaPrimary')}</Link>
                </Button>
                <Button variant="ghost" size="lg" className="h-12 gap-1.5" asChild>
                  <Link to="/templates">
                    {t('landing.ctaSecondary')}
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap gap-x-5 gap-y-2"
              >
                <TrustBadge label={t('landing.trust1')} />
                <TrustBadge label={t('landing.trust2')} />
                <TrustBadge label={t('landing.trust3')} />
              </motion.div>
            </div>

            {/* Right — CV preview + floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <CVPreview />

              {/* Floating card 1 */}
              <FloatingCard className="-bottom-6 -left-14 min-w-45">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-stone-800 text-[10px]">Armand K.</div>
                    <div className="text-stone-500 text-[9px]">Hired at Orange</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </FloatingCard>

              {/* Floating card 2 */}
              <FloatingCard className="-top-6 -right-10 max-w-50">
                <p className="text-stone-700 leading-snug">
                  "Generated in <strong>under 3 minutes</strong> 🚀"
                </p>
                <p className="text-stone-400 text-[9px] mt-1">— UB Engineering Graduate</p>
              </FloatingCard>
            </motion.div>
          </div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-14 flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {['#4F46E5', '#0891B2', '#059669', '#D97706', '#DC2626'].map((c, i) => (
                <div
                  key={i}
                  className="size-8 rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: c }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">500+</strong> professionals trust DocuSmart
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-16">
            {[
              { icon: Check, label: '1st CV free forever' },
              { icon: Shield, label: 'Privacy-first, encrypted data' },
              { icon: Layout, label: 'ATS-optimised templates' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-4 text-center">
                <div className="size-16 rounded-2xl bg-foreground flex items-center justify-center">
                  <Icon className="size-8 text-background" />
                </div>
                <p className="text-base font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">{t('landing.howItWorksHeadline')}</h2>
          </FadeInSection>

          <div className="flex flex-col gap-16 md:gap-24">
            <StepCard
              number="01"
              title={t('landing.step1Title')}
              desc={t('landing.step1Desc')}
              visual={
                <div className="space-y-3">
                  {[
                    { label: 'Full Name', value: 'Jean-Baptiste Nkomo' },
                    { label: 'Professional Title', value: 'Software Engineer' },
                    { label: 'Email', value: 'jean@email.cm' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs text-muted-foreground mb-1">{label}</div>
                      <div className="bg-background border border-border rounded-lg px-3 py-2 text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              }
            />

            <StepCard
              number="02"
              title={t('landing.step2Title')}
              desc={t('landing.step2Desc')}
              reverse
              visual={
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Target Role</div>
                    <div className="bg-background border border-border rounded-lg px-3 py-2 text-sm">Senior Backend Engineer</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Company</div>
                    <div className="bg-background border border-border rounded-lg px-3 py-2 text-sm">Jumia Cameroon</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Output Language</div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm text-center font-medium">🇬🇧 English</div>
                      <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-center text-muted-foreground">🇫🇷 Français</div>
                    </div>
                  </div>
                </div>
              }
            />

            <StepCard
              number="03"
              title={t('landing.step3Title')}
              desc={t('landing.step3Desc')}
              visual={
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-ds-ai-foreground bg-ds-ai rounded-lg px-3 py-2">
                    <Brain className="size-3.5 shrink-0" />
                    <span>AI generating your professional summary…</span>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
                    Results-driven Software Engineer with 6+ years architecting high-throughput systems at MTN Cameroon. Proven track record of leading cross-functional teams to deliver 40% latency improvements. Passionate about scalable backend solutions in the African tech ecosystem.
                  </div>
                  <div className="flex gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-ds-ai-foreground/30 overflow-hidden">
                      <div className="h-full w-3/4 bg-ds-ai-foreground rounded-full" />
                    </div>
                    <span className="text-xs text-muted-foreground">Generating…</span>
                  </div>
                </div>
              }
            />

            <StepCard
              number="04"
              title={t('landing.step4Title')}
              desc={t('landing.step4Desc')}
              reverse
              visual={
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-3">
                    {['Horizon', 'Blueprint', 'Clean Slate'].map((name, i) => (
                      <div
                        key={name}
                        className="bg-card border border-border rounded-lg w-20 h-28 flex flex-col overflow-hidden shadow-sm"
                        style={{ transform: `rotate(${(i - 1) * 3}deg)` }}
                      >
                        <div className="h-6 bg-stone-800" />
                        <div className="p-1.5 space-y-1">
                          {[100, 70, 85].map((w, j) => (
                            <div key={j} className="h-1 rounded-full bg-muted" style={{ width: `${w}%` }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-ds-success text-ds-success-foreground rounded-lg px-4 py-2 text-sm font-medium">
                    <Check className="size-4" />
                    Resume successfully downloaded
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ─── TEMPLATE TEASER ─── */}
      <section className="py-16 md:py-20 bg-muted/30" id="templates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">{t('landing.templatesHeadline')}</h2>
              <p className="text-muted-foreground mt-1">
                ATS-optimised designs for every industry and style.
              </p>
            </div>
            <Button variant="outline" asChild className="shrink-0">
              <Link to="/templates">Browse all <ChevronRight className="size-4 ml-1" /></Link>
            </Button>
          </FadeInSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <TemplateThumbnail name="Horizon" color="bg-stone-900" />
            <TemplateThumbnail name="Clean Slate" color="bg-primary" />
            <TemplateThumbnail name="Blueprint" color="bg-teal-700" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-20 md:py-28" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-black">{t('landing.featuresHeadline')}</h2>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map(({ icon, title, desc }) => (
              <FeatureCard key={title} icon={icon} title={title} desc={desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-black">{t('landing.testimonialsHeadline')}</h2>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <TestimonialCard
              quote="DocuSmart saved me so much time before my BEAC interview. The AI rewrote my experience into something I was actually proud to hand over."
              name="Mireille Tchinda"
              role="Finance Analyst · University of Yaoundé II graduate"
            />
            <TestimonialCard
              quote="I created a French CV for a Douala firm and an English one for a remote role — same profile, two perfect outputs in 10 minutes."
              name="Francis Ngum"
              role="Full-Stack Developer · University of Buea"
            />
            <TestimonialCard
              quote="Finally a CV builder that understands the Cameroonian context. The Cameroonian format toggle with date of birth and nationality is exactly what I needed."
              name="Adèle Mvondo"
              role="HR Manager · Société Générale Cameroun"
            />
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <FadeInSection className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-black">{t('landing.faqHeadline')}</h2>
          </FadeInSection>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-base font-medium text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-foreground text-background py-20 md:py-28">
        <FadeInSection className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            {t('landing.ctaBannerHeadline')}
          </h2>
          <p className="text-background/60 mb-8">{t('landing.ctaBannerSub')}</p>
          <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90" asChild>
            <Link to="/register">{t('landing.ctaBannerButton')}</Link>
          </Button>
        </FadeInSection>
      </section>
    </div>
  )
}
