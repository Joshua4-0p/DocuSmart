import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { OAuthButton } from '@/components/shared/OAuthButton'
import { PasswordStrengthBar } from '@/components/shared/PasswordStrengthBar'
import { AuthSplitLayout } from '@/components/shared/AuthSplitLayout'
import { registerSchema, type RegisterFormValues } from '@/lib/schemas/auth.schema'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

export function RegisterPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { setUser, setTokens } = useAuthStore()
  const [showPassword, setShowPassword] = React.useState(false)
  const [serverError, setServerError] = React.useState('')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      language: (i18n.language as 'en' | 'fr') ?? 'en',
      terms: false,
    },
  })

  const password = watch('password', '')

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError('')
    try {
      const res = await authApi.register(data)
      setTokens(res.tokens.accessToken)
      setUser(res.user)
      void navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-sm">
        {/* Logo — mobile only */}
        <div className="flex justify-center mb-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black">
              D
            </div>
            DocuSmart
          </Link>
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-bold">{t('auth.registerTitle')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('auth.registerSubtitle')}{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              {t('auth.signInLink')}
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

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">{t('auth.fullName')}</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{t('auth.nameRequired')}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-destructive">{t('auth.invalidEmail')}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
            <PasswordStrengthBar password={password} />
            {errors.password && (
              <p className="text-xs text-destructive">{t('auth.passwordTooShort')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{t('auth.passwordMismatch')}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="terms"
                  checked={field.value}
                  onChange={field.onChange}
                  aria-label={t('auth.agreeToTerms')}
                  className="mt-0.5 size-4 cursor-pointer accent-primary"
                />
              )}
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal leading-relaxed cursor-pointer">
              {t('auth.agreeToTerms')}{' '}
              <Link to="/terms" className="text-primary underline">{t('auth.termsOfService')}</Link>{' '}
              {t('auth.and')}{' '}
              <Link to="/privacy" className="text-primary underline">{t('auth.privacyPolicy')}</Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-xs text-destructive -mt-2">{t('auth.termsRequired')}</p>
          )}

          {/* Language preference */}
          <div className="flex gap-2">
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <>
                  <button
                    type="button"
                    onClick={() => { field.onChange('en'); void i18n.changeLanguage('en') }}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${field.value === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => { field.onChange('fr'); void i18n.changeLanguage('fr') }}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${field.value === 'fr' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}
                  >
                    Français
                  </button>
                </>
              )}
            />
          </div>

          <Button type="submit" className="w-full h-11 mt-1" disabled={isSubmitting}>
            {isSubmitting ? t('common.loading') : t('auth.createAccount')}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-5">
          <button
            type="button"
            onClick={() => void i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
            className="hover:text-foreground transition-colors"
          >
            {i18n.language === 'en' ? 'Passer en Français' : 'Switch to English'}
          </button>
        </p>
      </div>
    </AuthSplitLayout>
  )
}
