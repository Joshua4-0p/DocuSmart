import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { JDMatchPanel } from '@/components/builder/JDMatchPanel'
import { useBuilderStore } from '@/store/builder.store'
import { aiApi } from '@/lib/api/ai.api'
import { getProfileSnapshot } from '@/lib/api/profile.api'

const COMPANY_TYPES = [
  'private', 'government', 'ngo', 'academic', 'startup', 'international', 'other',
] as const

const COUNTRIES = [
  'Cameroon', 'Nigeria', 'Ghana', 'Côte d\'Ivoire', 'Senegal', 'Kenya',
  'South Africa', 'France', 'United Kingdom', 'United States', 'Canada', 'Other',
]

export function Step2Context() {
  const { t } = useTranslation()
  const { context, setContext, jdMatchResult, setJDMatchResult } = useBuilderStore()
  const [jdOpen, setJdOpen] = React.useState(false)
  const [jdText, setJdText] = React.useState(context.jobDescription ?? '')
  const [analysing, setAnalysing] = React.useState(false)
  const [analysisFailed, setAnalysisFailed] = React.useState(false)

  const handleAnalyseJD = async () => {
    if (!jdText.trim()) return
    setAnalysing(true)
    setAnalysisFailed(false)
    try {
      const profile = getProfileSnapshot()
      const skillNames = profile.skills.map((s) => s.name)
      const result = await aiApi.analyzeJD(jdText, skillNames)
      setJDMatchResult(result)
      setContext({ jobDescription: jdText })
    } catch {
      setAnalysisFailed(true)
    } finally {
      setAnalysing(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <h2 className="text-xl font-bold mb-1">{t('builder.step2Title')}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        This context shapes how AI tailors your document.
      </p>

      <div className="max-w-xl space-y-5">
        {/* Job Title */}
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">
            {t('newDocument.jobTitle')}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="jobTitle"
            value={context.jobTitle}
            onChange={(e) => setContext({ jobTitle: e.target.value })}
            placeholder={t('newDocument.jobTitlePlaceholder')}
          />
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <Label htmlFor="companyName">{t('newDocument.companyName')}</Label>
          <Input
            id="companyName"
            value={context.companyName ?? ''}
            onChange={(e) => setContext({ companyName: e.target.value })}
            placeholder={t('newDocument.companyNamePlaceholder')}
          />
        </div>

        {/* Company Type */}
        <div className="space-y-1.5">
          <Label htmlFor="companyType">
            {t('newDocument.companyType')}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <select
            id="companyType"
            value={context.companyType}
            onChange={(e) => setContext({ companyType: e.target.value as typeof context.companyType })}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {COMPANY_TYPES.map((ct) => (
              <option key={ct} value={ct}>
                {t(`newDocument.companyType${ct.charAt(0).toUpperCase() + ct.slice(1).replace('-', '')}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Target Country */}
        <div className="space-y-1.5">
          <Label htmlFor="targetCountry">
            {t('newDocument.targetCountry')}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <select
            id="targetCountry"
            value={context.targetCountry}
            onChange={(e) => setContext({ targetCountry: e.target.value })}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <Label>{t('newDocument.language')}</Label>
          <div className="flex gap-2">
            {(['en', 'fr'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setContext({ language: lang })}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${context.language === lang ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}
              >
                {lang === 'en' ? 'English' : 'Français'}
              </button>
            ))}
          </div>
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <Label htmlFor="industry">{t('newDocument.industry')}</Label>
          <Input
            id="industry"
            value={context.industry ?? ''}
            onChange={(e) => setContext({ industry: e.target.value })}
            placeholder={t('newDocument.industryPlaceholder')}
          />
        </div>

        {/* JD Scanner */}
        <div className="border border-border rounded-xl overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/30 transition-colors"
            onClick={() => setJdOpen((o) => !o)}
          >
            <span>{t('builder.jdLabel')}</span>
            {jdOpen ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </button>

          {jdOpen && (
            <div className="px-4 pb-4 space-y-3 border-t border-border">
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value.slice(0, 5000))}
                placeholder={t('builder.jdPlaceholder')}
                rows={6}
                className="w-full mt-3 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{jdText.length}/5000</span>
                <Button
                  size="sm"
                  onClick={handleAnalyseJD}
                  disabled={!jdText.trim() || analysing}
                >
                  {analysing ? t('builder.analysing') : t('builder.analyseJD')}
                </Button>
              </div>
              {analysisFailed && (
                <p className="text-xs text-muted-foreground">{t('builder.analysisFailed')}</p>
              )}
              {jdMatchResult && !analysing && (
                <JDMatchPanel result={jdMatchResult} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
