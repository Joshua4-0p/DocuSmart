import type { ApplicationEntry, ApplicationStatus, DocumentVersion } from '../../types/application'

function getUserId(): string {
  try {
    const stored = localStorage.getItem('ds-auth')
    if (!stored) return 'anon'
    const parsed = JSON.parse(stored) as { state?: { user?: { id?: string } } }
    return parsed?.state?.user?.id ?? 'anon'
  } catch { return 'anon' }
}

const APPS_KEY = (uid: string) => `ds-applications-${uid}`
const VERSIONS_KEY = (docId: string) => `ds-versions-${docId}`

function loadApps(): ApplicationEntry[] {
  try {
    const raw = localStorage.getItem(APPS_KEY(getUserId()))
    if (raw) return JSON.parse(raw) as ApplicationEntry[]
  } catch { /* ignore */ }
  return []
}

function saveApps(apps: ApplicationEntry[]): void {
  localStorage.setItem(APPS_KEY(getUserId()), JSON.stringify(apps))
}

function makeId(): string {
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function delay<T>(value: T, ms = 60): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms))
}

export const applicationsApi = {
  list: (): Promise<ApplicationEntry[]> => delay(loadApps()),

  get: (id: string): Promise<ApplicationEntry | null> => {
    const app = loadApps().find((a) => a.id === id) ?? null
    return delay(app)
  },

  create: (data: Omit<ApplicationEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApplicationEntry> => {
    const now = new Date().toISOString()
    const entry: ApplicationEntry = {
      ...data,
      id: makeId(),
      userId: getUserId(),
      createdAt: now,
      updatedAt: now,
    }
    const apps = loadApps()
    apps.unshift(entry)
    saveApps(apps)
    return delay(entry)
  },

  update: (id: string, updates: Partial<ApplicationEntry>): Promise<ApplicationEntry> => {
    const apps = loadApps()
    const idx = apps.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Application not found')
    apps[idx] = { ...apps[idx], ...updates, updatedAt: new Date().toISOString() }
    saveApps(apps)
    return delay(apps[idx])
  },

  delete: (id: string): Promise<void> => {
    const apps = loadApps().filter((a) => a.id !== id)
    saveApps(apps)
    return delay(undefined)
  },

  moveStatus: (id: string, status: ApplicationStatus): Promise<ApplicationEntry> => {
    return applicationsApi.update(id, { status })
  },
}

// ── Version History ────────────────────────────────────────────────────────────

function loadVersions(docId: string): DocumentVersion[] {
  try {
    const raw = localStorage.getItem(VERSIONS_KEY(docId))
    if (raw) return JSON.parse(raw) as DocumentVersion[]
  } catch { /* ignore */ }
  return []
}

function saveVersions(docId: string, versions: DocumentVersion[]): void {
  localStorage.setItem(VERSIONS_KEY(docId), JSON.stringify(versions))
}

export const versionsApi = {
  list: (docId: string): Promise<DocumentVersion[]> => {
    return delay(loadVersions(docId))
  },

  saveVersion: (
    docId: string,
    snapshot: Omit<DocumentVersion, 'id' | 'documentId' | 'versionNumber' | 'createdAt'>,
  ): Promise<DocumentVersion> => {
    const existing = loadVersions(docId)
    const versionNumber = (existing[0]?.versionNumber ?? 0) + 1
    const version: DocumentVersion = {
      ...snapshot,
      id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      documentId: docId,
      versionNumber,
      createdAt: new Date().toISOString(),
    }
    const updated = [version, ...existing].slice(0, 20) // keep last 20
    saveVersions(docId, updated)
    return delay(version)
  },

  restore: (docId: string, versionId: string): Promise<DocumentVersion | null> => {
    const versions = loadVersions(docId)
    const target = versions.find((v) => v.id === versionId) ?? null
    if (!target) return delay(null)
    // Save current as a new version before restoring — caller handles snapshot
    return delay(target)
  },
}
