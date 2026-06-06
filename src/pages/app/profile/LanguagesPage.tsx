import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProfileEntryList, EntryCard } from '@/components/shared/ProfileEntryList'
import { languageSchema, type LanguageFormValues } from '@/lib/schemas/profile.schema'
import { profileApi } from '@/lib/api/profile.api'
import type { Language, LanguageLevel } from '@/types/profile'

const levelLabels: Record<LanguageLevel, string> = {
  native: 'Native',
  fluent: 'Fluent',
  professional: 'Professional Working',
  conversational: 'Conversational',
  basic: 'Basic',
}

function LangForm({ defaultValues, onSubmit, onCancel }: { defaultValues?: Partial<Language>; onSubmit: (d: unknown) => Promise<void>; onCancel: () => void }) {
  const { t } = useTranslation()
  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    mode: 'onBlur',
    defaultValues: { language: defaultValues?.language ?? '', level: defaultValues?.level ?? 'fluent' },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5"><Label>Language *</Label><Input placeholder="French" {...register('language')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Proficiency Level</Label>
        <Controller control={control} name="level" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(Object.entries(levelLabels) as [LanguageLevel, string][]).map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}</SelectContent></Select>
        )} />
      </div>
      <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{t('common.cancel')}</Button><Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? t('common.saving') : t('common.save')}</Button></div>
    </form>
  )
}

export function LanguagesPage() {
  const qc = useQueryClient()
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['languages'], queryFn: profileApi.getLanguages })
  const add = useMutation({ mutationFn: profileApi.createLanguage, onSuccess: () => void qc.invalidateQueries({ queryKey: ['languages'] }) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Language> }) => profileApi.updateLanguage(id, data), onSuccess: () => void qc.invalidateQueries({ queryKey: ['languages'] }) })
  const remove = useMutation({ mutationFn: profileApi.deleteLanguage, onSuccess: () => void qc.invalidateQueries({ queryKey: ['languages'] }) })
  return (
    <ProfileEntryList<Language>
      sectionKey="languages"
      entries={entries}
      isLoading={isLoading}
      onAdd={(d) => add.mutateAsync(d as Omit<Language, 'id' | 'order'>)}
      onEdit={(id, d) => update.mutateAsync({ id, data: d as Partial<Language> })}
      onDelete={(id) => remove.mutateAsync(id)}
      renderCard={(e, onEdit, onDelete) => <EntryCard key={e.id} title={e.language} subtitle={levelLabels[e.level]} onEdit={onEdit} onDelete={onDelete} />}
      renderForm={(dv, onSubmit, onCancel) => <LangForm defaultValues={dv as Partial<Language>} onSubmit={onSubmit} onCancel={onCancel} />}
    />
  )
}
