export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview Scheduled',
  offer: 'Offer Received',
  rejected: 'Rejected / Withdrawn',
}

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  'wishlist', 'applied', 'interview', 'offer', 'rejected',
]

export interface ApplicationEntry {
  id: string
  userId: string
  company: string
  role: string
  applicationDate: string
  status: ApplicationStatus
  linkedDocumentIds: string[]
  notes?: string
  applicationUrl?: string
  createdAt: string
  updatedAt: string
}

export interface DocumentVersion {
  id: string
  documentId: string
  versionNumber: number
  // Snapshot of key builder state fields
  generatedContent: Record<string, string>
  selectedSections: string[]
  templateId: string
  accentColor: string
  changeDescription: string
  createdAt: string
}
