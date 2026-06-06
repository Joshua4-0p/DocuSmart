import * as React from 'react'
import { Download, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

interface ExportButtonProps {
  format: 'pdf' | 'docx'
  documentTitle: string
  onExportDone?: () => void
}

export function ExportButton({ format, documentTitle, onExportDone }: ExportButtonProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 2000))

      if (format === 'pdf') {
        // Use browser print dialog as the PDF generation mechanism
        const style = document.createElement('style')
        style.id = 'print-style'
        style.textContent = `
          @media print {
            body > * { display: none !important; }
            #horizon-template, #cover-letter-template { display: block !important; }
            #horizon-template *, #cover-letter-template * { display: block; }
          }
        `
        document.head.appendChild(style)
        window.print()
        document.head.removeChild(style)
      } else {
        // DOCX: create a simple text download as placeholder
        const content = `${documentTitle}\n\nDocuSmart - Document Export\n\nThis document was created with DocuSmart.\n`
        const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${documentTitle.replace(/[^a-zA-Z0-9]/g, '_')}.docx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      toast(t('builder.exportSuccess'), 'success')
      onExportDone?.()
    } catch {
      toast(t('builder.exportError'), 'error')
    } finally {
      setLoading(false)
    }
  }

  if (format === 'pdf') {
    return (
      <Button
        onClick={handleExport}
        disabled={loading}
        className="w-full h-12 text-base gap-2"
        size="lg"
      >
        <Download className="size-4" />
        {loading ? t('builder.generatingPDF') : t('builder.downloadPDF')}
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={loading}
      className="w-full gap-2"
    >
      <FileText className="size-4" />
      {loading ? t('builder.generatingDOCX') : t('builder.downloadDOCX')}
    </Button>
  )
}
