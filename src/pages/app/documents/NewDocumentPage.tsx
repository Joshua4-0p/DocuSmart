import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  type DocumentType,
  type CompanyType,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_DESCRIPTIONS,
  FREE_DOCUMENT_TYPES,
  DEFAULT_SECTION_ORDER,
} from '@/types/document'
import { documentApi } from '@/lib/api/document.api'

const ALL_TYPES: DocumentType[] = [
  'cv', 'cover_letter', 'motivation_letter', 'recommendation_letter',
  'personal_statement', 'research_proposal', 'expression_of_interest', 'writing_sample',
]

const COMPANY_TYPES: CompanyType[] = [
  'private', 'government', 'ngo', 'academic', 'startup', 'international', 'other',
]

const COUNTRIES = [
  'Cameroon', 'Nigeria', 'Ghana', "Côte d'Ivoire", 'Senegal', 'Kenya',
  'South Africa', 'France', 'United Kingdom', 'United States', 'Canada', 'Other',
]

export function NewDocumentPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [phase, setPhase] = React.useState<'type' | 'context'>('type')
  const [selectedType, setSelectedType] = React.useState<DocumentType | null>(null)
  const [creating, setCreating] = React.useState(false)

  // Context form state
  const [jobTitle, setJobTitle] = React.useState('')
  const [companyName, setCompanyName] = React.useState('')
  const [companyType, setCompanyType] = React.useState<CompanyType>('private')
  const [targetCountry, setTargetCountry] = React.useState('Cameroon')
  const [language, setLanguage] = React.useState<'en' | 'fr'>('en')
  const [industry, setIndustry] = React.useState('')

  const isFree = (type: DocumentType) => FREE_DOCUMENT_TYPES.includes(type)

  const handleContinue = () => {
    if (!selectedType) return
    setPhase('context')
  }

  const handleCreate = async () => {
    if (!selectedType || !jobTitle.trim()) return
    setCreating(true)
    try {
      const doc = await documentApi.create(
        selectedType,
        {
          jobTitle: jobTitle.trim(),
          companyName: companyName.trim() || undefined,
          companyType,
          targetCountry,
          industry: industry.trim() || undefined,
          language,
        },
        ['personal', 'summary', 'experience', 'education', 'skills'],
        [...DEFAULT_SECTION_ORDER],
      )
      void navigate(`/builder/${doc.id}?step=1`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {phase === 'context' && (
            <button
              type="button"
              onClick={() => setPhase('type')}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="size-4" />
              {t('newDocument.back')}
            </button>
          )}
          <h1 className="text-2xl font-bold mb-1">{t('newDocument.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('newDocument.subtitle')}</p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'type' && (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <p className="text-sm font-semibold mb-4">{t('newDocument.chooseType')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {ALL_TYPES.map((type) => {
                  const isPro = !isFree(type)
                  const isSelected = selectedType === type
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => !isPro && setSelectedType(type)}
                      disabled={isPro}
                      className={`flex flex-col items-start text-left rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : isPro
                            ? 'border-border bg-muted/30 opacity-50 cursor-not-allowed'
                            : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="font-semibold text-sm">{DOCUMENT_TYPE_LABELS[type]}</span>
                        {isPro ? (
                          <Badge className="bg-ds-premium/10 text-ds-premium-foreground border-ds-premium/20 text-[10px] px-1.5">
                            Pro
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5">Free</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {DOCUMENT_TYPE_DESCRIPTIONS[type]}
                      </p>
                    </button>
                  )
                })}
              </div>

              <Button
                onClick={handleContinue}
                disabled={!selectedType}
                className="w-full"
              >
                {t('newDocument.continueBtn')}
              </Button>
            </motion.div>
          )}

          {phase === 'context' && (
            <motion.div
              key="context"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
            >
              <p className="text-sm font-semibold mb-4">{t('newDocument.contextTitle')}</p>

              <div className="space-y-4 mb-8">
                {/* Job Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle">
                    {t('newDocument.jobTitle')}
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={t('newDocument.jobTitlePlaceholder')}
                    autoFocus
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">{t('newDocument.companyName')}</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
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
                    aria-label={t('newDocument.companyType')}
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value as CompanyType)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {COMPANY_TYPES.map((ct) => {
                      const label = ct === 'private' ? t('newDocument.companyTypePrivate')
                        : ct === 'government' ? t('newDocument.companyTypeGov')
                        : ct === 'ngo' ? t('newDocument.companyTypeNgo')
                        : ct === 'academic' ? t('newDocument.companyTypeAcademic')
                        : ct === 'startup' ? t('newDocument.companyTypeStartup')
                        : ct === 'international' ? t('newDocument.companyTypeIntl')
                        : t('newDocument.companyTypeOther')
                      return <option key={ct} value={ct}>{label}</option>
                    })}
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
                    aria-label={t('newDocument.targetCountry')}
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
                        onClick={() => setLanguage(lang)}
                        className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${language === lang ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
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
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder={t('newDocument.industryPlaceholder')}
                  />
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={!jobTitle.trim() || creating}
                className="w-full"
              >
                {creating ? t('common.loading') : t('newDocument.createDocumentBtn')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
