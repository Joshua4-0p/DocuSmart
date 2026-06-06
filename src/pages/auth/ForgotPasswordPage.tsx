import * as React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/schemas/auth.schema'
import { authApi } from '@/lib/api/auth.api'

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [sent, setSent] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await authApi.forgotPassword(data.email)
    } catch {
      // always show success to prevent user enumeration
    }
    setSent(true)
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
          {!sent ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">{t('auth.resetPassword')}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t('auth.resetPasswordDesc')}</p>
              </div>

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
                <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                  {isSubmitting ? t('common.loading') : t('auth.sendResetLink')}
                </Button>
              </form>

              <p className="text-center mt-4 text-sm">
                <Link to="/login" className="text-muted-foreground hover:text-foreground">
                  ← {t('auth.signInLink')}
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="size-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-foreground font-medium mb-1">{t('auth.resetLinkSent')}</p>
              <Link to="/login" className="text-sm text-primary hover:underline">
                ← {t('auth.signInLink')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
