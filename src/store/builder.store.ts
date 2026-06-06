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

interface BuilderStore extends BuilderState {
  // Actions
  initBuilder: (docId: string, doc: Partial<BuilderState>) => void
  setStep: (step: number) => void
  setContext: (ctx: Partial<ContextParams>) => void
  toggleSection: (key: SectionKey) => void
  reorderSections: (order: string[]) => void
  setGeneratedContent: (key: string, content: string) => void
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

// Completeness meter (FR-023)
// Score = (filled sections / 7) × 60 + (AI content sections / 3) × 25 + keyword_match × 15
export function calcCompleteness(state: BuilderState): number {
  const sectionScore = Math.min(state.selectedSections.length / 7, 1) * 60
  const aiSections = ['summary', 'experience', 'skills'].filter(
    (s) => state.generatedContent[s],
  ).length
  const aiScore = (aiSections / 3) * 25
  const jdScore = state.jdMatchResult
    ? Math.min(state.jdMatchResult.matchedSkills.length / 5, 1) * 15
    : 0
  return Math.round(sectionScore + aiScore + jdScore)
}
