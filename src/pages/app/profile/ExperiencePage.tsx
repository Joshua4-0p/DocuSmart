import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProfileEntryList, EntryCard } from '@/components/shared/ProfileEntryList'
import { experienceSchema, type ExperienceFormValues } from '@/lib/schemas/profile.schema'
import { profileApi } from '@/lib/api/profile.api'
import type { Experience } from '@/types/profile'

function ExperienceForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<Experience>
  onSubmit: (d: unknown) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useTranslation()
  const { register, control, watch, handleSubmit, formState: { isSubmitting } } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    mode: 'onBlur',
    defaultValues: {
      jobTitle: defaultValues?.jobTitle ?? '',
      company: defaultValues?.company ?? '',
      employmentType: defaultValues?.employmentType ?? 'full-time',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      ongoing: defaultValues?.ongoing ?? false,
      location: defaultValues?.location ?? '',
      remote: defaultValues?.remote ?? false,
      description: defaultValues?.description ?? '',
      achievements: defaultValues?.achievements ?? [],
    },
  })
  const ongoing = watch('ongoing')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Job Title *</Label>
        <Input placeholder="Software Engineer" {...register('jobTitle')} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Company *</Label>
        <Input placeholder="MTN Cameroon" {...register('company')} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Employment Type</Label>
        <Controller control={control} name="employmentType" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(['full-time', 'part-time', 'internship', 'contract', 'freelance', 'volunteer'] as const).map((et) => (
                <SelectItem key={et} value={et}>{et.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )} />
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
        <Controller control={control} name="ongoing" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
        <Label className="font-normal">Currently working here</Label>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Location</Label>
        <Input placeholder="Douala, Cameroon" {...register('location')} />
      </div>
      <div className="flex items-center gap-2">
        <Controller control={control} name="remote" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
        <Label className="font-normal">Remote</Label>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Description / Key Responsibilities</Label>
        <Textarea rows={4} placeholder="Describe your responsibilities and impact…" {...register('description')} />
        <p className="text-xs text-muted-foreground">AI will rewrite these as impact-first bullet points in the Document Builder.</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? t('common.saving') : t('common.save')}</Button>
      </div>
    </form>
  )
}

export function ExperiencePage() {
  const qc = useQueryClient()
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['experience'], queryFn: profileApi.getExperience })
  const add = useMutation({ mutationFn: profileApi.createExperience, onSuccess: () => void qc.invalidateQueries({ queryKey: ['experience'] }) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Experience> }) => profileApi.updateExperience(id, data), onSuccess: () => void qc.invalidateQueries({ queryKey: ['experience'] }) })
  const remove = useMutation({ mutationFn: profileApi.deleteExperience, onSuccess: () => void qc.invalidateQueries({ queryKey: ['experience'] }) })

  return (
    <ProfileEntryList<Experience>
      sectionKey="experience"
      entries={entries}
      isLoading={isLoading}
      onAdd={(d) => add.mutateAsync(d as Omit<Experience, 'id' | 'order'>)}
      onEdit={(id, d) => update.mutateAsync({ id, data: d as Partial<Experience> })}
      onDelete={(id) => remove.mutateAsync(id)}
      renderCard={(e, onEdit, onDelete) => (
        <EntryCard
          key={e.id}
          title={e.jobTitle}
          subtitle={`${e.company} · ${e.employmentType}`}
          dates={`${e.startDate} – ${e.ongoing ? 'Present' : (e.endDate ?? '')}`}
          description={e.description}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      renderForm={(dv, onSubmit, onCancel) => (
        <ExperienceForm defaultValues={dv as Partial<Experience>} onSubmit={onSubmit} onCancel={onCancel} />
      )}
    />
  )
}
