import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Copy, Check, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PasswordStrengthBar } from '@/components/shared/PasswordStrengthBar'
import { changePasswordSchema, type ChangePasswordFormValues } from '@/lib/schemas/auth.schema'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/components/ui/toast'

function GeneralTab() {
  const { t, i18n } = useTranslation()
  const { user, updateUser } = useAuthStore()
  const { toast } = useToast()
  const [lang, setLang] = React.useState(i18n.language.startsWith('fr') ? 'fr' : 'en')
  const [displayName, setDisplayName] = React.useState(user?.name ?? '')
  const [dateFormat, setDateFormat] = React.useState('DD/MM/YYYY')
  const [isSaving, setIsSaving] = React.useState(false)

  const changeLang = (l: string) => {
    setLang(l)
    void i18n.changeLanguage(l)
    localStorage.setItem('ds-language', l)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await authApi.updateProfile({ name: displayName })
      updateUser({ name: displayName })
      toast(t('settings.saveChanges') + ' — ' + t('common.saved'), 'success')
    } catch {
      toast(t('common.error'), 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-sm">
      <div className="flex flex-col gap-1.5">
        <Label>{t('settings.displayName')}</Label>
        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your full name" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t('settings.emailAddress')}</Label>
        <div className="flex gap-2 items-center">
          <p className="text-sm flex-1 bg-muted rounded-lg px-3 h-11 flex items-center text-muted-foreground">{user?.email}</p>
          <Button variant="outline" size="sm" disabled className="shrink-0">{t('settings.changeEmail')}</Button>
        </div>
        <p className="text-xs text-muted-foreground">Email change requires verification — coming soon.</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t('settings.interfaceLanguage')}</Label>
        <div className="flex gap-2">
          <Button variant={lang === 'en' ? 'default' : 'outline'} size="sm" onClick={() => changeLang('en')}>English</Button>
          <Button variant={lang === 'fr' ? 'default' : 'outline'} size="sm" onClick={() => changeLang('fr')}>Français</Button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t('settings.dateFormat')}</Label>
        <div className="flex gap-2">
          {['DD/MM/YYYY', 'MM/DD/YYYY'].map((fmt) => (
            <Button key={fmt} variant={dateFormat === fmt ? 'default' : 'outline'} size="sm" onClick={() => setDateFormat(fmt)}>{fmt}</Button>
          ))}
        </div>
      </div>
      <Button onClick={() => void handleSave()} disabled={isSaving} className="w-fit">
        {isSaving ? <><Loader2 className="size-4 animate-spin mr-2" />{t('common.saving')}</> : t('settings.saveChanges')}
      </Button>
    </div>
  )
}

function SecurityTab() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [showCurrent, setShowCurrent] = React.useState(false)
  const [showNew, setShowNew] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onBlur',
  })

  const newPassword = watch('newPassword') ?? ''

  const changePw = useMutation({
    mutationFn: (data: ChangePasswordFormValues) => authApi.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => { toast(t('settings.passwordChanged'), 'success'); reset() },
    onError: () => toast(t('settings.passwordChangeFailed'), 'error'),
  })

  const onSubmit = (data: ChangePasswordFormValues) => changePw.mutateAsync(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
      <div className="flex flex-col gap-1.5">
        <Label>{t('settings.currentPassword')}</Label>
        <div className="relative">
          <Input type={showCurrent ? 'text' : 'password'} {...register('currentPassword')} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" onClick={() => setShowCurrent(!showCurrent)}>{showCurrent ? t('auth.hide') : t('auth.show')}</button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t('settings.newPassword')}</Label>
        <div className="relative">
          <Input type={showNew ? 'text' : 'password'} {...register('newPassword')} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" onClick={() => setShowNew(!showNew)}>{showNew ? t('auth.hide') : t('auth.show')}</button>
        </div>
        <PasswordStrengthBar password={newPassword} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>{t('settings.confirmNewPassword')}</Label>
        <div className="relative">
          <Input type={showConfirm ? 'text' : 'password'} {...register('confirmNewPassword')} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? t('auth.hide') : t('auth.show')}</button>
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? <><Loader2 className="size-4 animate-spin mr-2" />{t('common.saving')}</> : t('settings.changePassword')}
      </Button>
    </form>
  )
}

