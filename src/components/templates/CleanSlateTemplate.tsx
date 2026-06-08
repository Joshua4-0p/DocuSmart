import * as React from 'react'
import type { BuilderState } from '../../types/document'
import { getProfileSnapshot } from '../../lib/api/profile.api'
import {
  resolveAccentColor,
  resolveFontPairing,
  resolveSpacingMultiplier,
  getSectionLabels,
} from '../../lib/templates/templateSettings'

interface Props { state: BuilderState; scale?: number }

function fmt(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function CleanSlateInner({ state, scale = 1 }: Props) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state

  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')

  const p = profile.personal
  const isIncluded = (k: string) => selectedSections.includes(k)
  const orderedSections = sectionOrder.filter(k => isIncluded(k) && k !== 'personal' && k !== 'summary')
  const summary = generatedContent['summary'] ?? p?.summary ?? ''

  const page: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '10pt',
    lineHeight: '1.5',
    color: '#1a1a1a',
    background: '#ffffff',
    padding: `${Math.round(44 * sp)}px ${Math.round(52 * sp)}px`,
    minHeight: '297mm',
    width: '210mm',
    boxSizing: 'border-box',
  }

  const sectionHead: React.CSSProperties = {
    fontFamily: fonts.heading,
    fontSize: '8pt',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#1a1a1a',
    borderBottom: '1px solid #d0d0d0',
    paddingBottom: '3px',
    marginBottom: `${Math.round(10 * sp)}px`,
    marginTop: `${Math.round(20 * sp)}px`,
  }

  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px' }
  const entryMeta: React.CSSProperties = { fontSize: '9pt', color: '#555', margin: '0 0 3px' }
  const entryDate: React.CSSProperties = { fontSize: '8.5pt', color: '#888', whiteSpace: 'nowrap' }
  const bullet: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: `${Math.round(2 * sp)}px`, lineHeight: '1.4' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#333', lineHeight: '1.5', margin: '0' }

  const SectionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <div style={sectionHead}>{title}</div>
      {children}
    </div>
  )

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div style={page} id="clean-slate-template" data-ats-safe="true">
        {/* Header */}
        <div style={{ marginBottom: `${Math.round(4 * sp)}px` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <p style={{ fontFamily: fonts.heading, fontSize: '18pt', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0' }}>
              {p ? `${p.firstName} ${p.lastName}` : 'YOUR NAME'}
            </p>
            <div style={{ textAlign: 'right', fontSize: '8.5pt', color: '#555', lineHeight: '1.6' }}>
              {p?.phone && <div>{p.phone}</div>}
              {p?.city && <div>{p.city}{p.country ? `, ${p.country}` : ''}</div>}
              {p?.linkedinUrl && <div>{p.linkedinUrl.replace('https://', '')}</div>}
            </div>
          </div>
          {p?.professionalTitle && (
            <p style={{ fontFamily: fonts.heading, fontSize: '10pt', color: '#555', margin: '2px 0 6px' }}>{p.professionalTitle}</p>
          )}
          {/* Full-width accent rule */}
          <div style={{ height: '2px', background: accent, marginTop: '8px' }} />
        </div>

        {/* Summary */}
        {isIncluded('summary') && summary && (
          <SectionBlock title={labels.summary}>
            <p style={para}>{summary}</p>
          </SectionBlock>
        )}

        {orderedSections.map((key) => {
          switch (key) {
            case 'experience':
              return profile.experience.length > 0 ? (
                <SectionBlock key="experience" title={labels.experience}>
                  {profile.experience.map((exp) => {
                    const bullets = generatedContent[`exp-${exp.id}`]
                      ? generatedContent[`exp-${exp.id}`].split('\n').filter(Boolean)
                      : exp.description ? exp.description.split('\n').filter(Boolean) : exp.achievements
                    return (
                      <div key={exp.id} style={{ marginBottom: `${Math.round(12 * sp)}px` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={entryTitle}>{exp.company}</p>
                            <p style={{ ...entryMeta, fontStyle: 'italic' }}>{exp.jobTitle}</p>
                          </div>
                          <span style={entryDate}>{fmt(exp.startDate)} – {exp.ongoing ? 'Present' : fmt(exp.endDate)}</span>
                        </div>
                        {bullets.length > 0 && (
                          <ul style={bullet}>
                            {bullets.map((b, i) => <li key={i} style={bulletItem}>{b.replace(/^[•\-]\s*/, '')}</li>)}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </SectionBlock>
              ) : null

            case 'education':
              return profile.education.length > 0 ? (
                <SectionBlock key="education" title={labels.education}>
                  {profile.education.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <p style={entryTitle}>{edu.institution}</p>
                          <p style={entryMeta}>{edu.degreeType.toUpperCase()} in {edu.fieldOfStudy}{edu.gpa && edu.showGpa ? ` · ${edu.gpa}` : ''}</p>
                        </div>
                        <span style={entryDate}>{fmt(edu.startDate)} – {edu.ongoing ? 'Present' : fmt(edu.endDate)}</span>
                      </div>
                    </div>
                  ))}
                </SectionBlock>
              ) : null

            case 'skills':
              return profile.skills.length > 0 ? (
                <SectionBlock key="skills" title={labels.skills}>
                  <p style={para}>{profile.skills.map(s => s.name).join('  ·  ')}</p>
                </SectionBlock>
              ) : null

            case 'certifications':
              return profile.certifications.length > 0 ? (
                <SectionBlock key="certifications" title={labels.certifications}>
                  {profile.certifications.map((c) => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <p style={{ ...para, margin: 0 }}>{c.name} — {c.issuingOrg}</p>
                      <span style={entryDate}>{fmt(c.dateIssued)}</span>
                    </div>
                  ))}
                </SectionBlock>
              ) : null

            case 'languages':
              return profile.languages.length > 0 ? (
                <SectionBlock key="languages" title={labels.languages}>
                  <p style={para}>{profile.languages.map(l => `${l.language} (${l.level})`).join('  ·  ')}</p>
                </SectionBlock>
              ) : null

            case 'projects':
              return profile.projects.length > 0 ? (
                <SectionBlock key="projects" title={labels.projects}>
                  {profile.projects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: `${Math.round(8 * sp)}px` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={entryTitle}>{proj.name}</p>
                        {proj.startDate && <span style={entryDate}>{fmt(proj.startDate)}</span>}
                      </div>
                      {proj.description && <p style={para}>{proj.description}</p>}
                    </div>
                  ))}
                </SectionBlock>
              ) : null

            case 'references': {
              if (!profile.references.length) return null
              return (
                <SectionBlock key="references" title={labels.references}>
                  {generatedContent['references-mode'] !== 'on-request' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                      {profile.references.map((ref) => (
                        <div key={ref.id} style={{ marginBottom: '6px' }}>
                          <p style={entryTitle}>{ref.name}</p>
                          <p style={entryMeta}>{ref.jobTitle} · {ref.company}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={para}>References available upon request.</p>
                  )}
                </SectionBlock>
              )
            }

            default: return null
          }
        })}
      </div>
    </div>
  )
}

export const CleanSlateTemplate = React.memo(CleanSlateInner)
