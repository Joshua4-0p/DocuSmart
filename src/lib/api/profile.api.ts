import { api } from './client'
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

export const profileApi = {
  getProfile: () =>
    api.get<MasterProfile>('/api/profile'),

  updatePersonal: (data: PersonalDetails) =>
    api.put<PersonalDetails>('/api/profile/personal', data),

  // Education
  getEducation: () => api.get<Education[]>('/api/profile/education'),
  createEducation: (data: Omit<Education, 'id' | 'order'>) =>
    api.post<Education>('/api/profile/education', data),
  updateEducation: (id: string, data: Partial<Education>) =>
    api.patch<Education>(`/api/profile/education/${id}`, data),
  deleteEducation: (id: string) =>
    api.delete<void>(`/api/profile/education/${id}`),
  reorderEducation: (ids: string[]) =>
    api.patch<void>('/api/profile/education/reorder', { ids }),

  // Experience
  getExperience: () => api.get<Experience[]>('/api/profile/experience'),
  createExperience: (data: Omit<Experience, 'id' | 'order'>) =>
    api.post<Experience>('/api/profile/experience', data),
  updateExperience: (id: string, data: Partial<Experience>) =>
    api.patch<Experience>(`/api/profile/experience/${id}`, data),
  deleteExperience: (id: string) =>
    api.delete<void>(`/api/profile/experience/${id}`),

  // Skills
  getSkills: () => api.get<Skill[]>('/api/profile/skills'),
  createSkill: (data: Omit<Skill, 'id' | 'order'>) =>
    api.post<Skill>('/api/profile/skills', data),
  updateSkill: (id: string, data: Partial<Skill>) =>
    api.patch<Skill>(`/api/profile/skills/${id}`, data),
  deleteSkill: (id: string) =>
    api.delete<void>(`/api/profile/skills/${id}`),

  // Certifications
  getCertifications: () => api.get<Certification[]>('/api/profile/certifications'),
  createCertification: (data: Omit<Certification, 'id' | 'order'>) =>
    api.post<Certification>('/api/profile/certifications', data),
  updateCertification: (id: string, data: Partial<Certification>) =>
    api.patch<Certification>(`/api/profile/certifications/${id}`, data),
  deleteCertification: (id: string) =>
    api.delete<void>(`/api/profile/certifications/${id}`),

  // Projects
  getProjects: () => api.get<Project[]>('/api/profile/projects'),
  createProject: (data: Omit<Project, 'id' | 'order'>) =>
    api.post<Project>('/api/profile/projects', data),
  updateProject: (id: string, data: Partial<Project>) =>
    api.patch<Project>(`/api/profile/projects/${id}`, data),
  deleteProject: (id: string) =>
    api.delete<void>(`/api/profile/projects/${id}`),

  // Volunteer
  getVolunteer: () => api.get<Volunteer[]>('/api/profile/volunteer'),
  createVolunteer: (data: Omit<Volunteer, 'id' | 'order'>) =>
    api.post<Volunteer>('/api/profile/volunteer', data),
  updateVolunteer: (id: string, data: Partial<Volunteer>) =>
    api.patch<Volunteer>(`/api/profile/volunteer/${id}`, data),
  deleteVolunteer: (id: string) =>
    api.delete<void>(`/api/profile/volunteer/${id}`),

  // Publications
  getPublications: () => api.get<Publication[]>('/api/profile/publications'),
  createPublication: (data: Omit<Publication, 'id' | 'order'>) =>
    api.post<Publication>('/api/profile/publications', data),
  updatePublication: (id: string, data: Partial<Publication>) =>
    api.patch<Publication>(`/api/profile/publications/${id}`, data),
  deletePublication: (id: string) =>
    api.delete<void>(`/api/profile/publications/${id}`),

  // Languages
  getLanguages: () => api.get<Language[]>('/api/profile/languages'),
  createLanguage: (data: Omit<Language, 'id' | 'order'>) =>
    api.post<Language>('/api/profile/languages', data),
  updateLanguage: (id: string, data: Partial<Language>) =>
    api.patch<Language>(`/api/profile/languages/${id}`, data),
  deleteLanguage: (id: string) =>
    api.delete<void>(`/api/profile/languages/${id}`),

  // References
  getReferences: () => api.get<Reference[]>('/api/profile/references'),
  createReference: (data: Omit<Reference, 'id' | 'order'>) =>
    api.post<Reference>('/api/profile/references', data),
  updateReference: (id: string, data: Partial<Reference>) =>
    api.patch<Reference>(`/api/profile/references/${id}`, data),
  deleteReference: (id: string) =>
    api.delete<void>(`/api/profile/references/${id}`),

  uploadPhoto: (file: File) => {
    const formData = new FormData()
    formData.append('photo', file)
    const token = (() => {
      try {
        const stored = localStorage.getItem('ds-auth')
        if (!stored) return null
        const parsed = JSON.parse(stored) as { state?: { accessToken?: string } }
        return parsed?.state?.accessToken ?? null
      } catch { return null }
    })()
    return fetch(
      `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api/profile/photo`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    ).then((r) => r.json() as Promise<{ avatarUrl: string }>)
  },
}
