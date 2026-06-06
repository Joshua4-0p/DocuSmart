import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Floating card wrapper ────────────────────────────────────────────────────
function FloatCard({
  delay,
  duration,
  yRange = 12,
  className,
  children,
}: {
  delay: number
  duration: number
  yRange?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      animate={{ y: [0, -yRange, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      className={cn('absolute bg-white rounded-2xl shadow-2xl overflow-hidden select-none', className)}
    >
      {children}
    </motion.div>
  )
}

// ─── Document card designs ────────────────────────────────────────────────────

function CVDarkCard() {
  return (
    <div className="w-52">
      <div className="bg-stone-900 px-4 pt-4 pb-3 text-white">
        <div className="font-bold text-[13px]">Jean-Baptiste Nkomo</div>
        <div className="text-stone-400 text-[10px] mt-0.5">Senior Software Engineer</div>
        <div className="flex gap-1.5 mt-1.5 text-stone-500 text-[8px]">
          <span>jean@email.cm</span><span>•</span><span>Douala, CM</span>
        </div>
      </div>
      <div className="px-4 py-3.5 space-y-3">
        <div>
          <div className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 border-b border-stone-100 pb-0.5">Experience</div>
          <div className="text-[10px] font-semibold text-stone-800">Lead Engineer</div>
          <div className="text-[9px] text-stone-500">MTN Cameroon · 2021 – Present</div>
          <div className="mt-1.5 space-y-1">
            <div className="h-1 bg-stone-100 rounded-full w-full" />
            <div className="h-1 bg-stone-100 rounded-full w-4/5" />
          </div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 border-b border-stone-100 pb-0.5">Skills</div>
          <div className="flex flex-wrap gap-1">
            {['React', 'Node.js', 'TypeScript', 'Docker'].map((s) => (
              <span key={s} className="bg-stone-100 text-stone-600 text-[8px] px-2 py-0.5 rounded-md">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CoverLetterCard() {
  return (
    <div className="w-44">
      <div className="bg-primary px-4 pt-3.5 pb-3 text-primary-foreground">
        <div className="text-[9px] font-semibold uppercase tracking-wider opacity-70">Cover Letter</div>
        <div className="text-[12px] font-bold mt-0.5">Jean-Baptiste N.</div>
      </div>
      <div className="px-4 py-3.5 space-y-2">
        <div className="text-[9px] text-stone-600">Dear Hiring Manager,</div>
        <div className="space-y-1.5">
          {[100, 92, 85, 100, 78, 90].map((w, i) => (
            <div key={i} className="h-1 bg-stone-100 rounded-full" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="pt-1 space-y-1">
          <div className="text-[9px] text-stone-500">Sincerely,</div>
          <div className="h-1 bg-stone-200 rounded-full w-2/5" />
        </div>
      </div>
    </div>
  )
}

function CVTealCard() {
  return (
    <div className="w-48">
      <div className="bg-teal-700 px-4 pt-3.5 pb-3 text-white">
        <div className="font-bold text-[12px]">Adèle Mvondo</div>
        <div className="text-teal-200 text-[10px] mt-0.5">HR Manager · Yaoundé</div>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        <div>
          <div className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1 border-b border-stone-100 pb-0.5">Profile</div>
          <div className="space-y-1">
            {[100, 88, 95].map((w, i) => (
              <div key={i} className="h-1 bg-stone-100 rounded-full" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1 border-b border-stone-100 pb-0.5">Education</div>
          <div className="text-[10px] font-semibold text-stone-800">MBA — Finance</div>
          <div className="text-[9px] text-stone-500">Univ. of Yaoundé II</div>
        </div>
      </div>
    </div>
  )
}

function CVIndigoCard() {
  return (
    <div className="w-40">
      <div className="bg-indigo-700 px-3.5 pt-3 pb-2.5 text-white">
        <div className="font-bold text-[11px]">Francis Ngum</div>
        <div className="text-indigo-200 text-[9px] mt-0.5">Full-Stack Developer</div>
      </div>
      <div className="px-3.5 py-3 space-y-2">
        <div className="space-y-1">
          {[100, 76, 88].map((w, i) => (
            <div key={i} className="h-1 bg-stone-100 rounded-full" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {['Vue.js', 'Go', 'AWS'].map((s) => (
            <span key={s} className="bg-indigo-50 text-indigo-600 text-[8px] px-1.5 py-0.5 rounded">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function AuthLeftPanel() {
  return (
    <div className="relative h-full overflow-hidden bg-stone-950">
      {/* Ambient glows */}
      <div className="absolute top-[30%] left-[40%] -translate-x-1/2 -translate-y-1/2 size-[480px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] size-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[15%] right-[5%] size-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card 1 — CV Dark (center-left) */}
      <FloatCard delay={0} duration={3.6} yRange={13} className="top-[22%] left-[6%] rotate-[-3deg] z-10">
        <CVDarkCard />
      </FloatCard>

      {/* Card 2 — Cover Letter (top-right) */}
      <FloatCard delay={0.9} duration={4.1} yRange={10} className="top-[14%] right-[6%] rotate-[6deg] z-20">
        <CoverLetterCard />
      </FloatCard>

      {/* Card 3 — CV Teal (bottom-right) */}
      <FloatCard delay={1.5} duration={3.9} yRange={14} className="bottom-[14%] right-[8%] rotate-[-5deg] z-10">
        <CVTealCard />
      </FloatCard>

      {/* Card 4 — CV Indigo (bottom-left) */}
      <FloatCard delay={0.4} duration={4.4} yRange={11} className="bottom-[24%] left-[10%] rotate-[4deg] z-20">
        <CVIndigoCard />
      </FloatCard>

      {/* Bottom branding */}
      <div className="absolute bottom-10 left-10 right-10 z-30">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-white mb-3 hover:opacity-80 transition-opacity">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-black shrink-0">
            D
          </div>
          DocuSmart
        </Link>
        <p className="text-2xl font-black text-white leading-tight mb-2">
          Build the CV that<br />gets you the interview.
        </p>
        <p className="text-white/40 text-sm">
          Bilingual · AI-powered · Made for Cameroon
        </p>
      </div>
    </div>
  )
}

// ─── Split layout wrapper ─────────────────────────────────────────────────────

export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left: sticky animated panel */}
      <div className="hidden lg:block w-[45%] shrink-0 sticky top-0 h-screen">
        {/* pt accounts for the floating pill navbar height (~72px) */}
        <div className="h-full pt-[72px]">
          <AuthLeftPanel />
        </div>
      </div>

      {/* Right: scrollable form area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-[88px] pb-16 min-h-screen">
        {children}
      </div>
    </div>
  )
}
