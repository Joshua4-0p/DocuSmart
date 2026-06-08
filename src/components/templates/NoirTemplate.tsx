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

function NoirInner({ state, scale = 1 }: Props) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state

  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')

  const p = profile.personal
  const isIncluded = (k: string) => selectedSections.includes(k)
  const summary = generatedContent['summary'] ?? p?.summary ?? ''
  const orderedSections = sectionOrder.filter(k => isIncluded(k) && k !== 'personal' && k !== 'summary')

  const sectionHead: React.CSSProperties = {
    fontFamily: fonts.heading,
    fontSize: '8pt',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    color: accent,
    marginBottom: `${Math.round(10 * sp)}px`,
    marginTop: `${Math.round(22 * sp)}px`,
    paddingLeft: '12px',
    borderLeft: `3px solid ${accent}`,
  }

  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10.5pt', fontWeight: '600', margin: '0 0 1px', color: '#ffffff' }
  const entryMeta: React.CSSProperties = { fontSize: '9pt', color: '#aaa', margin: '0 0 4px' }
  const entryDate: React.CSSProperties = { fontSize: '8pt', color: '#888', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '16px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#ccc', marginBottom: '3px', lineHeight: '1.45' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#bbb', lineHeight: '1.6', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="noir-template" style={{ fontFamily: fonts.body, background: '#0f0f0f', color: '#e0e0e0', minHeight: '297mm', width: '210mm', boxSizing: 'border-box', padding: `${Math.round(40 * sp)}px ${Math.round(48 * sp)}px` }}>
        {/* Header */}
        <div style={{ marginBottom: `${Math.round(24 * sp)}px` }}>
          <p style={{ fontFamily: fonts.heading, fontSize: '26pt', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px', margin: '0 0 4px', lineHeight: '1.05' }}>
            {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
          </p>
          {p?.professionalTitle && (
            <p style={{ fontSize: '11pt', color: accent, fontWeight: '500', margin: '0 0 12px', fontFamily: fonts.heading, letterSpacing: '0.5px' }}>{p.professionalTitle}</p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '8pt', color: '#888', marginTop: '8px' }}>
            {p?.phone && <span>{p.phone}</span>}
            {p?.city && <span>{p.city}{p.country ? `, ${p.country}` : ''}</span>}
            {p?.linkedinUrl && <span>{p.linkedinUrl.replace('https://', '')}</span>}
            {p?.websiteUrl && <span>{p.websiteUrl.replace('https://', '')}</span>}
            {p?.githubUrl && <span>{p.githubUrl.replace('https://github.com/', 'github.com/')}</span>}
          </div>
          {/* Accent separator */}
          <div style={{ height: '1px', background: `linear-gradient(to right, ${accent}, transparent)`, marginTop: '16px' }} />
        </div>

        {/* Summary */}
        {isIncluded('summary') && summary && (
          <div>
            <div style={sectionHead}>{labels.summary}</div>
            <p style={para}>{summary}</p>
          </div>
        )}

        {orderedSections.map((key) => {
          switch (key) {
            case 'experience':
              return profile.experience.length > 0 ? (
                <div key="experience">
                  <div style={sectionHead}>{labels.experience}</div>
                  {profile.experience.map((exp) => {
                    const bullets = generatedContent[`exp-${exp.id}`]
                      ? generatedContent[`exp-${exp.id}`].split('\n').filter(Boolean)
                      : exp.description ? exp.description.split('\n').filter(Boolean) : exp.achievements
                    return (
                      <div key={exp.id} style={{ marginBottom: `${Math.round(14 * sp)}px` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={entryTitle}>{exp.jobTitle}</p>
                            <p style={entryMeta}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
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
                </div>
              ) : null

            case 'education':
              return profile.education.length > 0 ? (
                <div key="education">
                  <div style={sectionHead}>{labels.education}</div>
                  {profile.education.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <p style={entryTitle}>{edu.degreeType.toUpperCase()} in {edu.fieldOfStudy}</p>
                          <p style={entryMeta}>{edu.institution}{edu.city ? `, ${edu.city}` : ''}</p>
                        </div>
                        <span style={entryDate}>{fmt(edu.startDate)} – {edu.ongoing ? 'Present' : fmt(edu.endDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null

            case 'skills':
              return profile.skills.length > 0 ? (
                <div key="skills">
                  <div style={sectionHead}>{labels.skills}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {profile.skills.map((sk) => (
                      <span key={sk.id} style={{ display: 'inline-block', border: `1px solid ${accent}66`, color: '#ddd', padding: '2px 10px', fontSize: '8.5pt', borderRadius: '2px' }}>
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null

            case 'certifications':
              return profile.certifications.length > 0 ? (
                <div key="certifications">
                  <div style={sectionHead}>{labels.certifications}</div>
                  {profile.certifications.map((c) => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <p style={{ ...para, color: '#ddd', margin: 0, fontWeight: '500' }}>{c.name} — <span style={{ color: '#888' }}>{c.issuingOrg}</span></p>
                      <span style={entryDate}>{fmt(c.dateIssued)}</span>
                    </div>
                  ))}
                </div>
              ) : null

            case 'languages':
              return profile.languages.length > 0 ? (
                <div key="languages">
                  <div style={sectionHead}>{labels.languages}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                    {profile.languages.map((lang) => (
                      <span key={lang.id} style={{ fontSize: '9pt', color: '#ccc' }}>{lang.language} <span style={{ color: '#777' }}>/ {lang.level}</span></span>
                    ))}
                  </div>
                </div>
              ) : null

            case 'projects':
              return profile.projects.length > 0 ? (
                <div key="projects">
                  <div style={sectionHead}>{labels.projects}</div>
                  {profile.projects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={entryTitle}>{proj.name}</p>
                        {proj.startDate && <span style={entryDate}>{fmt(proj.startDate)}</span>}
                      </div>
                      {proj.technologies.length > 0 && <p style={{ fontSize: '8pt', color: '#777', margin: '0 0 3px' }}>{proj.technologies.join(' · ')}</p>}
                      {proj.description && <p style={para}>{proj.description}</p>}
                    </div>
                  ))}
                </div>
              ) : null

            case 'references': {
              if (!profile.references.length) return null
              return (
                <div key="references">
                  <div style={sectionHead}>{labels.references}</div>
                  {generatedContent['references-mode'] !== 'on-request' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                      {profile.references.map((ref) => (
                        <div key={ref.id} style={{ marginBottom: '8px' }}>
                          <p style={entryTitle}>{ref.name}</p>
                          <p style={entryMeta}>{ref.jobTitle} · {ref.company}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={para}>References available upon request.</p>
                  )}
                </div>
              )
            }

            default: return null
          }
        })}
      </div>
    </div>
  )
}

export const NoirTemplate = React.memo(NoirInner)
