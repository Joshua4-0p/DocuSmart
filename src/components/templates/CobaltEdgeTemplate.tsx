import * as React from 'react'
import type { BuilderState } from '../../types/document'
import { getProfileSnapshot } from '../../lib/api/profile.api'
import {
  resolveAccentColor,
  resolveFontPairing,
  resolveSpacingMultiplier,
  getSectionLabels,
  hexWithAlpha,
  getDegreeLabel,
} from '../../lib/templates/templateSettings'

interface Props { state: BuilderState; scale?: number }

function fmt(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

const LEVEL_DOT: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }

function CobaltEdgeInner({ state, scale = 1 }: Props) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state
  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')
  const p = profile.personal
  const isIncl = (k: string) => selectedSections.includes(k)
  const summary = generatedContent['summary'] ?? p?.summary ?? ''
  const mainSections = sectionOrder.filter(k => isIncl(k) && !['personal', 'skills', 'languages'].includes(k))

  const mainHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '8pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '1.5px', color: accent,
    borderLeft: `4px solid ${accent}`, paddingLeft: '8px',
    marginBottom: `${Math.round(8 * sp)}px`, marginTop: `${Math.round(18 * sp)}px`,
  }
  const sideHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '7.5pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.65)',
    borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px',
    marginBottom: `${Math.round(8 * sp)}px`, marginTop: `${Math.round(14 * sp)}px`,
  }
  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: '#111' }
  const entryMeta: React.CSSProperties = { fontSize: '8.5pt', color: '#666', margin: '0 0 3px' }
  const dateStyle: React.CSSProperties = { fontSize: '8pt', color: '#999', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: '2px', lineHeight: '1.4' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#444', lineHeight: '1.55', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="cobalt-edge-template" data-photo-enabled="true" style={{ fontFamily: fonts.body, minHeight: '297mm', width: '210mm', boxSizing: 'border-box', background: '#fff' }}>

        {/* Full-width dark header */}
        <div style={{ background: accent, padding: `${Math.round(24 * sp)}px ${Math.round(28 * sp)}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: fonts.heading, fontSize: '22pt', fontWeight: '700', color: '#fff', margin: '0 0 4px', lineHeight: '1.05' }}>
              {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
            </p>
            {p?.professionalTitle && (
              <p style={{ fontSize: '10pt', color: 'rgba(255,255,255,0.8)', fontWeight: '500', margin: '0 0 10px', fontFamily: fonts.heading }}>{p.professionalTitle}</p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 16px', fontSize: '8pt', color: 'rgba(255,255,255,0.75)' }}>
              {p?.phone && <span>{p.phone}</span>}
              {p?.city && <span>{p.city}{p.country ? `, ${p.country}` : ''}</span>}
              {p?.linkedinUrl && <span>{p.linkedinUrl.replace('https://', '')}</span>}
              {p?.websiteUrl && <span>{p.websiteUrl.replace('https://', '')}</span>}
            </div>
          </div>
          {/* Photo */}
          {p?.avatarUrl ? (
            <img src={p.avatarUrl} alt="Profile" style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
          ) : (
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22pt', fontWeight: '700', color: 'rgba(255,255,255,0.6)', fontFamily: fonts.heading, flexShrink: 0 }}>
              {p?.firstName?.[0] ?? '?'}{p?.lastName?.[0] ?? ''}
            </div>
          )}
        </div>

        {/* Two-column body */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Sidebar 30% */}
          <div style={{ width: '30%', background: hexWithAlpha(accent, 0.06), padding: `${Math.round(18 * sp)}px ${Math.round(14 * sp)}px`, boxSizing: 'border-box', borderRight: `2px solid ${hexWithAlpha(accent, 0.12)}` }}>
            {isIncl('skills') && profile.skills.length > 0 && (
              <>
                <div style={sideHead}>{labels.skills}</div>
                {profile.skills.slice(0, 10).map((sk) => {
                  const d = LEVEL_DOT[sk.level] ?? 3
                  return (
                    <div key={sk.id} style={{ marginBottom: '6px' }}>
                      <p style={{ fontSize: '8pt', color: '#333', margin: '0 0 2px' }}>{sk.name}</p>
                      <div style={{ display: 'inline-flex', gap: '2px' }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: i < d ? accent : '#ddd' }} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
            {isIncl('languages') && profile.languages.length > 0 && (
              <>
                <div style={sideHead}>{labels.languages}</div>
                {profile.languages.map((lang) => (
                  <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '8pt', color: '#333' }}>{lang.language}</span>
                    <span style={{ fontSize: '7.5pt', color: '#999' }}>{lang.level}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Main 70% */}
          <div style={{ flex: 1, padding: `${Math.round(18 * sp)}px ${Math.round(20 * sp)}px`, boxSizing: 'border-box' }}>
            {isIncl('summary') && summary && (
              <>
                <div style={mainHead}>{labels.summary}</div>
                <p style={para}>{summary}</p>
              </>
            )}
            {mainSections.map((key) => {
              if (key === 'summary') return null
              switch (key) {
                case 'experience':
                  return profile.experience.length > 0 ? (
                    <div key="exp">
                      <div style={mainHead}>{labels.experience}</div>
                      {profile.experience.map((exp) => {
                        const bullets = generatedContent[`exp-${exp.id}`]
                          ? generatedContent[`exp-${exp.id}`].split('\n').filter(Boolean)
                          : exp.description ? exp.description.split('\n').filter(Boolean) : exp.achievements
                        return (
                          <div key={exp.id} style={{ marginBottom: `${Math.round(12 * sp)}px` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div><p style={entryTitle}>{exp.jobTitle}</p><p style={entryMeta}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p></div>
                              <span style={dateStyle}>{fmt(exp.startDate)} – {exp.ongoing ? 'Present' : fmt(exp.endDate)}</span>
                            </div>
                            {bullets.length > 0 && <ul style={bulletList}>{bullets.map((b, i) => <li key={i} style={bulletItem}>{b.replace(/^[•\-]\s*/, '')}</li>)}</ul>}
                          </div>
                        )
                      })}
                    </div>
                  ) : null
                case 'education':
                  return profile.education.length > 0 ? (
                    <div key="edu">
                      <div style={mainHead}>{labels.education}</div>
                      {profile.education.map((edu) => (
                        <div key={edu.id} style={{ marginBottom: `${Math.round(9 * sp)}px` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div><p style={entryTitle}>{getDegreeLabel(edu)} in {edu.fieldOfStudy}</p><p style={entryMeta}>{edu.institution}</p></div>
                            <span style={dateStyle}>{fmt(edu.startDate)} – {edu.ongoing ? 'Present' : fmt(edu.endDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null
                case 'certifications':
                  return profile.certifications.length > 0 ? (
                    <div key="cert">
                      <div style={mainHead}>{labels.certifications}</div>
                      {profile.certifications.map((c) => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <p style={{ ...para, margin: 0 }}>{c.name} — <span style={{ color: '#aaa' }}>{c.issuingOrg}</span></p>
                          <span style={dateStyle}>{fmt(c.dateIssued)}</span>
                        </div>
                      ))}
                    </div>
                  ) : null
                case 'projects':
                  return profile.projects.length > 0 ? (
                    <div key="proj">
                      <div style={mainHead}>{labels.projects}</div>
                      {profile.projects.map((proj) => (
                        <div key={proj.id} style={{ marginBottom: `${Math.round(8 * sp)}px` }}>
                          <p style={entryTitle}>{proj.name}</p>
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
                            <div><p style={entryTitle}>{vol.role}</p><p style={entryMeta}>{vol.organisation}</p></div>
                            <span style={dateStyle}>{fmt(vol.startDate)} – {vol.ongoing ? 'Present' : fmt(vol.endDate)}</span>
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
                            <span style={dateStyle}>{fmt(pub.date)}</span>
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
        </div>
      </div>
    </div>
  )
}

export const CobaltEdgeTemplate = React.memo(CobaltEdgeInner)
