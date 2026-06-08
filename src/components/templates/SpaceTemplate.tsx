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

function SpaceInner({ state, scale = 1 }: Props) {
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

  const bg = '#0a0e1a'
  const cardBg = '#111827'
  const textPrimary = '#f0f4ff'
  const textMuted = '#6b7db3'

  const sectionHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '7.5pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '3px', color: accent,
    marginBottom: `${Math.round(10 * sp)}px`, marginTop: `${Math.round(20 * sp)}px`,
    display: 'flex', alignItems: 'center', gap: '10px',
  }
  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: textPrimary }
  const entryMeta: React.CSSProperties = { fontSize: '8.5pt', color: textMuted, margin: '0 0 3px' }
  const dateStyle: React.CSSProperties = { fontSize: '8pt', color: hexWithAlpha(accent, 0.6), whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#a0aec0', marginBottom: '2px', lineHeight: '1.45' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#a0aec0', lineHeight: '1.55', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="space-template" data-photo-enabled="true" style={{ fontFamily: fonts.body, minHeight: '297mm', width: '210mm', boxSizing: 'border-box', background: bg, padding: `${Math.round(32 * sp)}px ${Math.round(40 * sp)}px` }}>

        {/* Header: photo centered above name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: `${Math.round(20 * sp)}px` }}>
          {/* Photo with accent glow */}
          {p?.avatarUrl ? (
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <div style={{ position: 'absolute', inset: '-5px', borderRadius: '50%', background: `radial-gradient(circle, ${hexWithAlpha(accent, 0.4)} 0%, transparent 70%)` }} />
              <img src={p.avatarUrl} alt="Profile" style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: `2px solid ${hexWithAlpha(accent, 0.6)}` }} />
            </div>
          ) : (
            <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: `radial-gradient(circle, ${hexWithAlpha(accent, 0.2)} 0%, transparent 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24pt', fontWeight: '700', color: accent, fontFamily: fonts.heading, border: `2px solid ${hexWithAlpha(accent, 0.5)}`, marginBottom: '14px' }}>
              {p?.firstName?.[0] ?? '?'}{p?.lastName?.[0] ?? ''}
            </div>
          )}
          <p style={{ fontFamily: fonts.heading, fontSize: '22pt', fontWeight: '700', color: textPrimary, margin: '0 0 4px', letterSpacing: '0.5px' }}>
            {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
          </p>
          {p?.professionalTitle && (
            <p style={{ fontSize: '10pt', color: accent, fontWeight: '500', margin: '0 0 8px', fontFamily: fonts.heading, letterSpacing: '0.3px' }}>{p.professionalTitle}</p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3px 14px', fontSize: '8pt', color: textMuted }}>
            {p?.phone && <span>{p.phone}</span>}
            {p?.city && <span>{p.city}{p.country ? `, ${p.country}` : ''}</span>}
            {p?.linkedinUrl && <span>{p.linkedinUrl.replace('https://', '')}</span>}
            {p?.websiteUrl && <span>{p.websiteUrl.replace('https://', '')}</span>}
          </div>
        </div>

        {/* Starfield rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: `${Math.round(6 * sp)}px` }}>
          <div style={{ flex: 1, height: '1px', background: hexWithAlpha(accent, 0.25) }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: accent }} />
          <div style={{ width: '2px', height: '2px', borderRadius: '50%', background: hexWithAlpha(accent, 0.5) }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: accent }} />
          <div style={{ flex: 1, height: '1px', background: hexWithAlpha(accent, 0.25) }} />
        </div>

        {/* Sections in card */}
        <div style={{ background: cardBg, borderRadius: '6px', padding: `${Math.round(16 * sp)}px ${Math.round(22 * sp)}px`, border: `1px solid ${hexWithAlpha(accent, 0.12)}` }}>
          {ordered.map((key) => {
            switch (key) {
              case 'summary':
                return summary ? (
                  <div key="summary">
                    <div style={sectionHead}>{labels.summary}<span style={{ flex: 1, height: '1px', background: hexWithAlpha(accent, 0.18) }} /></div>
                    <p style={para}>{summary}</p>
                  </div>
                ) : null
              case 'experience':
                return profile.experience.length > 0 ? (
                  <div key="exp">
                    <div style={sectionHead}>{labels.experience}<span style={{ flex: 1, height: '1px', background: hexWithAlpha(accent, 0.18) }} /></div>
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
                    <div style={sectionHead}>{labels.education}<span style={{ flex: 1, height: '1px', background: hexWithAlpha(accent, 0.18) }} /></div>
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
              case 'skills':
                return profile.skills.length > 0 ? (
                  <div key="skills">
                    <div style={sectionHead}>{labels.skills}<span style={{ flex: 1, height: '1px', background: hexWithAlpha(accent, 0.18) }} /></div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {profile.skills.map((sk) => (
                        <span key={sk.id} style={{ display: 'inline-block', background: hexWithAlpha(accent, 0.1), border: `1px solid ${hexWithAlpha(accent, 0.3)}`, color: accent, padding: '2px 10px', fontSize: '8pt', borderRadius: '20px' }}>
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              case 'languages':
                return profile.languages.length > 0 ? (
                  <div key="lang">
                    <div style={sectionHead}>{labels.languages}<span style={{ flex: 1, height: '1px', background: hexWithAlpha(accent, 0.18) }} /></div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
                      {profile.languages.map((lang) => (
                        <span key={lang.id} style={{ fontSize: '9pt', color: textPrimary }}>{lang.language} <span style={{ color: textMuted }}>· {lang.level}</span></span>
                      ))}
                    </div>
                  </div>
                ) : null
              case 'certifications':
                return profile.certifications.length > 0 ? (
                  <div key="cert">
                    <div style={sectionHead}>{labels.certifications}<span style={{ flex: 1, height: '1px', background: hexWithAlpha(accent, 0.18) }} /></div>
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
                    <div style={sectionHead}>{labels.projects}<span style={{ flex: 1, height: '1px', background: hexWithAlpha(accent, 0.18) }} /></div>
                    {profile.projects.map((proj) => (
                      <div key={proj.id} style={{ marginBottom: `${Math.round(8 * sp)}px` }}>
                        <p style={entryTitle}>{proj.name}</p>
                        {proj.technologies.length > 0 && <p style={{ fontSize: '8pt', color: hexWithAlpha(accent, 0.85), margin: '0 0 2px' }}>{proj.technologies.join(' · ')}</p>}
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
  )
}

export const SpaceTemplate = React.memo(SpaceInner)
