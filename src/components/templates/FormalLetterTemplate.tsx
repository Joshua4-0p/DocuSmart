import type { BuilderState } from '../../types/document'
import { getProfileSnapshot } from '../../lib/api/profile.api'
import { resolveAccentColor, resolveFontPairing } from '../../lib/templates/templateSettings'

interface FormalLetterProps {
  state: BuilderState
  scale?: number
}

const LETTER_TYPE_LABELS: Record<string, string> = {
  motivation_letter:       'Motivation Letter',
  recommendation_letter:   'Letter of Recommendation',
  personal_statement:      'Personal Statement',
  research_proposal:       'Research Proposal',
  expression_of_interest:  'Expression of Interest',
  writing_sample:          'Writing Sample',
}

const LETTER_SUBJECT_PREFIX: Record<string, string> = {
  motivation_letter:       'Application for',
  recommendation_letter:   'Letter of Recommendation for',
  personal_statement:      'Personal Statement —',
  research_proposal:       'Research Proposal:',
  expression_of_interest:  'Expression of Interest —',
  writing_sample:          'Writing Sample:',
}

function getDefaultBody(documentType: string, context: BuilderState['context']): string {
  const { jobTitle, companyName, language } = context
  const role = jobTitle || '[Role]'
  const org = companyName ? (language === 'fr' ? ` au sein de ${companyName}` : ` at ${companyName}`) : ''

  const bodies: Record<string, string> = {
    motivation_letter: language === 'fr'
      ? `Je vous adresse cette lettre de motivation dans le cadre de ma candidature pour ${role}${org}. Passionné(e) par ce domaine, je suis convaincu(e) que mon profil correspond aux attentes de votre programme.\n\nMon parcours académique et professionnel m'a permis de développer des compétences solides et une vision claire de mes objectifs. Je suis motivé(e) par le désir d'apprendre, de contribuer et de m'épanouir dans un environnement stimulant.\n\nJe me tiens à votre disposition pour tout entretien et vous remercie de l'attention portée à ma candidature.`
      : `I am writing this motivation letter in support of my application for ${role}${org}. With a strong academic background and a genuine passion for this field, I am confident my profile aligns with your requirements.\n\nThroughout my studies and professional experiences, I have developed a solid skill set and a clear sense of purpose. I am driven by a commitment to excellence and a desire to make a meaningful contribution.\n\nI welcome the opportunity to discuss my application further and thank you for considering my candidacy.`,

    recommendation_letter: language === 'fr'
      ? `J'ai le plaisir de recommander chaleureusement [Nom du candidat] pour le poste de ${role}${org}. Au cours de notre collaboration, [il/elle] a démontré des qualités professionnelles et humaines remarquables.\n\n[Nom du candidat] possède une maîtrise solide de son domaine et fait preuve d'une grande rigueur dans son travail. Sa capacité à résoudre des problèmes complexes et à collaborer efficacement a largement contribué aux succès de notre équipe.\n\nJe recommande [Nom du candidat] sans réserve et suis convaincu(e) qu'[il/elle] apportera une contribution précieuse à votre organisation.`
      : `It is with great pleasure that I recommend [Candidate Name] for the position of ${role}${org}. During our time working together, they have demonstrated exceptional professional and personal qualities.\n\n[Candidate Name] has a strong command of their field and consistently brings rigour and dedication to their work. Their ability to solve complex problems and collaborate effectively has contributed greatly to our team's success.\n\nI recommend [Candidate Name] without reservation and am confident they will be a valuable addition to your organisation.`,

    personal_statement: language === 'fr'
      ? `Le parcours que je vous présente aujourd'hui reflète une passion profonde pour mon domaine et une volonté constante de me dépasser. Dès mes premières années d'études, j'ai su que cette voie était la mienne.\n\nMes expériences académiques et personnelles m'ont forgé une vision rigoureuse et innovante des enjeux actuels. J'ai saisi chaque opportunité pour approfondir mes connaissances et développer des compétences transversales.\n\nIntégrer votre programme représente pour moi l'étape naturelle et ambitieuse vers l'accomplissement de mes objectifs professionnels.`
      : `The path I present to you today reflects a deep passion for my field and an unwavering drive to challenge myself and grow. From the earliest stages of my education, I knew this discipline was where I belonged.\n\nMy academic and personal experiences have shaped a rigorous, forward-thinking perspective on the challenges of my discipline. I have embraced every opportunity to deepen my knowledge and develop transferable skills.\n\nJoining your programme represents the natural and ambitious next step toward realising my professional goals.`,

    research_proposal: language === 'fr'
      ? `**Résumé**\nCette proposition de recherche porte sur [sujet de recherche], un domaine d'importance croissante. L'objectif est d'analyser [question de recherche] afin de contribuer à une meilleure compréhension de [problématique].\n\n**Contexte et problématique**\nLes travaux existants ont mis en évidence [état de l'art]. Cependant, des lacunes importantes subsistent concernant [gap de recherche].\n\n**Méthodologie**\nNous proposons une approche [qualitative/quantitative/mixte] s'appuyant sur [méthodes]. Les données seront collectées auprès de [sources] sur une période de [durée].`
      : `**Abstract**\nThis research proposal addresses [research topic], an area of growing importance. The study aims to investigate [research question] in order to contribute to a deeper understanding of [problem area].\n\n**Background**\nExisting scholarship in this field has highlighted [state of the art]. However, significant gaps remain with respect to [research gap].\n\n**Methodology**\nWe propose a [qualitative/quantitative/mixed] approach drawing on [methods]. Data will be gathered from [sources] over a period of [duration].`,

    expression_of_interest: language === 'fr'
      ? `Je vous adresse cette lettre pour exprimer mon vif intérêt pour ${role}${org}. Ma trajectoire professionnelle et ma vision stratégique s'inscrivent pleinement dans les orientations de votre organisation.\n\nFort(e) d'une expérience significative dans mon domaine, j'ai développé des compétences en leadership, en gestion de projets complexes et en mobilisation des parties prenantes.\n\nJe serais honoré(e) de discuter plus avant de la manière dont mon profil peut répondre aux ambitions de votre structure.`
      : `I am writing to express my keen interest in ${role}${org}. My professional trajectory and strategic vision align strongly with the direction and mission of your organisation.\n\nWith significant experience in my field, I have developed expertise in leadership, complex project management, and stakeholder engagement — capabilities that position me to make an immediate and lasting contribution.\n\nI would be honoured to discuss further how my profile aligns with the aspirations of your organisation.`,

    writing_sample: language === 'fr'
      ? `[Titre de l'article]\n\nL'enjeu qui retient notre attention est celui de [sujet]. Dans un contexte marqué par [contexte], il convient d'en analyser les dimensions essentielles avec rigueur et nuance.\n\nDans un premier temps, nous examinerons [premier axe]. Ensuite, nous aborderons [deuxième axe], avant de proposer [conclusion ou perspective].\n\nCette réflexion s'appuie sur des sources vérifiées et une analyse critique des données disponibles.`
      : `[Title of Article]\n\nThe issue under consideration here is [subject]. Against a backdrop of [context], it is important to analyse its essential dimensions with rigour and nuance.\n\nFirst, we will examine [first theme]. We will then address [second theme], before proposing [conclusion or perspective].\n\nThis analysis draws on verified sources and a critical examination of available evidence.`,
  }

  return bodies[documentType] ?? ''
}

