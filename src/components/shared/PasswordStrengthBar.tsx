import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface PasswordStrengthBarProps {
  password: string
}

function getStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score as 0 | 1 | 2 | 3 | 4
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const { t } = useTranslation()
  const strength = useMemo(() => getStrength(password), [password])

  const labels = [
    '',
    t('auth.passwordStrengthWeak'),
    t('auth.passwordStrengthFair'),
    t('auth.passwordStrengthStrong'),
    t('auth.passwordStrengthVeryStrong'),
  ]

  const segmentColors = [
    'bg-muted',
    'bg-destructive',
    'bg-ds-warning-foreground',
    'bg-primary',
    'bg-ds-success-foreground',
  ]

  if (!password) return null

  return (
    <div className="flex flex-col gap-1.5 mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= strength ? segmentColors[strength] : 'bg-muted',
            )}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className="text-xs text-muted-foreground">{labels[strength]}</p>
      )}
    </div>
  )
}
