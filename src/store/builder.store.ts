import { create } from 'zustand'
import type {
  BuilderState,
  ContextParams,
  JDMatchResult,
  StrengthScore,
  SectionKey,
} from '../types/document'
import { DEFAULT_SECTION_ORDER } from '../types/document'
import { documentApi } from '../lib/api/document.api'
import { getProfileSnapshot } from '../lib/api/profile.api'

export interface CompletionSuggestion {
  id: string
  textKey: string
  stepLink: number
  points: number
}

interface BuilderStore extends BuilderState {
  // Actions
  initBuilder: (docId: string, doc: Partial<BuilderState>) => void
  setStep: (step: number) => void
  setContext: (ctx: Partial<ContextParams>) => void
  toggleSection: (key: SectionKey) => void
  reorderSections: (order: string[]) => void
  setGeneratedContent: (key: string, content: string) => void
  clearGeneratedContent: () => void
  setJDMatchResult: (result: JDMatchResult) => void
  setStrengthScore: (score: StrengthScore) => void
  markSaved: () => void
  resetBuilder: () => void
  persistDraft: () => void
}

const DEFAULT_CONTEXT: ContextParams = {
  jobTitle: '',
  companyType: 'private',
  targetCountry: 'Cameroon',
  language: 'en',
}

const EMPTY_STATE: BuilderState = {
  documentId: '',
  documentType: 'cv',
  step: 1,
  context: DEFAULT_CONTEXT,
  selectedSections: ['personal', 'summary', 'experience', 'education', 'skills'],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  generatedContent: {},
  templateId: 'horizon',
  language: 'en',
  hasUnsavedChanges: false,
}

export const useBuilderStore = create<BuilderStore>()((set, get) => ({
  ...EMPTY_STATE,

  initBuilder: (docId, doc) => {
    set({
      ...EMPTY_STATE,
      documentId: docId,
      documentType: doc.documentType ?? 'cv',
      step: doc.step ?? 1,
      context: doc.context ?? DEFAULT_CONTEXT,
      selectedSections: doc.selectedSections ?? EMPTY_STATE.selectedSections,
      sectionOrder: doc.sectionOrder ?? [...DEFAULT_SECTION_ORDER],
      generatedContent: doc.generatedContent ?? {},
      templateId: doc.templateId ?? 'horizon',
      language: doc.language ?? 'en',
      jdMatchResult: doc.jdMatchResult,
      strengthScore: doc.strengthScore,
      hasUnsavedChanges: false,
    })
  },

  setStep: (step) => {
    set({ step })
    get().persistDraft()
  },

  setContext: (ctx) => {
    set((s) => ({
      context: { ...s.context, ...ctx },
      language: ctx.language ?? s.language,
      hasUnsavedChanges: true,
    }))
    get().persistDraft()
  },

  toggleSection: (key) => {
    set((s) => {
      const selected = s.selectedSections.includes(key)
        ? s.selectedSections.filter((k) => k !== key)
        : [...s.selectedSections, key]
      return { selectedSections: selected, hasUnsavedChanges: true }
    })
    get().persistDraft()
  },

  reorderSections: (order) => {
    set({ sectionOrder: order, hasUnsavedChanges: true })
    get().persistDraft()
  },

  setGeneratedContent: (key, content) => {
    set((s) => ({
      generatedContent: { ...s.generatedContent, [key]: content },
      hasUnsavedChanges: true,
    }))
    get().persistDraft()
  },

  clearGeneratedContent: () => {
    set({ generatedContent: {}, hasUnsavedChanges: true })
    get().persistDraft()
  },

  setJDMatchResult: (result) => {
    set({ jdMatchResult: result, hasUnsavedChanges: true })
    get().persistDraft()
  },

  setStrengthScore: (score) => {
    set({ strengthScore: score })
    get().persistDraft()
  },

  markSaved: () => set({ hasUnsavedChanges: false }),

  resetBuilder: () => set(EMPTY_STATE),

  persistDraft: () => {
    const state = get()
    if (!state.documentId) return
    documentApi.saveDraft(state.documentId, {
      documentType: state.documentType,
      step: state.step,
      context: state.context,
      selectedSections: state.selectedSections,
      sectionOrder: state.sectionOrder,
      generatedContent: state.generatedContent,
      templateId: state.templateId,
      language: state.language,
      jdMatchResult: state.jdMatchResult,
      strengthScore: state.strengthScore,
    })
    // Also sync to the document store
    void documentApi.update(state.documentId, {
      step: state.step,
      context: state.context,
      selectedSections: state.selectedSections,
      sectionOrder: state.sectionOrder,
      generatedContent: state.generatedContent,
      language: state.language,
      jdMatchResult: state.jdMatchResult,
      strengthScore: state.strengthScore,
    })
  },
}))

