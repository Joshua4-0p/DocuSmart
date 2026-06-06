import type {
  MasterProfile,
  PersonalDetails,
  Education,
  Experience,
  Skill,
  Certification,
  Project,
  Volunteer,
  Publication,
  Language,
  Reference,
} from '../../types/profile'

// ── helpers ──────────────────────────────────────────────────────────────────

function getUserId(): string {
  try {
    const stored = localStorage.getItem('ds-auth')
    if (!stored) return 'anon'
    const parsed = JSON.parse(stored) as { state?: { user?: { id?: string } } }
    return parsed?.state?.user?.id ?? 'anon'
  } catch { return 'anon' }
}

const PROFILE_KEY = (uid: string) => `ds-profile-${uid}`

interface StoredProfile {
  personal: PersonalDetails | null
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  certifications: Certification[]
  projects: Project[]
  volunteer: Volunteer[]
  publications: Publication[]
  languages: Language[]
  references: Reference[]
}

function loadStored(): StoredProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY(getUserId()))
    if (raw) return JSON.parse(raw) as StoredProfile
  } catch { /* ignore */ }
  return {
    personal: null,
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    projects: [],
    volunteer: [],
    publications: [],
    languages: [],
    references: [],
  }
}

function saveStored(data: StoredProfile): void {
  localStorage.setItem(PROFILE_KEY(getUserId()), JSON.stringify(data))
}

function calcCompleteness(p: StoredProfile): number {
  let score = 0
  if (p.personal) score += 20
  if (p.education.length) score += 10
  if (p.experience.length) score += 15
  if (p.skills.length) score += 10
  if (p.certifications.length) score += 5
  if (p.projects.length) score += 10
  if (p.volunteer.length) score += 5
  if (p.publications.length) score += 5
  if (p.languages.length) score += 10
  if (p.references.length) score += 10
  return score
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function delay<T>(value: T, ms = 80): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms))
}

// ── API ───────────────────────────────────────────────────────────────────────

