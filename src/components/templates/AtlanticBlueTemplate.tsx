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

function fmt(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

const LEVEL_DOT: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }

function AtlanticBlueInner({ state, scale = 1 }: Props) {
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

  const sideHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '7pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.55)',
    borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '3px',
    marginBottom: `${Math.round(8 * sp)}px`, marginTop: `${Math.round(14 * sp)}px`,
  }
  const mainHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '8pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '1.5px', color: accent,
    paddingBottom: '4px', borderBottom: `1.5px solid ${accent}33`,
    marginBottom: `${Math.round(8 * sp)}px`, marginTop: `${Math.round(18 * sp)}px`,
  }
  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: '#111' }
  const entryMeta: React.CSSProperties = { fontSize: '8.5pt', color: '#666', margin: '0 0 3px' }
  const dateStyle: React.CSSProperties = { fontSize: '8pt', color: '#999', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: '2px', lineHeight: '1.4' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="atlantic-blue-template" data-photo-enabled="true" style={{ fontFamily: fonts.body, display: 'flex', minHeight: '297mm', width: '210mm', boxSizing: 'border-box' }}>

        {/* Sidebar 38% */}
        <div style={{ width: '38%', background: accent, display: 'flex', flexDirection: 'column', padding: `${Math.round(32 * sp)}px ${Math.round(18 * sp)}px`, boxSizing: 'border-box' }}>
          {/* Photo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: `${Math.round(16 * sp)}px` }}>
            {p?.avatarUrl ? (
              <img src={p.avatarUrl} alt="Profile" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }} />
            ) : (
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26pt', fontWeight: '700', color: 'rgba(255,255,255,0.6)', fontFamily: fonts.heading }}>
                {p?.firstName?.[0] ?? '?'}{p?.lastName?.[0] ?? ''}
              </div>
            )}
          </div>

          {/* Name + title */}
          <p style={{ fontFamily: fonts.heading, fontSize: '14pt', fontWeight: '700', color: '#fff', margin: '0 0 4px', lineHeight: '1.1', textAlign: 'center' }}>
            {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
          </p>
          {p?.professionalTitle && (
            <p style={{ fontSize: '8.5pt', color: 'rgba(255,255,255,0.75)', margin: '0 0 12px', textAlign: 'center', fontStyle: 'italic' }}>{p.professionalTitle}</p>
          )}

          {/* Contact */}
          <div style={sideHead}>Contact</div>
          <div style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.85)', lineHeight: '1.8' }}>
            {p?.phone && <div>{p.phone}</div>}
            {p?.city && <div>{p.city}{p.country ? `, ${p.country}` : ''}</div>}
            {p?.linkedinUrl && <div style={{ wordBreak: 'break-all' }}>{p.linkedinUrl.replace('https://', '')}</div>}
            {p?.websiteUrl && <div style={{ wordBreak: 'break-all' }}>{p.websiteUrl.replace('https://', '')}</div>}
          </div>

          {/* Skills */}
          {isIncl('skills') && profile.skills.length > 0 && (
            <>
              <div style={sideHead}>{labels.skills}</div>
              {profile.skills.slice(0, 10).map((sk) => {
                const dots = LEVEL_DOT[sk.level] ?? 3
                return (
                  <div key={sk.id} style={{ marginBottom: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.9)' }}>{sk.name}</span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.18)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${(dots / 4) * 100}%`, background: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {/* Languages */}
          {isIncl('languages') && profile.languages.length > 0 && (
            <>
              <div style={sideHead}>{labels.languages}</div>
              {profile.languages.map((lang) => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.9)' }}>{lang.language}</span>
                  <span style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.55)' }}>{lang.level}</span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Main 62% */}
        <div style={{ flex: 1, background: '#fff', padding: `${Math.round(32 * sp)}px ${Math.round(22 * sp)}px`, boxSizing: 'border-box' }}>
          {isIncl('summary') && summary && (
            <>
              <div style={mainHead}>{labels.summary}</div>
              <p style={{ fontSize: '9pt', color: '#444', lineHeight: '1.55', margin: '0' }}>{summary}</p>
            </>
          )}

          {mainSections.map((key) => {
            switch (key) {
              case 'summary': return null
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <p style={entryTitle}>{exp.jobTitle}</p>
                              <p style={entryMeta}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                            </div>
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
                      <div key={edu.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <p style={entryTitle}>{edu.degreeType.toUpperCase()} in {edu.fieldOfStudy}</p>
                            <p style={entryMeta}>{edu.institution}</p>
                          </div>
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
                        <div><p style={{ ...entryTitle, fontSize: '9pt' }}>{c.name}</p><p style={entryMeta}>{c.issuingOrg}</p></div>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <p style={entryTitle}>{proj.name}</p>
                          {proj.startDate && <span style={dateStyle}>{fmt(proj.startDate)}</span>}
                        </div>
                        {proj.description && <p style={{ fontSize: '9pt', color: '#444', margin: 0, lineHeight: '1.4' }}>{proj.description}</p>}
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
  )
}

export const AtlanticBlueTemplate = React.memo(AtlanticBlueInner)