function NotificationsTab() {
  const { t } = useTranslation()
  const [prefs, setPrefs] = React.useState({
    notifExport: true,
    notifPayment: true,
    notifRenewal: true,
    notifUpdates: true,
  })
  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const items: { key: keyof typeof prefs; labelKey: string }[] = [
    { key: 'notifExport', labelKey: 'settings.notifExport' },
    { key: 'notifPayment', labelKey: 'settings.notifPayment' },
    { key: 'notifRenewal', labelKey: 'settings.notifRenewal' },
    { key: 'notifUpdates', labelKey: 'settings.notifUpdates' },
  ]

  return (
    <div className="flex flex-col gap-4">
      {items.map(({ key, labelKey }) => (
        <div key={key} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 min-h-11">
          <p className="text-sm font-medium">{t(labelKey)}</p>
          <Switch checked={prefs[key]} onCheckedChange={() => toggle(key)} />
        </div>
      ))}
    </div>
  )
}

function ProfileLinkTab() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { user, updateUser } = useAuthStore()
  const [username, setUsername] = React.useState(user?.username ?? '')
  const [bio, setBio] = React.useState(user?.bio ?? '')
  const [publicProfile, setPublicProfile] = React.useState(user?.profilePublic ?? false)
  const [saving, setSaving] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const profileUrl = `${window.location.origin}/${username}`

  const handleSave = async () => {
    if (!username.trim()) return
    setSaving(true)
    try {
      await authApi.updateProfile({ username: username.trim(), bio: bio.trim() || undefined, profilePublic: publicProfile })
      updateUser({ username: username.trim(), bio: bio.trim() || undefined, profilePublic: publicProfile })
      toast(t('common.saved'), 'success')
    } catch {
      toast(t('common.error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = () => {
    void navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col gap-6 max-w-sm">
      <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
        <Globe className="size-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">{t('settings.profileLinkTitle')}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{t('settings.profileLinkDesc')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t('settings.username')}</Label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
          placeholder="your-name"
        />
        <p className="text-xs text-muted-foreground">{t('settings.usernameHint')}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t('settings.bio')}</Label>
        <Input
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 160))}
          placeholder={t('settings.bioPlaceholder')}
        />
        <p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
      </div>

      <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 min-h-11">
        <div>
          <p className="text-sm font-medium">{t('settings.makeProfilePublic')}</p>
          <p className="text-xs text-muted-foreground">{t('settings.makeProfilePublicDesc')}</p>
        </div>
        <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
      </div>

      {username && publicProfile && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/30">
          <p className="text-xs text-muted-foreground flex-1 truncate">{profileUrl}</p>
          <button type="button" onClick={handleCopy} className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0">
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>
      )}

      <Button onClick={() => void handleSave()} disabled={saving || !username.trim()} className="w-fit">
        {saving ? <><Loader2 className="size-4 animate-spin mr-2" />{t('common.saving')}</> : t('settings.saveChanges')}
      </Button>
    </div>
  )
}

function DangerZoneTab() {
  const { t } = useTranslation()
  const { logout } = useAuthStore()
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [deleteInput, setDeleteInput] = React.useState('')
  const canDelete = deleteInput === 'DELETE'

  const deleteAccount = useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => { logout(); window.location.href = '/' },
  })

  return (
    <div>
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-destructive">{t('settings.deleteAccount')}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{t('settings.deleteAccountDesc')}</p>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>{t('settings.deleteAccount')}</Button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('settings.deleteAccount')}
        description={t('settings.deleteAccountWarning')}
        confirmLabel={t('settings.deleteAccount')}
        isDestructive
        isLoading={deleteAccount.isPending}
        onConfirm={() => { if (canDelete) void deleteAccount.mutateAsync() }}
      >
        <div className="mt-3">
          <Label className="text-sm">{t('settings.typeDeleteToConfirm')}</Label>
          <Input className="mt-1.5" placeholder="DELETE" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} />
        </div>
      </ConfirmDialog>
    </div>
  )
}

export function SettingsPage() {
  const { t } = useTranslation()
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-6">{t('settings.title')}</h1>
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">{t('settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.tabs.security')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="profileLink">{t('settings.tabs.profileLink')}</TabsTrigger>
          <TabsTrigger value="danger">{t('settings.tabs.danger')}</TabsTrigger>
        </TabsList>
        <TabsContent value="general"><GeneralTab /></TabsContent>
        <TabsContent value="security"><SecurityTab /></TabsContent>
        <TabsContent value="notifications"><NotificationsTab /></TabsContent>
        <TabsContent value="profileLink"><ProfileLinkTab /></TabsContent>
        <TabsContent value="danger"><DangerZoneTab /></TabsContent>
      </Tabs>
    </div>
  )
}
