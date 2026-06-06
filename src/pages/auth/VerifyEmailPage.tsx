import * as React from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

export function VerifyEmailPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setUser, setTokens } = useAuthStore()

  const token = searchParams.get('token')
  const email = (location.state as { email?: string } | null)?.email ?? ''

  const [status, setStatus] = React.useState<'pending' | 'verifying' | 'success' | 'error'>(
    token ? 'verifying' : 'pending',
  )
  const [resendCooldown, setResendCooldown] = React.useState(0)

  // Verify token on mount if present
  React.useEffect(() => {
    if (!token) return
    let mounted = true
    setStatus('verifying')
    authApi
      .verifyEmail(token)
      .then((res) => {
        if (!mounted) return
        setTokens(res.tokens.accessToken)
        setUser(res.user)
        setStatus('success')
        setTimeout(() => void navigate('/dashboard', { replace: true }), 2000)
      })
      .catch(() => {
        if (mounted) setStatus('error')
      })
    return () => { mounted = false }
  }, [token, navigate, setTokens, setUser])

  // Resend cooldown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return
    const tid = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(tid)
  }, [resendCooldown])

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return
    try {
      await authApi.resendVerification(email)
      setResendCooldown(60)
    } catch {
      // show generic error
    }
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

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
          {status === 'pending' && (
            <>
              <div className="flex justify-center mb-5">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="size-8 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">{t('auth.checkInbox')}</h1>
              <p className="text-muted-foreground text-sm mb-6">
                {t('auth.checkInboxDesc', { email: email || 'your email' })}
              </p>
              <Button
                variant="outline"
                className="w-full mb-3"
                onClick={() => void handleResend()}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `${t('auth.resendEmail')} (${resendCooldown}s)`
                  : t('auth.resendEmail')}
              </Button>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                {t('auth.wrongEmail')} {t('auth.goBack')}
              </Link>
            </>
          )}

          {status === 'verifying' && (
            <>
              <div className="flex justify-center mb-5">
                <Loader2 className="size-12 text-primary animate-spin" />
              </div>
              <p className="text-muted-foreground">{t('auth.verifyingToken')}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center mb-5">
                <div className="size-16 rounded-full bg-ds-success flex items-center justify-center">
                  <CheckCircle className="size-8 text-ds-success-foreground" />
                </div>
              </div>
              <h1 className="text-xl font-bold">{t('auth.emailVerified')}</h1>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center mb-5">
                <div className="size-16 rounded-full bg-ds-error flex items-center justify-center">
                  <XCircle className="size-8 text-ds-error-foreground" />
                </div>
              </div>
              <h1 className="text-xl font-bold mb-2">{t('auth.invalidLink')}</h1>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => void navigate('/verify-email')}
              >
                {t('auth.requestNewLink')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
