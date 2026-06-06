export type DocumentType =
  | 'cv'
  | 'cover_letter'
  | 'motivation_letter'
  | 'recommendation_letter'
  | 'personal_statement'
  | 'research_proposal'
  | 'expression_of_interest'
  | 'writing_sample'

export type CompanyType =
  | 'private'
  | 'government'
  | 'ngo'
  | 'academic'
  | 'startup'
  | 'international'
  | 'other'

export interface ContextParams {
  jobTitle: string
  companyName?: string
  companyType: CompanyType
  targetCountry: string
  industry?: string
  language: 'en' | 'fr'
  targetAudienceDescription?: string
  jobDescription?: string
}

export interface JDMatchResult {
  matchedSkills: string[]
  unmatchedSkills: string[]
  recommendedSections: string[]
}

export interface StrengthScore {
  overall: number
  impactLanguage: number
  completeness: number
  relevance: number
  formattingQuality: number
  keywordDensity: number
  explanations: {
    impactLanguage: string
    completeness: string
    relevance: string
    formattingQuality: string
    keywordDensity: string
  }
}

export interface DocDocument {
  id: string
  userId: string
  type: DocumentType
  title: string
  context: ContextParams
  language: 'en' | 'fr'
  templateId: string
  step: number
  selectedSections: string[]
  sectionOrder: string[]
  generatedContent: Record<string, string>
  jdMatchResult?: JDMatchResult
  strengthScore?: StrengthScore
  createdAt: string
  updatedAt: string
}

export interface BuilderState {
  documentId: string
  documentType: DocumentType
  step: number
  context: ContextParams
  selectedSections: string[]
  sectionOrder: string[]
  generatedContent: Record<string, string>
  templateId: string
  language: 'en' | 'fr'
  jdMatchResult?: JDMatchResult
  strengthScore?: StrengthScore
  hasUnsavedChanges: boolean
}

export type SectionKey =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'volunteer'
  | 'publications'
  | 'languages'
  | 'references'

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'volunteer',
  'publications',
  'languages',
  'references',
]

export const FREE_DOCUMENT_TYPES: DocumentType[] = ['cv', 'cover_letter']

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  cv: 'CV / Resume',
  cover_letter: 'Cover Letter',
  motivation_letter: 'Motivation Letter',
  recommendation_letter: 'Recommendation Letter',
  personal_statement: 'Personal Statement',
  research_proposal: 'Research Proposal',
  expression_of_interest: 'Expression of Interest',
  writing_sample: 'Writing Sample',
}

export const DOCUMENT_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  cv: 'Your professional story for job applications',
  cover_letter: 'Personalised letter for a specific role',
  motivation_letter: 'For scholarships and study programmes',
  recommendation_letter: 'Draft for supervisor review and signature',
  personal_statement: 'For university admissions and fellowships',
  research_proposal: 'For graduate school and grants',
  expression_of_interest: 'For leadership and NGO roles',
  writing_sample: 'For research and journalism positions',
}
