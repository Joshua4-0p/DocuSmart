import * as React from 'react'
import type { BuilderState } from '../../types/document'
import { getProfileSnapshot } from '../../lib/api/profile.api'

interface HorizonProps {
  state: BuilderState
  scale?: number
}

const s = {
  page: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '10pt',
    lineHeight: '1.45',
    color: '#1a1a1a',
    background: '#ffffff',
    padding: '40px 48px',
    minHeight: '297mm',
    width: '210mm',
    boxSizing: 'border-box' as const,
  },
  header: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2.5px solid #378ADD',
  },
  name: {
    fontSize: '22pt',
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: '-0.3px',
    margin: '0 0 3px',
  },
  title: {
    fontSize: '11pt',
    color: '#378ADD',
    fontWeight: '600',
    margin: '0 0 10px',
  },
  contactRow: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '4px 16px',
    fontSize: '8.5pt',
    color: '#555',
  },
  sectionTitle: {
    fontSize: '8.5pt',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.2px',
    color: '#378ADD',
    borderBottom: '1px solid #dde8f5',
    paddingBottom: '3px',
    marginBottom: '10px',
    marginTop: '18px',
  },
  entryHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
  },
  entryTitle: {
    fontSize: '10pt',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 1px',
  },
  entrySubtitle: {
    fontSize: '9pt',
    color: '#555',
    margin: '0 0 4px',
  },
  entryDate: {
    fontSize: '8.5pt',
    color: '#888',
    whiteSpace: 'nowrap' as const,
  },
  bullet: {
    margin: '0',
    paddingLeft: '14px',
    listStyleType: 'disc' as const,
  },
  bulletItem: {
    fontSize: '9pt',
    color: '#333',
    marginBottom: '2px',
    lineHeight: '1.4',
  },
  skillChip: {
    display: 'inline-block' as const,
    background: '#f0f6ff',
    border: '1px solid #dde8f5',
    borderRadius: '3px',
    padding: '1px 7px',
    fontSize: '8.5pt',
    color: '#378ADD',
    margin: '2px 3px 2px 0',
  },
  paragraph: {
    fontSize: '9pt',
    color: '#333',
    lineHeight: '1.5',
    margin: '0',
  },
  twoCol: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr' as const,
    gap: '0 24px',
  },
}

function fmt(date?: string): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={s.sectionTitle}>{title}</div>
      {children}
    </div>
  )
}

