import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ProfileEntryList, EntryCard } from '@/components/shared/ProfileEntryList'
import { volunteerSchema, type VolunteerFormValues } from '@/lib/schemas/profile.schema'
import { profileApi } from '@/lib/api/profile.api'
import type { Volunteer } from '@/types/profile'

function VolunteerForm({ defaultValues, onSubmit, onCancel }: { defaultValues?: Partial<Volunteer>; onSubmit: (d: unknown) => Promise<void>; onCancel: () => void }) {
  const { t } = useTranslation()
  const { register, control, watch, handleSubmit, formState: { isSubmitting } } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    mode: 'onBlur',
    defaultValues: { organisation: defaultValues?.organisation ?? '', role: defaultValues?.role ?? '', startDate: defaultValues?.startDate ?? '', endDate: defaultValues?.endDate ?? '', ongoing: defaultValues?.ongoing ?? false, description: defaultValues?.description ?? '' },
  })
  const ongoing = watch('ongoing')
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5"><Label>Organisation *</Label><Input placeholder="Red Cross Cameroon" {...register('organisation')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Role *</Label><Input placeholder="Community Health Volunteer" {...register('role')} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5"><Label>Start Date *</Label><Input type="month" {...register('startDate')} /></div>
        <div className="flex flex-col gap-1.5"><Label>End Date</Label><Input type="month" disabled={ongoing} {...register('endDate')} /></div>
      </div>
      <div className="flex items-center gap-2"><Controller control={control} name="ongoing" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /><Label className="font-normal">Still volunteering</Label></div>
      <div className="flex flex-col gap-1.5"><Label>Description</Label><Textarea rows={3} {...register('description')} /></div>
      <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{t('common.cancel')}</Button><Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? t('common.saving') : t('common.save')}</Button></div>
    </form>
  )
}

export function VolunteerPage() {
  const qc = useQueryClient()
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['volunteer'], queryFn: profileApi.getVolunteer })
  const add = useMutation({ mutationFn: profileApi.createVolunteer, onSuccess: () => void qc.invalidateQueries({ queryKey: ['volunteer'] }) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Volunteer> }) => profileApi.updateVolunteer(id, data), onSuccess: () => void qc.invalidateQueries({ queryKey: ['volunteer'] }) })
  const remove = useMutation({ mutationFn: profileApi.deleteVolunteer, onSuccess: () => void qc.invalidateQueries({ queryKey: ['volunteer'] }) })
  return (
    <ProfileEntryList<Volunteer>
      sectionKey="volunteer"
      entries={entries}
      isLoading={isLoading}
      onAdd={(d) => add.mutateAsync(d as Omit<Volunteer, 'id' | 'order'>)}
      onEdit={(id, d) => update.mutateAsync({ id, data: d as Partial<Volunteer> })}
      onDelete={(id) => remove.mutateAsync(id)}
      renderCard={(e, onEdit, onDelete) => <EntryCard key={e.id} title={e.role} subtitle={e.organisation} dates={`${e.startDate} – ${e.ongoing ? 'Present' : (e.endDate ?? '')}`} description={e.description} onEdit={onEdit} onDelete={onDelete} />}
      renderForm={(dv, onSubmit, onCancel) => <VolunteerForm defaultValues={dv as Partial<Volunteer>} onSubmit={onSubmit} onCancel={onCancel} />}
    />
  )
}
