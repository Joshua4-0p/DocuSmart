import * as React from 'react'
import { useParams } from 'react-router-dom'
import { FileText, Globe, ExternalLink } from 'lucide-react'
import { documentApi } from '@/lib/api/document.api'
import { authApi } from '@/lib/api/auth.api'
import type { DocDocument } from '@/lib/api/document.api'

interface ProfileUser {
  id: string
  name: string
  email: string
  username?: string
  avatarUrl?: string
  bio?: string
  profilePublic?: boolean
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [profileUser, setProfileUser] = React.useState<ProfileUser | null>(null)
  const [docs, setDocs] = React.useState<DocDocument[]>([])
  const [notFound, setNotFound] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!username) return
    // Resolve username → user via auth API
    authApi.getUserByUsername(username)
      .then(async (u: ProfileUser | null) => {
        if (!u || !u.profilePublic) {
          setNotFound(true)
          setLoading(false)
          return
        }
        setProfileUser(u)
        // Load only public documents for this user
        const allDocs = await documentApi.listByUser(u.id)
        setDocs(allDocs.filter((d: DocDocument) => d.isPublic))
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-sm space-y-3">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <Globe className="size-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Profile not found</h2>
          <p className="text-sm text-muted-foreground">
            This profile doesn't exist or hasn't been made public.
          </p>
          <a href="/" className="text-sm text-primary hover:underline">← Back to DocuSmart</a>
        </div>
      </div>
    )
  }

  const initials = profileUser.name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')

  return (
    <div className="min-h-screen bg-background">
      {/* Nav bar */}
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <a href="/" className="font-bold text-primary text-lg tracking-tight">DocuSmart</a>
        <a href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Create your profile →
        </a>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Profile header */}
        <div className="flex items-start gap-5 mb-8">
          {profileUser.avatarUrl ? (
            <img src={profileUser.avatarUrl} alt={profileUser.name} className="size-20 rounded-2xl object-cover" />
          ) : (
            <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{profileUser.name}</h1>
            <p className="text-muted-foreground text-sm">@{profileUser.username ?? username}</p>
            {profileUser.bio && <p className="mt-2 text-sm text-muted-foreground max-w-sm">{profileUser.bio}</p>}
          </div>
        </div>

        {/* Public documents */}
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Documents</h2>

        {docs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            No public documents yet.
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{doc.type.replace('_', ' ')}</p>
                </div>
                {doc.publicUrl && (
                  <a
                    href={doc.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline shrink-0"
                  >
                    View <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 px-6 py-6 text-center text-xs text-muted-foreground">
        Made with <a href="/" className="text-primary hover:underline">DocuSmart</a>
      </footer>
    </div>
  )
}
