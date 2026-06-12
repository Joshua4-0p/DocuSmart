import * as React from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QRCodeDisplayProps {
  url: string
}

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !url) return
    setReady(false)
    QRCode.toCanvas(canvas, url, {
      width: 160,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
    }).then(() => setReady(true)).catch(() => undefined)
  }, [url])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'docusmart-profile-qr.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card w-fit">
      <canvas ref={canvasRef} className={ready ? 'opacity-100' : 'opacity-0'} />
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={!ready}
        className="gap-2 w-full"
      >
        <Download className="size-3.5" />
        Download QR Code
      </Button>
    </div>
  )
}
