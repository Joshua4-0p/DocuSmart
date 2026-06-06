import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { profileApi } from '@/lib/api/profile.api'
import type { Skill, ProficiencyLevel } from '@/types/profile'

const levels: ProficiencyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert']
const levelColors: Record<ProficiencyLevel, string> = {
  beginner: 'bg-muted text-muted-foreground',
  intermediate: 'bg-primary/10 text-primary',
  advanced: 'bg-ds-success text-ds-success-foreground',
  expert: 'bg-ds-premium text-ds-premium-foreground',
}

function SkillChip({
  skill,
  onDelete,
  onLevelChange,
}: {
  skill: Skill
  onDelete: () => void
  onLevelChange: (level: ProficiencyLevel) => void
}) {
  return (
    <div className="flex items-center gap-1.5 bg-card border border-border rounded-full pl-3 pr-1 py-1 group">
      <span className="text-sm font-medium">{skill.name}</span>
      <Select value={skill.level} onValueChange={(v) => onLevelChange(v as ProficiencyLevel)}>
        <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-xs gap-1 focus:ring-0 w-auto min-w-0">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${levelColors[skill.level]}`}>
            {skill.level}
          </span>
        </SelectTrigger>
        <SelectContent>
          {levels.map((l) => (
            <SelectItem key={l} value={l} className="text-xs">{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button
        onClick={onDelete}
        className="size-5 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="size-3" />
      </button>
    </div>
  )
}

export function SkillsPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [input, setInput] = React.useState('')

  const { data: skills = [], isLoading } = useQuery({ queryKey: ['skills'], queryFn: profileApi.getSkills })
  const add = useMutation({ mutationFn: profileApi.createSkill, onSuccess: () => void qc.invalidateQueries({ queryKey: ['skills'] }) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Skill> }) => profileApi.updateSkill(id, data), onSuccess: () => void qc.invalidateQueries({ queryKey: ['skills'] }) })
  const remove = useMutation({ mutationFn: profileApi.deleteSkill, onSuccess: () => void qc.invalidateQueries({ queryKey: ['skills'] }) })

  const handleAdd = () => {
    const name = input.trim()
    if (!name) return
    add.mutate({ name, level: 'intermediate', category: undefined })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
  }

  return (
    <div>
      <PageHeader
        title={t('profile.skills')}
        breadcrumb={{ label: t('profile.title'), to: '/profile' }}
      />

      <div className="bg-card border border-border rounded-2xl p-6">
        {/* Add skill input */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Type a skill and press Enter…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleAdd} disabled={!input.trim() || add.isPending}>
            <Plus className="size-4 mr-1.5" />
            {t('common.add')}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-muted animate-pulse" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No skills added yet. Type a skill above to get started.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <SkillChip
                key={skill.id}
                skill={skill}
                onDelete={() => remove.mutate(skill.id)}
                onLevelChange={(level) => update.mutate({ id: skill.id, data: { level } })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
