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

interface Props { state: BuilderState; scale?: number }

function fmt(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function MosaicInner({ state, scale = 1 }: Props) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state

  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')

  const p = profile.personal
  const isIncluded = (k: string) => selectedSections.includes(k)
  const summary = generatedContent['summary'] ?? p?.summary ?? ''
  const sidebarSections = sectionOrder.filter(k => isIncluded(k) && ['skills', 'languages', 'certifications'].includes(k))
  const mainSections = sectionOrder.filter(k => isIncluded(k) && !['personal', 'skills', 'languages', 'certifications', 'summary'].includes(k))

  const mainHead: React.CSSProperties = {
    fontFamily: fonts.heading,
    fontSize: '8pt',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#1a1a1a',
    paddingBottom: '3px',
    borderBottom: `2px solid ${accent}`,
    marginBottom: `${Math.round(8 * sp)}px`,
    marginTop: `${Math.round(16 * sp)}px`,
  }

  const sideHead: React.CSSProperties = {
    fontFamily: fonts.heading,
    fontSize: '7.5pt',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#ffffff',
    opacity: 0.75,
    paddingBottom: '3px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    marginBottom: `${Math.round(8 * sp)}px`,
    marginTop: `${Math.round(14 * sp)}px`,
  }

  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: '#1a1a1a' }
  const entryMeta: React.CSSProperties = { fontSize: '9pt', color: '#555', margin: '0 0 3px' }
  const entryDate: React.CSSProperties = { fontSize: '8pt', color: '#888', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: '2px', lineHeight: '1.4' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#333', lineHeight: '1.5', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="mosaic-template" style={{ fontFamily: fonts.body, display: 'flex', flexDirection: 'column', minHeight: '297mm', width: '210mm', boxSizing: 'border-box', background: '#ffffff' }}>
        {/* Full-width header */}
        <div style={{ background: accent, padding: `${Math.round(28 * sp)}px ${Math.round(32 * sp)}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontFamily: fonts.heading, fontSize: '22pt', fontWeight: '700', color: '#ffffff', margin: '0 0 4px', lineHeight: '1.1' }}>
              {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
            </p>
            {p?.professionalTitle && (
              <p style={{ fontSize: '10pt', color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: fonts.heading }}>{p.professionalTitle}</p>
            )}
          </div>
          <div style={{ textAlign: 'right', fontSize: '8pt', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7' }}>
            {p?.phone && <div>{p.phone}</div>}
            {p?.city && <div>{p.city}{p.country ? `, ${p.country}` : ''}</div>}
            {p?.linkedinUrl && <div>{p.linkedinUrl.replace('https://', '')}</div>}
            {p?.websiteUrl && <div>{p.websiteUrl.replace('https://', '')}</div>}
          </div>
        </div>

        {/* Body: main (65%) + sidebar (35%) */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Main content */}
          <div style={{ flex: 1, padding: `${Math.round(20 * sp)}px ${Math.round(24 * sp)}px`, boxSizing: 'border-box' }}>
            {isIncluded('summary') && summary && (
              <div>
                <div style={mainHead}>{labels.summary}</div>
                <p style={para}>{summary}</p>
              </div>
            )}

            {mainSections.map((key) => {
              switch (key) {
                case 'experience':
                  return profile.experience.length > 0 ? (
                    <div key="experience">
                      <div style={mainHead}>{labels.experience}</div>
                      {profile.experience.map((exp) => {
                        const bullets = generatedContent[`exp-${exp.id}`]
                          ? generatedContent[`exp-${exp.id}`].split('\n').filter(Boolean)
                          : exp.description ? exp.description.split('\n').filter(Boolean) : exp.achievements
                        return (
                          <div key={exp.id} style={{ marginBottom: `${Math.round(12 * sp)}px` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                      <div style={mainHead}>{labels.education}</div>
                      {profile.education.map((edu) => (
                        <div key={edu.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <p style={entryTitle}>{edu.degreeType.toUpperCase()} in {edu.fieldOfStudy}</p>
                              <p style={entryMeta}>{edu.institution}</p>
                            </div>
                            <span style={entryDate}>{fmt(edu.startDate)} – {edu.ongoing ? 'Present' : fmt(edu.endDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null

                case 'projects':
                  return profile.projects.length > 0 ? (
                    <div key="projects">
                      <div style={mainHead}>{labels.projects}</div>
                      {profile.projects.map((proj) => (
                        <div key={proj.id} style={{ marginBottom: `${Math.round(8 * sp)}px` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={entryTitle}>{proj.name}</p>
                            {proj.startDate && <span style={entryDate}>{fmt(proj.startDate)}</span>}
                          </div>
                          {proj.description && <p style={para}>{proj.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : null

                case 'volunteer':
                  return profile.volunteer.length > 0 ? (
                    <div key="volunteer">
                      <div style={mainHead}>{labels.volunteer}</div>
                      {profile.volunteer.map((vol) => (
                        <div key={vol.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <p style={entryTitle}>{vol.role}</p>
                              <p style={entryMeta}>{vol.organisation}</p>
                            </div>
                            <span style={entryDate}>{fmt(vol.startDate)} – {vol.ongoing ? 'Present' : fmt(vol.endDate)}</span>
                          </div>
                          {vol.description && <p style={para}>{vol.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : null

                case 'publications':
                  return profile.publications.length > 0 ? (
                    <div key="publications">
                      <div style={mainHead}>{labels.publications}</div>
                      {profile.publications.map((pub) => (
                        <div key={pub.id} style={{ marginBottom: `${Math.round(8 * sp)}px` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={entryTitle}>{pub.title}</p>
                            <span style={entryDate}>{fmt(pub.date)}</span>
                          </div>
                          <p style={entryMeta}>{pub.publication}{pub.authors.length > 0 ? ` · ${pub.authors.join(', ')}` : ''}</p>
                          {pub.description && <p style={para}>{pub.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : null

                default: return null
              }
            })}
          </div>

          {/* Right sidebar */}
          <div style={{ width: '33%', background: hexWithAlpha(accent, 0.06), borderLeft: `2px solid ${hexWithAlpha(accent, 0.15)}`, padding: `${Math.round(20 * sp)}px ${Math.round(16 * sp)}px`, boxSizing: 'border-box' }}>
            {sidebarSections.map((key) => {
              switch (key) {
                case 'skills':
                  return profile.skills.length > 0 ? (
                    <div key="skills">
                      <div style={sideHead}>{labels.skills}</div>
                      {profile.skills.slice(0, 12).map((sk) => (
                        <div key={sk.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
                          <span style={{ fontSize: '8.5pt', color: '#333' }}>{sk.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : null

                case 'languages':
                  return profile.languages.length > 0 ? (
                    <div key="languages">
                      <div style={sideHead}>{labels.languages}</div>
                      {profile.languages.map((lang) => (
                        <div key={lang.id} style={{ marginBottom: '5px' }}>
                          <p style={{ fontSize: '8.5pt', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>{lang.language}</p>
                          <p style={{ fontSize: '7.5pt', color: '#888', margin: 0 }}>{lang.level}</p>
                        </div>
                      ))}
                    </div>
                  ) : null

                case 'certifications':
                  return profile.certifications.length > 0 ? (
                    <div key="certifications">
                      <div style={sideHead}>{labels.certifications}</div>
                      {profile.certifications.slice(0, 5).map((cert) => (
                        <div key={cert.id} style={{ marginBottom: '6px' }}>
                          <p style={{ fontSize: '8.5pt', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>{cert.name}</p>
                          <p style={{ fontSize: '7.5pt', color: '#888', margin: 0 }}>{cert.issuingOrg} · {fmt(cert.dateIssued)}</p>
                        </div>
                      ))}
                    </div>
                  ) : null

                default: return null
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export const MosaicTemplate = React.memo(MosaicInner)
