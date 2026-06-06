import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ProfileEntryList, EntryCard } from '@/components/shared/ProfileEntryList'
import { certificationSchema, type CertificationFormValues } from '@/lib/schemas/profile.schema'
import { profileApi } from '@/lib/api/profile.api'
import type { Certification } from '@/types/profile'

function CertForm({ defaultValues, onSubmit, onCancel }: { defaultValues?: Partial<Certification>; onSubmit: (d: unknown) => Promise<void>; onCancel: () => void }) {
  const { t } = useTranslation()
  const { register, control, watch, handleSubmit, formState: { isSubmitting } } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    mode: 'onBlur',
    defaultValues: { name: defaultValues?.name ?? '', issuingOrg: defaultValues?.issuingOrg ?? '', dateIssued: defaultValues?.dateIssued ?? '', expiryDate: defaultValues?.expiryDate ?? '', noExpiry: defaultValues?.noExpiry ?? false, credentialUrl: defaultValues?.credentialUrl ?? '' },
  })
  const noExpiry = watch('noExpiry')
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5"><Label>Certification Name *</Label><Input placeholder="AWS Solutions Architect" {...register('name')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Issuing Organisation *</Label><Input placeholder="Amazon Web Services" {...register('issuingOrg')} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5"><Label>Date Issued *</Label><Input type="month" {...register('dateIssued')} /></div>
        <div className="flex flex-col gap-1.5"><Label>Expiry Date</Label><Input type="month" disabled={noExpiry} {...register('expiryDate')} /></div>
      </div>
      <div className="flex items-center gap-2"><Controller control={control} name="noExpiry" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /><Label className="font-normal">No expiry date</Label></div>
      <div className="flex flex-col gap-1.5"><Label>Credential URL</Label><Input placeholder="https://credential.example.com/verify/..." {...register('credentialUrl')} /></div>
      <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{t('common.cancel')}</Button><Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? t('common.saving') : t('common.save')}</Button></div>
    </form>
  )
}

export function CertificationsPage() {
  const qc = useQueryClient()
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['certifications'], queryFn: profileApi.getCertifications })
  const add = useMutation({ mutationFn: profileApi.createCertification, onSuccess: () => void qc.invalidateQueries({ queryKey: ['certifications'] }) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Certification> }) => profileApi.updateCertification(id, data), onSuccess: () => void qc.invalidateQueries({ queryKey: ['certifications'] }) })
  const remove = useMutation({ mutationFn: profileApi.deleteCertification, onSuccess: () => void qc.invalidateQueries({ queryKey: ['certifications'] }) })
  return (
    <ProfileEntryList<Certification>
      sectionKey="certifications"
      entries={entries}
      isLoading={isLoading}
      onAdd={(d) => add.mutateAsync(d as Omit<Certification, 'id' | 'order'>)}
      onEdit={(id, d) => update.mutateAsync({ id, data: d as Partial<Certification> })}
      onDelete={(id) => remove.mutateAsync(id)}
      renderCard={(e, onEdit, onDelete) => <EntryCard key={e.id} title={e.name} subtitle={e.issuingOrg} dates={`Issued ${e.dateIssued}${e.noExpiry ? ' · No expiry' : e.expiryDate ? ` · Expires ${e.expiryDate}` : ''}`} onEdit={onEdit} onDelete={onDelete} />}
      renderForm={(dv, onSubmit, onCancel) => <CertForm defaultValues={dv as Partial<Certification>} onSubmit={onSubmit} onCancel={onCancel} />}
    />
  )
}
