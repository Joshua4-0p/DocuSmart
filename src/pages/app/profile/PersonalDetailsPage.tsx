import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SaveIndicator } from '@/components/shared/SaveIndicator'
import { PageHeader } from '@/components/shared/PageHeader'
import { personalDetailsSchema, type PersonalDetailsFormValues } from '@/lib/schemas/profile.schema'
import { profileApi } from '@/lib/api/profile.api'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/components/ui/toast'

export function PersonalDetailsPage() {
  const { t } = useTranslation()
  const { user, updateUser } = useAuthStore()
  const { toast } = useToast()
  const [avatarPreview, setAvatarPreview] = React.useState(user?.avatarUrl ?? '')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.name?.split(' ')[0] ?? '',
      lastName: user?.name?.split(' ').slice(1).join(' ') ?? '',
      professionalTitle: '',
      phone: '',
      country: 'Cameroon',
      cameroonian: false,
    },
  })

  const formValues = watch()
  const isCameroonian = watch('cameroonian')
  const charCount = (watch('summary') ?? '').length

  const saveFn = React.useCallback(
    async (data: PersonalDetailsFormValues) => {
      await profileApi.updatePersonal({ ...data, cameroonian: data.cameroonian ?? false })
      updateUser({ name: `${data.firstName} ${data.lastName}`.trim() })
    },
    [updateUser],
  )

  const { status } = useAutoSave(formValues, saveFn, 3000)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast('Photo must be under 5MB', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
    profileApi.uploadPhoto(file)
      .then(({ avatarUrl }) => updateUser({ avatarUrl }))
      .catch(() => toast('Photo upload failed', 'error'))
  }

  const onSubmit = async (data: PersonalDetailsFormValues) => {
    try {
      await profileApi.updatePersonal({ ...data, cameroonian: data.cameroonian ?? false })
      toast(t('common.saved'), 'success')
    } catch {
      toast(t('common.error'), 'error')
    }
  }

  const initials = [watch('firstName')?.[0], watch('lastName')?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase()

  return (
    <div>
      <PageHeader
        title={t('profile.personal')}
        breadcrumb={{ label: t('profile.title'), to: '/profile' }}
        actions={<SaveIndicator status={status} />}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Photo upload */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <Avatar className="size-20">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback className="text-xl">{initials || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4 mr-2" />
                Upload Photo
              </Button>
              {avatarPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => setAvatarPreview('')}
                >
                  <X className="size-4 mr-2" />
                  Remove
                </Button>
              )}
              <p className="text-xs text-muted-foreground">JPEG, PNG, WebP · Max 5MB</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-5">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" aria-invalid={!!errors.firstName} {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-destructive">{t('common.required')}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" aria-invalid={!!errors.lastName} {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-destructive">{t('common.required')}</p>}
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="professionalTitle">Professional Title / Headline *</Label>
              <Input
                id="professionalTitle"
                placeholder="e.g. Software Engineer | University of Buea"
                aria-invalid={!!errors.professionalTitle}
                {...register('professionalTitle')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="+237 677 000 000" {...register('phone')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="country">Country *</Label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cameroon">🇨🇲 Cameroon</SelectItem>
                      <SelectItem value="Nigeria">🇳🇬 Nigeria</SelectItem>
                      <SelectItem value="France">🇫🇷 France</SelectItem>
                      <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                      <SelectItem value="USA">🇺🇸 United States</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Douala" {...register('city')} />
            </div>
          </div>
        </div>

        {/* Online Presence */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-5">Online Presence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" placeholder="linkedin.com/in/yourprofile" {...register('linkedinUrl')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input id="githubUrl" placeholder="github.com/yourusername" {...register('githubUrl')} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="websiteUrl">Personal Website / Portfolio</Label>
              <Input id="websiteUrl" placeholder="yourportfolio.com" {...register('websiteUrl')} />
            </div>
          </div>
        </div>

        {/* Cameroonian Format Toggle */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Label className="text-base font-semibold">{t('profile.cameroonianFormat')}</Label>
              <p className="text-sm text-muted-foreground mt-1">{t('profile.cameroonianFormatHelp')}</p>
            </div>
            <Controller
              control={control}
              name="cameroonian"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label={t('profile.cameroonianFormat')}
                />
              )}
            />
          </div>

          {isCameroonian && (
            <div className="mt-5 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" defaultValue="Cameroonian" {...register('nationality')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="placeOfBirth">Place of Birth</Label>
                <Input id="placeOfBirth" placeholder="Yaoundé, Cameroon" {...register('placeOfBirth')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Controller
                  control={control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Professional Summary */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="summary" className="text-base font-semibold">Professional Summary</Label>
            <span className="text-xs text-muted-foreground">{charCount} / 500</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            This is your personal bio. The AI builder generates a tailored professional summary per document.
          </p>
          <Textarea
            id="summary"
            rows={5}
            maxLength={500}
            placeholder="Write a short professional bio…"
            {...register('summary')}
          />
        </div>
      </form>
    </div>
  )
}