export function HorizonTemplate({ state, scale = 1 }: HorizonProps) {
  const profile = getProfileSnapshot()
  const { selectedSections, sectionOrder, generatedContent } = state

  const personal = profile.personal
  const isIncluded = (key: string) => selectedSections.includes(key)

  // Sort sections by user-defined order
  const orderedSections = sectionOrder.filter(
    (s) => isIncluded(s) && s !== 'personal' && s !== 'summary',
  )

  // Detect graduate ordering (FR-030)
  const totalExpYears = profile.experience.reduce((acc, exp) => {
    const start = exp.startDate ? new Date(exp.startDate).getFullYear() : 0
    const end = exp.endDate ? new Date(exp.endDate).getFullYear() : new Date().getFullYear()
    return acc + (end - start)
  }, 0)
  const isGraduate = totalExpYears < 3

  const sortedSections = isGraduate
    ? orderedSections.sort((a, b) => {
        if (a === 'education' && b === 'experience') return -1
        if (a === 'experience' && b === 'education') return 1
        return 0
      })
    : orderedSections

  const summary = generatedContent['summary'] ?? personal?.summary ?? ''

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: scale !== 1 ? `${100 / scale}%` : undefined,
      }}
    >
      <div style={s.page} id="horizon-template">
        {/* Header */}
        {personal && (
          <div style={s.header}>
            <p style={s.name}>
              {personal.firstName} {personal.lastName}
            </p>
            {personal.professionalTitle && (
              <p style={s.title}>{personal.professionalTitle}</p>
            )}
            <div style={s.contactRow}>
              {personal.phone && <span>{personal.phone}</span>}
              {personal.city && <span>{personal.city}{personal.country ? `, ${personal.country}` : ''}</span>}
              {personal.linkedinUrl && <span>{personal.linkedinUrl.replace('https://', '')}</span>}
              {personal.websiteUrl && <span>{personal.websiteUrl.replace('https://', '')}</span>}
              {personal.githubUrl && <span>{personal.githubUrl.replace('https://github.com/', 'github.com/')}</span>}
              {personal.cameroonian && personal.nationality && (
                <span>Nationality: {personal.nationality}</span>
              )}
            </div>
          </div>
        )}
        {!personal && (
          <div style={s.header}>
            <p style={s.name}>Your Name</p>
            <p style={s.title}>Professional Title</p>
          </div>
        )}

        {/* Summary */}
        {isIncluded('summary') && summary && (
          <Section title="Professional Summary">
            <p style={s.paragraph}>{summary}</p>
          </Section>
        )}

        {/* Dynamic sections */}
        {sortedSections.map((sectionKey) => {
          switch (sectionKey) {
            case 'experience':
              return profile.experience.length > 0 ? (
                <Section key="experience" title="Work Experience">
                  {profile.experience.map((exp) => {
                    const bullets = generatedContent[`exp-${exp.id}`]
                      ? generatedContent[`exp-${exp.id}`].split('\n').filter(Boolean)
                      : exp.description
                        ? exp.description.split('\n').filter(Boolean)
                        : exp.achievements

                    return (
                      <div key={exp.id} style={{ marginBottom: '12px' }}>
                        <div style={s.entryHeader}>
                          <div>
                            <p style={s.entryTitle}>{exp.jobTitle}</p>
                            <p style={s.entrySubtitle}>
                              {exp.company}
                              {exp.location ? ` · ${exp.location}` : ''}
                              {exp.remote ? ' · Remote' : ''}
                            </p>
                          </div>
                          <span style={s.entryDate}>
                            {fmt(exp.startDate)} – {exp.ongoing ? 'Present' : fmt(exp.endDate)}
                          </span>
                        </div>
                        {bullets.length > 0 && (
                          <ul style={s.bullet}>
                            {bullets.map((b, i) => (
                              <li key={i} style={s.bulletItem}>{b.replace(/^[•\-]\s*/, '')}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </Section>
              ) : null

            case 'education':
              return profile.education.length > 0 ? (
                <Section key="education" title="Education">
                  {profile.education.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: '10px' }}>
                      <div style={s.entryHeader}>
                        <div>
                          <p style={s.entryTitle}>
                            {edu.degreeType.toUpperCase()} in {edu.fieldOfStudy}
                          </p>
                          <p style={s.entrySubtitle}>
                            {edu.institution}
                            {edu.city ? `, ${edu.city}` : ''}
                            {edu.country ? `, ${edu.country}` : ''}
                          </p>
                        </div>
                        <span style={s.entryDate}>
                          {fmt(edu.startDate)} – {edu.ongoing ? 'Present' : fmt(edu.endDate)}
                        </span>
                      </div>
                      {edu.showGpa && edu.gpa && (
                        <p style={{ ...s.entrySubtitle, fontSize: '8.5pt' }}>GPA: {edu.gpa}</p>
                      )}
                      {edu.description && <p style={s.paragraph}>{edu.description}</p>}
                      {edu.honors.length > 0 && (
                        <p style={{ ...s.paragraph, fontStyle: 'italic' }}>
                          Honours: {edu.honors.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </Section>
              ) : null

            case 'skills': {
              if (!profile.skills.length) return null
              const techSkills = profile.skills.filter((s) =>
                ['programming', 'tools', 'frameworks', 'technical', undefined].includes(
                  s.category?.toLowerCase(),
                ),
              )
              const softSkills = profile.skills.filter(
                (s) => s.category?.toLowerCase() === 'soft',
              )
              const others = profile.skills.filter(
                (s) => !techSkills.includes(s) && !softSkills.includes(s),
              )
              return (
                <Section key="skills" title="Skills">
                  <div>
                    {techSkills.length > 0 && (
                      <div style={{ marginBottom: '4px' }}>
                        {techSkills.map((sk) => (
                          <span key={sk.id} style={s.skillChip}>{sk.name}</span>
                        ))}
                      </div>
                    )}
                    {softSkills.length > 0 && (
                      <div style={{ marginBottom: '4px' }}>
                        {softSkills.map((sk) => (
                          <span key={sk.id} style={{ ...s.skillChip, background: '#f5f5f0', color: '#555', borderColor: '#ddd' }}>{sk.name}</span>
                        ))}
                      </div>
                    )}
                    {others.length > 0 && (
                      <div>
                        {others.map((sk) => (
                          <span key={sk.id} style={s.skillChip}>{sk.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Section>
              )
            }

            case 'projects':
              return profile.projects.length > 0 ? (
                <Section key="projects" title="Projects">
                  {profile.projects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: '10px' }}>
                      <div style={s.entryHeader}>
                        <div>
                          <p style={s.entryTitle}>
                            {proj.name}
                            {proj.status === 'ongoing' ? ' (Ongoing)' : ''}
                          </p>
                          {proj.technologies.length > 0 && (
                            <p style={{ ...s.entrySubtitle, fontSize: '8.5pt' }}>
                              {proj.technologies.join(', ')}
                            </p>
                          )}
                        </div>
                        {proj.startDate && (
                          <span style={s.entryDate}>
                            {fmt(proj.startDate)}{proj.endDate ? ` – ${fmt(proj.endDate)}` : ''}
                          </span>
                        )}
                      </div>
                      {proj.description && <p style={s.paragraph}>{proj.description}</p>}
                    </div>
                  ))}
                </Section>
              ) : null

            case 'certifications':
              return profile.certifications.length > 0 ? (
                <Section key="certifications" title="Certifications">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} style={{ marginBottom: '6px' }}>
                      <div style={s.entryHeader}>
                        <div>
                          <p style={s.entryTitle}>{cert.name}</p>
                          <p style={s.entrySubtitle}>{cert.issuingOrg}</p>
                        </div>
                        <span style={s.entryDate}>{fmt(cert.dateIssued)}</span>
                      </div>
                    </div>
                  ))}
                </Section>
              ) : null

            case 'languages':
              return profile.languages.length > 0 ? (
                <Section key="languages" title="Languages">
                  <div style={s.twoCol}>
                    {profile.languages.map((lang) => (
                      <div key={lang.id} style={{ marginBottom: '4px' }}>
                        <span style={{ fontWeight: '600', fontSize: '9pt' }}>{lang.language}</span>
                        <span style={{ ...s.entryDate, marginLeft: '6px' }}>{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null

            case 'volunteer':
              return profile.volunteer.length > 0 ? (
                <Section key="volunteer" title="Volunteer Work">
                  {profile.volunteer.map((vol) => (
                    <div key={vol.id} style={{ marginBottom: '10px' }}>
                      <div style={s.entryHeader}>
                        <div>
                          <p style={s.entryTitle}>{vol.role}</p>
                          <p style={s.entrySubtitle}>{vol.organisation}</p>
                        </div>
                        <span style={s.entryDate}>
                          {fmt(vol.startDate)} – {vol.ongoing ? 'Present' : fmt(vol.endDate)}
                        </span>
                      </div>
                      {vol.description && <p style={s.paragraph}>{vol.description}</p>}
                    </div>
                  ))}
                </Section>
              ) : null

            case 'publications':
              return profile.publications.length > 0 ? (
                <Section key="publications" title="Publications">
                  {profile.publications.map((pub) => (
                    <div key={pub.id} style={{ marginBottom: '8px' }}>
                      <p style={s.entryTitle}>{pub.title}</p>
                      <p style={s.entrySubtitle}>
                        {pub.authors.join(', ')} — {pub.publication}, {fmt(pub.date)}
                      </p>
                    </div>
                  ))}
                </Section>
              ) : null

            case 'references': {
              if (!profile.references.length) return null
              const includeRefs = generatedContent['references-mode'] !== 'on-request'
              return (
                <Section key="references" title="References">
                  {includeRefs ? (
                    <div style={s.twoCol}>
                      {profile.references.map((ref) => (
                        <div key={ref.id} style={{ marginBottom: '8px' }}>
                          <p style={s.entryTitle}>{ref.name}</p>
                          <p style={s.entrySubtitle}>{ref.jobTitle} · {ref.company}</p>
                          <p style={{ ...s.paragraph, color: '#888' }}>{ref.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={s.paragraph}>References available upon request.</p>
                  )}
                </Section>
              )
            }

            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
