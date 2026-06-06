import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  type DocumentType,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_DESCRIPTIONS,
  FREE_DOCUMENT_TYPES,
} from '@/types/document'
import { useBuilderStore } from '@/store/builder.store'

const ALL_TYPES: DocumentType[] = [
  'cv', 'cover_letter', 'motivation_letter', 'recommendation_letter',
  'personal_statement', 'research_proposal', 'expression_of_interest', 'writing_sample',
]

export function Step1DocType() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const state = useBuilderStore()
  const isFree = (type: DocumentType) => FREE_DOCUMENT_TYPES.includes(type)

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <h2 className="text-xl font-bold mb-1">{t('builder.step1Title')}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Your document type is set. You can change it before generating.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
        {ALL_TYPES.map((type) => {
          const isActive = state.documentType === type
          const isPro = !isFree(type)
          return (
            <button
              key={type}
              type="button"
              disabled={isPro}
              onClick={() => !isPro && useBuilderStore.setState({ documentType: type })}
              className={cn(
                'flex flex-col items-start text-left rounded-xl border-2 p-4 transition-all',
                isActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40 bg-card',
                isPro && 'opacity-50 cursor-not-allowed',
              )}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-semibold text-sm">{DOCUMENT_TYPE_LABELS[type]}</span>
                {isPro ? (
                  <Badge className="bg-ds-premium/20 text-ds-premium-foreground text-[10px] px-1.5">Pro</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] px-1.5">Free</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{DOCUMENT_TYPE_DESCRIPTIONS[type]}</p>
            </button>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        <button
          type="button"
          className="text-primary underline"
          onClick={() => void navigate('/documents/new')}
        >
          {t('builder.changeType')}
        </button>
        {' '}to start over with a different document type.
      </p>
    </div>
  )
}
