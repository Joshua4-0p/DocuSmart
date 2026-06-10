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

function BlueNeonInner({ state, scale = 1 }: Props) {
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

  const bg = '#0d1117'
  const textPrimary = '#e6edf3'
  const textMuted = '#8b949e'

  const sectionHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '7.5pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '2.5px', color: accent,
    borderLeft: `3px solid ${accent}`, paddingLeft: '10px',
    marginBottom: `${Math.round(10 * sp)}px`, marginTop: `${Math.round(20 * sp)}px`,
  }
  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: textPrimary }
  const entryMeta: React.CSSProperties = { fontSize: '8.5pt', color: textMuted, margin: '0 0 3px' }
  const dateStyle: React.CSSProperties = { fontSize: '8pt', color: hexWithAlpha(accent, 0.7), whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#c9d1d9', marginBottom: '2px', lineHeight: '1.45' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#c9d1d9', lineHeight: '1.55', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="blue-neon-template" data-photo-enabled="true" style={{ fontFamily: fonts.body, minHeight: '297mm', width: '210mm', boxSizing: 'border-box', background: bg, padding: `${Math.round(38 * sp)}px ${Math.round(44 * sp)}px` }}>

        {/* Header: name left, photo right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: `${Math.round(8 * sp)}px` }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: fonts.heading, fontSize: '24pt', fontWeight: '700', color: textPrimary, margin: '0 0 4px', letterSpacing: '-0.3px', lineHeight: '1.05' }}>
              {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
            </p>
            {p?.professionalTitle && (
              <p style={{ fontSize: '11pt', color: accent, fontWeight: '500', margin: '0 0 8px', fontFamily: fonts.heading }}>{p.professionalTitle}</p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 14px', fontSize: '8pt', color: textMuted }}>
              {p?.phone && <span>{p.phone}</span>}
              {p?.city && <span>{p.city}{p.country ? `, ${p.country}` : ''}</span>}
              {p?.linkedinUrl && <span>{p.linkedinUrl.replace('https://', '')}</span>}
              {p?.websiteUrl && <span>{p.websiteUrl.replace('https://', '')}</span>}
            </div>
          </div>
          {/* Photo with accent glow ring */}
          {p?.avatarUrl ? (
            <div style={{ position: 'relative', flexShrink: 0, marginLeft: '20px' }}>
              <div style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', border: `2px solid ${hexWithAlpha(accent, 0.5)}` }} />
              <img src={p.avatarUrl} alt="Profile" style={{ width: '86px', height: '86px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: `2px solid ${hexWithAlpha(accent, 0.3)}` }} />
            </div>
          ) : (
            <div style={{ width: '86px', height: '86px', borderRadius: '50%', background: hexWithAlpha(accent, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22pt', fontWeight: '700', color: accent, fontFamily: fonts.heading, border: `2px solid ${hexWithAlpha(accent, 0.4)}`, flexShrink: 0, marginLeft: '20px' }}>
              {p?.firstName?.[0] ?? '?'}{p?.lastName?.[0] ?? ''}
            </div>
          )}
        </div>

        {/* Accent gradient line */}
        <div style={{ height: '1px', background: `linear-gradient(to right, ${accent}, transparent)`, marginBottom: `${Math.round(4 * sp)}px` }} />

        {ordered.map((key) => {
          switch (key) {
            case 'summary':
              return summary ? (
                <div key="summary">
                  <div style={sectionHead}>{labels.summary}</div>
                  <p style={para}>{summary}</p>
                </div>
              ) : null
            case 'experience':
              return profile.experience.length > 0 ? (
                <div key="exp">
                  <div style={sectionHead}>{labels.experience}</div>
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
                  <div style={sectionHead}>{labels.education}</div>
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
            case 'skills':
              return profile.skills.length > 0 ? (
                <div key="skills">
                  <div style={sectionHead}>{labels.skills}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {profile.skills.map((sk) => (
                      <span key={sk.id} style={{ display: 'inline-block', border: `1px solid ${hexWithAlpha(accent, 0.45)}`, color: accent, padding: '2px 9px', fontSize: '8pt', borderRadius: '3px' }}>
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            case 'languages':
              return profile.languages.length > 0 ? (
                <div key="lang">
                  <div style={sectionHead}>{labels.languages}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
                    {profile.languages.map((lang) => (
                      <span key={lang.id} style={{ fontSize: '9pt', color: textPrimary }}>{lang.language} <span style={{ color: textMuted }}>/ {lang.level}</span></span>
                    ))}
                  </div>
                </div>
              ) : null
            case 'certifications':
              return profile.certifications.length > 0 ? (
                <div key="cert">
                  <div style={sectionHead}>{labels.certifications}</div>
                  {profile.certifications.map((c) => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <p style={{ ...para, margin: 0 }}>{c.name} — <span style={{ color: textMuted }}>{c.issuingOrg}</span></p>
                      <span style={dateStyle}>{fmt(c.dateIssued)}</span>
                    </div>
                  ))}
                </div>
              ) : null
            case 'projects':
              return profile.projects.length > 0 ? (
                <div key="proj">
                  <div style={sectionHead}>{labels.projects}</div>
                  {profile.projects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: `${Math.round(8 * sp)}px` }}>
                      <p style={entryTitle}>{proj.name}</p>
                      {proj.technologies.length > 0 && <p style={{ fontSize: '8pt', color: hexWithAlpha(accent, 0.8), margin: '0 0 2px' }}>{proj.technologies.join(' · ')}</p>}
                      {proj.description && <p style={para}>{proj.description}</p>}
                    </div>
                  ))}
                </div>
              ) : null
            case 'volunteer':
              return profile.volunteer.length > 0 ? (
                <div key="volunteer">
                  <div style={sectionHead}>{labels.volunteer}</div>
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
                  <div style={sectionHead}>{labels.publications}</div>
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
  )
}

export const BlueNeonTemplate = React.memo(BlueNeonInner)
