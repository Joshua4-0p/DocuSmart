import type { DocDocument, DocumentType, ContextParams } from '../../types/document'

// Re-export for convenience
export type { DocDocument }

function getUserId(): string {
  try {
    const stored = localStorage.getItem('ds-auth')
    if (!stored) return 'anon'
    const parsed = JSON.parse(stored) as { state?: { user?: { id?: string } } }
    return parsed?.state?.user?.id ?? 'anon'
  } catch { return 'anon' }
}

const DOCS_KEY = (uid: string) => `ds-documents-${uid}`

function loadDocs(): DocDocument[] {
  try {
    const raw = localStorage.getItem(DOCS_KEY(getUserId()))
    if (raw) return JSON.parse(raw) as DocDocument[]
  } catch { /* ignore */ }
  return []
}

function saveDocs(docs: DocDocument[]): void {
  localStorage.setItem(DOCS_KEY(getUserId()), JSON.stringify(docs))
}

function makeId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function delay<T>(value: T, ms = 60): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms))
}

export const documentApi = {
  list: (): Promise<DocDocument[]> => delay(loadDocs()),

  get: (id: string): Promise<DocDocument | null> => {
    const doc = loadDocs().find((d) => d.id === id) ?? null
    return delay(doc)
  },

  create: (
    type: DocumentType,
    context: ContextParams,
    defaultSections: string[],
    sectionOrder: string[],
  ): Promise<DocDocument> => {
    const uid = getUserId()
    const now = new Date().toISOString()
    const doc: DocDocument = {
      id: makeId(),
      userId: uid,
      type,
      title: context.jobTitle
        ? `${context.jobTitle}${context.companyName ? ` @ ${context.companyName}` : ''}`
        : type === 'cv' ? 'My CV' : 'My Cover Letter',
      context,
      language: context.language,
      templateId: 'horizon',
      step: 1,
      selectedSections: defaultSections,
      sectionOrder,
      generatedContent: {},
      createdAt: now,
      updatedAt: now,
    }
    const docs = loadDocs()
    docs.unshift(doc)
    saveDocs(docs)
    return delay(doc)
  },

  update: (id: string, updates: Partial<DocDocument>): Promise<DocDocument> => {
    const docs = loadDocs()
    const idx = docs.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error('Document not found')
    docs[idx] = { ...docs[idx], ...updates, updatedAt: new Date().toISOString() }
    saveDocs(docs)
    return delay(docs[idx])
  },

  delete: (id: string): Promise<void> => {
    const docs = loadDocs().filter((d) => d.id !== id)
    saveDocs(docs)
    return delay(undefined)
  },

  duplicate: (id: string): Promise<DocDocument> => {
    const docs = loadDocs()
    const source = docs.find((d) => d.id === id)
    if (!source) throw new Error('Document not found')
    const now = new Date().toISOString()
    const copy: DocDocument = {
      ...source,
      id: makeId(),
      title: `${source.title} (copy)`,
      step: 1,
      createdAt: now,
      updatedAt: now,
    }
    docs.unshift(copy)
    saveDocs(docs)
    return delay(copy)
  },

  saveDraft: (id: string, builderState: object): void => {
    localStorage.setItem(`builder_draft_${id}`, JSON.stringify(builderState))
  },

  loadDraft: (id: string): object | null => {
    try {
      const raw = localStorage.getItem(`builder_draft_${id}`)
      return raw ? (JSON.parse(raw) as object) : null
    } catch { return null }
  },
}
