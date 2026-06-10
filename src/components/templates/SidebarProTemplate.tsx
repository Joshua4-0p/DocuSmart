import * as React from 'react'
import type { BuilderState } from '../../types/document'
import { getProfileSnapshot } from '../../lib/api/profile.api'
import {
  resolveAccentColor,
  resolveFontPairing,
  resolveSpacingMultiplier,
  getSectionLabels,
  getDegreeLabel,
} from '../../lib/templates/templateSettings'

interface Props { state: BuilderState; scale?: number }

function fmt(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

const LEVEL_TO_NUM: Record<string, number> = {
  beginner: 1, intermediate: 2, advanced: 3, expert: 4,
}

function SkillBar({ name, level }: { name: string; level?: number }) {
  const pct = Math.round(((level ?? 3) / 5) * 100)
  return (
    <div style={{ marginBottom: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
        <span style={{ fontSize: '8.5pt', color: 'rgba(255,255,255,0.9)' }}>{name}</span>
      </div>
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(255,255,255,0.85)', borderRadius: '2px' }} />
      </div>
    </div>
  )
}

function SidebarProInner({ state, scale = 1 }: Props) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state

  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')

  const p = profile.personal
  const isIncluded = (k: string) => selectedSections.includes(k)
  const summary = generatedContent['summary'] ?? p?.summary ?? ''
  const mainSections = sectionOrder.filter(k => isIncluded(k) && !['personal', 'skills', 'languages', 'certifications'].includes(k))

  const sidebarSectionHead: React.CSSProperties = {
    fontFamily: fonts.heading,
    fontSize: '7.5pt',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'rgba(255,255,255,0.6)',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    paddingBottom: '3px',
    marginBottom: `${Math.round(8 * sp)}px`,
    marginTop: `${Math.round(16 * sp)}px`,
  }

  const mainSectionHead: React.CSSProperties = {
    fontFamily: fonts.heading,
    fontSize: '8pt',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: accent,
    borderBottom: `1px solid ${accent}40`,
    paddingBottom: '3px',
    marginBottom: `${Math.round(8 * sp)}px`,
    marginTop: `${Math.round(16 * sp)}px`,
  }

  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: '#1a1a1a' }
  const entryMeta: React.CSSProperties = { fontSize: '9pt', color: '#555', margin: '0 0 3px' }
  const entryDate: React.CSSProperties = { fontSize: '8pt', color: '#888', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: '2px', lineHeight: '1.4' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#333', lineHeight: '1.5', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="sidebar-pro-template" style={{ fontFamily: fonts.body, display: 'flex', minHeight: '297mm', width: '210mm', boxSizing: 'border-box', background: '#ffffff' }}>
        {/* Left sidebar 35% — solid accent */}
        <div style={{ width: '35%', background: accent, padding: `${Math.round(36 * sp)}px ${Math.round(18 * sp)}px`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          {/* Name + title */}
          <p style={{ fontFamily: fonts.heading, fontSize: '16pt', fontWeight: '700', color: '#ffffff', margin: '0 0 4px', lineHeight: '1.1' }}>
            {p ? `${p.firstName}` : 'First'}<br />{p ? `${p.lastName}` : 'Last'}
          </p>
          {p?.professionalTitle && (
            <p style={{ fontSize: '9pt', color: 'rgba(255,255,255,0.75)', fontWeight: '500', margin: '0 0 16px' }}>{p.professionalTitle}</p>
          )}

          {/* Contact */}
          <div style={sidebarSectionHead}>Contact</div>
          <div style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.85)', lineHeight: '1.8' }}>
            {p?.phone && <div>{p.phone}</div>}
            {p?.city && <div>{p.city}{p.country ? `, ${p.country}` : ''}</div>}
            {p?.linkedinUrl && <div style={{ wordBreak: 'break-all' }}>{p.linkedinUrl.replace('https://', '')}</div>}
            {p?.websiteUrl && <div style={{ wordBreak: 'break-all' }}>{p.websiteUrl.replace('https://', '')}</div>}
          </div>

          {/* Skills */}
          {isIncluded('skills') && profile.skills.length > 0 && (
            <>
              <div style={sidebarSectionHead}>{labels.skills}</div>
              {profile.skills.slice(0, 10).map((sk) => (
                <SkillBar key={sk.id} name={sk.name} level={LEVEL_TO_NUM[sk.level] ?? 3} />
              ))}
            </>
          )}

          {/* Languages */}
          {isIncluded('languages') && profile.languages.length > 0 && (
            <>
              <div style={sidebarSectionHead}>{labels.languages}</div>
              {profile.languages.map((lang) => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '8.5pt' }}>
                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>{lang.language}</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{lang.level}</span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right main 65% */}
        <div style={{ flex: 1, padding: `${Math.round(36 * sp)}px ${Math.round(24 * sp)}px`, boxSizing: 'border-box' }}>
          {/* Summary */}
          {isIncluded('summary') && summary && (
            <div>
              <div style={mainSectionHead}>{labels.summary}</div>
              <p style={para}>{summary}</p>
            </div>
          )}

          {mainSections.map((key) => {
            switch (key) {
              case 'experience':
                return profile.experience.length > 0 ? (
                  <div key="experience">
                    <div style={mainSectionHead}>{labels.experience}</div>
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
                    <div style={mainSectionHead}>{labels.education}</div>
                    {profile.education.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <p style={entryTitle}>{getDegreeLabel(edu)} in {edu.fieldOfStudy}</p>
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
                    <div style={mainSectionHead}>{labels.projects}</div>
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

              case 'certifications':
                return profile.certifications.length > 0 ? (
                  <div key="certifications">
                    <div style={mainSectionHead}>{labels.certifications}</div>
                    {profile.certifications.map((c) => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div>
                          <p style={{ ...para, fontWeight: '600', margin: 0 }}>{c.name}</p>
                          <p style={{ ...entryMeta, margin: 0 }}>{c.issuingOrg}</p>
                        </div>
                        <span style={entryDate}>{fmt(c.dateIssued)}</span>
                      </div>
                    ))}
                  </div>
                ) : null

              case 'volunteer':
                return profile.volunteer.length > 0 ? (
                  <div key="volunteer">
                    <div style={mainSectionHead}>{labels.volunteer}</div>
                    {profile.volunteer.map((vol) => (
                      <div key={vol.id} style={{ marginBottom: `${Math.round(10 * sp)}px` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                    <div style={mainSectionHead}>{labels.publications}</div>
                    {profile.publications.map((pub) => (
                      <div key={pub.id} style={{ marginBottom: `${Math.round(8 * sp)}px` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
      </div>
    </div>
  )
}

export const SidebarProTemplate = React.memo(SidebarProInner)
