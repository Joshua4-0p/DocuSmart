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

const LEVEL_TO_NUM: Record<string, number> = {
  beginner: 1, intermediate: 2, advanced: 3, expert: 4,
}

/** Renders 5-dot proficiency bar */
function DotBar({ level }: { level?: number }) {
  const filled = Math.max(0, Math.min(5, level ?? 3))
  return (
    <span style={{ display: 'inline-flex', gap: '2px', marginLeft: '6px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: i < filled ? '#1a1a1a' : '#d0d0d0' }} />
      ))}
    </span>
  )
}

function BlueprintInner({ state, scale = 1 }: Props) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state

  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')

  const p = profile.personal
  const isIncluded = (k: string) => selectedSections.includes(k)
  const summary = generatedContent['summary'] ?? p?.summary ?? ''

  const sidebarBg = hexWithAlpha(accent, 0.08)
  const orderedMain = sectionOrder.filter(k => isIncluded(k) && !['personal', 'skills', 'languages', 'certifications'].includes(k))

  const page: React.CSSProperties = {
    fontFamily: fonts.body,
    fontSize: '10pt',
    lineHeight: '1.45',
    color: '#1a1a1a',
    background: '#ffffff',
    minHeight: '297mm',
    width: '210mm',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  }

  const sectionHead = (color: string): React.CSSProperties => ({
    fontFamily: fonts.heading,
    fontSize: '7.5pt',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color,
    borderBottom: `1px solid ${hexWithAlpha(color, 0.3)}`,
    paddingBottom: '3px',
    marginBottom: `${Math.round(8 * sp)}px`,
    marginTop: `${Math.round(14 * sp)}px`,
  })

  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px' }
  const entryMeta: React.CSSProperties = { fontSize: '9pt', color: '#555', margin: '0 0 3px' }
  const entryDate: React.CSSProperties = { fontSize: '8pt', color: '#888', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: '2px', lineHeight: '1.4' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#333', lineHeight: '1.5', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div style={page} id="blueprint-template">
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Left sidebar 30% */}
          <div style={{ width: '30%', background: sidebarBg, padding: `${Math.round(32 * sp)}px ${Math.round(16 * sp)}px`, boxSizing: 'border-box', borderRight: `2px solid ${hexWithAlpha(accent, 0.15)}` }}>
            {/* Name block */}
            <p style={{ fontFamily: fonts.heading, fontSize: '13pt', fontWeight: '700', color: '#1a1a1a', margin: '0 0 2px', lineHeight: '1.2' }}>
              {p ? p.firstName : 'First'}<br />{p ? p.lastName : 'Last'}
            </p>
            {p?.professionalTitle && <p style={{ fontSize: '8.5pt', color: accent, fontWeight: '600', margin: '0 0 12px' }}>{p.professionalTitle}</p>}

            {/* Contact */}
            <div style={sectionHead(accent)}>Contact</div>
            <div style={{ fontSize: '8pt', color: '#444', lineHeight: '1.7' }}>
              {p?.phone && <div>{p.phone}</div>}
              {p?.city && <div>{p.city}{p.country ? `, ${p.country}` : ''}</div>}
              {p?.linkedinUrl && <div style={{ wordBreak: 'break-all' }}>{p.linkedinUrl.replace('https://', '')}</div>}
              {p?.websiteUrl && <div style={{ wordBreak: 'break-all' }}>{p.websiteUrl.replace('https://', '')}</div>}
            </div>

            {/* Skills */}
            {isIncluded('skills') && profile.skills.length > 0 && (
              <>
                <div style={sectionHead(accent)}>{labels.skills}</div>
                {profile.skills.slice(0, 10).map((sk) => (
                  <div key={sk.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '8.5pt', color: '#333' }}>{sk.name}</span>
                    <DotBar level={LEVEL_TO_NUM[sk.level] ?? 3} />
                  </div>
                ))}
              </>
            )}

            {/* Languages */}
            {isIncluded('languages') && profile.languages.length > 0 && (
              <>
                <div style={sectionHead(accent)}>{labels.languages}</div>
                {profile.languages.map((lang) => (
                  <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '8.5pt' }}>
                    <span>{lang.language}</span>
                    <span style={{ color: '#888' }}>{lang.level}</span>
                  </div>
                ))}
              </>
            )}

            {/* Certifications in sidebar */}
            {isIncluded('certifications') && profile.certifications.length > 0 && (
              <>
                <div style={sectionHead(accent)}>{labels.certifications}</div>
                {profile.certifications.slice(0, 4).map((cert) => (
                  <div key={cert.id} style={{ marginBottom: '6px' }}>
                    <p style={{ fontSize: '8pt', fontWeight: '600', margin: '0' }}>{cert.name}</p>
                    <p style={{ fontSize: '7.5pt', color: '#888', margin: '0' }}>{cert.issuingOrg} · {fmt(cert.dateIssued)}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right main 70% */}
          <div style={{ flex: 1, padding: `${Math.round(32 * sp)}px ${Math.round(24 * sp)}px`, boxSizing: 'border-box' }}>
            {/* Summary */}
            {isIncluded('summary') && summary && (
              <div style={{ marginBottom: `${Math.round(16 * sp)}px` }}>
                <div style={sectionHead('#1a1a1a')}>{labels.summary}</div>
                <p style={para}>{summary}</p>
              </div>
            )}

            {orderedMain.map((key) => {
              switch (key) {
                case 'experience':
                  return profile.experience.length > 0 ? (
                    <div key="experience">
                      <div style={sectionHead('#1a1a1a')}>{labels.experience}</div>
                      {profile.experience.map((exp) => {
                        const bullets = generatedContent[`exp-${exp.id}`]
                          ? generatedContent[`exp-${exp.id}`].split('\n').filter(Boolean)
                          : exp.description ? exp.description.split('\n').filter(Boolean) : exp.achievements
                        return (
                          <div key={exp.id} style={{ marginBottom: `${Math.round(12 * sp)}px` }}>
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
                      <div style={sectionHead('#1a1a1a')}>{labels.education}</div>
                      {profile.education.map((edu) => (
                        <div key={edu.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <p style={entryTitle}>{edu.degreeType.toUpperCase()} in {edu.fieldOfStudy}</p>
                              <p style={entryMeta}>{edu.institution}{edu.city ? `, ${edu.city}` : ''}</p>
                            </div>
                            <span style={entryDate}>{fmt(edu.startDate)} – {edu.ongoing ? 'Present' : fmt(edu.endDate)}</span>
                          </div>
                          {edu.gpa && edu.showGpa && <p style={{ ...para, fontSize: '8.5pt' }}>GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  ) : null

                case 'projects':
                  return profile.projects.length > 0 ? (
                    <div key="projects">
                      <div style={sectionHead('#1a1a1a')}>{labels.projects}</div>
                      {profile.projects.map((proj) => (
                        <div key={proj.id} style={{ marginBottom: `${Math.round(8 * sp)}px` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={entryTitle}>{proj.name}</p>
                            {proj.startDate && <span style={entryDate}>{fmt(proj.startDate)}</span>}
                          </div>
                          {proj.technologies.length > 0 && <p style={{ ...para, fontSize: '8.5pt', color: '#888' }}>{proj.technologies.join(', ')}</p>}
                          {proj.description && <p style={para}>{proj.description}</p>}
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

export const BlueprintTemplate = React.memo(BlueprintInner)
