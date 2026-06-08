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

function QuicksilverInner({ state, scale = 1 }: Props) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state
  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')
  const p = profile.personal
  const isIncl = (k: string) => selectedSections.includes(k)
  const summary = generatedContent['summary'] ?? p?.summary ?? ''
  const ordered = sectionOrder.filter(k => isIncl(k) && k !== 'personal')

  const sectionHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '8pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '2px', color: '#1a1a1a',
    display: 'flex', alignItems: 'center', gap: '8px',
    marginBottom: `${Math.round(8 * sp)}px`, marginTop: `${Math.round(18 * sp)}px`,
  }
  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: '#111' }
  const entryMeta: React.CSSProperties = { fontSize: '8.5pt', color: '#666', margin: '0 0 3px' }
  const dateStyle: React.CSSProperties = { fontSize: '8pt', color: '#999', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: '2px', lineHeight: '1.4' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#444', lineHeight: '1.55', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="quicksilver-template" data-photo-enabled="true" style={{ fontFamily: fonts.body, minHeight: '297mm', width: '210mm', boxSizing: 'border-box', background: '#fff' }}>

        {/* Geometric header: accent left block (45%) + white right (55%) */}
        <div style={{ display: 'flex', height: `${Math.round(140 * sp)}px`, position: 'relative', overflow: 'hidden' }}>
          {/* Accent panel */}
          <div style={{ width: '45%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {p?.avatarUrl ? (
              <img src={p.avatarUrl} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '6px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.25)' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24pt', fontWeight: '700', color: 'rgba(255,255,255,0.7)', fontFamily: fonts.heading }}>
                {p?.firstName?.[0] ?? '?'}{p?.lastName?.[0] ?? ''}
              </div>
            )}
          </div>
          {/* Diagonal clip: white trapezoid overlay on right edge of accent */}
          <div style={{ position: 'absolute', top: 0, left: '38%', width: '16%', height: '100%', background: '#fff', clipPath: 'polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
          {/* White name panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '24px', paddingRight: '20px' }}>
            <p style={{ fontFamily: fonts.heading, fontSize: '18pt', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px', lineHeight: '1.1' }}>
              {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
            </p>
            {p?.professionalTitle && (
              <p style={{ fontSize: '10pt', color: accent, fontWeight: '600', margin: '0 0 6px', fontFamily: fonts.heading }}>{p.professionalTitle}</p>
            )}
          </div>
        </div>

        {/* Contact bar */}
        <div style={{ background: hexWithAlpha(accent, 0.07), padding: `${Math.round(8 * sp)}px ${Math.round(28 * sp)}px`, display: 'flex', flexWrap: 'wrap', gap: '4px 20px', fontSize: '8pt', color: '#555', borderTop: `1px solid ${hexWithAlpha(accent, 0.15)}`, borderBottom: `1px solid ${hexWithAlpha(accent, 0.15)}` }}>
          {p?.phone && <span>{p.phone}</span>}
          {p?.city && <span>{p.city}{p.country ? `, ${p.country}` : ''}</span>}
          {p?.linkedinUrl && <span>{p.linkedinUrl.replace('https://', '')}</span>}
          {p?.websiteUrl && <span>{p.websiteUrl.replace('https://', '')}</span>}
        </div>

        {/* Content */}
        <div style={{ padding: `${Math.round(18 * sp)}px ${Math.round(32 * sp)}px` }}>
          {ordered.map((key) => {
            switch (key) {
              case 'summary':
                return summary ? (
                  <div key="summary">
                    <div style={sectionHead}>
                      <span style={{ display: 'inline-block', width: '18px', height: '3px', background: accent }} />
                      {labels.summary}
                      <span style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                    </div>
                    <p style={para}>{summary}</p>
                  </div>
                ) : null
              case 'experience':
                return profile.experience.length > 0 ? (
                  <div key="exp">
                    <div style={sectionHead}>
                      <span style={{ display: 'inline-block', width: '18px', height: '3px', background: accent }} />
                      {labels.experience}
                      <span style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                    </div>
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
                    <div style={sectionHead}>
                      <span style={{ display: 'inline-block', width: '18px', height: '3px', background: accent }} />
                      {labels.education}
                      <span style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                    </div>
                    {profile.education.map((edu) => (
                      <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${Math.round(9 * sp)}px` }}>
                        <div><p style={entryTitle}>{edu.degreeType.toUpperCase()} in {edu.fieldOfStudy}</p><p style={entryMeta}>{edu.institution}</p></div>
                        <span style={dateStyle}>{fmt(edu.startDate)} – {edu.ongoing ? 'Present' : fmt(edu.endDate)}</span>
                      </div>
                    ))}
                  </div>
                ) : null
              case 'skills':
                return profile.skills.length > 0 ? (
                  <div key="skills">
                    <div style={sectionHead}>
                      <span style={{ display: 'inline-block', width: '18px', height: '3px', background: accent }} />
                      {labels.skills}
                      <span style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                    </div>
                    <p style={para}>{profile.skills.map(s => s.name).join('  ·  ')}</p>
                  </div>
                ) : null
              case 'languages':
                return profile.languages.length > 0 ? (
                  <div key="lang">
                    <div style={sectionHead}>
                      <span style={{ display: 'inline-block', width: '18px', height: '3px', background: accent }} />
                      {labels.languages}
                      <span style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                    </div>
                    <p style={para}>{profile.languages.map(l => `${l.language} (${l.level})`).join('  ·  ')}</p>
                  </div>
                ) : null
              case 'certifications':
                return profile.certifications.length > 0 ? (
                  <div key="cert">
                    <div style={sectionHead}>
                      <span style={{ display: 'inline-block', width: '18px', height: '3px', background: accent }} />
                      {labels.certifications}
                      <span style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                    </div>
                    {profile.certifications.map((c) => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <p style={{ ...para, margin: 0 }}>{c.name} — <span style={{ color: '#888' }}>{c.issuingOrg}</span></p>
                        <span style={dateStyle}>{fmt(c.dateIssued)}</span>
                      </div>
                    ))}
                  </div>
                ) : null
              case 'projects':
                return profile.projects.length > 0 ? (
                  <div key="proj">
                    <div style={sectionHead}>
                      <span style={{ display: 'inline-block', width: '18px', height: '3px', background: accent }} />
                      {labels.projects}
                      <span style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                    </div>
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
                    <div style={sectionHead}>
                      <span style={{ display: 'inline-block', width: '18px', height: '3px', background: accent }} />
                      {labels.volunteer}
                      <span style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                    </div>
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
                    <div style={sectionHead}>
                      <span style={{ display: 'inline-block', width: '18px', height: '3px', background: accent }} />
                      {labels.publications}
                      <span style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                    </div>
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
  )
}

export const QuicksilverTemplate = React.memo(QuicksilverInner)
