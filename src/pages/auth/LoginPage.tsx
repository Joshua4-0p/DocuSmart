import * as React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { OAuthButton } from '@/components/shared/OAuthButton'
import { AuthSplitLayout } from '@/components/shared/AuthSplitLayout'
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth.schema'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const { setUser, setTokens } = useAuthStore()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = React.useState(false)
  const [serverError, setServerError] = React.useState('')
  const [notVerified, setNotVerified] = React.useState(false)
  const [failCount, setFailCount] = React.useState(0)
  const [cooldown, setCooldown] = React.useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  React.useEffect(() => {
    if (cooldown <= 0) return
    const tid = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(tid)
  }, [cooldown])

  const onSubmit = async (data: LoginFormValues) => {
    if (cooldown > 0) return
    setServerError('')
    setNotVerified(false)
    try {
      const res = await authApi.login(data)
      setTokens(res.tokens.accessToken)
      setUser(res.user)
      toast(t('auth.signIn') + ' successful', 'success')
      void navigate(redirect, { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'error'
      const newCount = failCount + 1
      setFailCount(newCount)
      if (newCount >= 5) {
        setCooldown(60)
        setServerError(t('auth.tooManyAttempts'))
      } else if (msg.toLowerCase().includes('verified')) {
        setNotVerified(true)
      } else {
        setServerError(t('auth.invalidCredentials'))
      }
    }
  }

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-sm">
        {/* Logo — shown on mobile only (left panel has it on desktop) */}
        <div className="flex justify-center mb-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black">
              D
            </div>
            DocuSmart
          </Link>
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-bold">{t('auth.loginTitle')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('auth.loginSubtitle')}{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              {t('auth.signUpLink')}
            </Link>
          </p>
        </div>

        <OAuthButton onClick={authApi.loginWithGoogle} disabled={isSubmitting} />

        <div className="flex items-center gap-3 my-5">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">{t('common.or')}</span>
          <Separator className="flex-1" />
        </div>

        {serverError && (
          <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
            {serverError}
          </div>
        )}

        {notVerified && (
          <div className="mb-4 text-sm bg-ds-warning text-ds-warning-foreground border border-ds-warning-foreground/20 rounded-lg px-3 py-2.5">
            {t('auth.accountNotVerified')}{' '}
            <button
              type="button"
              className="underline font-medium ml-1"
              onClick={() => void navigate('/verify-email')}
            >
              {t('auth.resendVerification')}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{t('auth.invalidEmail')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                className="pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className={cn('w-full h-11 mt-1', cooldown > 0 && 'opacity-50 cursor-not-allowed')}
            disabled={isSubmitting || cooldown > 0}
          >
            {isSubmitting
              ? t('common.loading')
              : cooldown > 0
                ? `${t('auth.tooManyAttempts').split('.')[0]} (${cooldown}s)`
                : t('auth.signIn')}
          </Button>
        </form>
      </div>
    </AuthSplitLayout>
  )
}
