import { cn } from '@/lib/utils'

interface Props {
  className?: string
  size?: 'sm' | 'md'
}

export function ProBadge({ className, size = 'sm' }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full bg-ds-premium/10 text-ds-premium-foreground border border-ds-premium/20',
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1',
        className,
      )}
    >
      Pro
    </span>
  )
}