// Completeness meter — Phase 3 formula (FR-023)
export function calcCompletenessData(state: BuilderState): {
  score: number
  suggestions: CompletionSuggestion[]
} {
  const profile = getProfileSnapshot()
  const suggestions: CompletionSuggestion[] = []
  let score = 0

  // ── Base score (0–60) ────────────────────────────────────────────────
  const hasSummary = Boolean(state.generatedContent['summary'] || profile.personal?.summary)
  if (hasSummary) { score += 10 } else {
    suggestions.push({ id: 'summary', textKey: 'builder.sgAddSummary', stepLink: 4, points: 10 })
  }

  const hasExperience = profile.experience.length > 0
  if (hasExperience) { score += 15 } else {
    suggestions.push({ id: 'experience', textKey: 'builder.sgAddExperience', stepLink: 5, points: 15 })
  }

  const hasEducation = profile.education.length > 0
  if (hasEducation) { score += 10 } else {
    suggestions.push({ id: 'education', textKey: 'builder.sgAddEducation', stepLink: 6, points: 10 })
  }

  const hasSkills = profile.skills.length >= 5
  if (hasSkills) { score += 10 } else {
    suggestions.push({ id: 'skills', textKey: 'builder.sgAddSkills', stepLink: 7, points: 10 })
  }

  const hasContact = Boolean(
    profile.personal?.firstName && profile.personal?.phone && profile.personal?.country,
  )
  if (hasContact) { score += 5 } else {
    suggestions.push({ id: 'contact', textKey: 'builder.sgCompleteContact', stepLink: 3, points: 5 })
  }

  const hasPhoto = Boolean(profile.personal?.avatarUrl)
  if (hasPhoto) { score += 5 } else {
    suggestions.push({ id: 'photo', textKey: 'builder.sgAddPhoto', stepLink: 3, points: 5 })
  }

  const hasReferences = profile.references.length > 0
  if (hasReferences) { score += 5 }

  // ── Content quality (0–25) ───────────────────────────────────────────
  const aiSectionsUsed = ['summary', 'experience', 'skills', 'projects'].filter(
    (s) => state.generatedContent[s],
  ).length
  if (aiSectionsUsed >= 1) { score += 5 } else {
    suggestions.push({ id: 'ai', textKey: 'builder.sgUseAI', stepLink: 4, points: 5 })
  }

  const summaryAI = Boolean(state.generatedContent['summary'])
  if (summaryAI) { score += 5 }

  const expContent = state.generatedContent['experience'] ?? ''
  const avgBulletLen = expContent.length > 0
    ? expContent.split('\n').filter(Boolean).reduce((acc, l) => acc + l.length, 0) /
      Math.max(expContent.split('\n').filter(Boolean).length, 1)
    : 0
  if (avgBulletLen > 80) { score += 5 }

  // Count quantified results (patterns like numbers, %, X)
  const quantMatches = (expContent.match(/\d+\s*%|\d+x|\d+\+|\$\d+|[€₣]\d+|\d+\s+(users|clients|sales|revenue)/gi) ?? []).length
  if (quantMatches >= 3) { score += 10 } else {
    suggestions.push({ id: 'quantify', textKey: 'builder.sgQuantify', stepLink: 5, points: 10 })
  }

  // ── Relevance (0–15) ─────────────────────────────────────────────────
  if (state.jdMatchResult) {
    const total = state.jdMatchResult.matchedSkills.length + state.jdMatchResult.unmatchedSkills.length
    const matchPct = total > 0 ? state.jdMatchResult.matchedSkills.length / total : 0
    if (matchPct >= 0.6) { score += 15 }
    else if (matchPct >= 0.4) { score += 10 }
    else { score += 5 }
  } else {
    suggestions.push({ id: 'jd', textKey: 'builder.sgPasteJD', stepLink: 2, points: 15 })
  }

  // Sort suggestions by highest points first, take top 3
  suggestions.sort((a, b) => b.points - a.points)

  return { score: Math.min(100, Math.round(score)), suggestions }
}

// Lightweight version for components that only need the number
export function calcCompleteness(state: BuilderState): number {
  return calcCompletenessData(state).score
}
