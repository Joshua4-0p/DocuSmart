import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProfileEntryList, EntryCard } from '@/components/shared/ProfileEntryList'
import { publicationSchema, type PublicationFormValues } from '@/lib/schemas/profile.schema'
import { profileApi } from '@/lib/api/profile.api'
import type { Publication } from '@/types/profile'

function PubForm({ defaultValues, onSubmit, onCancel }: { defaultValues?: Partial<Publication>; onSubmit: (d: unknown) => Promise<void>; onCancel: () => void }) {
  const { t } = useTranslation()
  const [authorInput, setAuthorInput] = React.useState('')
  const [authors, setAuthors] = React.useState<string[]>(defaultValues?.authors ?? [])
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    mode: 'onBlur',
    defaultValues: { title: defaultValues?.title ?? '', authors: defaultValues?.authors ?? [], publication: defaultValues?.publication ?? '', date: defaultValues?.date ?? '', url: defaultValues?.url ?? '', description: defaultValues?.description ?? '' },
  })
  const addAuthor = () => { const a = authorInput.trim(); if (a && !authors.includes(a)) setAuthors([...authors, a]); setAuthorInput('') }
  const onFormSubmit = (data: PublicationFormValues) => onSubmit({ ...data, authors })
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5"><Label>Title *</Label><Input placeholder="Research paper title" {...register('title')} /></div>
      <div className="flex flex-col gap-1.5">
        <Label>Authors</Label>
        <div className="flex gap-2"><Input placeholder="Author name" value={authorInput} onChange={(e) => setAuthorInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAuthor() } }} /><Button type="button" variant="outline" size="icon" onClick={addAuthor}><Plus className="size-4" /></Button></div>
        {authors.length > 0 && <div className="flex flex-wrap gap-1.5 mt-1">{authors.map((a) => <span key={a} className="flex items-center gap-1 bg-muted rounded-full px-2.5 py-1 text-xs">{a}<button type="button" onClick={() => setAuthors(authors.filter((x) => x !== a))}><X className="size-3" /></button></span>)}</div>}
      </div>
      <div className="flex flex-col gap-1.5"><Label>Journal / Publication *</Label><Input placeholder="IEEE Transactions on..." {...register('publication')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Date *</Label><Input type="month" {...register('date')} /></div>
      <div className="flex flex-col gap-1.5"><Label>URL / DOI</Label><Input placeholder="https://doi.org/..." {...register('url')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Description</Label><Textarea rows={2} {...register('description')} /></div>
      <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{t('common.cancel')}</Button><Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? t('common.saving') : t('common.save')}</Button></div>
    </form>
  )
}

export function PublicationsPage() {
  const qc = useQueryClient()
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['publications'], queryFn: profileApi.getPublications })
  const add = useMutation({ mutationFn: profileApi.createPublication, onSuccess: () => void qc.invalidateQueries({ queryKey: ['publications'] }) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Publication> }) => profileApi.updatePublication(id, data), onSuccess: () => void qc.invalidateQueries({ queryKey: ['publications'] }) })
  const remove = useMutation({ mutationFn: profileApi.deletePublication, onSuccess: () => void qc.invalidateQueries({ queryKey: ['publications'] }) })
  return (
    <ProfileEntryList<Publication>
      sectionKey="publications"
      entries={entries}
      isLoading={isLoading}
      onAdd={(d) => add.mutateAsync(d as Omit<Publication, 'id' | 'order'>)}
      onEdit={(id, d) => update.mutateAsync({ id, data: d as Partial<Publication> })}
      onDelete={(id) => remove.mutateAsync(id)}
      renderCard={(e, onEdit, onDelete) => <EntryCard key={e.id} title={e.title} subtitle={e.publication} dates={e.date} description={e.description} onEdit={onEdit} onDelete={onDelete} />}
      renderForm={(dv, onSubmit, onCancel) => <PubForm defaultValues={dv as Partial<Publication>} onSubmit={onSubmit} onCancel={onCancel} />}
    />
  )
}
