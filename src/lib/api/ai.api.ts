import type { JDMatchResult, StrengthScore } from '../../types/document'
import type { Experience } from '../../types/profile'

// ── helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Retry helper — max 3 attempts, exponential back-off (NFR-027)
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === attempts - 1) throw err
      await sleep(1000 * Math.pow(2, i))
    }
  }
  throw new Error('Max retries exceeded')
}

// AI usage tracking (FR-021) — 2/day limit on "Improve this"
const AI_USAGE_KEY = () => {
  const today = new Date().toDateString()
  return `ds-ai-usage-${today}`
}

export function getAiUsageToday(): number {
  try {
    return parseInt(localStorage.getItem(AI_USAGE_KEY()) ?? '0', 10)
  } catch { return 0 }
}

function incrementAiUsage(): void {
  const current = getAiUsageToday()
  localStorage.setItem(AI_USAGE_KEY(), String(current + 1))
}

export const AI_DAILY_LIMIT = 2

// ── Mock generation content ───────────────────────────────────────────────────

const SUMMARY_TEMPLATES = {
  en: [
    (role: string, company: string) =>
      `Results-driven professional with extensive experience in ${role}, specialising in delivering measurable impact for ${company ? company + ' and similar organisations' : 'leading organisations in the sector'}. Adept at leading cross-functional teams, driving strategic initiatives, and translating complex challenges into actionable solutions. Passionate about leveraging data-driven insights to accelerate organisational growth and exceed performance benchmarks.`,
    (role: string, company: string) =>
      `Dynamic ${role} professional with a proven track record of exceeding targets and driving operational excellence${company ? ` within the ${company} environment` : ''}. Combines deep technical expertise with strong leadership capabilities to build high-performing teams and deliver lasting results. Committed to continuous professional development and contributing meaningfully to mission-driven organisations.`,
    (role: string) =>
      `Accomplished ${role} with a strong foundation in strategic planning, stakeholder management, and solution delivery. Recognised for bridging the gap between business objectives and technical execution, consistently delivering projects on time and within budget. Fluent in French and English, with cross-cultural communication skills suited for multinational environments.`,
  ],
  fr: [
    (role: string, company: string) =>
      `Professionnel(le) orienté(e) résultats avec une solide expérience en ${role}, spécialisé(e) dans la création de valeur mesurable${company ? ` pour des organisations telles que ${company}` : ' pour des organisations de premier plan'}. Expert(e) dans la direction d'équipes pluridisciplinaires, la mise en œuvre d'initiatives stratégiques et la transformation de défis complexes en solutions concrètes. Passionné(e) par l'exploitation des données pour accélérer la croissance organisationnelle.`,
    (role: string, company: string) =>
      `Professionnel(le) dynamique en ${role} avec un palmarès prouvé de dépassement des objectifs et d'excellence opérationnelle${company ? ` au sein de ${company}` : ''}. Combine une expertise technique approfondie avec de solides capacités de leadership pour constituer des équipes performantes et obtenir des résultats durables. Bilingue français-anglais, engagé(e) dans le développement professionnel continu.`,
  ],
}

const REWRITE_PREFIXES = [
  'Led', 'Spearheaded', 'Architected', 'Delivered', 'Drove', 'Optimised',
  'Engineered', 'Built', 'Reduced', 'Increased', 'Transformed', 'Collaborated',
  'Designed', 'Managed', 'Launched', 'Streamlined', 'Implemented', 'Developed',
]

function rewriteBullet(bullet: string): string {
  const prefix = REWRITE_PREFIXES[Math.floor(Math.random() * REWRITE_PREFIXES.length)]
  const cleaned = bullet.replace(/^[\-•]\s*/, '').trim()
  const lower = cleaned.charAt(0).toLowerCase() + cleaned.slice(1)
  // Add measurable result if none present
  const hasPercent = /\d+%/.test(lower)
  const suffix = hasPercent ? '' : `, resulting in a ${rand(10, 40)}% improvement in key performance metrics`
  return `${prefix} ${lower}${suffix}.`
}

// ── API ───────────────────────────────────────────────────────────────────────

