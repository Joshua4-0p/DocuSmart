import * as React from 'react'
import type { BuilderState } from '../../types/document'
import { getProfileSnapshot } from '../../lib/api/profile.api'
import {
  resolveAccentColor,
  resolveFontPairing,
  resolveSpacingMultiplier,
  getSectionLabels,
  hexWithAlpha,
} from '../../lib/templates/templateSettings'

interface HorizonProps {
  state: BuilderState
  scale?: number
}

function fmt(date?: string): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: '8.5pt',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        color: accent,
        borderBottom: `1px solid ${hexWithAlpha(accent, 0.25)}`,
        paddingBottom: '3px',
        marginBottom: '10px',
        marginTop: '18px',
      }}>{title}</div>
      {children}
    </div>
  )
}

function HorizonTemplateInner({ state, scale = 1 }: HorizonProps) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state

  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')

  const personal = profile.personal
  const isIncluded = (key: string) => selectedSections.includes(key)

  const orderedSections = sectionOrder.filter(
    (s) => isIncluded(s) && s !== 'personal' && s !== 'summary',
  )

  const totalExpYears = profile.experience.reduce((acc, exp) => {
    const start = exp.startDate ? new Date(exp.startDate).getFullYear() : 0
    const end = exp.endDate ? new Date(exp.endDate).getFullYear() : new Date().getFullYear()
    return acc + (end - start)
  }, 0)
  const isGraduate = totalExpYears < 3

  const sortedSections = isGraduate
    ? orderedSections.sort((a, b) => {
        if (a === 'education' && b === 'experience') return -1
        if (a === 'experience' && b === 'education') return 1
        return 0
      })
    : orderedSections

  const summary = generatedContent['summary'] ?? personal?.summary ?? ''

  const page: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '10pt',
    lineHeight: '1.45',
    color: '#1a1a1a',
    background: '#ffffff',
    padding: `${Math.round(40 * sp)}px ${Math.round(48 * sp)}px`,
    minHeight: '297mm',
    width: '210mm',
    boxSizing: 'border-box',
  }

  const entryHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  }
  const entryTitle: React.CSSProperties = { fontSize: '10pt', fontWeight: '600', color: '#1a1a1a', margin: '0 0 1px', fontFamily: fonts.heading }
  const entrySubtitle: React.CSSProperties = { fontSize: '9pt', color: '#555', margin: '0 0 4px' }
  const entryDate: React.CSSProperties = { fontSize: '8.5pt', color: '#888', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: `${Math.round(2 * sp)}px`, lineHeight: '1.4' }
  const paragraph: React.CSSProperties = { fontSize: '9pt', color: '#333', lineHeight: '1.5', margin: '0' }
  const skillChip: React.CSSProperties = {
    display: 'inline-block',
    background: hexWithAlpha(accent, 0.08),
    border: `1px solid ${hexWithAlpha(accent, 0.25)}`,
    borderRadius: '3px',
    padding: '1px 7px',
    fontSize: '8.5pt',
    color: accent,
    margin: '2px 3px 2px 0',
  }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div style={page} id="horizon-template" data-ats-safe="true">
        {/* Header */}
        <div style={{ marginBottom: `${Math.round(20 * sp)}px`, paddingBottom: '16px', borderBottom: `2.5px solid ${accent}` }}>
          {personal ? (
            <>
              <p style={{ fontSize: '22pt', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-0.3px', margin: '0 0 3px', fontFamily: fonts.heading }}>
                {personal.firstName} {personal.lastName}
              </p>
              {personal.professionalTitle && (
                <p style={{ fontSize: '11pt', color: accent, fontWeight: '600', margin: '0 0 10px', fontFamily: fonts.heading }}>
                  {personal.professionalTitle}
                </p>
              )}
            </>
          ) : (
            <>
              <p style={{ fontSize: '22pt', fontWeight: '700', fontFamily: fonts.heading, margin: '0 0 3px' }}>Your Name</p>
              <p style={{ fontSize: '11pt', color: accent, fontWeight: '600', margin: '0 0 10px' }}>Professional Title</p>
            </>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '8.5pt', color: '#555' }}>
            {personal?.phone && <span>{personal.phone}</span>}
            {personal?.city && <span>{personal.city}{personal.country ? `, ${personal.country}` : ''}</span>}
            {personal?.linkedinUrl && <span>{personal.linkedinUrl.replace('https://', '')}</span>}
            {personal?.websiteUrl && <span>{personal.websiteUrl.replace('https://', '')}</span>}
            {personal?.githubUrl && <span>{personal.githubUrl.replace('https://github.com/', 'github.com/')}</span>}
          </div>
        </div>

        {/* Summary */}
        {isIncluded('summary') && summary && (
          <Section title={labels.summary} accent={accent}>
            <p style={paragraph}>{summary}</p>
          </Section>
        )}

        {/* Dynamic sections */}
        {sortedSections.map((sectionKey) => {
          switch (sectionKey) {
            case 'experience':
              return profile.experience.length > 0 ? (
                <Section key="experience" title={labels.experience} accent={accent}>
                  {profile.experience.map((exp) => {
                    const bullets = generatedContent[`exp-${exp.id}`]
                      ? generatedContent[`exp-${exp.id}`].split('\n').filter(Boolean)
                      : exp.description ? exp.description.split('\n').filter(Boolean) : exp.achievements
                    return (
                      <div key={exp.id} style={{ marginBottom: `${Math.round(12 * sp)}px` }}>
                        <div style={entryHeaderStyle}>
                          <div>
                            <p style={entryTitle}>{exp.jobTitle}</p>
                            <p style={entrySubtitle}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                          </div>
                          <span style={entryDate}>{fmt(exp.startDate)} – {exp.ongoing ? 'Present' : fmt(exp.endDate)}</span>
                        </div>
                        {bullets.length > 0 && (
                          <ul style={bulletList}>
                            {bullets.map((b, i) => <li key={i} style={bulletItem}>{b.replace(/^[•\-]\s*/, '')}</li>)}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </Section>
              ) : null

            case 'education':
              return profile.education.length > 0 ? (
                <Section key="education" title={labels.education} accent={accent}>
                  {profile.education.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                      <div style={entryHeaderStyle}>
                        <div>
                          <p style={entryTitle}>{edu.degreeType.toUpperCase()} in {edu.fieldOfStudy}</p>
                          <p style={entrySubtitle}>{edu.institution}{edu.city ? `, ${edu.city}` : ''}</p>
                        </div>
                        <span style={entryDate}>{fmt(edu.startDate)} – {edu.ongoing ? 'Present' : fmt(edu.endDate)}</span>
                      </div>
                      {edu.showGpa && edu.gpa && <p style={{ ...entrySubtitle, fontSize: '8.5pt' }}>GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </Section>
              ) : null

            case 'skills': {
              if (!profile.skills.length) return null
              return (
                <Section key="skills" title={labels.skills} accent={accent}>
                  <div>
                    {profile.skills.map((sk) => (
                      <span key={sk.id} style={skillChip}>{sk.name}</span>
                    ))}
                  </div>
                </Section>
              )
            }

            case 'projects':
              return profile.projects.length > 0 ? (
                <Section key="projects" title={labels.projects} accent={accent}>
                  {profile.projects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                      <div style={entryHeaderStyle}>
                        <div>
                          <p style={entryTitle}>{proj.name}</p>
                          {proj.technologies.length > 0 && <p style={{ ...entrySubtitle, fontSize: '8.5pt' }}>{proj.technologies.join(', ')}</p>}
                        </div>
                        {proj.startDate && <span style={entryDate}>{fmt(proj.startDate)}</span>}
                      </div>
                      {proj.description && <p style={paragraph}>{proj.description}</p>}
                    </div>
                  ))}
                </Section>
              ) : null

            case 'certifications':
              return profile.certifications.length > 0 ? (
                <Section key="certifications" title={labels.certifications} accent={accent}>
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} style={{ marginBottom: '6px' }}>
                      <div style={entryHeaderStyle}>
                        <div>
                          <p style={entryTitle}>{cert.name}</p>
                          <p style={entrySubtitle}>{cert.issuingOrg}</p>
                        </div>
                        <span style={entryDate}>{fmt(cert.dateIssued)}</span>
                      </div>
                    </div>
                  ))}
                </Section>
              ) : null

            case 'languages':
              return profile.languages.length > 0 ? (
                <Section key="languages" title={labels.languages} accent={accent}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                    {profile.languages.map((lang) => (
                      <div key={lang.id} style={{ marginBottom: '4px' }}>
                        <span style={{ fontWeight: '600', fontSize: '9pt' }}>{lang.language}</span>
                        <span style={{ ...entryDate, marginLeft: '6px' }}>{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null

            case 'references': {
              if (!profile.references.length) return null
              const showFull = generatedContent['references-mode'] !== 'on-request'
              return (
                <Section key="references" title={labels.references} accent={accent}>
                  {showFull ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                      {profile.references.map((ref) => (
                        <div key={ref.id} style={{ marginBottom: '8px' }}>
                          <p style={entryTitle}>{ref.name}</p>
                          <p style={entrySubtitle}>{ref.jobTitle} · {ref.company}</p>
                          <p style={{ ...paragraph, color: '#888' }}>{ref.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={paragraph}>References available upon request.</p>
                  )}
                </Section>
              )
            }

            default: return null
          }
        })}
      </div>
    </div>
  )
}

export const HorizonTemplate = React.memo(HorizonTemplateInner)
