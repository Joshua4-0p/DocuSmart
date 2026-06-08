import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, RotateCcw, Eye, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UpgradePromptModal } from '@/components/shared/UpgradePromptModal'
import { TemplatePreviewLarge } from '@/components/builder/TemplatePreviewLarge'
import { versionsApi } from '@/lib/api/applications.api'
import { documentApi } from '@/lib/api/document.api'
import { useBuilderStore } from '@/store/builder.store'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/components/ui/toast'
import type { DocumentVersion } from '@/types/application'
import type { DocDocument } from '@/lib/api/document.api'

function fmt(d: string) {
  return new Date(d).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function VersionHistoryPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const isPro = user?.plan === 'pro' || user?.plan === 'pro_cancelling' || user?.plan === 'one_time'
  const builderState = useBuilderStore()

  const [versions, setVersions] = React.useState<DocumentVersion[]>([])
  const [doc, setDoc] = React.useState<DocDocument | null>(null)
  const [selectedVersion, setSelectedVersion] = React.useState<DocumentVersion | null>(null)
  const [restoring, setRestoring] = React.useState<string | null>(null)
  const [showUpgrade, setShowUpgrade] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!id) return
    Promise.all([versionsApi.list(id), documentApi.get(id)]).then(([vList, docEntry]) => {
      setVersions(vList)
      setDoc(docEntry)
      if (vList.length > 0) setSelectedVersion(vList[0])
      setLoading(false)
    })
  }, [id])

  const handleRestore = async (version: DocumentVersion) => {
    if (!id || !doc) return
    setRestoring(version.id)
    try {
      // Save current as a new version snapshot before restoring
      await versionsApi.saveVersion(id, {
        generatedContent: builderState.generatedContent,
        selectedSections: builderState.selectedSections,
        templateId: builderState.templateId,
        accentColor: builderState.accentColor,
        changeDescription: 'Snapshot before restore',
      })
      // Restore: update the document with the version's content
      await documentApi.update(id, {
        generatedContent: version.generatedContent,
        selectedSections: version.selectedSections,
        templateId: version.templateId,
        accentColor: version.accentColor,
      })
      toast(t('versions.restored', { v: version.versionNumber }), 'success')
      setTimeout(() => void navigate(`/builder/${id}`), 800)
    } finally {
      setRestoring(null)
    }
  }

  if (!isPro) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <UpgradePromptModal open={showUpgrade} onClose={() => setShowUpgrade(false)} featureName={t('versions.featureName')} />
        <div className="max-w-sm text-center space-y-4">
          <div className="size-16 rounded-2xl bg-ds-premium/10 flex items-center justify-center mx-auto">
            <Lock className="size-8 text-ds-premium-foreground" />
          </div>
          <h2 className="text-xl font-bold">{t('versions.upgradeTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('versions.upgradeDesc')}</p>
          <Button className="w-full bg-ds-premium text-ds-premium-foreground hover:opacity-90" onClick={() => setShowUpgrade(true)}>
            {t('upgrade.cta')}
          </Button>
        </div>
      </div>
    )
  }

  // Build a preview state for the selected version
  const previewState = selectedVersion
    ? {
        ...builderState,
        generatedContent: selectedVersion.generatedContent,
        selectedSections: selectedVersion.selectedSections,
        templateId: selectedVersion.templateId,
        accentColor: selectedVersion.accentColor,
      }
    : null

  return (
    <div className="flex h-full min-h-0 overflow-hidden gap-0">
      {/* Left: version list */}
      <div className="w-72 shrink-0 border-r border-border bg-card overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-border">
          <button
            type="button"
            onClick={() => void navigate(`/builder/${id}`)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="size-4" />
            {t('common.back')}
          </button>
          <h2 className="text-base font-bold">{t('versions.title')}</h2>
          {doc && <p className="text-xs text-muted-foreground mt-0.5 truncate">{doc.title}</p>}
        </div>

        {loading && (
          <div className="flex items-center justify-center flex-1">
            <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && versions.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">{t('versions.empty')}</div>
        )}

        <div className="flex-1 divide-y divide-border">
          {versions.map((v, idx) => (
            <div
              key={v.id}
              className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedVersion?.id === v.id ? 'bg-primary/5' : ''}`}
              onClick={() => setSelectedVersion(v)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">v{v.versionNumber}</span>
                <div className="flex gap-1">
                  {idx === 0 && <Badge className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border-0">{t('versions.current')}</Badge>}
                  {idx === versions.length - 1 && versions.length > 1 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">{t('versions.first')}</Badge>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{fmt(v.createdAt)}</p>
              <p className="text-xs text-muted-foreground mt-0.5 italic truncate">{v.changeDescription}</p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedVersion(v) }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Eye className="size-3" />
                  {t('versions.preview')}
                </button>
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); void handleRestore(v) }}
                    disabled={restoring === v.id}
                    className="flex items-center gap-1 text-xs text-primary hover:underline transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="size-3" />
                    {restoring === v.id ? t('common.loading') : t('versions.restore')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: preview */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {previewState ? (
          <TemplatePreviewLarge state={previewState} zoom={0.5} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {t('versions.selectToPreview')}
          </div>
        )}
      </div>
    </div>
  )
}
