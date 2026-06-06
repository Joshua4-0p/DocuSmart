import * as React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordStrengthBar } from '@/components/shared/PasswordStrengthBar'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/schemas/auth.schema'
import { authApi } from '@/lib/api/auth.api'

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [showPassword, setShowPassword] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [serverError, setServerError] = React.useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  })

  const password = watch('password', '')

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setServerError('')
    try {
      await authApi.resetPassword(token, data.password)
      setDone(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
          <XCircle className="size-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">{t('auth.invalidLink')}</h1>
          <Button variant="outline" asChild className="mt-2">
            <Link to="/forgot-password">{t('auth.requestNewLink')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black">D</div>
            DocuSmart
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {!done ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">{t('auth.setNewPassword')}</h1>
              </div>

              {serverError && (
                <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">{t('auth.newPassword')}</Label>
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
                  <Label htmlFor="confirmPassword">{t('auth.confirmNewPassword')}</Label>
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

                <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  {isSubmitting ? t('common.loading') : t('auth.setNewPassword')}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="size-14 rounded-full bg-ds-success flex items-center justify-center mx-auto mb-4">
                <svg className="size-7 text-ds-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-1">{t('auth.passwordUpdated')}</h2>
              <Link to="/login" className="text-primary text-sm hover:underline">
                {t('auth.signInNow')} →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
