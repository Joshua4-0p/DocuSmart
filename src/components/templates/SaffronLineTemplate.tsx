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

function fmt(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

const LEVEL_DOT: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }

function SaffronLineInner({ state, scale = 1 }: Props) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state
  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')
  const p = profile.personal
  const isIncl = (k: string) => selectedSections.includes(k)
  const summary = generatedContent['summary'] ?? p?.summary ?? ''
  const sidebarKeys = ['skills', 'languages', 'certifications']
  const mainSections = sectionOrder.filter(k => isIncl(k) && !['personal', ...sidebarKeys].includes(k))
  const sideSections = sectionOrder.filter(k => isIncl(k) && sidebarKeys.includes(k))

  const mainHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '8pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '1.5px', color: '#1a1a1a',
    borderLeft: `3px solid ${accent}`, paddingLeft: '8px',
    marginBottom: `${Math.round(8 * sp)}px`, marginTop: `${Math.round(16 * sp)}px`,
  }
  const sideHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '7.5pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '1.5px', color: accent,
    borderBottom: `1px solid ${hexWithAlpha(accent, 0.3)}`, paddingBottom: '3px',
    marginBottom: `${Math.round(7 * sp)}px`, marginTop: `${Math.round(14 * sp)}px`,
  }
  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: '#111' }
  const entryMeta: React.CSSProperties = { fontSize: '8.5pt', color: '#666', margin: '0 0 3px' }
  const dateStyle: React.CSSProperties = { fontSize: '7.5pt', color: '#999', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '13px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: '2px', lineHeight: '1.4' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#444', lineHeight: '1.5', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="saffron-line-template" data-photo-enabled="true" style={{ fontFamily: fonts.body, minHeight: '297mm', width: '210mm', boxSizing: 'border-box', background: '#fafafa' }}>

        {/* Full-width header */}
        <div style={{ background: '#fff', borderBottom: `3px solid ${accent}`, padding: `${Math.round(24 * sp)}px ${Math.round(28 * sp)}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: fonts.heading, fontSize: '20pt', fontWeight: '700', color: '#1a1a1a', margin: '0 0 3px', lineHeight: '1.1' }}>
              {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
            </p>
            {p?.professionalTitle && (
              <p style={{ fontSize: '10pt', color: accent, fontWeight: '600', margin: '0 0 8px', fontFamily: fonts.heading }}>{p.professionalTitle}</p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px', fontSize: '8pt', color: '#666' }}>
              {p?.phone && <span>{p.phone}</span>}
              {p?.city && <span>{p.city}{p.country ? `, ${p.country}` : ''}</span>}
              {p?.linkedinUrl && <span>{p.linkedinUrl.replace('https://', '')}</span>}
              {p?.websiteUrl && <span>{p.websiteUrl.replace('https://', '')}</span>}
            </div>
          </div>
          {/* Photo */}
          {p?.avatarUrl ? (
            <img src={p.avatarUrl} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, marginLeft: '16px', flexShrink: 0 }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: hexWithAlpha(accent, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20pt', fontWeight: '700', color: accent, fontFamily: fonts.heading, marginLeft: '16px', flexShrink: 0, border: `2px solid ${hexWithAlpha(accent, 0.3)}` }}>
              {p?.firstName?.[0] ?? '?'}{p?.lastName?.[0] ?? ''}
            </div>
          )}
        </div>

        {/* Two-column body */}
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Main 62% */}
          <div style={{ flex: 1, padding: `${Math.round(18 * sp)}px ${Math.round(22 * sp)}px`, boxSizing: 'border-box', background: '#fff', borderRight: '1px solid #e8e8e8' }}>
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
                            <div><p style={entryTitle}>{edu.degreeType.toUpperCase()} in {edu.fieldOfStudy}</p><p style={entryMeta}>{edu.institution}</p></div>
                            <span style={dateStyle}>{fmt(edu.startDate)} – {edu.ongoing ? 'Present' : fmt(edu.endDate)}</span>
                          </div>
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
                default: return null
              }
            })}
          </div>

          {/* Sidebar 38% */}
          <div style={{ width: '38%', padding: `${Math.round(18 * sp)}px ${Math.round(16 * sp)}px`, boxSizing: 'border-box', background: '#fafafa' }}>
            {sideSections.map((key) => {
              switch (key) {
                case 'skills':
                  return profile.skills.length > 0 ? (
                    <div key="skills">
                      <div style={sideHead}>{labels.skills}</div>
                      {profile.skills.slice(0, 12).map((sk) => {
                        const dots = LEVEL_DOT[sk.level] ?? 3
                        return (
                          <div key={sk.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ fontSize: '8.5pt', color: '#333', flex: 1 }}>{sk.name}</span>
                            <span style={{ display: 'inline-flex', gap: '2px' }}>
                              {Array.from({ length: 4 }).map((_, i) => (
                                <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i < dots ? accent : '#ddd' }} />
                              ))}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : null
                case 'languages':
                  return profile.languages.length > 0 ? (
                    <div key="lang">
                      <div style={sideHead}>{labels.languages}</div>
                      {profile.languages.map((lang) => (
                        <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '8.5pt', color: '#333' }}>{lang.language}</span>
                          <span style={{ fontSize: '7.5pt', color: '#999' }}>{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  ) : null
                case 'certifications':
                  return profile.certifications.length > 0 ? (
                    <div key="cert">
                      <div style={sideHead}>{labels.certifications}</div>
                      {profile.certifications.slice(0, 5).map((c) => (
                        <div key={c.id} style={{ marginBottom: '6px' }}>
                          <p style={{ fontSize: '8.5pt', fontWeight: '600', color: '#222', margin: 0 }}>{c.name}</p>
                          <p style={{ fontSize: '7.5pt', color: '#888', margin: 0 }}>{c.issuingOrg} · {fmt(c.dateIssued)}</p>
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

export const SaffronLineTemplate = React.memo(SaffronLineInner)