export const aiApi = {
  // FR-020: Generate 3-sentence professional summary
  generateSummary: async (
    role: string,
    companyName: string,
    language: 'en' | 'fr',
  ): Promise<string> => {
    return withRetry(async () => {
      await sleep(rand(2000, 3500))
      const templates = SUMMARY_TEMPLATES[language] ?? SUMMARY_TEMPLATES.en
      const tpl = templates[Math.floor(Math.random() * templates.length)]
      return tpl(role, companyName)
    })
  },

  // FR-019: Rewrite experience bullets with action verbs + impact (NFR-004)
  rewriteBullets: async (
    experience: Experience,
    targetRole: string,
    language: 'en' | 'fr',
  ): Promise<string[]> => {
    return withRetry(async () => {
      await sleep(rand(1500, 2800))
      const source = experience.description
        ? experience.description.split('\n').filter(Boolean)
        : experience.achievements

      if (!source.length) {
        const action = language === 'fr' ? 'résultats' : 'results'
        return [
          `Led key initiatives at ${experience.company}, delivering measurable ${action} aligned with organisational goals.`,
          `Collaborated with cross-functional teams to implement improvements, achieving a ${rand(15, 35)}% gain in efficiency.`,
          `Oversaw ${targetRole.toLowerCase()} responsibilities, consistently meeting and exceeding quarterly targets.`,
        ]
      }

      return source.slice(0, 5).map(rewriteBullet)
    })
  },

  // FR-021: Inline "Improve this" — respects 2/day limit
  improveText: async (
    text: string,
    context: string,
    language: 'en' | 'fr',
  ): Promise<{ improved: string; limitReached: boolean }> => {
    const usage = getAiUsageToday()
    if (usage >= AI_DAILY_LIMIT) {
      return { improved: text, limitReached: true }
    }

    return withRetry(async () => {
      await sleep(rand(1000, 2200))
      incrementAiUsage()

      // Simple mock improvement: capitalise, add quantification, tighten
      const improved = text
        .replace(/\bhelped\b/gi, 'enabled')
        .replace(/\bworked on\b/gi, 'delivered')
        .replace(/\bresponsible for\b/gi, 'led')
        .replace(/\bwas involved in\b/gi, 'spearheaded')
        .trim()

      const suffix =
        language === 'fr'
          ? ` (contexte : ${context || 'amélioration générale'})`
          : ` (optimised for: ${context || 'clarity and impact'})`

      return { improved: improved || text + suffix, limitReached: false }
    })
  },

  // FR-017: Analyse job description
  analyzeJD: async (
    jd: string,
    profileSkills: string[],
  ): Promise<JDMatchResult> => {
    return withRetry(async () => {
      await sleep(rand(2000, 3200))

      // Extract potential skill keywords from JD
      const jdWords = jd.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
      const skillWords = new Set(jdWords)

      const matched: string[] = []
      const unmatched: string[] = []

      for (const skill of profileSkills) {
        const lower = skill.toLowerCase()
        if (skillWords.has(lower) || jd.toLowerCase().includes(lower)) {
          matched.push(skill)
        }
      }

      // Pick some mock "required" skills not in profile
      const mockRequired = ['Communication', 'Problem-solving', 'Teamwork', 'Analytical thinking']
      for (const skill of mockRequired) {
        if (!profileSkills.includes(skill)) {
          unmatched.push(skill)
        }
      }

      const recommendedSections = ['experience', 'skills', 'education']
      if (jd.toLowerCase().includes('project')) recommendedSections.push('projects')
      if (jd.toLowerCase().includes('certif')) recommendedSections.push('certifications')

      return { matchedSkills: matched.slice(0, 8), unmatchedSkills: unmatched.slice(0, 4), recommendedSections }
    })
  },

  // FR-024: AI strength check
  strengthCheck: async (
    generatedContent: Record<string, string>,
    selectedSections: string[],
    jdMatchResult?: JDMatchResult,
  ): Promise<StrengthScore> => {
    return withRetry(async () => {
      await sleep(rand(2500, 4000))

      const hasSummary = Boolean(generatedContent['summary'])
      const hasExperience = selectedSections.includes('experience')
      const hasSkills = selectedSections.includes('skills')
      const hasEducation = selectedSections.includes('education')

      const completeness = Math.min(
        100,
        (selectedSections.length / 7) * 100 * (hasSummary ? 1 : 0.8),
      )
      const impactLanguage = hasSummary ? rand(65, 88) : rand(40, 65)
      const relevance = jdMatchResult
        ? Math.min(100, (jdMatchResult.matchedSkills.length / Math.max(jdMatchResult.matchedSkills.length + jdMatchResult.unmatchedSkills.length, 1)) * 100 + rand(10, 20))
        : rand(55, 75)
      const formattingQuality = rand(85, 98)
      const keywordDensity = jdMatchResult ? rand(60, 82) : rand(45, 68)

      const overall = Math.round(
        (impactLanguage * 0.25 + completeness * 0.25 + relevance * 0.2 + formattingQuality * 0.15 + keywordDensity * 0.15),
      )

      return {
        overall,
        impactLanguage: Math.round(impactLanguage),
        completeness: Math.round(completeness),
        relevance: Math.round(relevance),
        formattingQuality: Math.round(formattingQuality),
        keywordDensity: Math.round(keywordDensity),
        explanations: {
          impactLanguage:
            impactLanguage > 75
              ? 'Strong use of action verbs and quantified results.'
              : 'Add more measurable achievements (e.g., "increased sales by 30%").',
          completeness:
            completeness > 80
              ? 'Profile is well-filled across key sections.'
              : 'Consider adding more sections — a fuller profile generates better documents.',
          relevance:
            relevance > 75
              ? 'Strong keyword alignment with the target role.'
              : 'Include more skills and keywords from the job description.',
          formattingQuality: 'Well-structured layout using the Horizon template.',
          keywordDensity:
            keywordDensity > 70
              ? 'Good keyword density for ATS compatibility.'
              : 'Add 3–5 more industry keywords from the job description.',
        },
      }
    })
  },

  // FR-031: Select most relevant projects for a role
  selectRelevantProjects: async (
    projectIds: string[],
    projectNames: string[],
    targetRole: string,
  ): Promise<string[]> => {
    await sleep(rand(800, 1400))
    // Simple mock: return first 2-3 projects as "most relevant"
    return projectIds.slice(0, Math.min(3, projectIds.length))
  },
}
