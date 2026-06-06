import { z } from 'zod'

const optionalUrl = z.string().optional()
const optionalString = z.string().optional()

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  professionalTitle: z.string().min(1),
  phone: z.string().min(1),
  linkedinUrl: optionalUrl,
  websiteUrl: optionalUrl,
  githubUrl: optionalUrl,
  city: optionalString,
  country: z.string().min(1),
  cameroonian: z.boolean().default(false),
  nationality: optionalString,
  dateOfBirth: optionalString,
  placeOfBirth: optionalString,
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  summary: z.string().max(500).optional(),
})

export const educationSchema = z.object({
  institution: z.string().min(1),
  degreeType: z.enum(['bachelor', 'master', 'phd', 'hnd', 'bts', 'certificate', 'other']),
  fieldOfStudy: z.string().min(1),
  startDate: z.string().min(1),
  endDate: optionalString,
  ongoing: z.boolean().default(false),
  city: optionalString,
  country: z.string().default('Cameroon'),
  gpa: optionalString,
  showGpa: z.boolean().default(true),
  alwaysShowGpa: z.boolean().default(false),
  description: z.string().max(300).optional(),
  honors: z.array(z.string()).default([]),
})

export const experienceSchema = z.object({
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  employmentType: z.enum(['full-time', 'part-time', 'internship', 'contract', 'freelance', 'volunteer']),
  startDate: z.string().min(1),
  endDate: optionalString,
  ongoing: z.boolean().default(false),
  location: z.string().default(''),
  remote: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
})

export const certificationSchema = z.object({
  name: z.string().min(1),
  issuingOrg: z.string().min(1),
  dateIssued: z.string().min(1),
  expiryDate: optionalString,
  noExpiry: z.boolean().default(false),
  credentialUrl: optionalUrl,
})

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().max(300).optional(),
  role: optionalString,
  technologies: z.array(z.string()).default([]),
  projectUrl: optionalUrl,
  startDate: optionalString,
  endDate: optionalString,
  status: z.enum(['completed', 'ongoing']).default('completed'),
})

export const volunteerSchema = z.object({
  organisation: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().min(1),
  endDate: optionalString,
  ongoing: z.boolean().default(false),
  description: optionalString,
})

export const publicationSchema = z.object({
  title: z.string().min(1),
  authors: z.array(z.string()).default([]),
  publication: z.string().min(1),
  date: z.string().min(1),
  url: optionalString,
  description: optionalString,
})

export const languageSchema = z.object({
  language: z.string().min(1),
  level: z.enum(['native', 'fluent', 'professional', 'conversational', 'basic']),
})

export const referenceSchema = z.object({
  name: z.string().min(1),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  phone: optionalString,
  relationship: z.enum(['direct-manager', 'professor', 'colleague', 'client', 'other']),
})

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>
export type EducationFormValues = z.infer<typeof educationSchema>
export type ExperienceFormValues = z.infer<typeof experienceSchema>
export type CertificationFormValues = z.infer<typeof certificationSchema>
export type ProjectFormValues = z.infer<typeof projectSchema>
export type VolunteerFormValues = z.infer<typeof volunteerSchema>
export type PublicationFormValues = z.infer<typeof publicationSchema>
export type LanguageFormValues = z.infer<typeof languageSchema>
export type ReferenceFormValues = z.infer<typeof referenceSchema>
