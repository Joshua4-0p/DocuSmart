import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProfileEntryList, EntryCard } from '@/components/shared/ProfileEntryList'
import { projectSchema, type ProjectFormValues } from '@/lib/schemas/profile.schema'
import { profileApi } from '@/lib/api/profile.api'
import type { Project } from '@/types/profile'

function ProjectForm({ defaultValues, onSubmit, onCancel }: { defaultValues?: Partial<Project>; onSubmit: (d: unknown) => Promise<void>; onCancel: () => void }) {
  const { t } = useTranslation()
  const [techInput, setTechInput] = React.useState('')
  const [techs, setTechs] = React.useState<string[]>(defaultValues?.technologies ?? [])
  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: 'onBlur',
    defaultValues: { name: defaultValues?.name ?? '', description: defaultValues?.description ?? '', role: defaultValues?.role ?? '', technologies: defaultValues?.technologies ?? [], projectUrl: defaultValues?.projectUrl ?? '', startDate: defaultValues?.startDate ?? '', endDate: defaultValues?.endDate ?? '', status: defaultValues?.status ?? 'completed' },
  })
  const addTech = () => { const t2 = techInput.trim(); if (t2 && !techs.includes(t2)) setTechs([...techs, t2]); setTechInput('') }
  const onFormSubmit = (data: ProjectFormValues) => onSubmit({ ...data, technologies: techs })
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5"><Label>Project Name *</Label><Input placeholder="E-commerce Platform" {...register('name')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Your Role</Label><Input placeholder="Lead Developer" {...register('role')} /></div>
      <div className="flex flex-col gap-1.5"><Label>Description</Label><Textarea rows={3} maxLength={300} placeholder="Describe the project and your contribution…" {...register('description')} /></div>
      <div className="flex flex-col gap-1.5">
        <Label>Technologies</Label>
        <div className="flex gap-2"><Input placeholder="React, Node.js…" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }} /><Button type="button" variant="outline" size="icon" onClick={addTech}><Plus className="size-4" /></Button></div>
        {techs.length > 0 && <div className="flex flex-wrap gap-1.5 mt-1">{techs.map((t2) => <span key={t2} className="flex items-center gap-1 bg-muted rounded-full px-2.5 py-1 text-xs">{t2}<button type="button" onClick={() => setTechs(techs.filter((x) => x !== t2))}><X className="size-3" /></button></span>)}</div>}
      </div>
      <div className="flex flex-col gap-1.5"><Label>Status</Label><Controller control={control} name="status" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="completed">Completed</SelectItem><SelectItem value="ongoing">Ongoing</SelectItem></SelectContent></Select>} /></div>
      <div className="flex flex-col gap-1.5"><Label>Project URL</Label><Input placeholder="https://github.com/..." {...register('projectUrl')} /></div>
      <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{t('common.cancel')}</Button><Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? t('common.saving') : t('common.save')}</Button></div>
    </form>
  )
}

export function ProjectsPage() {
  const qc = useQueryClient()
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: profileApi.getProjects })
  const add = useMutation({ mutationFn: profileApi.createProject, onSuccess: () => void qc.invalidateQueries({ queryKey: ['projects'] }) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => profileApi.updateProject(id, data), onSuccess: () => void qc.invalidateQueries({ queryKey: ['projects'] }) })
  const remove = useMutation({ mutationFn: profileApi.deleteProject, onSuccess: () => void qc.invalidateQueries({ queryKey: ['projects'] }) })
  return (
    <ProfileEntryList<Project>
      sectionKey="projects"
      entries={entries}
      isLoading={isLoading}
      onAdd={(d) => add.mutateAsync(d as Omit<Project, 'id' | 'order'>)}
      onEdit={(id, d) => update.mutateAsync({ id, data: d as Partial<Project> })}
      onDelete={(id) => remove.mutateAsync(id)}
      renderCard={(e, onEdit, onDelete) => <EntryCard key={e.id} title={e.name} subtitle={e.role ?? undefined} description={e.description} onEdit={onEdit} onDelete={onDelete} />}
      renderForm={(dv, onSubmit, onCancel) => <ProjectForm defaultValues={dv as Partial<Project>} onSubmit={onSubmit} onCancel={onCancel} />}
    />
  )
}
