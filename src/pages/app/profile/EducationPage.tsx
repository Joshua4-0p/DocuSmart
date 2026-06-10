import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select'
import { ProfileEntryList, EntryCard } from '@/components/shared/ProfileEntryList'
import { UniversityAutocomplete } from '@/components/profile/UniversityAutocomplete'
import { educationSchema, type EducationFormValues } from '@/lib/schemas/profile.schema'
import { profileApi } from '@/lib/api/profile.api'
import { getDegreeLabel } from '@/lib/templates/templateSettings'
import type { Education } from '@/types/profile'

const ENGLISH_DEGREES: Array<[string, string]> = [
  ['fslc',    'FSLC — First School Leaving Certificate'],
  ['gce-ol',  'GCE O Level — Ordinary Level'],
  ['gce-al',  'GCE A Level — Advanced Level'],
  ['tvee',    'TVEE — Technical & Vocational Education'],
  ['hnd',     'HND — Higher National Diploma'],
  ['bsc',     'B.Sc — Bachelor of Science'],
  ['beng',    'B.Eng — Bachelor of Engineering'],
  ['btech',   'B.Tech — Bachelor of Technology'],
  ['msc',     'M.Sc — Master of Science'],
  ['meng',    'M.Eng — Master of Engineering'],
  ['phd',     'PhD — Doctor of Philosophy'],
]

const FRENCH_DEGREES: Array<[string, string]> = [
  ['cep',          'CEP — Certificat d\'Études Primaires'],
  ['bepc',         'BEPC — Brevet d\'Études du Premier Cycle'],
  ['probatoire',   'Probatoire'],
  ['bac',          'Baccalauréat (BAC)'],
  ['bts',          'BTS — Brevet de Technicien Supérieur'],
  ['licence',      'Licence'],
  ['licence-pro',  'Licence Professionnelle'],
  ['master',       'Master'],
  ['master-pro',   'Master Professionnel'],
  ['phd',          'Doctorat (PhD)'],
]

function EducationForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<Education>
  onSubmit: (d: unknown) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useTranslation()
  const { register, control, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    mode: 'onBlur',
    defaultValues: {
      institution: defaultValues?.institution ?? '',
      degreeType: defaultValues?.degreeType ?? 'bsc',
      customDegreeType: defaultValues?.customDegreeType ?? '',
      fieldOfStudy: defaultValues?.fieldOfStudy ?? '',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      ongoing: defaultValues?.ongoing ?? false,
      country: defaultValues?.country ?? 'Cameroon',
      gpa: defaultValues?.gpa ?? '',
      showGpa: defaultValues?.showGpa ?? true,
      alwaysShowGpa: defaultValues?.alwaysShowGpa ?? false,
      description: defaultValues?.description ?? '',
      honors: defaultValues?.honors ?? [],
    },
  })
  const ongoing = watch('ongoing')
  const degreeType = watch('degreeType')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="institution">{t('builder.institutionLabel')} *</Label>
        <Controller
          control={control}
          name="institution"
          render={({ field }) => (
            <UniversityAutocomplete
              id="institution"
              value={field.value}
              onChange={field.onChange}
              placeholder="University of Yaoundé I"
            />
          )}
        />
        {errors.institution && <p className="text-xs text-destructive">{t('common.required')}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Degree Type *</Label>
        <Controller control={control} name="degreeType" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">English System</div>
              {ENGLISH_DEGREES.map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
              <SelectSeparator />
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Système Francophone</div>
              {FRENCH_DEGREES.map(([val, label]) => (
                <SelectItem key={`fr-${val}`} value={val}>{label}</SelectItem>
              ))}
              <SelectSeparator />
              <SelectItem value="certificate">Certificate (General)</SelectItem>
              <SelectItem value="other">Other (specify below)</SelectItem>
            </SelectContent>
          </Select>
        )} />
      </div>
      {degreeType === 'other' && (
        <div className="flex flex-col gap-1.5">
          <Label>Degree Name *</Label>
          <Input placeholder="e.g. Professional Certificate, Diplôme d'État…" {...register('customDegreeType')} />
          <p className="text-xs text-muted-foreground">This name will appear on your CV exactly as you type it.</p>
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Label>Field of Study *</Label>
        <Input placeholder="Computer Science" aria-invalid={!!errors.fieldOfStudy} {...register('fieldOfStudy')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Start Date *</Label>
          <Input type="month" {...register('startDate')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>End Date</Label>
          <Input type="month" disabled={ongoing} {...register('endDate')} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Controller control={control} name="ongoing" render={({ field }) => (
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        )} />
        <Label className="font-normal">{t('common.ongoing')}</Label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>City</Label>
          <Input placeholder="Yaoundé" {...register('city')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Country</Label>
          <Input defaultValue="Cameroon" {...register('country')} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>GPA / Grade</Label>
        <Input placeholder="e.g. 16/20 · 3.8/4.0 · 22 points (GCE)" {...register('gpa')} />
        <div className="flex items-center gap-2 mt-1">
          <Controller control={control} name="showGpa" render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )} />
          <Label className="font-normal text-sm">Show grade in documents</Label>
        </div>
        <div className="flex items-center gap-2">
          <Controller control={control} name="alwaysShowGpa" render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )} />
          <Label className="font-normal text-sm">Always show regardless of grade</Label>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Description / Achievements</Label>
        <Textarea rows={3} maxLength={300} {...register('description')} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? t('common.saving') : t('common.save')}</Button>
      </div>
    </form>
  )
}

export function EducationPage() {
  const qc = useQueryClient()
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['education'],
    queryFn: profileApi.getEducation,
  })

  const add = useMutation({ mutationFn: profileApi.createEducation, onSuccess: () => void qc.invalidateQueries({ queryKey: ['education'] }) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Education> }) => profileApi.updateEducation(id, data), onSuccess: () => void qc.invalidateQueries({ queryKey: ['education'] }) })
  const remove = useMutation({ mutationFn: profileApi.deleteEducation, onSuccess: () => void qc.invalidateQueries({ queryKey: ['education'] }) })

  return (
    <ProfileEntryList<Education>
      sectionKey="education"
      entries={entries}
      isLoading={isLoading}
      onAdd={(d) => add.mutateAsync(d as Omit<Education, 'id' | 'order'>)}
      onEdit={(id, d) => update.mutateAsync({ id, data: d as Partial<Education> })}
      onDelete={(id) => remove.mutateAsync(id)}
      renderCard={(e, onEdit, onDelete) => (
        <EntryCard
          key={e.id}
          title={`${getDegreeLabel(e)} in ${e.fieldOfStudy}`}
          subtitle={e.institution}
          dates={`${e.startDate} – ${e.ongoing ? 'Present' : (e.endDate ?? '')}`}
          description={e.description}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      renderForm={(dv, onSubmit, onCancel) => (
        <EducationForm defaultValues={dv as Partial<Education>} onSubmit={onSubmit} onCancel={onCancel} />
      )}
    />
  )
}
