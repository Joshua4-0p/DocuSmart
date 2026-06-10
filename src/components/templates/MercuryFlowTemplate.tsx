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

function MercuryFlowInner({ state, scale = 1 }: Props) {
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
    textTransform: 'uppercase', letterSpacing: '2px', color: accent,
    marginBottom: `${Math.round(8 * sp)}px`, marginTop: `${Math.round(18 * sp)}px`,
    paddingBottom: '4px', borderBottom: `1.5px solid ${hexWithAlpha(accent, 0.3)}`,
  }
  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: '#1a1a1a' }
  const entryMeta: React.CSSProperties = { fontSize: '8.5pt', color: '#666', margin: '0 0 3px' }
  const dateStyle: React.CSSProperties = { fontSize: '8pt', color: '#999', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: '2px', lineHeight: '1.45' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#444', lineHeight: '1.55', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="mercury-flow-template" data-photo-enabled="true" style={{ fontFamily: fonts.body, minHeight: '297mm', width: '210mm', boxSizing: 'border-box', background: '#fff', padding: `${Math.round(40 * sp)}px ${Math.round(48 * sp)}px` }}>

        {/* Header: name left, photo right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: `${Math.round(16 * sp)}px` }}>
          <div style={{ flex: 1, paddingRight: '20px' }}>
            <p style={{ fontFamily: fonts.heading, fontSize: '24pt', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px', lineHeight: '1.05', letterSpacing: '-0.3px' }}>
              {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
            </p>
            {p?.professionalTitle && (
              <p style={{ fontSize: '11pt', color: accent, fontWeight: '600', margin: '0 0 10px', fontFamily: fonts.heading }}>{p.professionalTitle}</p>
            )}
            {/* Contact row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 14px', fontSize: '8.5pt', color: '#666' }}>
              {p?.phone && <span>{p.phone}</span>}
              {p?.city && <span>{p.city}{p.country ? `, ${p.country}` : ''}</span>}
              {p?.linkedinUrl && <span>{p.linkedinUrl.replace('https://', '')}</span>}
              {p?.websiteUrl && <span>{p.websiteUrl.replace('https://', '')}</span>}
            </div>
          </div>

          {/* Photo */}
          {p?.avatarUrl ? (
            <img src={p.avatarUrl} alt="Profile" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `3px solid ${hexWithAlpha(accent, 0.3)}` }} />
          ) : (
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: hexWithAlpha(accent, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22pt', fontWeight: '700', color: accent, fontFamily: fonts.heading, flexShrink: 0, border: `2px solid ${hexWithAlpha(accent, 0.2)}` }}>
              {p?.firstName?.[0] ?? '?'}{p?.lastName?.[0] ?? ''}
            </div>
          )}
        </div>

        {/* Accent divider */}
        <div style={{ height: '2px', background: `linear-gradient(to right, ${accent}, ${hexWithAlpha(accent, 0.1)})`, marginBottom: `${Math.round(4 * sp)}px` }} />

        {/* Sections */}
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
                      <div key={exp.id} style={{ display: 'flex', gap: '16px', marginBottom: `${Math.round(12 * sp)}px` }}>
                        {/* Date column */}
                        <div style={{ minWidth: '80px', paddingTop: '2px', textAlign: 'right' }}>
                          <span style={{ fontSize: '7.5pt', color: '#999', lineHeight: '1.5' }}>
                            {fmt(exp.startDate)}<br />–<br />{exp.ongoing ? 'Present' : fmt(exp.endDate)}
                          </span>
                        </div>
                        {/* Content */}
                        <div style={{ flex: 1, borderLeft: `2px solid ${hexWithAlpha(accent, 0.2)}`, paddingLeft: '12px' }}>
                          <p style={entryTitle}>{exp.jobTitle}</p>
                          <p style={entryMeta}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                          {bullets.length > 0 && <ul style={bulletList}>{bullets.map((b, i) => <li key={i} style={bulletItem}>{b.replace(/^[•\-]\s*/, '')}</li>)}</ul>}
                        </div>
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
                    <div key={edu.id} style={{ display: 'flex', gap: '16px', marginBottom: `${Math.round(10 * sp)}px` }}>
                      <div style={{ minWidth: '80px', textAlign: 'right' }}>
                        <span style={{ fontSize: '7.5pt', color: '#999' }}>{fmt(edu.startDate)}<br />–<br />{edu.ongoing ? 'Present' : fmt(edu.endDate)}</span>
                      </div>
                      <div style={{ flex: 1, borderLeft: `2px solid ${hexWithAlpha(accent, 0.2)}`, paddingLeft: '12px' }}>
                        <p style={entryTitle}>{getDegreeLabel(edu)} in {edu.fieldOfStudy}</p>
                        <p style={entryMeta}>{edu.institution}{edu.city ? `, ${edu.city}` : ''}</p>
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
                      <span key={sk.id} style={{ display: 'inline-block', background: hexWithAlpha(accent, 0.08), border: `1px solid ${hexWithAlpha(accent, 0.25)}`, borderRadius: '4px', padding: '2px 8px', fontSize: '8.5pt', color: accent }}>
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
                      <span key={lang.id} style={{ fontSize: '9pt', color: '#333' }}>{lang.language} <span style={{ color: '#999' }}>({lang.level})</span></span>
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
                      <p style={{ ...para, margin: 0 }}>{c.name} — <span style={{ color: '#888' }}>{c.issuingOrg}</span></p>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={entryTitle}>{proj.name}</p>
                        {proj.startDate && <span style={dateStyle}>{fmt(proj.startDate)}</span>}
                      </div>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={entryTitle}>{vol.role}</p>
                          <p style={entryMeta}>{vol.organisation}</p>
                        </div>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

export const MercuryFlowTemplate = React.memo(MercuryFlowInner)