export const profileApi = {
  getProfile: (): Promise<MasterProfile> => {
    const p = loadStored()
    return delay({ ...p, completeness: calcCompleteness(p) })
  },

  updatePersonal: (data: PersonalDetails): Promise<PersonalDetails> => {
    const p = loadStored()
    p.personal = data
    saveStored(p)
    return delay(data)
  },

  // ── Education ──
  getEducation: (): Promise<Education[]> => delay(loadStored().education),

  createEducation: (data: Omit<Education, 'id' | 'order'>): Promise<Education> => {
    const p = loadStored()
    const entry: Education = { ...data, id: makeId(), order: p.education.length }
    p.education.push(entry)
    saveStored(p)
    return delay(entry)
  },

  updateEducation: (id: string, data: Partial<Education>): Promise<Education> => {
    const p = loadStored()
    const idx = p.education.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Not found')
    p.education[idx] = { ...p.education[idx], ...data }
    saveStored(p)
    return delay(p.education[idx])
  },

  deleteEducation: (id: string): Promise<void> => {
    const p = loadStored()
    p.education = p.education.filter((e) => e.id !== id)
    saveStored(p)
    return delay(undefined)
  },

  reorderEducation: (ids: string[]): Promise<void> => {
    const p = loadStored()
    p.education = ids
      .map((id, order) => {
        const e = p.education.find((x) => x.id === id)
        return e ? { ...e, order } : null
      })
      .filter(Boolean) as Education[]
    saveStored(p)
    return delay(undefined)
  },

  // ── Experience ──
  getExperience: (): Promise<Experience[]> => delay(loadStored().experience),

  createExperience: (data: Omit<Experience, 'id' | 'order'>): Promise<Experience> => {
    const p = loadStored()
    const entry: Experience = { ...data, id: makeId(), order: p.experience.length }
    p.experience.push(entry)
    saveStored(p)
    return delay(entry)
  },

  updateExperience: (id: string, data: Partial<Experience>): Promise<Experience> => {
    const p = loadStored()
    const idx = p.experience.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Not found')
    p.experience[idx] = { ...p.experience[idx], ...data }
    saveStored(p)
    return delay(p.experience[idx])
  },

  deleteExperience: (id: string): Promise<void> => {
    const p = loadStored()
    p.experience = p.experience.filter((e) => e.id !== id)
    saveStored(p)
    return delay(undefined)
  },

  // ── Skills ──
  getSkills: (): Promise<Skill[]> => delay(loadStored().skills),

  createSkill: (data: Omit<Skill, 'id' | 'order'>): Promise<Skill> => {
    const p = loadStored()
    const entry: Skill = { ...data, id: makeId(), order: p.skills.length }
    p.skills.push(entry)
    saveStored(p)
    return delay(entry)
  },

  updateSkill: (id: string, data: Partial<Skill>): Promise<Skill> => {
    const p = loadStored()
    const idx = p.skills.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Not found')
    p.skills[idx] = { ...p.skills[idx], ...data }
    saveStored(p)
    return delay(p.skills[idx])
  },

  deleteSkill: (id: string): Promise<void> => {
    const p = loadStored()
    p.skills = p.skills.filter((e) => e.id !== id)
    saveStored(p)
    return delay(undefined)
  },

  // ── Certifications ──
  getCertifications: (): Promise<Certification[]> => delay(loadStored().certifications),

  createCertification: (data: Omit<Certification, 'id' | 'order'>): Promise<Certification> => {
    const p = loadStored()
    const entry: Certification = { ...data, id: makeId(), order: p.certifications.length }
    p.certifications.push(entry)
    saveStored(p)
    return delay(entry)
  },

  updateCertification: (id: string, data: Partial<Certification>): Promise<Certification> => {
    const p = loadStored()
    const idx = p.certifications.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Not found')
    p.certifications[idx] = { ...p.certifications[idx], ...data }
    saveStored(p)
    return delay(p.certifications[idx])
  },

  deleteCertification: (id: string): Promise<void> => {
    const p = loadStored()
    p.certifications = p.certifications.filter((e) => e.id !== id)
    saveStored(p)
    return delay(undefined)
  },

  // ── Projects ──
  getProjects: (): Promise<Project[]> => delay(loadStored().projects),

  createProject: (data: Omit<Project, 'id' | 'order'>): Promise<Project> => {
    const p = loadStored()
    const entry: Project = { ...data, id: makeId(), order: p.projects.length }
    p.projects.push(entry)
    saveStored(p)
    return delay(entry)
  },

  updateProject: (id: string, data: Partial<Project>): Promise<Project> => {
    const p = loadStored()
    const idx = p.projects.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Not found')
    p.projects[idx] = { ...p.projects[idx], ...data }
    saveStored(p)
    return delay(p.projects[idx])
  },

  deleteProject: (id: string): Promise<void> => {
    const p = loadStored()
    p.projects = p.projects.filter((e) => e.id !== id)
    saveStored(p)
    return delay(undefined)
  },

  // ── Volunteer ──
  getVolunteer: (): Promise<Volunteer[]> => delay(loadStored().volunteer),

  createVolunteer: (data: Omit<Volunteer, 'id' | 'order'>): Promise<Volunteer> => {
    const p = loadStored()
    const entry: Volunteer = { ...data, id: makeId(), order: p.volunteer.length }
    p.volunteer.push(entry)
    saveStored(p)
    return delay(entry)
  },

  updateVolunteer: (id: string, data: Partial<Volunteer>): Promise<Volunteer> => {
    const p = loadStored()
    const idx = p.volunteer.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Not found')
    p.volunteer[idx] = { ...p.volunteer[idx], ...data }
    saveStored(p)
    return delay(p.volunteer[idx])
  },

  deleteVolunteer: (id: string): Promise<void> => {
    const p = loadStored()
    p.volunteer = p.volunteer.filter((e) => e.id !== id)
    saveStored(p)
    return delay(undefined)
  },

  // ── Publications ──
  getPublications: (): Promise<Publication[]> => delay(loadStored().publications),

  createPublication: (data: Omit<Publication, 'id' | 'order'>): Promise<Publication> => {
    const p = loadStored()
    const entry: Publication = { ...data, id: makeId(), order: p.publications.length }
    p.publications.push(entry)
    saveStored(p)
    return delay(entry)
  },

  updatePublication: (id: string, data: Partial<Publication>): Promise<Publication> => {
    const p = loadStored()
    const idx = p.publications.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Not found')
    p.publications[idx] = { ...p.publications[idx], ...data }
    saveStored(p)
    return delay(p.publications[idx])
  },

  deletePublication: (id: string): Promise<void> => {
    const p = loadStored()
    p.publications = p.publications.filter((e) => e.id !== id)
    saveStored(p)
    return delay(undefined)
  },

  // ── Languages ──
  getLanguages: (): Promise<Language[]> => delay(loadStored().languages),

  createLanguage: (data: Omit<Language, 'id' | 'order'>): Promise<Language> => {
    const p = loadStored()
    const entry: Language = { ...data, id: makeId(), order: p.languages.length }
    p.languages.push(entry)
    saveStored(p)
    return delay(entry)
  },

  updateLanguage: (id: string, data: Partial<Language>): Promise<Language> => {
    const p = loadStored()
    const idx = p.languages.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Not found')
    p.languages[idx] = { ...p.languages[idx], ...data }
    saveStored(p)
    return delay(p.languages[idx])
  },

  deleteLanguage: (id: string): Promise<void> => {
    const p = loadStored()
    p.languages = p.languages.filter((e) => e.id !== id)
    saveStored(p)
    return delay(undefined)
  },

  // ── References ──
  getReferences: (): Promise<Reference[]> => delay(loadStored().references),

  createReference: (data: Omit<Reference, 'id' | 'order'>): Promise<Reference> => {
    const p = loadStored()
    const entry: Reference = { ...data, id: makeId(), order: p.references.length }
    p.references.push(entry)
    saveStored(p)
    return delay(entry)
  },

  updateReference: (id: string, data: Partial<Reference>): Promise<Reference> => {
    const p = loadStored()
    const idx = p.references.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Not found')
    p.references[idx] = { ...p.references[idx], ...data }
    saveStored(p)
    return delay(p.references[idx])
  },

  deleteReference: (id: string): Promise<void> => {
    const p = loadStored()
    p.references = p.references.filter((e) => e.id !== id)
    saveStored(p)
    return delay(undefined)
  },

  uploadPhoto: (_file: File): Promise<{ avatarUrl: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const url = reader.result as string
        resolve({ avatarUrl: url })
      }
      reader.readAsDataURL(_file)
    })
  },
}

// Export helper for the builder to read the full profile
export function getProfileSnapshot(): StoredProfile {
  return loadStored()
}
