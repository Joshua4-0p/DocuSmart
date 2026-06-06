import * as React from 'react'
import type { BuilderState } from '../../types/document'
import { getProfileSnapshot } from '../../lib/api/profile.api'

interface CoverLetterProps {
  state: BuilderState
  scale?: number
}

const s = {
  page: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '10.5pt',
    lineHeight: '1.6',
    color: '#1a1a1a',
    background: '#ffffff',
    padding: '52px 56px',
    minHeight: '297mm',
    width: '210mm',
    boxSizing: 'border-box' as const,
  },
  header: {
    borderBottom: '2px solid #378ADD',
    paddingBottom: '16px',
    marginBottom: '32px',
  },
  name: {
    fontSize: '18pt',
    fontWeight: '700',
    margin: '0 0 3px',
    color: '#1a1a1a',
  },
  titleLine: {
    fontSize: '10pt',
    color: '#378ADD',
    fontWeight: '600',
    margin: '0 0 8px',
  },
  contact: {
    fontSize: '8.5pt',
    color: '#666',
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '4px 14px',
  },
  date: {
    fontSize: '9.5pt',
    color: '#555',
    marginBottom: '20px',
  },
  salutation: {
    fontSize: '10.5pt',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1a1a1a',
  },
  paragraph: {
    fontSize: '10pt',
    lineHeight: '1.6',
    marginBottom: '14px',
    color: '#222',
    textAlign: 'justify' as const,
  },
  closing: {
    marginTop: '28px',
    fontSize: '10.5pt',
  },
  signature: {
    fontWeight: '700',
    fontSize: '11pt',
    marginTop: '32px',
    color: '#1a1a1a',
  },
}

export function CoverLetterTemplate({ state, scale = 1 }: CoverLetterProps) {
  const profile = getProfileSnapshot()
  const { context, generatedContent } = state
  const personal = profile.personal

  const body = generatedContent['cover-letter-body']
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const defaultBody = context.language === 'fr'
    ? `Je vous écris pour exprimer mon vif intérêt pour le poste de ${context.jobTitle}${context.companyName ? ` au sein de ${context.companyName}` : ''}. Fort(e) d'une solide expérience professionnelle et d'une passion pour l'excellence, je suis convaincu(e) de pouvoir apporter une contribution significative à votre organisation.\n\nMon parcours m'a permis de développer des compétences clés en gestion de projets, communication et résolution de problèmes complexes. J'ai notamment eu l'occasion de diriger des équipes pluridisciplinaires et de mettre en œuvre des initiatives stratégiques avec des résultats mesurables.\n\nJe serais ravi(e) de vous rencontrer pour discuter de la manière dont mon profil peut répondre à vos besoins. Je reste disponible pour tout entretien à votre convenance.`
    : `I am writing to express my strong interest in the ${context.jobTitle} position${context.companyName ? ` at ${context.companyName}` : ''}. With a proven track record of delivering results and a passion for excellence, I am confident in my ability to make a meaningful contribution to your organisation.\n\nThroughout my career, I have developed strong capabilities in project management, cross-functional collaboration, and strategic thinking. I have consistently exceeded performance targets and delivered measurable impact in fast-paced environments.\n\nI would welcome the opportunity to discuss how my background aligns with your needs. I am available for an interview at your earliest convenience and look forward to hearing from you.`

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: scale !== 1 ? `${100 / scale}%` : undefined,
      }}
    >
      <div style={s.page} id="cover-letter-template">
        {/* Sender info */}
        <div style={s.header}>
          {personal ? (
            <>
              <p style={s.name}>{personal.firstName} {personal.lastName}</p>
              {personal.professionalTitle && (
                <p style={s.titleLine}>{personal.professionalTitle}</p>
              )}
              <div style={s.contact}>
                {personal.phone && <span>{personal.phone}</span>}
                {personal.city && <span>{personal.city}{personal.country ? `, ${personal.country}` : ''}</span>}
                {personal.linkedinUrl && (
                  <span>{personal.linkedinUrl.replace('https://', '')}</span>
                )}
              </div>
            </>
          ) : (
            <p style={s.name}>Your Name</p>
          )}
        </div>

        {/* Date */}
        <p style={s.date}>{today}</p>

        {/* Recipient */}
        {context.companyName && (
          <div style={{ marginBottom: '20px', fontSize: '9.5pt', color: '#555' }}>
            <div>{context.companyName}</div>
            {context.targetCountry && <div>{context.targetCountry}</div>}
          </div>
        )}

        {/* Salutation */}
        <p style={s.salutation}>
          {context.language === 'fr' ? 'Madame, Monsieur,' : 'Dear Hiring Manager,'}
        </p>

        {/* Body */}
        {(body ?? defaultBody).split('\n\n').map((para, i) => (
          <p key={i} style={s.paragraph}>{para}</p>
        ))}

        {/* Closing */}
        <div style={s.closing}>
          <p style={{ ...s.paragraph, marginBottom: '4px' }}>
            {context.language === 'fr' ? "Veuillez agréer, Madame, Monsieur, l’expression de mes salutations distinguées." : 'Yours sincerely,'}
          </p>
          {personal && (
            <p style={s.signature}>
              {personal.firstName} {personal.lastName}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
