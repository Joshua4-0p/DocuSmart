import { Lock } from 'lucide-react'

interface Props {
  size?: 'sm' | 'md'
}

export function ProTemplateLock({ size = 'sm' }: Props) {
  if (size === 'md') {
    return (
      <div className="flex items-center gap-1.5 bg-black/75 text-white text-xs font-medium px-2.5 py-1 rounded-full">
        <Lock size={11} strokeWidth={2.5} />
        <span>Pro</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
      <Lock size={10} />
      Pro
    </div>
  )
}
