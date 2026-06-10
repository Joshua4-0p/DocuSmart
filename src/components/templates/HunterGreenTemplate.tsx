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

function fmt(date?: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function HunterGreenInner({ state, scale = 1 }: Props) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent, language } = state
  const accent = resolveAccentColor(state.accentColor)
  const fonts = resolveFontPairing(state.fontPairing)
  const sp = resolveSpacingMultiplier(state.spacing)
  const labels = getSectionLabels(language ?? 'en')
  const p = profile.personal
  const isIncl = (k: string) => selectedSections.includes(k)
  const summary = generatedContent['summary'] ?? p?.summary ?? ''
  const mainSections = sectionOrder.filter(k => isIncl(k) && !['personal', 'skills', 'languages', 'certifications'].includes(k))

  const sideHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '7pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.6)',
    borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px',
    marginBottom: `${Math.round(8 * sp)}px`, marginTop: `${Math.round(14 * sp)}px`,
  }
  const mainHead: React.CSSProperties = {
    fontFamily: fonts.heading, fontSize: '8pt', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '1.5px', color: '#1a1a1a',
    borderBottom: `2px solid ${accent}`,
    paddingBottom: '4px', marginBottom: `${Math.round(8 * sp)}px`, marginTop: `${Math.round(18 * sp)}px`,
  }
  const entryTitle: React.CSSProperties = { fontFamily: fonts.heading, fontSize: '10pt', fontWeight: '600', margin: '0 0 1px', color: '#111' }
  const entryMeta: React.CSSProperties = { fontSize: '8.5pt', color: '#666', margin: '0 0 3px' }
  const dateStyle: React.CSSProperties = { fontSize: '8pt', color: '#999', whiteSpace: 'nowrap' }
  const bulletList: React.CSSProperties = { margin: '0', paddingLeft: '14px', listStyleType: 'disc' }
  const bulletItem: React.CSSProperties = { fontSize: '9pt', color: '#333', marginBottom: '2px', lineHeight: '1.4' }
  const para: React.CSSProperties = { fontSize: '9pt', color: '#444', lineHeight: '1.55', margin: '0' }

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: scale !== 1 ? `${100 / scale}%` : undefined }}>
      <div id="hunter-green-template" data-photo-enabled="true" style={{ fontFamily: fonts.body, display: 'flex', minHeight: '297mm', width: '210mm', boxSizing: 'border-box' }}>

        {/* Sidebar 32% */}
        <div style={{ width: '32%', background: accent, padding: `${Math.round(32 * sp)}px ${Math.round(16 * sp)}px`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Circular photo centered */}
          {p?.avatarUrl ? (
            <img src={p.avatarUrl} alt="Profile" style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.35)', marginBottom: `${Math.round(12 * sp)}px` }} />
          ) : (
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22pt', fontWeight: '700', color: 'rgba(255,255,255,0.65)', fontFamily: fonts.heading, marginBottom: `${Math.round(12 * sp)}px` }}>
              {p?.firstName?.[0] ?? '?'}{p?.lastName?.[0] ?? ''}
            </div>
          )}
          <p style={{ fontFamily: fonts.heading, fontSize: '12pt', fontWeight: '700', color: '#fff', margin: '0 0 3px', textAlign: 'center', lineHeight: '1.15' }}>
            {p ? `${p.firstName} ${p.lastName}` : 'Your Name'}
          </p>
          {p?.professionalTitle && (
            <p style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.75)', margin: '0 0 10px', textAlign: 'center', fontStyle: 'italic' }}>{p.professionalTitle}</p>
          )}

          <div style={sideHead}>Contact</div>
          <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.85)', lineHeight: '1.8', textAlign: 'center', wordBreak: 'break-all' }}>
            {p?.phone && <div>{p.phone}</div>}
            {p?.city && <div>{p.city}{p.country ? `, ${p.country}` : ''}</div>}
            {p?.linkedinUrl && <div>{p.linkedinUrl.replace('https://', '')}</div>}
            {p?.websiteUrl && <div>{p.websiteUrl.replace('https://', '')}</div>}
          </div>

          {isIncl('skills') && profile.skills.length > 0 && (
            <>
              <div style={sideHead}>{labels.skills}</div>
              <div style={{ width: '100%' }}>
                {profile.skills.slice(0, 9).map((sk) => (
                  <div key={sk.id} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '3px', padding: '3px 8px', marginBottom: '4px', fontSize: '7.5pt', color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                    {sk.name}
                  </div>
                ))}
              </div>
            </>
          )}

          {isIncl('languages') && profile.languages.length > 0 && (
            <>
              <div style={sideHead}>{labels.languages}</div>
              <div style={{ width: '100%' }}>
                {profile.languages.map((lang) => (
                  <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.9)' }}>{lang.language}</span>
                    <span style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.55)' }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {isIncl('certifications') && profile.certifications.length > 0 && (
            <>
              <div style={sideHead}>{labels.certifications}</div>
              {profile.certifications.slice(0, 4).map((c) => (
                <div key={c.id} style={{ marginBottom: '6px', width: '100%' }}>
                  <p style={{ fontSize: '7.5pt', fontWeight: '600', color: 'rgba(255,255,255,0.9)', margin: 0, textAlign: 'center' }}>{c.name}</p>
                  <p style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.6)', margin: 0, textAlign: 'center' }}>{c.issuingOrg}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Main 68% */}
        <div style={{ flex: 1, background: '#fff', padding: `${Math.round(32 * sp)}px ${Math.round(22 * sp)}px`, boxSizing: 'border-box' }}>
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
  )
}

export const HunterGreenTemplate = React.memo(HunterGreenInner)
