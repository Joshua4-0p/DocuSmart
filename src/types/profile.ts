export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type LanguageLevel = 'native' | 'fluent' | 'professional' | 'conversational' | 'basic'
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed'
export type EmploymentType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance' | 'volunteer'
export type DegreeType = "bachelor" | "master" | "phd" | "hnd" | "bts" | "certificate" | "other"
export type RefereeRelationship = 'direct-manager' | 'professor' | 'colleague' | 'client' | 'other'
export type ProjectStatus = 'completed' | 'ongoing'

export interface PersonalDetails {
  firstName: string
  lastName: string
  professionalTitle: string
  phone: string
  linkedinUrl?: string
  websiteUrl?: string
  githubUrl?: string
  avatarUrl?: string
  city?: string
  country: string
  // Cameroonian format fields
  cameroonian: boolean
  nationality?: string
  dateOfBirth?: string
  placeOfBirth?: string
  maritalStatus?: MaritalStatus
  summary?: string
}

export interface Education {
  id: string
  institution: string
  degreeType: DegreeType
  fieldOfStudy: string
  startDate: string
  endDate?: string
  ongoing: boolean
  city?: string
  country: string
  gpa?: string
  showGpa: boolean
  alwaysShowGpa: boolean
  description?: string
  honors: string[]
  order: number
}

export interface Experience {
  id: string
  jobTitle: string
  company: string
  employmentType: EmploymentType
  startDate: string
  endDate?: string
  ongoing: boolean
  location: string
  remote: boolean
  description?: string
  achievements: string[]
  order: number
}

export interface Skill {
  id: string
  name: string
  level: ProficiencyLevel
  category?: string
  order: number
}

export interface Certification {
  id: string
  name: string
  issuingOrg: string
  dateIssued: string
  expiryDate?: string
  noExpiry: boolean
  credentialUrl?: string
  order: number
}

export interface Project {
  id: string
  name: string
  description?: string
  role?: string
  technologies: string[]
  projectUrl?: string
  startDate?: string
  endDate?: string
  status: ProjectStatus
  order: number
}

export interface Volunteer {
  id: string
  organisation: string
  role: string
  startDate: string
  endDate?: string
  ongoing: boolean
  description?: string
  order: number
}

export interface Publication {
  id: string
  title: string
  authors: string[]
  publication: string
  date: string
  url?: string
  description?: string
  order: number
}

export interface Language {
  id: string
  language: string
  level: LanguageLevel
  order: number
}

export interface Reference {
  id: string
  name: string
  jobTitle: string
  company: string
  email: string
  phone?: string
  relationship: RefereeRelationship
  order: number
}

export interface MasterProfile {
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
  completeness: number
}

export type ProfileSection =
  | 'personal'
  | 'education'
  | 'experience'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'volunteer'
  | 'publications'
  | 'languages'
  | 'references'