export function FormalLetterTemplate({ state, scale = 1 }: FormalLetterProps) {
  const profile = getProfileSnapshot()
  const { context, generatedContent, documentType } = state
  const personal = profile.personal
  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)

  const isRecommendation = documentType === 'recommendation_letter'
  const body = generatedContent['letter-body'] ?? getDefaultBody(documentType, context)
  const today = new Date().toLocaleDateString(context.language === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const salutation = context.language === 'fr' ? 'Madame, Monsieur,' : 'Dear Hiring Manager,'
  const closing = context.language === 'fr'
    ? "Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées."
    : 'Yours sincerely,'
  const subjectPrefix = LETTER_SUBJECT_PREFIX[documentType] ?? 'Re:'

  const s = {
    page: {
      fontFamily: fonts.body,
      fontSize: '10.5pt',
      lineHeight: '1.65',
      color: '#1a1a1a',
      background: '#ffffff',
      padding: '52px 60px',
      minHeight: '297mm',
      width: '210mm',
      boxSizing: 'border-box' as const,
    },
    accentBar: { height: '3px', background: accent, marginBottom: '24px', borderRadius: '2px' },
    senderName: { fontFamily: fonts.heading, fontSize: '17pt', fontWeight: '700', margin: '0 0 3px', color: '#111' },
    senderTitle: { fontSize: '9.5pt', color: accent, fontWeight: '600', margin: '0 0 6px' },
    senderContact: {
      fontSize: '8pt', color: '#777',
      display: 'flex' as const, flexWrap: 'wrap' as const, gap: '3px 12px',
    },
    typeLabel: {
      textAlign: 'right' as const, fontSize: '7.5pt', color: '#aaa',
      fontFamily: fonts.heading, letterSpacing: '0.8px', textTransform: 'uppercase' as const,
    },
    divider: { borderTop: '1px solid #e8e8e8', margin: '16px 0' },
    date: { fontSize: '9.5pt', color: '#555', marginBottom: '18px' },
    recipient: { fontSize: '9.5pt', color: '#444', marginBottom: '20px', lineHeight: '1.5' },
    subject: {
      fontSize: '10pt', fontWeight: '700', color: '#111',
      marginBottom: '18px', paddingBottom: '8px',
      borderBottom: `1px solid ${accent}33`,
    },
    salutation: { fontSize: '10.5pt', fontWeight: '600', marginBottom: '16px', color: '#111' },
    paragraph: {
      fontSize: '10pt', lineHeight: '1.65', marginBottom: '14px',
      color: '#222', textAlign: 'justify' as const,
    },
    sectionHead: { fontSize: '10pt', fontWeight: '700', marginBottom: '8px', marginTop: '14px', color: '#111' },
    draftNote: {
      fontSize: '8pt', color: '#92400e', background: '#fef3c7',
      border: '1px solid #fde68a', borderRadius: '6px',
      padding: '8px 12px', marginBottom: '18px',
    },
    signatureName: {
      fontFamily: fonts.heading, fontWeight: '700', fontSize: '12pt',
      marginTop: '28px', color: '#111',
    },
    signatureDetail: { fontSize: '8.5pt', color: '#888', margin: '2px 0 0' },
  }

  const renderBody = () =>
    body.split('\n\n').map((para, i) => {
      if (para.startsWith('**') && para.endsWith('**')) {
        return <p key={i} style={s.sectionHead}>{para.replace(/\*\*/g, '')}</p>
      }
      if (para.startsWith('**')) {
        const boldEnd = para.indexOf('**', 2)
        const heading = para.slice(2, boldEnd)
        const rest = para.slice(boldEnd + 2).trim()
        return (
          <div key={i} style={{ marginBottom: '14px' }}>
            <p style={{ ...s.sectionHead, display: 'inline' }}>{heading}</p>
            {rest && <p style={{ ...s.paragraph, marginBottom: '0', marginTop: '4px' }}>{rest}</p>}
          </div>
        )
      }
      return <p key={i} style={s.paragraph}>{para}</p>
    })

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div style={s.page} id="formal-letter-template">

        {/* Accent bar */}
        <div style={s.accentBar} />

        {/* Letterhead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            {personal ? (
              <>
                <p style={s.senderName}>{personal.firstName} {personal.lastName}</p>
                {personal.professionalTitle && <p style={s.senderTitle}>{personal.professionalTitle}</p>}
                <div style={s.senderContact}>
                  {personal.phone && <span>{personal.phone}</span>}
                  {personal.city && <span>{personal.city}{personal.country ? `, ${personal.country}` : ''}</span>}
                  {personal.linkedinUrl && <span>{personal.linkedinUrl.replace('https://', '')}</span>}
                </div>
              </>
            ) : (
              <p style={s.senderName}>Your Name</p>
            )}
          </div>
          <p style={s.typeLabel}>{LETTER_TYPE_LABELS[documentType] ?? 'Formal Letter'}</p>
        </div>

        <div style={s.divider} />

        {/* Date */}
        <p style={s.date}>{today}</p>

        {/* Recipient block */}
        {(context.companyName || context.targetCountry) && (
          <div style={s.recipient}>
            {context.companyName && <div style={{ fontWeight: '600' }}>{context.companyName}</div>}
            {context.targetCountry && <div>{context.targetCountry}</div>}
          </div>
        )}

        {/* Subject line */}
        {context.jobTitle && (
          <p style={s.subject}>
            {subjectPrefix} {context.jobTitle}{context.companyName ? ` — ${context.companyName}` : ''}
          </p>
        )}

        {/* Recommendation letter draft banner */}
        {isRecommendation && (
          <div style={s.draftNote}>
            {context.language === 'fr'
              ? "Ceci est un brouillon généré par IA. Veuillez le partager avec votre référent pour qu'il le personnalise et le signe avant soumission."
              : 'This is an AI-generated draft. Please share it with your recommender to personalise and sign before submission.'}
          </div>
        )}

        {/* Salutation */}
        <p style={s.salutation}>{salutation}</p>

        {/* Body */}
        {renderBody()}

        {/* Closing */}
        <div style={{ marginTop: '28px' }}>
          <p style={{ ...s.paragraph, marginBottom: '0' }}>{closing}</p>
        </div>

        {/* Signature block */}
        <div style={{ marginTop: '40px' }}>
          {isRecommendation ? (
            <>
              <p style={{ ...s.signatureDetail, marginTop: '0' }}>
                {context.language === 'fr' ? '[Signature du référent]' : '[Recommender signature]'}
              </p>
              <p style={s.signatureName}>
                {context.language === 'fr' ? '[Nom du référent]' : '[Recommender Name]'}
              </p>
              <p style={s.signatureDetail}>
                {context.language === 'fr' ? '[Titre — Institution]' : '[Title — Institution]'}
              </p>
            </>
          ) : (
            personal && (
              <p style={s.signatureName}>{personal.firstName} {personal.lastName}</p>
            )
          )}
        </div>

      </div>
    </div>
  )
}
