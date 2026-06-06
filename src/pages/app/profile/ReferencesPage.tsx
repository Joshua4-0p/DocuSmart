import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProfileEntryList, EntryCard } from '@/components/shared/ProfileEntryList'
import { referenceSchema, type ReferenceFormValues } from '@/lib/schemas/profile.schema'
import { profileApi } from '@/lib/api/profile.api'
import type { Reference, RefereeRelationship } from '@/types/profile'

const relLabels: Record<RefereeRelationship, string> = {
  'direct-manager': 'Direct Manager',
  professor: 'Professor / Supervisor',
  colleague: 'Colleague',
  client: 'Client',
  other: 'Other',
}

function RefForm({ defaultValues, onSubmit, onCancel }: { defaultValues?: Partial<Reference>; onSubmit: (d: unknown) => Promise<void>; onCancel: () => void }) {
  const { t } = useTranslation()
  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<ReferenceFormValues>({
    resolver: zodResolver(referenceSchema),
    mode: 'onBlur',
    defaultValues: { name: defaultValues?.name ?? '', jobTitle: defaultValues?.jobTitle ?? '', company: defaultValues?.company ?? '', email: defaultValues?.email ?? '', phone: defaultValues?.phone ?? '', relationship: defaultValues?.relationship ?? 'colleague' },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5"><Label>Full Name *</Label><Input placeholder="Dr. Paul Biya" {...register('name')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Job Title *</Label><Input placeholder="Head of Department" {...register('jobTitle')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Institution / Company *</Label><Input placeholder="University of Buea" {...register('company')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Email *</Label><Input type="email" placeholder="contact@example.cm" {...register('email')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Phone</Label><Input type="tel" placeholder="+237 6XX XXX XXX" {...register('phone')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Relationship to You</Label>
        <Controller control={control} name="relationship" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(Object.entries(relLabels) as [RefereeRelationship, string][]).map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}</SelectContent></Select>
        )} />
      </div>
      <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{t('common.cancel')}</Button><Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? t('common.saving') : t('common.save')}</Button></div>
    </form>
  )
}

export function ReferencesPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['references'], queryFn: profileApi.getReferences })
  const add = useMutation({ mutationFn: profileApi.createReference, onSuccess: () => void qc.invalidateQueries({ queryKey: ['references'] }) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Reference> }) => profileApi.updateReference(id, data), onSuccess: () => void qc.invalidateQueries({ queryKey: ['references'] }) })
  const remove = useMutation({ mutationFn: profileApi.deleteReference, onSuccess: () => void qc.invalidateQueries({ queryKey: ['references'] }) })
  return (
    <div>
      <div className="flex items-start gap-2 bg-muted rounded-xl px-4 py-3 mb-5 text-sm text-muted-foreground">
        <Info className="size-4 shrink-0 mt-0.5" />
        <span>{t('profile.referencesPrivacyNote')}</span>
      </div>
      <ProfileEntryList<Reference>
        sectionKey="references"
        entries={entries}
        isLoading={isLoading}
        onAdd={(d) => add.mutateAsync(d as Omit<Reference, 'id' | 'order'>)}
        onEdit={(id, d) => update.mutateAsync({ id, data: d as Partial<Reference> })}
        onDelete={(id) => remove.mutateAsync(id)}
        renderCard={(e, onEdit, onDelete) => <EntryCard key={e.id} title={e.name} subtitle={`${e.jobTitle} · ${e.company}`} dates={relLabels[e.relationship]} onEdit={onEdit} onDelete={onDelete} />}
        renderForm={(dv, onSubmit, onCancel) => <RefForm defaultValues={dv as Partial<Reference>} onSubmit={onSubmit} onCancel={onCancel} />}
      />
    </div>
  )
}
