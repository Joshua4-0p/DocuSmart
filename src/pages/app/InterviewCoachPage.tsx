import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ChevronDown, ChevronUp, BrainCircuit, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UpgradePromptModal } from '@/components/shared/UpgradePromptModal'
import { documentApi } from '@/lib/api/document.api'
import { useAuthStore } from '@/store/auth.store'
import type { DocDocument } from '@/lib/api/document.api'

interface QA {
  question: string
  answer: string
}

// Deterministic Q&A generation from document content
function generateQAs(doc: DocDocument): QA[] {
  const role = doc.title.replace(/\s*(cv|resume|cover letter)\s*/gi, '').trim() || 'this role'
  return [
    {
      question: `Tell me about yourself and why you're applying for ${role}.`,
      answer: `Start with a 2–3 sentence professional summary covering your background, key skills, and what draws you to this specific opportunity. Use the STAR method to anchor any examples.`,
    },
    {
      question: `What are your greatest strengths relevant to ${role}?`,
      answer: `Highlight 2–3 concrete strengths backed by specific achievements from your experience. Quantify results wherever possible (e.g., "increased throughput by 30%").`,
    },
    {
      question: `Describe a challenging project you led and what you learned from it.`,
      answer: `Use STAR: Situation (context), Task (your responsibility), Action (what you specifically did), Result (measurable outcome). Keep it under 2 minutes when spoken.`,
    },
    {
      question: `How do you handle competing priorities and tight deadlines?`,
      answer: `Demonstrate a structured approach: prioritisation framework (e.g., MoSCoW), communication with stakeholders, and a past example of managing multiple demands.`,
    },
    {
      question: `Where do you see yourself in 3–5 years?`,
      answer: `Align your growth aspirations with the company's trajectory. Show ambition while conveying commitment to mastering the role first.`,
    },
    {
      question: `Describe a time you disagreed with a colleague or manager. How did you resolve it?`,
      answer: `Show emotional intelligence: acknowledge the other perspective, explain how you found common ground, and highlight the positive outcome for the team.`,
    },
    {
      question: `What do you know about our company and industry?`,
      answer: `Research the company's products, recent news, competitors, and culture. Tie your knowledge back to how you can contribute.`,
    },
    {
      question: `Give an example of when you had to learn something quickly.`,
      answer: `Describe your learning strategy (structured courses, mentorship, documentation), the timeline, and the outcome that proved competence.`,
    },
    {
      question: `How do you give and receive constructive feedback?`,
      answer: `Describe a specific example from both sides — giving thoughtful critique and acting on feedback you received to improve.`,
    },
    {
      question: `Do you have any questions for us?`,
      answer: `Prepare 3–4 thoughtful questions: team structure and collaboration style, success metrics for this role in 90 days, growth opportunities, and company culture around continuous learning.`,
    },
  ]
}

export default function InterviewCoachPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isPro = user?.plan === 'pro' || user?.plan === 'pro_cancelling' || user?.plan === 'one_time'

  const [doc, setDoc] = React.useState<DocDocument | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [expanded, setExpanded] = React.useState<number | null>(0)
  const [showUpgrade, setShowUpgrade] = React.useState(false)

  React.useEffect(() => {
    if (!id) return
    documentApi.get(id).then((d) => { setDoc(d); setLoading(false) })
  }, [id])

  if (!isPro) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <UpgradePromptModal open={showUpgrade} onClose={() => setShowUpgrade(false)} featureName={t('interview.featureName')} />
        <div className="max-w-sm text-center space-y-4">
          <div className="size-16 rounded-2xl bg-ds-premium/10 flex items-center justify-center mx-auto">
            <Lock className="size-8 text-ds-premium-foreground" />
          </div>
          <h2 className="text-xl font-bold">{t('interview.upgradeTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('interview.upgradeDesc')}</p>
          <Button className="w-full bg-ds-premium text-ds-premium-foreground hover:opacity-90" onClick={() => setShowUpgrade(true)}>
            {t('upgrade.cta')}
          </Button>
        </div>
      </div>
    )
  }

  if (loading || !doc) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  const qas = generateQAs(doc)

  return (
    <div className="max-w-2xl">
      <button
        type="button"
        onClick={() => void navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="size-4" />
        {t('common.back')}
      </button>

      <div className="flex items-start gap-3 mb-6">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <BrainCircuit className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t('interview.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('interview.subtitle')} — <span className="font-medium">{doc.title}</span>
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">{t('interview.intro')}</p>

      <div className="space-y-3">
        {qas.map((qa, idx) => (
          <div
            key={idx}
            className="border border-border rounded-xl overflow-hidden bg-card"
          >
            <button
              type="button"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
            >
              <span className="text-sm font-medium pr-3">
                <span className="text-xs text-muted-foreground mr-2 font-normal">Q{idx + 1}.</span>
                {qa.question}
              </span>
              {expanded === idx
                ? <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                : <ChevronDown className="size-4 text-muted-foreground shrink-0" />
              }
            </button>
            {expanded === idx && (
              <div className="px-4 pb-4 pt-0 border-t border-border bg-muted/20">
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">{qa.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">{t('interview.disclaimer')}</p>
    </div>
  )
}
